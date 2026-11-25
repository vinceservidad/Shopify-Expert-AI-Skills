# Shipping Profiles, Carrier Rates & 3PL / Supplier Exceptions Playbook

Official starting points:
- <https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/shipping-profiles> (Shipping profiles)
- <https://help.shopify.com/en/manual/fulfillment/fulfilling-orders> (Fulfilling orders)

Use this playbook when auditing checkout shipping errors, free-shipping thresholds, dimensional weight surcharges, or stuck 3PL / dropshipping / supplier fulfillment orders. Confirm live store shipping profiles and fulfillment-service settings before proposing changes.

## 1. Shipping profile & checkout rate audit

When shoppers report *"Shipping not available for the selected address"* or unexpected checkout prices, trace this exact chain:

1. **Product → Shipping Profile**: Check whether the product sits in the General profile or a Custom shipping profile. Every product must belong to a profile with rates for the customer's shipping zone.
2. **Profile → Fulfillment Location**: Confirm the stocked location has online fulfillment enabled (`Fulfill online orders from this location`) and is attached to the same shipping profile.
3. **Combined-profile rate summing**: If a cart contains one item from Profile A and one item from Profile B, Shopify **adds** the two shipping rates together at checkout unless overlapping rate names/rules are designed intentionally. Check multi-profile carts explicitly.
4. **Weight & package dimensions**: Missing product variant weights (`0.0 lb/kg`) or oversized default box dimensions break carrier-calculated rates (USPS, UPS, FedEx, DHL) and cause surprise carrier dimensional-weight adjustments on invoices.
5. **Free-shipping threshold math**: Verify whether the store's free-shipping threshold sits **above** current median order value + contribution margin floor, and confirm whether it triggers on pre-discount or post-discount cart subtotal.

## 2. 3PL, dropshipping & supplier fulfillment exceptions

| Exception | Common root cause | Safe VA check & action |
| --- | --- | --- |
| **Order stuck in `Unfulfilled` past SLA** | 3PL/WMS webhook missed, SKU mismatch between Shopify and 3PL, address validation failure (missing apartment/postal format), or out-of-stock at assigned warehouse | Verify exact SKU match, address format, and fulfillment-order status (`Open` vs. `Submitted` vs. `In progress`) before requesting manual re-sync |
| **Tracking number missing or never scans (`Label Created` > 48–72h)** | Carrier missed origin scan, supplier uploaded pre-generated tracking before handover, or parcel lost at warehouse dock | Check carrier scan log + 3PL/supplier portal; open a carrier/3PL trace ticket before promising delivery dates to the buyer |
| **Dropshipping app failure (e.g., DSers / supplier portal)** | Variant unmapped after supplier edited options, supplier out of stock, or payment method limit hit on supplier side | Reconcile exact variant mapping and lead time; pause ads/hide unavailable variant with owner approval rather than substituting an unapproved item |
| **Split shipment confusion** | Multi-item order routed across two warehouses or mixed in-stock + preorder items | Verify both fulfillment orders and tracking links; prepare one clear support update explaining separate parcels |
| **Restock / PO delay** | Supplier shipment delayed at port/customs while Shopify still shows `Continue selling when out of stock` | Confirm revised ETA with supplier, check `incoming` inventory transfer dates in Shopify Admin, and flag owner to update product-page delivery notice |

## 3. Safe change & verification checklist

1. Capture current shipping zones, rate rules, and profile product assignments before editing.
2. Never edit live shipping rates during a peak promo without a documented rollback and test-cart check.
3. Test at checkout (without completing a live customer payment) using:
   - a single-item domestic cart below and above the free-shipping threshold,
   - a multi-profile cart (if custom profiles exist),
   - an international market address (if selling cross-border),
   - a heavy/oversized SKU to verify carrier-calculated weight and box logic.
4. Confirm any 3PL cancellation in writing/portal status before reassigning an order to another warehouse so two parcels are never shipped.
