#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
failures=0

required_root_files=(
  README.md
  CONTRIBUTING.md
  CHANGELOG.md
  GLOSSARY.md
  KNOWLEDGE-TAXONOMY.md
  PLATFORM-CURRENCY.md
  LICENSE
)

expected_skills=(
  shopify-store-audit
  shopify-cro
  shopify-product-page
  shopify-creative-strategy
  shopify-meta-ads
  shopify-google-ads
  shopify-seo
  shopify-email-marketing
  shopify-flow-automation
  shopify-support
  shopify-theme-development
  shopify-analytics
)

fail() {
  echo "FAIL: $*" >&2
  failures=$((failures + 1))
}

for file in "${required_root_files[@]}"; do
  [[ -f "$repo_root/$file" ]] || fail "missing root file $file"
done

for skill_name in "${expected_skills[@]}"; do
  skill_dir="$repo_root/skills/$skill_name"
  skill_file="$skill_dir/SKILL.md"

  if [[ ! -f "$skill_file" ]]; then
    fail "missing skills/$skill_name/SKILL.md"
    continue
  fi

  first_line="$(sed -n '1p' "$skill_file")"
  [[ "$first_line" == "---" ]] || fail "$skill_name frontmatter must start on line 1"

  declared_name="$(sed -n 's/^name:[[:space:]]*//p' "$skill_file" | head -n 1)"
  [[ "$declared_name" == "$skill_name" ]] || fail "$skill_name name does not match its folder"

  if [[ ! "$declared_name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    fail "$skill_name has an invalid Agent Skills name"
  fi

  description="$(sed -n 's/^description:[[:space:]]*//p' "$skill_file" | head -n 1)"
  if [[ -z "$description" ]]; then
    fail "$skill_name has no one-line description"
  elif (( ${#description} > 1024 )); then
    fail "$skill_name description exceeds 1024 characters"
  fi

  frontmatter_closers="$(sed -n '2,$p' "$skill_file" | grep -c '^---$' || true)"
  (( frontmatter_closers >= 1 )) || fail "$skill_name frontmatter is not closed"

  if grep -R -Eiq --include='*.md' '(^|[^A-Za-z])(TODO|TBD)([^A-Za-z]|$)|PLACEHOLDER[_:-]|lorem ipsum' "$skill_dir"; then
    fail "$skill_name contains unfinished placeholder text"
  fi

  if [[ -d "$skill_dir/references" ]]; then
    while IFS= read -r reference_file; do
      reference_name="references/$(basename "$reference_file")"
      grep -Fq "$reference_name" "$skill_file" || fail "$skill_name does not link $reference_name from SKILL.md"
    done < <(find "$skill_dir/references" -type f -name '*.md' -print | sort)

    while IFS= read -r linked_reference; do
      [[ -f "$skill_dir/$linked_reference" ]] || fail "$skill_name links missing $linked_reference"
    done < <(grep -Eo 'references/[A-Za-z0-9._-]+\.md' "$skill_file" | sort -u || true)
  fi
done

actual_skill_count="$(find "$repo_root/skills" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')"
if (( actual_skill_count != ${#expected_skills[@]} )); then
  fail "expected ${#expected_skills[@]} skill directories, found $actual_skill_count"
fi

if (( failures > 0 )); then
  echo "$failures validation failure(s)." >&2
  exit 1
fi

echo "Validated ${#expected_skills[@]} skills and repository contracts."
