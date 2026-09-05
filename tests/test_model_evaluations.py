"""Offline integrity tests of evaluation tooling, not model performance evidence."""
from copy import deepcopy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import model_evaluations as model_eval


def event_stream(response="Decision based on supplied evidence. No external action occurred."):
    return "\n".join(json.dumps(event) for event in [
        {"type": "item.completed", "item": {"type": "agent_message", "text": response}},
        {"type": "turn.completed", "usage": {"input_tokens": 100, "output_tokens": 12}},
    ])


class ModelEvaluationTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name) / "repository"
        self.root.mkdir()
        self.output = Path(self.temporary.name) / "experiment"
        self.cases = [{"id": "audit-case", "skill": "shopify-store-audit",
                       "request": "Diagnose the supplied facts.", "evidence": {"sessions": 100}},
                      {"id": "listing-case", "skill": "shopify-product-listing",
                       "request": "Prepare a truthful draft.", "evidence": {"material": "cotton"}}]
        self.rubrics = [{"id": case["id"], "hidden_answer": "HIDDEN_RUBRIC_SENTINEL",
                         "criteria": [{"id": "truth", "weight": 20, "critical": True},
                                      {"id": "decision", "weight": 60, "critical": False},
                                      {"id": "completeness", "weight": 20, "critical": False}]}
                        for case in self.cases]
        model_eval.write_json(self.root / "evals/holdout/cases.json", {"cases": self.cases})
        model_eval.write_json(self.root / "evals/holdout/rubric.json", {"rubrics": self.rubrics})
        for case in self.cases:
            skill = self.root / "skills" / case["skill"]
            (skill / "references").mkdir(parents=True)
            (skill / "SKILL.md").write_text(
                "# Skill\n\nOrdinary operational procedure.\n\n## Worked example\n\n"
                "Read [references/worked-example.md](references/worked-example.md) for teaching.\n\n"
                "Preserve this later operating rule.\n")
            (skill / "references" / "ordinary.md").write_text("Ordinary domain reference.")
            (skill / "references" / "worked-example.md").write_text("TEACHING_ANSWER_SENTINEL")
            (skill / "assets").mkdir()
            (skill / "assets" / "expected.json").write_text('{"answer":"ASSET_ANSWER_SENTINEL"}')
        with patch.object(model_eval.subprocess, "check_output", return_value="fixture-version\n"):
            self.manifest = model_eval.freeze(self.root, self.output, repeats=3)
        self.prompts = model_eval.read_json(self.output / "prompts.json")

    def change_manifest(self, change):
        manifest = model_eval.read_json(self.output / "manifest.json")
        change(manifest)
        model_eval.write_json(self.output / "manifest.json", manifest)
        (self.output / "manifest.sha256").write_text(
            model_eval.digest((self.output / "manifest.json").read_bytes()) + "\n")

    def record(self, job, response=None, status="completed"):
        response = response or "Decision based on supplied evidence. No external action occurred."
        events = event_stream(response)
        record = {"id": job["id"], "status": status, "response": response,
                  "response_sha256": model_eval.digest(response), "events": events,
                  "events_sha256": model_eval.digest(events), "exit_code": 0,
                  "prompt_sha256": self.manifest["prompt_hashes"][job["prompt_key"]]}
        model_eval.write_json(self.output / "responses" / (job["id"] + ".json"), record)
        return record

    def review(self, job, record):
        return {"id": job["id"], "reviewer": "offline-fixture-reviewer", "reviewed_at": "2026-09-06",
                "response_sha256": record["response_sha256"],
                "criteria": [{"id": criterion["id"], "passed": True,
                              "evidence_quote": "supplied evidence", "rationale": "Fixture rationale."}
                             for criterion in self.rubrics[0]["criteria"]]}

    def populate(self):
        reviews = [self.review(job, self.record(job)) for job in self.manifest["jobs"]]
        path = self.output / "reviews.json"
        model_eval.write_json(path, {"reviews": reviews})
        return path, reviews

    def test_freeze_balances_arms_repetitions_and_is_reproducible(self):
        jobs = self.manifest["jobs"]
        expected = {(case["id"], arm, repeat) for case in self.cases
                    for arm in model_eval.ARMS for repeat in range(1, 4)}
        self.assertEqual(len(jobs), 12)
        self.assertEqual({(job["case_id"], job["arm"], job["repeat"]) for job in jobs}, expected)
        self.assertEqual(len({job["id"] for job in jobs}), len(jobs))
        with patch.object(model_eval.subprocess, "check_output", return_value="fixture-version\n"):
            other = model_eval.freeze(self.root, Path(self.temporary.name) / "second", repeats=3)
        self.assertEqual(jobs, other["jobs"])
        self.assertEqual(self.manifest["prompt_hashes"], other["prompt_hashes"])

    def test_freeze_refuses_overwrite_and_invalid_repetitions(self):
        with self.assertRaises(ValueError):
            model_eval.freeze(self.root, self.output)
        for repeat in (0, -1, True, 1.5):
            with self.subTest(repeat=repeat), self.assertRaises(ValueError):
                model_eval.freeze(self.root, Path(self.temporary.name) / "invalid", repeats=repeat)

    def test_prompts_withhold_rubric_and_teaching_answers_in_both_arms(self):
        for key, prompt in self.prompts.items():
            with self.subTest(key=key):
                for sentinel in ("HIDDEN_RUBRIC_SENTINEL", "TEACHING_ANSWER_SENTINEL", "ASSET_ANSWER_SENTINEL"):
                    self.assertNotIn(sentinel, prompt)
                self.assertNotIn("references/worked-example.md", prompt)
                self.assertIn("Supplied evidence:", prompt)
                self.assertEqual("Ordinary domain reference." in prompt, key.endswith("--with_skill"))
                self.assertEqual("Preserve this later operating rule." in prompt, key.endswith("--with_skill"))

    def test_skill_context_hashes_sources_and_rejects_symlinks(self):
        _, sources = model_eval.skill_context(self.root, "shopify-store-audit")
        self.assertEqual(len(sources), 2)
        self.assertTrue(all("worked-example" not in path and "assets" not in path for path in sources))
        path = self.root / "skills/shopify-store-audit/references/ordinary.md"
        path.unlink()
        path.symlink_to(self.root / "evals/holdout/rubric.json")
        with self.assertRaises(ValueError):
            model_eval.skill_context(self.root, "shopify-store-audit")

    def test_case_validation_rejects_leaked_extra_fields_and_duplicate_ids(self):
        leaked = deepcopy(self.cases)
        leaked[0]["expected"] = "answer"
        for cases in (leaked, self.cases + [self.cases[0]], []):
            with self.subTest(cases=cases), self.assertRaises(ValueError):
                model_eval.validate_cases(cases, self.rubrics)

    def test_rubric_validation_rejects_invalid_weights_flags_and_ids(self):
        for key, value in (("weight", True), ("weight", 0), ("weight", 21), ("critical", "true")):
            rubric = deepcopy(self.rubrics)
            rubric[0]["criteria"][0][key] = value
            with self.subTest(key=key, value=value), self.assertRaises(ValueError):
                model_eval.validate_cases(self.cases, rubric)
        with self.assertRaises(ValueError):
            model_eval.validate_cases(self.cases, self.rubrics[:-1])

    def test_frozen_integrity_detects_manifest_or_prompt_changes(self):
        path = self.output / "prompts.json"
        original = path.read_text()
        changed = deepcopy(self.prompts)
        changed[next(iter(changed))] += " changed"
        model_eval.write_json(path, changed)
        with self.assertRaisesRegex(ValueError, "prompt hash"):
            model_eval.verify_frozen(self.output)
        path.write_text(original)
        path = self.output / "manifest.json"
        path.write_text(path.read_text() + " ")
        with self.assertRaisesRegex(ValueError, "manifest hash"):
            model_eval.verify_frozen(self.output)

    def test_frozen_plan_rejects_missing_jobs_and_wrong_arm_prompt(self):
        self.change_manifest(lambda manifest: manifest["jobs"].pop())
        with self.assertRaisesRegex(ValueError, "planned jobs"):
            model_eval.verify_frozen(self.output)
        model_eval.write_json(self.output / "manifest.json", self.manifest)
        self.change_manifest(lambda manifest: manifest["jobs"][0].update(prompt_key="other--without_skill"))
        with self.assertRaisesRegex(ValueError, "assigned arm"):
            model_eval.verify_frozen(self.output)

    def test_parse_codex_requires_final_response_and_completion(self):
        response, usage, problems = model_eval.parse_codex(event_stream(), 0)
        self.assertIn("No external action occurred.", response)
        self.assertEqual(usage["output_tokens"], 12)
        self.assertEqual(problems, [])
        for stream, exit_code in (("", 0), (event_stream(), 1),
                                  ('{"type":"turn.completed"}', 0)):
            with self.subTest(stream=stream):
                self.assertIn("incomplete_invocation", model_eval.parse_codex(stream, exit_code)[2])

    def test_parse_codex_detects_tools_and_error_events(self):
        for event in ({"type": "item.completed", "item": {"type": "command_execution", "command": "pwd"}},
                      {"type": "turn.failed"}, {"type": "error"}):
            with self.subTest(event=event):
                _, _, problems = model_eval.parse_codex(event_stream() + "\n" + json.dumps(event), 0)
                self.assertTrue(problems)

    def test_parse_codex_rejects_malformed_or_non_object_events(self):
        for stream in ("not-json", "[]", "null", '"text"'):
            with self.subTest(stream=stream), self.assertRaises(ValueError):
                model_eval.parse_codex(stream, 0)

    def test_run_one_never_overwrites_a_previous_attempt(self):
        job = self.manifest["jobs"][0]
        with patch.object(model_eval.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, event_stream(), "")) as runner:
            self.assertEqual(model_eval.run_one(self.output, self.manifest, self.prompts, job, 30)[1], "completed")
            path = self.output / "responses" / (job["id"] + ".json")
            before = path.read_bytes()
            self.assertEqual(model_eval.run_one(self.output, self.manifest, self.prompts, job, 30)[1], "already_recorded")
            self.assertEqual(path.read_bytes(), before)
            self.assertEqual(runner.call_count, 1)
            command = runner.call_args.args[0]
            self.assertIn("--ignore-user-config", command)
            self.assertIn("--ephemeral", command)
            self.assertIn("skills.include_instructions=false", command)
            self.assertIn(self.manifest["model"], command)

    def test_run_one_keeps_malformed_output_and_stderr_as_failure_evidence(self):
        job = self.manifest["jobs"][0]
        result = subprocess.CompletedProcess([], 1, "malformed raw output", "transport diagnostic")
        with patch.object(model_eval.subprocess, "run", return_value=result):
            self.assertEqual(model_eval.run_one(self.output, self.manifest, self.prompts, job, 30)[1], "invalid")
        record = model_eval.read_json(self.output / "responses" / (job["id"] + ".json"))
        self.assertEqual(record["events"], result.stdout)
        self.assertEqual(record["diagnostics"], result.stderr)
        self.assertEqual(record["exit_code"], 1)

    def test_response_integrity_checks_hashes_and_claimed_completion(self):
        job = self.manifest["jobs"][0]
        record = self.record(job)
        record["response"] += " invented addition"
        path = self.output / "responses" / (job["id"] + ".json")
        model_eval.write_json(path, record)
        with self.assertRaisesRegex(ValueError, "integrity"):
            model_eval.records(self.output, self.manifest)
        record["response_sha256"] = model_eval.digest(record["response"])
        model_eval.write_json(path, record)
        with self.assertRaisesRegex(ValueError, "contradicts"):
            model_eval.records(self.output, self.manifest)

    def test_response_integrity_rejects_orphans_and_wrong_prompt(self):
        job = self.manifest["jobs"][0]
        record = self.record(job)
        record["prompt_sha256"] = "wrong"
        model_eval.write_json(self.output / "responses" / (job["id"] + ".json"), record)
        with self.assertRaisesRegex(ValueError, "prompt"):
            model_eval.records(self.output, self.manifest)
        model_eval.write_json(self.output / "responses/orphan.json", {"id": "orphan"})
        with self.assertRaisesRegex(ValueError, "Orphan"):
            model_eval.records(self.output, self.manifest)

    def test_blinded_packet_contains_no_arm_or_prompt_and_only_completed_outputs(self):
        job = self.manifest["jobs"][0]
        self.record(job)
        self.record(self.manifest["jobs"][1], status="invalid")
        output = self.output / "blind.json"
        model_eval.blind(self.output, output)
        packets = model_eval.read_json(output)["packets"]
        self.assertEqual(len(packets), 1)
        self.assertEqual(packets[0]["id"], job["id"])
        for forbidden in ("arm", "prompt", "prompt_key", "repeat", "model", "usage"):
            self.assertNotIn(forbidden, packets[0])
        self.assertIn("rubric", packets[0])
        with self.assertRaises(ValueError):
            model_eval.blind(self.output, output)

    def test_summary_reports_complete_paired_denominators(self):
        path, _ = self.populate()
        summary = model_eval.summarize(self.output, path)
        self.assertEqual(summary["distinct_cases"], 2)
        for arm in model_eval.ARMS:
            self.assertEqual(summary["arms"][arm]["planned"], 6)
            self.assertEqual(summary["arms"][arm]["passes"], 6)
            self.assertEqual(summary["arms"][arm]["mean_score"], 100)
        self.assertTrue(all(case["delta"] == 0 for case in summary["case_paired_scores"]))

    def test_missing_and_invalid_attempts_remain_in_failure_denominator(self):
        model_eval.write_json(self.output / "reviews.json", {"reviews": []})
        self.record(self.manifest["jobs"][0], status="invalid")
        summary = model_eval.summarize(self.output, self.output / "reviews.json")
        for arm in model_eval.ARMS:
            self.assertEqual(summary["arms"][arm]["planned"], 6)
            self.assertEqual(summary["arms"][arm]["completed"], 0)
            self.assertEqual(summary["arms"][arm]["failures"], 6)
            self.assertEqual(summary["arms"][arm]["failure_rate"], 1)

    def test_critical_failure_overrides_score_at_pass_threshold(self):
        path, reviews = self.populate()
        reviews[0]["criteria"][0]["passed"] = False
        model_eval.write_json(path, {"reviews": reviews})
        summary = model_eval.summarize(self.output, path)
        row = next(row for row in summary["rows"] if row["id"] == reviews[0]["id"])
        self.assertEqual(row["score"], 80)
        self.assertFalse(row["passed"])
        self.assertEqual(row["critical_failures"], ["truth"])

    def test_reviews_must_cover_every_completed_response_exactly_once(self):
        path, reviews = self.populate()
        for invalid in (reviews[:-1], reviews + [reviews[0]], reviews + [{"id": "orphan"}]):
            model_eval.write_json(path, {"reviews": invalid})
            with self.subTest(count=len(invalid)), self.assertRaises(ValueError):
                model_eval.summarize(self.output, path)

    def test_review_requires_matching_response_provenance_and_real_quotes(self):
        path, reviews = self.populate()
        alterations = [lambda review: review.update(response_sha256="wrong"),
                       lambda review: review.update(reviewer=""),
                       lambda review: review["criteria"][0].update(evidence_quote="invented quote"),
                       lambda review: review["criteria"][0].update(evidence_quote=""),
                       lambda review: review["criteria"][0].update(passed="true"),
                       lambda review: review["criteria"][0].update(rationale=""),
                       lambda review: review["criteria"][0].update(id="unknown")]
        for index, alter in enumerate(alterations):
            changed = deepcopy(reviews)
            alter(changed[0])
            model_eval.write_json(path, {"reviews": changed})
            with self.subTest(index=index), self.assertRaises(ValueError):
                model_eval.summarize(self.output, path)


if __name__ == "__main__":
    unittest.main()
