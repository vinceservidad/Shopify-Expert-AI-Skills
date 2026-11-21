# CRO Output Examples

These are structures, not benchmark claims.

## Problem record

```yaml
problem: mobile shoppers abandon variant selection
observation: a supplied usability study shows 6 of 8 participants failed to notice the size selector
scope: one product template, mobile prototype, UK participants
calculation: 6 / 8 observed participants
inference: selector visibility may be contributing to task failure
alternatives: unavailable sizes, unclear sizing, product hesitation, or study sampling
confidence: medium for the usability problem; low for revenue impact
next_evidence: production funnel by device and variant error logs
```

Do not generalize “75% of customers” from a small usability sample.

## Experiment brief

```yaml
decision: whether to replace the collapsed delivery details near add to cart
control: current collapsed disclosure
variant: concise delivery range shown beside the purchase control
eligible_population: mobile sessions on the named product template
primary_metric: completed orders per eligible session
commercial_guardrail: contribution profit per eligible session
customer_guardrail: delivery-related contacts and cancellations
quality_checks: exposure logging, device split, stock status, and event parity
minimum_runtime: set from traffic volume and full business-cycle coverage
stop: tracking failure, material customer harm, or guardrail breach
authorization: launch requires ecommerce owner approval
```

## Backlog row

| Problem | Evidence | Hypothesis | Next step | Confidence | Risk | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| Delivery timing is not visible near commitment | Page observation plus supplied support theme | Earlier truthful timing may reduce uncertainty | Validate support volume, then draft a controlled test | Medium | Promise accuracy | Ecommerce |

## Inconclusive result

An inconclusive result is not a failed project. State whether the test was valid, the range of plausible effects, the guardrail results, and whether the information value supports more exposure, a stronger intervention, segmentation, or stopping.
