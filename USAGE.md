# How to Use Shopify Expert AI Skills

This guide shows exactly how to install and use the skills in Claude and ChatGPT. No Shopify connection is required for read-only analysis. You provide the store evidence you want the assistant to examine.

## Choose one skill

Start with the skill that owns the result you need.

| Your task | Choose this skill |
| --- | --- |
| Manage or route a mixed Shopify VA task list | `shopify-va` |
| Research and validate a product opportunity | `shopify-product-research` |
| Create or update product listings | `shopify-product-listing` |
| Clean, import, or update a product catalog in bulk | `shopify-catalog-operations` |
| Plan collections, sorting, bundles, and recommendations | `shopify-merchandising` |
| Review orders, fulfillment, returns, refunds, or cancellations | `shopify-order-operations` |
| Train, onboard, and assess Shopify VAs | `shopify-va-training` |
| Audit the entire store | `shopify-store-audit` |
| Diagnose a funnel or plan an experiment | `shopify-cro` |
| Audit or rewrite a product page | `shopify-product-page` |
| Create ad concepts, hooks, or creative tests | `shopify-creative-strategy` |
| Audit or diagnose Meta Ads | `shopify-meta-ads` |
| Audit Google Ads, Shopping, or Merchant Center | `shopify-google-ads` |
| Plan technical, collection, product, or content SEO | `shopify-seo` |
| Plan email, SMS, campaigns, or lifecycle flows | `shopify-email-marketing` |
| Design or audit Shopify Flow automation | `shopify-flow-automation` |
| Draft support replies, macros, or FAQs | `shopify-support` |
| Build or debug Liquid and Shopify theme code | `shopify-theme-development` |
| Reconcile Shopify, GA4, ads, email, and business data | `shopify-analytics` |

Use one owner skill first. Add a second specialist only when it contributes a distinct part of the decision.

Use `shopify-va` when the request contains several routine admin tasks or the correct specialist is unclear. It will normalize the work and route each task without expanding the VA's permissions.

Example:

- `shopify-analytics` owns the answer to “Why did profit fall?”
- `shopify-google-ads` contributes query, product, campaign, and measurement evidence.

## Option 1: Install a skill in Claude

Claude can import these folders as custom skills.

### No-code installation

