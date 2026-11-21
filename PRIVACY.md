# Privacy

ShopifySkills is a free, independent toolkit by Vince Servidad. It is not
affiliated with or endorsed by Shopify. This page covers the Claude and Codex
plugins, the skill packages, and the optional Shopify connector in this
repository.

## The skills plugin

The skills are text files: instructions, references and examples. Your AI client
(such as Claude or ChatGPT) reads them on your device or in your account. The
plugin has no server, telemetry, analytics or tracking. The author receives no
prompts, files, store data or usage data from it.

Your chats, uploaded files and results stay with the AI service you use. That
service's own privacy settings and retention rules apply to them.

## The local Shopify connector (optional)

The connected plugin package includes a read-only MCP server that runs on your
own machine. It uses the Shopify token you supply in your own private
environment, with read scopes only (`read_products`, `read_inventory`,
`read_orders`). It sends requests only to Shopify and returns results to your AI
client. The author receives none of this data. Keep your token out of prompts,
plugin files, URLs, source control and screenshots.

Order summaries leave out customer details. The connector does not request
`read_all_orders` or customer scopes.

## The hosted connection (optional)

The hosted connection at `shopify-mcp.mktskills.com` runs on Cloudflare and keeps
encrypted authorization records for a limited time. What it reads, keeps and
deletes is described in its own notice:
<https://mktskills.com/shopify-va/privacy>.

## Contact

Use [GitHub issues](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/issues)
for privacy questions. Issues are public, so do not include credentials, customer
records or private store documents.

Last updated: November 19, 2026.
