# Ecommerce Growth Audit

Use growth audit mode when the question is "what is limiting this store's growth?" rather than "what is wrong with the storefront?". It extends the store audit across acquisition, conversion, order value, retention, measurement, and operations, and ends in one growth diagnosis, one priority roadmap, and an engagement scope outline.

`shopify-store-audit` keeps ownership of the final output. Specialists diagnose inside their own domain; this mode composes their findings, resolves conflicts, and decides the order.

## Choose the mode by evidence access

| Mode | Evidence available | What it may conclude | What it must not conclude |
|---|---|---|---|
| `outside-in snapshot` | Public surfaces only: storefront, public policies, public ad libraries, public search results, public reviews | Observed issues on visible surfaces and the questions they raise | Revenue impact, conversion rates, account performance, a limiting constraint, or a growth diagnosis |
| `full growth audit` | Supplied exports or read access: Shopify analytics and orders, ad accounts, email platform, analytics, economics | A growth diagnosis bounded by the evidence, with limits named | Causality from correlation, or a constraint the evidence cannot separate from alternatives |

Start in the mode the evidence supports. Never infer private metrics from public signals, and never attempt access that was not granted. A snapshot becomes a full audit only when the merchant supplies data or access.

## Growth model

State the basis before diagnosing:

```text
revenue = sessions × conversion rate × average order value   (one stated revenue basis)
         + repeat revenue from returning customers
contribution profit = revenue − COGS − variable fulfillment − payment fees
                      − refunds not already deducted − media spend (when "after media")
```

Name the revenue basis (gross sales or net sales, tax and shipping treatment) and the profit level with included costs. Do not subtract discounts or refunds twice. A change that raises revenue, conversion rate, average order value, or attributed revenue while lowering contribution profit after media is not growth.

When economics are missing, give a break-even table or a sensitivity range instead of a profitability verdict, and call the diagnosis limited.

## Orchestration map

Each lens has an owner. Use the specialist's method and evidence rules for findings inside its domain. When the Marketing Skills catalog (`vinceservidad/marketing-skills`) is installed, its specialists may deepen the cross-channel lenses; when it is not, use the Shopify specialist and state that the cross-channel view is narrower.

| Lens | Question | Shopify owner | Optional Marketing Skills depth |
|---|---|---|---|
| Measurement | Can the numbers be trusted enough to diagnose? | `shopify-analytics` | `tracking-measurement`, `marketing-analytics` |
| Storefront journey and conversion | Where do qualified visitors fail to buy? | this skill's six lenses, `shopify-cro`, `shopify-product-page` | `cro` |
| Offer, assortment, and order value | Is the offer clear and does order value hold margin? | `shopify-merchandising` | `offer-strategy`, `pricing-monetization` |
| Catalog and feed quality | Can products be found, compared, and advertised correctly? | `shopify-catalog-operations`, `shopify-product-listing` | |
| Organic search | Is qualified organic demand reached and converted? | `shopify-seo` | `seo` |
| Paid search and Shopping | Is search and product-feed spend reaching profitable demand? | `shopify-google-ads` | `google-ads` |
| Paid social and creative | Is social spend and creative producing profitable new customers? | `shopify-meta-ads`, `shopify-creative-strategy` | `meta-ads`, `creative-strategy` |
| Lifecycle and retention | Do first-time customers come back, and is lifecycle revenue counted once? | `shopify-email-marketing` | `lifecycle-marketing`, `retention-strategy`, `retention-economics` |
| Theme and performance | Does the theme block tasks or slow key templates? | `shopify-theme-development` | |
| Operations and support | Can fulfillment, returns, and support sustain more volume? | `shopify-order-operations`, `shopify-support`, `shopify-flow-automation` | |

Business-level priority across lenses belongs to this mode unless Marketing Skills `growth-strategy` is installed, in which case hand it the reconciled findings and let it own the cross-business priority. Paid-media scaling recommendations must pass Marketing Skills `optimization-scaling` gates when available; otherwise recommend no spend increase until measurement, economics, and conversion fundamentals are verified.

