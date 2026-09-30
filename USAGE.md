# How to Use Shopify VA Toolkit

Use ChatGPT or Claude to help with everyday Shopify work. Start with one small task, then check the result before using it.

A **skill** is an instruction guide for a task. A **connector** is a connection to Shopify. ChatGPT or Claude does the work, the skill guides it, and an approved Shopify connection can allow supported store changes.

You can draft from the facts you provide without connecting a store.

## Start with one product-listing draft

You need a ChatGPT or Claude account and approved facts for one product. No code or terminal is needed for this first task.

### 1. Download the guides

1. [Download the source ZIP](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/archive/refs/heads/main.zip).
2. Unzip it. On a Mac, double-click the ZIP. On Windows, right-click it and choose **Extract All**.
3. Open the extracted folder, then **skills**, then **shopify-product-listing**.
4. Find the three files below. The last two are inside its **references** folder.

| File to attach | What it does |
| --- | --- |
| [SKILL.md](skills/shopify-product-listing/SKILL.md) | Gives the AI the product-listing instructions. |
| [listing-fields.md](skills/shopify-product-listing/references/listing-fields.md) | Explains what belongs in a Shopify product listing. |
| [qa-checklist.md](skills/shopify-product-listing/references/qa-checklist.md) | Helps check the draft and any later store update. |

Files ending in `.md` are text documents with headings and lists. You do not need to edit them. This ZIP contains the source files, not an installed plugin. Do not upload the whole repository ZIP as one skill.

### 2. Open ChatGPT or Claude

Start a new chat and attach those three files with the app's file-upload button.

If the app rejects `.md` files, make copies named **SKILL.txt**, **listing-fields.txt**, and **qa-checklist.txt**, then attach the copies. Leave the original files unchanged. You can also open the files in a text editor and paste their contents into the chat. Upload limits depend on your account.

### 3. Paste your request and product facts

Replace the brackets with facts approved by the store owner. Write **unknown** where you are unsure.

```text
Follow the Shopify product-listing guide and checklists provided in this chat.

Draft one product title, a short description and three bullet points.
For this copy draft, check only the facts needed for those three items.
Use only the approved facts below. Ask for any missing facts you need.
Do not save or publish anything, or change prices in Shopify.

Product name: [name]
Approved facts: [materials, size, features and other confirmed details]
Who it is for: [customer, if known]
Brand tone: [for example, simple and friendly]

Give me the draft, any missing information and a short review checklist.
```

### 4. Check the answer

Expect a **draft**, a list of **missing facts**, and a **checking list**. Unknown facts should stay unknown. A draft in chat has not been saved in Shopify.

Before using the copy, check every specification and claim against your approved source. Make sure the options match the real product. Ask the store owner to approve the final wording when required.

For a shorter walkthrough, use [Getting started](docs/getting-started.md). A [worked example](skills/shopify-product-listing/references/worked-example.md) shows how missing product details should be handled.

## Choose a task

There are 19 instruction guides. Choose the row closest to your task. Open the linked guide to see its full instructions and reference files.

| I want help to... | Guide |
| --- | --- |
| Organize a mixed task list, check stock, or choose the right guide | [shopify-va](skills/shopify-va/SKILL.md) |
| Research a product before sourcing or selling it | [shopify-product-research](skills/shopify-product-research/SKILL.md) |
| Write product descriptions or prepare product listings | [shopify-product-listing](skills/shopify-product-listing/SKILL.md) |
| Clean a product list, prepare a bulk import, or check stock records | [shopify-catalog-operations](skills/shopify-catalog-operations/SKILL.md) |
| Plan collections, product order, bundles, and related products | [shopify-merchandising](skills/shopify-merchandising/SKILL.md) |
| Review orders, shipping, returns, refunds, or cancellations | [shopify-order-operations](skills/shopify-order-operations/SKILL.md) |
| Train a VA, write task instructions, or check practice work | [shopify-va-training](skills/shopify-va-training/SKILL.md) |
| Check the whole store and prioritize problems | [shopify-store-audit](skills/shopify-store-audit/SKILL.md) |
| Find buying problems and plan a test to improve them | [shopify-cro](skills/shopify-cro/SKILL.md) |
| Improve one product page | [shopify-product-page](skills/shopify-product-page/SKILL.md) |
| Plan ad ideas, messages, and creative tests | [shopify-creative-strategy](skills/shopify-creative-strategy/SKILL.md) |
| Review Facebook or Instagram ads | [shopify-meta-ads](skills/shopify-meta-ads/SKILL.md) |
| Review Google Ads, Shopping ads, or Merchant Center issues | [shopify-google-ads](skills/shopify-google-ads/SKILL.md) |
| Help products and pages appear in search results | [shopify-seo](skills/shopify-seo/SKILL.md) |
| Plan email or SMS messages and campaigns | [shopify-email-marketing](skills/shopify-email-marketing/SKILL.md) |
| Plan or check automatic tasks in Shopify Flow | [shopify-flow-automation](skills/shopify-flow-automation/SKILL.md) |
| Draft customer replies, reusable responses, or FAQs | [shopify-support](skills/shopify-support/SKILL.md) |
| Build or fix Shopify theme code | [shopify-theme-development](skills/shopify-theme-development/SKILL.md) |
| Prepare a sales report or understand changes in sales and profit | [shopify-analytics](skills/shopify-analytics/SKILL.md) |

