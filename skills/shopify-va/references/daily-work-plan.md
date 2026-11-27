# Plan today's work

Workflow ID: `daily_work_plan`. Build a prioritized plan from the owner's queue, current guide, and handover. Run only when requested; a daily plan creates no schedule or background monitoring.

## Inputs

Required to prepare the task:

- `task_queue`: requested jobs, exact targets, current status, dependencies, and acceptance criteria.

Optional inputs, required when they affect the plan:

- `client_work_guide`: approved scope, policies, role, approval and escalation owners.
- `deadlines`: due times, timezone, owner-supplied priority, and available work time.
- `prior_handover`: unfinished work, evidence, failures, and decisions waiting on an owner.
- `stock_thresholds`: merchant rules needed for stock tasks in the queue.
- `source_cutoff`: the last update or observation time for task evidence.

Keep these materials in the user's chat/project files. Missing queue or deadline evidence limits prioritization; missing policy or approval can block an affected action without blocking unrelated draft work. Do not infer authority from a task label such as “urgent” or “manage store.”

## Procedure

1. Confirm the store, date, timezone, available time, and requested scope. Reconcile the queue with the prior handover to avoid duplicating completed work.
2. Separate actionable tasks, drafts that can proceed, verification work, and tasks awaiting evidence or authority.
3. Order tasks by supplied urgency, real deadline, customer/business impact supported by evidence, and dependencies. Explain unresolved priority conflicts; do not invent commercial impact or numeric estimates.
4. Route each task to its existing owner skill. For listing, catalog, stock, support, or training work, select the corresponding practical workflow.
5. Define the smallest useful result and review criterion for each task. Record the next action and accountable owner for blocked tasks.
6. Return the plan and decisions needed. Do not fetch unrelated store records, perform edits, send messages, or claim work has started merely because it is planned.

## Reusable daily plan

```text
Store / date / timezone / available time:
Source guide / queue / previous handover and dates:
Today's priority basis:
```

| Order | Task and target | Why now | Owner skill | Next action | Required result / QA | State / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [requested task] | [deadline or supported impact] | [skill] | [read/review/draft] | [observable criterion] | [ready/blocked/awaiting review] |

```text
Owner decisions needed: question / affected task / owner / due time if supplied:
Missing inputs: source / consequence / safe work still possible:
Carryover: task / latest evidence / next action:
```

Use source-backed time estimates only. If effort is unknown, mark it unknown and suggest a bounded first step instead of promising completion within a fabricated duration.

## QA and escalation

- Every planned task belongs to the confirmed store and authorized scope.
- Priorities cite a supplied deadline, owner instruction, or observed issue.
- Drafts, reviews, approvals, and external execution remain distinct.
- A task awaiting an owner's policy decision is not presented as ready to send or edit.
- Pagination or stale evidence is recorded before a catalog-wide conclusion is planned.

A separate approved editing connection may receive a prepared handoff containing exact target, action, existing approval, pre-change evidence, and a saved-state verification requirement. The plan itself grants no permission. Escalate missing policies, conflicting deadlines, unavailable access, and failed prior actions to the named owner; do not automatically message them.

## Practice example

Synthetic queue: a reply draft is due at 10:00 Manila time, a five-product listing review at 16:00, and an inventory report has no merchant threshold. The reply's return policy is missing. No store edits are authorized.

Expected judgement: prepare a holding draft and the missing-policy request; proceed with the listing comparison; prepare inventory coverage and data exceptions but withhold low-stock classification until thresholds arrive. Reviewer criterion: the plan explains dependencies without inventing priorities, policy, or editing authority.

## Source notes

Reviewed 2026-09-30. This original planning template applies documented recurring processes and regular review to VA task coordination; it excludes historical pricing and plan advice.

- [How to Hire a Virtual Assistant for Shopify](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services), published August 17, 2022.
- [How To Become a Virtual Assistant](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant), published August 7, 2025.
