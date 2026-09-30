# Public release: MKT Skills VA Toolkit

**Status: source candidate. Public availability is not confirmed.** This page separates working source, existing development-store hosting and the steps still needed for unrelated merchants. It does not certify that every AI response or VA task is correct.

The toolkit is free and open source. ChatGPT and Claude have their own account costs and feature eligibility. All 19 skills, eight practical workflows, twelve candidate tools, three read scopes and Shopify API version `2026-07` are preserved. Existing `shopify-va-toolkit` plugin/server identifiers and the repository URL stay the same.

## What is built and what is live?

| Part | Current boundary |
| --- | --- |
| Downloadable instruction guides | Available in the repository. A VA can draft from approved facts in ChatGPT or Claude without connecting a store. |
| Local 0.2.0 plugin/connector | Twelve tools and eight workflows. Earlier local development-store checks read products, inventory and an unpaid sample order with both item pages. |
| Original development-store Worker | The 0.1.0 eight-tool service at `https://shopify-va-toolkit.vinceluxxe.workers.dev/mcp`. Last recorded live deployment: September 30, 2026, version `188b1418-cb0c-42ef-aa7c-3b9e2dfbd96e` at 100% traffic. Public-candidate builds do not replace it. |
| Public Shopify app and new Worker | Separate candidate with embedded App Home, managed installation, owner-reviewed AI pairing and signed lifecycle/compliance webhooks. A new public app and external review are required. |
| `mktskills.com/shopify-va` | Planned guide route. Domain purchase, Cloudflare setup and live route checks remain required. This route must not replace the MKT Skills homepage. |
| `https://shopify-mcp.mktskills.com/mcp` | Planned permanent connector address. It must be verified after the domain is owned and the public app configuration is released. |
| `support@mktskills.com` | Planned incoming forwarding address. Verify forwarding to the owner's existing Gmail before publishing it as working support. No reply-time promise is made. |
| Public plugin download | No release asset is assumed. Show a download button only for an existing, checked, versioned GitHub release asset. |
| Native ChatGPT and Claude connection | Test each separately. A protocol test or local browser OAuth test does not establish native-client sign-in or a combined editing workflow. |

Use the exact current commit, deployment version and traffic result in the release evidence. Do not carry a passing result from an earlier Worker, hostname or app ID into the public candidate.

### Implementation evidence, September 30, 2026

The separate **MKT Skills VA Toolkit** app was created in organization `128968056`, app ID `429932052481`, and Public distribution was selected. Configuration version `public-candidate-webhooks-v1` (`1149628088321`) is active with embedded App Home, managed installation, the same three read scopes, API `2026-07`, and the four signed webhook topics. This is an app configuration release, not a Cloudflare deployment or Shopify App Store approval. The app has not yet been installed on the development store.

The source passes 151 repository tests, 46 connector test groups, both extracted plugin configurations, Worker typechecking, the existing Custom Worker integration and the new Public Worker integration. These runtime tests use synthetic upstream responses. Public and guide Workers also pass deployment dry runs. The installed local Codex plugin was updated to `0.2.0`; fresh native-host discovery still requires verification. The new browser UI, real Shopify deliveries and native ChatGPT/Claude connections remain live acceptance checks.

The new domain and support forwarding are not verified. Candidate hosting is pending a separate Wrangler authorization for the owner's Cloudflare account; the machine's existing default sign-in belongs to a different account and was preserved. Public release stays gated on the domain, support delivery, native-client checks and Shopify approval.

## The public connection flow

1. The owner installs through the verified Shopify App Store listing. Shopify selects the store and manages installation. Before public approval, use only the exact official development-store install link for controlled tests.
2. The iframe App Home loads App Bridge and Polaris web components. Each backend request obtains a fresh Shopify ID token. Store identity comes from the verified token, not a typed store domain or an unsigned URL parameter.
3. ChatGPT, Claude or another MCP client starts a PKCE authorization request. The connection page shows a short-lived request code and the Shopify install/open destination.
4. The owner enters that code in App Home, reviews the verified store, requesting client, return origin and read permissions, then explicitly approves. Staff can inspect allowed store evidence but cannot approve or disconnect offline AI grants.
5. The original sign-in browser finishes the request using its own pending-browser binding. A separate one-use MCP code and resource-bound tokens are issued. Shopify credentials never reach the client.
6. The owner can disconnect one AI grant inside the app. Signed uninstall or shop-redaction events invalidate all grants for that store. Reinstall requires fresh verified authentication and does not restore old approvals.

MCP access tokens last one hour; grants and rotating MCP refresh credentials last at most seven days. Encrypted Shopify installation credentials are retained at most seven days from the latest owner pairing approval (or earlier upstream expiry). Routine token refresh does not extend retention. Client registrations last 28 days; request codes ten minutes; review and authorization codes two minutes. Hourly cleanup removes expired records. Lifecycle markers use hashed keys for 28 days and webhook receipts seven days, without store domains, identities or credentials.

The app provides the eight workflow guides and bounded product, variant, stock and order evidence views. It prepares instructions and supplies data; it does not run an AI task, edit the store, send a customer reply, issue a refund or create a schedule. Client briefs and documents stay in the client's chat or project files.

## Configure the separate candidate

Keep the existing development Worker, its credentials and its authorization records separate. Its dedicated test app selected **Custom distribution permanently**; do not attempt to convert it into the public app.

The candidate uses `connector/wrangler.public.jsonc` with a separate Worker and storage bindings. The default preview origin is `https://mkt-skills-shopify-preview.vinceluxxe.workers.dev`. Public configuration uses:

