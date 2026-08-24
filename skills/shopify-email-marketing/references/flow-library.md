# Flow Library

Use these patterns only after confirming events, consent, platform capabilities, and business need.

## Welcome

**Entry:** valid marketing consent.
**Exclude:** suppressed, invalid, or already in an incompatible onboarding path.
**Job:** set expectations, clarify the brand or category, and help the customer take a relevant next step.
**Exit:** purchase, consent withdrawal, suppression, or defined timeout.

## Browse or product interest

**Entry:** verified product or category interest with permission to message.
**Check:** event reliability, identity, availability, and recent purchase.
**Job:** help evaluation with factual product, fit, proof, or comparison information.
**Exit:** purchase, newer intent, product unavailability, or timeout.

## Cart or checkout recovery

**Entry:** valid cart or checkout event.
**Check:** purchase suppression, cart contents, price, discount, inventory, consent, and transactional versus marketing classification.
**Job:** restore the path, resolve a likely objection, or provide support.
**Exit:** purchase, invalid cart, consent withdrawal, or timeout.

## Post-purchase

**Entry:** authoritative paid or fulfilled order state as appropriate.
**Branches:** product, fulfillment status, first versus repeat customer, subscription, market, and support status.
**Job:** set expectations, support correct use, reduce avoidable contacts or returns, and prepare the next useful step.
**Exit:** cancellation, refund, return, support escalation, or completion.

## Replenishment or win-back

Set timing from observed purchase cycle, product use, subscription state, inventory, and customer behavior. Do not invent depletion timing or imply a customer needs a product without evidence.

## Flow specification

```yaml
name:
business_decision:
entry_event:
eligibility:
consent:
exclusions_and_suppression:
branches:
delays:
messages:
exit_conditions:
frequency_conflicts:
measurement:
guardrails:
test_cases:
authorization:
rollback:
```
