# Google Ads Structural Decisions

Structure is a means to control budget, intent, product coverage, data quality, messaging, geography, economics, and learning. Do not copy a universal account template.

## Decision inputs

- query intent and brand relationship
- product margin, price, availability, seasonality, and fulfillment
- market, language, feed, shipping, and policy differences
- conversion volume and value quality
- budget and cash exposure
- landing-page relevance
- reporting and operational ownership

## Useful separations

### Brand Defence

Separate protected brand demand when budget control, query visibility, competitive pressure, or acquisition reporting requires it. Review brand variants, product-brand queries, organic context, incrementality questions, and exclusions carefully.

### Non-brand Search

Group only when query intent, landing experience, value, and control needs are compatible. Match type is a control input, not a guarantee of query relevance.

### Shopping and Performance Max

Use product economics, availability, feed attributes, market, and business priority to determine listing-group or campaign separation. Do not call a product “high margin” without a sourced margin definition. Search-term and channel visibility can vary, so label evidence limits.

### Remarketing and customer acquisition

Define audience source, consent, membership, exclusions, customer lists, and new-customer settings. Do not infer incrementality from platform labels alone.

## Change sequence

For each material change:

```yaml
evidence:
hypothesis:
change:
scope:
expected_direction:
primary_business_outcome:
commercial_guardrail:
measurement_check:
authorization:
rollback_or_stop:
review_date:
result:
decision:
```

Change one major control at a time when the purpose is to learn its effect. Bundled remediation is appropriate for an urgent integrity failure, but it limits causal interpretation.

## Scaling gates

Require readiness, supportive economics, identified constraint, marginal evidence, operational capacity, guardrails, and explicit authorization. Choose the magnitude from the account's data, volatility, business exposure, and monitoring capacity. Do not use a fixed percentage rule.
