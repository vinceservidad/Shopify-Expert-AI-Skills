# Flow Specification Examples

These examples are abstract. Replace every task name and field with verified account-visible values.

## Low-stock internal alert

```yaml
decision: notify operations when a sellable variant crosses its approved stock threshold
trigger: verified inventory-change event
conditions:
  - tracked inventory is enabled
  - sellable quantity is at or below the variant-specific threshold
  - alert marker for the current low-stock episode is absent
actions:
  - create an internal alert using an approved channel
  - mark the episode as alerted using an approved reversible field
reset: remove the episode marker only after inventory recovers above the reset threshold
privacy: include product and inventory identifiers, not customer data
stop: disable on alert storm, bad threshold data, or action failure
```

The reset threshold can differ from the alert threshold to prevent repeated boundary alerts. The values must come from operations, not from a universal rule.

## High-value-order review queue

```yaml
decision: route qualifying orders for internal review without delaying normal orders by default
trigger: authoritative order event
conditions:
  - named order-value definition exceeds the approved threshold
  - order is not already queued
actions:
  - add an approved internal marker
  - notify the approved review queue with minimized data
exceptions:
  - canceled, test, duplicate, or excluded orders
manual_fallback: documented review procedure and owner
```

Do not imply fraud or cancel an order solely because it has high value.

## Test matrix

| Case | Input | Expected branch | Expected action | Must not happen |
| --- | --- | --- | --- | --- |
| Positive | Meets all verified conditions | True | One approved action | Duplicate action |
| Negative | Excluded resource | False | None | Tag or notification |
| Boundary | Value equals threshold | Defined by spec | Defined by spec | Ambiguous behavior |
| Duplicate | Same event delivered twice | One effective result | Idempotent handling | Repeated external effect |
| Missing field | Required field absent | Safe failure path | Alert or queue | Destructive default |
| Action failure | External task fails | Recovery path | Logged failure | False completion |
