# Use the toolkit in ChatGPT or Claude

Choose your app below. These are the no-code paths available with the published
packages. You supply exports, screenshots, product facts, and policies; neither
path connects Shopify automatically. Available controls depend on your account
and workspace. See [platform currency](../PLATFORM-CURRENCY.md) for the dated
source reviews; fixed plan restrictions and exact menu labels are not assumed.

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

For a consistent connected experience across ChatGPT and Claude, the recommended
product path is **one hosted connector powered by MCP**. Once the service is
hosted and verified with each app, the user journey should be:

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
