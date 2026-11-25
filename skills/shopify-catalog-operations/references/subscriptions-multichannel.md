# Subscriptions & Multi-Channel Sales Sync Playbook

Official starting points:
- <https://help.shopify.com/en/manual/online-sales-channels> (Sales channels)
- <https://help.shopify.com/en/manual/products/purchase-options/subscriptions> (Shopify subscriptions)

Use this playbook when managing catalog, inventory, and pricing across **multiple sales channels** (TikTok Shop, Shop App, Amazon/eBay connectors, Meta/Google channels) or maintaining **subscription selling plans** (Shopify Subscriptions, Recharge, Skio, Appstle). Confirm actual installed channel apps and subscription tools before proposing changes.

## 1. Multi-Channel Sales Sync (TikTok Shop, Shop App, Amazon, Social)

When a store sells the same inventory across Online Store + marketplaces, most VA fire drills stem from **SKU mismatches, overselling, or channel policy rejections**.

### Core channel checks

1. **Single source of truth for SKU & inventory**:
   - Confirm every variant has a **unique, non-blank SKU** (and valid UPC/EAN barcode where required by Amazon, Google, or TikTok Shop). Blank or duplicate SKUs break channel inventory sync and cause overselling.
   - Verify which system owns stock updates (Shopify vs. 3PL/WMS vs. connector app) so two apps are not overwriting inventory in opposite directions.
2. **Inventory safety buffers**:
   - For fast-moving SKUs synced to high-velocity channels (TikTok Shop viral spikes, Amazon), recommend an owner-approved safety buffer or channel allocation rule to prevent overselling before sync intervals catch up.
3. **Channel publishing & compliance**:
   - **Shop App (Shop Channel)**: Verify clean primary images, accurate fulfillment SLA/tracking sync, clear return policy, and Shop Pay eligibility so products stay eligible in Shop search and recommendations.
   - **TikTok Shop**: Check strict fulfillment SLA windows (late dispatch triggers shop health points/penalties), prohibited-claim wording in titles/descriptions, category approvals, and sample/creator order inventory tracking.
   - **Amazon / eBay connectors**: Confirm price parity rules, tax/fee margin differences, variant mapping (parent/child structure), and whether FBA vs. FBM inventory is separated cleanly from Shopify fulfillment locations.
4. **Channel error queue review (weekly)**:
   - Export or list rejected/unmapped SKUs by channel, group by root cause (missing barcode, missing category, restricted wording, image ratio, missing weight), and prepare one clean bulk fix batch instead of random manual edits.

## 2. Subscription Catalog & Selling-Plan Operations

1. **Selling-plan integrity**: Verify every subscription-eligible product is attached to the right selling plan group (delivery frequency, discount percentage, minimum billing cycles if any) and that discontinued/out-of-stock SKUs are flagged before upcoming renewal dates.
2. **Pre-renewal stock watch**: Cross-check upcoming subscription renewals (next 7–14 days) against available inventory so recurring subscribers do not get failed/backordered shipments during a promo spike.
3. **Price or SKU swaps**: Never change a subscription SKU, delete a variant, or raise subscription prices without verifying how the subscription app handles existing active contracts (some apps keep legacy variant IDs and fail renewals if a variant is deleted).
4. **Failed-payment (dunning) & churn review**: Track involuntary churn (expired cards / failed retries) separately from voluntary cancels (too much product, price, shipping delay). Route customer-facing skip/swap/cancel retention replies to `shopify-support` and renewal/dunning flows to `shopify-email-marketing`.

## 3. Verification before closing

1. After any approved SKU, price, or selling-plan edit, verify sync status in the connected channel app AND inspect one live storefront/channel listing.
2. Confirm no unmapped variants or duplicate SKUs remain in the exception log before marking the batch complete.
