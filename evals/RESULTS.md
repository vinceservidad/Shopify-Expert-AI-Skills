# Recorded model evaluation evidence

September 6, 2026. This is a supervised-toolkit reliability report, not a merchant
case study, external certification, or a numeric rating of the repository.

The first answer-withheld comparison found higher judged scores with the five
priority skills: **85.5 versus 78.7 out of 100**, with **23/30 versus 17/30** responses
passing the predeclared weighted threshold and critical gates. The same experiment
also exposed incomplete verification and recovery plans, plus one inverted
current/proposed-price table in a skill-assisted answer. Those failures are retained.

## Original ten-case comparison

The [frozen manifest](results/2026-09-06-gpt-5.5/manifest.json),
[task prompts](results/2026-09-06-gpt-5.5/prompts.json),
[60 complete response records](results/2026-09-06-gpt-5.5/responses/),
[360 primary criterion judgments](results/2026-09-06-gpt-5.5/reviews.json) and
[recomputable summary](results/2026-09-06-gpt-5.5/summary.json) are available together.

| Metric | Without skill text | With skill text |
| --- | ---: | ---: |
| Distinct cases | 10 | 10 |
| Repetitions per case | 3 | 3 |
| Planned / completed responses | 30 / 30 | 30 / 30 |
| Mean weighted score | 78.667 | 85.500 |
| Pass: at least 80/100 and no failed critical criterion | 17/30 (56.7%) | 23/30 (76.7%) |
| Fail under that rule | 13/30 (43.3%) | 7/30 (23.3%) |
| All six criteria passed | 1/30 | 9/30 |
| Responses with a failed critical criterion | 10/30 | 6/30 |
| Invalid calls, timeouts, tool events or harness retries | 0 | 0 |

The weighted score difference is **+6.833 points**, and the observed threshold-pass
difference is **+20 percentage points**. These are calculations on this sample.
“Failure rate” here means failure under this rubric, not the probability that a
skill will harm a merchant or make an unauthorized change. Many compound criteria
failed on omitted detail, even where the answer's main hold decision was correct.

### Results by skill

Each row contains two distinct cases and six responses per condition.

| Skill | Without: mean / passes | With: mean / passes | Mean difference |
| --- | ---: | ---: | ---: |
| Store audit | 83.33 / 4 of 6 | 98.33 / 6 of 6 | +15.00 |
| Product listing | 82.50 / 3 of 6 | 87.50 / 5 of 6 | +5.00 |
| Catalog operations | 66.67 / 2 of 6 | 67.50 / 2 of 6 | +0.83 |
| Theme development | 85.00 / 6 of 6 | 87.50 / 6 of 6 | +2.50 |
| Analytics | 75.83 / 2 of 6 | 86.67 / 4 of 6 | +10.83 |

Seven case-level mean differences were positive and three tied. None were negative
in this sample. The largest differences were in the device-mix audit and product
economics cases. Catalog pilot reconciliation remained weak in both conditions;
the skill did not remove that problem.

### Repeat variation and retained failures

Repeated responses are not interchangeable. The with-skill analytics responses
ranged from 65 to 100, listing from 75 to 90, catalog from 40 to 90, theme from 85
to 100, and audit from 90 to 100. The summary preserves every individual score and
its case/repetition. These ranges mix two cases per skill and are descriptive;
inspect the case-level rows before attributing a difference to randomness alone.

The main observed failure categories were incomplete saved-versus-downstream
state distinctions, missing cost-definition components, incomplete recovery or
verification plans, and under-specified repeated editor checks. In
[this catalog answer](results/2026-09-06-gpt-5.5/responses/response-ce8a6a0e5cd526dc75c2.json),
the narrative correctly describes a price moving from 87 to 78, but the recovery
exception table labels 87 current and 78 proposed. That inconsistency motivated a
narrow clarification of catalog recovery provenance and direction.

No evaluated response was permitted to operate a store, and the recorded event
streams contain no tool calls. This cannot test execution safety or prove that an
agent would respect permissions when real mutation tools are available.

