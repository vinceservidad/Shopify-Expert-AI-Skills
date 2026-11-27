# Meta Advantage+ Shopping & Conversions API (CAPI) Playbook

Official starting points:
- <https://help.shopify.com/en/manual/online-sales-channels/facebook-instagram-by-meta> (Facebook and Instagram by Meta channel)
- <https://www.facebook.com/business/help/2041148702652965> (Conversions API overview)
- <https://www.facebook.com/business/help/112167992830700> (About the learning phase)
- <https://www.facebook.com/business/help/316478108955072> (Significant edits and the learning phase)

Use this playbook when auditing Meta Advantage+ Shopping Campaigns (ASC / Advantage+ Sales), Shopify CAPI and Pixel setup, Event Match Quality, or creative diversification. Confirm actual account-visible labels because Meta periodically renames Advantage+ campaign controls.

## 1. Shopify Facebook and Instagram channel plus CAPI setup

- Data Sharing level: check `Shopify Admin -> Sales channels -> Facebook & Instagram -> Settings -> Share data`.
  - Confirm Maximum data sharing is enabled (when allowed by the merchant's privacy and consent policy) so Shopify sends both browser Pixel events and server-side Conversions API (CAPI) events, including Checkout Extensibility events.
  - Avoid running a second manual Pixel or duplicate GTM Meta tag firing the same `Purchase` event unless event deduplication is explicitly verified.
- Event deduplication (`event_id`):
  - In Meta Events Manager under Overview, inspect `Purchase`, `InitiateCheckout`, `AddToCart`, and `ViewContent` for Connection Method (`Browser • Server`) and Deduplication.
  - Confirm `event_id` matches across browser and server pairs so Meta deduplicates rather than double-counting conversions.
- Event Match Quality (EMQ):
  - Check Purchase EMQ in Events Manager. Aim for 6.0+ (Good or Great) on `Purchase` by passing consented hashed contact fields (`em`, `ph`, `fn`, `ln`) and location fields (`ct`, `st`, `zp`, `country`). Also pass session identifiers (`external_id`, `fbp`, `fbc`) along with `client_ip_address` and `client_user_agent`.
  - Verify `value`, `currency`, `content_ids` (matching catalog SKU, variant, or item group IDs), and `content_type` (`product` or `product_group`) on `ViewContent`, `AddToCart`, and `Purchase` so Advantage+ catalog ads match products accurately.
- Consent and domain verification: confirm Meta Business Manager domain verification is active and customer privacy or cookie consent behavior in EEA, UK, and US states aligns with Shopify Customer Privacy settings.

## 2. Advantage+ Shopping and Sales campaign architecture

- Consolidation over fragmentation: Meta's delivery system performs best with fewer overlapping ad sets competing in the same auction. Avoid splitting identical products across multiple small-budget campaigns targeting overlapping broad audiences.
- Existing customer budget cap:
  - Define Existing Customers in Advertising Settings using verified Shopify customer lists and pixel purchasers so reporting separates new-customer acquisition from retention and remarketing.
  - Apply an existing-customer budget cap (when available and supported by the store's acquisition goal) so Advantage+ does not inflate platform ROAS by overspending on repeat buyers who would have purchased via email or direct visits.
- Learning-phase budget math and significant edits:
  - Meta generally needs roughly 50 optimization events per ad set per week (about 7 per day) after the last significant edit to exit the Learning phase cleanly.
  - Sanity-check budget against target CPA: `Weekly Budget ≈ 50 × Target CPA` (or `Daily Budget ≈ 7 × Target CPA`).
  - If the store's budget cannot reach about 50 purchases per week at target CPA, keep structure tightly consolidated (one core campaign rather than several micro-campaigns).
  - Avoid frequent significant edits that reset learning, including targeting edits, creative additions or edits, optimization event changes, or pausing an ad set for 7 days or longer.
  - Meta evaluates budget and bid-control edits by magnitude rather than a universal percentage cutoff. Check the "Last significant edit" column in Ads Manager before editing, and size any approved budget change using the scaling gates in [optimization-rules.md](optimization-rules.md) instead of a fixed percentage rule.

## 3. True creative diversification

Meta treats 10 slight headline or color tweaks of the same video as one concept, so they saturate one audience pocket quickly.

Plan creative volume around distinct concepts, formats, and buyer motivations (typically 8 to 15 active ads in a mature Advantage+ campaign, scaled to budget):

- Distinct angles: test problem framing, product-use demonstration (avoiding prohibited before-and-after health or body claims), founder story, and UGC testimonials. Add objection handling (price, sizing, shipping, durability) and bundle-value offers as distinct concepts.
- Distinct formats and placements: combine `9:16` Reels and Stories native video, `4:5` feed static comparisons, catalog carousels, and creator talking-head demos alongside studio product shots. Use Placement Asset Customization from [official-meta-methods.md](official-meta-methods.md) so assets fit each surface without splitting ad sets.
- Testing discipline: test new concepts against clear stopping rules (spend threshold relative to target CPA, thumbstop and hold rate, outbound CTR, and realized CPA or ROAS). Keep proven winners running undisturbed while rotating out fatigued ads that show rising frequency, declining CTR, and rising CPA.

## 4. Attribution and Shopify reconciliation checks

- Compare Meta's default 7-day click and 1-day view setting against 1-day click and 7-day click breakdowns. Large view-through inflation often signals remarketing overlap with branded search or email and SMS flows.
- Reconcile Meta attributed revenue against Shopify total net sales, new-customer revenue, MER (total revenue divided by total ad spend), and UTM-tagged orders. Never sum Meta ROAS, Google ROAS, and Klaviyo revenue as realized store revenue.

## 5. Verification before closing

1. Confirm Events Manager shows healthy `Browser • Server` deduplication, no active error banners, and verified Purchase EMQ.
2. Confirm Existing Customer audience definitions and catalog match rate (`content_ids`) before changing spend.
3. Log exact baseline attribution window, spend, CPA, and Shopify new-customer revenue before any approved campaign edit.
