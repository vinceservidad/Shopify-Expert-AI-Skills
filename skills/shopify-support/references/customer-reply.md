# Help me answer this customer

Workflow ID: `customer_reply`. Prepare a customer-facing reply draft, a factual basis, and any escalation needed. This connector is read-only: it cannot send replies, issue refunds, cancel orders, arrange replacements, or approve exceptions.

## Inputs

Required to prepare the task:

- `customer_message`: the customer's question, channel, and relevant context with personal details removed where possible.
- `approved_policies`: current policy text, version/date, applicable market, permitted remedies, and exception owner.

Optional inputs, required when they affect the answer:

- `verified_order_facts`: exact store/order ID, observed status, product line-item coverage, and timestamps. Required for factual answers about a specific order.
- `verified_tracking_facts`: authoritative carrier events and timestamps. Required before stating delivery status or a carrier promise.
- `brand_voice`: approved tone and wording.
- `escalation_roles`: issue owner, urgency rules, and approved contact route.

The presence of an input name does not verify its contents. If a required policy is absent or stale, draft a holding response and request the exact policy; do not invent eligibility or remedies. Keep client materials in chat/project files, not the MCP, and use minimum necessary personal data.

## Procedure

1. Confirm the customer's main question and relevant store/market. Separate customer statements from verified facts and unknowns; a customer's requested refund is not evidence of refund eligibility.
2. When order data is needed, use `shopify_get_order_details` for the exact order. It reads financial/fulfillment status, cancellation state, and a page of product line items. It excludes customer identities, addresses, payment details, and carrier tracking evidence.
3. If the order is unavailable, do not guess whether it is absent, outside accessible history, or inaccessible. Report that the order could not be verified, identify the next permitted verification step, and produce a holding draft.
4. Record remaining line-item pages. Do not assume missing items were never ordered when the connection is incomplete.
5. Match the current approved policy to the issue. Fulfilled does not mean delivered; paid does not mean refund issued; cancellation state does not establish every refund or payment event. Carrier evidence and execution evidence remain separate.
6. Write a concise draft that acknowledges the question, states only supported facts, explains a truthful next step, and avoids unsupported dates or promises. Prepare internal notes separately.
7. Flag policy exceptions or missing facts for the supplied owner. Preparing an escalation does not send it or imply an owner has approved it.

## Reusable reply packet

```text
Issue / channel / applicable market:
Verified facts: fact / exact record or document / observed time:
Customer statements and unverified context:
Unknowns: policy / order / tracking / remedy / action evidence:
Policy basis: title / version / relevant rule:

Reply draft, not sent:
[acknowledgement]
[verified fact or clear limitation]
[truthful next step, without implying it already happened]
[contact path when supplied]

Internal note: verification needed / permitted remedy / exception owner:
Approval or external action required:
Current state: draft only / awaiting evidence / awaiting owner decision:
```

## QA and escalation

- Every order, tracking, policy, and remedy claim has authoritative evidence.
- Unknown carrier facts remain unknown; no invented arrival or delivery date.
- The draft does not say a message was sent, refund issued, replacement arranged, cancellation completed, or owner contacted unless execution was independently verified.
- Missing policies produce a holding draft and exact verification need.
- Customer names, addresses, payment details, and private notes are not exposed unnecessarily.
- Partial or unavailable orders do not become invented customer/order facts.

Escalate policy exceptions and sensitive disputes under the merchant's approved rules. Use the accountable owner when no exception rule exists. A separately approved sending or editing connection needs an exact target/action handoff, existing authority, and an authoritative verification requirement. Failure or ambiguous results remain unverified; do not rewrite the reply as if the action succeeded.

## Practice example

Synthetic customer message: “My parcel hasn't arrived. Can you refund me?” An exact order read says `FULFILLED`; no carrier evidence or current refund policy is supplied.

Suitable holding draft: “Thanks for letting us know. The order record shows it was fulfilled, but I can't confirm delivery from that status. Delivery tracking and the applicable refund policy need to be checked before a resolution can be confirmed.”

Expected judgement: label this a draft, request carrier facts and current policy, and identify the support owner without claiming they were contacted. Reviewer criterion: no delivered status, promised date, refund eligibility, or completed remedy is invented.

## Source notes

Reviewed 2026-09-30. This original reply process applies Shopify's customer-support task examples, brand context, and documented response guidance. It excludes historical pricing and platform recommendations.

- [How to Hire a Virtual Assistant for Shopify](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services), published August 17, 2022.
- [How To Become a Virtual Assistant](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant), published August 7, 2025.
