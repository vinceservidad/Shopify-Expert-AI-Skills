# Shopify VA Task Routing

Use one owner for the final output. Add another skill only for a distinct specialty.

| VA request | Owner skill | Escalate when |
| --- | --- | --- |
| Mixed routine admin task list | `shopify-va` | Scope, access, or priority is ambiguous |
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

## VA versus expert boundary

A VA can execute a defined procedure and flag exceptions. An accountable specialist or owner must make decisions that require unsupported assumptions, commercial tradeoffs, policy exceptions, legal judgment, irreversible actions, or changes beyond the VA's approved role.

Do not disguise expert judgment as a routine checklist item.

## Permission check

Before an external action, confirm:

```yaml
role:
available_permissions:
required_permissions:
unnecessary_permissions:
target_store:
authorized_action:
approver:
```

If a permission is missing, stop at the draft or handoff state. Do not seek owner credentials as a workaround.
