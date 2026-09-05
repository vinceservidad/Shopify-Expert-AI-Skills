# Model evaluation protocol

This benchmark tests whether supplying the existing skill procedure and ordinary
domain references changes a model's written decisions. It uses fresh synthetic
cases, withholds the rubric and teaching answers during generation, and retains
every planned response. It does not test merchant outcomes or autonomous operation.

## Evidence levels

| Evidence | What it can establish | What it cannot establish |
| --- | --- | --- |
| Authored examples and deterministic tests | Known calculations, mappings and implementation behavior | Independent model competence |
| Answer-withheld model responses | Actual written decisions on supplied cases | Live execution, native skill discovery, external validation |
| With/without comparison | Descriptive paired differences for the sampled model, cases and settings | Universal uplift or business causality |
| Repeated calls | Within-case response variability and observed failures | Independent samples of the population of Shopify work |
| Liquid and browser verification | Actual example source renders and specified local behavior works | Proprietary Shopify runtime, hosted editor or production cart acceptance |

The five original teaching examples in `evals/worked-examples.json` remain
`not_run` for their original behavioral tests. The new benchmark has different
inputs and its own records. The 21 scenarios in `evals/core-scenarios.md` already
cover all 19 skills; they remain unrun scenarios unless their exact tasks receive
separate recorded model responses and review. More skill names would not close
the reliability gap.

## Freeze before generation

The task inputs live in `evals/holdout/cases.json`; scoring criteria and reference
notes live separately in `evals/holdout/rubric.json`. Both are maintainer-authored.
They are held out from generation, not permanently secret. Publishing them means
future training contamination cannot be ruled out; refresh cases for later claims.

```bash
python scripts/model_evaluations.py freeze evals/results/<run-name> --model <available-model-id> --effort medium --repeats 3
```

Freeze records the base commit, source hashes, full task inputs, rubric, exact
materialized prompts, CLI version, requested model, settings, randomized order,
opaque response IDs, pass threshold and stopping rules. Commit this frozen plan
before running. Git history provides the audit anchor; an editable checksum alone
does not prove independence. Never overwrite a frozen experiment.

The supplied-text treatment consists of `SKILL.md` plus all ordinary Markdown
domain references. Only the worked-example link paragraph and teaching reference
are removed. Worked assets, expected answers, repository contracts, scores and
rubrics are never appended to the model prompt. The neutral task instructions are
identical across arms. Both receive the same task and raw evidence; only the skill
text differs. This measures supplied guidance, including its additional context
length, rather than automatic skill triggering or progressive reference retrieval.

## Generate actual responses

Model calls use the already authenticated local Codex CLI. No API credentials are
stored in this repository. Verify the desired exact model with a small availability
probe before freezing. The CLI can reject a model that the desktop app supports.
The JSONL format records response text, completion/error events and usage, but does
not expose a server model identifier; the manifest states this identity limit.

```bash
python scripts/model_evaluations.py run evals/results/<run-name> --workers 3 --timeout 300
```

Each invocation starts fresh in an empty temporary directory with user config,
rules, automatic skill instructions, plugins, memory, hooks, MCP, browsing and
shell tools disabled. The task permits responses only. No continuation, answer
key, grader feedback or prior response is supplied. Unexpected tool/error events
invalidate a response. This is not a general operating-system security sandbox;
it is a controlled response experiment with read-only execution permissions and
observed event auditing. Vendor system instructions and safety behavior still apply.

The entire ten-case plan is fixed at three repetitions per arm: 60 calls. Each
planned slot is attempted at most once by the harness. A timeout, malformed event
stream, incomplete response, tool event or transport error stays in its slot as an
invalid result. The CLI may perform its own internal network retry; the harness
does not rerun failed answers or select the best one. Existing records are not
overwritten. An interrupted reservation remains visible and counts as incomplete.
Resume only unattempted slots. Start a new, clearly identified experiment for a
retry or changed model. Stop on sustained provider unavailability instead of
claiming that infrastructure failures demonstrate skill quality.

## Blind substantive review

```bash
python scripts/model_evaluations.py blind evals/results/<run-name> work/blinded.json
```

