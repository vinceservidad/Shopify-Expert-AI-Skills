# Meta Ads Audit and Diagnosis

## Audit map

### Business and economics

- primary business outcome and customer type
- realized net revenue and named profit level
- cost components, returns, cancellations, and contribution timing
- inventory, fulfillment, support, cash-flow, and creative capacity

### Measurement

- pixel, Conversions API, browser and server event definitions
- event match, deduplication, value, currency, test events, diagnostics, and consent
- attribution setting, reporting window, timezone, and delayed conversions
- Shopify or ledger reconciliation without summing overlapping attribution systems

### Structure and delivery

- campaign objective, conversion location, budget control, schedule, status, and history
- ad set audience, geography, age, placement, optimization, bid control, and exclusions
- ad identity, destination, format, asset version, offer, tracking parameters, and policy state
- spend concentration, learning or delivery state, frequency, reach, auction metrics, and breakdowns

Use current account-visible labels. Platform terminology and availability can change.

### Creative and funnel

- message, hook, format, proof, offer, landing-page match, and fatigue indicators
- outbound behavior, landing-page quality, product view, cart, checkout, purchase, refunds, and repeat behavior
- creative performance by outcome, not CTR alone

## Diagnostic sequence

1. Verify the movement is real and comparable.
2. Check event collection, attribution settings, delayed reporting, and value quality.
3. Check spend, reach, impressions, auction cost, and delivery concentration.
4. Check creative and placement mix.
5. Check traffic quality and landing-page continuity.
6. Check product availability, price, offer, checkout, and operations.
7. Check whether the primary business outcome changed in the same direction.

## Decision record

```yaml
decision:
account_and_scope:
period_and_comparison:
observed_facts:
calculations:
measurement_state:
attribution_state:
business_outcome:
diagnosis:
alternative_explanations:
unknowns:
proposed_test_or_change:
guardrails:
authorization:
rollback_or_stop:
review_date:
```
