# Reorder Planning and Purchase Orders

Use this when a client asks what to reorder, how much, and when. Inventory counts come from Shopify. Lead times, case packs, costs and budgets come from the client or supplier. Never guess them.

## Prerequisites

- Current stock per SKU and location (connected toolkit, inventory export, or the daily store check).
- Units sold per SKU over a stated window. The `inventory` or `sales` reports work when `read_reports` is granted, or use an order export.
- From the client, per supplier:
  - lead time in days
  - minimum order quantity and case pack
  - unit cost and currency
  - budget limit
  - target days of cover
- Known demand changes: promotions, seasonality, launches, discontinued items.

## Ordered steps

1. **Daily rate.** For each SKU: average daily units = units sold in the window ÷ days in the window. Exclude days the SKU was out of stock when the client can identify them. Say whether you did.
2. **Reorder point.** Reorder point = daily units × lead time days + safety stock. Safety stock comes from the client. If they have none, show the plan with 0 safety stock and label it as an assumption.
3. **Order quantity.** Order quantity = daily units × target days of cover − current stock − units already on order. Round up to the case pack and the minimum order quantity. If the result is 0 or less, don't order.
4. **Budget.** Total each supplier: order quantity × unit cost. Over budget, rank SKUs by the client's priority (margin, sell-through or best sellers) and cut from the bottom. Show what was cut.
5. **Draft the purchase order.** Use the client's tool: Shopify purchase orders, an inventory app or a spreadsheet. Confirm which one exists in their admin first, because availability varies by plan and app. Keep it as a draft until the owner approves.
6. **After receiving.** Compare received units to the purchase order and record any short or damaged units. Confirm that Shopify stock went up by the received amount at the right location.

## Stop gates

- No purchase order is sent to a supplier without the owner's approval of quantities and total cost.
- Stop if a SKU's sales window includes a stockout the client can't date. Its daily rate is understated.

## Output

| SKU | Location | On hand | On order | Daily units | Lead time | Reorder point | Order qty | Unit cost | Line total | Note |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |

List assumptions (safety stock, excluded days, demand changes) under the table.