Give reviewers only this packet, which includes opaque ID, raw task, rubric and
response. Withhold arm labels, prompts, run order, other scores and the manifest.
Response wording may reveal a skill-like style, so this is label blinding, not a
guarantee that treatment is impossible to infer. Save judgments before revealing
the mapping. Reviewers must assess each complete response, including arithmetic,
actual decision, evidence handling, uncertainty and authorization boundaries.

Each criterion receives a boolean, a verbatim response quote and a substantive
rationale. A missing behavior fails even if headings look correct. A failed
critical truth/authorization criterion makes the entire response fail regardless
of total score; other responses pass at 80/100 or above. A low score is a result,
not a reason to change the rubric or discard a run. Record grader identity and
date. Model-based review must be called model-based; it is not human expert signoff.
For uncertain or disputed judgments retain the first score, add adjudication with
its rationale, and publish sensitivity when it changes the conclusion.

```json
{"reviews": [{"id": "response-opaque-id", "reviewer": "named reviewer and surface", "reviewed_at": "ISO-8601", "response_sha256": "copied response hash", "criteria": [{"id": "criterion-id", "passed": false, "evidence_quote": "verbatim excerpt or empty for omission", "rationale": "Why the substantive criterion is or is not met"}]}]}
```

## Summarize without inflating certainty

```bash
python scripts/model_evaluations.py summarize evals/results/<run-name> evals/results/<run-name>/reviews.json evals/results/<run-name>/summary.json
```

The offline summarizer rejects changed prompts, mismatched response/event hashes,
missing/duplicate/orphan reviews, unknown criteria, incorrect response hashes and
quotes absent from the response. It validates record integrity; it cannot determine
whether a grader's substantive judgment is correct. The report must retain both
criteria-level review and response text for scrutiny.

All planned slots remain in the descriptive denominator, with infrastructure
failures separately identified. Report per-arm completion, score, pass/failure and
critical-failure counts, plus paired case means. There are ten distinct cases and
30 planned responses per arm. Repetitions are clustered within cases; do not apply
an independent-binomial confidence interval to all 30 calls. Zero observed failures
does not establish zero risk. A tie or negative difference must be stated plainly.

Use findings to choose narrow skill changes and new held-out retests. Do not tune
to this answer key and then call another run on the same cases independent validation.
No numeric repository rating is produced by this benchmark.

## Targeted previous-versus-revised comparison

When a recorded failure supports a skill correction, freeze different tasks and
compare the prior and revised skill text on those same tasks. The optional mode
below reads previous entrypoints/domain references from an immutable Git revision;
both conditions receive skill guidance. It is not a second without-skill baseline.

```bash
python scripts/model_evaluations.py freeze evals/results/<followup-name> --model <available-model-id> --effort medium --repeats 3 --cases evals/catalog-followup/cases.json --rubric evals/catalog-followup/rubric.json --compare-revision <previous-commit>
```

The same isolation, response retention, blinding, scoring and integrity rules apply.
The catalog follow-up uses two new targeted cases and twelve planned calls, with
`previous_skill` and `revised_skill` conditions. Its more atomic criteria distinguish
ordinary omissions from affirmative critical errors; scores must not be compared
numerically with the original ten-case rubric. Its case selection is informed by
the first pilot, so it is a targeted diagnostic comparison, not untouched evidence
of broad generalization. Preserve the original pilot and any secondary-adjudication
results separately, including when a correction shows no advantage.

## Sources and scope

- [Codex configuration schema](https://developers.openai.com/codex/config-schema.json), reviewed September 6, 2026, plus installed `codex exec --help` and `codex features list`: available isolation and execution controls. Exact support is version-dependent.
- [Anthropic evaluation guidance](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests), reviewed September 6, 2026: task-specific criteria and substantive evaluations. The benchmark design and thresholds here are maintainer choices, not vendor-certified standards.
- [Theme verification](theme-verification.md): the separately scoped Liquid, browser and Shopify static checks.

Knowledge classification: `artifact_type=framework`; decision is whether evidence
supports a bounded reliability or guidance-effect claim; owner is the repository
maintainer; inputs are frozen cases, skill text, actual responses and substantive
reviews; evidence status depends on the run; confidence is sample-bound; freshness
is the recorded runtime date; dependencies are the CLI/model and local test tools;
authorization permits response generation and repository work only; stop on provider
unavailability, contamination or a broken integrity check.
