# Shopify VA Toolkit: plugin and MCP connector

The display name is **Shopify VA Toolkit**. The existing
`vinceservidad/Shopify-Expert-AI-Skills` repository URL remains the source of truth
and preserves existing links. It is not a hosted connector URL. This independent
project is not affiliated with Shopify.

The plugin bundles the existing 19 skills. The MCP connector supplies read-only
store evidence; the skills guide task reasoning and QA. No refund, publish,
inventory-change, product-write or campaign tool is exposed.

## Build the plugin

Requirements: Node.js 24+, Python 3.11+ and the repository's Python dependencies.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
cd connector
npm ci
npm run typecheck
npm test
npm run build
cd ..
python scripts/package_plugin.py
```

`dist/shopify-va-toolkit.plugin` is a ZIP-format plugin with manifests, all 19
canonical skill folders, their references/assets, a bundled stdio server and
licenses. The installed server needs Node 24+, but not npm dependencies.
The `plugin/` source folder contains packaging templates; install the complete
generated package, not that template folder.

For Cowork, use the custom plugin import surface available in your account.
For Claude Code, extract the archive to a local directory and test it with:

```bash
claude plugin validate /path/to/extracted/shopify-va-toolkit
claude --plugin-dir /path/to/extracted/shopify-va-toolkit
```

For ChatGPT/Codex local development, register the extracted plugin through the
host's supported local marketplace flow. Root `plugin.json` and `mcp.json` use
Agent Plugins 1.0.0; Claude-compatible manifests are included separately.
The package is not listed in either public directory. Hosted ChatGPT/Claude
connections use a deployed HTTPS MCP URL, not the local stdio configuration.

## Local stdio connection

Without Shopify credentials, the local server supports skill discovery, reading
references, resources and the task prompt. Store-data tools return a structured
`NOT_CONNECTED` result.

To enable store reads, supply `SHOPIFY_SHOP`, `SHOPIFY_ADMIN_ACCESS_TOKEN` and
the actual `SHOPIFY_SCOPES` through a private runtime environment. Shopify
enforces actual app access even if the configured scope list is incorrect.
Do not put credentials in prompts, URLs, source control or plugin files.

Example MCP configuration, after building the source:

```json
{
  "mcpServers": {
    "shopify-va-toolkit": {
      "command": "node",
      "args": ["/absolute/path/to/Shopify-Expert-AI-Skills/connector/build/stdio.js"]
    }
  }
}
```

The process inherits its private environment. Desktop apps may not inherit
terminal variables; use the host's credential configuration or launch it from
the configured environment. Never paste credentials into the public example.

## Hosted OAuth connector

This portable Node server uses a single instance with persistent SQLite storage
behind HTTPS. It implements MCP discovery, public-client dynamic registration,
S256 PKCE, merchant consent, Shopify authorization-code exchange, separate MCP
tokens, refresh rotation and revocation. OAuth records are encrypted with
AES-256-GCM at rest; the database is not a deployment artifact.

1. Create a standalone/API-only app in Shopify's Dev Dashboard.
2. Approve the required read scopes on a designated development store.
3. Set the app URL to the connector origin and allow the exact redirect
   `<origin>/oauth/shopify/callback`.
4. Copy `connector/.env.example` to a private `.env`, configuring app client
   ID/secret, `PUBLIC_URL`, a random 32-byte storage key and database location.
5. From `connector/`, run `node --env-file=.env build/http.js`.

Use `http://localhost:8788` only for development. Hosted `PUBLIC_URL` must be an
HTTPS origin. Set `HOST=0.0.0.0` when a container/proxy requires it; requests
still need the configured public Host and Origin. The proxy must preserve Host.
Keep `data/connector.sqlite` on a private persistent volume and the encryption
key in a secret manager. Do not use ephemeral filesystem hosting or independent
replicas with this SQLite design. Apply platform/proxy rate limits too.

Connect the AI client to `<PUBLIC_URL>/mcp`. Its sign-in shows the client identity
and return destination, requests the shop domain, then redirects to Shopify for
approval. The Shopify token stays on the connector; the client receives a
separate resource-bound MCP token. Each request resolves its own store grant;
the shop cannot be overridden through tool arguments.

MCP access tokens last one hour. Refresh tokens rotate and expire after seven
days; stored store grants also expire after seven days, requiring reconnection.
Revocation removes the grant and invalidates its outstanding MCP tokens.
If Shopify provides an expiring token and refresh token, the connector refreshes
that upstream credential as needed. Losing the database/key requires
reconnection; do not log credentials to troubleshoot it.

Building this source does not publish a hostname, register a public directory
entry, create billing, or roll out a production service. Verify the actual HTTPS
endpoint and client sign-in separately on every host you claim to support.

## Tool surface

| Tool | Evidence supplied |
| --- | --- |
| `list_shopify_skills` | Workflow names and purposes |
| `read_shopify_skill` | One skill or its named Markdown reference |
| `shopify_connection_status` | Configured store/scopes; not a reachability test |
| `shopify_get_shop` | Store identity, currency, timezone and primary domain |
| `shopify_search_products` | One product page with identity, status and total stock |
| `shopify_get_product_variants` | One variant page with SKU, price and inventory-item IDs |
| `shopify_get_inventory_levels` | Location quantities for an inventory-item ID |
| `shopify_list_order_summaries` | One page of totals/status without customer details |

Store reads use fixed GraphQL operations on API version `2026-07`; user search
text is passed as variables. No arbitrary GraphQL tool is exposed. Each page is
capped at 50; continue with `endCursor` when `pageInfo.hasNextPage` is true.
A page is not a complete catalog or reconciled report. Orders follow Shopify's
permissions/window; the app does not request `read_all_orders` or customer
fields. Analytics, ads, support policies and theme files require separate inputs.

## Verification boundaries

Automated checks cover the real MCP protocol, OAuth with a mocked Shopify
exchange, store isolation, state/HMAC/PKCE/resource validation, refresh/revocation,
input validation, errors and package contents. These engineering tests do not
grade model behavior or prove merchant outcomes. Record live development-store
and host installation checks separately with actual scope/date/limitations.

## Sources

Reviewed September 30, 2026:

- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [Claude plugin structure](https://code.claude.com/docs/en/plugins-reference)
- [Claude connector authentication](https://claude.com/docs/connectors/building/authentication)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Shopify standalone app authentication](https://shopify.dev/docs/apps/build/authentication-authorization/authenticate-standalone-apps)
