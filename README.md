# MKT Skills VA Toolkit

**Use ChatGPT or Claude to help with everyday Shopify VA tasks.**

This toolkit gives the AI guides for writing product listings, checking store information, preparing reports and reviewing its work. You provide the facts, review the answer and decide which store changes to approve.

It is free and open source. Your ChatGPT or Claude account may have its own cost, upload limits and connection requirements. The existing **Shopify VA Toolkit** plugin IDs and [repository URL](https://github.com/vinceservidad/Shopify-Expert-AI-Skills) stay the same.

## What can it help me do?

| Your task | Help you can ask for |
| --- | --- |
| Write product descriptions | Draft a title, description and product details from approved facts. |
| Check stock | Review supplied or connected stock counts and flag items to check. |
| Organize products | Plan collections, tags and catalog cleanup. |
| Prepare a sales report | Explain the numbers in your reports and show what needs attention. |
| Review a store | Find unclear product pages, missing information and shopping problems. |
| Reply to customers | Draft replies using your store's shipping, returns and support policies. |
| Plan emails or ads | Prepare ideas and drafts using your products, offers and reports. |
| Train a new VA | Turn a task into clear steps and a checklist. |

There are **19 guides**, called *skills*. You only need the guide for the task you are doing. [See all tasks and guides](USAGE.md#choose-a-task).

## Eight practical VA jobs

Use these repeatable jobs with your client's approved files and store evidence:

| Ask the AI... | What you receive |
| --- | --- |
| “Set up my client's work guide.” | Brand voice, policies, assigned tasks, approvals and escalation roles in one brief. |
| “Plan today's work.” | Prioritized tasks, missing information and decisions needed from the owner. |
| “Check this product listing.” | A comparison against approved facts, content gaps and a review checklist. |
| “Review my product catalog.” | SKU conflicts, inconsistent information and proposed corrections within the checked records. |
| “Review stock.” | Exceptions against the owner's thresholds, with locations and incomplete coverage shown. |
| “Help me answer this customer.” | A policy-based reply draft, verified facts and any escalation needed. |
| “Prepare my handover.” | Drafts ready, verified changes, blocked tasks and next actions. |
| “Train a new VA.” | Task instructions, sample work, exception cases and a reviewer checklist. |

[Choose a VA job](docs/va-workflows.md) for the files to provide, or [copy a request](docs/prompt-library.md#practical-va-jobs). Keep client briefs in your ChatGPT or Claude chat/project files. These jobs run when you request them; they do not create schedules or background monitoring.

The **0.2.0 release candidate** adds these eight workflows and brings the tool total to **12**. The existing development-store connector remains **0.1.0 with eight tools** until a separate release. Building this candidate does not update that live service.

The eight job workflows are in the upgrade source on [PR #8](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/pull/8). The [job guide](docs/va-workflows.md) links that source download; the main ZIP below still supports the original first-task example.

## How does it work?

Three parts work together:

1. **ChatGPT or Claude does the work:** it reads your information and prepares an answer.
2. **This toolkit guides the work:** a *skill* is an instruction guide that tells the AI how to approach a task and check its answer.
3. **An approved Shopify connection allows store access:** a *connector* is a connection between the AI and Shopify. It allows only the reads or changes that its tools and your permissions support.

**You can draft content without connecting Shopify.** Give the AI the product facts or reports yourself. A guide does not give it access to your store.

## Start with one product description

You need a ChatGPT or Claude account, three guide files and your approved product facts. No coding or store connection is needed for this first task.

1. [Download the source files as a ZIP](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/archive/refs/heads/main.zip) and unzip it. On a Mac, double-click the ZIP. On Windows, right-click it and choose **Extract All**.
2. Open the downloaded folder, then **skills → shopify-product-listing**.
3. Start a new chat in **ChatGPT or Claude** and attach the three files below. They are text documents, not programs.
4. Paste the sample request below and fill in your product facts.

| File to attach | Where to find it | What it gives the AI |
| --- | --- | --- |
| [SKILL.md](skills/shopify-product-listing/SKILL.md) | In the `shopify-product-listing` folder | The product-listing instructions. |
| [listing-fields.md](skills/shopify-product-listing/references/listing-fields.md) | In its `references` folder | The product details to check. |
| [qa-checklist.md](skills/shopify-product-listing/references/qa-checklist.md) | In its `references` folder | A checklist for reviewing the work. |

If your app rejects a `.md` file, upload a copy ending in `.txt`, or paste its text into the chat. Keep the original files unchanged. File uploads depend on your account's features and limits.

Want more help with these steps? Follow the [first-task walkthrough](docs/getting-started.md). Use the [full usage guide](USAGE.md) when you are ready for another task or optional setup.

## Plugin packages

Build `dist/shopify-va-toolkit.plugin` using the
[plugin guide](docs/plugin-and-connector.md#build-the-plugin) for local use with
the bundled read-only connector. For a hosted environment that cannot execute a
local process, build `dist/shopify-va-toolkit-skills-only.plugin` with
`python scripts/package_plugin.py --target skills-only`. The skills-only archive
contains all 19 skills and intentionally makes no connected-store claim.

## Copy this first request

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

The result should be a **draft you can review**, a list of missing facts and a checklist. Compare every claim with your product source. Ask the AI to fix anything it guessed or got wrong before using the copy.

## Can it edit my Shopify store?

ChatGPT or Claude can make **supported changes** when an approved Shopify integration with write access is available in the same chat. You must also approve the task. Your account permissions and the integration's tools limit what it can change.

Our guides help the AI plan and check that work. **Our own hosted connector is read-only:** it can read products, variants, stock and order summaries, but cannot edit them. See [optional store connections](USAGE.md#connect-your-store-optional) for the differences and setup links.

The public release candidate adds a simple app inside Shopify. It shows the checked store, supports store reads, and lets the owner review or disconnect an AI connection. Public setup will start from Shopify; you will not type your store address into our website. The owner must approve each connection request.

**Public store authorization is still being prepared.** The guide is hosted at [mktskills.com/shopify-va](https://mktskills.com/shopify-va), and the permanent candidate endpoint is [shopify-mcp.mktskills.com/mcp](https://shopify-mcp.mktskills.com/mcp). The purchased domain and HTTPS routing are configured. Shopify approval, app-version URL release and live ChatGPT/Claude store authorization are separate requirements; a reachable endpoint is not a verified store connection. [See public release status and checks](docs/public-release.md).

After an approved edit, open the correct store and check the saved result. A draft in a chat is not a saved product, and a saved product is not proof that it is visible to shoppers.

## What should I know before relying on it?

- AI can make mistakes. Review its work against your product facts, reports and store policies.
- It cannot see information you have not supplied or connected. Never share passwords, API keys or unnecessary customer details.
- It does not guarantee expert answers, faster completion, more sales or correct results for every task.
- Our connected-store checks covered one development store with sample data. The original hosted connector verified an empty order response. The later 0.2.0 local package also read an unpaid sample order and both item pages. These checks do not verify every VA task, public installation or the combined ChatGPT/Claude editing setup.
- This is an independent toolkit. It is not an official Shopify product.

## More help

- [How to use the toolkit](USAGE.md): choose a task, prepare your information and troubleshoot.
- [Your first task](docs/getting-started.md): a product-description walkthrough.
- [More sample requests](docs/prompt-library.md): prompts for all 19 guides.
- [Practical VA jobs](docs/va-workflows.md): eight everyday workflows and the information they need.
- [Worked examples](docs/worked-examples.md): practice tasks using made-up sample data.
- [Public release status](docs/public-release.md): what is built, what is live and which checks still need external approval. No public plugin download or one-click installation is claimed before an actual release.

For developers and readers who want the details:

- [Plugin and connector setup](docs/plugin-and-connector.md), including optional MCP setup and Cloudflare hosting.
- [The full work process](skills/shopify-va/references/store-operating-lifecycle.md) and [ongoing-task record](skills/shopify-va/references/initiative-record.md).
- [Test results and limits](evals/RESULTS.md), [repository layout, checks and tooling](docs/reliability.md#repository-structure), and [theme checks](docs/theme-verification.md).
- [Evidence and permissions](docs/evidence-and-authorization.md), [terms explained](GLOSSARY.md), and [platform updates](PLATFORM-CURRENCY.md).
- [Contributing](CONTRIBUTING.md), [changes](CHANGELOG.md), and [MIT license](LICENSE).
