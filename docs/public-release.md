# Public release: MKT Skills VA Toolkit

**Status: deployed candidate. Public availability is not confirmed.** The preview guide and public-mode Worker are live on their separate Cloudflare preview addresses. Shopify installation, owner approval and the public release gates below remain incomplete. This page does not certify that every AI response or VA task is correct.

The toolkit is free and open source. ChatGPT and Claude have their own account costs and feature eligibility. All 19 skills, eight practical workflows, twelve candidate tools, three read scopes and Shopify API version `2026-07` are preserved. Existing `shopify-va-toolkit` plugin/server identifiers and the repository URL stay the same.

## What is built and what is live?

| Part | Current boundary |
| --- | --- |
| Downloadable instruction guides | Available in the repository. A VA can draft from approved facts in ChatGPT or Claude without connecting a store. |
| Local 0.2.0 plugin/connector | Twelve tools and eight workflows. Earlier local development-store checks read products, inventory and an unpaid sample order with both item pages. |
| Original development-store Worker | The 0.1.0 eight-tool service at `https://shopify-va-toolkit.vinceluxxe.workers.dev/mcp`. Last recorded live deployment: September 30, 2026, version `188b1418-cb0c-42ef-aa7c-3b9e2dfbd96e` at 100% traffic. Public-candidate builds do not replace it. |
| Public Shopify app | Separate app `429932052481` has Public distribution and an active candidate configuration. It is not installed on the development store, protected Order-data settings are not saved, and Shopify review is not approved. |
| Public-mode preview Worker | Live at `https://mkt-skills-shopify-preview.vinceluxxe.workers.dev`, final-reference version `f04418a7-9910-438c-8cc5-0e6ce1705e25` at 100% traffic, deployed `2026-09-30T14:15:27.561618Z`. A live embedded store grant and store reads remain unverified. |
| Preview guide | Live at [the preview guide](https://mkt-skills-shopify-guide.vinceluxxe.workers.dev/shopify-va), version `d927bd38-2cbe-4701-869c-d3272802271b` at 100% traffic. Desktop, 390-pixel mobile, keyboard access and overflow were checked. |
| `mktskills.com/shopify-va` | Planned guide route. Domain purchase, Cloudflare setup and live route checks remain required. This route must not replace the MKT Skills homepage. |
| `https://shopify-mcp.mktskills.com/mcp` | Planned permanent connector address. It must be verified after the domain is owned and the public app configuration is released. |
| `support@mktskills.com` | Planned incoming forwarding address. Verify forwarding to the owner's existing Gmail before publishing it as working support. No reply-time promise is made. |
| Public plugin download | No release asset is assumed. Show a download button only for an existing, checked, versioned GitHub release asset. |
| Native ChatGPT and Claude first task | Both produced a product-listing draft from the exact three beginner files. Review confirmed the supplied facts and missing information. This was file-based drafting without a Shopify connection. |
| Native hosted connection | ChatGPT reached the owner-code page. Claude reached custom-connector setup Step 2 and detected the correct sign-in option; Add was not clicked. Team-account setup, owner approval, final linking and hosted reads remain incomplete. |
| VA practice batch and retests | ChatGPT's focused S06/S07/S10 retest passed manual review. Claude's fresh final retest still contains unsupported payment-delay/follow-up wording and an overly conservative handover conclusion. See [the manual review](va-workflow-review.md). No all-case pass, benchmark grade or expertise claim is recorded. |

Use the exact current commit, deployment version and traffic result in the release evidence. Do not carry a passing result from an earlier Worker, hostname or app ID into the public candidate.

### Implementation evidence, September 30, 2026

The separate **MKT Skills VA Toolkit** app was created in organization `128968056`, app ID `429932052481`, and Public distribution was selected. Configuration version `public-candidate-webhooks-v1` (`1149628088321`) is active with embedded App Home, managed installation, the same three read scopes, API `2026-07`, and the four signed webhook topics. This is an app configuration release, not a Cloudflare deployment or Shopify App Store approval. The app has not yet been installed on the development store.

The source passes 151 repository tests, 46 connector test groups, both extracted plugin configurations, Worker typechecking, the existing Custom Worker integration and the new Public Worker integration. These runtime tests use synthetic upstream responses. Public and guide Workers also pass deployment dry runs. The installed local Codex plugin was updated to `0.2.0`. A fresh native Codex run discovered all twelve tools, listed nineteen skills and eight jobs, prepared every job without provided inputs, and read all eight workflow references. A broad tool search returned only ten entries; targeted searches verified the two remaining tools. The native run called no store-data tools and verified instruction preparation, not task completion.

After the final guide edits, the installed plugin was refreshed and a fresh native Codex check made three actual MCP calls: list the eight workflows, read `shopify-support/references/customer-reply.md`, and read `shopify-va/references/end-of-day-handover.md`. Both returned references exactly matched final source SHA-256 hashes and included the final rules. No Shopify data/status tool or external action was called. This verifies installed guide retrieval, not a passing behavioral response or a completed store task.

The candidate and guide were then deployed through the owner's already-authorized Cloudflare MCP connection to account `622e7a897cbb7babda383df6c1474e02`. Both intended versions were verified at 100% traffic. Extra Wrangler authorization was unnecessary; the machine's existing default CLI sign-in was preserved.

Real HTTP checks of the initial public candidate `44a8dd59-e8b0-47e8-ae12-ba3d8c2d7ffe` at `2026-09-30T11:52:48.715Z` verified dynamic client registration (201), the owner-code authorization page (200), a secure browser cookie, the registered callback origin in CSP, same-origin referrer handling and the waiting status. `Origin: null` was rejected with 403; an invalid webhook signature returned 401; a locally generated valid signed synthetic webhook returned 200. This is deployed HTTP behavior, not a real Shopify delivery or an installed-store test. The preview `/app`, health and OAuth metadata endpoints were reachable; a successful embedded Shopify session and public MCP grant were not established.

The live guide was inspected at desktop and 390-pixel mobile width, including keyboard access and overflow. Both native ChatGPT and Claude completed the beginner product draft with `SKILL.md`, `listing-fields.md` and `qa-checklist.md`; the reviewed drafts retained supplied facts and marked missing information. Actual replies to the ten-case synthetic VA packet and focused S06/S07/S10 retests were captured. ChatGPT's focused retest passed manual review. Claude's fresh retest of the final guides still suggests an unsupported payment-confirmation delay and future follow-up in customer-facing drafts. Its S07 table correctly recognizes O-2 as verified in the record, but the overall “completed none” conclusion is overly conservative for that verified title-update scope. Human review remains necessary. [The manual review](va-workflow-review.md) records the evidence and limitations.

The final guide edits tighten QA so unsupported customer-facing commitments must be removed from the reply itself; an internal caveat does not repair them. The handover guide preserves requested scope and record-level verification. Store permissions, fixed queries and tool scope are unchanged. The first reference update was deployed as `4a6deb6a-06f3-45ab-9c50-9f3a411d0322` at 100% at `2026-09-30T13:51Z`. The final-reference version `f04418a7-9910-438c-8cc5-0e6ce1705e25`, deployment `f209fd0c-3697-46ed-95df-b68a2bf6897d`, was created at `2026-09-30T14:15:27.561618Z` and verified as current at 100% traffic through Cloudflare's API. The guide and original Worker retained their recorded versions at 100%. Deployment/traffic evidence does not extend the initial HTTP or client tests to a live store grant.

Fresh HTTP checks of that final candidate at `2026-09-30T14:22:49.169Z` returned health 200 (`public`, `0.2.0`, twelve tools and nineteen skills), OAuth metadata 200 with the correct issuer, `/app` 200 containing App Bridge, and unauthenticated `/mcp` 401. The guide and original health also returned 200. These are current endpoint checks; the new public app remains uninstalled, and real Shopify delivery and a native hosted store grant remain unverified.

A fresh HTTPS check of the unchanged original Worker at `2026-09-30T11:21:18Z` refreshed its existing approved grant, read all five existing queries, returned a populated order summary and continued product pagination. It still exposed eight tools and nineteen skills. This verifies that existing service with sample development data; it does not verify the new public Worker or its new detail tools.

The user has not purchased `mktskills.com`, so permanent domain setup and support forwarding are unavailable. ChatGPT's native custom-app discovery reached the hosted owner-code page. Claude's actual custom-connector discovery reached Step 2 with the correct sign-in option; Add was not clicked because Team-account setup and the store-owner grant are not complete. Neither observation establishes a finished hosted connection. The new app has not been installed, protected Order-data settings have not been saved, and live embedded grants, real Shopify webhook delivery and native hosted store reads remain unverified. PR #8 is unmerged; no public plugin release or public installation has been enabled. Keep the launch stage at `candidate`.

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

Behavioral benchmark scenarios 31–39 remain `needs-review` and ungraded. The separate manual review adds observations of actual responses without changing those benchmark grades. Existing engineering tests, synthetic examples and small qualitative runs do not certify expertise, perfect accuracy, time savings or business results. A separate editing connector remains outside this toolkit's read-only release.

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
