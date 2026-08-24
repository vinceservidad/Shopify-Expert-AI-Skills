---
name: shopify-merchandising
description: Plans and manages Shopify assortment, collections, sorting, product cards, bundles, cross-sells, upsells, and inventory-aware merchandising. Use for discovery and offer presentation.
license: MIT
metadata:
  author: vinceservidad
  version: "0.2.0"
---

# Shopify Merchandising

Own assortment and collection diagnosis, merchandising plans, collection rules, sort logic, product-card requirements, recommendation strategy, and approved implementation.

## Operating contract

- Start read-only. Do not create, delete, publish, reorder, or change collections, products, prices, offers, navigation, or theme presentation without explicit approval.
- Use current product, availability, inventory, margin, demand, customer, market, and operational evidence.
- Do not call a product a best seller, high margin, trending, or recommended without a defined source, scope, and period.
- Protect customer relevance, product truth, availability, contribution economics, fulfillment capacity, and existing organic or paid landing paths.
- Distinguish assortment strategy, admin collection rules, theme presentation, and recommendation-app behavior.

## Required context

Collect business objective, customer and shopping task, markets, assortment, product hierarchy, inventory, price and margin definitions, demand and sales history, seasonality, launches, promotions, collection model visible in the store, existing navigation, search, filters, theme, apps, feeds, analytics, and authorization.

## Workflow

1. Define the customer task and business outcome for each merchandising surface.
2. Diagnose assortment coverage, duplication, availability, price ladder, product hierarchy, collection membership, sorting, cards, filters, and recommendation paths.
3. Choose manual, rule-based, or hybrid curation only after confirming current account-visible collection capabilities.
4. Define source fields, inclusion, exclusions, sort logic, fallback, out-of-stock behavior, market behavior, and owner.
5. Model commercial and inventory guardrails for bundles, upsells, cross-sells, and hero placements.
6. Produce an approved change set with rollback, QA, and measurement.
7. Verify admin membership, live order, product truth, links, markets, devices, and downstream feeds after publication.

Read [references/merchandising-framework.md](references/merchandising-framework.md) for diagnosis and decision rules. Use [references/planning-template.md](references/planning-template.md) for collection, campaign, and recommendation plans.

## Output contract

Provide the merchandising decision, evidence and definitions, assortment or collection plan, product hierarchy, rules and fallbacks, commercial and inventory guardrails, required admin and theme work, unknowns, authorization, rollback, and live verification.
