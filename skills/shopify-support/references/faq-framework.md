# FAQ and Macro Framework

## Source hierarchy

Build reusable answers from current policy, product data, fulfillment rules, legal or compliance guidance, and verified support operations. Use ticket themes to find gaps, not to override policy.

## FAQ record

```yaml
question:
customer_job:
answer:
conditions_and_exceptions:
source:
source_owner:
market_or_product_scope:
last_reviewed:
next_review:
escalation_path:
```

## Macro design

A macro should reduce repetitive drafting without pretending every case is identical.

Include:

- the situation and eligibility conditions
- fields the agent must verify
- approved response text with clearly named variables
- conditions that require editing or escalation
- actions the macro does not perform
- review owner and date

Never hide a policy decision inside a vague variable such as `[appropriate resolution]`.

## Theme analysis

When summarizing support contacts:

- define the population, date range, channels, and taxonomy
- separate contact volume, unique customers, orders, issue rates, and severity
- preserve source links without exposing unnecessary personal data
- label manually coded samples and analyst interpretations
- do not claim a product or page caused a theme without stronger evidence

## Publication checks

Before approved publication, verify the answer against the live policy and relevant market. After publication, inspect the canonical live page or help-center entry, links, mobile rendering, searchability, and version state.
