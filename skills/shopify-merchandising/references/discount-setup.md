# Discount Setup and Checkout Testing

Use this when the assignment is to create, change, or check a Shopify discount
for a promotion. A wrong discount costs money quickly, so the owner approves
the value, scope, and dates in writing before anything is saved or activated.

## Prerequisites

Do not configure anything until these are known. Each missing item blocks the
setting that depends on it, not the drafting of the plan.

```yaml
owner_request_verbatim:
offer_value:                 # percent or fixed amount, exactly as approved
applies_to:                  # products, collections, whole order, or shipping
customer_eligibility:        # everyone, segments, or specific customers
minimum_requirement:         # none, purchase amount, or item quantity
usage_limits:                # total uses, one per customer
combinations:                # which other discount classes may combine
start_and_end:               # date, time, and timezone
channels_and_markets:
margin_or_floor_guardrail:   # named source, or "unknown"
approver_and_channel:
```

## Choose the configuration

1. Map the request to the discount type that matches it exactly: amount off
   products, amount off order, buy X get Y, or free shipping. If the request
   could fit two types, ask which outcome the owner wants; do not pick the
   broader one.
2. Choose a discount code (the customer enters it) or an automatic discount
   (applied at checkout) and state one reason. Automatic discounts reach every
   eligible cart, so treat them as higher exposure.
3. Leave combinations off unless the owner asked for them. List every active
   discount that could stack before enabling any combination.
4. Always set an end date. An open-ended promotion needs explicit approval.
5. Check the store's current active automatic discount count against Shopify's
   limit before planning a new automatic discount; the limit can block launch.
6. Reuse an existing segment or collection only after confirming its rules
   still match the intended audience or products.

## Test plan

Write the tests before the discount is saved:

- at least three carts that should qualify, including the smallest qualifying
  cart and a multi-item cart
- at least two carts that must not qualify, such as an excluded product, a cart
  below the minimum, or an ineligible customer
- a stacking check with each discount that could combine
- a check after the end date or with the discount disabled, where possible

Run tests at checkout in a test or preview context the owner approves. Never
complete a real customer order to test a discount.

## Save, activate, and verify

1. Save the discount inactive or scheduled when the owner approved setup but
   not launch. Activation is a separate approval.
2. Reopen the saved discount and compare every field with the approved
   request.
3. Run the test plan and record expected versus actual totals for each cart.
4. Report the state exactly: drafted, saved inactive, scheduled, active, or
   verified at checkout. A saved discount is not a tested discount.

## Recurring check

Weekly, list active and scheduled discounts with their end dates, usage, and
combinations. Flag any discount past its intended window, without an end date,
or combining in a way the owner did not approve. Do not disable a live discount
without approval unless the agreed escalation rule allows it.

## Handoff

```text
Promotion: [owner request]
Configured as: [type] / [code or automatic] / [value]
Applies to: [scope]   Eligibility: [rule]   Minimum: [rule]
Limits: [usage]   Combinations: [setting]   Dates: [start to end, timezone]
State: [drafted | saved inactive | scheduled | active | verified at checkout]
Tests: [passed and failed carts with totals]
Approval: [who, when, channel]
Rollback: [disable or delete step and owner]
```

Discount types, limits, and settings change. Confirm current options in the
Shopify Help Center and the store's admin; see the repository's
`PLATFORM-CURRENCY.md` entry.
