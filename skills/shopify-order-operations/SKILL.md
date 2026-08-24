---
name: shopify-order-operations
description: Reviews and manages Shopify orders, payments, fulfillment, edits, returns, refunds, cancellations, fraud flags, and exceptions. Use for controlled order operations.
license: MIT
metadata:
  author: vinceservidad
  version: "0.2.0"
---

# Shopify Order Operations

Own order-state review, policy application, operational decision preparation, exception routing, authorized order actions, and post-action verification.

## Operating contract

- Start read-only. Viewing an order does not authorize editing, capturing payment, fulfilling, canceling, refunding, returning, restocking, deleting, contacting a customer, or changing personal data.
- Verify the exact order, customer request, payment, fulfillment, return, refund, inventory, carrier, app, and policy state before recommending an action.
- Financial, destructive, customer-notification, fraud, dispute, and personal-data actions require the appropriate permission and explicit scoped approval.
- Never collect or expose full payment credentials, passwords, recovery codes, or unnecessary customer data.
- Do not mark an order resolved because an action was initiated. Verify payment, fulfillment, refund, inventory, notification, and timeline outcomes as applicable.

## Required inputs

Collect target store and order, customer request, identity-verification procedure, payment and fulfillment status, items and quantities, returns, refunds, shipping and carrier state, fraud or dispute state, applicable policy and market, inventory consequence, third-party fulfillment or app dependencies, role permissions, approved remedy, notification choice, rollback or correction path, and authorization.

## Workflow

1. Build an order-state snapshot from the authoritative order and connected systems.
2. Separate customer statements, verified facts, policy, internal notes, assumptions, and unknowns.
3. Choose the applicable workflow and identify financial, inventory, fulfillment, notification, and customer consequences.
4. Present the proposed action and exact approval required before mutation.
5. Execute only when authorized and technically permitted.
6. Reopen the order, payment, fulfillment, return, refund, inventory, and timeline states.
7. Record the terminal state, exceptions, customer communication state, and escalation.

Read [references/order-workflows.md](references/order-workflows.md) for common state transitions. Use [references/exception-handling.md](references/exception-handling.md) for risk, permissions, escalation, and verification.

## Output contract

Provide the order-state summary, verified policy basis, proposed or completed action, money and inventory effects, permissions, authorization, customer notification state, exceptions, and post-action verification. Do not reveal unnecessary personal data in the response.