| Setting | Meaning |
| --- | --- |
| `SHOPIFY_AUTH_MODE=public` | Embedded public installation and pairing flow. The original Custom authorization-code mode remains separate. |
| `PUBLIC_URL` | Exact HTTPS connector origin. It defines OAuth issuer/resource URLs and must match the deployed host. |
| `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET` | The new public app's credentials. Store secrets privately; never copy them into guides, screenshots or commits. |
| `CONNECTOR_STORAGE_KEY` | A separate random base64 32-byte encryption key stored as a Worker secret. |
| `SHOPIFY_PUBLIC_APP_HANDLE` | The verified App Store handle. An unset handle must not invent an installation URL. |
| `SHOPIFY_PUBLIC_INSTALL_URL` | Exact official Shopify development-install link while the app is a candidate. This is not a public listing or a replacement for review. |
| `PUBLIC_LAUNCH_STAGE=candidate` | Default. Public pages clearly state that review and live checks remain pending. Set `public` only after the release gates pass. |
| `PLUGIN_DOWNLOAD_URL` | Optional actual `github.com/vinceservidad/Shopify-Expert-AI-Skills/releases/download/<tag>/<file>.plugin` asset. Leave unset until published and verified. |

Use Shopify-managed installation with `read_products`, `read_inventory`, `read_orders`, and `2026-07`. Register the application URL as the candidate's `/app`. Configure signed compliance topics `customers/data_request`, `customers/redact`, `shop/redact`, plus `app/uninstalled`, using the implemented webhook endpoint. Release the actual Shopify app configuration before browser testing.

The linked candidate configuration is `connector/shopify.app.public.toml`. Validate it with `shopify app config validate --config public --path connector`; deploy it from that directory with `shopify app deploy --config public --allow-updates`. This command publishes Shopify configuration, not the Worker. Review materials are in [the submission draft](shopify-review-submission.md).

The guide uses `connector/wrangler.guide.jsonc`, with a separate guide Worker. Its configuration includes `CONNECTOR_PUBLIC_URL`, `PUBLIC_SITE_URL`, launch stage, verified app handle and optional release asset URL. The preview serves the guide under `/shopify-va`. The permanent Cloudflare route is **only `mktskills.com/shopify-va*`**; retain the existing root site and unrelated routes.

From `connector/`, build the candidate artifacts without releasing them:

```bash
npm ci
npm run typecheck
npm test
npm run worker:public:build
npm run guide:build
```

Deployment commands are `npm run worker:public:deploy` and `npm run guide:deploy`. Run them only within an authorized release. A dry run does not create a live hostname, obtain Shopify approval or pass a native-client test.

For the permanent connector, set `PUBLIC_URL=https://shopify-mcp.mktskills.com`, disable `workers_dev`, and configure that exact custom domain after ownership and the intended Cloudflare account are verified. Changing the origin changes OAuth resources and authorization storage routing: update app settings and reconnect clients. Do not forward authorization tokens to the old origin or silently reuse old grants.

## Checks required before calling it public

| Check | What must be recorded |
| --- | --- |
| Source compatibility | Existing checks, all 19 skill names, eight workflows and twelve tools; unchanged old contracts; three read scopes and seven fixed schema-validated queries. |
| Authorization | Valid/invalid Shopify ID tokens, strict issuer/destination/audience checks, owner approval, altered/expired/used codes, PKCE, resource binding, safe errors and no leaked credentials. |
| Store isolation | Two distinct test stores. Staff/owner roles, reads, pairing, disconnect, uninstall, delayed redaction and reinstall must not affect the other store. |
| Lifecycle | Signed webhooks, invalid-HMAC 401, repeated/delayed deliveries, token renewal, revoked grants and restart persistence. |
| Merchant UI | Inside Shopify, including blocked third-party cookies/incognito. Test keyboard access, mobile layout, loading, empty, expiry, permission errors and recovery. |
| Evidence views | Products, variants, stock tracking, each relevant page, product description/media/SEO, and a populated unpaid order with multiple item pages. No identity/payment fields. |
| AI hosts | Actual native ChatGPT and Claude install/connect/reconnect/read/disconnect paths using eligible accounts. Record any unavailable capability rather than claiming it passed. |
| Public infrastructure | Purchased domain, active DNS/TLS, exact canonical routes, intended Worker version at 100% traffic, guide route isolation and verified support forwarding. |
| Packaging | Actual released plugin contents and installation through supported host surfaces. No invented public-directory or one-click claim. |
| Shopify approvals | New app's Public distribution, reviewed listing, and protected customer data level 1 approval for Order reads. Custom test access is not public approval. |

New behavioral scenarios remain ungraded until real AI responses are reviewed. Existing engineering tests, synthetic examples and qualitative spot checks do not certify expertise, time savings or business results. A separate editing connector remains outside this toolkit's read-only release.

Keep the launch stage at `candidate` if any required public gate is outstanding. A review candidate can be built and tested without representing it as an approved, available public app.

## Source guidance

Reviewed September 30, 2026:

- [Public and Custom distribution](https://shopify.dev/docs/apps/launch/distribution)
- [Shopify App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)
- [Shopify-managed installation](https://shopify.dev/docs/apps/build/authentication-authorization/app-installation)
- [Embedded authentication without a template](https://shopify.dev/docs/apps/build/authentication-authorization/implement-token-exchange?lang=node)
- [App Home iframe and extension choices](https://shopify.dev/docs/apps/build/app-home)
- [Polaris versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning)
- [Protected customer data](https://shopify.dev/docs/apps/launch/protected-customer-data)
- [Mandatory compliance webhooks](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance)
- [Cloudflare custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [ChatGPT custom connections](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt)
- [Claude custom connections](https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp)
