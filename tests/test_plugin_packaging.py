"""Plugin package integrity tests, separate from model behavior and live hosting."""
import json
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
        native = Path(".codex-plugin/plugin.json")
        (self.root / native).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / native, self.root / native)
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
            self.assertNotIn(".codex-plugin/plugin.json", zipped.namelist())
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

    def test_skills_only_native_manifest_discovers_all_canonical_skills(self):
        with ZipFile(package_plugin(self.root, "skills-only")) as zipped:
            native = json.loads(zipped.read(".codex-plugin/plugin.json"))
            self.assertEqual(
                zipped.read(".codex-plugin/plugin.json"),
                (self.root / ".codex-plugin/plugin.json").read_bytes(),
            )
            self.assertEqual(native["name"], "shopify-va-toolkit")
            skill_path = Path(native["skills"])
            self.assertFalse(skill_path.is_absolute())
            self.assertNotIn("..", skill_path.parts)
            discovered = {
                Path(name).parent.name for name in zipped.namelist()
                if Path(name).name == "SKILL.md" and Path(name).parent.parent == skill_path
            }
            self.assertEqual(discovered, set(EXPECTED_SKILLS))
            for name in discovered:
                self.assertEqual(
                    zipped.read((skill_path / name / "SKILL.md").as_posix()),
                    (self.root / "skills" / name / "SKILL.md").read_bytes(),
                )

    def test_skills_only_plugin_omits_local_runtime_and_mcp_config(self):
        with ZipFile(package_plugin(self.root, "skills-only")) as zipped:
            names = zipped.namelist()
            self.assertIn("plugin.json", names)
            self.assertIn("README.md", names)
            self.assertFalse(any(name.startswith("server/") for name in names))
            self.assertNotIn("mcp.json", names)
            self.assertNotIn(".mcp.json", names)
            self.assertNotIn("docs/plugin-and-connector.md", names)
            for manifest_path in ("plugin.json", ".claude-plugin/plugin.json", ".codex-plugin/plugin.json"):
                manifest = json.loads(zipped.read(manifest_path))
                for runtime_requirement in ("mcpServers", "mcp", "env", "auth", "authentication", "oauth"):
                    self.assertNotIn(runtime_requirement, manifest)
            self.assertEqual(
                zipped.read("README.md"),
                (self.root / "plugin" / "README.skills-only.md").read_bytes(),
            )

    def test_skills_only_plugin_does_not_require_connector_build(self):
        self.bundle.unlink()
        archive = package_plugin(self.root, "skills-only")
        self.assertTrue(archive.is_file())

    def test_invalid_local_mcp_config_preserves_previous_archive(self):
        archive = package_plugin(self.root)
        before = archive.read_bytes()
        for name in ("mcp.json", ".mcp.json"):
            with self.subTest(config=name):
                config = self.root / "plugin" / name
                original = config.read_text()
                config.write_text("not valid JSON")
                try:
                    with self.assertRaises(ValueError):
                        package_plugin(self.root)
                    self.assertEqual(archive.read_bytes(), before)
                finally:
                    config.write_text(original)

    def test_invalid_native_manifest_preserves_previous_skills_only_archive(self):
        archive = package_plugin(self.root, "skills-only")
        before = archive.read_bytes()
        (self.root / ".codex-plugin/plugin.json").write_text("not valid JSON")
        with self.assertRaises(ValueError):
            package_plugin(self.root, "skills-only")
        self.assertEqual(archive.read_bytes(), before)

    def test_local_plugin_does_not_depend_on_native_skills_only_manifest(self):
        before = package_plugin(self.root).read_bytes()
        native = self.root / ".codex-plugin/plugin.json"
        native.write_text("not valid JSON")
        self.assertEqual(package_plugin(self.root).read_bytes(), before)
        native.unlink()
        self.assertEqual(package_plugin(self.root).read_bytes(), before)

    def test_skills_only_plugin_ignores_local_mcp_configs(self):
        for name in ("mcp.json", ".mcp.json"):
            (self.root / "plugin" / name).write_text("not valid JSON")
        with ZipFile(package_plugin(self.root, "skills-only")) as zipped:
            self.assertNotIn("mcp.json", zipped.namelist())
            self.assertNotIn(".mcp.json", zipped.namelist())

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


class NativeMarketplaceTests(unittest.TestCase):
    """Catalog entries must install the same credential-free canonical skills."""

    def test_codex_marketplace_resolves_native_skills_plugin(self):
        catalog = json.loads((ROOT / ".agents/plugins/marketplace.json").read_text())
        self.assertEqual(catalog["name"], "shopify-skills")
        self.assertEqual(len(catalog["plugins"]), 1)
        entry = catalog["plugins"][0]
        self.assertEqual(entry["source"]["source"], "local")
        plugin_root = (ROOT / entry["source"]["path"]).resolve()
        self.assertEqual(plugin_root, ROOT)
        native = json.loads((plugin_root / ".codex-plugin/plugin.json").read_text())
        self.assertEqual(entry["name"], native["name"])
        self.assertEqual(native["interface"]["displayName"], "ShopifySkills")
        self.assert_canonical_skills_without_connection(plugin_root, native)

    def test_claude_marketplace_resolves_native_skills_plugin(self):
        catalog = json.loads((ROOT / ".claude-plugin/marketplace.json").read_text())
        self.assertEqual(catalog["name"], "shopify-skills")
        self.assertEqual(len(catalog["plugins"]), 1)
        entry = catalog["plugins"][0]
        plugin_root = (ROOT / entry["source"]).resolve()
        self.assertEqual(plugin_root, ROOT)
        native = json.loads((plugin_root / ".claude-plugin/plugin.json").read_text())
        self.assertEqual(entry["name"], native["name"])
        self.assert_canonical_skills_without_connection(plugin_root, native)

    def assert_canonical_skills_without_connection(self, plugin_root, manifest):
        skill_root = (plugin_root / manifest.get("skills", "./skills/")).resolve()
        self.assertEqual(skill_root, ROOT / "skills")
        self.assertEqual({path.parent.name for path in skill_root.glob("*/SKILL.md")}, set(EXPECTED_SKILLS))
        for requirement in ("mcpServers", "mcp", "env", "auth", "authentication", "oauth", "hooks"):
            self.assertNotIn(requirement, manifest)
        for filename in (".mcp.json", "mcp.json", ".env"):
            self.assertFalse((plugin_root / filename).exists())


if __name__ == "__main__":
    unittest.main()