For another task, attach that guide's `SKILL.md` and the reference files it asks you to use. Tell the AI what you need and provide the matching facts, screenshots, or reports. Start with one guide. Use `shopify-va` if the work includes several tasks and you need help organizing them.

There is a [copy-and-paste prompt for every guide](docs/prompt-library.md).

## Connect your store (optional)

Connecting a store lets the AI use current store information instead of relying only on files you upload. Check which connection you are using and what it is allowed to do.

| Connection | What it allows |
| --- | --- |
| No connection | Drafting and review using the facts and files you provide. |
| This toolkit's hosted connector | Reading store details, products, variants, stock, and order summaries. It cannot edit the store. |
| A separate approved Shopify editing connection | Supported changes allowed by that connection, your account permissions, and your approval. |

Our hosted connector is **read-only**. It was verified on **VA Toolkit Connector Test**, a development store with sample data, on September 30, 2026. It has not been verified for every merchant store. The order test returned no orders, so populated order summaries are still unverified.

Supported editing depends on the separate integration. See Shopify's instructions for [ChatGPT](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-plugin-for-chatgpt) or [Claude](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-claude). Installing the guides alone does not give either app access to your store.

The read-only connector and a separate editing connection can serve different parts of a task. The combined workflow in native ChatGPT or Claude has not been tested end to end here.

For technical setup, the connection method is called **MCP**. The hosted URL is `https://shopify-va-toolkit.vinceluxxe.workers.dev/mcp`. Give the [connector setup guide](docs/plugin-and-connector.md) to the person helping with your setup. Other merchants still need an approved Shopify app installation and suitable app distribution. Opening that URL in a browser without signing in returns an authorization error; it is not an installation button.

## Tell the AI what it may do

Choose the wording that matches your task:

| What you want | What to say |
| --- | --- |
| Review only | “Inspect and recommend. Do not change anything.” |
| A draft in chat | “Draft it here. Do not save, publish, or send it.” |
| Save an inactive draft | “Save this approved draft in [exact target]. Keep it inactive and unpublished.” |
| An approved store change | “Make only [exact change] in [store and product/page]. Check the saved result. Preserve unrelated work.” |

Approval to draft a reply does not approve sending it. Approval to save a product does not approve publishing it. A connection with edit access still needs a clear task and approval.

After an approved change, reopen the record in Shopify and compare it with the approved result. If it was published, check the actual store page too. Ask the AI to state whether the result is drafted, saved, published, or still unverified.

## What evidence should you provide?

**Evidence** means the information the AI uses to support its answer. Provide only what the task needs:

| Task | Useful information |
| --- | --- |
| Listings, stock, or collections | Approved product facts, current product/stock exports, target products, prices, options, and owner instructions. |
| Orders or support | Order status, the question, and store policies. Remove customer details the task does not need. |
| Reports or store reviews | Dated Shopify reports, screenshots, comparison dates, and the question you need answered. |
| Ads, email, or search | Reports with dates and filters, current messages/pages, product facts, and your goal. |
| Theme fixes or automatic tasks | The problem, expected behavior, screenshots/files, and the exact store or test environment. |
| Training | Current task instructions, practice examples, and the rules for checking the work. |

