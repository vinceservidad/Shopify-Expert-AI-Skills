# Repository reliability

The catalog remains at nineteen skills. Validation, packaging, authored examples,
recorded model evaluations and theme integration checks are separate evidence
layers; passing one does not substitute for another.

## Tooling setup

Python 3.11 or newer is required for the repository tooling. The skills themselves
remain Markdown packages; installing them does not require a Python environment.
From the repository root on macOS or Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
./scripts/validate-repository.sh
python -m unittest discover -s tests -v
./scripts/package-skill.sh shopify-analytics
```

The shell commands remain the same. Packaging now uses Python's standard-library
ZIP support, so a separate `zip` executable is no longer required. On Windows,
activate the virtual environment with the appropriate shell command and call
`python scripts/validate_repository.py` or
`python scripts/package_skill.py shopify-analytics` directly. The automated
workflow currently tests Linux and macOS, not Windows.

## What validation checks

- Required repository files and the expected nineteen skill directories.
- Real YAML parsing, duplicate keys, supported fields, types, and naming rules.
- Non-empty instructions and unfinished placeholder markers.
- Local Markdown links, reference-style links, and bare resource paths, including
  missing files when the entire `references` directory is absent.
- References linked from the entrypoint, links escaping a standalone skill, and
  symlinks that could pull external files into a package.

Descriptions retain this repository's conservative 200-character limit. This is
not a universal platform limit. The Agent Skills specification allows up to
1,024 characters; compatibility is limited to 500 characters, and metadata is a
string-to-string mapping. Source checked September 6, 2026:
<https://agentskills.io/specification>.

The link checker is deliberately offline. It does not check remote URL health,
Markdown anchor existence, generated links, or every possible Markdown extension.
This is not a credential-content scanner; review every package for private data.

## Packaging behavior

Packaging validates the whole repository first. An invalid unrelated skill blocks
packaging too, so release artifacts cannot silently skip a broken catalog entry.

The ZIP contains one skill folder at its root, its resources, and a license file.
The existing exclusions for `.DS_Store`, `__pycache__`, and `.pyc` files remain.
Sorted files and fixed archive timestamps make repeated builds reproducible in
the same tooling environment. A temporary file is checked before it replaces the
last successful archive. Validation or write failures preserve the previous ZIP.

The GitHub workflow also extracts each generated archive into an isolated
directory and validates the skill there. Root-level project guidance is still
maintainer documentation unless it is explicitly included in the skill folder;
this patch does not claim to have bundled the shared operating contracts.

## What a passing check does not prove

The regression tests use synthetic fixture repositories. They test the validator,
packager, failure handling, and ZIP structure, not the behavior of ChatGPT, Claude,
or any other model. A green build does not establish that a skill makes correct
Shopify decisions, improves conversion, or has passed the behavioral scenarios.

Keep `evals/core-scenarios.md` results at `needs-review` until actual responses have
been saved and reviewed. Do not turn the synthetic tooling fixtures into claimed
merchant results or completed model evaluations.

## Depth and remaining coverage

The five priority skills now have [authored worked examples](worked-examples.md)
and a separate [answer-withheld comparison protocol](model-evaluations.md). The
theme example additionally renders actual source through official Liquid core
before local browser checks; [adapter limits](theme-verification.md) remain explicit.

| Coverage | Scope | Evidence boundary |
| --- | --- | --- |
| Structure and standalone packaging | All 19 skills | Tooling integrity |
| Written behavioral scenarios | Original 21 across all 19 skills plus a catalog-recovery exercise | Unrun unless separately recorded and reviewed |
| Deeper authored worked examples | Five priority skills | Teaching data and implementation checks |
| Recorded model comparison | Ten distinct cases across five priority skills, 60 responses | Sample-bound, answer-withheld and model-judged |
| Targeted catalog revision follow-up | Two new cases, 12 responses | Different rubric; separate diagnostic comparison |
| Hosted Shopify/editor/cart workflow | No designated development store in this change | Unverified |

Each recorded experiment identifies the source revision, requested model,
surface/settings, dates, exact prompts, complete outputs, reviewer and failures.
The [results report](../evals/RESULTS.md) preserves failures and grading sensitivity.
Results must compare the same tasks/settings without skill text before claiming
measured added value. The remaining fourteen skills do not inherit model-evaluation
passes from the priority five. Expand those cases when the next supported workflow
or observed failure calls for it, and add fresh cases after any rubric-driven tuning.
