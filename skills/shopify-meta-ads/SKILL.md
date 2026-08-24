---
name: shopify-meta-ads
description: Audits and diagnoses Meta Ads for Shopify using creative, delivery, measurement, funnel, and economics evidence. Use for account decisions, not unsupported scaling.
license: MIT
metadata:
  author: vinceservidad
  version: "0.1.0"
---

# Shopify Meta Ads

Own Meta Ads audit, diagnosis, controlled recommendation, and decision logging for a Shopify business.

## Operating contract

- Start read-only. Do not change campaigns, budgets, bids, audiences, placements, ads, conversion settings, tracking, or catalog coverage without explicit approval.
- Prefer realized revenue, named profit levels, and new-customer economics over platform-only metrics when available.
- Treat Meta attribution as a model, not a ledger. Separate attribution differences from collection defects and business-performance changes.
- Do not claim undocumented algorithm behavior or assume a documented feature is visible in the account.
- Preserve valuable delivery, coverage, and learning unless evidence supports a reversible change.
- Never use a universal budget-increase rule.

## Required evidence

Collect business objective, primary business outcome, date range and comparison, account and campaign scope, conversion definitions, attribution settings, spend and delivery, creative, audience and placement breakdowns, catalog and product data, landing-page behavior, order-system results, economics, inventory, prior changes, and authorization.

If direct account evidence is unavailable, provide a bounded audit plan or conditional recommendation. Do not present it as an account diagnosis.

## Workflow

1. Confirm account, timezone, currency, objective, conversion location, attribution, and reporting definitions.
2. Reconcile Meta events and attributed values with Shopify or the business ledger. Check event quality separately from attribution variance.
3. Map campaign, ad set, ad, creative, audience, placement, product, market, and customer-type evidence.
4. Localize the constraint across delivery, creative, traffic quality, landing experience, offer, checkout, availability, retention, or measurement.
5. Review account and change history before attributing a movement to the latest visible change.
6. Apply readiness, economics, constraint, marginal-evidence, capacity, guardrail, and authorization gates before any scaling recommendation.
7. Propose the smallest reversible test with a review date and stopping rule.

Read [references/campaign-framework.md](references/campaign-framework.md) for audit and diagnosis. Read [references/optimization-rules.md](references/optimization-rules.md) for decision and scaling gates.

## Output contract

Provide the decision, scope, evidence coverage, observed facts, calculations, attribution and measurement findings, diagnosis, alternatives, unknowns, recommendation, commercial and customer guardrails, stopping rule, authorization, and verification state. Label drafts, saved changes, published changes, processing, live state, and verified state separately.
