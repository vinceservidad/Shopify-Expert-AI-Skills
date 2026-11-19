# Product brief: Shopify VA Toolkit

This is the **project context** for Codex, Claude Code, and contributors. It describes intent, not a second operational framework.

## Why it exists

Merchants and ecommerce agencies hire Shopify VAs, freelancers, specialists, and developers for concrete jobs: product research, product listings, catalog maintenance, merchandising, store audits, CRO, SEO, ads, email, support, order workflows, analytics, automations, and theme development.

The toolkit should help those people understand **what to do first, what comes next, what is blocked, how to check the result, and what to hand back to the client**. A beginner should have a clear path; an experienced operator should avoid unnecessary steps. The goal is less guesswork/rework and more consistent delivery. Do not claim proven time or revenue gains without evidence.

## What it is and is not

- **Is:** 19 focused skills, including `shopify-va` coordination, with evidence-led specialist procedures, usable task checklists, and optional connected-store evidence.
- **Is:** A complement to Shopify Sidekick and authorized Shopify/AI integrations. Skills define how to approach work; available tools supply data and approved actions.
- **Is not:** An autonomous Shopify store operator, a Sidekick replacement, universal permission to edit a client store, or a promise of one-click execution.
- **Is not:** A rigid nine-stage checklist or a reason to invent more skills. Improve depth, practical job coverage, and testability before expanding the catalog.

## Real jobs and expected deliverables

| Assignment | Expected client-ready deliverable | Typical owner skill |
| --- | --- | --- |
| General VA weekly tasks | Verified task log, blocked items, handoff | `shopify-va` |
| Product / supplier research | Evidence-backed validation brief | `shopify-product-research` |
| Create / optimize listings | Accurate listing draft or checked approved changes | `shopify-product-listing` |
| Bulk catalog cleanup | Reconciled updates, exceptions, rollback record | `shopify-catalog-operations` |
| Collection merchandising | Assortment/collection plan and checks | `shopify-merchandising` |
| Product page improvement | Truthful page brief and conversion hypothesis | `shopify-product-page` |
| Store conversion diagnosis | Prioritized experiment backlog and baseline | `shopify-cro` |
| Shopify SEO | Prioritized, source-backed SEO work | `shopify-seo` |
| Customer/order work | Verified policy-grounded draft or task state | `shopify-support` / `shopify-order-operations` |
| Campaigns and lifecycle | Evidence-based recommendations and controlled briefs | Ads / email specialist |
| Shopify theme task | Tested scoped code, verified deployment state, rollback | `shopify-theme-development` |
| Store reporting | Reconciled metrics, findings, decision | `shopify-analytics` |

This table illustrates the *job-first* approach. The canonical full ownership map is [task routing](../skills/shopify-va/references/task-routing.md); do not create a duplicate catalog here.

## Operating design

```text
Real client / merchant assignment
  → Identify role, objective, inputs, store, permissions, acceptance
  → Choose one owner specialist; use shopify-va for mixed work
  → Follow task-specific ordered actions and decision gates
  → Use AI and available approved evidence/tools
  → Verify actual draft/saved/live state
  → Deliver completed work, blockers, evidence and next owner
  → Measure and optimize later, when the job calls for it
```

The canonical [Shopify Store Operating Lifecycle](../skills/shopify-va/references/store-operating-lifecycle.md) remains:
`CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE ↺`.

**This is a state model.** Start at the earliest unresolved step relevant to the task. An already-approved listing may start near implementation; a CRO investigation begins with sound diagnosis; a simple support draft may need only policy checks and drafting. Never force all stages or confuse completion of a stage with permission.

## Non-negotiable design principles

1. **Job first, not prompt first.** Define the client's real expected output, and the role responsible.
2. **Dependencies before actions.** Product truth precedes listing; policy precedes support action; data validation precedes causal diagnosis; approval precedes live modification.
3. **One owner.** Specialists own domain decisions; the VA coordinator handles multi-task routing, exceptions, and handoffs.
4. **Evidence over invention.** Unknown commercial/product facts stay unknown. Never invent results or verified state.
5. **Appropriate human control.** Read/draft/inactive/live permissions are distinct, and sensitive changes require explicit authorization.
6. **Verification before claiming completion.** Confirm authoritative saved/live target, representative conditions, and rollback when relevant.
7. **Right-sized workflow.** Short tasks stay short; risky, cross-system tasks warrant more checks.
8. **No platform competition.** Shopify supplies native store features and integrations; this toolkit teaches repeatable skillful work across supported AI hosts.

## Actual connector boundary

The repository's custom MCP currently exposes **read-only** Shopify shop, product, variant, inventory, and limited order-summary evidence when connected; it does not expose writes, refunds, publishing, ad changes, or a proven hosted client integration. Consult [plugin and connector documentation](plugin-and-connector.md) before making technical or deployment claims. Official Shopify tools may have their own permissions; do not assume any are installed or enabled.

## Development priorities

1. Identify frequently hired Shopify jobs from actual postings, client SOPs, support tasks, or provided briefs. Label evidence versus assumptions.
2. Map each to an existing skill and inspect workflow gaps: missing prerequisites, incorrect order, vague acceptance, unsafe permissions, poor QA, weak handoff.
3. Improve **one valuable workflow at a time** with [job workflow design](job-workflow-design.md). Reuse canonical references.
4. Validate with realistic cases that test decisions, missing data, handoffs, and failure modes, not answer-style mimicry.
5. Add platform/tool integration only when it materially improves the job and can be permissioned and verified.
6. Measure usefulness when real observations exist (completion accuracy, defects, escalation quality, time to verified completion); never invent productivity claims.

## Definition of success

A Shopify VA or specialist can identify the right first action, dependencies, approved scope, skill owner, next step, completion criteria, QA, and client-facing handoff **without guessing**. Blocked work is honestly marked blocked; a polished answer is not confused with an implemented store change.
