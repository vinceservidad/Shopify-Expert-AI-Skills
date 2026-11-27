# Review stock

Workflow ID: `stock_review`. Identify inventory exceptions for the owner's chosen scope and thresholds. Run on request; this review does not monitor in the background, place orders, or change stock.

## Inputs

Required to prepare the task:

- `stock_scope`: exact store, variants, locations, markets if relevant, quantity type, and exclusions.
- `inventory_records`: variant/inventory-item IDs, tracking state, inventory policy, location quantities, timestamps, and page coverage.
- `stock_thresholds`: merchant-approved thresholds with comparator, quantity type, applicable variants/locations, and effective date.

Optional inputs, required for a supported replenishment decision:

- `sales_history`: demand window, units, returns/cancellations treatment, and scope.
- `lead_times`: supplier timing, uncertainty, and relevant replenishment rules.
- `approval_roles`: accountable inventory owner and permitted actions.

Never substitute an example threshold for the owner's rule. If thresholds are missing, return the data-quality/coverage review and the exact threshold decision needed; withhold “low stock” classification. Input names alone do not verify their values.

## Procedure

1. Confirm variant and location scope. Name the quantity type being compared, such as `available`; do not equate it with on-hand, incoming, or committed stock.
2. Read variant/tracking evidence with existing variant tools and location quantities with existing inventory tools. Record timestamps and each connection's `hasNextPage` and cursor.
3. Apply only the owner's threshold for the relevant quantity, variant, and location. State the comparator, so a rule “below 5” does not flag 5 as below it.
4. Keep untracked inventory separate. An absent quantity for an untracked or inaccessible item is unknown, not zero. Flag negative observed quantities as exceptions needing investigation; do not silently set them to zero.
5. Report per-location findings. Aggregate only when the owner supplied aggregation rules and all relevant locations were inspected; avoid combining inaccessible or incomplete locations into an apparent total.
6. Identify pagination, missing records, stale timestamps, and missing rules. A partial page supports findings for inspected records only.
7. Prepare owner decisions and next reads. Reorder timing or quantities require supported demand, lead times, and merchant rules; stock thresholds alone are insufficient.

## Reusable stock report

```text
Store / variants / locations / exclusions:
Read time / inventory quantity type:
Threshold source / effective date / comparator:
Variant pages and location pages inspected / pages remaining:
```

| Variant / SKU | Location | Tracked? | Observed quantity/type | Owner rule | Finding | Next action / owner |
| --- | --- | --- | --- | --- | --- | --- |
| [ID/SKU] | [location] | [yes/no/unknown] | [value or unavailable] | [rule or missing] | [exception/no exception in inspected data/unclassified] | [read/decision] |

```text
Untracked or unavailable inventory:
Negative quantities needing investigation:
Missing thresholds / locations / pages:
Replenishment evidence available or missing:
Coverage-limited conclusion:
```

## QA and escalation

- Every classification uses an approved threshold and the correct quantity/location.
- Zero, negative, untracked, unavailable, and uninspected states are distinct.
- Partial pagination is visible and never becomes “all stock checked.”
- A missing location does not become zero or part of an asserted complete total.
- No reorder quantity or delivery date is invented from stock alone.
- Inventory adjustments, purchase orders, and settings changes require separate exact authority.

Escalate negative quantities, conflicting rules, stock records that cannot be matched, and urgent exceptions under the owner's policy. A later handoff to a separate approved editing connection must state the exact inventory item/location/quantity, existing approval, pre-change evidence, and saved-state verification. A failed adjustment remains unresolved. Client threshold documents and exports stay in chat/project files, not the MCP.

## Practice example

Synthetic owner rule: flag tracked `available` stock below 5 at Main. Variant `201`: Main = 3. Variant `202`: untracked, quantity absent. Variant `203`: Main = -1. Location connection has another page.

Expected judgement: flag `201` under the supplied rule, list `202` as untracked/unknown, and flag the negative quantity for `203`. State that other locations remain uninspected. Without sales history and supplier lead times, do not calculate a reorder. Reviewer criterion: each finding preserves the quantity type, location, and evidence boundary.

## Source notes

Reviewed 2026-09-30. This original review applies inventory support as an ecommerce VA task and the need for documented instructions and owner review. It excludes historical pricing and platform recommendations.

- [How To Become a Virtual Assistant](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant), published August 7, 2025.
- [How to Hire a Virtual Assistant for Shopify](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services), published August 17, 2022.
