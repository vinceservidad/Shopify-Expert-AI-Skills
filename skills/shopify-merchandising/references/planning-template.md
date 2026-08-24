# Merchandising Planning Templates

## Collection plan

```yaml
collection:
customer_and_task:
market:
objective:
primary_business_outcome:
product_roles:
membership_or_source:
sort_logic:
filters:
product_card_fields:
out_of_stock_behavior:
seasonal_dates:
internal_links:
navigation:
measurement:
commercial_guardrail:
inventory_guardrail:
owner:
authorization:
rollback:
```

## Campaign merchandising plan

```yaml
campaign:
audience:
one_offer:
eligible_products:
excluded_products:
price_and_discount_truth:
inventory_reservation_or_threshold:
landing_collection:
hero_order:
supporting_recommendations:
channels_and_markets:
start_and_end:
failure_or_sellout_behavior:
```

## QA

- every included product matches the intended customer task
- titles, cards, price, offer, variants, availability, and badges are truthful
- collection membership and sort match the approved plan
- unavailable, excluded, or low-capacity products follow the defined behavior
- filters and navigation help discovery
- bundles and recommendations are compatible and operationally feasible
- live pages work on scoped markets and devices
- tracking identifies the relevant surface and business outcome
- previous state and rollback are recorded