## Secondary judgment audit and sensitivity

A fresh-context secondary model reviewer assessed every failed critical criterion
plus selected noncritical judgments across four primary-flagged borderline
responses, without condition labels. One of those four also had a critical failure.
The [preserved secondary review](results/2026-09-06-gpt-5.5/adjudication.json) covers
19 responses and 26 targeted judgments: **23 upheld, 3 ambiguous, zero definitive
grade changes**. Twenty-five judgments concerned required-detail omissions; one
also contained the current/proposed-price inconsistency. This selected audit does
not measure overall grading reliability or false-pass frequency.

The primary scores were not edited. If all three ambiguous judgments are instead
treated favorably, the [hypothetical sensitivity calculation](results/2026-09-06-gpt-5.5/sensitivity.json)
gives **80.0 without versus 86.0 with skill**, and **18/30 versus 23/30 passes**.
The overall mean difference remains positive; the numerical size is sensitive to
judgment. At case level, catalog-pilot reconciliation and analytics event
reconciliation become negative differences of -5.000 and -1.667 respectively.
This calculation is separately labeled and is not a replacement set of grades.

## Fresh catalog revision follow-up

The catalog clarification distinguishes captured-before values, the latest saved
state and proposed recovery targets; separates no-ops from newly changed and
conforming records; and protects later authorized edits during recovery. A second
experiment compared the previous catalog skill at `63d0818` with revision `0.2.2`
on **two new targeted cases**, three repetitions per version. Its
[frozen manifest](results/2026-09-06-catalog-revision/manifest.json),
[materialized prompts](results/2026-09-06-catalog-revision/prompts.json),
[12 complete responses](results/2026-09-06-catalog-revision/responses/),
[72 criterion judgments](results/2026-09-06-catalog-revision/reviews.json) and
[summary](results/2026-09-06-catalog-revision/summary.json) preserve the full result.

| Metric | Previous catalog skill | Revised catalog skill |
| --- | ---: | ---: |
| Planned / completed responses | 6 / 6 | 6 / 6 |
| Mean weighted score | 89.167 | 90.833 |
| Pass: at least 80/100 and no failed critical criterion | 5/6 | 6/6 |
| All six criteria passed | 3/6 | 3/6 |
| Responses with a failed critical criterion | 0/6 | 0/6 |
| Care-insert pilot case mean | 78.33 | 81.67 |
| Selective rollback case mean | 100.00 | 100.00 |

The observed mean difference is **+1.667 points**. Both versions avoided an
affirmative recovery-direction error in these six responses each. Every
care-insert answer still missed at least one noncritical criterion: complete
value provenance, explicit new-change counts or an actionable candidate recovery
target. One revised answer incorrectly counted a saved-conforming record as
nonconforming because its downstream processing was pending. The revised version
does not have more all-criteria passes, and this sample does not establish that
the earlier failure was eliminated or that the change reliably improves results.
The clarification is retained for its explicit source and recovery semantics,
with this limited diagnostic evidence attached.

The follow-up plan was committed as
[`8bd61f3`](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/commit/8bd61f3d18d85e2d0c6e2cd010b831455a0ab00f)
before generation; calls ran from 02:10:33 to 02:12:37 Asia/Manila. It used the same
requested model, settings and isolation as the first experiment, with zero invalid
calls, timeouts, unexpected tool events or harness retries. One primary model
reviewer scored all 12 full answers with version labels withheld. This reviewer
had worked on the theme fixture and earlier grading but did not author the
catalog clarification or fresh cases.

These cases were designed after the original failure was known, from a qualitative
failure brief. They are a targeted diagnostic, not another independent general
effectiveness test. Critical gates were narrowed to affirmative false-state,
wrong-direction or unauthorized/destructive execution recommendations; ordinary
omissions remain noncritical. This rubric differs from the original compound
criteria, so the two experiments' pass rates must not be compared or pooled.
Across both experiments there are **72 model responses on 12 distinct synthetic
cases**, not 72 independent cases. The fresh follow-up retains its own rubric
and does not alter the original scores.

