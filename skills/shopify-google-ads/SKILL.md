---
name: shopify-google-ads
description: Audits Shopify Google Ads across queries, keywords, products, campaigns, Merchant Center, measurement, settings, history, and economics. Use for paid-search decisions.
license: MIT
metadata:
  author: vinceservidad
  version: "0.1.0"
---

# Shopify Google Ads

Own Google Ads and Merchant Center diagnosis for Shopify. An audit is incomplete if decision-relevant query, keyword, product, measurement, settings, history, or economics evidence is missing and not named.

## Operating contract

- Start read-only. Do not change campaigns, budgets, bids, targets, keywords, negatives, audiences, assets, product groups, listing groups, feeds, conversion goals, or tracking without explicit approval.
- Reserve “Primary conversion action” for the Google Ads action-optimization setting. Use “primary business outcome” for the commercial result.
- Separate Brand Defence from non-brand acquisition and Shopping performance where evidence permits. Blended ROAS can hide weak acquisition.
- Treat Google Ads attribution as a model, not the realized-revenue ledger.
- Avoid broad negatives that could block protected product or brand demand.
- Do not use a universal scaling percentage or assume undocumented algorithm behavior.

## Required evidence

Collect account and Merchant Center scope, objective, dates, timezone, currency, conversion actions and settings, attribution, change history, campaign settings, search terms, keywords, landing pages, assets, products and product groups, diagnostics, audiences, locations, devices, schedules, auction data, order-system results, unit economics, inventory, capacity, and authorization.

## Workflow

1. Verify measurement definitions, Primary conversion actions, value, currency, counting, deduplication, attribution, and reconciliation.
2. Segment Brand, non-brand Search, Shopping, Performance Max, remarketing, markets, products, and customer type when the data supports it.
3. Audit queries, keywords, match types, negatives, landing pages, ads, assets, product data, product groups, feeds, diagnostics, settings, and history.
4. Diagnose at the lowest useful level: query, keyword, product, asset group, campaign, market, or device.
5. Use realized revenue or a named profit proxy with explicit included costs.
6. Preserve valuable coverage and learning. Propose sequential, reversible changes with evidence, hypothesis, guardrail, review date, result, and decision.
7. Apply scaling gates before any budget or target recommendation.

Read [references/campaign-structure.md](references/campaign-structure.md) for structural choices. Use [references/audit-checklist.md](references/audit-checklist.md) for exhaustive audit coverage.

## Output contract

Provide the decision, scope, evidence coverage, facts, calculations, measurement and attribution state, Brand versus acquisition view, query and product findings, economics, diagnosis, unknowns, recommended tests, guardrails, stopping rules, authorization, and verification state.
