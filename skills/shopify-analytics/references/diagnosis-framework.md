# Performance Diagnosis Framework

## Start with the identity

For a simple ecommerce decomposition:

```text
Orders = eligible sessions × conversion rate
Revenue = orders × average order value
```

Use only when session, order, conversion, and revenue definitions are compatible. For subscription, marketplace, B2B, omnichannel, or delayed-revenue models, choose a more appropriate identity.

## Diagnostic tree

### Data and definition

- extraction completeness, duplicate rows, status inclusion, timezone, currency, consent, identity, event changes, attribution, or delayed processing

### Demand and traffic

- channel, campaign, query, creative, market, device, new versus returning, direct or referral, and seasonality

### Conversion

- landing mix, product availability, price, offer, site performance, errors, cart, checkout, payment, policy, and fulfillment promises

### Value and product mix

- product, collection, quantity, bundle, subscription, discount, currency, tax, shipping, and upsell mix

### Realization and costs

- cancellation, refund, return, fraud, cost of goods sold, payment, fulfillment, shipping, media, and support cost

### Retention

- cohort, repeat window, purchase cycle, subscription state, churn, and customer identity quality

## Explanation record

```yaml
candidate_explanation:
supporting_observations:
contradicting_observations:
calculation:
alternative_explanations:
confidence:
decision_impact:
next_test_or_evidence:
```

## Change-history review

Align business, marketing, store, product, price, inventory, tracking, and external events on one timeline. A coincident change is a lead for investigation, not proof of cause.

## Unknown prioritization

Rank an unknown high when a plausible answer would reverse the decision, change the safe action, or alter the commercial guardrail. Do not delay a reversible low-risk action for an input that cannot affect it.
