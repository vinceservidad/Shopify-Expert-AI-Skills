# Official Meta Methods Playbook for Shopify

Use this playbook alongside [campaign-framework.md](campaign-framework.md), [optimization-rules.md](optimization-rules.md), and [advantage-plus-capi.md](advantage-plus-capi.md). Confirm exact labels inside the live account because Meta renames controls periodically.

Official references:
- Meta Performance 5 framework: <https://www.facebook.com/business/news/meta-performance-5-techniques>
- Meta Experiments overview: <https://www.facebook.com/business/help/1915029282150425>
- Meta A/B testing: <https://www.facebook.com/business/help/1738164643098669>
- Meta Conversion Lift: <https://www.facebook.com/business/help/221353413010930>
- Meta ad auctions and Total Value: <https://www.facebook.com/business/help/430291176997542>
- Meta bid strategies: <https://www.facebook.com/business/help/1619591734742116>
- Advantage+ catalog ads: <https://www.facebook.com/business/help/397103717129942>
- Create product sets from a catalog: <https://www.facebook.com/business/help/741923962861190>
- Create Advantage+ catalog ads: <https://www.facebook.com/business/help/1132465490107046>
- Shopify Facebook and Instagram by Meta channel: <https://help.shopify.com/en/manual/online-sales-channels/facebook-instagram-by-meta>
- Placement asset customization: <https://www.facebook.com/business/help/1044825198987622>
- Placement asset customization specs: <https://developers.facebook.com/documentation/ads-commerce/marketing-api/dynamic-creative/placement-asset-customization>
- Meta Advantage+ creative: <https://www.facebook.com/business/help/297506218282224>
- Partnership ads: <https://www.facebook.com/business/help/342728904797642>
- Meta Advertising Standards: <https://transparency.meta.com/policies/ad-standards/>
- Meta Business Support Home: <https://www.facebook.com/business-support-home>
- Disabled ad account troubleshooting: <https://www.facebook.com/business/help/968402779873601>

## 1. Performance 5 pillar 5: Results Validation

Meta's Performance 5 framework pairs four delivery practices (account simplification, automation, creative diversification, and Conversions API data quality) with a fifth pillar: Results Validation. Platform attribution models credit across touchpoints, while controlled experiments test whether a change or campaign actually caused additional orders.

### Meta Experiments and A/B testing

Use Ads Manager Experiments (`All Tools -> Experiments`) to run randomized A/B tests when choosing between specific campaign decisions.

- Audience isolation: Meta splits eligible users into non-overlapping random groups so test cells do not compete against each other in the auction.
- Single-variable rule: test one variable at a time, such as creative concept, audience setup, placement mix, or bid strategy. Changing several variables at once makes the result unreadable.
- Decision metric: choose a business-aligned primary metric such as cost per purchase or purchase ROAS rather than calling a winner early on CTR.
- Runtime discipline: check Meta's estimated statistical power before launch, hold budgets equal across cells, and wait for the test window to finish before shifting spend.

### Conversion Lift and holdout incrementality

Use Conversion Lift when you need to know how many Shopify orders happened because of Meta ads rather than organically or through email and search.

- Holdout design: Meta splits eligible shoppers into a test group (eligible to see your ads) and a control group (held out from seeing the tested ads).
- Causal output: Meta compares purchases across both groups using Pixel, Conversions API, or offline order data to report incremental conversions, cost per incremental conversion, and lift percentage.
- When to run lift: prioritize a lift study when platform ROAS rises while Shopify new-customer revenue stays flat, when view-through attribution dominates reporting, or before a large quarterly budget expansion.
- Eligibility check: Conversion Lift availability and minimum conversion volume depend on the ad account and test scope. Confirm eligibility inside Experiments before promising a holdout test.

## 2. Bid strategies and auction mechanics

### Total Value auction mechanics

Meta does not award an impression to the highest monetary bid alone. Every ad auction ranks competing ads by Total Value across three factors:

1. Advertiser bid: what you are willing to pay for your optimization event under your chosen bid strategy and budget.
2. Estimated action rate: Meta's prediction that a specific person will complete your target event after seeing the ad.
3. Ad quality: quality signals derived from user feedback (such as hides or reports) and low-quality attributes (such as clickbait or poor post-click experience).

Because Total Value weighs predicted conversion rate and ad quality alongside the bid, stronger creative relevance and a faster Shopify checkout can lower auction costs more reliably than raising bids alone.

### Choosing a Meta bid strategy

