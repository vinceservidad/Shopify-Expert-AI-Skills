# Order Exception Handling

## Escalate before action

- payment dispute, chargeback, suspected fraud, or account takeover
- high-value or unusual order under the merchant's policy
- personal-data access or correction request
- legal, regulatory, safety, medical, or restricted-product issue
- policy exception or remedy beyond the VA's authority
- third-party fulfillment conflict
- partial fulfillment, complex edit, duplicate refund risk, or unclear inventory consequence
- missing permission, conflicting status, or inability to verify the target order

## Proposed action record

```yaml
decision:
verified_facts:
policy_basis:
unknowns:
action:
payment_effect:
refund_effect:
inventory_effect:
fulfillment_effect:
customer_notification:
third_party_effect:
permission:
authorization:
correction_or_rollback:
```

## Post-action verification

Check only the states relevant to the action:

- order timeline and status
- payment, void, capture, refund, or credit state
- fulfillment, cancellation, return, or exchange state
- restock and inventory location
- shipping label or third-party fulfillment state
- customer notification or support follow-up
- accounting, tax, app, and reporting consequences

If the platform is still processing, report processing and assign a follow-up owner. Do not report completion early.

## Privacy

Use order identifiers and minimized facts in operational reports. Keep addresses, phone numbers, email addresses, payment details, identity evidence, fraud notes, and sensitive customer information inside authorized systems whenever possible.
