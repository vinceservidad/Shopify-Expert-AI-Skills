# Official Google Ads and Merchant Center Methods for Shopify

Use this playbook alongside [merchant-center-next-pmax.md](merchant-center-next-pmax.md) when auditing or upgrading tracking, Smart Bidding, campaign controls, or incrementality testing for a Shopify store. Verify current UI labels inside the target account before proposing changes.

## 1. Enhanced Conversions, Consent Mode v2, and Deduplication

Official references:
- <https://support.google.com/merchants/answer/13494537> (Set up conversion tracking with the Google & YouTube app on Shopify)
- <https://support.google.com/google-ads/answer/15712870> (About enhanced conversions for web)
- <https://support.google.com/google-ads/answer/10000067> (About consent mode)
- <https://support.google.com/google-ads/answer/14009635> (Set up consent mode)
- <https://support.google.com/google-ads/answer/6386790> (Use a transaction ID to minimize duplicate conversions)

Audit conversion measurement in this order before trusting reported ROAS:

- **One Primary Purchase action**: Pick one authoritative Purchase conversion action as `Primary` (usually the Shopify Google & YouTube app Google Ads purchase action). Set overlapping manual GTM tags, legacy checkout tags, or imported GA4 `purchase` key events to `Secondary` so Google Ads does not double-count orders.
- **Transaction ID deduplication**: Confirm the Purchase tag sends a dynamic, unique Shopify order ID as `transaction_id` on every checkout. Google Ads uses `transaction_id` to drop duplicate fires within the same conversion action, such as order-status page reloads. Never hardcode a static value, because repeated IDs cause Google Ads to drop real orders. Deduplication does not merge hits across two separate `Primary` conversion actions.
- **Enhanced Conversions for Web**: Enable Enhanced Conversions in the Google & YouTube app or custom pixel so checkout customer fields (email, phone, name, and address) are hashed with SHA-256 before transmission and matched against signed-in Google accounts. Review Google Ads conversion diagnostics for tag coverage and formatting warnings before relying on modeled recovery.
- **Consent Mode v2**: For visitors in the EEA, UK, and Switzerland, verify that the Shopify Customer Privacy banner or certified CMP signals `ad_storage`, `analytics_storage`, `ad_user_data`, and `ad_personalization` before Google tags fire. Confirm whether basic or advanced consent mode is active, and note modeled conversions when reconciling Google Ads totals against Shopify order exports.

## 2. Smart Bidding Controls, Value Rules, and New Customer Acquisition

Official references:
- <https://support.google.com/google-ads/answer/7065882> (About Smart Bidding)
- <https://support.google.com/google-ads/answer/7684216> (About Maximize conversion value bidding)
- <https://support.google.com/google-ads/answer/6268637> (About Target ROAS bidding)
- <https://support.google.com/google-ads/answer/6268632> (About Target CPA bidding)
- <https://support.google.com/google-ads/answer/10520348> (Set up conversion value rules)
- <https://support.google.com/google-ads/answer/12080169> (About customer lifecycle goals)

Match the bid strategy to verified conversion quality and margin structure:

| Strategy | Auction goal | Best Shopify fit | Primary failure mode |
| --- | --- | --- | --- |
| `Maximize conversion value` | Spend full daily budget for highest total value | Launches, new SKU tests, or growth periods without a strict return floor | Overspends into low-return queries if search intent or listing groups are too broad |
| `Target ROAS` | Average a set return (`conversion value / cost`) | Multi-SKU catalogs with accurate dynamic order values and stable history | Restricts delivery and under-spends when the target sits above recent achieved ROAS |
| `Target CPA` | Average a set cost per conversion | Single-SKU offers, flat-margin products, or lead-gen funnels | Treats a low-AOV accessory order the same as a high-AOV bundle order |

Apply these official controls with explicit data gates:

- **Bidding data gates**: Before adding or tightening a Target ROAS or Target CPA, confirm clean dynamic values, check the account's conversion-lag window, and verify enough recent conversion volume for the campaign to bid reliably. Do not apply a universal scaling percentage or stack multiple major bid and budget edits during the same observation window.
- **Conversion value rules**: Adjust conversion value in real time by location, device, or audience using `Add` or `Multiply` without editing Shopify checkout code. Use rules only when backed by store economics (such as higher-margin regions or high-LTV customer lists). Remember that Smart Bidding optimizes on the rule-adjusted value while Shopify reports net realized revenue.
- **New Customer Acquisition (NCA) goal**: Configure Customer Match purchaser lists and, where supported, the `new_customer` conversion parameter so Google AI can separate first-time buyers from returning buyers.
  - `New Customer Value mode`: Adds an extra value weight to first-time buyer orders while still bidding on returning shoppers (requires a Purchase goal and value-based Smart Bidding).
  - `New Customer Only mode`: Restricts bidding to net-new buyers. Audit Customer Match freshness and reach closely so stale purchaser lists do not throttle volume.

## 3. Campaign Interaction, Brand Exclusions, Insights, and Demand Gen

