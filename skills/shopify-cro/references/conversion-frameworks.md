# CRO Diagnosis and Experiment Frameworks

## Funnel diagnosis tree

Start at the primary business outcome and work backward.

### Business outcome

- realized orders, net revenue, contribution profit, new customers, repeat purchases, or another defined outcome
- refunds, cancellations, returns, fraud, and fulfillment effects

### Purchase completion

- payment, validation, delivery, tax, localization, errors, and accelerated checkout

### Cart commitment

- add-to-cart quality, cart edits, shipping expectations, discount behavior, and upsell distraction

### Product evaluation

- product-market match, availability, variant selection, price, offer, proof, claims, content, and page usability

### Discovery and landing

- message match, traffic intent, navigation, search, collection logic, and landing-page task completion

### Acquisition and mix

- channel, campaign, query, creative, placement, audience, market, device, and new versus returning mix

At every layer, check measurement definitions before assigning a behavioral cause.

## Hypothesis contract

```yaml
observed_problem:
source_and_scope:
proposed_mechanism:
change:
expected_direction:
primary_business_outcome:
leading_indicator:
commercial_guardrail:
customer_or_policy_guardrail:
falsifying_evidence:
confidence:
```

Customer psychology frameworks such as AIDA, PAS, FAB, awareness stages, or cognitive heuristics can help organize a hypothesis. They are not evidence that the mechanism is true for this audience.

## Experiment readiness gate

Do not call a test ready until these are defined:

- decision the experiment will inform
- eligible population and exclusions
- stable variant and control
- assignment unit and contamination risk
- event and business-outcome definitions
- quality assurance for exposure and conversion
- commercial, customer, accessibility, and technical guardrails
- decision rule appropriate to volume and risk
- minimum runtime that covers relevant business cycles
- stopping conditions for harm or invalid data
- implementation owner, approval, and rollback

Do not stop early only because a dashboard temporarily shows a preferred result.

## Prioritization

Prioritize by evidence strength, expected information value, commercial relevance, affected scope, effort, risk, and reversibility. Avoid numerical scores when the inputs are arbitrary. If a score is used, show the components and do not present it as an expected lift.

## Result interpretation

Review data quality and guardrails before the primary result. Report uncertainty and practical magnitude, not only statistical labels. Check heterogeneous effects only when they were planned or clearly exploratory. Do not apply a result outside its verified page, market, device, audience, offer, or traffic scope without another test.
