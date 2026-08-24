# Lifecycle Framework

## Lifecycle map

- prospect acquisition and consent
- welcome and first purchase
- browse or product interest
- cart and checkout recovery
- onboarding and post-purchase education
- delivery and service recovery
- review or feedback request
- replenishment, cross-sell, or subscription
- loyalty and high-value recognition
- lapse and win-back
- suppression, sunset, and re-permission

Not every brand needs every flow. Choose based on the customer journey, product cycle, event quality, economics, and message capacity.

## Event contract

```yaml
event:
source:
identity_key:
timestamp_and_timezone:
required_properties:
deduplication:
consent_requirement:
known_delay:
quality_check:
```

## Segment contract

```yaml
segment_name:
business_purpose:
inclusion:
exclusion:
consent_and_suppression:
refresh_behavior:
estimated_or_observed_size:
owner:
```

## Measurement

Separate:

- delivery, bounce, complaint, unsubscribe, and consent health
- opens or clicks when technically meaningful and comparable
- sessions, product views, carts, checkouts, and purchases
- attributed orders or revenue under the provider's named settings
- realized Shopify orders, net revenue, contribution profit, refunds, and retention
- incrementality from holdouts or credible comparisons

Attributed revenue across channels overlaps and should not be added together as realized revenue.

## Message brief

```yaml
customer_state:
message_job:
one_message:
approved_offer:
proof_and_source:
objections:
call_to_action:
dynamic_fields:
fallbacks:
legal_or_policy_content:
```
