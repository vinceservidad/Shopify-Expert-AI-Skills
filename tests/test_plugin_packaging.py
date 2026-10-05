"""Plugin package integrity tests, separate from model behavior and live hosting."""
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch
from zipfile import ZipFile

import test_repository_tools as repository_tools

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from package_plugin import COMMON_TEMPLATES, LOCAL_TEMPLATES, package_plugin
from validate_repository import EXPECTED_SKILLS, validate_skill


class PluginPackagingTests(unittest.TestCase):
    def setUp(self):
        repository_tools.RepositoryToolsTests.setUp(self)
        for name in COMMON_TEMPLATES + LOCAL_TEMPLATES + ("README.skills-only.md",):
            target = self.root / "plugin" / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / "plugin" / name, target)
        self.bundle = self.root / "connector" / "build" / "plugin" / "connector.cjs"
        self.bundle.parent.mkdir(parents=True)
        self.bundle.write_text("// Synthetic build fixture. Not an MCP runtime.\n")
        (self.bundle.parent / "THIRD-PARTY-NOTICES.txt").write_text("Synthetic dependency license fixture.\n")
        (self.root / "docs").mkdir()
        shutil.copyfile(ROOT / "docs" / "plugin-and-connector.md", self.root / "docs" / "plugin-and-connector.md")

    def test_plugin_has_all_canonical_skills_and_runtime(self):
        with ZipFile(package_plugin(self.root)) as zipped, tempfile.TemporaryDirectory() as directory:
            self.assertIsNone(zipped.testzip())
            self.assertIn("server/connector.cjs", zipped.namelist())
            self.assertIn(".claude-plugin/plugin.json", zipped.namelist())
            self.assertIn("plugin.json", zipped.namelist())
            self.assertIn("LICENSE", zipped.namelist())
            self.assertIn("docs/plugin-and-connector.md", zipped.namelist())
            self.assertIn("server/THIRD-PARTY-NOTICES.txt", zipped.namelist())
            zipped.extractall(directory)
            for name in EXPECTED_SKILLS:
                self.assertEqual(validate_skill(Path(directory) / "skills" / name), [])
                self.assertEqual((Path(directory) / "skills" / name / "SKILL.md").read_bytes(),
                                 (self.root / "skills" / name / "SKILL.md").read_bytes())

    def test_archive_is_reproducible(self):
        before = package_plugin(self.root).read_bytes()
        self.assertEqual(package_plugin(self.root).read_bytes(), before)

    def test_skills_only_plugin_omits_local_runtime_and_mcp_config(self):
        with ZipFile(package_plugin(self.root, "skills-only")) as zipped:
            names = zipped.namelist()
            self.assertIn("plugin.json", names)
            self.assertIn("README.md", names)
            self.assertFalse(any(name.startswith("server/") for name in names))
            self.assertNotIn("mcp.json", names)
            self.assertNotIn(".mcp.json", names)
            self.assertNotIn("docs/plugin-and-connector.md", names)
            self.assertEqual(
                zipped.read("README.md"),
                (self.root / "plugin" / "README.skills-only.md").read_bytes(),
            )

    def test_skills_only_plugin_does_not_require_connector_build(self):
        self.bundle.unlink()
        archive = package_plugin(self.root, "skills-only")
        self.assertTrue(archive.is_file())

    def test_missing_build_blocks_packaging(self):
        self.bundle.unlink()
        with self.assertRaisesRegex(ValueError, "npm run build"):
            package_plugin(self.root)
        self.assertFalse((self.root / "dist").exists())

    def test_invalid_skill_preserves_previous_archive(self):
        archive = package_plugin(self.root)
        before = archive.read_bytes()
        self.entry.write_text("Invalid skill")
        with self.assertRaisesRegex(ValueError, "Plugin packaging blocked"):
            package_plugin(self.root)
        self.assertEqual(archive.read_bytes(), before)

    def test_failed_write_preserves_previous_archive(self):
        archive = package_plugin(self.root)
        before = archive.read_bytes()
        with patch("package_plugin.ZipFile.writestr", side_effect=OSError("simulated failure")):
            with self.assertRaises(OSError):
                package_plugin(self.root)
        self.assertEqual(archive.read_bytes(), before)
        self.assertEqual(list((self.root / "dist").iterdir()), [archive])

    def test_development_files_are_not_packaged(self):
        nested = self.skill / "node_modules"
        nested.mkdir()
        (nested / ".env").write_text("SYNTHETIC_SECRET=test")
        with ZipFile(package_plugin(self.root)) as zipped:
            self.assertFalse(any("node_modules" in name for name in zipped.namelist()))

    def test_template_parent_symlink_is_rejected(self):
        parent = self.root / "plugin" / ".claude-plugin"
        with tempfile.TemporaryDirectory() as directory:
            shutil.copyfile(parent / "plugin.json", Path(directory) / "plugin.json")
            shutil.rmtree(parent)
            parent.symlink_to(directory, target_is_directory=True)
            with self.assertRaisesRegex(ValueError, "Unsafe plugin source"):
                package_plugin(self.root)


if __name__ == "__main__":
    unittest.main()
