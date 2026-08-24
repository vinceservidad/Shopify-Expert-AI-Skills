# Reporting Framework

## Metric contract

```yaml
metric_name:
business_question:
formula:
numerator:
denominator:
unit:
source:
population:
filters:
event_or_order_status:
timezone:
currency_and_fx:
attribution:
freshness:
owner:
known_limits:
```

## Commercial metrics

Name every included component. Examples:

```text
Net revenue = gross sales - discounts - returns, using the named Shopify field.
```

```text
Contribution profit = net revenue - cost of goods sold - payment fees -
fulfillment - shipping subsidy - media cost.
```

These are examples only. Use the business's approved definitions and verify whether the source fields already include deductions.

## Reconciliation table

| Source | Metric definition | Scope and attribution | Reported value | Difference from ledger | Explanation status |
| --- | --- | --- | --- | --- | --- |
| Shopify | Defined order or net-revenue field | Named status, market, period | Value | Baseline or difference | Observed |
| GA4 | Purchase event value | Identity, consent, attribution, timezone | Value | Calculated | Investigate or explained |
| Ad platform | Attributed conversion value | Named window and model | Value | Calculated | Not additive |

## Report hierarchy

1. Decision and primary business outcome
2. Data quality and freshness
3. Actual versus comparison and target where sourced
4. Decomposition and important segments
5. Attributed channel views under named settings
6. Risks, unknowns, and decisions

Avoid dashboard decoration that does not change a decision.

## Status language

- `on track` requires a sourced target and current comparable result
- `improved` requires a defined comparison
- `profitable` requires a named profit definition and positive result
- `caused` requires appropriate causal evidence
- `tracked` does not mean correctly attributed or reconciled
