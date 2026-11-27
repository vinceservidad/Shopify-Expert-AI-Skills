# Meta Ads Decision Rules

## Do not optimize an isolated metric

- CTR can diagnose attention or click behavior, not profitable demand.
- CPM can describe auction cost, not creative quality by itself.
- Cost per attributed purchase depends on attribution and value quality.
- Platform ROAS is not realized revenue, incrementality, or profit.
- Frequency can be useful context, but no universal fatigue threshold applies.

## Pre-change gate

Require:

- a defined problem supported by comparable evidence
- a hypothesis with competing explanations
- enough data for the risk and reversibility of the decision
- a clear primary business outcome and commercial guardrail
- stable or understood measurement
- a named change, owner, review date, stop, and rollback
- explicit approval for the live action

## Scaling gates

Do not recommend scaling until all relevant gates pass:

1. Readiness: campaign, creative, landing page, and tracking are functioning.
2. Economics: the named profit or acquisition economics support additional volume.
3. Constraint: the current limiting factor is identified.
4. Marginal evidence: recent incremental spend or controlled evidence supports the next allocation.
5. Capacity: inventory, cash flow, fulfillment, and creative supply can absorb growth.
6. Guardrails: commercial, customer, policy, and measurement limits are defined.
7. Authorization: the exact budget or control change is approved.

Meta's official learning phase documentation (<https://www.facebook.com/business/help/112167992830700>) and significant edits guide (<https://www.facebook.com/business/help/316478108955072>) evaluate budget and bid-control edits by magnitude rather than a universal percentage cutoff. Large jumps can trigger a significant edit and reset learning, while minor adjustments usually do not.

Select the change size from account volume, volatility, learning risk, and cash exposure. Weigh your bid controls and monitoring capacity, check the "Last significant edit" column in Ads Manager before editing, and never default to a fixed percentage rule.

## Common controlled responses

- Measurement problem: repair and verify collection before performance optimization.
- Creative constraint: test a distinct concept or proof path with stable delivery context.
- Landing mismatch: align message and offer, then measure downstream quality.
- Product constraint: adjust approved coverage only after inventory and economics review.
- Audience or placement question: use a test that isolates the decision where platform controls permit.
- Economics below guardrail: contain exposure and diagnose before adding budget.

Any action that changes live spend, delivery, customer data, or tracking requires explicit approval.
