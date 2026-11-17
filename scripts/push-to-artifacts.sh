#!/usr/bin/env bash
# Push the current commit to the Cloudflare Artifacts CI mirror. Workers Builds
# then runs scripts/ci.sh on Cloudflare (see docs/cloudflare-ci.md).
#
#   bash scripts/push-to-artifacts.sh            # pushes HEAD to the same branch name
#   bash scripts/push-to-artifacts.sh main       # pushes HEAD to a named branch
#
# Requires the Cloudflare CLI (`npm install --global cf`) signed in with
# `cf auth login`, or CLOUDFLARE_API_TOKEN with Artifacts Edit.
# The write token is repo-scoped, lives 10 minutes, and is never printed.
set -euo pipefail

account="${CLOUDFLARE_ACCOUNT_ID:-622e7a897cbb7babda383df6c1474e02}"
namespace="${ARTIFACTS_NAMESPACE:-mkt-skills}"
repo="${ARTIFACTS_REPO:-shopify-expert-ai-skills}"
branch="${1:-$(git rev-parse --abbrev-ref HEAD)}"
remote="https://${account}.artifacts.cloudflare.net/git/${namespace}/${repo}.git"

if ! command -v cf >/dev/null 2>&1; then
  echo "Install the Cloudflare CLI first: npm install --global cf" >&2
  exit 2
fi
if [ "$branch" = "HEAD" ]; then
  echo "Detached HEAD: pass the branch name to push, e.g. bash scripts/push-to-artifacts.sh main" >&2
  exit 2
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "Note: uncommitted changes are not pushed; Workers Builds checks the last commit only." >&2
fi

if ! CLOUDFLARE_ACCOUNT_ID="$account" cf artifacts namespaces repos get "$repo" --namespace "$namespace" >/dev/null 2>&1; then
  echo "Creating Artifacts repository ${namespace}/${repo}"
  CLOUDFLARE_ACCOUNT_ID="$account" cf artifacts namespaces repos create "$namespace" \
    --name "$repo" --default-branch main \
    --description "CI mirror of vinceservidad/Shopify-Expert-AI-Skills" >/dev/null
fi

issued="$(CLOUDFLARE_ACCOUNT_ID="$account" cf artifacts namespaces tokens create "$namespace" \
  --repo "$repo" --scope write --ttl 600)"
token="$(printf '%s' "$issued" | python3 -c 'import json,sys
d=json.load(sys.stdin); d=d.get("result", d)
print(d.get("plaintext") or d.get("token") or "")')"
if [ -z "$token" ]; then
  echo "cf did not return an Artifacts token" >&2
  exit 1
fi

commit="$(git rev-parse HEAD)"
echo "Pushing ${commit} to ${namespace}/${repo} branch ${branch}"
git -c credential.helper= -c "http.extraHeader=Authorization: Bearer ${token}" \
  push --force "$remote" "HEAD:refs/heads/${branch}"
unset token issued
echo "Pushed. Workers Builds runs scripts/ci.sh for ${branch}; see docs/cloudflare-ci.md to read the result."
