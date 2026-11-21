# Practical Shopify VA Jobs

Choose one job, provide the client's approved information and review the result. These eight workflows use the existing 19 skills. They organize work; they do not grant store access or approve changes.

These additions are currently in [PR #8](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/pull/8), not the main source download. To try them before a merge, [download the workflow-upgrade source ZIP](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/archive/refs/heads/feat/cloudflare-hosted-mcp.zip) and unzip it. This is source-file download, not a one-click plugin installation.

## Choose a job

| Request | Workflow ID | Owner and workflow reference | Result |
| --- | --- | --- | --- |
| Set up my client's work guide | `client_setup` | [shopify-va](../skills/shopify-va/SKILL.md): [client setup](../skills/shopify-va/references/client-setup.md) | A brief for brand voice, policies, tasks, approvals and escalation roles. |
| Plan today's work | `daily_work_plan` | [shopify-va](../skills/shopify-va/SKILL.md): [daily work plan](../skills/shopify-va/references/daily-work-plan.md) | Prioritized tasks, missing information and owner decisions. |
| Check this product listing | `product_listing_check` | [shopify-product-listing](../skills/shopify-product-listing/SKILL.md): [listing check](../skills/shopify-product-listing/references/product-listing-check.md) | Approved-fact comparison, missing content and a review checklist. |
| Review my product catalog | `catalog_review` | [shopify-catalog-operations](../skills/shopify-catalog-operations/SKILL.md): [catalog review](../skills/shopify-catalog-operations/references/catalog-review.md) | SKU conflicts, inconsistencies and proposed corrections within the checked records. |
| Review stock | `stock_review` | [shopify-catalog-operations](../skills/shopify-catalog-operations/SKILL.md): [stock review](../skills/shopify-catalog-operations/references/stock-review.md) | Exceptions against owner thresholds, locations and coverage gaps. |
| Help me answer this customer | `customer_reply` | [shopify-support](../skills/shopify-support/SKILL.md): [customer reply](../skills/shopify-support/references/customer-reply.md) | A reply draft, evidence gaps and any escalation needed. |
| Prepare my end-of-day handover | `end_of_day_handover` | [shopify-va](../skills/shopify-va/SKILL.md): [handover](../skills/shopify-va/references/end-of-day-handover.md) | Drafts ready, verified changes, blocked tasks and next actions. |
| Train a new VA | `va_training` | [shopify-va-training](../skills/shopify-va-training/SKILL.md): [VA training](../skills/shopify-va-training/references/va-training.md) | Instructions, practice tasks, exception cases and a reviewer checklist. |

## Use a workflow in an ordinary chat

1. Open the owner guide's `SKILL.md` and the linked workflow reference above. Attach both files to ChatGPT or Claude, along with any other references the owner guide requires. If `.md` uploads are rejected, attach `.txt` copies or paste the text.
2. Provide only the client files and facts needed for the job. Keep your client brief in the chat or project files, with its approval/version date. Do not include passwords, keys, payment details or unnecessary personal customer information.
3. Copy the matching request from the [prompt library](prompt-library.md#practical-va-jobs). Name the store, products, locations or workday being checked.
4. Review the result against the approved sources. Resolve missing facts with the owner. Record whether work is drafted, saved, published, verified, blocked or still unverified.

You can use uploaded evidence without a store connection. For repeated work, keep the guide files, client brief and dated evidence together in a ChatGPT or Claude project. The connector does not store your brief.

## What to provide

| Job | Useful inputs | If something is missing |
| --- | --- | --- |
| Client setup | Client/store name, approved brand voice, policies, task scope, approvers and escalation roles. | Draft a brief with named gaps. Do not invent policies or assume admin access is approval. |
| Daily work plan | Client brief, dated task list, deadlines, working time and previous blockers. | Plan the supported tasks and show decisions or evidence needed before the rest can start. |
| Listing check | Exact product, current listing/media, approved facts and listing rules. | Mark missing or unsupported claims. Proposed wording stays a draft. |
| Catalog review | Product/variant records, scope, identifiers and approved naming/SKU rules. | List conflicts only within the checked records. Fetch further pages or label coverage partial. |
| Stock review | Item identifiers, quantities and tracking state by location, owner thresholds and exclusions. | Show missing locations/pages or thresholds. Untracked or unknown stock is not zero, and no threshold is assumed. |
| Customer reply | Sanitized customer question, current policy, brand voice, escalation contact and verified order facts when relevant. | Draft a safe acknowledgment and escalation. Do not promise refunds or delivery dates without supporting facts. |
| Handover | Work log, draft links, approvals, successful verification evidence, failed actions and unresolved tasks. | Keep unsupported completion claims unverified and assign the next check. A failed external edit stays failed or blocked. |
| VA training | Assigned task, approved SOP/policies, sanitized normal and exception examples, reviewer and criteria. | Prepare practice only where possible. An exercise or quiz does not certify expertise or authorize access. |

## Using the upgraded local connector

The local **0.2.0** plugin/connector source has **12 tools**. The currently released hosted Worker remains **0.1.0 with eight tools**. Its hosted URL will not provide the four new tools until a separate release.

When the upgraded local connector is available, the AI can use:

- **`list_shopify_va_workflows`** to find the eight jobs, their required input names and expected results.
- **`prepare_shopify_va_task`** with a `workflow_id` and optional `provided_input_keys`. These keys are only declared names from the workflow's input list, such as the name for the client brief. The tool returns instructions, missing inputs, relevant guides and review steps. It makes no Shopify calls, stores no client documents and does not verify that the declared files contain complete or correct facts. Supply their contents separately in chat/project files.
- **`shopify_get_product_details`** to read description, media information and search details. Use existing variant and inventory reads for SKU, price and stock evidence. Product/media results can be incomplete; check coverage before claiming a full review.
- **`shopify_get_order_details`** to read financial and fulfillment status, cancellation state and one page of product line items. It excludes customer identities, addresses and payment details. Follow line-item pagination or label coverage partial. A missing/unavailable order is not proof that the order does not exist, and fulfillment status does not verify a delivery date or refund action.

Store permissions remain `read_products`, `read_inventory` and `read_orders`. See the [connector setup guide](plugin-and-connector.md) for tool contracts and optional configuration.

The required input names match the shared workflow registry:

| Workflow ID | Required input names |
| --- | --- |
| `client_setup` | `assigned_tasks`, `approval_roles` |
| `daily_work_plan` | `task_queue` |
| `product_listing_check` | `approved_product_facts`, `product_record` |
| `catalog_review` | `catalog_scope`, `catalog_records` |
| `stock_review` | `stock_scope`, `inventory_records`, `stock_thresholds` |
| `customer_reply` | `customer_message`, `approved_policies` |
| `end_of_day_handover` | `task_log` |
| `va_training` | `role_charter`, `current_sops` |

For example, if your task list and client work guide are already in chat/project files, the preparation call can use:

```json
{
  "workflow_id": "daily_work_plan",
  "provided_input_keys": ["task_queue", "client_work_guide"]
}
```

Use `list_shopify_va_workflows` for each job's allowed optional names. Invalid workflow IDs or input names return an error; choose the listed ID/keys and try again. The preparation result's `inputs_verified: false` means the AI must still inspect the actual evidence. An empty `missing_inputs` list only means required input names were declared.

## Review and hand off approved changes

Our connector is read-only. A workflow may prepare proposed changes for a separate editing connection that supports them, but the workflow cannot grant editing permission. Confirm the exact target and the owner's approval before using that connection.

After an approved edit, check the saved record in the correct store and any affected storefront result. Include successful evidence in the handover. If an edit fails or cannot be verified, record that state and the next action. A customer reply remains a draft until separate evidence confirms it was sent; an approved refund is not an issued refund.

These jobs run when requested. They create no schedules, background monitoring or automatic stock thresholds. Escalation rules come from the client.

## Sources and review date

These original workflow instructions and templates draw on Shopify's advice to document a process, define expectations and provide onboarding and feedback. The [Shopify VA hiring article](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services) supports using task instructions and response examples. The [VA skills article](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant) informs communication, organization, client preferences and ongoing practice.

Sources reviewed **September 30, 2026**. The workflows do not adopt the articles' service prices, hiring-platform comparisons or older platform instructions. The articles are context for these templates, not evidence of this toolkit's performance.
