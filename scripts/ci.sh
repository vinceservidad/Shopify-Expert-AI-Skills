#!/usr/bin/env bash
# Repository CI. Runs the same checks the former GitHub Actions workflows ran.
# Used locally and by Cloudflare Workers Builds (see docs/cloudflare-ci.md).
#
#   bash scripts/ci.sh                 # every stage
#   CI_STAGES="core plugin" bash scripts/ci.sh
#
# Stages:
#   core       Python tooling: unit tests, skill validation, evidence, packaging, worked examples
#   plugin     claude plugin validate --strict (needs the claude CLI; skipped with a notice if absent)
#   connector  connector/ typecheck, tests, build, plugin package runtime (skipped if connector/ is absent)
#   theme      Liquid rendering, theme check, browser checks (skipped per tool if Ruby/Chromium are absent)
#
# Writes a machine-readable summary to ${CI_REPORT:-dist/ci-report.json}.
# Exits non-zero if any stage fails. A skipped stage is reported, never counted as passed.
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
stages="${CI_STAGES:-core plugin connector theme}"
report="${CI_REPORT:-$root/dist/ci-report.json}"
venv="${CI_VENV:-$root/.ci-venv}"
python_bin="${PYTHON:-python3}"
results=()
failed=0

record() { # name status [detail]
  local detail="${3:-}"
  detail="${detail//\"/\'}"
  results+=("$(printf '{"stage":"%s","status":"%s","detail":"%s"}' "$1" "$2" "$detail")")
  printf '\n== %s: %s %s\n' "$1" "$2" "${detail:+($detail)}"
  [ "$2" = "failed" ] && failed=1
  return 0
}

run() { # label command...
  printf '\n-- %s\n' "$1"; shift
  "$@"
}

setup_python() {
  if [ ! -x "$venv/bin/python" ]; then
    "$python_bin" -m venv "$venv" || return 1
  fi
  "$venv/bin/python" -m pip install --quiet --disable-pip-version-check -r requirements-dev.txt || return 1
  export PATH="$venv/bin:$PATH"
}

stage_core() {
  setup_python || return 1
  run "shell syntax" bash -n scripts/validate-repository.sh scripts/package-skill.sh scripts/ci.sh &&
  run "regression tests" python -m unittest discover -s tests &&
  run "validate skills" bash scripts/validate-repository.sh &&
  run "recorded evidence integrity" python scripts/check_evaluation_evidence.py &&
  run "worked examples" python scripts/worked_examples.py &&
  run "package skills" python scripts/package_skill.py --all &&
  run "verify extracted archives" env PYTHONPATH=scripts python - <<'PY'
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile
from validate_repository import EXPECTED_SKILLS, validate_skill
archives = sorted(Path("dist").glob("*.zip"))
assert len(archives) == len(EXPECTED_SKILLS), f"Expected {len(EXPECTED_SKILLS)} skill archives, found {len(archives)}"
for archive in archives:
    with TemporaryDirectory() as temporary:
        with ZipFile(archive) as zipped:
            assert zipped.testzip() is None, archive
            zipped.extractall(temporary)
        errors = validate_skill(Path(temporary) / archive.stem)
        assert not errors, f"{archive}: {errors}"
print(f"Verified {len(archives)} standalone archives")
PY
  [ $? -eq 0 ] && run "skills-only plugin package" python scripts/package_plugin.py --target skills-only
}

stage_plugin() {
  local claude_cmd=(claude)
  if ! command -v claude >/dev/null 2>&1; then
    # Cloudflare build machines have npm but not Claude Code; fetch the pinned CLI.
    claude_cmd=(npx --yes "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION:-2.1.326}")
    "${claude_cmd[@]}" --version >/dev/null 2>&1 || { echo "claude CLI unavailable"; return 2; }
  fi
  run "claude plugin validate --strict" "${claude_cmd[@]}" plugin validate --strict .
}

stage_connector() {
  [ -f connector/package.json ] || { echo "connector/ not present"; return 2; }
  (cd connector &&
    run "npm ci" npm ci --no-audit --no-fund &&
    run "typecheck" npm run typecheck &&
    run "tests" npm test &&
    run "build" npm run build) || return 1
  setup_python || return 1
  run "local plugin package" python scripts/package_plugin.py &&
  (cd connector && run "package runtime" npm run test:package)
}

stage_theme() {
  local status=0 skipped=()
  run "example JavaScript syntax" node --check \
    skills/shopify-theme-development/assets/worked-example/theme/assets/skills-variant-picker.js || status=1
  if command -v ruby >/dev/null 2>&1 && command -v bundle >/dev/null 2>&1; then
    setup_python || return 1
    export BUNDLE_GEMFILE="$root/Gemfile.theme" BUNDLE_PATH="${CI_BUNDLE_PATH:-$root/.ci-bundle}"
    if BUNDLE_FROZEN=true run "theme gems" bundle install --quiet; then
      run "Liquid rendering" python -m unittest discover -s tests/theme || status=1
    else
      status=1
    fi
  else
    skipped+=("Liquid rendering: Ruby/Bundler missing")
  fi
  run "Shopify theme check" npx --yes @shopify/cli@4.1.0 theme check \
    --path skills/shopify-theme-development/assets/worked-example/theme --fail-level error --no-color || status=1
  if [ "${CI_BROWSER:-auto}" != "off" ] && setup_python &&
     python -m pip install --quiet --disable-pip-version-check -r requirements-browser.txt &&
     python -m playwright install chromium >/dev/null 2>&1; then
    run "browser checks" python -m unittest discover -s tests/browser -p 'check_*.py' || status=1
  else
    skipped+=("browser checks: Chromium unavailable")
  fi
  [ ${#skipped[@]} -gt 0 ] && printf 'Skipped: %s\n' "${skipped[@]}"
  [ $status -ne 0 ] && return 1
  [ ${#skipped[@]} -gt 0 ] && { SKIP_DETAIL="$(IFS='; '; echo "${skipped[*]}")"; return 3; }
  return 0
}

for stage in $stages; do
  SKIP_DETAIL=""
  output="$("stage_$stage" 2>&1)"; code=$?
  printf '%s\n' "$output"
  case $code in
    0) record "$stage" passed ;;
    2) record "$stage" skipped "$(printf '%s' "$output" | tail -n 1)" ;;
    3) record "$stage" partial "$SKIP_DETAIL" ;;
    *) record "$stage" failed "exit $code" ;;
  esac
done

mkdir -p "$(dirname "$report")"
commit="$(git rev-parse HEAD 2>/dev/null || echo "${WORKERS_CI_COMMIT_SHA:-unknown}")"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "${WORKERS_CI_BRANCH:-unknown}")"
{
  printf '{"commit":"%s","branch":"%s","finished_at":"%s","passed":%s,"stages":[' \
    "$commit" "$branch" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$([ $failed -eq 0 ] && echo true || echo false)"
  (IFS=,; printf '%s' "${results[*]}")
  printf ']}\n'
} > "$report"
printf '\nCI report: %s\n' "$report"
cat "$report"
exit $failed
