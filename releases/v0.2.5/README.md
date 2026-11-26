# ShopifySkills v0.2.5

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

## What changed since v0.2.4

- **Daily store check** in `shopify-va`: one morning check for aging unfulfilled
  orders, payment follow-ups, out-of-stock and low-stock products, products
  without media, and drafts. It ranks them into the day's to-do list and the
  client update. With the signed-in connector it is one tool call
  (`shopify_daily_store_check`).
- **Change files instead of live edits** in `shopify-catalog-operations`: an
  import file, a before-and-after diff and a rollback file for the owner to
  approve and import.
- **New job modes, still 19 skills:**
  - reorder planning and draft purchase orders (`shopify-catalog-operations`)
  - B2B and wholesale buyers, and Shopify POS end-of-day checks
    (`shopify-order-operations`)
  - translated listings and market prices (`shopify-product-listing`)
  - customer data access and deletion requests (`shopify-support`)
- 7 new behavior scenarios (58 to 64), marked `needs-review`, and a case study
  template.

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

- `./scripts/validate-repository.sh`, the Python tests and `bash scripts/ci.sh`
  pass.
- `claude plugin validate --strict` passes on the repository and on both
  extracted plugin packages.
- `claude plugin eval` and model runs of scenarios 58 to 64 were not run for
  this release.

Installation in the Claude or ChatGPT apps was not re-verified for this release.

Every package has a SHA-256 entry in `SHA256SUMS`. After downloading files:

```sh
sha256sum -c SHA256SUMS
```
