# Chargeback & Payment Dispute Evidence Playbook

Official starting point:
- <https://help.shopify.com/en/manual/payments/chargebacks> (Chargebacks and inquiries)

Use this playbook when preparing a Shopify Payments dispute or inquiry evidence packet for owner review. A VA prepares the verified evidence packet and timeline; **only an authorized owner/finance lead approves and submits** the dispute response before the card-network deadline.

## 1. Immediate triage on receipt

1. **Record the exact deadline and timezone** shown in Shopify Admin (`Orders → Chargebacks` or order timeline). Late submissions lose automatically.
2. **Confirm the dispute type**:
   - **Inquiry / retrieval request**: bank asks for information; no funds withdrawn yet, but ignoring it can escalate to a chargeback.
   - **Chargeback**: funds and dispute fee are pulled immediately; submit complete rebuttal evidence once (most networks do not allow edits after submission).
3. **Identify the reason code**: `Fraudulent`, `Product not received`, `Product unacceptable / not as described`, `Subscription canceled`, `Credit not processed`, or `Duplicate`. Tailor the evidence directly to the reason code—never dump irrelevant screenshots.
4. **Pause duplicate refunds**: Never issue a Shopify refund on an open chargeback unless the merchant explicitly chooses to accept the dispute (refunding an open chargeback outside the dispute flow risks losing the money twice).

## 2. Evidence checklist by dispute reason

| Reason code | Highest-impact evidence to include |
| --- | --- |
| **Fraudulent / unrecognized** | Order confirmation with timestamp, IP address & geolocation match to billing/shipping address, AVS/CVV match from Shopify Fraud Analysis, prior undisputed orders from the same customer/email/device, carrier delivery confirmation to the verified shipping address, any customer email/chat acknowledging the order |
| **Product not received** | Carrier tracking number, full tracking scan history showing `Delivered` with date/time/city/ZIP, carrier proof-of-delivery photo or signature confirmation (especially on high-value orders), shipping address matching order confirmation, any customer reply confirming receipt or address request |
| **Product unacceptable / not as described** | Live product page description, sizing/spec chart, and product photos at purchase time, timestamped return/refund policy shown at checkout, full customer support email/chat log showing merchant offered an approved remedy (return label, replacement, partial refund) or customer never contacted support |
| **Subscription canceled** | Subscription checkout consent screenshot showing recurring terms, cancellation policy link accepted at purchase, account/portal event log showing cancellation date was after the disputed renewal billing timestamp, renewal reminder email timestamps |
| **Credit not processed / Duplicate** | Refund receipt / ARN (Acquirer Reference Number) and date if already refunded, or proof two orders had distinct timestamps, carts, or fulfillment tracking numbers proving they were separate legitimate purchases |

## 3. Winning packet structure (for Shopify Payments submission)

Keep the cover summary factual, concise, and chronological (card-issuer analysts spend minutes per case):

```text
Dispute summary — Order [name], [dispute reason], [amount + currency]
1. Order placed: [UTC/store timestamp], customer email/name verified, AVS/CVV [result].
2. Fulfillment: shipped [date] via [carrier] tracking [number], delivered [date] to [city/state/postal].
3. Policy & communication: [return/subscription policy accepted at checkout]; [summary of customer contact or note that customer did not contact support before disputing].
4. Attached evidence: [numbered list of files].
```

## 4. Guardrails & prevention follow-up

- **Never fabricate or alter screenshots, logs, or dates.** If a key piece of evidence (e.g., delivery scan or AVS match) is missing, flag it honestly so the owner can decide whether to accept the dispute instead of wasting time on an unwinnable rebuttal.
- **Minimize PII outside Shopify Admin**: Keep evidence files inside the merchant's approved secure folder; never paste card numbers, full addresses, or IDs into public chats.
- **Post-dispute loop**: Log root cause (fraud ring, unclear billing descriptor, late carrier scan, confusing subscription renewal) so ops can fix the Shopify Payments statement descriptor, add signature requirements on high-value orders, or enable a Flow high-risk hold rule.
