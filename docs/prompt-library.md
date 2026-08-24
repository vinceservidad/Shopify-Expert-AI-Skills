# Shopify Expert AI Skills Prompt Library

Replace the bracketed fields and attach the evidence named in the request. Keep the work read-only unless you intentionally authorize a specific external change.

## Store audit

```text
Use the shopify-store-audit skill.

Audit [store URL or attached store evidence] for [market and customer].
Objective: [primary business outcome].
Scope: [pages, devices, markets, and customer state].
Period: [date range] versus [comparison range].
Evidence: [screenshots, Shopify analytics, GA4, research, policies, and exports].

Start read-only. Separate observed facts, calculations, inferences,
assumptions, and unknowns. Show strengths worth preserving, prioritized
issues, evidence, missing inputs, recommended next steps, guardrails,
authorization required, rollback, and verification.
```

## CRO

```text
Use the shopify-cro skill.

Diagnose [funnel stage or conversion problem].
Population: [market, device, traffic, products, and customer type].
Period: [date range] versus [comparison range].
Primary business outcome: [defined outcome].
Evidence: [funnel export, GA4, heatmaps, research, change history, and offer].

Do not assume the visible page caused the result. Check measurement, mix,
stock, price, offer, traffic, and operational alternatives. Build a
prioritized experiment brief with hypothesis, primary metric, commercial
guardrail, quality checks, decision rule, stopping rule, and approval needed.
```

## Product page

```text
Use the shopify-product-page skill.

Audit and draft improvements for [product page].
Primary reader: [customer].
Traffic context: [channel or intent].
Approved promise: [claim].
Evidence: [product data, specifications, proof, policies, reviews with source,
offer, price, availability, and current page].

Use one primary message and call to action. Never invent claims, ingredients,
results, reviews, scarcity, shipping, warranty, or availability. Return a
truth table, evidence gaps, proposed page order, copy draft, implementation
notes, and QA. Draft only. Do not publish.
```

## Creative strategy

```text
Use the shopify-creative-strategy skill.

Create a testable creative strategy for [product and objective].
Audience: [audience and awareness evidence].
Approved promise and proof: [details and source].
Offer: [current truthful offer].
Placements and formats: [platform requirements].
Evidence: [customer research, existing assets, performance, landing page,
brand voice, and restricted claims].

Create distinct concepts, hooks, production briefs, and a testing matrix.
Separate sourced customer language from paraphrase. Do not invent UGC,
testimonials, results, or urgency. Do not select winners from CTR alone.
```

## Meta Ads

```text
Use the shopify-meta-ads skill.

Run a read-only Meta Ads audit for [account and market].
Objective: [primary business outcome].
Period: [date range] versus [comparison range].
Evidence: [campaign, ad set, ad, creative, placement, audience, event,
attribution, Shopify order, economics, inventory, and change-history data].

Separate collection quality, attribution, and business performance. Diagnose
delivery, creative, traffic, landing page, offer, checkout, availability,
retention, and measurement. Do not change budgets or campaigns. Propose only
reversible tests with economics, capacity, guardrails, stopping rules, and
approval points.
```

## Google Ads

```text
Use the shopify-google-ads skill.

Audit [Google Ads and Merchant Center scope] read-only.
Objective: [primary business outcome].
Period: [date range] versus [comparison range].
Evidence: [conversion actions, settings, history, search terms, keywords,
campaigns, products, feed diagnostics, assets, landing pages, Shopify orders,
economics, inventory, and capacity].

Separate Brand Defence, non-brand Search, Shopping, Performance Max, products,
and queries where evidence allows. Use “Primary conversion action” only for
the Google Ads setting. Do not equate blended ROAS with acquisition profit.
Provide facts, calculations, unknowns, controlled recommendations, guardrails,
stopping rules, and approval required. Do not change the account.
```

## SEO

```text
Use the shopify-seo skill.

Audit and plan SEO for [store, market, and language].
Objective: [organic and business outcome].
Evidence: [Search Console, analytics, crawl, index coverage, rankings, pages,
products, collections, content inventory, backlinks, theme, and app behavior].

Map each meaningful intent to one primary page. Check technical SEO, page
targeting, content truth, structured data, internal links, and conversion path.
Do not invent volume, difficulty, rankings, traffic, or expected revenue.
Return a prioritized roadmap with implementation risk, rollback, and
post-release verification. Do not publish changes.
```

## Email marketing

```text
Use the shopify-email-marketing skill.

Audit and plan [email, SMS, flow, or campaign scope].
Lifecycle objective: [objective].
Primary business outcome: [defined outcome].
Evidence: [events, consent, suppression, segments, current flows, deliverability,
attribution settings, Shopify outcomes, product, offer, policy, brand, and economics].

Map entry, eligibility, branches, delays, messages, exits, suppression,
conflicts, and measurement. Do not add overlapping attributed revenue across
channels. Draft only. Do not enable a flow, change consent, or send messages.
```

## Shopify Flow

```text
Use the shopify-flow-automation skill.

Design [workflow objective] for [target store].
Current manual process: [process].
Evidence: [account-visible triggers, actions, fields, plan, installed apps,
sample records, expected volume, privacy rules, and failure owner].

Verify current task availability before relying on it. Produce a trigger,
condition, and action specification with field map, exclusions, idempotency,
duplicate handling, retries, failures, alerts, privacy, positive and negative
tests, rollback, monitoring, and approval required. Do not enable it.
```

## Customer support

```text
Use the shopify-support skill.

Draft a response for [customer issue].
Verified evidence: [order status, fulfillment, carrier, payment, product,
policy version, prior contacts, and allowed remedies].
Unknowns: [missing facts].
Brand voice: [voice].

Separate customer statements from verified facts. Do not invent order status,
refund eligibility, delivery dates, product outcomes, policy exceptions, or
completed actions. Provide the customer-facing draft, internal note,
verification needed, escalation path, and authorization state. Do not send.
```

## Theme development

```text
Use the shopify-theme-development skill.

Diagnose and implement [exact theme issue] in [theme, branch, and environment].
Expected behavior: [expected].
Actual behavior: [actual].
Reproduction: [steps, page, product state, market, browser, and device].
Evidence: [theme files, logs, screenshots, app dependencies, and recent changes].
Authorization: [read-only, draft code, or exact approved implementation].

Preserve unrelated work. Diagnose content, configuration, app, data, Liquid,
JSON, CSS, JavaScript, and browser causes. Validate syntax, representative
states, accessibility, responsiveness, performance, editor behavior, and
rollback. Do not publish without explicit approval. Verify the canonical live
store only after approved publication.
```

## Analytics

```text
Use the shopify-analytics skill.

Explain [performance question] for [scope].
Primary business outcome: [defined outcome].
Period: [date range] versus [comparison range].
Sources: [Shopify, GA4, Meta, Google Ads, email, costs, refunds, and other data].
Definitions: [orders, revenue, profit level, included costs, conversion events,
attribution, timezone, currency, and filters].

Validate data quality, reconcile sources, and separate collection defects,
attribution differences, and real business changes. Do not sum overlapping
attributed revenue. Show formulas, decomposition, alternative explanations,
decision-changing unknowns, recommendation, guardrails, and authorization.
```
