#!/usr/bin/env python3
"""Offline structure checks, not a claim about model behavior or platform support."""
from __future__ import annotations

import argparse
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

try:
    import yaml
except ImportError:
    raise SystemExit(
        "Missing PyYAML. Activate a virtual environment, then run "
        "python -m pip install -r requirements-dev.txt."
    )

REQUIRED_ROOT_FILES = (
    "README.md", "USAGE.md", "CONTRIBUTING.md", "CHANGELOG.md", "GLOSSARY.md",
    "KNOWLEDGE-TAXONOMY.md", "PLATFORM-CURRENCY.md", "LICENSE",
)
EXPECTED_SKILLS = (
    "shopify-va", "shopify-product-research", "shopify-product-listing",
    "shopify-catalog-operations", "shopify-merchandising", "shopify-order-operations",
    "shopify-va-training", "shopify-store-audit", "shopify-cro", "shopify-product-page",
    "shopify-creative-strategy", "shopify-meta-ads", "shopify-google-ads", "shopify-seo",
    "shopify-email-marketing", "shopify-flow-automation", "shopify-support",
    "shopify-theme-development", "shopify-analytics",
)
ALLOWED_FIELDS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
NAME = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*\Z")
# This is the repository's conservative policy, not the specification's 1024 limit.
DESCRIPTION_LIMIT = 200
PLACEHOLDER = re.compile(r"(?<![A-Za-z])(?:TODO|TBD)(?![A-Za-z])|PLACEHOLDER[_:-]|lorem ipsum", re.I)
MARKDOWN_LINK = re.compile(r"\[[^\]\n]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)")
REFERENCE_DEFINITION = re.compile(r"^\s{0,3}\[[^\]\n]+\]:\s*(?:<([^>]+)>|(\S+))", re.M)
RESOURCE_PATH = re.compile(r"(?<![\w/])(?:references|scripts|assets)/[A-Za-z0-9_./-]+\.[A-Za-z0-9]+")


class UniqueKeyLoader(yaml.SafeLoader):
    """Reject duplicate/non-string mapping keys instead of silently overwriting."""


def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str):
            raise yaml.constructor.ConstructorError(None, None, "mapping keys must be strings", key_node.start_mark)
        if key in result:
            raise yaml.constructor.ConstructorError(None, None, f"duplicate key: {key}", key_node.start_mark)
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueKeyLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def excluded(path: Path) -> bool:
    return ".DS_Store" in path.parts or "__pycache__" in path.parts or path.suffix == ".pyc"


def local_targets(text: str) -> set[str]:
    """Inline/reference-style Markdown links plus the repository's bare resource paths.

    External URLs and anchors are ignored. This intentionally is not a full Markdown
    renderer: anchors, generated links, and remote link health need separate review.
    """
    targets = {a or b for a, b in MARKDOWN_LINK.findall(text)}
    targets.update(a or b for a, b in REFERENCE_DEFINITION.findall(text))
    # Remove URLs before scanning bare paths, avoiding false local paths in URL tails.
    without_urls = re.sub(r"(?:https?://|//)[^\s<>]+", "", text)
    targets.update(RESOURCE_PATH.findall(without_urls))
    return {target for target in targets if target and not target.startswith("#")
            and not urlsplit(target).scheme and not target.startswith("//")}


def read_text(path: Path, errors: list[str]) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        errors.append(f"{path}: cannot read UTF-8 text ({exc})")
        return None


