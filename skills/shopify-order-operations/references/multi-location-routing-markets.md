# Shopify Markets & Multi-Location Order Routing Playbook

Official starting points:
- <https://help.shopify.com/en/manual/markets> (Shopify Markets)
- <https://help.shopify.com/en/manual/fulfillment/setup/order-routing> (Order routing rules)

Use this playbook when operating stores selling across multiple countries/currencies/catalogs (Shopify Markets) or fulfilling from multiple warehouses, retail stores, or 3PL locations. Confirm the target store's actual Markets configuration, shipping profiles, and active locations before changing fulfillment or inventory assignments.

## 1. Shopify Markets operational checks

- **Market scope & domain/subfolder setup**:
  - Verify whether each market uses the primary domain, country subfolders (e.g., `/en-ca`, `/en-gb`), or country domains, and confirm automatic geolocation redirects do not trap shoppers or block Google/Meta crawlers from inspecting market URLs.
- **Catalogs, pricing, and currency**:
  - Confirm whether market prices use automatic FX conversion + rounding rules or fixed market price lists.
  - Check product publishing per market: a product set to `Active` globally can still be excluded from a specific Market catalog, causing 404s or missing items for international customers.
- **Duties, import taxes, and DDP vs. DDU**:
  - Check whether duties and import taxes are collected at checkout (Delivered Duty Paid / DDP) or billed to the buyer on delivery (DDU).
  - Ensure HS codes (Harmonized System codes) and country/region of origin are populated on every internationally shipped product; missing HS codes break automated duty calculation and stall customs clearance.
- **Order-level reconciliation**:
  - Shopify stores both **presentment currency** (what the customer paid) and **shop currency** (store accounting currency). When calculating partial refunds, shipping adjustments, or exchanges on international orders, confirm the exact currency, FX rate, and duty/tax refund rules before executing.

## 2. Multi-location inventory & order routing rules

Shopify evaluates **Order Routing** rules in top-to-bottom priority order at checkout and order creation to assign fulfillment locations without overselling.

### Core routing rules to audit (`Settings → Shipping and delivery → Order routing`)

1. **Minimize split fulfillments**: Prefer a single location that can fulfill the entire order before splitting shipments across two warehouses (saves shipping cost and reduces customer confusion).
2. **Stay within the destination market**: Fulfill from a location inside the customer's country/market first to avoid cross-border customs delays and international shipping rates.
3. **Ship from closest location**: Pick the geographically nearest stocked location to reduce transit time and carrier zone cost.
4. **Use ranked locations**: Assign explicit priority (e.g., primary 3PL first, overflow warehouse second, retail stores last as ship-from-store fallback).
5. **Preserve safety stock / fulfillment priority**: Keep retail buffer rules or location fulfillment toggles accurate (`Fulfill online orders from this location`) so display-only or retail-only stock is not promised to online orders.

### Common multi-location failure modes

| Symptom | Likely root cause | Operational fix |
| --- | --- | --- |
| Checkout says "Shipping not available for your address" even though stock exists | Product is in a shipping profile that lacks rates for the stocked location, or location has online fulfillment disabled | Verify product → shipping profile → location → shipping zone + rate coverage |
| Frequent split shipments on multi-item orders | Inventory is scattered across locations and `Minimize split fulfillments` is below `Ship from closest location` | Reorder routing rules so `Minimize split fulfillments` ranks above distance, and review stock transfers |
| International order routed to domestic warehouse despite local 3PL stock | `Stay within the destination market` rule missing or local 3PL location not assigned to the market's shipping profile | Add/prioritize `Stay within the destination market` and confirm 3PL shipping zone mapping |
| Overselling or stuck 3PL fulfillment requests | Inventory sync lag between Shopify and 3PL/WMS, or manual fulfillment edits made in Shopify after fulfillment request was already sent to 3PL | Confirm fulfillment order state (`Submitted` vs. `In progress` vs. `Open`), coordinate cancellation with the 3PL before reassigning location |

## 3. Safe handoff & editing rules for routed orders

- **Never blindly change fulfillment location** on an order already `Submitted` or `In progress` at a 3PL without confirming the 3PL accepted the cancellation—otherwise both locations may ship duplicate packages.
- **When editing or canceling a split order**, verify each fulfillment order separately (tracking number, carrier scan state, restock location) so restocked units return to the physical location that holds them.
- **Pre-change check**: Capture current routing rule order and shipping profile assignments before modifying rules, and run a test checkout (without completing live payment, or using Bogus Gateway on a dev store) for each affected market and multi-item cart.
