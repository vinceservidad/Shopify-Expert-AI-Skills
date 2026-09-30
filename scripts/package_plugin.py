#!/usr/bin/env python3
"""Build a self-contained plugin from canonical skills and the compiled MCP bundle."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import shutil
import tempfile
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from validate_repository import EXPECTED_SKILLS, excluded, private_file, validate_repository, validate_skill

PLUGIN_NAME = "shopify-va-toolkit"
TEMPLATES = ("plugin.json", "mcp.json", ".mcp.json", ".claude-plugin/plugin.json", "README.md")


def package_plugin(root: Path) -> Path:
    errors = validate_repository(root)
    if errors:
        raise ValueError("Plugin packaging blocked:\n" + "\n".join(errors))
    bundle = root / "connector" / "build" / "plugin" / "connector.cjs"
    if not bundle.is_file() or bundle.is_symlink():
        raise ValueError("Run npm ci and npm run build inside connector/ before packaging.")
    destination = root / "dist"
    if destination.is_symlink():
        raise ValueError("dist must not be a symlink")
    destination.mkdir(exist_ok=True)
    archive = destination / f"{PLUGIN_NAME}.plugin"
    with tempfile.TemporaryDirectory(dir=destination) as temporary:
        stage = Path(temporary) / PLUGIN_NAME
        stage.mkdir()
        sources = [(Path(name), root / "plugin" / name) for name in TEMPLATES]
        sources += [(Path("LICENSE"), root / "LICENSE"), (Path("server/connector.cjs"), bundle),
                    (Path("server/THIRD-PARTY-NOTICES.txt"), bundle.parent / "THIRD-PARTY-NOTICES.txt"),
                    (Path("docs/plugin-and-connector.md"), root / "docs" / "plugin-and-connector.md")]
        notices = bundle.with_suffix(".cjs.LEGAL.txt")
        if notices.exists():
            sources.append((Path("server/connector.cjs.LEGAL.txt"), notices))
        for name in EXPECTED_SKILLS:
            skill = root / "skills" / name
            sources.extend((Path("skills") / name / path.relative_to(skill), path)
                           for path in sorted(skill.rglob("*"))
                           if path.is_file() and not excluded(path.relative_to(skill)))
        for relative, source in sources:
            if (source.is_symlink() or private_file(source)
                    or not source.resolve().is_relative_to(root.resolve())
                    or any(parent.is_symlink() for parent in source.parents if parent != root and parent.is_relative_to(root))):
                raise ValueError(f"Unsafe plugin source: {relative}")
            target = stage / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
        manifest = json.loads((stage / "plugin.json").read_text())
        if manifest.get("name") != PLUGIN_NAME:
            raise ValueError("Plugin name mismatch")
        for name in EXPECTED_SKILLS:
            failures = validate_skill(stage / "skills" / name)
            if failures:
                raise ValueError("\n".join(failures))
        for filename in ("mcp.json", ".mcp.json", ".claude-plugin/plugin.json"):
            json.loads((stage / filename).read_text())
        zipped = Path(temporary) / archive.name
        with ZipFile(zipped, "w") as output:
            for source in sorted(stage.rglob("*")):
                if not source.is_file():
                    continue
                member = ZipInfo(source.relative_to(stage).as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
                member.create_system = 3
                member.external_attr = 0o100644 << 16
                member.compress_type = ZIP_DEFLATED
                output.writestr(member, source.read_bytes())
        with ZipFile(zipped) as check:
            if check.testzip() is not None:
                raise ValueError("Plugin integrity check failed")
        zipped.replace(archive)
    return archive


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        print(f"Created {package_plugin(args.root)}")
    except (OSError, ValueError) as error:
        parser.exit(1, f"ERROR: {error}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
