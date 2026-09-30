# Shopify VA Toolkit

**Use ChatGPT or Claude to help with everyday Shopify VA tasks.**

This toolkit gives the AI guides for writing product listings, checking store information, preparing reports and reviewing its work. You provide the facts, review the answer and decide which store changes to approve.

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

After an approved edit, open the correct store and check the saved result. A draft in a chat is not a saved product, and a saved product is not proof that it is visible to shoppers.

## What should I know before relying on it?

- AI can make mistakes. Review its work against your product facts, reports and store policies.
- It cannot see information you have not supplied or connected. Never share passwords, API keys or unnecessary customer details.
- It does not guarantee expert answers, faster completion, more sales or correct results for every task.
- Our connected-store checks covered one development store with sample data. They verified reads, including an empty order response, not every VA task or the combined ChatGPT/Claude editing setup.
- This is an independent toolkit. It is not an official Shopify product.

## More help

- [How to use the toolkit](USAGE.md): choose a task, prepare your information and troubleshoot.
- [Your first task](docs/getting-started.md): a product-description walkthrough.
- [More sample requests](docs/prompt-library.md): prompts for all 19 guides.
- [Worked examples](docs/worked-examples.md): practice tasks using made-up sample data.

For developers and readers who want the details:

- [Plugin and connector setup](docs/plugin-and-connector.md), including optional MCP setup and Cloudflare hosting.
- [The full work process](skills/shopify-va/references/store-operating-lifecycle.md) and [ongoing-task record](skills/shopify-va/references/initiative-record.md).
- [Test results and limits](evals/RESULTS.md), [repository layout, checks and tooling](docs/reliability.md#repository-structure), and [theme checks](docs/theme-verification.md).
- [Evidence and permissions](docs/evidence-and-authorization.md), [terms explained](GLOSSARY.md), and [platform updates](PLATFORM-CURRENCY.md).
- [Contributing](CONTRIBUTING.md), [changes](CHANGELOG.md), and [MIT license](LICENSE).
