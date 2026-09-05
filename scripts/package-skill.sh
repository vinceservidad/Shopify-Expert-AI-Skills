#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python="${PYTHON:-python3}"
if ! command -v "$python" >/dev/null 2>&1; then
  echo "Python 3.11+ is required. See docs/reliability.md for setup." >&2
  exit 2
fi
exec "$python" "$repo_root/scripts/package_skill.py" "$@"
