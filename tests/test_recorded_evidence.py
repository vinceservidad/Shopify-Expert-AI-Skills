"""Synthetic evidence-integrity regressions; no model calls or actual run reads."""
from copy import deepcopy
from pathlib import Path
import json
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import check_evaluation_evidence as checker
import model_evaluations as runner


class RecordedEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name) / "repository"
        self.results = self.root / "evals/results"
        self.output = self.results / "synthetic-run"
        case = {"id": "fixture", "skill": "shopify-store-audit", "request": "Review the fixture.",
                "evidence": {"synthetic": True}}
        rubric = {"id": "fixture", "criteria": [{"id": "truth", "weight": 100, "critical": True}]}
        runner.write_json(self.root / "evals/holdout/cases.json", {"cases": [case]})
        runner.write_json(self.root / "evals/holdout/rubric.json", {"rubrics": [rubric]})
        skill = self.root / "skills/shopify-store-audit"
        skill.mkdir(parents=True)
        (skill / "SKILL.md").write_text("# Fixture\nUse only supplied evidence.\n")
        with patch.object(runner.subprocess, "check_output", return_value="offline-fixture\n"):
            self.manifest = runner.freeze(self.root, self.output, repeats=1)
        self.prompts = runner.read_json(self.output / "prompts.json")

    def attempt(self, job, stream=None, exit_code=0, exception=None):
        stream = stream if stream is not None else (
            '{"type":"item.completed","item":{"type":"agent_message","text":"Fixture evidence only."}}\n'
            '{"type":"turn.completed","usage":{"input_tokens":5,"output_tokens":4}}')
        with patch.object(runner.subprocess, "run", side_effect=exception,
                          return_value=subprocess.CompletedProcess([], exit_code, stream, "fixture diagnostic")):
            runner.run_one(self.output, self.manifest, self.prompts, job, 1)
        return runner.read_json(self.output / "responses" / (job["id"] + ".json"))

    def report(self, passed=True):
        reviews = []
        for job in self.manifest["jobs"]:
            path = self.output / "responses" / (job["id"] + ".json")
            if path.exists():
                record = runner.read_json(path)
                if record["status"] == "completed":
                    reviews.append({"id": job["id"], "reviewer": "synthetic-test", "reviewed_at": "2026-09-06",
                                    "response_sha256": record["response_sha256"], "criteria": [
                                        {"id": "truth", "passed": passed, "evidence_quote": "Fixture evidence only.",
                                         "rationale": "Synthetic checker fixture; not behavioral evidence."}]})
        runner.write_json(self.output / "reviews.json", {"reviews": reviews})
        runner.write_json(self.output / "summary.json", runner.summarize(self.output, self.output / "reviews.json"))

    def test_completed_behavioral_failures_pass_integrity_without_becoming_successes(self):
        for job in self.manifest["jobs"]:
            self.attempt(job)
        self.report(passed=False)
        result = checker.check_all(self.results)[0]
        self.assertTrue(result["generation_complete"])
        self.assertEqual(result["invocations"]["completed"], 2)
        self.assertEqual(result["check"], "evidence_integrity_only")
        self.assertNotIn("arms", result)

    def test_missing_attempts_stay_visible_with_a_transparent_summary(self):
        self.report()
        result = checker.check(self.output)
        self.assertFalse(result["generation_complete"])
        self.assertEqual(result["planned"], 2)
        self.assertEqual(result["invocations"]["missing"], 2)

    def test_transport_failure_is_retained_and_accepted_as_invalid(self):
        self.attempt(self.manifest["jobs"][0], stream='{"type":"error"}', exit_code=1)
        self.report()
        self.assertEqual(checker.check(self.output)["invocations"],
                         {"completed": 0, "invalid": 1, "interrupted_or_running": 0, "missing": 1})

    def test_timeout_and_os_error_are_valid_failure_evidence(self):
        self.attempt(self.manifest["jobs"][0], exception=subprocess.TimeoutExpired(["fixture"], 1, output=b"partial"))
        self.attempt(self.manifest["jobs"][1], exception=FileNotFoundError())
        self.report()
        self.assertEqual(checker.check(self.output)["invocations"]["invalid"], 2)

    def test_malformed_events_are_retained_as_failure_data(self):
        self.attempt(self.manifest["jobs"][0], stream="retained malformed event output", exit_code=1)
        self.report()
        self.assertEqual(checker.check(self.output)["invocations"]["invalid"], 1)

    def test_interrupted_reservation_is_visible_and_cannot_replace_terminal_record(self):
        job = self.manifest["jobs"][0]
        path = self.output / "responses" / (job["id"] + ".json")
        runner.write_json(path, {"id": job["id"], "status": "interrupted_or_running", "started_at": "2026-09-06"})
        self.report()
        self.assertEqual(checker.check(self.output)["invocations"]["interrupted_or_running"], 1)
        data = runner.read_json(path)
        data["response"] = "Hidden terminal output"
        runner.write_json(path, data)
        with self.assertRaisesRegex(ValueError, "reservation shape"):
            checker.check(self.output)

    def test_deleted_summary_cannot_hide_an_additional_run(self):
        self.report()
        (self.results / "unreported-run").mkdir()
        with self.assertRaisesRegex(ValueError, "missing required evidence"):
            checker.check_all(self.results)

    def test_summary_tampering_and_boolean_numeric_substitution_are_rejected(self):
        self.report()
        path = self.output / "summary.json"
        original = runner.read_json(path)
        changed = deepcopy(original)
        changed["distinct_cases"] = True  # True == 1 must not pass an integrity comparison.
        runner.write_json(path, changed)
        with self.assertRaisesRegex(ValueError, "summary does not match"):
            checker.check(self.output)

    def test_unknown_status_and_downgraded_completion_are_rejected(self):
        job = self.manifest["jobs"][0]
        original = self.attempt(job)
        path = self.output / "responses" / (job["id"] + ".json")
        for status, problems in (("excluded", []), ("invalid", ["incomplete_invocation"])):
            changed = deepcopy(original)
            changed.update(status=status, problems=problems)
            runner.write_json(path, changed)
            self.report()
            with self.subTest(status=status), self.assertRaisesRegex(ValueError, "status"):
                checker.check(self.output)

    def test_every_completed_output_requires_review(self):
        self.report()
        self.attempt(self.manifest["jobs"][0])
        with self.assertRaisesRegex(ValueError, "Reviews must exactly cover"):
            checker.check(self.output)

    def test_duplicate_json_keys_and_unexpected_response_files_are_rejected(self):
        self.report()
        path = self.output / "summary.json"
        path.write_text('{"duplicate":1,"duplicate":2}')
        with self.assertRaisesRegex(ValueError, "Duplicate JSON key"):
            checker.check(self.output)
        self.report()
        (self.output / "responses").mkdir()
        (self.output / "responses/hidden-attempt.txt").write_text("Not an auditable response record")
        with self.assertRaisesRegex(ValueError, "Unexpected response artifact"):
            checker.check(self.output)

    def provenance_from_reviews(self):
        """Build a provenance record whose captured events replay to reviews.json exactly."""
        reviews = runner.read_json(self.output / "reviews.json")["reviews"]
        packets = []
        for review in reviews:
            payload = {"criteria": review["criteria"]}
            if "notes" in review:
                payload["notes"] = review["notes"]
            events = ('{"type":"item.completed","item":{"type":"agent_message","text":'
                      + json.dumps(json.dumps(payload)) + '}}\n'
                      '{"type":"turn.completed","usage":{"input_tokens":5,"output_tokens":4}}')
            packets.append({
                "id": review["id"], "case_id": "fixture", "rubric_id": "fixture",
                "response_sha256": review["response_sha256"], "packet_sha256": runner.digest("packet"),
                "judge_prompt_sha256": runner.digest("prompt"), "status": "completed",
                "accepted_attempt": 1, "review": review,
                "attempts": [{"attempt": 1, "started_at": review["reviewed_at"], "finished_at": review["reviewed_at"],
                              "duration_seconds": 0.0, "exit_code": 0, "problems": [], "failure_kind": None,
                              "validation_error": None, "status": "completed",
                              "events": events, "events_sha256": runner.digest(events),
                              "diagnostics": "", "diagnostics_sha256": runner.digest("")}]})
        return {"schema_version": 1, "kind": "judge_provenance", "created_at": "2026-09-06",
                "blinded_sha256": runner.digest("blind"), "requested_model": "gpt-5.5",
                "model_identity_evidence": "requested only", "reasoning_effort": "medium",
                "reviewer": "gpt-5.5 / automated judge; blinded model reviewer",
                "judge_system_sha256": runner.digest(runner.JUDGE_SYSTEM),
                "judge_runner_sha256": runner.digest("runner"), "isolation_config": runner.JUDGE_ISOLATION,
                "retries_allowed": 1, "packets": packets}

    def test_judge_provenance_is_validated_when_present(self):
        for job in self.manifest["jobs"]:
            self.attempt(job)
        self.report()
        runner.write_json(self.output / "reviews.provenance.json", self.provenance_from_reviews())
        self.assertEqual(checker.check(self.output)["generation_complete"], True)
        # Tampered raw events (hash not updated) are rejected.
        provenance = runner.read_json(self.output / "reviews.provenance.json")
        provenance["packets"][0]["attempts"][0]["events"] += " tampered"
        runner.write_json(self.output / "reviews.provenance.json", provenance)
        with self.assertRaisesRegex(ValueError, "evidence hash mismatch"):
            checker.check(self.output)

    def test_symlinked_and_orphan_response_evidence_is_rejected(self):
        job = self.manifest["jobs"][0]
        record = self.attempt(job)
        self.report()
        path = self.output / "responses/orphan.json"
        record["id"] = "orphan"
        runner.write_json(path, record)
        with self.assertRaisesRegex(ValueError, "Orphan response"):
            checker.check(self.output)
        path.unlink()
        path.symlink_to(self.output / "manifest.json")
        with self.assertRaisesRegex(ValueError, "Symlinked evidence"):
            checker.check(self.output)


if __name__ == "__main__":
    unittest.main()
