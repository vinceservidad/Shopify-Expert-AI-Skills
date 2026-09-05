# Shopify Store Operating Lifecycle

Use this as the shared operating framework for Shopify work across merchants, freelancers, agencies, virtual assistants, developers, marketers, and store operators.

Canonical lifecycle:

`CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE ↺`

This is a state model, not a mandatory nine-step checklist. Start at the earliest unresolved stage that can materially change the requested decision. Skip stages already satisfied by the request, current evidence, an approved artifact, or a verified implementation state. Move backward when new evidence invalidates an earlier assumption.

The lifecycle coordinates the existing Shopify Expert AI Skills. It does not create separate context, goal, diagnose, strategy, plan, implement, verify, measure, or optimize skills.

## Who this is for

The same lifecycle works at different levels of responsibility:

- **Merchant / store owner:** define outcomes, approve tradeoffs, authorize live changes, and judge business results.
- **Freelancer / consultant:** diagnose, recommend, plan, implement within scope, verify, and report evidence without claiming authority the client did not grant.
- **Agency / specialist:** own domain decisions, coordinate dependencies, preserve source-of-truth evidence, and separate recommendation from implementation.
- **Shopify VA:** execute defined procedures, route specialist decisions, verify terminal states, and escalate exceptions rather than inventing judgment.
- **Developer:** diagnose technical causes, implement the smallest compatible change, validate representative states, and distinguish preview/upload/publish/live/verified.
- **Marketer / growth operator:** connect storefront, merchandising, lifecycle, acquisition, measurement, and commercial outcomes without double-counting attribution.

Different roles may enter at different stages. Role does not change the evidence, authorization, or verification requirements.

## Stage map

| Stage | Core question | Typical owner(s) | Exit condition |
| --- | --- | --- | --- |
| `context` | What store, market, evidence, permissions, economics, constraints, and source of truth are we working with? | `shopify-va` for mixed-task intake; the selected specialist for a bounded task | Decision-relevant context is sufficient, or remaining gaps are explicit and safe to carry |
| `goal` | What business outcome or exact finished state should change? | Merchant/accountable owner for business goal; specialist for a bounded technical or operational objective | Outcome, scope, guardrails, acceptance criteria, and decision window are clear enough to govern work |
| `diagnose` | What is actually happening now, and what explains it? | `shopify-store-audit`, `shopify-analytics`, `shopify-cro`, `shopify-theme-development`, catalog/order/channel specialists as appropriate | Observed facts, competing explanations, evidence gaps, and current constraint/problem are bounded |
| `strategy` | What approach should we take, and why? | The specialist that owns the domain decision; merchant/accountable owner approves material tradeoffs | Chosen direction, rationale, alternatives, non-priorities, constraints, and evidence state are explicit |
| `plan` | What exactly changes, who owns it, in what order, with what approval and rollback? | `shopify-va` coordinates multi-skill routine work; specialists own their workstreams | Actions, owners, dependencies, QA, authorization, rollback, and verification are specific enough to execute |
| `implement` | What approved work should be created, configured, saved, published, sent, or changed? | Owning specialist plus an actually available authorized tool/runtime | Intended action reaches an exact observed implementation state |
| `verify` | Did the authoritative Shopify or connected-system state match what we intended? | Owning specialist; `shopify-theme-development` for code/theme state; operational owner for catalog/order/Flow state | Saved/live state is reopened or otherwise authoritatively checked; representative states pass or exceptions are recorded |
| `measure` | What happened after the change relative to the goal and guardrails? | `shopify-analytics` for reconciled business performance; domain specialist for local evidence | Data is mature enough for the decision, or measurement remains explicitly pending/blocked |
| `optimize` | What should change next given the learning? | Domain specialist; merchant/accountable owner for commercial tradeoffs | Keep, iterate, fix, roll back, test, expand, stop, or return to an earlier stage is decided |

## Stage detection

1. Identify the requested result and the current observed state.
2. Check whether the request already supplies enough safe context and a bounded objective.
3. Identify the **earliest unresolved stage that could reverse the requested decision**.
4. Start there. Do not restart at `context` simply because the lifecycle begins there.
5. Do not skip a blocking earlier stage. Missing product truth can block a listing; unclear economics can block a commercial decision; unresolved current state can block a second refund; missing authorization can block implementation.
6. Route substantive decisions to one owner skill. Add another skill only for a distinct dependency.
7. Name the next stage only when continuity matters. A completed bounded task does not need a manufactured next step.

## Stage contracts

### 1. Context

Collect only what can change the decision:

- target store, environment, market, device, channel, product, collection, order, workflow, page, theme, or campaign
- business objective or bounded task purpose
- authoritative sources and evidence dates
- metric and commercial definitions when performance is involved
- product, offer, policy, inventory, fulfillment, app, feed, tracking, or technical dependencies
- role, permissions, authorization, approver, rollback, and acceptance criteria
- material unknowns, contradictions, or stale inputs

Start read-only by default. Context does not authorize execution.

### 2. Goal

Goals may be commercial or technical.

Commercial examples:

- improve first-order contribution profit without increasing refund rate
- increase qualified product discovery while protecting in-stock availability
- improve product-page conversion while preserving customer clarity and return economics

Technical examples:

- keep selected variant, price, media, availability, and form submission synchronized
- correct a catalog mapping without overwriting later authorized edits
- make a Flow idempotent and observable before enabling it

Do not replace the real goal with a convenient proxy. CTR, sessions, attributed revenue, AOV, or a passing build may be supporting signals rather than the requested outcome.

### 3. Diagnose

Diagnosis comes before broad redesign or optimization when the cause is unknown.

Separate:

- observed facts
- calculations
- inferences
- assumptions
- unknowns
- competing explanations

Typical routes:

