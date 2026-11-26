# ShopifySkills v0.2.4

One plugin containing the 19 existing Shopify workflows. Public-source research
and work from supplied files do not require Shopify sign-in, an API key, Node,
or an MCP server in the skills-only profile.

## What changed since v0.2.2

- A 15-point copy quality check in the 10 skills that write customer or client
  copy: analytics, creative strategy, email marketing, Google Ads, Meta Ads,
  product listing, product page, SEO, support, and the Shopify VA coordinator.
  Each skill runs it as a separate pass before handoff. It removes patterns
  such as "it's not X, it's Y", question hooks, buzzwords, vague claims and
  em dashes in short copy.
- Creative hooks open with the result, the number or the product in use
  instead of a question.
- 10 new Shopify playbooks: official Flow recipes, Merchant Center Next and
  PMax, Meta Advantage+ and CAPI, multi-location routing and Markets, checkout
  extensibility and pixels, chargeback evidence, shipping and 3PL exceptions,
  launch, migration and BFCM readiness, app stack and reviews, and
  subscriptions and multichannel selling.
- Cursor and Antigravity plugin manifests.

## Install once, then ask

- [Download ShopifySkills skills-only plugin](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/raw/refs/heads/main/releases/v0.2.4/shopify-va-toolkit-skills-only.plugin)
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

Built on November 26, 2026 with `python scripts/package_plugin.py` (both
targets) and `python scripts/package_skill.py --all`. A second build produced
byte-identical files.

- All 195 Python tests pass, and `bash scripts/ci.sh` passes its core, plugin,
  connector and theme stages.
- `claude plugin validate --strict` (Claude Code 2.1.332) passes on the
  repository and on both extracted plugin packages.
- `claude plugin eval` was not run for this release.

Installation in the Claude or ChatGPT apps was not re-verified for this release.

Every package has a SHA-256 entry in `SHA256SUMS`. After downloading files:

```sh
sha256sum -c SHA256SUMS
```
