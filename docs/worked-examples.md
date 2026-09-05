# Five worked examples

These are authored teaching references with synthetic inputs, explicit expected results, and reproducible checks. They are not customer case studies, independently generated model responses, or a claim that the skills have passed behavioral evaluation.

| Skill | Worked decision | Check |
| --- | --- | --- |
| [Analytics](../skills/shopify-analytics/references/worked-example.md) | Sales rise 10% while contribution after ads falls £568; product rankings depend on the metric | Decimal arithmetic, costs, comparison windows and non-additive attribution |
| [Product listing](../skills/shopify-product-listing/references/worked-example.md) | Produce a useful draft without guessing weight, inventory or claims | Source mappings, preserved SKUs/prices, unknowns and not-saved state |
| [Catalog operations](../skills/shopify-catalog-operations/references/worked-example.md) | Separate two candidate changes from two blocking exceptions | Unique IDs, blank/set/clear rules, protected fields and rollback |
| [Store audit](../skills/shopify-store-audit/references/worked-example.md) | Prioritize a purchase-control issue without inventing its conversion impact | Weighted session rates and traceable, bounded findings |
| [Theme development](../skills/shopify-theme-development/references/worked-example.md) | Keep selected price, variant ID and availability aligned | Official Liquid core rendering, two Chromium test paths and separate Shopify Theme Check |

## Read an example

Open the worked reference in one skill, then inspect its input and expected-output files. Each skill ZIP includes its own teaching assets, so those examples do not depend on unavailable repository-root files after installation. The validation runner and browser harness remain maintainer tools in this repository.

## Run the data checks

After the Python setup in [Repository reliability](reliability.md):

```bash
python scripts/worked_examples.py
python -m unittest discover -s tests -v
```

The expected JSON was specified separately from the runner. Do not regenerate expected files automatically whenever code changes. Review the source evidence and arithmetic before accepting an intentional difference.

The runner is deliberately bounded to these synthetic cases. It rejects production-mode inputs, never connects to Shopify, never creates an import payload, and does not mutate the input records. It is not a general store analyzer or listing generator.

## Run browser checks

Browser and Ruby Liquid dependencies are separate from the lightweight packaging dependencies. Use Ruby 3.3 with Bundler 4.0.16 for the actual-source rendering path:

```bash
python -m pip install -r requirements-browser.txt
python -m playwright install chromium
export BUNDLE_GEMFILE=Gemfile.theme
bundle install
python -m unittest discover -s tests/theme -v
python -m unittest discover -s tests/browser -p 'check_*.py' -v
```

On Linux hosts that lack browser system libraries, use Playwright's documented dependency installation for that host. A preinstalled compatible Chromium binary can be selected with `BROWSER_EXECUTABLE`. Restricted environments may block localhost navigation; record that as a blocked environment, not a code pass or a skipped success. The GitHub workflow runs the browser checks in its own runner.

The original harness uses the real example JavaScript with hand-written HTML. A separate path renders the actual section, JSON template and layout through Shopify's official Liquid core with explicit local adapters for proprietary extensions. The browser captures a synthetic product-form POST locally. Neither path contacts Shopify or submits an order. See [Theme verification](theme-verification.md) for tested behavior and the remaining hosted-editor/cart boundary. Static Liquid/JSON checking is separate:

```bash
shopify theme check --path skills/shopify-theme-development/assets/worked-example/theme --fail-level error
```

A browser pass, static-check pass, and live-store verification are three different evidence states.

## Evaluate an AI response without leaking the answer

For a genuine behavioral test, enable only the selected skill in an isolated session and supply the request plus input evidence. Withhold the worked reference and expected-output files from that test installation; otherwise the model has the answer key. Removing those teaching-only materials for the evaluation should not remove the skill's operating procedure or required domain references.

Save the full response and generated files, then review the actual arithmetic, decisions, uncertainty, authorization, and usefulness against the rubric. Repeat with the same model/settings and input without the skill, in a separate session. Record failures as well as passes. Do not use an answer-key lookup as evidence of skill effectiveness.

The [evaluation manifest](../evals/worked-examples.json) keeps the original teaching-case behavioral replays at `not_run`. The separate [model evaluation protocol](model-evaluations.md) uses fresh cases, frozen prompts, repeated comparisons and blinded substantive scoring. Authored examples and deterministic checks must not silently become model scores.
