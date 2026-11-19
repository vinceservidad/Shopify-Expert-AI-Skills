# Designing step-by-step Shopify job workflows

Use this when enhancing procedures inside the current skills. The aim is a **real assignment → correct sequence → verifiable deliverable**, not another abstract framework. Read [product brief](product-brief.md) and reuse canonical [lifecycle](../skills/shopify-va/references/store-operating-lifecycle.md), [routing](../skills/shopify-va/references/task-routing.md), [skill writing guidance](skill-writing-guide.md), and [operating checklists](../skills/shopify-va/references/operating-checklists.md).

## Required design questions

For each assigned job, make these clear in its existing owner skill or linked reference:

1. **Job & acceptance:** What does the client want and what observable output counts as done?
2. **Scope & authority:** Which store/resources, role, market, read/draft/live permission, and approver?
3. **Prerequisites:** What facts, policy, source files, product truth, baseline, access or decision must exist **before** a step?
4. **Ordered path:** Which actions depend on earlier work? Which may run in parallel, be skipped, or must branch?
5. **Owner & available tools:** One specialist owns the final result; name contributors only where needed. Do not assume an MCP/server is connected.
6. **Decision and stop gates:** What evidence allows progress? When should the operator ask, stop, or escalate?
7. **QA & recovery:** What exact target state must be re-opened and verified? What changes need rollback?
8. **Handoff & measurement:** What was done/blocked, what is draft/saved/live/verified, who owns the next step, and whether later measurement is needed?

Use the shared nine-stage lifecycle as a **state model**, not a compulsory template for every task.

## Workflow specification (design aid)

```text
JOB: <real merchant / agency assignment and role>
DELIVERABLE: <client-accepted observable result>
OWNER SKILL: <one existing specialist>
CONTRIBUTORS: <only necessary specialties>
SCOPE / AUTHORIZATION: <store, resource, read/draft/inactive/exact action>
PREREQUISITES: <approved inputs, source of truth, policies, permissions>
CURRENT STATE: <earliest materially unresolved lifecycle stage>
ORDERED ACTIONS:
  1. <action> → <output> → <decision / blocker>
  2. <action> → <output> → <decision / blocker>
  3. ...
QA: <authoritative evidence and representative cases>
HANDOFF: <completed, blocked, exceptions, approval, next owner>
FAILURE / ROLLBACK: <safe stop and recovery>
MEASURE LATER: <only if relevant, metric/baseline/window/owner>
```

## Example A: New product research → listing → launch readiness

**Owner for mixed project:** `shopify-va` coordinates. `shopify-product-research` owns validation; `shopify-product-listing` owns listing accuracy; page, SEO, and merchandising skills contribute only when assigned.

1. Confirm the product objective, target customer/market, constraints, existing sources, required client deliverables and what launch approval exists.
2. Research demand, alternatives, supplier credibility, claims, economics, and risks. **Do not proceed as if viability is proven** when evidence is absent.
3. Obtain approved product specifications, copy claims, variants, SKUs, prices, inventory, media and shipping/returns rules. Missing facts block dependent fields.
4. Draft accurate titles, descriptions, variant data, images/alt text, metadata, page copy, and collection placement only where applicable.
5. QA product truth, variants, media, availability, policy compatibility, channels, mobile presentation and protected fields.
6. Save a draft or implement the **exact approved scope** through an actually available write-capable integration. Otherwise deliver an implementation-ready draft and state it has **not** been published.
7. Re-open authoritative Shopify state after any action; distinguish draft, saved, published, live, and verified. Document exceptions and rollback.
8. After an appropriate baseline and measurement period, consider SEO/CRO or sales optimization. Do not call the launch successful based on a save confirmation.

**Done means:** approved deliverables and state are confirmed, missing items identified, and the client knows the next owner.

## Example B: Weekly Shopify VA assignment

**Owner:** `shopify-va` for task coordination; each task uses its own owner specialist.

1. Intake each task with target store, resource, due date, source document, permission, owner, and acceptance criteria.
2. Prioritize dependencies and risk: confirm product facts before listing; confirm refund policy and authority before order actions.
3. Route each bounded task to its specialist. Mark blocked items and escalation owners explicitly.
4. Execute only the authorized action through an available tool, or prepare a reviewable draft/handoff.
5. QA each result against the request and authoritative target. Do not report 'complete' for a plan, attempted API call, or unverified save.
6. Deliver a concise client report: **verified done, draft/pending, blocked, QA evidence, next action/owner**.

**Done means:** the client can see which jobs are actually finished versus awaiting approval.

## Example C: CRO request after a performance drop

**Owner:** `shopify-analytics` when diagnosing cross-system performance; `shopify-cro` when designing the controlled experiment.

1. Establish metrics, timeframe, comparison, tracked events, source definitions, segments and economics.
2. Diagnose tracking/attribution differences before assigning causes to page conversion.
3. Inspect real funnel steps and relevant pages; distinguish observed defects from hypotheses.
4. Prioritize a test with guardrails, owner, QA, stopping rules, and explicit approval.
5. Implement only with approved scope and tools. Verify the live target **and** measurement instrumentation.
6. Measure after a valid observation window; iterate, keep, rollback, or investigate rather than invent lift.

**Done means:** an evidence-led decision and properly controlled follow-through.

## Where changes belong

- **One task:** change its existing `skills/<owner>/SKILL.md` or linked reference.
- **Mixed tasks:** use the existing `shopify-va` coordinator and its checklists/initiative record.
- **Shared rule:** edit the canonical lifecycle/routing/authorization document, then affected examples.
- **Evidence gap:** add a real/synthetic *clearly labeled* scenario and substantive behavioral evaluation.
- **Connection/action:** use actual supported tools and approved permissions, never assume a hosted or write-capable MCP.

## Acceptance checklist for agent-authored workflow changes

- [ ] Real assigned job, single owner and deliverable are explicit.
- [ ] Dependencies precede dependent actions.
- [ ] A correct starting stage, conditional shortcuts and exceptions are defined.
- [ ] Missing evidence, permissions and approval trigger safe stop/escalation.
- [ ] Current platform/tool access is described accurately.
- [ ] QA verifies the authoritative target; saved/live/measured are not conflated.
- [ ] Client handoff names completion, blockers, evidence and next owner.
- [ ] Existing 19-skill architecture and shared references are reused.
- [ ] Changed decision behavior has a realistic validation scenario and honest results.
