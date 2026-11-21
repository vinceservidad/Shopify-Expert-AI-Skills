# Order Workflows

Confirm current order capabilities, restrictions, permissions, and connected-service behavior in the target store.

Official starting point: <https://help.shopify.com/en/manual/fulfillment/managing-orders>

## State snapshot

```yaml
order_identifier:
market_and_currency:
order_status:
payment_status:
fulfillment_status:
return_status:
refund_status:
items_and_quantities:
inventory_state:
shipping_and_carrier_state:
fraud_or_dispute_state:
third_party_dependencies:
customer_request:
policy_version:
permissions:
```

## Edit

Before adding or removing items, quantities, discounts, shipping, or customer information, calculate the financial, tax, inventory, fulfillment, notification, app, and reporting consequences. Confirm the store supports the intended edit in the current order state.

## Capture and fulfillment

Verify payment authorization, fraud-review procedure, items, quantities, locations, inventory, address, carrier or service, tracking, split fulfillment, and external fulfillment ownership. Do not fulfill solely because payment appears authorized when a required review remains open.

## Return and refund

Keep return authorization, item receipt or inspection, exchange, refund amount, method, fees, tax, shipping, restock, inventory disposition, and customer notification distinct. Calculate and show the proposed refund before execution.

## Cancellation

Cancellation can interact with payment, refund, restock, fulfillment, shipping labels, notifications, third-party services, and already-refunded orders. Verify the current order state and Shopify's current guidance before acting.

Official current reference: <https://help.shopify.com/en/manual/fulfillment/managing-orders/canceling-orders>

## Draft orders

Verify customer, items, price, discounts, shipping, taxes, payment terms, invoice, and conversion-to-order authority. Draft creation does not authorize marking an order paid or charging a payment method.
