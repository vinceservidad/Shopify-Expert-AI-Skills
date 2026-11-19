# ShopifySkills v0.2.2

One plugin containing the 19 existing Shopify workflows. Public-source research
and work from supplied files do not require Shopify sign-in, an API key, Node,
or an MCP server in the skills-only profile.

## What changed since v0.2.0

- Store access setup, discount setup, Shopify Inbox answers, an owner approval
  matrix and plain-text client updates (0.2.1).
- Growth audit mode in `shopify-store-audit`: an outside-in snapshot and a full
  growth audit with a Now/Next/Later/Not now roadmap.
- Stricter rules found by plugin evals:
  - Catalog imports keep the export, dry-run diff and pilot even when asked to
    skip them.
  - Listings use visible placeholders instead of invented specifications.
  - Merchandising checks margin, returns and stock before sorting by revenue.
- Skill descriptions rewritten with the words VAs type, so the right skill loads
  more often.
- Privacy and terms pages, and the ShopifySkills icon in both plugin packages.

## Install once, then ask

- [Download ShopifySkills skills-only plugin](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/raw/refs/heads/main/releases/v0.2.2/shopify-va-toolkit-skills-only.plugin)
- [One-time native plugin installation](../../docs/ai-agent-setup.md#install-shopifyskills-once)

Claude Code users who installed from the marketplace get this version with
`claude plugin update shopify-va-toolkit@shopify-skills`.

## Optional alternatives

- `shopify-va-toolkit.plugin` retains the optional local read-only MCP runtime
  for supported connected hosts; it requires Node.js 24+ and separate approved
  Shopify credentials for private store reads.
- Individual `shopify-*.zip` files install one specialist where native Skills
  upload is supported.

No hosted Shopify connector is deployed by these archives.

## Verification and source

Built on November 19, 2026 with `python scripts/package_plugin.py` (both
targets) and `python scripts/package_skill.py --all` from the branch for
[PR #23](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/pull/23). No
`v0.2.2` git tag exists yet.

- All 163 Python tests pass.
- `claude plugin validate --strict` (Claude Code 2.1.328) passes on the
  repository and on both extracted plugin packages.
- `claude plugin eval` results for the 21 cases are recorded in the pull request, not here.
  Those runs are short samples, not evidence of model task quality.

Installation in the Claude or ChatGPT apps was not re-verified for this release.

Every package has a SHA-256 entry in `SHA256SUMS`. After downloading files:

```sh
sha256sum -c SHA256SUMS
```
