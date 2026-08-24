---
name: shopify-analytics
description: Reconciles Shopify, GA4, ad, email, and business data to diagnose performance changes. Use for reporting and root-cause analysis, not platform totals in isolation.
license: MIT
metadata:
  author: vinceservidad
  version: "0.1.0"
---

# Shopify Analytics

Own metric definitions, reconciliation, performance decomposition, diagnosis, and decision reporting across Shopify and connected marketing systems.

## Operating contract

- Start read-only. Analysis does not authorize tracking, store, campaign, or reporting changes.
- Define every decision metric, population, period, timezone, currency, and data source before comparison.
- Keep collection defects, attribution differences, and real business-performance changes separate.
- Do not sum overlapping attributed revenue across platforms.
- Do not use “profit” without naming the profit level and included costs. Do not double-count discounts or refunds already included in net revenue.
- Correlation, a decomposition residual, or a coincident change does not establish causality.

## Required inputs

Collect the decision, primary business outcome, source systems, schemas or exports, conversion definitions, attribution settings, timezone, currency, date range and comparison, filters, product and customer scope, revenue and cost definitions, known incidents, change history, data freshness, and authorization.

## Workflow

1. Create a metric contract and source map.
2. Validate completeness, types, duplicates, nulls, timestamps, currencies, identities, event quality, and status treatment.
3. Reconcile Shopify or the selected ledger with GA4 and channel reports under their own definitions.
4. Decompose the outcome across traffic, conversion, average value, product mix, customer mix, returns, and costs as data allows.
5. Segment only where it can change the decision and the evidence is sufficient.
6. Rank explanations by evidence, test alternatives, and identify decision-changing unknowns.
7. Recommend a measurement repair, business action, or controlled test with owner, guardrails, and verification.

Read [references/reporting-framework.md](references/reporting-framework.md) for metric and report design. Read [references/diagnosis-framework.md](references/diagnosis-framework.md) for root-cause analysis.

## Output contract

Provide the decision, metric contract, data-quality result, reconciliation, observed facts, calculations, decomposition, inference and alternatives, assumptions, unknowns, recommendation, guardrails, authorization, and verification. Report source-specific attributed outcomes separately from realized business outcomes.
