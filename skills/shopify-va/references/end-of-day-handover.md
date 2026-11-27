# Prepare my end-of-day handover

Workflow ID: `end_of_day_handover`. Summarize requested work so the next person can continue from the actual observed state. A handover is prepared on request; it sends no messages and creates no recurring schedule.

## Inputs

Required to prepare the task:

- `task_log`: requested task, store/target, authorization, intended terminal state, action attempts, and latest state.

Optional inputs, required when they support a reported result:

- `verification_evidence`: authoritative saved/live observations, timestamps, reviewed draft artifacts, and scope of each check.
- `blocked_tasks`: missing evidence, policy, approvals, access, failed actions, and next accountable owners.
- `priorities`: owner-supplied next priorities and deadlines.

Without verification evidence, mark task states unverified and leave “Completed” empty; preparing a handover can still proceed.

Client logs and documents stay in the user's chat/project files. If logs or evidence are incomplete, report that limitation. Do not manufacture accomplishment counts or infer successful execution from a plan, tool request, success toast, or another agent's unverified summary.

## Procedure

1. Reconcile each task with its requested target and terminal state. Evidence for a similar product, another store, or a preview cannot prove the requested result.
2. Label outcomes precisely: verified requested state, draft ready for review, attempted but unverified, failed, blocked, or not started.
3. Put only tasks whose requested terminal state has been verified in “Completed.” A draft-only assignment may be complete when its artifact and review criteria are verified, but it belongs under “Drafts ready” and must remain labelled draft-only.
4. Record the latest observation after a failed external edit. Distinguish captured before state, current observed state, intended target, and proposed recovery. An error, including `PERMISSION_DENIED`, does not verify that a record stayed unchanged. Without a later authoritative read of the exact target, label its current state and any partial effects unverified; never claim rollback succeeded without evidence.
5. Give each unresolved item one concrete next action and accountable owner. Include missing inputs and incomplete pagination or location coverage when relevant.
6. Produce the handover in the user's supplied format if one exists. Otherwise use the compact template below, omitting empty sections rather than inventing work.

## Reusable handover

```text
Store / date / timezone:
Requested scope and sources:

Completed and verified
- Task / exact target / requested state / observed result / evidence and time:

Drafts ready for review
- Artifact / review criterion checked / reviewer / action still needed:

Attempted, failed, or unverified
- Task / attempt / before state / latest observed state / unknowns / recovery owner:

Blocked
- Task / missing policy, input, approval, or access / owner decision / next action:

Next actions
- Task / next step / accountable owner / supplied deadline:

Coverage limitations
- Records, pages, locations, periods, or terminal states not checked:
```

If the owner requested figures, count verified tasks separately from drafts and failed attempts. Explain the denominator for reviewed records. Business lift, revenue, or time savings require measured evidence and are not implied by task completion.

## QA and escalation

- Every completed claim cites evidence for the exact requested state.
- Drafts do not imply a reply was sent, refund issued, product published, or stock changed.
- Partial checks do not become store-wide assurance.
- An external connection's failed or ambiguous action stays unresolved.
- “Unchanged” is a result claim too. Report it only when a later authoritative read supports it, not because an attempt failed or no later success was reported.
- A handoff to a separate approved editing connection includes exact target/action, existing authority, and the verification needed after the edit; it does not grant approval.
- Sensitive customer details and credentials are excluded from the handover.

Escalate conflicting state evidence, possible partial changes, unavailable verification, and overdue owner decisions to the supplied accountable role. Prepare the escalation note without sending it.

## Practice example

Synthetic log: one customer reply draft exists; a product edit request returned an error; a product re-read still shows the old title; stock review fetched 20 variants with another page remaining.

Expected judgement: list the reply under drafts ready, the edit under failed with its latest observed title and recovery owner, and stock review with incomplete coverage. Do not write “reply sent,” “listing updated,” or “all inventory checked.” Reviewer criterion: all reported states match the supplied evidence.

If an inventory edit returned `PERMISSION_DENIED` and no later read is available, write: “Edit attempt failed with a permission error. Current stock and any partial effects remain unverified. The owner must resolve access and verify the exact inventory record before a retry.” Do not write “stock unchanged.”

## Source notes

Reviewed 2026-09-30. This original handover template applies the value of documented processes and regular review described in Shopify's VA guidance; it does not reuse historical prices or platform recommendations.

- [How to Hire a Virtual Assistant for Shopify](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services), published August 17, 2022.
- [How To Become a Virtual Assistant](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant), published August 7, 2025.
