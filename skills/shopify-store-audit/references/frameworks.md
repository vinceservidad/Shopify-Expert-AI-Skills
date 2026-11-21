# Store Audit Frameworks

## Evidence boundary

Record the exact surface reviewed:

```yaml
pages_and_templates:
devices_and_viewports:
markets_and_locales:
logged_in_or_guest:
date_observed:
analytics_period:
comparison_period:
tools_and_exports:
unavailable_surfaces:
```

Do not generalize a finding from one product, device, or market to the whole store without evidence.

## Six audit lenses

### 1. Customer journey

Trace entry, orientation, discovery, evaluation, commitment, checkout, confirmation, support, and repeat purchase. At each stage ask:

- What job is the customer trying to complete?
- What information is required before the next decision?
- What friction, uncertainty, or distraction is directly observed?
- What evidence shows that the issue affects behavior or business outcomes?

### 2. Merchandising and offer

Check product hierarchy, collection logic, availability, price presentation, bundle logic, variant clarity, shipping, returns, guarantees, subscriptions, upsells, and cross-sells. Confirm claims and commercial rules from authoritative sources.

### 3. Trust and content

Check identity, contact information, policies, proof provenance, review presentation, claim support, product information, delivery expectations, and consistency across templates.

### 4. Experience quality

Review mobile usability, navigation, forms, errors, accessibility, responsiveness, and browser states. Treat aesthetics as supporting the customer task, not as the commercial outcome.

### 5. Technical and performance

Use measurements when available. Separate field data, lab tests, code inspection, and visual symptoms. Do not assign a technical cause from a slow screenshot or one synthetic run.

### 6. Measurement and operations

Check conversion definitions, consent, event quality, attribution differences, inventory, fulfillment, support, returns, and capacity. A recommendation that operations cannot support is not ready to implement.

## Priority logic

Assess each issue on:

- **Evidence strength:** direct source, calculation, research, experiment, or inference
- **Commercial proximity:** distance from the named business outcome
- **Affected scope:** verified share of products, users, markets, or devices
- **Customer or policy risk:** harm, accessibility, compliance, or trust exposure
- **Effort and dependency:** people, tools, theme, app, content, or data work
- **Reversibility:** ease and reliability of rollback

Use `critical`, `high`, `medium`, or `low` only with a short rationale. Do not attach expected revenue or conversion lift without a credible model or measured test.

## Issue record

```yaml
issue:
location_and_scope:
observed_evidence:
source_and_date:
business_or_customer_relevance:
inference:
alternative_explanations:
confidence:
priority:
recommended_next_step:
authorization_required:
rollback_or_stop:
verification:
```

## Strength preservation

Record useful content, coverage, learning, or behavior that should not be lost. A redesign that fixes one issue can remove a working message, accessible behavior, organic entry point, or campaign landing experience.