def validate_skill(skill_dir: Path) -> list[str]:
    errors: list[str] = []
    label = skill_dir.name
    if skill_dir.is_symlink() or not skill_dir.is_dir():
        return [f"{label}: skill must be a real directory, not a symlink"]
    root = skill_dir.resolve()
    files = sorted(skill_dir.rglob("*"))
    for path in files:
        if path.is_symlink():
            errors.append(f"{label}: symlinks are not allowed ({path.relative_to(skill_dir)})")
    if errors:
        return errors  # Never read through an untrusted symlink.
    entry = skill_dir / "SKILL.md"
    if not entry.is_file():
        return [f"{label}: missing SKILL.md"]
    text = read_text(entry, errors)
    if text is None:
        return errors
    lines = text.splitlines()
    if not lines or lines[0] != "---":
        return [f"{label}: frontmatter must start on line 1"]
    try:
        closing = lines.index("---", 1)
    except ValueError:
        return [f"{label}: frontmatter is not closed"]
    try:
        data = yaml.load("\n".join(lines[1:closing]), Loader=UniqueKeyLoader)
    except yaml.YAMLError as exc:
        return [f"{label}: invalid YAML: {exc}"]
    if not isinstance(data, dict):
        return [f"{label}: frontmatter must be a mapping"]
    for key in sorted(data.keys() - ALLOWED_FIELDS):
        errors.append(f"{label}: unsupported frontmatter field {key}")
    name = data.get("name")
    if not isinstance(name, str) or not 1 <= len(name) <= 64 or not NAME.fullmatch(name):
        errors.append(f"{label}: name must be 1-64 lowercase alphanumeric/hyphen characters")
    if name != label:
        errors.append(f"{label}: name does not match its folder")
    description = data.get("description")
    if not isinstance(description, str) or not description.strip():
        errors.append(f"{label}: description must be a non-empty string")
    elif len(description) > DESCRIPTION_LIMIT:
        errors.append(f"{label}: description exceeds the {DESCRIPTION_LIMIT}-character repository policy")
    for field in ("license", "compatibility", "allowed-tools"):
        if field in data and (not isinstance(data[field], str) or not data[field].strip()):
            errors.append(f"{label}: {field} must be a non-empty string")
    if isinstance(data.get("compatibility"), str) and len(data["compatibility"]) > 500:
        errors.append(f"{label}: compatibility exceeds 500 characters")
    if "metadata" in data:
        metadata = data["metadata"]
        if not isinstance(metadata, dict) or any(not isinstance(k, str) or not isinstance(v, str)
                                                for k, v in metadata.items()):
            errors.append(f"{label}: metadata must map strings to strings")
    body = "\n".join(lines[closing + 1:])
    if not body.strip():
        errors.append(f"{label}: skill instructions are empty")
    linked_from_entry: set[Path] = set()
    for path in files:
        if not path.is_file() or path.suffix.lower() != ".md" or excluded(path):
            continue
        content = body if path == entry else read_text(path, errors)
        if content is None:
            continue
        if PLACEHOLDER.search(content):
            errors.append(f"{label}: unfinished placeholder in {path.relative_to(skill_dir)}")
        for target in sorted(local_targets(content)):
            decoded = unquote(urlsplit(target).path)
            if not decoded:
                continue
            if Path(decoded).is_absolute():
                errors.append(f"{label}: absolute local links are not portable: {target}")
                continue
            candidate = (path.parent / decoded).resolve()
            if not candidate.is_relative_to(root):
                errors.append(f"{label}: link escapes standalone skill: {target}")
            elif excluded(candidate.relative_to(root)):
                errors.append(f"{label}: link targets a file excluded from packaging: {target}")
            elif not candidate.exists():
                errors.append(f"{label}: missing local reference {target} in {path.relative_to(skill_dir)}")
            elif path == entry:
                linked_from_entry.add(candidate)
    # Check references even when references/ is absent; link validation above is unconditional.
    for path in files:
        if path.is_file() and path.suffix.lower() == ".md" and "references" == path.relative_to(skill_dir).parts[0]:
            if path.resolve() not in linked_from_entry:
                errors.append(f"{label}: SKILL.md does not link {path.relative_to(skill_dir)}")
    return errors


def validate_repository(repo_root: Path) -> list[str]:
    errors: list[str] = []
    for filename in REQUIRED_ROOT_FILES:
        path = repo_root / filename
        if not path.is_file() or path.is_symlink():
            errors.append(f"missing or symlinked root file {filename}")
    skills = repo_root / "skills"
    if not skills.is_dir() or skills.is_symlink():
        return errors + ["missing or symlinked skills directory"]
    actual = {path.name for path in skills.iterdir() if path.is_dir() or path.is_symlink()}
    for name in sorted(actual - set(EXPECTED_SKILLS)):
        errors.append(f"unexpected skill directory {name}; update the catalog deliberately")
    for name in EXPECTED_SKILLS:
        errors.extend(validate_skill(skills / name))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    errors = validate_repository(args.root)
    for error in errors:
        print(f"FAIL: {error}", file=sys.stderr)
    if errors:
        print(f"{len(errors)} validation failure(s).", file=sys.stderr)
        return 1
    print(f"Validated {len(EXPECTED_SKILLS)} skills and repository structure. Behavioral evaluations are separate.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
