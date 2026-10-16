# Use ShopifySkills in chat

The intended experience is: install **ShopifySkills** once, select it in a
supported plugin picker, and ask for a task. The [v0.2.0 skills-only archive](../releases/v0.2.0/README.md)
contains the native plugin metadata. Research and work from supplied
files do not need Shopify sign-in. The host supplies any web-search or other
tools; a skills plugin supplies the procedures.

## Install ShopifySkills once

### Codex plugin marketplace

The repository now exposes a native skills-only plugin through its marketplace:

```sh
codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main
codex plugin add shopify-va-toolkit@shopify-skills
```

Its displayed name is **ShopifySkills**; `shopify-va-toolkit@shopify-skills` is
its stable plugin/marketplace identifier. The installed Codex CLI recognizes the
catalog and native manifest. Actual installation and mention behavior must be
verified in the user's host; this session did not install into the user's app.

### Claude plugin hosts

For Claude Code or another Claude host with compatible plugin marketplace
controls, add this repository as a marketplace and install its plugin. In
Claude Code, the commands follow the marketplace's documented `/plugin` flow:

```text
/plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills
/plugin install shopify-va-toolkit@shopify-skills
```

The root Claude manifest uses the same 19 canonical skills and has no MCP,
process, or credential requirement. Native Claude host installation has not
been run in this environment; plain Claude chat is a different surface from
Claude Code.

### This app's plugin picker

To appear beside a curated plugin such as Plugin Creator, ShopifySkills must be
installed/imported or registered through this app's supported plugin flow.
The native manifest and skills-only archive are prepared, but no curated
registration or working `plugin://` listing has been created. An arbitrary
GitHub URL is not an installed `@` plugin. If the app only permits curated
plugins, its directory owner must publish the entry first.

Where a host supports importing a custom archive, use the **skills-only** plugin;
the optional connected package is for a separate local MCP setup. Menu names,
import availability, and sharing controls depend on the actual host and account.
Do not assume a package accepted by one product is installed in another.

## Ask in plain language

After installation, select ShopifySkills in the host's plugin picker or use its
supported skill invocation and ask:

```text
Research ceramic mug opportunities for the UK market using public sources.
Show sourced facts, unknowns, economics assumptions, and a validation plan.
Do not change a Shopify store.
```

An `@ShopifySkills` mention is appropriate only in a host exposing that installed
plugin in its `@` picker. Claude plugin hosts may invoke the installed skills by
name or their own command mechanism. The plugin does not invent one universal
mention syntax across products.

## Manual fallbacks

Use these only if your app cannot install the native plugin. They need no
terminal or Shopify account connection; available file and instruction controls
depend on your account and workspace.

## Claude Skills

