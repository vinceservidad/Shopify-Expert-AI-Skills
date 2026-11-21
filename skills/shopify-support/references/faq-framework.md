# FAQ and Macro Framework

## Source hierarchy

Build reusable answers from current policy, product data, fulfillment rules, legal or compliance guidance, and verified support operations. Use ticket themes to find gaps, not to override policy.

## FAQ record

```yaml
question:
customer_job:
answer:
conditions_and_exceptions:
source:
source_owner:
market_or_product_scope:
last_reviewed:
next_review:
escalation_path:
```

## Macro design

A macro should reduce repetitive drafting without pretending every case is identical.

Include:

- the situation and eligibility conditions
- fields the agent must verify
- approved response text with clearly named variables
- conditions that require editing or escalation
- actions the macro does not perform
- review owner and date

Never hide a policy decision inside a vague variable such as `[appropriate resolution]`.

## Theme analysis

When summarizing support contacts:

- define the population, date range, channels, and taxonomy
- separate contact volume, unique customers, orders, issue rates, and severity
- preserve source links without exposing unnecessary personal data
- label manually coded samples and analyst interpretations
- do not claim a product or page caused a theme without stronger evidence

## Publication checks

Before approved publication, verify the answer against the live policy and relevant market. After publication, inspect the canonical live page or help-center entry, links, mobile rendering, searchability, and version state.

## Chat instant answers (Shopify Inbox)

Instant answers reply to customers automatically, so each one is a published
policy statement. Build them like FAQ entries, not like quick macros.

1. **Find the questions.** From a defined sample of recent messages (date
   range, channels, count), group messages by question and count each group.
   Remove names, emails, phone numbers, and order details before analysis.
2. **Check the sources.** Answer only from the live shipping, returns, refund,
   and FAQ pages. When a page does not answer the question, mark the answer
   `NEEDS OWNER` instead of writing one. List any pages that contradict each
   other and send that conflict to the policy owner first.
3. **Draft short answers.** Keep each answer brief enough for a chat window,
   state conditions and exceptions, and link the policy page. Never promise a
   delivery date, refund, or exception that the policy does not grant.
4. **Get approval.** The owner approves each answer in writing before it is
   added. Record the approval with the FAQ record fields above.
5. **Add and test.** After approval, add each answer in Shopify Inbox's
   instant answer settings. Test the live chat on the storefront on desktop and
   mobile, and confirm each answer matches the approved text.
6. **Review.** Re-check every instant answer when a policy page changes and on
   the FAQ record's review date. A stale automatic answer is a live policy
   error.

Report the state of each answer as drafted, approved, added, or verified on the
storefront. Inbox menu paths change; confirm them in the Shopify Help Center.
