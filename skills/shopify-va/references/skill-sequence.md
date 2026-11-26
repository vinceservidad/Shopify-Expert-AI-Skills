# Shopify Skill Sequence and Stage Dependencies

Use this guide when a store build, launch, recovery, or growth project spans multiple Shopify skills and the team needs to know what comes first.

For an existing store with one narrow task, enter at the earliest unresolved stage instead of restarting at Stage 1. See [store-operating-lifecycle.md](store-operating-lifecycle.md) for the nine lifecycle states (`CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE`) and [task-routing.md](task-routing.md) for skill ownership.

## Seven-stage store build and growth sequence

Follow this dependency order when launching a new store, adding a product line, or rebuilding store operations from the ground up:

| Order | Stage | Skills to run | Gate before moving to the next stage |
| --- | --- | --- | --- |
| 1 | Research and segment | `shopify-product-research` | Confirm buyer demand, target segments, competitor offers, and landed-cost unit economics before creating listings. |
| 2 | Target and product truth | `shopify-product-listing`, `shopify-catalog-operations`, `shopify-merchandising` | Lock confirmed product specs, SKU and variant structure, stock counts, collections, and bundles. |
| 3 | Storefront and tracking | `shopify-product-page`, `shopify-theme-development`, `shopify-store-audit`, `shopify-cro` | Fix mobile product page clarity, Checkout Extensibility, Web Pixels, and page speed before sending paid traffic. |
| 4 | Operations and guardrails | `shopify-order-operations`, `shopify-flow-automation`, `shopify-support`, `shopify-va-training` | Verify shipping profiles, 3PL routing, fraud holds, return rules, and staff checklists before order volume spikes. |
| 5 | Retention and organic discovery | `shopify-email-marketing`, `shopify-seo` | Turn on welcome, abandoned cart, and post-purchase flows plus collection and product SEO so traffic does not leak. |
| 6 | Creative and paid acquisition | `shopify-creative-strategy`, `shopify-google-ads`, `shopify-meta-ads` | Build review-backed ad angles, Merchant Center feeds, and Advantage+ campaigns after tracking and margins pass. |
| 7 | Reconcile, measure, and iterate | `shopify-analytics`, `shopify-va` | Reconcile Shopify net sales, refunds, and profit after ad spend, then return to the earliest bottleneck. |

## Marketing and campaign launch sequence

Inside growth and campaign work, keep decisions in this order so ad spend never amplifies an unverified offer or broken page:

`Research → Segment → Target & Offer → Creative & Channel Plan → Tracking & Policy QA → Owner Approval → Launch & Verify → Reconcile & Iterate`

1. Research: gather customer reviews, search terms, return reasons, and margin headroom (`shopify-product-research`, `shopify-analytics`).
2. Segment: separate buyers by need, margin tier, stock depth, and geography or Markets rules (`shopify-merchandising`, `shopify-google-ads`).
3. Target and offer: match each segment to verified collections, bundles, and mobile product pages (`shopify-product-page`, `shopify-cro`).
4. Creative and channel plan: draft ad angles, email/SMS flows, and search structure from approved claims (`shopify-creative-strategy`, `shopify-email-marketing`, `shopify-seo`).
5. Tracking and policy QA: confirm Web Pixels, Conversions API deduplication, Merchant Center prices, and shipping or return terms (`shopify-theme-development`, `shopify-meta-ads`, `shopify-google-ads`).
6. Approval, launch, and reconciliation: get owner sign-off on budgets and offers, verify live delivery and tags, then reconcile profit in Shopify before raising spend (`shopify-analytics`).

## Five hard prerequisite gates

Never skip an earlier stage when one of these gates is unresolved:

1. Product truth and economics before writing listings: confirm materials, dimensions, price, margin, and claims before drafting product pages.
2. Backup export and pilot test before bulk catalog imports: export the current catalog and test a small batch before updating live SKUs or inventory.
3. Mobile page QA, event tracking, and stock checks before paid ads: verify variant selection, checkout links, Web Pixels, and inventory buffer before buying traffic.
4. Tested rules and owner approval before enabling Shopify Flow: run manual test cases on fraud holds, stock alerts, and customer tags before turning workflows on.
5. Reconciled Shopify net sales and refunds before raising ad budgets: check contribution profit after refunds, discounts, and ad spend instead of scaling on platform ROAS alone.

## Four common store scenarios

| Scenario | Ordered skill chain | Where to stop for owner approval |
| --- | --- | --- |
| Launching a new store or product line | `shopify-product-research` → `shopify-product-listing` → `shopify-product-page` → `shopify-store-audit` → `shopify-email-marketing` → `shopify-google-ads` | Before publishing products, enabling flows, or turning on paid campaigns |
| Traffic grows while conversion stays flat | `shopify-analytics` → `shopify-store-audit` → `shopify-product-page` → `shopify-cro` → `shopify-theme-development` | Before publishing duplicate theme edits or changing prices and offers |
| Ad spend rises while net profit drops | `shopify-analytics` → `shopify-google-ads` / `shopify-meta-ads` → `shopify-creative-strategy` → `shopify-merchandising` | Before changing campaign budgets, bidding targets, or product margins |
| Preparing for Black Friday or a migration | `shopify-catalog-operations` → `shopify-merchandising` → `shopify-order-operations` → `shopify-store-audit` → `shopify-support` | Before importing bulk prices, enabling discounts, or cutting over DNS and redirects |
