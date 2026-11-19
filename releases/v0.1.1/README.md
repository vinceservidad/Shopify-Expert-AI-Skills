# Shopify VA Toolkit v0.1.1

Installable packages built and tested from source commit
`ea06af07baaada3f885f03e98b49865b8841ed0a`. These packages are available directly
from the repository, independently of GitHub Actions or the GitHub Releases UI.

## Download and install

- [Skills-only plugin](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/raw/refs/heads/main/releases/v0.1.1/shopify-va-toolkit-skills-only.plugin):
  all 19 skills for hosts that cannot execute a local MCP process.
- [Plugin with local MCP runtime](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/raw/refs/heads/main/releases/v0.1.1/shopify-va-toolkit.plugin):
  all 19 skills and the bundled read-only connector. Requires Node.js 24+.
- Individual `shopify-*.zip` files in this folder: install one owner skill.

Import the selected archive through your AI host's supported plugin or skill
installation flow. Update or reimport existing installations to receive these
changes. Do not upload the entire source repository as a skill package.

The local MCP runtime can discover skills without Shopify credentials. Store
reads require a separately authorized connection. Downloading a package does not
deploy a hosted connector or automatically connect Shopify.

## Verification

The source passed 153 Python regression tests, 13 connector tests, 19 Liquid
renderer tests, and 29 browser checks, plus type checking, builds, Theme Check,
standalone skill validation, and both extracted plugin runtimes. New synthetic
job scenarios remain `needs-review`; these checks do not establish model task
performance or live Shopify behavior.

Every archive was checked for ZIP integrity. Both plugin formats declare
version 0.1.1 and contain the 19 canonical skills. Verify downloaded files with:

```sh
sha256sum -c SHA256SUMS
```

The tag-driven GitHub Releases workflow could not start because GitHub reported
an account billing lock. An account owner can resolve billing and rerun
[release run 38713046110](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/actions/runs/38713046110)
to populate the GitHub Releases page. These repository downloads do not depend
on that job running.
