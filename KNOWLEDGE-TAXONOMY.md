# Knowledge Taxonomy

Use this contract when a skill creates or relies on substantial operating knowledge.

## Required metadata

When documenting a reusable decision rule or operating artifact, state:

- `artifact_type`
- `decision`
- `scope`
- `owner`
- `inputs`
- `evidence_status`
- `confidence`
- `freshness`
- `dependencies`
- `authorization`
- `rollback_or_stop`

## Artifact types

**Observation**
A source-backed fact. It does not explain cause by itself.

**Calculation**
A reproducible transformation of source data. Include formula, units, scope, and period.

**Pattern**
A repeated relationship observed in a defined dataset or operating context. It is not causal proof.

**Principle**
A durable decision constraint, such as protecting customer truth or requiring approval before live changes.

**Heuristic**
A shortcut that can guide a decision under named conditions. Include scope, confidence, freshness, override conditions, and failure modes.

**Best practice**
A sourced recommendation that is appropriate for a stated context. Include source, date, scope, exceptions, and the outcome it protects.

**Technique or tactic**
A bounded execution method. It is not a strategy and does not prove an outcome.

**Process**
A repeatable sequence with inputs, owner, state transitions, QA, and stopping conditions.

**Framework**
A structure for organizing evidence or decisions. It does not prove causality or effectiveness.

**Model**
A simplified representation used to estimate, explain, or forecast. State assumptions and validation limits.

**Template**
A reusable output shape. It does not replace analysis or evidence.

**Strategy**
A set of choices about objective, market, advantage, allocation, constraints, and tradeoffs. A list of tactics is not a strategy.

## Classification rules

1. Choose one primary artifact type.
2. Add a secondary type only when it changes how the artifact is used or validated.
3. Do not present a pattern as causality.
4. Do not present a heuristic as a guarantee.
5. Do not present a tactic as a strategy.
6. Do not present a framework, template, or model as proof of an outcome.
7. Downgrade or retire knowledge when its scope, evidence, or freshness no longer supports the decision.

## Example

```yaml
artifact_type: heuristic
decision: whether to continue a product-page experiment
scope: mobile product-detail-page traffic from paid social
owner: ecommerce lead
inputs: sessions, assigned variant, purchases, contribution profit, refunds
evidence_status: measured experiment data
confidence: medium until minimum decision threshold is met
freshness: current experiment window
dependencies: stable tracking and unchanged offer
authorization: analysis allowed; rollout requires owner approval
rollback_or_stop: stop on tracking failure, customer harm, or contribution-profit guardrail breach
```
