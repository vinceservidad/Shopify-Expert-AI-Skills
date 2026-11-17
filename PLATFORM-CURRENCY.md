# Platform Currency

Platform behavior, terminology, eligibility, interfaces, APIs, and AI automation change quickly. This registry governs current claims across Shopify, ChatGPT, Claude, Google Ads, Meta Ads, GA4, and connected tools.

## Evidence states

- `official-documented`: present in current first-party documentation
- `account-visible`: observed in the specific user's current account or interface
- `experiment-observed`: measured in a defined test with scope and dates
- `inference`: supported explanation that is not directly documented or experimentally isolated
- `unknown`: unavailable, private, inconsistent, or unverified

Do not treat official documentation as proof that a feature is available in a specific account. Do not treat account visibility as proof of performance. Do not claim private algorithm mechanics without direct, credible evidence.

## Freshness rules

Verify against first-party sources before making a decision-changing claim about:

- product availability, plan eligibility, rollout, or deprecation
- AI or automated campaign controls
- bidding, attribution, reporting, or optimization behavior
- Shopify APIs, Flow tasks, theme limits, or developer tooling
- custom GPT or Claude Skill creation, upload, sharing, or account eligibility

For high-change claims, prefer a source reviewed within the last 30 days. Record the review date. If verification is unavailable, label the claim `unknown` or `memory-derived` and explain the decision impact.

## Source registry

### Claude plugin, Agent Skills, and Shopify VA review on 2026-11-17

