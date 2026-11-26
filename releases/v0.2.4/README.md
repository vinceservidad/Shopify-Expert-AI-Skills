# ShopifySkills v0.2.4

One plugin containing the 19 existing Shopify workflows. Public-source research
and work from supplied files do not require Shopify sign-in, an API key, Node,
or an MCP server in the skills-only profile.

## Set up in three steps

You don't need an account or store access to start.

1. **Connect your AI.**
   - Claude: open Settings → Connectors → Add custom connector, paste
     `https://mktskills.com/mcp/shopify-skills`, and save.
   - ChatGPT: open Settings → Apps & Connectors and create a custom connector
     with the same link. Some plans need Developer mode turned on first.
   - Claude Code, Codex, Cursor and other coding agents: run
     `npx skills add vinceservidad/Shopify-Expert-AI-Skills` once.
   - Claude Code plugin: run
     `claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills`.
     If you already have it, run
     `claude plugin update shopify-va-toolkit@shopify-skills`.
   - Claude web or desktop with Skills: download `shopify-va.zip` below and
     upload it without unzipping under Customize → Skills.
2. **Try one product listing.** Open a new chat and paste this prompt. Fill in
   the brackets with facts the store owner has confirmed.

   ```text
   Write one Shopify product title, a short description, and three clear bullet points.
   Use only these approved facts. Ask about missing facts first. Do not save or publish anything.

   Product name: [name]
   Approved facts: [materials, size, features, and confirmed details]
   Target buyer: [who uses it, if known]
   Brand tone: [for example, warm and simple]

   Return the draft, missing facts, and a short review checklist.
   ```
3. **Review before anything goes live.** Paste only what the task needs, and
   never paste passwords, API keys, or card details. The AI only reads and
   drafts, so you or the owner make the change in Shopify admin.

Every other install option and fixes for common problems are in the
[setup guide](https://mktskills.com/shopify-va/setup).

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
