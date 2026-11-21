# Train a new VA

Workflow ID: `va_training`. Prepare role-specific instructions, sanitized practice tasks, exception cases, and a reviewer checklist. Training does not grant permissions, certify expertise, or establish production competency from a quiz.

## Inputs

Required to prepare the task:

- `role_charter`: assigned outcomes, permitted tasks, exclusions, store/tool context, approval owners, and escalation routes.
- `current_sops`: actual task instructions, source inputs, decision rules, and current review requirements.

Optional inputs, required when they affect practice or assessment:

- `approved_policies`: current market/task-specific rules and allowed remedies.
- `reviewer_criteria`: owner-approved quality, accuracy, judgment, and access-progression criteria.
- `learner_baseline`: observed experience and learning needs; do not infer skill from a job title.
- `practice_environment`: sanitized files, simulated records, or an approved test store and explicit access boundaries.

Input names indicate availability, not validation. If a task lacks a policy or current SOP, teach the learner to stop, identify the missing evidence, and escalate. Keep client and learner files in chat/project files, not the MCP.

## Procedure

1. Confirm the assigned role and permitted practice environment. Use sanitized examples by default; never request owner credentials or customer/payment data for practice.
2. Select only relevant existing workflows: client setup, daily planning, listing review, catalog review, stock review, reply drafting, and handover. Document each task's source and exact result.
3. Write the task SOP below with decision points, failure recovery, and review criteria. Keep approvals explicit; a workflow or training exercise grants no editing authority.
4. Give a small realistic task plus one exception. Require the learner to explain evidence and unknowns as well as produce the artifact.
5. Assess actual submitted responses or observed work. Separate factual accuracy, procedure, judgment, verification, and communication. Leave any new behavioral scenario ungraded until an actual response is reviewed.
6. Record the correction and next practice needed. Do not label an unrun exercise passed or use sample answers as proof of model/learner performance.
7. Prepare a reviewer recommendation. Any access change or independent production work remains an explicit owner decision based on supervised evidence.

## Reusable task SOP

```text
Task / business purpose / role:
Practice environment and permitted actions:
Required inputs / authoritative sources / versions:
Steps:
1. Confirm target and scope.
2. Inspect sources and identify unknowns.
3. Apply the documented rule within scope.
4. Prepare the artifact or authorized result.
5. Verify the required state and record limitations.
Decision point / exception / stop condition / accountable owner:
QA criteria and evidence needed:
Failure recovery: latest observed state / next permitted action:
Required result and handover:
```

## Sanitized practice set

The examples below are original simulations. Their facts and thresholds apply only to the exercise.

| Exercise | Supplied facts | Learner task | Reviewer judgment |
| --- | --- | --- | --- |
| Listing truth | Approved bottle is 500 mL; listing says 750 mL and “48 hours cold” without test evidence | Prepare a source comparison and corrected draft | Correct capacity; hold unsupported claim; no invented replacement claim |
| Catalog scope | Two variant IDs share `SAMPLE-BLUE`; another page remains | Report the duplicate and coverage | Name conflicting IDs; avoid rename/delete; do not claim catalog-wide completion |
| Stock exception | Main available threshold is below 5; quantities 3, absent/untracked, and -1 | Produce a location-specific stock report | Apply supplied comparator; separate unknown and negative; no unsupported reorder |
| Support uncertainty | Order is fulfilled; tracking and refund policy missing | Write a holding reply and internal verification note | No delivered status, promised date, refund issued, or message sent claim |
| Failed edit handover | An external edit failed; re-read shows old title; reply exists as draft | Prepare end-of-day handover | Edit remains failed; reply remains draft; next owner and evidence are clear |

To assess a later authorized edit exercise, supply the exact approval and before state, require the approved separate connection, and inspect saved state afterward. A success toast alone is insufficient. Failed edits remain failed or unverified, with recovery proposed rather than assumed.

## Reviewer checklist and record

```text
Learner / reviewer / exercise / observed date:
Submission or observed-work evidence:
Factual accuracy: supported / errors found / not observed:
Procedure: target, scope, source and rule followed / correction needed:
Judgment: missing evidence and escalation handled / correction needed:
Verification: correct terminal state and coverage recorded / correction needed:
Communication: clear artifact, draft labels and next owner / correction needed:
Critical errors and correction:
Status: ungraded / reviewed, revision needed / reviewed, exercise criteria met:
Next supervised practice:
Owner decision on access: unchanged / separate explicit approval record:
```

Use the owner's criteria and record actual evidence. “Exercise criteria met” describes that exercise only. Expertise, production readiness, permission, speed, and commercial results are separate claims requiring their own evidence.

## QA and escalation

- SOPs use the current client policy and assigned scope rather than generic business assumptions.
- Exercises use sanitized examples or an explicitly approved test environment.
- Missing policy, unavailable order, partial pages, untracked stock, unsupported claims, and failed actions have clear recovery paths.
- Assessment remains ungraded before an actual response is reviewed.
- Training recommendations do not certify expertise or expand permissions.

Escalate missing SOP ownership, unsafe practice data, unclear approvals, and critical errors to the named reviewer. Prepare notes without automatically contacting anyone or granting access.

## Source notes

Reviewed 2026-09-30. These original exercises apply documented VA processes, ecommerce task examples, and role-specific service skills. They do not copy the articles' full text, pricing, or historical Shopify plan advice.

- [How to Hire a Virtual Assistant for Shopify](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services), published August 17, 2022.
- [How To Become a Virtual Assistant](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant), published August 7, 2025.
- [How To Start a Virtual Assistant Business](https://www.shopify.com/ph/blog/how-to-start-a-virtual-assistant-business), published October 2, 2025.
