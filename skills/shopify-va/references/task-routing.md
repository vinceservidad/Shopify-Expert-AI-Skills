# Shopify VA Task Routing

Use one owner for the final output. Add another skill only for a distinct specialty.

The shared operating lifecycle is:

`CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE ↺`

Lifecycle stage and specialist owner are separate decisions. A request may be at `diagnose` and still belong to `shopify-theme-development`, or at `measure` and belong to `shopify-analytics`. Do not route every stage to `shopify-va`.

## Stage routing

| Lifecycle stage | Routing rule |
| --- | --- |
| `context` | `shopify-va` may normalize mixed-task context; a bounded specialist can collect its own required context directly |
| `goal` | Merchant/client/accountable owner sets material business outcomes; a specialist can preserve an already-bounded technical or operational objective |
| `diagnose` | Route to the skill that owns the problem domain: store audit, analytics, CRO, theme, catalog, orders, ads, SEO, email, Flow, or another specialist |
| `strategy` | Route to the specialist that owns the domain decision; merchant/client/accountable owner approves material commercial tradeoffs |
| `plan` | `shopify-va` may coordinate multi-skill routine plans; specialists retain their workstream decisions |
| `implement` | Owning specialist plus the actually available authorized tool/runtime; lifecycle state is not permission |
| `verify` | Owning specialist verifies authoritative saved/live state and representative conditions |
| `measure` | `shopify-analytics` owns reconciled cross-system/business performance; domain specialists may own bounded local measurement |
| `optimize` | Domain specialist owns the next change; merchant/client/accountable owner approves material business tradeoffs or scope expansion |

Start at the earliest unresolved stage that can materially change the requested decision. Do not force every task through all nine stages.

## Specialist routing

| Request | Owner skill | Escalate when |
| --- | --- | --- |
| Mixed routine admin task list | `shopify-va` | Scope, access, priority, stage, or ownership is ambiguous |
| Product opportunity or supplier research | `shopify-product-research` | Legal, regulated, financial, or supplier-verification risk is material |
| Create or update one product | `shopify-product-listing` | Product truth, price, tax, claims, or publishing approval is missing |
| Bulk products, taxonomy, tags, metafields, imports | `shopify-catalog-operations` | Overwrite, deletion, inventory, handle, or channel risk exists |
| Collections, sorting, assortment, bundles, cross-sells | `shopify-merchandising` | Commercial strategy or theme implementation is required |
| Order, fulfillment, return, refund, or cancellation | `shopify-order-operations` | Money, customer harm, fraud, payment, or policy exception is involved |
| SOP, onboarding, quiz, or QA program | `shopify-va-training` | Policy owner or system access is unavailable |
| Whole-store diagnosis | `shopify-store-audit` | Technical, legal, or measurement work needs a specialist |
| Funnel experiment | `shopify-cro` | Live test launch or tracking changes are requested |
| Product-page message or structure | `shopify-product-page` | Product truth or claims are unsupported |
| Ad concepts and briefs | `shopify-creative-strategy` | Publishing or campaign changes are requested |
| Meta Ads | `shopify-meta-ads` | Any live account change is requested without approval |
| Google Ads or Merchant Center | `shopify-google-ads` | Any live account or feed change is requested without approval |
| Organic search | `shopify-seo` | Publishing, redirects, canonicals, or theme edits are required |
| Email or SMS | `shopify-email-marketing` | Consent, suppression, sending, or offer changes are involved |
| Shopify Flow | `shopify-flow-automation` | Enabling, customer data, or external actions are involved |
| Customer message or FAQ | `shopify-support` | Sending, refunding, or policy exceptions are involved |
| Liquid or theme code | `shopify-theme-development` | Publishing or production risk is involved |
| Reporting and diagnosis | `shopify-analytics` | Definitions, data quality, or source reconciliation is unresolved |

## Role boundary

The lifecycle is designed for merchants, freelancers, agencies, VAs, developers, marketers, and store operators, but role changes authority:

- A **merchant/client/accountable owner** approves material business tradeoffs and live scope.
- A **freelancer/agency/specialist** may diagnose, plan, implement, and verify only inside the agreed engagement and permissions.
- A **Shopify VA** can execute a defined procedure and flag exceptions. Expert or owner judgment is still required for unsupported assumptions, commercial tradeoffs, policy exceptions, legal judgment, irreversible actions, or changes beyond the VA's approved role.
- A **developer** owns technical implementation only within the approved technical scope; technical access does not imply commercial or publishing authority.

Do not disguise expert judgment as a routine checklist item, and do not promote a broad engagement into universal store permission.

## Permission check

Before an external action, confirm:

```yaml
role:
available_permissions:
required_permissions:
unnecessary_permissions:
target_store:
current_lifecycle_stage:
authorized_action:
approver:
acceptance_criteria:
rollback:
verification_source:
```

If a permission or approval is missing, stop at the draft or handoff state. Do not seek owner credentials as a workaround.
