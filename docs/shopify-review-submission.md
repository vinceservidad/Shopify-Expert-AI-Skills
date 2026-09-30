# Shopify review submission draft

Prepared September 30, 2026. **Not submitted.** Replace pending evidence with actual observations before submission. This document does not establish Shopify approval or a public installation URL.

## App information

- Name: MKT Skills VA Toolkit.
- Operator: Vince Servidad. Do not describe MKT Skills as a registered legal entity unless that is verified.
- Pricing: free initial release; no in-app billing or app payments.
- Audience: Shopify store owners and their approved VAs.
- Purpose: supply read-only store evidence and practical task instructions for use with the merchant's own ChatGPT, Claude or other supported MCP client.
- Public product guide: planned `https://mktskills.com/shopify-va`.
- Privacy notice: planned `https://mktskills.com/shopify-va/privacy`.
- Support: planned `support@mktskills.com`; incoming delivery must be verified.
- Candidate App Home: `https://mkt-skills-shopify-preview.vinceluxxe.workers.dev/app`, pending Worker deployment.
- Permanent App Home: planned `https://shopify-mcp.mktskills.com/app`.
- App ID: `429932052481`, Public distribution.

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

Query results are processed for the requested read and returned to the chosen client; they are not stored as customer/order documents. Client briefs, messages and policies remain in the client's chat/project files. Encrypted authentication records follow the retention and deletion behavior described in the actual privacy notice. Shopify authentication identity fields are discarded except the transient owner check and the short-lived hashed subject binding needed to approve the exact request.

## Reviewer walkthrough

1. Install through Shopify's official review/development installation flow on an authorized development store. Shopify selects the store; the app does not ask for a typed store domain.
2. Open the embedded app. Verify the store session, eight workflow guides, loading/error recovery and Help/Privacy links.
3. Click **Check store identity**, **View products** and **View recent orders**. Follow product details, variant/SKU and stock buttons. Review timestamps and page coverage; continue paginated results.
4. Start an MCP connection from an eligible ChatGPT or Claude account. Copy its connection code. The owner reviews and approves the exact client, store, return destination and three read permissions inside Shopify. Finish in the original sign-in window.
5. Confirm twelve read-only tools and nineteen skills, load the eight jobs, and perform bounded reads including the populated unpaid sample order. No editing tools should be exposed.
6. Disconnect one connection and confirm it loses access. Uninstall and confirm all grants for that store are invalidated. Reinstall requires fresh approval; other stores remain unaffected.

The embedded evidence checks and guides are usable without an AI subscription. An actual AI client is required to test the optional connection. Supply any reviewer access or screencasts only after they exist and have been verified; never put credentials into this public file.

## Submission gates

- Verify domain ownership, canonical HTTPS pages and working support delivery.
- Deploy the exact candidate bundle and record its version/traffic and actual app configuration.
- Complete live embedded UI, blocked-third-party-cookie, browser redirect and both native-client checks.
- Confirm real signed Shopify webhook deliveries; simulator and CLI-generated examples are separate evidence.
- Review actual AI responses for incomplete evidence and unsupported completion claims; retain ungraded scenarios until that review happens.
- Add actual desktop/mobile screenshots and a truthful test screencast without credentials or private customer data.
- Complete Shopify's current self-review and protected-data use details. Submit only complete, factual materials; record Shopify's actual decision.
- Keep public installation and `PUBLIC_LAUNCH_STAGE=public` disabled while any gate is outstanding.

See [the release record](public-release.md) and Shopify's [app requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements), [protected-data rules](https://shopify.dev/docs/apps/launch/protected-customer-data), and [submission process](https://shopify.dev/docs/apps/launch/app-store-review/submit-app-for-review).