| Strategy | Control type | How Meta bids | Best Shopify use case | Main failure mode |
| --- | --- | --- | --- | --- |
| Highest Volume | Spend-based | Spends the full budget to get the most results available | New campaigns, baseline CPA discovery, and exiting learning | CPA rises during weak demand or auction spikes |
| Cost Per Result Goal | Goal-based | Targets an average cost per result at or below your goal | Protecting contribution-margin CPA on proven products | Under-delivery if the goal sits below auction clearing cost |
| ROAS Goal | Value-based | Targets an average purchase return near or above your ratio | Multi-price catalogs with accurate Pixel and CAPI values | Under-delivery or low volume if purchase values are sparse |
| Bid Cap | Manual ceiling | Never bids above your cap in any single auction | Advanced accounts with tight auction clearing benchmarks | Delivery stops when market CPMs exceed the hard cap |

### Diagnosing under-delivery on goal or cap controls

When a Cost Per Result Goal, ROAS Goal, or Bid Cap ad set fails to spend its daily budget, check these causes in order before raising caps blindly:

1. Tracking and value integrity: verify Pixel and CAPI `Purchase` events, deduplication, and `value` accuracy in Events Manager. Missing events starve estimated action rate.
2. Unrealistic target: compare the goal against recent 14-day to 30-day realized CPA or ROAS in the same account. Setting a goal far tighter than historical clearing cost blocks auction entry.
3. Insufficient conversion volume: check whether the ad set sits in Learning Limited with fewer than about 50 optimization events per week. Consolidate fragmented ad sets rather than adding more micro-budgets.
4. Audience or creative bottleneck: check narrow targeting, heavy exclusions, and ad quality diagnostics. Weak creative or a slow Shopify product page lowers Total Value even with a fair bid.
5. Controlled recovery: if a capped ad set stalls, widen the goal in measured steps or test a parallel Highest Volume cell to re-establish current clearing CPA before tightening controls again.

## 3. Advantage+ Catalog Ads and Commerce Manager feed structure

Advantage+ Catalog Ads (formerly dynamic ads) pull titles, prices, and product imagery from your Commerce Manager catalog to show relevant SKUs to broad shoppers and site visitors automatically.

### Product sets and margin custom labels

Do not promote an entire Shopify catalog blindly if accessories, low-margin items, or clearance SKUs absorb spend.

- Margin tagging: populate `custom_label_0` through `custom_label_4` in the product feed with internal business tiers that shoppers never see. Common tags include contribution-margin band, bestseller status, seasonal collection, and price tier.
- Product sets: in Commerce Manager, filter products by custom label, product type, or price to create dedicated product sets (for example, high-margin hero products separated from low-AOV add-ons).
- Ad set alignment: assign the matching product set at the ad set level so budget concentrates on inventory that supports acquisition economics.

### Out-of-stock suppression and required feed fields

- Stock sync: confirm the Shopify Facebook and Instagram channel or scheduled feed updates `availability` promptly (`in stock`, `out_of_stock`, or `preorder`).
- Suppression rule: exclude out-of-stock items from active product sets so Advantage+ catalog ads do not waste impressions on dead variants.
- Core feed fields: audit `id`, `title`, `description`, and `price` (with a 3-letter ISO currency code). Also verify `availability`, `condition`, `link`, and `image_link`. Confirm `brand` or unique identifiers (`gtin` or `mpn`) are populated and that variant products share an `item_group_id`.

### Catalog match rate diagnostics

Open Commerce Manager and inspect the Events tab to check the catalog match rate connecting `ViewContent`, `AddToCart`, and `Purchase` events to catalog items.

- Target threshold: aim for 90% or higher match rate. Rates below 75% weaken dynamic retargeting and product-level optimization.
- ID alignment: confirm the `content_ids` fired by Shopify Pixel and Conversions API match the exact `id` or `item_group_id` stored in the catalog. A frequent Shopify defect occurs when events send variant IDs while a secondary feed uploads parent product IDs (or the reverse).
- Dataset linkage: verify the active Pixel and Conversions API dataset is connected to the exact catalog attached to your Ads Manager campaigns, and remove duplicate tracking apps sending conflicting IDs.

## 4. Placement Asset Customization, Advantage+ Creative, and Partnership Ads

### Placement Asset Customization

Use Placement Asset Customization (PAC) inside a single ad rather than splitting Feeds, Stories, and Reels into separate ad sets.