| Surface | Source | State | What was verified |
| --- | --- | --- | --- |
| Claude plugin manifest | [Plugin manifest reference](https://code.claude.com/docs/en/plugins-reference) and `claude plugin validate --strict` on Claude Code 2.1.326 | `official-documented` | `displayName`, directory listing fields (`icon`, `documentationUrl`, `supportUrl`), `experimental.evals`, icon size rule (square PNG, 512–2048 px, under 2 MB), and that a root `CLAUDE.md` is not loaded by a plugin. Strict validation passes with no warnings |
| Claude marketplace install | [Publish a plugin](https://code.claude.com/docs/en/plugins/publish.md) and a user install on macOS | `official-documented`, `account-visible` | One-step install: `claude plugin install <name> --marketplace <owner/repo>` (2.1.292+) and `/plugin install <name> --marketplace <owner/repo>` in a session (2.1.275+). Observed on 2.1.326: 0.2.0 installed with 19 skills, no MCP servers, ~1,471 always-on tokens |
| Claude plugin evals | [Test plugins with evals](https://code.claude.com/docs/en/plugin-evals.md) | `official-documented` | Default eval directory is `evals/` and results go to `<eval dir>/results/`; this repository points `experimental.evals` at `plugin-evals/` so recorded evidence in `evals/results/` is not mixed |
| Claude project instructions | [Memory docs](https://code.claude.com/docs/en/memory) | `official-documented` | Project instructions load from `./CLAUDE.md` or `./.claude/CLAUDE.md` |
| Agent Skills format | [Specification](https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx) (source of agentskills.io; the site itself was not reachable from this session) | `official-documented` | Six frontmatter fields, name rules, 1024-character description ceiling, 500-character compatibility, string metadata, references one level deep, SKILL.md under 500 lines. The repository validator now enforces the line limit. The `skills-ref` validator was not run |
| Shopify collaborator access | [Shopify dev docs: Collaborations](https://shopify.dev/docs/apps/build/stores/collaborations) | `official-documented` | Collaborator access does not count toward the staff limit and expires after 90 days without a login from the partner organization |
| Shopify automatic discounts | [Shopify developer changelog, Nov 21 2024](https://shopify.dev/changelog/posts/increased-limits-for-automatic-function-based-discounts) | `official-documented` (app-based only) | Automatic app-based discount limit raised from 5 to 25. The general admin limit for all automatic discounts was not verified; skills tell operators to check the current limit |
| Shopify Help Center facts from the author's VA playbook | help.shopify.com | `unknown` | Not reachable from this session. Plan staff limits, Inbox menu paths, theme count limits, and tag limits were not written into skills as numbers. Verify before adding them |

### Native plugin format review on 2026-10-17

| Surface | Source | What was verified |
| --- | --- | --- |
| Codex native plugin manifest | Installed OpenAI `template-creator/.codex-plugin/plugin.json` and native CLI 0.159.2 | Top-level `skills` and `interface` metadata, including the displayed plugin name |
| Codex repository marketplace | Installed OpenAI `.agents/plugins/marketplace.json`, native CLI discovery, and [official config schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json) | Local catalog source paths, repository marketplace configuration, and availability of the ShopifySkills 0.2.0 entry |
| Claude plugin marketplace | [Anthropic marketplace](https://github.com/anthropics/claude-code/blob/main/.claude-plugin/marketplace.json) and [plugin guide](https://github.com/anthropics/claude-code/blob/main/plugins/README.md) | Root manifest, repository marketplace, canonical `skills/` layout, and optional MCP configuration |

These checks establish format and discovery support. They do not establish
installation in this chat app, public curated-directory publication, or native
Claude host behavior. Plugin Creator and a directory-publishing API were not
available to this session. The read-only Codex app-server probe stopped before
initialization because its default installation state was on a read-only mount.

Reviewed 2026-08-25:

| Surface | First-party source | What it supports |
| --- | --- | --- |
| Agent Skills | <https://agentskills.io/specification> | Folder structure, frontmatter, progressive disclosure, and validation |
| ChatGPT GPTs | <https://help.openai.com/en/articles/8554397-creating-with-chatgpt> | Current GPT availability, Instructions, Knowledge, capabilities, and testing |
| Claude custom skills | <https://support.claude.com/en/articles/12512198-how-to-create-custom-skills> | Skill structure, ZIP packaging, upload, testing, and security |
| Claude skill usage | <https://support.claude.com/en/articles/12512180-use-skills-in-claude> | Enabling, uploading, sharing, and current prerequisites |
| Shopify Flow | <https://shopify.dev/docs/apps/build/flow> | Trigger, condition, action, and template concepts |
| Shopify theme architecture | <https://shopify.dev/docs/storefronts/themes/architecture> | Layouts, templates, sections, blocks, snippets, assets, and configuration |
| Shopify JSON templates | <https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates> | Current JSON-template structure and documented limits |
| Shopify products | <https://help.shopify.com/en/manual/products/add-update-products> | Product creation, update, status, availability, tags, SEO, archive, and deletion entry points |
| Shopify product details | <https://help.shopify.com/en/manual/products/details/product-details-page> | Product content, media, taxonomy, pricing, inventory, variants, metafields, SEO, status, and publishing surfaces |
| Shopify category metafields | <https://help.shopify.com/en/manual/custom-data/metafields/category-metafields> | Current relationship between standard taxonomy, category attributes, and variant options |
| Shopify product CSV | <https://help.shopify.com/en/manual/products/import-export/using-csv> | Current product CSV fields, metafields, import, export, and overwrite considerations |
| Shopify collections | <https://help.shopify.com/en/manual/products/collections> | Current collection-model rollout, sources, conditions, sorting, publishing, and storefront use |
| Shopify inventory | <https://help.shopify.com/en/manual/products/inventory> | Current inventory management, locations, quantities, reports, and workflow entry points |
| Shopify orders | <https://help.shopify.com/en/manual/fulfillment/managing-orders> | Current order, payment, fulfillment, edit, return, refund, cancellation, and fraud-management surfaces |
| Shopify roles and permissions | <https://help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions> | Current granular Products, Orders, Inventory, Catalogs, Content, and other store permissions |

Google Ads, Meta Ads, GA4, email-provider, app, or policy claims must add their own dated first-party source before being treated as current.

### Targeted review on 2026-09-30

These reviews refresh only the named claims; the older registry rows retain their
original review dates.

| Surface | First-party source | What it supports |
| --- | --- | --- |
| Shopify high-variant themes | <https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products> | Liquid variant cap, option-value selection, deferred rendering and null-selection handling |
| Codex skills | <https://developers.openai.com/codex/skills/> | Repository discovery under `.agents/skills`, explicit skill invocation and installing from another repository |

### Plugin and connector review on 2026-09-30

| Surface | First-party source | What it supports |
| --- | --- | --- |
| Agent Plugins | <https://agent-plugins.org/schemas/1.0.0/plugin.schema.json> and <https://agent-plugins.org/schemas/1.0.0/mcp.schema.json> | Portable manifest and transport shapes |
| OpenAI plugins | <https://developers.openai.com/plugins/build/plugins> | Packaging, local development and public submission boundaries |
| Claude connectors | <https://claude.com/docs/connectors/building/authentication> | MCP OAuth discovery, DCR, PKCE and separate client authorization |
| Shopify app auth | <https://shopify.dev/docs/apps/build/authentication-authorization/authenticate-standalone-apps> | Merchant approval and authorization-code exchange |
| Shopify query schema | Bundled official Shopify AI Toolkit Admin schema for `2026-07` | All five fixed connector queries validated locally; alternative scopes are not additional requested permissions |
| Inventory location scope | <https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Location> and the actual development-store response | The location object supports `read_inventory`, but its `name` field was denied without an additional scope; fixed queries return IDs only |
| Same-organization app auth | <https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant> | Installed apps can obtain short-lived tokens for stores in their own organization; this does not authorize unrelated merchant access |

## Claim record

Use this shape in a decision log or pull request:

```yaml
claim: feature or behavior being relied on
platform: Shopify
evidence_state: official-documented
source: https://shopify.dev/...
reviewed_on: 2026-08-25
account_visible: unknown
decision_impact: workflow must be confirmed in the target store before enablement
```
