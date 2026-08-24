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
5. Save without publishing when the authorization is draft-only or inactive.
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