- whole-store journey or trust issue → `shopify-store-audit`
- funnel/conversion issue → `shopify-cro`
- reconciled performance change → `shopify-analytics`
- Liquid/JSON/CSS/JavaScript or theme state → `shopify-theme-development`
- catalog/data-quality issue → `shopify-catalog-operations`
- order/refund/fulfillment state → `shopify-order-operations`
- ad-account issue → `shopify-meta-ads` or `shopify-google-ads`

Do not label a heuristic observation as the proven root cause.

### 4. Strategy

Strategy is the chosen approach and tradeoff, not a task list.

Examples:

- fix message hierarchy and product-decision friction before redesigning the whole theme
- make Shopify's variant state the source of truth rather than maintaining a second custom state system
- recover only corrupted catalog fields from the backup while preserving later authorized edits
- protect current profitable product coverage while testing a narrower merchandising change

Record what will **not** be changed when that boundary protects valuable state or learning.

### 5. Plan

A useful plan states:

- exact workstream and owner skill
- target entity/files/surface
- dependencies and sequence
- source evidence and assumptions
- pre-change snapshot or backup where needed
- permission and authorization level
- acceptance criteria and representative states
- QA and verification method
- rollback/stopping rule
- measurement window when outcomes need observation

Planning does not transfer specialist authority to `shopify-va`.

### 6. Implement

Implement only the approved scope with the available authorized tools and permissions.

Preserve unrelated work and use exact implementation states. Depending on the task, states may include:

`draft → saved/configured → previewed → uploaded → published/enabled/sent → live/processing → verified`

Not every task uses every state. Never infer a later state from an earlier one.

Examples:

- a code patch is not a published theme
- an uploaded theme is not necessarily live
- a saved product is not necessarily published to every intended channel/market
- a drafted Flow is not enabled
- a proposed refund is not a completed refund
- a campaign recommendation is not a live account change

### 7. Verify

Verification is a first-class stage because Shopify work frequently crosses configuration, rendering, publication, market, variant, app, feed, and asynchronous processing boundaries.

Verify against the authoritative state, not memory or the change request.

Possible checks:

- reopen the product/order/workflow/theme/campaign state after the write
- inspect representative products, variants, markets, devices, templates, and customer states
- confirm identifiers, prices, availability, inventory, handles, mappings, publication, or downstream feed state where relevant
- validate Liquid/JSON/JavaScript, accessibility, responsive behavior, and app compatibility for theme work
- confirm no unrelated authorized state was overwritten
- record exceptions and rollback status

A successful save, API response, build, upload, or deploy is evidence of that action only. It is not proof of the final customer-visible or business outcome.

### 8. Measure

Measurement asks whether the implemented change produced the intended outcome after a suitable observation window.

Use `shopify-analytics` when several systems or business metrics must be reconciled. Keep collection quality, attribution, and actual business performance separate.

Choose metrics from the goal, for example:

- net sales, gross profit, contribution profit
- conversion rate, add-to-cart, checkout progression
- product/collection discovery and realized sales
- refunds, returns, cancellations, support contacts
- inventory/fulfillment exceptions
- SEO visibility or lifecycle outcomes

Do not add overlapping attributed revenue across Shopify, Meta, Google, email, or analytics systems.

### 9. Optimize

Optimization is a new decision based on measured or verified learning.

Possible decisions:

- `keep`
- `iterate`
- `fix`
- `roll back`
- `test`
- `expand`
- `stop`
- `return to context`
- `return to diagnose`
- `return to strategy`
- `return to plan`

A change may be technically verified but commercially unsuccessful. A commercial result may improve while exposing a customer, inventory, accessibility, or operational guardrail problem. Preserve both facts.

## Common lifecycle shapes

### New store or major redesign

`context → goal → diagnose → strategy → plan → implement → verify → measure → optimize`

### Existing store performance decline

`diagnose → strategy → plan → implement → verify → measure → optimize`

### Liquid or variant bug

`diagnose → plan → implement → verify`

### Product listing from an approved source sheet

`context → plan → implement → verify`

### Bulk catalog recovery

`context → diagnose → plan → implement → verify`

### CRO test

`diagnose → strategy → plan → implement → verify → measure → optimize`

### Simple support draft

`implement`

The request can satisfy earlier stages when the task is bounded, factual, and draft-only.

## Relationship to the 19 skills

This lifecycle is the orchestration layer. The skills remain the decision and execution layer.

`shopify-va` owns mixed routine-task intake, lifecycle state coordination, routing, execution tracking, QA, and handoff. It does **not** become the expert owner of every domain. Whole-store diagnosis remains with `shopify-store-audit`; funnel decisions with `shopify-cro`; theme code with `shopify-theme-development`; product/catalog/order/ads/SEO/email/analytics decisions remain with their respective skills.

For a single clear task, use the specialist directly and apply only the lifecycle stages needed.

## Interface aliases

A tool, prompt library, or future UI may expose labels such as `/context`, `/goal`, `/diagnose`, `/strategy`, `/plan`, `/implement`, `/verify`, `/measure`, or `/optimize`.

Treat those as interface shortcuts only. They do not create new skills, permissions, or authorization.

## QA

A strong Shopify lifecycle response:

- starts at the earliest materially unresolved stage, not blindly at `context`
- names one accountable owner for each substantive decision
- preserves merchant/client authority and VA/freelancer permission boundaries
- separates evidence from inference and unknowns
- diagnoses before broad changes when the cause is unresolved
- keeps strategy, plan, implementation, verification, measurement, and optimization distinct
- preserves unrelated store state and reversible rollback where possible
- verifies the authoritative saved/live state after implementation
- measures against the actual goal and commercial/customer guardrails
- can move backward when new evidence invalidates an earlier decision
- never treats the lifecycle itself as permission to change a live store
