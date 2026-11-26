# Shopify VA Operating Checklists

## Task record

```yaml
task_id:
request:
business_purpose:
owner_skill:
target_store_and_resource:
source_of_truth:
authorization:
permissions:
dependencies:
pre_change_evidence:
procedure:
acceptance_criteria:
rollback:
due_date:
approver:
status:
verification_evidence:
exceptions:
```

## Safe task sequence

1. Confirm the correct store and resource.
2. Capture the current state or export when rollback requires it.
3. Check source freshness and conflicting edits.
4. Perform only the approved action.
5. Keep draft-only deliverables unsaved in the target platform. Save an inactive record only when that save is authorized; do not activate, publish, or send it.
6. Reopen the resource and compare it with the approved source.
7. Verify the correct channel, market, customer, or live surface when publication was approved.
8. Record exceptions and do not hide partial completion.

## Recurring work

For daily, weekly, or monthly tasks, record:

- schedule and timezone
- source cutoff and freshness
- exact filters and saved views
- duplicate-run protection
- holiday and absence coverage
- alert threshold and owner
- failure and catch-up behavior
- last successful verified run

## QA sample

Use a risk-based sample for repetitive tasks and full review for high-risk fields. Increase review when the source, template, staff member, app, or process is new. Do not encode a universal sample percentage.

## Handoff note

```text
Completed: [verified terminal state]
Target: [store and resource]
Source: [document or system]
Changed: [exact fields or actions]
Unchanged: [protected scope]
QA: [checks and evidence]
Exceptions: [open items]
Approval or escalation: [owner and decision needed]
Rollback: [reference or procedure]
```

## Approval matrix

Agree this table with the owner in the first week and store it with the store
profile. The default below is a starting point. The owner's written version
wins, and anything not listed needs approval.

| Action | Default decision |
| --- | --- |
| Draft product copy, replies, reports | VA drafts and checks |
| Add internal notes, order Timeline comments, task records | VA |
| Add or change tags that drive collections, discounts, or Flow | Owner approves |
| Publish a product, change a price, or adjust inventory quantities | Owner approves |
| Refund, cancel, or edit an order | Owner approves the amount and action |
| Create, change, or end a discount | Owner approves value, scope, and dates |
| Publish a theme | Owner approves the preview |
| Send an email or message to customers | Owner approves copy, audience, and time |
| Turn on a Shopify Flow workflow | Owner approves after a test |
| Install or remove an app | Owner only |
| Payments, payouts, billing, staff, or permissions | Owner only |

Record each approval with who, when, and where (the agreed channel). A verbal
or implied yes is not recorded approval. A limit such as "refunds up to [amount]"
applies only when written into the matrix.

## Client update (end-of-day and weekly)

Send updates at the agreed time and timezone. Plain text that pastes cleanly
into chat or email; no tables or formatting.

```text
[Store] update, [date or date range, timezone]

Done:
- [task]: [verified state]

Results:
- [metric]: [exact figure] vs [comparison figure] ([change as number and percent])

In progress or blocked:
- [task]: [state], waiting on [owner or evidence]

Next:
- [task] by [date]

Needs your decision:
- [question with options]
```

Rules:

- Copy every figure from a named report and state its date range. Never write a
  figure from memory or estimate a count. Label projections as projected.
- Show change as a number and a percent. If the comparison value is zero, say
  so and leave out the percent.
- Do not explain why a figure moved unless evidence shows the cause. Write
  "cause not confirmed" otherwise.
- Separate verified done from drafted, saved, or pending work; never round
  partial completion up to done.
- Route reconciled performance questions to `shopify-analytics` rather than
  diagnosing them inside the update.
- Report mistakes the same day: what happened, what was fixed, and what changes
  next time.

For copy-ready bulk CSV QA, BFCM readiness, chargeback evidence, and daily shift handover sheets, see [deliverable-templates.md](deliverable-templates.md).