- Aspect ratios: provide native `9:16` vertical media for Stories and Reels, and `4:5` (or `1:1`) media for Facebook and Instagram Feeds.
- Safe zones: keep primary text hooks, captions, logos, and product focal points clear of top handle overlays and bottom CTA bars on `9:16` placements.
- Learning benefit: keeping all placements under one ad preserves consolidated delivery data while avoiding distorted automatic crops.

### Advantage+ Creative enhancement audits

Meta Advantage+ creative can apply automated edits at the ad level, including visual touch-ups, image expansion, text swaps, and music overlays.

- Audit every toggle before launch: review each enabled enhancement in Ads Manager and inspect placement previews across Feed, Stories, and Reels.
- Disable brand or policy risks: turn off automatic enhancements that crop packaging, alter regulated copy, add off-brand music, or generate awkward backgrounds on hero product shots.
- Keep helpful variants selectively: allow text combinations or aspect-ratio adjustments only after verifying that every rendered preview stays accurate to the Shopify offer.

### Creator Partnership Ads

Partnership Ads (formerly branded content ads) let a Shopify brand run paid ads from a creator's or partner's identity, either paired with the brand handle or using the partner handle, with ranking signals from both accounts.

- Permission setup: obtain explicit partner authorization through a content-level partnership ad code or account-level access in Meta's Partnership Ads Hub. The creator keeps control over access permissions, while the brand controls targeting, budget, and bidding in Ads Manager.
- Creative pairing: combine Partnership Ads with Placement Asset Customization so creator Reels stay native in `9:16` while Feed placements render cleanly.
- Testing discipline: compare creator Partnership Ads against brand-handle controls in the same campaign or an A/B test. Do not assume every creator asset outperforms brand creative without checking purchase CPA and new-customer quality.

## 5. Meta Advertising Standards and ad-account restriction triage

Meta's automated and human reviews inspect ad creative, ad copy, and the destination Shopify landing page together under Meta Advertising Standards.

### Personal Attributes policy

Ads and landing pages cannot assert or imply direct knowledge of a viewer's personal characteristics, including medical or mental health conditions, age, financial hardship, or other protected traits.

- Avoid second-person diagnosis or assumption: replace lines like "Struggling with acne?" or "Tired of joint pain?" with neutral product framing such as "Daily skincare routine for blemish-prone skin" or "Support for active joints."
- Audit reviews and headlines on the destination page: clean ad copy still gets rejected if the Shopify landing page headline immediately calls out a viewer's medical condition or personal flaw.

### Health, wellness, and before-and-after rules

Health, supplement, fitness, and cosmetic stores face strict enforcement.

- Prohibited claims: do not claim to cure, treat, or prevent diseases, and avoid unrealistic time-bound promises (such as guaranteed weight loss in a fixed number of days).
- Before-and-after imagery: avoid side-by-side physical transformation grids, close-up body-shaming shots, or content that promotes negative self-perception. Show product ingredients, usage process, and experience-focused customer feedback instead.
- Age and tracking controls: apply required 18+ targeting for restricted wellness or weight-management categories, and prevent sensitive health terms or diagnostic quiz fields from leaking into Pixel or Conversions API URLs and custom events.

### Landing-page continuity

Meta evaluates the post-click experience alongside the ad.

- Message and offer match: verify that product claims, discounts, and pricing on the Shopify page match the ad text verbatim.
- Page functionality and trust: fix broken links, remove blocking pop-ups on load, avoid fake countdown timers, and keep visible Contact, Privacy Policy, and Terms links in the storefront footer.

### Ad-account restriction triage workflow

When an ad is rejected or an ad account, Page, or Commerce account is restricted, follow this order:

1. Check Business Support Home: open <https://www.facebook.com/business-support-home> to record the exact restricted asset, violation date, and cited policy category.
2. Stop circumvention behavior: do not duplicate rejected ads with minor text tweaks, create a new ad account to work around a disabled account, or spam appeals. Circumvention triggers stricter account-level blocks.
3. Audit the full funnel: review ad media, overlays, primary text, and the destination Shopify URL (including customer review widgets, before-and-after galleries, and pop-ups) against Meta Advertising Standards.
4. Remediate before requesting review: edit or remove confirmed policy violations first, then submit one concise review request in Business Support Home (or provide factual documentation if the flag is a clear false positive).
5. Protect active operations: document the case ID, keep compliant live campaigns untouched where permitted, and verify payment method and Business Manager admin security while awaiting Meta's decision.
