# Shopify review submission draft

Prepared September 30, 2026. **Deployed candidate; not submitted or approved.** Replace pending evidence with actual observations before submission. The preview guide and Worker are live; this document does not establish Shopify approval, an installed public store grant or a public installation URL.

## App information

- Name: MKT Skills VA Toolkit.
- Operator: Vince Servidad. Do not describe MKT Skills as a registered legal entity unless that is verified.
- Pricing: free initial release; no in-app billing or app payments.
- Audience: Shopify store owners and their approved VAs.
- Purpose: supply read-only store evidence and practical task instructions for use with the merchant's own ChatGPT, Claude or other supported MCP client.
- Public product guide: planned `https://mktskills.com/shopify-va`.
- Privacy notice: planned `https://mktskills.com/shopify-va/privacy`.
- Support: planned `support@mktskills.com`; incoming delivery must be verified.
- Candidate App Home: `https://mkt-skills-shopify-preview.vinceluxxe.workers.dev/app`, reachable on the deployed preview Worker. A successful live embedded Shopify session is still unverified.
- Candidate guide: [MKT Skills VA Toolkit preview](https://mkt-skills-shopify-guide.vinceluxxe.workers.dev/shopify-va), live with desktop, 390-pixel mobile, keyboard and overflow checks.
- Permanent App Home: planned `https://shopify-mcp.mktskills.com/app`.
- App ID: `429932052481`, Public distribution.
- Active app configuration: `public-candidate-webhooks-v1` (`1149628088321`). The app is not yet installed on the development store and its protected Order-data settings are not saved.

Suggested listing description:

> Prepare Shopify VA work with practical guides and approved store evidence. Review product details, variants, stock and permitted order information inside Shopify. Connect supported AI clients through owner-reviewed read-only access to help draft listings, plan daily work, prepare customer replies and produce handovers. Review the AI's output against your own facts and policies before using it.

The app is independent of Shopify. It does not certify VA expertise, guarantee accurate AI responses, send messages, issue refunds, modify store records or run scheduled work. ChatGPT and Claude are separate services with their own account requirements. Do not describe the app as verified by those providers or listed in their directories.

## Requested access and data use

| Read scope | Function |
| --- | --- |
| `read_products` | Fixed reads of store identity, product records, descriptions, search information, media metadata, variants, SKUs and prices. |
| `read_inventory` | Stock tracking and available/on-hand/committed quantities at location IDs. No stock changes. |
| `read_orders` | Bounded order summaries and financial/fulfillment/cancellation state with paged product line items. No order changes. |

Request protected customer data **level 1** for Order resources. Reason: the merchant needs verified order status and product-line evidence for support drafts and work handovers. The fixed queries exclude customer names, addresses, emails, phones, payment details and carrier tracking. Do not request level 2 identity fields or `read_all_orders` for this release.

This is the proposed access justification. Protected-data configuration has not been saved or approved for the new public app; the earlier Custom test app's working order reads do not establish public-app access.

Query results are processed for the requested read and returned to the chosen client; they are not stored as customer/order documents. Client briefs, messages and policies remain in the client's chat/project files. Encrypted authentication records follow the retention and deletion behavior described in the actual privacy notice. Shopify authentication identity fields are discarded except the transient owner check and the short-lived hashed subject binding needed to approve the exact request.

## Reviewer walkthrough

1. Install through Shopify's official review/development installation flow on an authorized development store. Shopify selects the store; the app does not ask for a typed store domain.
2. Open the embedded app. Verify the store session, eight workflow guides, loading/error recovery and Help/Privacy links.
3. Click **Check store identity**, **View products** and **View recent orders**. Follow product details, variant/SKU and stock buttons. Review timestamps and page coverage; continue paginated results.
4. Start an MCP connection from an eligible ChatGPT or Claude account. Copy its connection code. The owner reviews and approves the exact client, store, return destination and three read permissions inside Shopify. Finish in the original sign-in window.
5. Confirm twelve read-only tools and nineteen skills, load the eight jobs, and perform bounded reads including the populated unpaid sample order. No editing tools should be exposed.
6. Disconnect one connection and confirm it loses access. Uninstall and confirm all grants for that store are invalidated. Reinstall requires fresh approval; other stores remain unaffected.

The embedded evidence checks and guides are usable without an AI subscription. An actual AI client is required to test the optional connection. Supply any reviewer access or screencasts only after they exist and have been verified; never put credentials into this public file.

## Evidence available and its limits

- Final-reference preview Worker `f04418a7-9910-438c-8cc5-0e6ce1705e25` is current at 100% traffic, deployed at `2026-09-30T14:15:27.561618Z` (`f209fd0c-3697-46ed-95df-b68a2bf6897d`). Guide Worker `d927bd38-2cbe-4701-869c-d3272802271b` remains at 100%. Earlier candidate versions were `44a8dd59-e8b0-47e8-ae12-ba3d8c2d7ffe` and first reference update `4a6deb6a-06f3-45ab-9c50-9f3a411d0322`. Deployment used the pre-existing authorized MCP connection; no new Wrangler login was required. Version/traffic verification does not establish a live store grant or complete native sign-in.
- Deployed HTTP checks verified registration, the owner-code page, secure browser cookie, callback-origin CSP, waiting status, null-origin rejection and invalid-HMAC 401. A correctly signed **synthetic** webhook returned 200; no real Shopify delivery is claimed.
- Fresh final-candidate HTTP checks at `2026-09-30T14:22:49.169Z` returned health 200 (`public`, `0.2.0`, twelve tools/nineteen skills), correct-issuer OAuth metadata 200, `/app` 200 containing App Bridge, and unauthenticated `/mcp` 401. Guide and original health returned 200. This does not establish public-app installation, a live embedded grant or native store reads.
- The guide has desktop/mobile and keyboard/overflow evidence. This does not verify embedded Shopify App Home or browser completion of an approved connection.
- Both native ChatGPT and Claude produced reviewed beginner drafts from the exact three guide files. Those tests checked facts and unknowns using uploaded source files; they did not access a store.
- ChatGPT custom-app OAuth discovery reached the hosted owner-code page. Claude's actual custom-connector setup reached Step 2 and detected the correct sign-in option; Add was not clicked. Team-account setup, store-owner approval, final linking and hosted reads are pending.
- Ten-case synthetic workflow replies and focused S06/S07/S10 retests were captured. ChatGPT's focused retest passed manual review. Claude's final fresh retest still has unsupported payment-delay/follow-up wording and an overly conservative S07 overall completion conclusion despite recognizing the verified O-2 title record. These are not an all-case passing result or a behavioral benchmark. See [the manual review](va-workflow-review.md).
- The final references tighten reply QA and handover status reporting without changing scopes, queries or tools. All 46 Node groups, 151 Python tests, Worker and package checks passed. After the installed Codex `0.2.0` plugin was refreshed, a fresh native check listed eight workflows and read both changed references through actual MCP calls. Their returned text exactly matched final source hashes. No Shopify data/status call or external action occurred; guide retrieval does not establish improved AI behavior. Benchmark scenarios 31–39 remain ungraded.
- The original development-store Worker remains version `188b1418-cb0c-42ef-aa7c-3b9e2dfbd96e` at 100% traffic. Its prior regression evidence is separate from the new public app.

## Submission gates

- Purchase/verify the domain, canonical HTTPS routes and incoming support forwarding. The permanent domain has not been purchased and support forwarding is unavailable.
- Preserve the recorded preview deployment versions and app configuration; verify the final permanent-domain deployment separately.
- Install the new public app on the authorized development store and complete its protected Order-data configuration before claiming order reads.
- Complete live embedded UI, blocked-third-party-cookie, browser redirect and both native-client checks.
- Confirm real signed Shopify webhook deliveries; simulator and CLI-generated examples are separate evidence.
- Retain the actual manual-review findings, including Claude's remaining unsupported commitments and the S07 completion-scope issue. Do not convert narrow guide changes or passing engineering tests into an all-behavior passing claim; benchmark scenarios 31–39 remain ungraded.
- Add actual desktop/mobile screenshots and a truthful test screencast without credentials or private customer data.
- Complete Shopify's current self-review and protected-data use details. Submit only complete, factual materials; record Shopify's actual decision.
- Keep public installation and `PUBLIC_LAUNCH_STAGE=public` disabled while any gate is outstanding.

PR #8 remains unmerged. No public plugin release or public App Store installation has been enabled.

See [the release record](public-release.md) and Shopify's [app requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements), [protected-data rules](https://shopify.dev/docs/apps/launch/protected-customer-data), and [submission process](https://shopify.dev/docs/apps/launch/app-store-review/submit-app-for-review).