1. Choose the ZIP for your job from the [skill catalog](../README.md#skill-catalog)
   and [published downloads](../releases/v0.1.1/README.md). If you need help routing
   a mixed assignment, start with
   [shopify-va.zip](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/raw/refs/heads/main/releases/v0.1.1/shopify-va.zip).
2. In Claude's Skills settings, upload that ZIP and enable the skill. Enable any
   required code-execution/file controls offered by your account. Upload the ZIP
   as-is; do not upload the whole repository or a `.plugin` archive as one Skill.
3. Attach your evidence and ask for the deliverable. Use the starter below.

Each ZIP contains one skill. The coordinator routes tasks but does not bundle
all specialist procedures; add the specialist ZIP when that task needs it.
If Skills are unavailable, supply the procedure and relevant files in a chat,
following the same evidence and permission rules.

### Upload and enable

Check the uploaded skill is enabled and recognizes a matching request. Test a
nearby unrelated request too. Use the account's current Skills controls rather
than relying on a menu label from another plan or version.

### Package a skill

Published ZIPs need no build. Contributors building from source can use
[repository tooling](reliability.md#tooling-setup) and the existing packaging script.

## ChatGPT Projects or ordinary chats

1. Choose and download one [skill ZIP](../releases/v0.1.1/README.md), then extract it.
2. Create a ChatGPT Project. Open the extracted `SKILL.md` and copy its procedure
   into the Project instructions. Omit the opening YAML metadata block. Upload
   that skill's relevant reference files and any required example assets as
   Project files, respecting the limits shown by your account.
3. Start a chat in the Project, attach your store evidence, and use the starter
   below. Keep credentials and unnecessary customer information out of files.

If Project controls are unavailable, paste the procedure into an ordinary chat
and attach the relevant files there. This is guided use of the workflow, not
native skill installation, automatic skill discovery, or a Shopify connection.

## Starter for either app

```text
Use [skill name] to [specific task].
Deliver: [the result I need].
Evidence: [attached files, screenshots, product facts, or policies].
Keep the work read-only. Separate verified facts from assumptions, flag missing
inputs, and do not claim a store change has been made.
```

Use [shopify-va](../skills/shopify-va/SKILL.md) for routing mixed work, or choose
one specialist for a bounded job. There is no need to install every skill first.

## ChatGPT custom GPTs

For a reusable specialist assistant, use the same extracted files in the GPT
editor if your account supports creating GPTs: place the procedure in
**Instructions** and supporting references in **Knowledge**. Test in Preview
before sharing. The repository does not publish a ready-made shared GPT link.
Creating or sharing a GPT does not connect it to Shopify automatically.

## Claude Projects

A Claude Project can keep relevant store, brand, and policy context together;
use the installed Skill for its procedure. Keep volatile order exports and
unnecessary personal data out of long-lived project context.

## Connect an actual Shopify store

If an assigned task needs private store evidence, an optional **hosted MCP
connector** can provide it after hosting and client verification. This is
separate from using the research plugin. The connected journey would be:

1. Add the real service URL using the app's custom connector/app controls, where
   the account and workspace allow custom MCP connections.
2. Complete sign-in and approve the intended read access to Shopify.
3. Ask a task in plain language. The assistant can request workflow instructions
   and authorized store evidence through the connection.

**This hosted service is not deployed yet.** No public connector URL is available
from this repository. Deployment and native client sign-in remain to be verified;
see the [developer hosting guide](plugin-and-connector.md#hosted-oauth-connector).
The GitHub repository URL cannot be used as a connector endpoint.

The server implements discovery of the 19 workflows and Markdown references.
A client must actually call those tools to use them; this does not install or
prove automatic activation of native Skills, and supporting assets may still
need separate files. The hosted server currently requires Shopify OAuth before
MCP access, including workflow discovery. Store tools supply read-only identity,
products, variants, inventory, and order summaries. Other evidence must be
provided separately, and no write, refund, publishing, or campaign tools exist.

## What MCP, connector, and plugin mean

- **Skill:** the instructions for doing a job.
- **Connector/app:** the connection a user enables to an external service.
- **MCP:** the protocol that lets the assistant use that service's tools.
- **Plugin:** a packaged extension for a host that explicitly supports its format.

A plugin is an optional path for supported extension hosts. Ordinary ChatGPT or
Claude chat users should follow the app steps above. Developer/local setup is
kept in [plugin and connector setup](plugin-and-connector.md).

## Minimum acceptance tests

After setup, check that the assistant uses the requested workflow, names its
sources, handles missing evidence, respects read-only scope, and returns the
requested deliverable. A live store read additionally needs a successful read
from the intended authorized store; an installed skill or connected status
alone does not prove it.

## Official sources

Previously reviewed platform sources are recorded in
[PLATFORM-CURRENCY.md](../PLATFORM-CURRENCY.md). Recheck current account-visible
controls before giving exact menu or eligibility instructions:

- [Claude custom Skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Claude Skill usage](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [ChatGPT GPT configuration](https://help.openai.com/en/articles/8554397-creating-with-chatgpt)
