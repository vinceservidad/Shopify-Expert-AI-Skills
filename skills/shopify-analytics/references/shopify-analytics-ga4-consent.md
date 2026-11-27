# Shopify Analytics, ShopifyQL, GA4 Web Pixels, and Consent Mode v2

Official starting points:

- <https://shopify.dev/docs/api/shopifyql/latest> (ShopifyQL syntax and query reference)
- <https://shopify.dev/docs/api/web-pixels-api> (Shopify Web Pixels API)
- <https://shopify.dev/docs/api/web-pixels-api/standard-events/checkout_completed> (Standard `checkout_completed` event)
- <https://shopify.dev/docs/api/customer-privacy> (Shopify Customer Privacy API)
- <https://developers.google.com/tag-platform/security/guides/consent> (Google Consent Mode v2 developer guide)
- <https://support.google.com/analytics/answer/9976101> (GA4 Consent Mode overview)
- <https://support.google.com/analytics/answer/11161109> (GA4 behavioral modeling for consent mode)

Use this playbook when querying Shopify's modern Analytics reports with ShopifyQL, auditing GA4 ecommerce tracking through the Google and YouTube channel app, or explaining gaps between Shopify sales and GA4 purchase reports. Start read-only and verify every schema, event, and consent setting inside the target store before recommending changes.

## 1. Shopify Analytics and ShopifyQL model

Shopify's modern analytics report builder runs on ShopifyQL. Inspecting the query behind a report helps verify the exact dataset, filter logic, and metric formula before comparing numbers across systems.

Core ShopifyQL clauses:

- `FROM`: chooses the dataset schema, such as `sales`, `sessions`, or `inventory`.
- `SHOW`: selects quantitative metrics (for example `gross_sales`, `net_sales`, `total_sales`, or `orders`) and dimensions.
- `WHERE`: filters rows by conditions such as sales channel, country, or product type.
- `GROUP BY` or `TIMESERIES`: segments rows by dimension or time grain.
- `SINCE`, `UNTIL`, or `DURING`: sets the reporting date window.
- `COMPARE TO`: attaches a comparison period such as `previous_period` or `previous_year`.

```shopifyql
FROM sales
SHOW gross_sales, discounts, returns, net_sales, orders
GROUP BY sales_channel
SINCE -30d UNTIL yesterday
COMPARE TO previous_period
```

Guardrails when reading ShopifyQL reports:

1. Confirm available schemas and field names inside the store's live query editor because field availability can differ by plan and rollout.
2. Never compare `total_sales` (which includes shipping and taxes) against GA4 `purchase` revenue without checking whether GA4 excludes tax and shipping.
3. Verify whether the query filters to `Online Store` only or includes POS, draft orders, and subscription renewals.

## 2. GA4 ecommerce tracking via Google and YouTube channel and Web Pixels

Shopify deprecated legacy tracking methods such as hard-coding GA4 scripts in `theme.liquid`, `checkout.liquid`, or Order Status Additional Scripts. The official integration path is the Google and YouTube sales channel app connected to a GA4 web data stream (`G-` measurement ID).

What to verify in an audit:

1. Connection ownership: check `Sales channels > Google & YouTube` and `Settings > Customer events` to confirm the GA4 app pixel is connected. A merchant does not need Google Merchant Center connected just to run GA4.
2. Standard event mapping: confirm core storefront events (`page_view`, `view_item`, `add_to_cart`) and checkout events (`begin_checkout`, `purchase`) fire once per action.
3. Post-purchase upsell timing: Shopify's `checkout_completed` Web Pixel event fires on the first post-purchase upsell page when post-purchase offers are active, rather than firing again on the Thank You page. If a customer accepts a post-purchase upsell, confirm whether the GA4 integration captures the upsell adjustment or leaves a gap against Shopify final order value.
4. No duplicate tags: check `theme.liquid`, Theme Editor app embeds, Google Tag Manager containers, and `Settings > Customer events` to ensure the same `G-` measurement ID does not fire twice.

## 3. Google Consent Mode v2 and Customer Privacy API

Shopify Web Pixels run inside a sandbox and read shopper consent states through the Shopify Customer Privacy API. When a store serves regulated regions such as the EEA or UK, consent settings directly change what GA4 can observe.

The four Consent Mode v2 signals:

| Consent signal | What it controls |
| --- | --- |
| `analytics_storage` | Analytics cookies and client identifiers used by GA4 |
| `ad_storage` | Advertising cookies and click identifiers used for conversion attribution |
| `ad_user_data` | Sending user data to Google for advertising purposes |
| `ad_personalization` | Using data for remarketing and personalized ads |

Basic versus Advanced Consent Mode:

- Basic mode: Google tags do not load until the visitor grants consent. If the visitor declines or ignores the banner, GA4 receives no data for that session.
- Advanced mode: Google tags load with default states (typically `denied` in opt-in regions) and send cookieless pings until consent is granted. Those pings allow GA4 behavioral modeling when the property meets Google's volume and configuration thresholds.

Verify consent behavior on a live storefront by testing accept, decline, and no-interaction states in a fresh private browser window for the target region. Never assume a cookie banner updates Google Consent Mode v2 signals until you observe the consent parameters in network requests or Tag Assistant.

## 4. Reconciling Shopify sales against GA4 purchases

Shopify is the financial order ledger, while GA4 is a client-side behavioral analytics tool. Treat small, explained variances as normal and isolate real tracking defects before changing tags.

| Gap source | Why Shopify and GA4 differ | What to check first |
| --- | --- | --- |
| Consent opt-outs and ad blockers | Declined `analytics_storage` or blocked scripts stop or model browser events while Shopify records every paid order | Compare gap size by region (EEA/UK vs US) and browser (Safari/Firefox vs Chrome) |
| Order edits, refunds, and cancellations | Shopify `net_sales` deducts returns and edits; GA4 `purchase` reflects checkout-time values unless refund events are sent separately | Compare GA4 `purchase` count against Shopify gross orders created on the same date before returns |
| Non-online-store orders | Draft orders, POS sales, B2B invoices, and recurring subscription rebills do not fire storefront Web Pixels | Filter ShopifyQL `FROM sales` to `sales_channel = 'Online Store'` |
| Tax, shipping, and currency | GA4 item/event value settings may exclude tax or shipping, or convert multi-currency orders differently | Inspect one test order payload in `checkout_completed` versus the GA4 `purchase` event |
| Timezone and cutoff | Shopify reports use the store timezone; GA4 uses the property reporting timezone | Align both reporting timezones and re-run a 7-day daily comparison |
| Missing `checkout_completed` firing | Browser closed before Thank You load, third-party off-site redirects, or broken custom pixel code | Run a controlled test order and check `Settings > Customer events` status |

## 5. Escalation triggers

Flag a tracking defect rather than normal variance when any of these occur:

- GA4 `purchase` count exceeds Shopify Online Store orders (signals duplicate tag firing or Thank You page reloads).
- GA4 drops to zero purchases or loses a large share of non-opt-in orders overnight right after a theme, checkout, or banner change.
- GA4 `purchase` revenue shows `0`, missing currency, or wrong decimal values compared with the `checkout_completed` payload.
