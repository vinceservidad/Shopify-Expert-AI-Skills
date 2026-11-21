# Shopify Initiative Record

Use this record when a Shopify initiative spans several lifecycle stages, several specialist skills, several sessions, or a handoff between merchant, freelancer, agency, VA, developer, or operator.

Do not create this for a tiny bounded task that can be completed and verified safely in one step.

Canonical lifecycle:

`CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE ↺`

See [store-operating-lifecycle.md](store-operating-lifecycle.md).

## Record state

- Initiative / task:
- Store / market / environment:
- Current lifecycle stage: context | goal | diagnose | strategy | plan | implement | verify | measure | optimize
- Stage status: active | blocked | sufficient | approved | in progress | verified | complete | superseded
- Accountable business owner / approver:
- Primary skill owner:
- Supporting skills:
- Source-of-truth system(s):
- Authorization level:
- Last updated:
- Next decision point:

Do not mark a stage complete merely because a document exists. State must reflect the evidence and actual store/system condition.

## 1. Context

Status: not required | active | partial | sufficient | blocked | superseded

- Business purpose:
- Target store / market / environment:
- Product / collection / page / order / theme / workflow / campaign scope:
- Customer / audience scope, if relevant:
- Evidence and dates:
- Source-of-truth systems:
- Metric / revenue / profit definitions:
- Product / offer / policy / inventory / fulfillment constraints:
- Apps / feeds / tracking / technical dependencies:
- Role and permissions:
- Authorization boundary:
- Material unknowns / contradictions / stale inputs:

## 2. Goal

Status: not required | active | decision-ready | approved | superseded

| Field | Decision |
| --- | --- |
| Business outcome or exact finished state |  |
| Current baseline / observed problem |  |
| Desired direction or supplied target |  |
| Acceptance criteria |  |
| Decision / observation window |  |
| Commercial boundary |  |
| Customer / operational / technical guardrails |  |
| Goal approver / owner |  |

Do not invent targets or replace the real outcome with a convenient platform metric.

## 3. Diagnose

Status: not required | active | limited | decision-ready | blocked | superseded

- Observed facts:
- Calculations:
- Current implementation / store state:
- Competing explanations:
- Inferences:
- Assumptions:
- Unknowns:
- Current constraint / problem statement:
- Evidence that would reverse the diagnosis:
- Diagnosis owner skill:

## 4. Strategy

Status: not required | draft | decision-ready | approved | under review | superseded

- Chosen direction:
- Why this approach:
- Evidence / confidence:
- Alternatives considered:
- Explicit non-priorities / protected state:
- Dependencies / constraints:
- What would change the strategy:
- Strategy owner:

Strategy is the direction and rationale. Put tasks in the Plan section.

## 5. Plan

Status: not required | draft | decision-ready | approved | in execution | superseded

| Workstream | Skill / human owner | Exact target | Action / deliverable | Dependency / sequence | Authorization | QA / verification | Rollback / stop | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

Planning coordinates work; it does not transfer specialist authority or merchant/client approval.

## 6. Implement

Status: not required | draft | saved/configured | previewed | uploaded | published/enabled/sent | live/processing | blocked | superseded

| Action / artifact | Owner / tool | Intended state | Actual observed state | Authorization used | Pre-change snapshot / backup | Open issue |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

Record only states supported by evidence. A draft is not saved; saved is not necessarily published; published is not necessarily verified.

## 7. Verify

Status: not required | pending | active | partial | verified | failed | blocked | superseded

- Authoritative verification source:
- Store / system state reopened after change:
- Representative pages / variants / markets / devices / records checked:
- Expected versus observed:
- Downstream feed / app / workflow / publication state, if relevant:
- Accessibility / responsive / performance / browser checks, if relevant:
- Unrelated state preserved:
- Exceptions:
- Rollback state:
- Verification owner:

Verification confirms implementation correctness, not commercial success.

## 8. Measure

Status: not required | waiting for maturity | active | decision-ready | blocked | complete | superseded

- Measurement question:
- Observation window / maturity requirement:
- Primary business outcome:
- Guardrails:
- Reconciled realized result:
- Supporting metrics:
- Data / tracking quality:
- Attribution settings / limits:
- Competing explanations:
- Measurement owner:

Do not sum overlapping attributed revenue across platforms.

## 9. Optimize

Status: not required | active | decision-ready | approved | implemented | blocked | complete | superseded

Decision:

- keep | iterate | fix | roll back | test | expand | stop | return to context | return to diagnose | return to strategy | return to plan

Record:

- evidence behind the decision:
- proposed change:
- skill / accountable owner:
- commercial / customer / operational / technical guardrails:
- rollback / stop rule:
- authorization required:
- next lifecycle stage:
- reason that stage is correct:

## Decision history

Newest first. Preserve history instead of rewriting earlier reasoning after results arrive.

| Date | From stage | Evidence / decision change | Owner | To stage | State |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Open decisions and exceptions

| Decision / exception | Why it matters | Owner | Blocking evidence / permission / dependency | Status |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Exact status

- Current lifecycle stage:
- Current stage status:
- Work approved:
- Work actually implemented:
- Work actually verified:
- Business outcome measured:
- Open blocker / contradiction:
- Next accountable owner:
- Next decision point:

## Usage rules

- The lifecycle is stateful, not a mandatory checklist.
- Start at the earliest unresolved stage capable of changing the decision.
- Skip stages already satisfied by safe evidence and a bounded request.
- Use one specialist owner for each substantive decision.
- `shopify-va` may coordinate multi-skill routine work but does not absorb expert ownership.
- A freelancer, VA, agency, or developer cannot promote client/merchant approval beyond what was actually granted.
- Implementation requires actual tools/permissions plus exact authorization.
- Verification must inspect authoritative saved/live state after the change.
- Measurement is separate from verification.
- Optimization may move backward or forward in the lifecycle.
- This record does not authorize a live mutation by itself.