## Provenance and limits

- Cases and rubrics were authored by a maintainer-directed GPT-6-Astra case-design
  subagent. GPT-5.5 generated the answers in independent fresh CLI invocations.
  Two GPT-6-Astra primary reviewers scored complete responses under opaque IDs;
  a third, fresh-context reviewer performed the targeted secondary audit. No human
  Shopify-expert adjudication or independent third-party audit occurred.
- The initial plan was committed as
  [`25478a3`](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/commit/25478a3c3449dd58030adb76174e6645d24f7814)
  at 01:43:53 Asia/Manila, before the first recorded call at 01:44:09. Generation
  finished at 01:53:57. The [source revision](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/commit/63d0818e3cfabfbe86f863dff84d2f6c12bffa25)
  and content hashes identify the original skill text, before the catalog correction.
- Both conditions requested `gpt-5.5`, medium reasoning, using Codex CLI 0.149.1.
  The provider's JSONL response does not expose a server model identifier. Exact
  materialized task/skill prompts are saved; vendor system instructions and their
  potential drift are outside this repository's control. The common prompt asks
  for evidence, uncertainty and status and requests at most 900 words. That length
  is neither enforced nor a scoring criterion: 10/60 original answers exceed it
  by whitespace-delimited counting. The request may affect ceiling effects and
  completeness. The first
  [availability probes](results/2026-09-06-gpt-5.5/preflight.json) are reported separately.
- Automatic skills, memory, plugins, hooks, browsing, shell and MCP were disabled;
  calls used empty temporary workspaces and read-only permissions. The rubric,
  authored teaching answers and earlier responses were not in the task prompts.
  This measures supplied skill text, not native activation or real tool execution.
- Blinding withheld condition labels, not recognizable writing style. Cases are
  synthetic and selected by maintainers; judges share a provider family with the
  generator. Publishing the answer keys makes future training contamination
  impossible to rule out. Reusing the same cases is not a fresh holdout.
- There are ten distinct initial cases, not sixty independent merchant situations.
  Repeats are clustered within cases. No population error rate, statistical
  significance, business-outcome causality, or universal effectiveness is claimed.
  The other fourteen skills do not inherit these results.

Broader coverage remains a separate task: the original 21 general behavioral
scenarios span all 19 skills but have no recorded model execution, and a new
generic catalog recovery scenario is also unrun. These experiments prioritize
depth on the five requested skills. They provide no measured effectiveness claim
for the remaining fourteen skills and add no new skill folders.

## Separate authored and Shopify-workflow evidence

The original four data-example calculations and five teaching walkthroughs remain
authored examples. Their original behavioral replay manifest stays `not_run`.
Structural tests, synthetic fixture tests, model responses and substantive grades
are different evidence classes.

The theme example now renders its actual Liquid section, product JSON template and
layout through Shopify's official Liquid core. **19 renderer regressions and 29
browser executions** passed locally, and Shopify CLI Theme Check reported **five
files with no offenses**. Twelve browser behaviors deliberately repeat across the
hand-written DOM and actual-Liquid paths. [Theme verification](../docs/theme-verification.md)
details the locally authored adapters for proprietary Shopify behavior. Hosted
theme-editor operation, real Shopify cart acceptance, markets and live publication
remain unverified; no merchant store was accessed or changed.

## Reproduce the evidence audit

```bash
python scripts/check_evaluation_evidence.py
python -m unittest discover -s tests -v
python scripts/worked_examples.py
```

The CI evidence check recalculates primary and sensitivity summaries, verifies
internal prompt/response/review hashes and IDs, and rejects inconsistent or hidden
partial records. It does not verify external links or Git timestamp truth. It never
calls a model or judges the correctness of an answer itself. Follow the
[protocol](../docs/model-evaluations.md) for a new experiment and the
[theme setup](../docs/theme-verification.md) for Ruby/browser tests.
