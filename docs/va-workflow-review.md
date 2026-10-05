# VA workflow manual review

Reviewed September 30, 2026. This report records actual responses from native ChatGPT and Claude conversations using uploaded guides and synthetic practice facts. It is a qualitative review, not a benchmark, percentage score or expertise certification.

ChatGPT's original ten cases and three focused retests produced useful, evidence-grounded outputs. Claude's two fresh focused retests corrected payment wording and the inventory-state inference, but unsupported reply wording remains. Its final handover also adds an unnecessary completion requirement. AI-written drafts still require human review.

## What was reviewed

- The original packet covered S01–S10: eight workflows and nine exception behaviors. Each case represented a separate fictional client.
- Both clients received uploaded copies of five owner skills and eight workflow references. Focused retests used S06, S07 and S10 in fresh conversations with revised instructions.
- ChatGPT ran in the web interface. The retest selection displayed “Pro, 5 of 5”; an exact model ID was not captured. Claude's original and first retest ran in its desktop interface; the final fresh retest used its web interface. Both displayed “Fable 5.1 Medium.” These are recorded interface labels.
- No live Shopify calls, store edits, message sends, refunds or schedules were performed. Reading the uploaded files was part of the practice. These runs do not verify native connector installation or store permissions.

“Observed” below means the actual answer provided a useful result within the supplied facts. “Issue” identifies unsupported wording; it does not imply an external action occurred.

## Original workflow observations

| Workflow / cases | ChatGPT | Claude |
| --- | --- | --- |
| Client work guide / S01 | Observed: assigned work, voice, approvals and missing policies. | Observed: usable brief with the supplied roles and access limits. |
| Daily work plan / S02 | Observed: conditional 45-minute block, deadlines, missing inputs and owner decisions. An early handover draft is valid. | Observed: deadline priorities and blocked inputs; no completed-task claim. |
| Product listing check / S03 | Observed: unsupported heat/stress claims removed; SKU/price unchanged; image check still needed. | Observed: factual corrected description and review checklist; microwave use remains unknown. |
| Catalog review / S04 | Observed: duplicate SKU, title correction and incomplete coverage. | Observed: same conflict; identifier changes require owner approval. |
| Stock review / S05, S09 | Observed: Ash's threshold applied only to tracked available stock; Juniper's reorder quantity withheld. | Observed: tracked/untracked distinction and no imported threshold or numerical reorder recommendation. |
| Customer reply / S06, S10 | Observed: holding drafts, correct evidence limits and no unsupported delivery/refund result. | Issue: S06 rewrites PENDING as “processing” and promises tracking. S10's proposed follow-up needs an approved owner process. |
| End-of-day handover / S07 | Observed: draft, verified record change, unverified sorting and failed edit remain distinct. | Issue: correctly labels the edit failed, but “Stock unchanged as far as evidence shows” lacks a subsequent read. |
| VA training / S08 | Observed: normal/missing-fact practice and reviewer checklist within practice permissions. | Observed: supported-claim exercises and review steps; no certification or access promotion. |

## Nine exception behaviors

The actual answers address missing policy and an unavailable order (S10), unsupported product claims (S03), duplicate SKUs and incomplete pages (S04), untracked stock (S05), missing thresholds (S09), incomplete handover evidence (S07 O-3), and a failed external edit (S07 O-4).

Neither client imported another client's policy or stock threshold. Neither claimed a reply was sent, a refund issued or tomorrow's delivery verified. Claude kept O-4 failed. Its original unsupported assurance about unchanged stock is preserved as a recorded failure; both focused retests correctly leave the current stock unverified.

## Repairs and focused retests

The [customer reply reference](../skills/shopify-support/references/customer-reply.md) now preserves observed status meaning and requires an approved process for future service commitments. The [handover reference](../skills/shopify-va/references/end-of-day-handover.md) requires a later authoritative read before describing a failed edit's target as unchanged.

- **ChatGPT, first revision:** S06 keeps payment pending and avoids delivery/tracking promises. S07 states that current stock and partial effects remain unverified. S10 asks for the order/store reference and owner verification without inventing refund eligibility or a follow-up process.
- **Claude, first revision:** payment remains pending and S07 correctly leaves current stock unverified. Support still has issues: “you'll be able to see the dispatch status” remains in the draft, followed by an internal instruction to remove it if unsupported. It also requests bank confirmation and checkout email without a supplied process requiring those details. S10 retains a future follow-up commitment.
- **Final reference revision:** unsupported sentences must be removed from the customer-facing draft before presentation. An internal caveat cannot repair them. Identifier requests must be minimal; bank documents and checkout contact details must not be requested without a required, approved process.

The final fresh Claude web retest produced these actual outcomes:

| Case | Improved behavior | Remaining issue |
| --- | --- | --- |
| S06 | Keeps payment PENDING, separates the customer's statement and refuses a tomorrow-delivery promise. No bank-document request. | “It may just need to finish confirming on our side” speculates about an unknown payment cause. “Happy to check again” offers follow-up while its internal note says the approved contact path is missing. Remove unsupported reassurance and ground any proposed follow-up in the owner's process. |
| S07 | O-1 stays a draft, O-3 unverified, and O-4 failed with current stock/partial effects unknown. | Says “none at full requested terminal state” despite the supplied same-target read verifying O-2's approved title. A storefront check was not part of that record-title assignment; keep it as a coverage limit without withholding the verified record-level completion. |
| S10 | Leaves order availability, refund eligibility and policy unknown; requests only the order number. No checkout-email request. | “Once I've verified the order and delivery status, I'll let you know the next step” still commits to a future response without a supplied, approved follow-up process. |

The final retest is complete, but these remaining issues prevent an all-clear result. Working instruction and store-data tools do not make every AI-written sentence reliable. Review the draft against the client's facts, scope and approvals before using it.

## Evidence and limits

All conversations below were reviewed September 30, 2026. The links require access to the relevant account; they are not public share links.

- [ChatGPT original S01–S10](https://chatgpt.com/c/6abd0550-a890-83ec-a5cf-8c0d064f992a)
- [ChatGPT focused retest S06/S07/S10](https://chatgpt.com/c/6abd140b-edb4-83ec-815f-1c01d69345d0)
- [Claude original S01–S10](https://claude.ai/chat/68158aa1-0462-48e9-ac2c-d450fff9f0b7)
- [Claude first focused retest S06/S07/S10](https://claude.ai/chat/71026846-7a58-4cb8-84a9-94a344bddd56)
- [Claude final fresh web retest S06/S07/S10](https://claude.ai/chat/9ed42fbd-3054-477a-825d-ec3651af58a0)

Complete original responses and retest captures are preserved privately outside the repository. Original failures have not been erased or replaced by revised answers. This small practice batch does not establish reliability across all 19 skills, every VA task, production stores or separate editing connections.

The workflow behavioral benchmark [scenarios 31–39](../evals/core-scenarios.md) remain `needs-review` and ungraded. This report adds manual observations; it does not change any benchmark grades or imply that the remaining live release checks are complete.
