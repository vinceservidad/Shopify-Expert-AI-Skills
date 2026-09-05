"""Synthetic regression tests for tooling. These are not model evaluations."""
from __future__ import annotations

from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from zipfile import ZipFile

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))
from validate_repository import EXPECTED_SKILLS, REQUIRED_ROOT_FILES, validate_repository, validate_skill
from package_skill import package_skill


class RepositoryToolsTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        for filename in REQUIRED_ROOT_FILES:
            (self.root / filename).write_text("Synthetic test fixture.\n", encoding="utf-8")
        for name in EXPECTED_SKILLS:
            skill = self.root / "skills" / name
            (skill / "references").mkdir(parents=True)
            (skill / "SKILL.md").write_text(
                f'---\nname: {name}\ndescription: Reviews Shopify evidence. Use for audits.\n'
                'license: MIT\nmetadata:\n  author: fixture\n  version: "0.1.0"\n---\n'
                '# Synthetic skill\nRead [guide](references/guide.md). Start read-only.\n',
                encoding="utf-8",
            )
            (skill / "references" / "guide.md").write_text("# Guide\nUse supplied facts.\n", encoding="utf-8")
        self.skill = self.root / "skills" / "shopify-analytics"
        self.entry = self.skill / "SKILL.md"

    def replace(self, old, new):
        self.entry.write_text(self.entry.read_text(encoding="utf-8").replace(old, new), encoding="utf-8")

    def assertInvalid(self, fragment):
        errors = validate_repository(self.root)
        self.assertTrue(errors, "Invalid fixture unexpectedly passed")
        self.assertIn(fragment, "\n".join(errors))

    def test_valid_repository(self):
        self.assertEqual(validate_repository(self.root), [])

    def test_invalid_yaml_colon(self):
        self.replace("description: Reviews Shopify evidence. Use for audits.", "description: Invalid: YAML")
        self.assertInvalid("invalid YAML")

    def test_metadata_is_number(self):
        self.replace('metadata:\n  author: fixture\n  version: "0.1.0"', 'metadata: 123')
        self.assertInvalid("metadata must map strings to strings")

    def test_missing_references_directory(self):
        shutil.rmtree(self.skill / "references")
        self.assertInvalid("missing local reference references/guide.md")

    def test_missing_reference_file(self):
        (self.skill / "references" / "guide.md").unlink()
        self.assertInvalid("missing local reference")

    def test_duplicate_frontmatter_key(self):
        self.replace("license: MIT", "license: MIT\nlicense: Apache-2.0")
        self.assertInvalid("duplicate key: license")

    def test_duplicate_metadata_key(self):
        self.replace("author: fixture", "author: fixture\n  author: other")
        self.assertInvalid("duplicate key: author")

    def test_metadata_numeric_value(self):
        self.replace('version: "0.1.0"', 'version: 1.0')
        self.assertInvalid("metadata must map strings to strings")

    def test_metadata_non_string_key(self):
        self.replace("author: fixture", "123: fixture")
        self.assertInvalid("mapping keys must be strings")

    def test_metadata_is_list(self):
        self.replace('metadata:\n  author: fixture\n  version: "0.1.0"', 'metadata: [fixture]')
        self.assertInvalid("metadata must map strings to strings")

    def test_missing_frontmatter_opening(self):
        self.entry.write_text(self.entry.read_text()[4:])
        self.assertInvalid("frontmatter must start on line 1")

    def test_missing_frontmatter_closing(self):
        self.replace('\n---\n# Synthetic', '\n# Synthetic')
        self.assertInvalid("frontmatter is not closed")

    def test_frontmatter_is_list(self):
        self.entry.write_text('---\n- name\n- description\n---\nInstructions.\n')
        self.assertInvalid("frontmatter must be a mapping")

    def test_unsafe_yaml_tag_is_rejected(self):
        self.replace("license: MIT", "license: !!python/object:builtins.object {}")
        self.assertInvalid("invalid YAML")

    def test_unknown_field(self):
        self.replace("license: MIT", "license: MIT\nunsupported: field")
        self.assertInvalid("unsupported frontmatter field")

    def test_name_mismatch(self):
        self.replace("name: shopify-analytics", "name: shopify-other")
        self.assertInvalid("name does not match its folder")

    def test_invalid_name(self):
        self.replace("name: shopify-analytics", "name: Shopify--Analytics")
        self.assertInvalid("name must be 1-64")

    def test_name_too_long(self):
        self.replace("name: shopify-analytics", "name: " + "a" * 65)
        self.assertInvalid("name must be 1-64")

    def test_description_missing(self):
        self.replace("description: Reviews Shopify evidence. Use for audits.\n", "")
        self.assertInvalid("description must be a non-empty string")

    def test_description_is_boolean(self):
        self.replace("description: Reviews Shopify evidence. Use for audits.", "description: true")
        self.assertInvalid("description must be a non-empty string")

    def test_description_is_empty(self):
        self.replace("description: Reviews Shopify evidence. Use for audits.", 'description: "  "')
        self.assertInvalid("description must be a non-empty string")

    def test_description_local_limit(self):
        self.replace("Reviews Shopify evidence. Use for audits.", "a" * 201)
        self.assertInvalid("200-character repository policy")

    def test_folded_description_supported(self):
        self.replace("description: Reviews Shopify evidence. Use for audits.", "description: >-\n  Reviews Shopify evidence.\n  Use for audits.")
        self.assertEqual(validate_repository(self.root), [])

    def test_compatibility_too_long(self):
        self.replace("license: MIT", "license: MIT\ncompatibility: " + "a" * 501)
        self.assertInvalid("compatibility exceeds 500")

    def test_optional_fields_are_strings(self):
        self.replace("license: MIT", "license: [MIT]")
        self.assertInvalid("license must be a non-empty string")

    def test_empty_instructions(self):
        self.replace('# Synthetic skill\nRead [guide](references/guide.md). Start read-only.', '')
        self.assertInvalid("skill instructions are empty")

    def test_placeholder(self):
        self.replace("Start read-only.", "TODO: write procedure.")
        self.assertInvalid("unfinished placeholder")

    def test_orphan_reference(self):
        (self.skill / "references" / "orphan.md").write_text("Unlinked guide.")
        self.assertInvalid("SKILL.md does not link references/orphan.md")

    def test_reference_style_link(self):
        self.replace("[guide](references/guide.md)", "[guide][g]")
        self.entry.write_text(self.entry.read_text() + '\n[g]: references/guide.md "Guide"\n')
        self.assertEqual(validate_repository(self.root), [])

    def test_link_inside_reference_checked(self):
        (self.skill / "references" / "guide.md").write_text("Read [missing](missing.md).")
        self.assertInvalid("missing local reference missing.md")

    def test_external_reference_url_not_treated_as_local(self):
        self.entry.write_text(self.entry.read_text() + '\n[Official](https://example.org/references/external.md)\n')
        self.assertEqual(validate_repository(self.root), [])

    def test_parent_relative_asset_inside_skill(self):
        (self.skill / "assets").mkdir()
        (self.skill / "assets" / "input.json").write_text('{}')
        (self.skill / "references" / "guide.md").write_text("Read [input](../assets/input.json).")
        self.assertEqual(validate_repository(self.root), [])

    def test_link_cannot_escape_package(self):
        self.entry.write_text(self.entry.read_text() + '\n[Outside](../../README.md)\n')
        self.assertInvalid("link escapes standalone skill")

    def test_absolute_local_link_rejected(self):
        target = (self.skill / "references" / "guide.md").as_posix()
        self.entry.write_text(self.entry.read_text() + f"\n[Absolute]({target})\n")
        self.assertInvalid("absolute local links are not portable")

    def test_percent_encoded_traversal(self):
        self.entry.write_text(self.entry.read_text() + '\n[Outside](%2e%2e/%2e%2e/README.md)\n')
        self.assertInvalid("link escapes standalone skill")

    def test_symlink_rejected(self):
        (self.skill / "secret.txt").symlink_to(self.root / "README.md")
        self.assertInvalid("symlinks are not allowed")

    def test_symlink_skill_directory(self):
        source = self.root / "outside-skill"
        self.skill.rename(source)
        self.skill.symlink_to(source, target_is_directory=True)
        self.assertInvalid("skill must be a real directory")

    def test_missing_root_file(self):
        (self.root / "LICENSE").unlink()
        self.assertInvalid("missing or symlinked root file LICENSE")

    def test_missing_skill(self):
        shutil.rmtree(self.skill)
        self.assertInvalid("skill must be a real directory")

    def test_unexpected_skill(self):
        (self.root / "skills" / "unplanned-skill").mkdir()
        self.assertInvalid("unexpected skill directory")

    def test_missing_skills_directory(self):
        shutil.rmtree(self.root / "skills")
        self.assertInvalid("missing or symlinked skills directory")

    def test_cli_exit_statuses(self):
        command = [sys.executable, str(SCRIPTS / "validate_repository.py"), "--root", str(self.root)]
        self.assertEqual(subprocess.run(command, capture_output=True).returncode, 0)
        self.replace("license: MIT", "license: [MIT]")
        self.assertNotEqual(subprocess.run(command, capture_output=True).returncode, 0)

    def test_package_layout_license_and_isolated_validation(self):
        archive = package_skill(self.root, self.skill.name)
        with ZipFile(archive) as zipped:
            self.assertIsNone(zipped.testzip())
            self.assertEqual(set(zipped.namelist()), {
                'shopify-analytics/SKILL.md', 'shopify-analytics/references/guide.md', 'shopify-analytics/LICENSE',
            })
            with tempfile.TemporaryDirectory() as extracted:
                zipped.extractall(extracted)
                self.assertEqual(validate_skill(Path(extracted) / self.skill.name), [])

    def test_package_ignores_noise(self):
        (self.skill / '.DS_Store').write_bytes(b'noise')
        (self.skill / '__pycache__').mkdir()
        (self.skill / '__pycache__' / 'noise.pyc').write_bytes(b'noise')
        with ZipFile(package_skill(self.root, self.skill.name)) as zipped:
            self.assertFalse(any('.DS_Store' in name or '__pycache__' in name for name in zipped.namelist()))

    def test_link_to_excluded_file_is_rejected(self):
        self.entry.write_text(self.entry.read_text() + '\n[Cached](cache.pyc)\n')
        (self.skill / 'cache.pyc').write_bytes(b'noise')
        self.assertInvalid("link targets a file excluded from packaging")

    def test_package_deterministic(self):
        first = package_skill(self.root, self.skill.name).read_bytes()
        self.assertEqual(first, package_skill(self.root, self.skill.name).read_bytes())

    def test_validation_failure_preserves_existing_archive(self):
        archive = package_skill(self.root, self.skill.name)
        before = archive.read_bytes()
        self.replace("license: MIT", "license: [MIT]")
        with self.assertRaisesRegex(ValueError, 'Packaging blocked'):
            package_skill(self.root, self.skill.name)
        self.assertEqual(before, archive.read_bytes())

    def test_write_failure_preserves_existing_archive(self):
        archive = package_skill(self.root, self.skill.name)
        before = archive.read_bytes()
        with patch('package_skill.ZipFile.writestr', side_effect=OSError('simulated write failure')):
            with self.assertRaises(OSError):
                package_skill(self.root, self.skill.name)
        self.assertEqual(before, archive.read_bytes())
        self.assertEqual(list((self.root / 'dist').iterdir()), [archive])

    def test_invalid_other_skill_blocks_package(self):
        (self.root / 'skills' / 'shopify-va' / 'SKILL.md').unlink()
        with self.assertRaisesRegex(ValueError, 'Packaging blocked'):
            package_skill(self.root, self.skill.name)
        self.assertFalse((self.root / 'dist').exists())

    def test_package_rejects_path_traversal_name(self):
        with self.assertRaisesRegex(ValueError, 'Unknown skill'):
            package_skill(self.root, '../README')
        self.assertFalse((self.root / 'dist').exists())

    def test_dist_symlink_rejected(self):
        (self.root / 'dist').symlink_to(self.root / 'skills', target_is_directory=True)
        with self.assertRaisesRegex(ValueError, 'dist must not be a symlink'):
            package_skill(self.root, self.skill.name)


if __name__ == '__main__':
    unittest.main()
