# Hidden-answer evaluation case set

These ten synthetic cases are evaluation inputs authored for this repository. They are not merchant records, real store results, model responses, or proof that a skill improves model behavior. Each of the five priority skills has two fresh cases. They differ from the existing authored worked examples in products, values, decision triggers and edge cases.

`cases.json` contains only case IDs, target skills, user requests and supplied evidence. `rubric.json` contains the matching private-at-execution criteria and reviewer reference notes. The runner must pass a case's `request` and `evidence` to the evaluated model without the rubric, reference notes, expected answers or other evaluation outputs. Keep this directory and the authored worked-example answer files outside the evaluated model's accessible workspace or tool surface. In the skill-enabled arm, provide the selected skill and declared references under the experiment's documented context policy; disclose whether authored examples are included.

The answer key is public in this repository for reproducibility. “Hidden-answer” therefore describes the isolation used during a recorded run, not a permanently secret benchmark or protection against pretraining contamination. Reusing this published set measures performance on these cases; it does not create a new unseen holdout. A later benchmark should use new cases when fresh-case generalization matters. Case authorship, response generation, judging and human review must be reported separately, including whether they share a model family. Isolated generation is not an independent third-party audit.

## Coverage and scoring contract

| Skill | Case | Decision under test |
| --- | --- | --- |
| shopify-store-audit | audit-traffic-mix | Device-mix confounding, confirmed availability defect, exposure versus lost revenue, embedded untrusted instruction |
| shopify-store-audit | audit-market-promise | Market exception disclosure, dispatch reliability, incompatible denominators, bounded launch readiness |
| shopify-product-listing | listing-scoped-update | Existing-record field preservation, approved versus supplier facts, concrete truthful copy, draft versus currently live record |
| shopify-product-listing | listing-kit-readiness | Bundle contents, shared component inventory, SKU collision, merchant-specific publication and feed gaps |
| shopify-catalog-operations | catalog-key-null-dryrun | Authoritative IDs, duplicate SKU fallback, explicit clears versus blanks, row reconciliation |
| shopify-catalog-operations | catalog-pilot-reconcile | Transport versus saved success, protected-field drift, downstream processing, controlled recovery |
| shopify-theme-development | theme-instance-lifecycle | Multiple instances, editor replacement lifecycle, scoped form state, accessible IDs, proposed versus executed checks |
| shopify-theme-development | theme-editor-block-preservation | Persisted merchant block data versus missing render branches, app blocks, editor attributes, static-check limits |
| shopify-analytics | analytics-event-reconciliation | Raw collection quality versus processed attribution, timezones and value definitions, business revenue versus profit |
| shopify-analytics | analytics-ranking-economics | Revenue/unit/contribution rankings, no duplicate deductions, cost bridge versus causality, budget authorization |

Each rubric has six binary criteria with weights totaling 100. A criterion passes only when the response substantively meets the entire description; expected headings, keyword overlap or verbosity do not establish correctness. Do not award partial points inside a binary criterion. Arithmetic rounding at the displayed precision and equivalent correct implementations are acceptable. Reviewer reference notes explain ambiguity and acceptable alternatives; they must not be added to the task prompt.

A critical criterion marks a truth, authorization or unsupported-state failure. Report weighted score and critical failures separately: a high score must not conceal a critical failure. A strict case pass requires all criteria to pass. Any alternative aggregate pass threshold must be predeclared and reported by name rather than silently replacing strict pass. Reviewers must cite actual response evidence or a specific omission for each decision and use a separate adjudication status for ambiguous judgments. An unresolved judgment is not a pass.

The planned repeated comparison is three fresh responses per case in each of two arms, producing 60 actual responses if completed. The baseline and skill arms must use the same model/version, base instructions, task evidence, generation settings and available tools except for the declared skill context. Report actual run counts, failures, retries, context policy, model identity, code revision and prompt/response hashes. Do not substitute 60 authored fixtures or deterministic test assertions for 60 model responses. Repeats of the same ten cases estimate within-case variability; they are not 60 independent merchant situations or evidence of broad causal effectiveness. Report paired case-level differences and repeat variation, with the small, synthetic sample limitation.

## Creation and provenance

- Created on 2026-09-06 for the repository improvement following PR #2.
- Authored by a Codex case-design subagent after reviewing the five selected skill entrypoints, repository glossary and existing worked-example inputs. The author was assigned only case/rubric/documentation files and did not generate evaluated responses or score them.
- All store names, IDs, dates, prices, logs, customer-ticket counts, source excerpts and platform-state records in these cases are invented fixtures. No customer quotation or private merchant record is reproduced.
- Theme evidence is deliberately supplied as source excerpts and synthetic observations. A model response to these cases is not an authenticated Shopify render, upload, editor interaction or live-store verification.
- The evaluation author manually reviewed the decision logic, arithmetic and authorization boundaries. This is authored-rubric review, not a model-evaluation pass.

This directory contains no recorded run results. Use the runner's separately saved response, judge and aggregate artifacts for claims about completed evaluation.
