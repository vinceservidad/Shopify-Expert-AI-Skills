# Worked example: prioritize a limited store audit

**All observations and numbers are synthetic teaching fixtures. No real store was visited.**

Start with the [supplied evidence record](../assets/worked-example/input.json). The [expected result](../assets/worked-example/expected.json) shows the evidence boundary, calculations, issue order, unknowns, and unchanged external state.

## Request

> Audit the supplied UK mobile/desktop evidence. Prioritize the most important corrections, explain the conversion comparison, and stay read-only.

## Evidence coverage

The fixture contains a mobile interaction record, two conflicting delivery-copy records, and device-level session counts for two equal 14-day periods. It does not contain original screenshots, real store access, session recordings, change dates, revenue, costs, inventory, or the authoritative shipping policy.

This is a limited audit. Treat the records as the example's inputs, not as observations you personally made in a browser.

## Expected conclusion

**Investigate and prepare a fix for the obstructed mobile checkout control first. Resolve the conflicting delivery promise with the policy owner next. Do not claim either finding caused the conversion decline.**

| Priority | Finding | Evidence | Next action |
| --- | --- | --- | --- |
| 1 | Promotional overlay covers the mobile checkout control in the interaction fixture | OBS-1 | Prepare a narrowly scoped layout correction; test mobile, keyboard, scrolling and overlay states before approval |
| 2 | Two UK pages promise different delivery windows | OBS-2, OBS-3 | Confirm the real policy before choosing or rewriting either promise |

The order is a case-specific judgment based on proximity to a blocked purchase action and the evidence supplied. It is not a universal prioritization formula. Do not add fabricated revenue-at-risk, confidence percentages, or conversion-lift estimates.

## Calculate the denominator correctly

The metric is sessions with at least one purchase divided by online-store sessions. It is not all-channel orders divided by sessions.

| Device | Previous | Current |
| --- | ---: | ---: |
| Mobile | 20 / 1,000 = 2.00% | 15 / 1,000 = 1.50% |
| Desktop | 25 / 500 = 5.00% | 25 / 500 = 5.00% |
| Overall | 45 / 1,500 = 3.00% | 40 / 1,500 = 2.67% |

Overall conversion declined about **0.33 percentage points**. Calculate from total converted sessions and total sessions. Averaging the current device percentages would incorrectly produce 3.25%.

The decline and the overlay observation are separate facts within the fixture. Missing change dates, traffic quality, availability and customer behavior prevent a causal conclusion. A screenshot or interaction record also cannot establish a full-site defect scope.

## Approval and QA

No live change is authorized. A proposed overlay correction needs an exact file/selector scope, rollback reference, and verification that the primary purchase control remains usable without hiding necessary information. The delivery copy needs an accountable policy source, not the assistant's preferred promise.

The reference checker confirms rates, source IDs, bounded priority records, and the absence of invented lift or causality. It does not perform visual inspection, diagnose a real merchant's code, or grade an independent AI answer. Preserve existing working behavior until evidence supports a scoped correction.