Official references:
- <https://support.google.com/google-ads/answer/13810170> (How Performance Max interacts with other campaigns in your account)
- <https://support.google.com/google-ads/answer/6275296> (Use campaign priority for Shopping campaigns)
- <https://support.google.com/google-ads/answer/13721847> (About brand settings for Search and Performance Max)
- <https://support.google.com/google-ads/answer/11386930> (About search terms insights)
- <https://support.google.com/google-ads/answer/13721750> (Use a product feed to show your products in Demand Gen campaigns)

Understand how Google Ads resolves overlap before splitting campaigns:

- **Standard Shopping vs. Performance Max**: When both campaigns target the same products and market in one account, Google Ads selects the ad by Ad Rank rather than automatically giving Performance Max priority. In Search, an active keyword identical to the user's query (including spell-corrected exact matches) takes priority over Performance Max.
- **Standard Shopping campaign priority**: Applies only across Standard Shopping campaigns sharing the same product and country (`High`, `Medium`, or `Low`, defaulting to `Low`). The higher-priority campaign bids first until its budget runs out, even with a lower CPC bid. If priorities match, the highest bid enters the auction. Campaign priority does not control Performance Max.
- **Brand exclusions**: Build brand lists under `Tools > Shared library > Brand lists` and apply them in campaign settings. For Performance Max, verify whether excluded brands should also be blocked from Shopping inventory or only from text Search while a dedicated Brand Search campaign owns brand clicks.
- **Search terms insights**: Performance Max reports query demand in grouped intent categories rather than a raw query-by-query table. Audit search terms insights regularly to measure brand share, catch off-category drift, and justify negative keyword or asset-group updates.
- **Demand Gen for ecommerce**: Link a Merchant Center product feed to Demand Gen to serve shoppable product cards alongside video and image ads across YouTube, Shorts, Discover, and Gmail. Evaluate Demand Gen on assisted discovery, new-customer share, and lift rather than holding it to branded Search last-click ROAS.

## 4. Merchant Center Next Policy Triage, Promotions, and Automations

Official references:
- <https://support.google.com/merchants/answer/6150127> (Misrepresentation)
- <https://support.google.com/merchants/answer/13422697> (Get started with Promotions)
- <https://support.google.com/merchants/answer/13889434> (Free listings for products)
- <https://support.google.com/merchants/answer/12157888> (Allow Merchant Center to update product information automatically)
- <https://support.google.com/merchants/answer/15093676> (How to fix: Not performing automatic item updates for availability)

Keep paid Shopping and organic free listings compliant under Google's unified Shopping policies:

- **Account-level Misrepresentation triage**: Treat Misrepresentation as a storefront trust audit rather than a feed refresh. Before requesting a review, confirm that business name, physical address, domain support email, and working phone match across Merchant Center settings, footer, and Contact page. Publish clear return, refund, and shipping timelines with transparent checkout totals. Remove broken links, fake countdown timers, unverified urgency widgets, and placeholder copy. Do not submit repeated appeals before root causes are fixed, because rejected appeals add cooldowns and lengthen suspension.
- **Promotions**: Use the Merchant Center Promotions add-on for percentage-off, amount-off, free-shipping, or free-gift offers across Shopping ads and free listings. Every promotion must meet Google's minimum discount rules, state conditions up front, and match live Shopify checkout discounts.
- **Free listings**: Free listings display eligible catalog products across Search, the Shopping tab, Images, and YouTube without ad spend. Confirm free listings are active in Merchant Center data sources, keep shipping and return policies complete, and clear `Needs attention` issues so organic impressions are not silently lost.
- **Automatic item updates**: Merchant Center can update `price`, `sale_price`, `availability`, and `condition` from landing-page structured data (`JSON-LD`) and page extractors to reduce sporadic disapprovals. Treat automatic updates as a safety net alongside live Shopify Content API syncing. If Google reports that automatic updates stopped running, test variant URLs (`?variant=...`) in Google Rich Results Test and fix theme `Product` schema mismatches at the source.

## 5. Experiments and Incrementality Validation

Official references:
- <https://support.google.com/google-ads/answer/6261395> (Set up a custom experiment)
- <https://support.google.com/google-ads/answer/12997711> (About Performance Max experiments)
- <https://support.google.com/google-ads/answer/12003020> (About Conversion Lift)
- <https://support.google.com/google-ads/answer/14097193> (Set up Conversion Lift based on geography)

Do not rely solely on pre/post date comparisons when seasonality, promotions, or brand demand shift:

- **Custom experiments**: Use Google Ads Experiments to split traffic cleanly between a base campaign and a trial arm when testing bid strategies, ad copy, or landing pages in Search or Shopping.
- **Performance Max experiments**: Use Google's built-in PMax experiment workflows to test incremental uplift when adding PMax beside existing campaigns, or to test upgrading Standard Shopping to PMax before moving full budget.
- **Conversion Lift (user-based and geo-based)**: When budget and conversion volume qualify, run user-based Conversion Lift (randomized user holdout) or geo-based Conversion Lift (matched treatment and holdback regions). These studies estimate causal incremental conversions, iCPA, and iROAS rather than relying on attributed credit alone.
- **Validation hygiene**: Freeze unrelated edits during the test window, wait for the full conversion-lag period before judging results, and reconcile experiment findings against Shopify total net revenue and new-customer orders.