1. Open the [GitHub repository](https://github.com/vinceservidad/Shopify-Expert-AI-Skills).
2. Select **Code**, then **Download ZIP**.
3. Extract the downloaded repository.
4. Open the `skills` folder.
5. Choose one skill folder, such as `shopify-store-audit`.
6. Compress that individual folder as a ZIP.

The ZIP must contain the skill folder at its root:

```text
shopify-store-audit.zip
└── shopify-store-audit/
    ├── SKILL.md
    └── references/
        ├── checklist.md
        └── frameworks.md
```

Do not upload the whole repository ZIP as one skill.

7. In Claude, open **Customize > Skills**.
8. Select **Add** or **Create skill**, then **Upload a skill**.
9. Upload the individual skill ZIP.
10. Enable the skill.

If Claude does not show Skills, enable **Code execution and file creation** in the available account or organization settings. Availability and labels can vary by account.

### Installation using the packaging script

If you downloaded or cloned the repository and can use a terminal:

```bash
./scripts/package-skill.sh shopify-store-audit
```

Upload the generated file from:

```text
dist/shopify-store-audit.zip
```

### Your first Claude request

After enabling the skill, send:

```text
Use the shopify-store-audit skill.

Audit the supplied Shopify store screenshots and analytics exports.
Start read-only. Separate observed facts, calculations, inferences,
assumptions, and unknowns. Do not change the store.

Business objective: improve first-order contribution profit.
Market: [market]
Period: [date range] versus [comparison range]
Evidence: [list attached files, URLs, or screenshots]

Give me the five highest-priority issues, the evidence for each,
missing evidence, recommended next steps, guardrails, and the approval
needed before implementation.
```

If the skill does not activate automatically, name it explicitly as shown above.

## Option 2: Use a skill in ChatGPT

ChatGPT does not currently import an Agent Skills ZIP in the same way as Claude. Use one of the following setups.

### Custom GPT setup

Use this option if your ChatGPT workspace can create or edit a custom GPT.

1. Choose one skill folder.
2. Open its `SKILL.md` file on GitHub.
3. Copy the Markdown below the YAML metadata into the GPT's **Instructions** field. You can also keep the entire file when the editor accepts it.
4. Upload every file inside that skill's `references` folder as **Knowledge**.
5. Upload a completed [`business-context-template.md`](docs/business-context-template.md) with sensitive data removed.
6. Add any current brand, product, policy, measurement, or operating documents the task genuinely needs.
7. Enable only the capabilities required for the work.
8. Add two or three realistic conversation starters from the [`Prompt library`](docs/prompt-library.md).
9. Test the GPT in Preview.
10. Save or update it only after the test response follows the evidence and authorization rules.

Suggested GPT name:

```text
Shopify Store Audit Copilot
```

Suggested description:

```text
Audits Shopify stores using customer-journey, merchandising, trust,
performance, measurement, and operational evidence. Starts read-only
and separates facts from assumptions.
```

### ChatGPT Project setup

Use this when you want one workspace for a specific Shopify store.

1. Create a Project for the store.
2. Upload the chosen skill's `SKILL.md`.
3. Upload that skill's `references` files.
4. Upload a sanitized business-context file and current source documents.
5. Add this to the Project instructions:

```text
Use the uploaded SKILL.md as the operating procedure for relevant tasks.
Read only the reference files required by the current request.
Start read-only unless I explicitly approve a named external change.
Separate observed facts, calculations, inferences, assumptions, and unknowns.
Never invent store data, customer language, performance, claims, margins,
benchmarks, credentials, or causality.
```

6. Start with one of the prompts in [`docs/prompt-library.md`](docs/prompt-library.md).

### Ordinary ChatGPT conversation

For one-off work:

1. Upload one `SKILL.md` and its reference files.
2. Upload the evidence for the task.
3. Begin the request with:

```text
Follow the uploaded shopify-product-page SKILL.md for this request.
Start read-only and use only the supplied evidence for product claims.
```

This is guided use, not automatic skill installation. Restate the selected skill when starting a new conversation.

## What evidence should you provide?

Use only what the task requires.

### Shopify VA, products, catalogs, merchandising, or orders

- task list, target store, role, permissions, approver, and acceptance criteria
- approved product source sheet, specifications, claims, media, price, inventory, and channel plan
- current product or catalog export before a bulk update
- customer, demand, competitor, supplier, and economics evidence for product research
- assortment, collection, sales, margin, inventory, and seasonality evidence for merchandising
- exact order state, policy, payment, fulfillment, return, refund, inventory, and third-party evidence for order work
- current SOPs, training environment, task risks, and QA criteria for VA training

### Store audit or CRO

- store URL and screenshots
- mobile and desktop pages
- Shopify funnel or analytics exports
- GA4 landing-page or funnel reports
- heatmaps, recordings, surveys, or support themes with sources
- product availability, price, offer, shipping, and returns information

### Meta Ads or Google Ads

- exported reports with dates, filters, and columns visible
- campaign, ad set, ad, keyword, query, product, or asset data
- conversion definitions and attribution settings
- Shopify orders or realized revenue for reconciliation
- named margin or contribution-profit definition
- inventory and fulfillment constraints

### Product pages, creative, email, or support

- approved product facts and claims
- source-backed customer research
- brand voice
- current offer and availability
- shipping, returns, warranty, or support policies
- existing copy, creative, messages, or tickets

### Flow or theme development

- target store and environment
- screenshots of current account-visible controls
- workflow, theme, Liquid, JSON, CSS, or JavaScript files
- expected and actual behavior
- reproduction steps
- app and data dependencies
- acceptance criteria and rollback method

Remove passwords, API keys, payment data, and unnecessary personal customer information before uploading anything.

## Tell the skill what it is allowed to do

Choose one authorization level for the request.

### Read-only

```text
Inspect and recommend only. Do not change any store, theme, workflow,
campaign, tracking setup, product, offer, customer record, or public page.
```

### Draft-only

```text
You may draft copy, code, a workflow, or a configuration. Do not save,
publish, enable, send, or apply it in an external system.
```

### Approved implementation

```text
Implement only the following approved change in the named target:
[exact change and target]. Preserve unrelated work. Validate it, record
rollback, and verify the authoritative saved or live state afterward.
```

Approval for one change does not authorize nearby changes.

## Recommended request structure

Use this template for stronger results:

```text
Use: [skill name]

Decision or deliverable:
[what you need]

Business objective:
[primary business outcome]

Scope:
[store, market, device, products, channels, and customer type]

Period and comparison:
[dates]

Evidence:
[attached files, URLs, screenshots, exports, or reports]

Commercial definition:
[revenue, gross profit, or contribution profit and included costs]

Authorization:
[read-only, draft-only, or exact approved implementation]

Output:
Separate observed facts, calculations, inferences, assumptions, and unknowns.
Give me the decision, evidence, recommended action, guardrails, stopping rule,
authorization required, and verification method.
```

## What the skills do not do automatically

Installing a skill does not automatically:

- connect to Shopify Admin
- connect to Google Ads, Meta Ads, GA4, Merchant Center, or an email platform
- read data that you have not supplied or connected through an approved tool
- change a live store or advertising account
- send customer messages
- publish a theme or workflow
- guarantee correct recommendations or commercial results

The skill supplies the procedure and decision rules. Data access and external actions depend on the tools, account permissions, and authorization available in the AI product you are using.

## Troubleshooting

### Claude rejects the ZIP

Check that:

- you compressed one skill folder, not the entire repository
- the ZIP contains the named folder at its root
- the folder contains `SKILL.md`
- the folder name matches the `name` inside `SKILL.md`
- Code execution and Skills are enabled where required

### Claude does not use the skill

- confirm the skill is enabled
- explicitly say `Use the shopify-cro skill`
- make the request match the skill's description
- avoid enabling several overlapping skills for the first test

### ChatGPT gives a generic answer

- confirm the full `SKILL.md` is in Instructions or uploaded to the Project
- upload the reference files for the chosen skill
- start the prompt by naming the uploaded skill
- provide business context and evidence
- specify the required output and authorization boundary

### The assistant asks for missing data

That is expected when a missing input could change the decision. You can provide the data, accept a lower-confidence answer, or ask for a collection plan.

### The assistant will not make a live change

The skills start read-only. Give explicit approval that names the target and exact change only when you want an external action and the AI product has an authorized connection to perform it.

## Ready-to-use prompts

Open [`docs/prompt-library.md`](docs/prompt-library.md) for one copy-and-paste prompt for every skill.
