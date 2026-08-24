#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
skill_name="${1:-}"

if [[ -z "$skill_name" ]]; then
  echo "Usage: ./scripts/package-skill.sh <skill-name>" >&2
  exit 2
fi

if [[ ! "$skill_name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Invalid skill name: $skill_name" >&2
  exit 2
fi

skill_dir="$repo_root/skills/$skill_name"
archive_dir="$repo_root/dist"
archive_path="$archive_dir/$skill_name.zip"

if [[ ! -f "$skill_dir/SKILL.md" ]]; then
  echo "Skill not found: $skill_name" >&2
  exit 2
fi

if ! command -v zip >/dev/null 2>&1; then
  echo "The zip command is required to package a skill." >&2
  exit 1
fi

mkdir -p "$archive_dir"
rm -f "$archive_path"

(
  cd "$repo_root/skills"
  zip -q -r "$archive_path" "$skill_name" \
    -x "*/.DS_Store" "*/__pycache__/*" "*.pyc"
)

echo "Created $archive_path"