Do not run every lens by reflex. Run the lenses the evidence makes plausible and record skipped lenses with the reason.

## Workflow

1. **Frame.** Primary business outcome, revenue basis, profit level, baseline period, comparison period, markets, and authorization boundary. Record a supplied growth target as asserted; do not invent one.
2. **Check measurement first.** If orders, revenue, or conversions disagree materially across sources, the first finding is the measurement gap. Diagnose on the source of truth and label attributed figures as platform-reported.
3. **Decompose the change.** Using the growth model, locate which term moved or lags: sessions by source, conversion rate by device and landing template, order value, new versus returning revenue, refunds, media cost.
4. **Run the relevant lenses** through their owners. Each finding uses the issue record in [frameworks.md](frameworks.md) plus `lens`, `owner_skill`, and `growth_term` (sessions, conversion, order value, repeat, cost, or measurement).
5. **Reconcile.** Merge duplicate findings across lenses, keep contradictions visible, and drop findings with no plausible path to the named outcome.
6. **Diagnose the limiting condition.** Name one binding constraint only when evidence separates it from alternatives. Otherwise record a constraint set, independent constraints, or `not yet identified`, and name the evidence that would settle it.
7. **Sequence the roadmap.** Verified defects and measurement gaps first, then reversible tests on the diagnosed constraint, then expansion. Record explicit non-priorities.
8. **Outline the engagement scope** from the roadmap (see below).

## Growth diagnosis output

Lead with the diagnosis and its evidence coverage, then:

1. scope, mode, sources, dates, and lenses skipped with reasons
2. growth model baseline with the revenue basis and profit level
3. limiting condition or constraint set, with supporting and contradicting evidence
4. reconciled finding register, grouped by growth term
5. strengths worth preserving
6. priority roadmap:
   - **Now:** verified defects, measurement repair, and approval-gated corrections
   - **Next:** tests on the diagnosed constraint, each with hypothesis, owner, stopping rule, and verification
   - **Later:** expansion that depends on earlier results
   - **Not now:** plausible work deliberately deferred, with the reason
7. unknowns that would change the order, and how to obtain them
8. authorization required, rollback, and verification for each change

Do not attach revenue or conversion lift estimates to roadmap items without a credible model or a measured test. Describe direction and the evidence that will confirm it.

## Engagement scope outline

When the audit is performed by a service provider, translate the roadmap into scope options the merchant can choose between. Derive every option from roadmap items; do not add services the diagnosis does not support.

```yaml
option:                 # for example: fix list only, implementation, ongoing optimization
roadmap_items_covered:
deliverables:
merchant_inputs_needed:
access_and_approvals_required:
verification_and_reporting:
exclusions:
pricing:                # supplied by the provider; never generated
```

Frame options by the business problem each solves, not by service names. Do not promise outcomes, guarantee results, or quote prices the provider did not supply.

## Outside-in snapshot output

A snapshot is a short, verifiable observation that earns a conversation, not a diagnosis. Produce:

1. **Leading observation:** one issue observed on a public surface, with URL, device, and date observed.
2. **Why it may matter:** the plausible commercial mechanism, labeled as inference.
3. **What would confirm it:** the data a full audit would check.
4. **Other observations:** at most a few, each with its source.
5. **Offer:** a scoped audit as the next step.

Guardrails:

- Use only public information. Do not create accounts, place orders, submit forms with false details, or probe beyond normal visitor access.
- Do not estimate the prospect's lost revenue, conversion rate, or ad performance. Do not imply access, a relationship, or urgency that does not exist.
- Re-check the observation shortly before it is shared; storefronts change.
- This skill drafts outreach; a person reviews and sends it under the outreach, privacy, and consent rules that apply to them and the recipient.

## Reuse after the audit

Audit findings may become case studies or content only with the merchant's permission. Remove identifying details unless the merchant approves them, keep synthetic and real results distinct, and report outcomes only after they are measured on the source of truth.
