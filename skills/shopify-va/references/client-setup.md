# Set up my client's work guide

Workflow ID: `client_setup`. Use when a merchant or VA asks for a reusable guide to the client's routine Shopify work. Produce a draft for owner review using supplied evidence. Keep the guide in the user's ChatGPT or Claude chat/project files; the MCP does not retain client documents.

## Inputs

Required to prepare the task:

- `assigned_tasks`: scope, cadence, due states, acceptance criteria, and exclusions.
- `approval_roles`: who may approve each action and the exact authority already granted.

Optional inputs, required when they affect the guide:

- `client_brief`: market, timezone, channels, business purpose, and source documents with dates. A pre-existing brief is not required to build one.
- `store_identity`: the exact store and environment to which the guide applies.
- `brand_voice`: approved tone, terminology, examples, and claims to avoid.
- `policies`: current shipping, returns, refunds, warranty, support, and other policies needed by the assigned tasks.
- `escalation_roles`: who owns exceptions, urgency rules, and the approved contact route.

Input names identify available materials; they do not prove the materials are complete, current, or authoritative. Do not request passwords, tokens, customer addresses, or owner credentials. If a policy or role is missing, mark it unresolved and identify the owner decision needed.

## Procedure

1. Confirm the store and assigned role. Identify conflicts between the brief, policies, and task instructions; ask the accountable owner to resolve consequential conflicts.
2. Build a short source index. Record document title, version/date, applicable market, and fields it governs. Separate approved facts from examples and unapproved suggestions.
3. Write the role boundaries, brand rules, task instructions, acceptance criteria, and escalation routes. Link the existing owner skill for each task.
4. For each task, record whether it is read-only, a draft, or a specifically authorized action. A work guide, task schedule, or MCP workflow does not grant store editing permission.
5. Mark unresolved policy and authority fields visibly. Prepare an owner-review checklist before treating the guide as approved.

## Reusable work guide

```text
Client / store / market / timezone:
Guide version / prepared date / owner reviewer:
Approved sources and dates:
Role purpose:
Assigned tasks and required terminal states:
Out-of-scope tasks:
Brand voice: tone / preferred terms / prohibited claims / approved example:
Policy rules by task and market:
Task instruction: inputs → steps → exception → QA → owner:
Approval record: exact action / target / authority / date / approver:
Escalation: trigger / accountable owner / urgency / approved contact route:
Missing or conflicting inputs and decisions needed:
Review outcome: draft / owner-approved / revision needed:
Next review trigger: policy change / role change / tool change:
```

Use a compact task table when several jobs share the same guide:

| Task | Source | Required result | Approval needed | Stop/escalate when | Reviewer |
| --- | --- | --- | --- | --- | --- |
| Draft support replies | Current support policy | Reply draft plus unknowns | Separate authority to send | Policy missing or remedy exception | Support owner |
| Check listings | Approved product facts | Comparison and proposed corrections | Separate authority for exact edits | Claim lacks evidence | Catalog owner |

## QA and escalation

- Can a new VA identify the correct store, source, task, and reviewer without guessing?
- Are market-specific policies and unresolved fields visible?
- Does each action have an exact scope and required evidence of completion?
- Are contact routes supplied by the owner, rather than invented or automatically messaged?
- Does the guide preserve least privilege and avoid storing sensitive credentials?

If a separate editing connection is approved later, the handoff must name its exact target, fields/action, existing authorization, expected saved state, and verification step. Report its result only after observing that state. A failed or unavailable edit remains unresolved.

## Practice example

Synthetic brief: “North Sample Goods, Philippines; VA may draft replies and review ten named products. Tone: warm and concise. Shipping policy absent; catalog owner is the listing reviewer.”

Expected judgement: prepare both task instructions, label the shipping policy missing, and keep sending/publishing outside the draft authority. Do not invent a delivery promise or broaden the ten-product scope. Reviewer criterion: all three boundaries appear in the guide and the missing policy has an accountable owner.

## Source notes

Reviewed 2026-09-30. Original templates above apply the articles' general advice on documented recurring tasks, brand context, limited roles, and regular review. They do not adopt historical prices or Shopify plan guidance.

- [How to Hire a Virtual Assistant for Shopify](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services), published August 17, 2022.
- [How To Become a Virtual Assistant](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant), published August 7, 2025.
