# ShopifySkills v0.2.0

One plugin containing the 19 existing Shopify workflows. Public-source research
and work from supplied files do not require Shopify sign-in, an API key, Node,
or an MCP server in the skills-only profile. Web research uses the host's
available search tools; the plugin supplies the procedures.

## Install once, then ask

- [Download ShopifySkills skills-only plugin](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/raw/refs/heads/main/releases/v0.2.0/shopify-va-toolkit-skills-only.plugin)
- [One-time native plugin installation](../../docs/ai-agent-setup.md#install-shopifyskills-once)

For native Codex marketplace installation:

```sh
codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main
codex plugin add shopify-va-toolkit@shopify-skills
```

For compatible Claude plugin hosts, the repository also supplies root Claude
marketplace metadata. Follow the installation guide for that host.

After installation, select **ShopifySkills** in the host's plugin picker and ask:

```text
Research ceramic mug opportunities for the UK market using public sources.
Show evidence and unknowns. Keep the work read-only.
```

An `@ShopifySkills` mention is available only where that host exposes the
installed plugin in its `@` picker. This release does not register a curated
app-directory entry or create a `plugin://` installation link. App installation,
public directory registration, and host mention behavior still require their
own verification. Plugin Creator was not callable in this development session.

## Optional alternatives

- `shopify-va-toolkit.plugin` retains the optional local read-only MCP runtime
  for supported connected hosts; it requires Node.js 24+ and separate approved
  Shopify credentials for private store reads.
- Individual `shopify-*.zip` files install one specialist where native Skills
  upload is supported.

Neither alternative is required for the default skills-only research plugin.
No hosted Shopify connector is deployed by these archives.

## Verification and source

Source is the repository's `v0.2.0` tag. All 160 Python tests pass, including
native marketplace resolution, all 19 skills, credential-free packaging, and
preservation of previous archives on malformed metadata. Both optional local
MCP manifest formats pass their extracted-runtime checks. The actual Codex CLI
discovers the native marketplace entry and version 0.2.0.

Installation in this chat app, curated-directory publication, and native Claude
host operation were not verified. A read-only Codex app-server probe could not
initialize its installation state on the environment's read-only home mount.
New model research scenarios remain `needs-review`; engineering tests do not
prove model task quality, web access, or a working app mention.

Every package has a SHA-256 entry in `SHA256SUMS`. After downloading files:

```sh
sha256sum -c SHA256SUMS
```

Repository downloads are available independently of GitHub Releases automation,
which previously could not start because GitHub reported an account billing lock.
