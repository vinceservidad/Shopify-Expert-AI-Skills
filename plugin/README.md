# Shopify VA Toolkit

An independent toolkit by Vince Servidad: 19 Shopify skills, eight practical
VA workflows and a read-only MCP connector. Not affiliated with or endorsed by Shopify.

The packaged plugin includes skills, references, teaching assets, licenses and
the bundled local server. Node.js 24+ must be available to the host. No npm
installation is needed to run the bundled server. Without Shopify credentials,
the skill catalog, skill reader, resources and task prompt work; store-data
tools return `NOT_CONNECTED`.

For local store reads, launch the host with `SHOPIFY_SHOP` set to the exact
`*.myshopify.com` domain and `SHOPIFY_ADMIN_ACCESS_TOKEN` supplied through your
private runtime environment. Use an approved app token and the least scopes
needed (`read_products`, `read_inventory`, `read_orders`). Do not put tokens in
prompts, plugin files, URLs, source control or screenshots. `SHOPIFY_SCOPES`
describes the configured token's scopes; Shopify still enforces actual access.

For an installed app and store in the same Shopify organization, set
`SHOPIFY_SHOP`, `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` instead of an
access token. The runtime obtains and renews the app token. This mode cannot
authenticate apps against unrelated merchants' stores. Review all categories on
Shopify's actual app consent screen before installation.

For a hosted connection, deploy the separate OAuth server from the source
repository and connect its real HTTPS `/mcp` URL. The repository URL is a source
link, not an MCP endpoint. The supplied local plugin does not silently choose a
hosted service or register an app in a public directory.

This version, `0.2.0`, exposes twelve tools locally. Ask “Plan today's work” or
“Prepare my end-of-day handover.” The workflow list names the inputs needed;
task preparation returns guides, missing-input checks and review steps. It does
not analyze your files or complete the job itself. Keep client briefs in your
chat or project files. No scheduler or client-document storage is included.

The public Worker remains the separately deployed `0.1.0` release with eight
tools until it is explicitly upgraded. Installing this package does not change
that service or grant access to another Shopify integration.

Start with: “Use shopify-va to review the connected store's products. Keep the
work read-only and flag missing evidence.” The skills guide reasoning; the tools
only supply read-only evidence. No refund, publish, budget or catalog-write tool
is exposed. Package integrity does not guarantee model decisions or time savings.

Read the included [setup, testing and hosting guide](docs/plugin-and-connector.md).
