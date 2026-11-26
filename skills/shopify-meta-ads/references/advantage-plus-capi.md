# Meta Advantage+ Shopping & Conversions API (CAPI) Playbook

Official starting points:
- <https://help.shopify.com/en/manual/online-sales-channels/facebook-instagram-by-meta> (Facebook & Instagram by Meta channel)
- <https://www.facebook.com/business/help/2041148702652965> (Conversions API overview)

Use this playbook when auditing Meta Advantage+ Shopping Campaigns (ASC / Advantage+ Sales), Shopify CAPI + Pixel setup, Event Match Quality, learning-phase budgets, or creative diversification. Confirm actual account-visible labels because Meta periodically renames Advantage+ campaign controls.

## 1. Shopify Facebook & Instagram channel + CAPI setup

- **Data Sharing level**: Check `Shopify Admin → Sales channels → Facebook & Instagram → Settings → Share data`.
  - Confirm **Maximum** data sharing is enabled (when allowed by the merchant's privacy/consent policy) so Shopify sends both browser Pixel events and server-side Conversions API (CAPI) events, including Checkout Extensibility events.
  - Avoid running a second manual Pixel or duplicate GTM Meta tag firing the same `Purchase` event unless event deduplication is explicitly verified.
- **Event deduplication (`event_id`)**:
  - In Meta Events Manager → `Overview` → select `Purchase`, `InitiateCheckout`, `AddToCart`, `ViewContent` → inspect **Connection Method** (`Browser • Server`) and **Deduplication**.
  - Confirm `event_id` matches across browser and server pairs so Meta deduplicates rather than double-counting conversions.
- **Event Match Quality (EMQ)**:
  - Check **Purchase EMQ** in Events Manager. Aim for **6.0+ (Good/Great)** on `Purchase` by passing hashed customer parameters where consented (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`, `external_id`, `fbp`, `fbc`, `client_ip_address`, `client_user_agent`).
  - Verify `value`, `currency`, `content_ids` (matching catalog SKU/variant/item group IDs), and `content_type` (`product` or `product_group`) on `ViewContent`, `AddToCart`, and `Purchase` so Advantage+ catalog ads match products accurately.
- **Consent & domain verification**: Confirm Meta Business Manager domain verification is active and customer privacy/cookie consent behavior in EEA/UK/US states aligns with Shopify Customer Privacy settings.

## 2. Advantage+ Shopping / Sales campaign architecture

- **Consolidation over fragmentation**: Meta's delivery system performs best with fewer overlapping ad sets competing in the same auction. Avoid splitting identical products across multiple small-budget campaigns targeting overlapping broad audiences.
- **Existing customer budget cap**:
  - Define **Existing Customers** in Advertising Settings using verified Shopify customer lists + pixel purchasers so reporting separates new-customer acquisition from retention/remarketing.
  - Apply an existing-customer budget cap (when available and supported by the store's acquisition goal) so Advantage+ does not inflate platform ROAS by overspending on repeat buyers who would have purchased via email/direct.
- **Learning-phase budget math**:
  - Meta generally needs roughly **50 optimization events per ad set per week** (~7/day) to exit the Learning phase cleanly.
  - Sanity-check budget against target CPA: `Weekly Budget ≈ 50 × Target CPA` (or `Daily Budget ≈ 7 × Target CPA`).
  - If the store's budget cannot reach ~50 purchases/week at target CPA, keep structure tightly consolidated (one core campaign rather than 5 micro-campaigns) and avoid frequent destructive edits (>20% budget jumps, target changes, or pausing/unpausing active winners mid-week) that reset learning.

## 3. True creative diversification

Meta treats 10 slight headline or color tweaks of the same video as one concept, so they saturate one audience pocket quickly.

Plan creative volume around **distinct concepts, formats, and buyer motivations** (typically 8–15 active ads in a mature Advantage+ campaign, scaled to budget):

- **Distinct angles**: problem/agitation, before/after demonstration, founder story, social proof/UGC testimonial, objection handling (price, sizing, shipping, durability), comparison vs. old alternative, bundle/offer value.
- **Distinct formats & placements**: 9:16 Reels/Stories native video, 4:5 feed static/graphic comparison, carousel/collection catalog ads, high-contrast product benefit callouts, lo-fi creator talking-head vs. studio product demo.
- **Testing discipline**: Test new concepts against clear stopping rules (spend threshold relative to target CPA, thumbstop/hold rate, outbound CTR, and realized CPA/ROAS). Keep proven winners running undisturbed while rotating out fatigued ads (rising frequency + declining CTR + rising CPA).

## 4. Attribution & Shopify reconciliation checks

- Compare Meta's default **7-day click / 1-day view** against **1-day click** and **7-day click only** breakdowns. Large view-through inflation often signals remarketing overlap with branded search or email/SMS flows.
- Reconcile Meta attributed revenue against Shopify total net sales, new-customer revenue, MER (total revenue ÷ total ad spend), and UTM-tagged orders. Never sum Meta ROAS + Google ROAS + Klaviyo revenue as realized store revenue.

## 5. Verification before closing

1. Confirm Events Manager shows healthy `Browser • Server` deduplication, no active error banners, and verified Purchase EMQ.
2. Confirm Existing Customer audience definitions and catalog match rate (`content_ids`) before changing spend.
3. Log exact baseline attribution window, spend, CPA, and Shopify new-customer revenue before any approved campaign edit.