For larger tasks, use the [store context template](docs/business-context-template.md). Remove passwords, API keys, payment details, and unnecessary personal customer information before uploading files.

## Check the AI's work

Before accepting the result, ask:

- Does it answer my task for the right products, store, and dates?
- Can I trace every important claim or number to my source?
- Did it mark missing information instead of guessing?
- Are any calculations explained?
- Did it stay within my approved task?
- Can I confirm any claimed save or publication in Shopify?

The toolkit helps organize work. It does not guarantee correct answers, measured time savings, or “100% expert” performance.

## Optional ways to reuse the guides

The ordinary chat above is the simplest first test. These options can help with repeated work.

### Option 1: Install a skill in Claude

You can upload one complete guide folder as a custom Claude skill:

1. In the extracted source files, open **skills**.
2. Right-click **shopify-product-listing** and compress that whole folder. On a Mac, choose **Compress**. On Windows, choose **Compress to ZIP file** or **Send to > Compressed (zipped) folder**.
3. Keep `SKILL.md` and the `references` folder inside `shopify-product-listing`. The ZIP should contain that named folder, not loose files or the whole repository.
4. In Claude, open **Customize > Skills**, choose **+ / Create skill**, then **Upload a skill**.
5. Upload the ZIP and enable the skill.
6. Request: “Use the shopify-product-listing skill to draft from these approved facts. Do not save or publish.”

If the controls are missing, check the current [Claude skill instructions](https://support.claude.com/en/articles/12512180-use-skills-in-claude). Skills require Code execution and file creation to be enabled; an organization may restrict custom uploads. Packaging and upload instructions were checked against [Claude's custom skill guide](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) on September 30, 2026. This is a manual custom skill upload, not a public one-click plugin installation.

### Option 2: Use a skill in ChatGPT

Keep using ordinary chats, or save repeated store work in a **Project**. A Project keeps related chats, files, and instructions together. See [OpenAI's Project guide](https://help.openai.com/en/articles/10169521-projects-in-chatgpt).

For a custom GPT, put the guide's behavior in **Instructions** and its reference files in **Knowledge**. Test it in Preview before sharing it. See [OpenAI's custom GPT guide](https://help.openai.com/en/articles/8554397-creating-and-editing-gpts). Account and workspace settings control availability. These official guides were checked on September 30, 2026.

The repository also has an [advanced ChatGPT and Claude setup guide](docs/ai-agent-setup.md), reviewed August 25, 2026. Its interface and account details may change; use the current official instructions if they differ.

### Option 3: Install a skill in Codex

For coding work, install one complete skill using Codex's `$skill-installer`, or copy the complete skill folder into your project's `.agents/skills/` folder. Include its references and assets. Check for an existing copy before adding one.

Use [OpenAI's Codex skill instructions](https://developers.openai.com/codex/skills/) and the repository's [technical setup guide](docs/ai-agent-setup.md). Installing a guide does not configure Shopify access.

## Troubleshooting

| Problem | What to try |
| --- | --- |
| The chat rejects an instruction file | Attach a `.txt` copy, or paste the file contents. Keep the originals unchanged. |
| The answer is too general | Name the uploaded guide, add approved facts, and ask for a specific result. |
| The AI asks for missing facts | Provide them, or keep the result as an incomplete draft. Do not ask it to invent them. |
| Claude rejects a skill ZIP | Compress one complete skill folder with `SKILL.md` and `references` inside it. Check that its name matches the guide. |
| Claude does not use the installed skill | Enable it and start with “Use the shopify-product-listing skill.” |
| The AI cannot read the store | Use uploaded evidence, or check your approved connection and permissions. |
| The AI cannot make a change | Check whether the connection supports edits, then name the exact approved change. Our connector is read-only. |

## Start with the Shopify Store Operating Lifecycle

For longer projects, the [store operating lifecycle](skills/shopify-va/references/store-operating-lifecycle.md) helps track what needs to happen next. The [initiative record](skills/shopify-va/references/initiative-record.md) keeps context across sessions and handoffs. These specialist details are optional for your first draft.

## Ready-to-use prompts

Use the [prompt library](docs/prompt-library.md) for all 19 guides. Developers and setup helpers can use [plugin and connector setup](docs/plugin-and-connector.md), [repository reliability](docs/reliability.md), and [contribution instructions](CONTRIBUTING.md).
