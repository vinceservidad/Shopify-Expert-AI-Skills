#!/usr/bin/env python3
"""Validate before creating a deterministic standalone skill archive."""
from __future__ import annotations

import argparse
from pathlib import Path
import tempfile
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from validate_repository import EXPECTED_SKILLS, excluded, validate_repository


def package_skill(repo_root: Path, skill_name: str) -> Path:
    return package_skills(repo_root, (skill_name,))[0]


def package_skills(repo_root: Path, skill_names: tuple[str, ...]) -> list[Path]:
    """Validate the catalog once before writing any selected archive."""
    if not skill_names:
        raise ValueError("Select at least one skill")
    for skill_name in skill_names:
        if skill_name not in EXPECTED_SKILLS:
            raise ValueError(f"Unknown skill: {skill_name}")
    errors = validate_repository(repo_root)
    if errors:
        raise ValueError("Packaging blocked by repository validation:\n" + "\n".join(errors))
    destination = repo_root / "dist"
    if destination.is_symlink():
        raise ValueError("dist must not be a symlink")
    destination.mkdir(exist_ok=True)
    return [_write_archive(repo_root, skill_name, destination) for skill_name in skill_names]


def _write_archive(repo_root: Path, skill_name: str, destination: Path) -> Path:
    skill = repo_root / "skills" / skill_name
    archive = destination / f"{skill_name}.zip"
    # Build alongside the final file and replace only after a complete, checked write.
    with tempfile.NamedTemporaryFile(dir=destination, suffix=".zip", delete=False) as handle:
        temporary = Path(handle.name)
    try:
        with ZipFile(temporary, "w", compression=ZIP_DEFLATED) as output:
            sources = [(path.relative_to(skill), path) for path in sorted(skill.rglob("*"))
                       if path.is_file() and not excluded(path.relative_to(skill))]
            if not (skill / "LICENSE").exists():
                sources.append((Path("LICENSE"), repo_root / "LICENSE"))
            for relative, source in sorted(sources):
                if source.is_symlink():
                    raise ValueError(f"Refusing symlink: {source}")
                member = ZipInfo(f"{skill_name}/{relative.as_posix()}", date_time=(1980, 1, 1, 0, 0, 0))
                member.create_system = 3
                mode = 0o755 if source.stat().st_mode & 0o111 else 0o644
                member.external_attr = (0o100000 | mode) << 16
                member.compress_type = ZIP_DEFLATED
                output.writestr(member, source.read_bytes())
        with ZipFile(temporary) as check:
            if check.testzip() is not None:
                raise ValueError("Archive integrity check failed")
        temporary.replace(archive)
    finally:
        temporary.unlink(missing_ok=True)
    return archive


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    selection = parser.add_mutually_exclusive_group(required=True)
    selection.add_argument("skill", nargs="?", choices=EXPECTED_SKILLS)
    selection.add_argument("--all", action="store_true", help="Package all skills after one catalog validation")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        archives = package_skills(args.root, EXPECTED_SKILLS if args.all else (args.skill,))
    except (OSError, ValueError) as exc:
        parser.exit(1, f"ERROR: {exc}\n")
    for archive in archives:
        print(f"Created {archive}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
