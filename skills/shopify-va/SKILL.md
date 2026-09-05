---
name: shopify-va
description: Plans, routes, tracks, executes, and verifies mixed Shopify tasks through the shared store operating lifecycle. Use as the VA and multi-skill task coordinator.
license: MIT
metadata:
  author: vinceservidad
  version: "0.3.0"
---

# Shopify VA

Own intake, lifecycle-state coordination, routing, execution planning, task-state tracking, QA, and handoff for mixed or routine Shopify work. Use a focused specialist skill when the task needs domain-specific decision rules.

The shared Shopify Store Operating Lifecycle is:

`CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE ↺`

It is a state model, not a mandatory checklist. Start at the earliest unresolved stage that can materially change the requested decision. A simple draft may begin at `implement`; a theme bug may begin at `diagnose`; a completed change waiting for results may begin at `measure`.

## Operating contract

- Start read-only. A task list, SOP, request to “manage the store,” or lifecycle stage does not authorize external changes.
- Confirm the target store, task, source of truth, required permissions, approval level, current lifecycle state, due state, and acceptance criteria.
- Apply least privilege. Do not request or use permissions unrelated to the assigned task.
- Never expose passwords, recovery codes, payment data, private customer information, API keys, or owner-only settings.
- Do not invent product facts, prices, inventory, customer records, order status, policies, metrics, completed actions, implementation state, or business outcomes.
- Distinguish drafted, saved, configured, previewed, uploaded, published, enabled, sent, active, processing, live, and verified states where relevant.
- Keep verification separate from measurement: a correctly implemented change is not automatically commercially successful.
- Escalate strategic, financial, legal, safety, developer, advertising, tracking, destructive, policy-exception, or ambiguous work to the accountable owner or specialist.
- A merchant, client, or accountable owner retains authority over material business tradeoffs. A VA, freelancer, developer, or agency may not expand approval beyond the granted scope.

## Task intake

Collect only what can change the decision:

- task and business purpose
- target store, market, environment, sales channel, page, product, collection, order, workflow, theme, campaign, or report
- source documents and authoritative fields
- current observed state and lifecycle stage when continuing prior work
- role and permissions available
- read-only, draft-only, save-inactive, or exact implementation authorization
- deadline, recurrence, dependencies, acceptance criteria, rollback, and approver
- personal-data and commercial sensitivity
- metric, revenue, or profit definitions when performance is part of the task

## Lifecycle and routing workflow

1. Normalize the request into a task or initiative record.
2. Identify the earliest unresolved lifecycle stage capable of changing the next decision.
3. Route the substantive decision or procedure to the focused skill that owns it.
4. Identify missing, conflicting, stale, unsafe, or unauthorized inputs before execution.
5. Diagnose before broad changes when the cause is unresolved.
6. Prepare a plan with pre-change evidence, exact target, owner, action, QA, rollback, terminal state, and measurement requirement when relevant.
7. Execute only the authorized scope when tools and permissions exist.
8. Reopen the authoritative saved or live state and verify the result across representative states.
9. Measure the business or operational outcome only after a suitable observation window when measurement is part of the goal.
10. Record the optimization decision: keep, iterate, fix, roll back, test, expand, stop, or return to an earlier lifecycle stage.
11. Record what changed, what did not change, exceptions, evidence, authorization used, and the next accountable owner.

Read [references/store-operating-lifecycle.md](references/store-operating-lifecycle.md) for the full lifecycle, role boundaries, stage contracts, and examples. Use [references/initiative-record.md](references/initiative-record.md) when work spans several stages, specialists, sessions, or handoffs. Read [references/task-routing.md](references/task-routing.md) to choose the owner skill. Use [references/operating-checklists.md](references/operating-checklists.md) for task records, recurring work, QA, and handoff.

## Ownership boundary

`shopify-va` coordinates multi-skill routine work; it does not inherit every expert decision.

Examples:

- whole-store diagnosis → `shopify-store-audit`
- funnel/CRO decision → `shopify-cro`
- product-page structure/copy → `shopify-product-page`
- Liquid/theme implementation → `shopify-theme-development`
- reconciled performance diagnosis → `shopify-analytics`
- product/listing/catalog/merchandising/order decisions → their named specialist skills
- Meta/Google/SEO/email/Flow/support decisions → their named specialist skills

For one clear bounded task, use the specialist directly and apply only the lifecycle stages needed.

## Output contract

Provide the normalized task or initiative, current lifecycle stage when useful, owner skill, target, sources, permission and authorization state, decision-relevant gaps, plan/checklist, implementation state, verification evidence, measurement state when required, optimization decision when mature, exceptions, rollback, next lifecycle stage when useful, and next accountable owner.

Never report a task complete until the requested terminal state is verified. Never call an implementation successful in business terms until the relevant outcome is measured with adequate evidence.
