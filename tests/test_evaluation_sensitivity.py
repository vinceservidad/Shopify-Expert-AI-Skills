"""Synthetic checks of hypothetical sensitivity; no model grading or invocation."""
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
from check_evaluation_evidence import check
from evaluation_sensitivity import sensitivity


class SensitivityIntegrityTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name) / "synthetic-repository"
        skill = self.root / "skills/shopify-store-audit"
        (skill / "references").mkdir(parents=True)
        (skill / "SKILL.md").write_text("Use supplied evidence. Keep changes proposed.\n")
        case = {"id": "synthetic-case", "skill": "shopify-store-audit",
                "request": "Review this supplied scenario.", "evidence": {"synthetic": True}}
        rubric = {"id": case["id"], "criteria": [
            {"id": "critical", "weight": 60, "critical": True, "description": "Synthetic gate."},
            {"id": "ordinary", "weight": 40, "critical": False, "description": "Synthetic detail."},
        ]}
        model_eval.write_json(self.root / "evals/holdout/cases.json", {"cases": [case]})
        model_eval.write_json(self.root / "evals/holdout/rubric.json", {"rubrics": [rubric]})
        self.output = Path(self.temporary.name) / "synthetic-experiment"
        with patch.object(model_eval.subprocess, "check_output", return_value="fixture-version\n"):
            self.manifest = model_eval.freeze(self.root, self.output, repeats=1)
        prompts = model_eval.read_json(self.output / "prompts.json")
        response = "Supplied evidence supports a proposed review. No external action occurred."
        events = "\n".join(json.dumps(event) for event in [
            {"type": "item.completed", "item": {"type": "agent_message", "text": response}},
            {"type": "turn.completed", "usage": {"input_tokens": 5, "output_tokens": 5}},
        ])
        self.target = next(job for job in self.manifest["jobs"] if job["arm"] == "without_skill")
        primary = []
        for job in self.manifest["jobs"]:
            completed = subprocess.CompletedProcess([], 0, events, "")
            with patch.object(model_eval.subprocess, "run", return_value=completed):
                model_eval.run_one(self.output, self.manifest, prompts, job, timeout=1)
            primary.append({
                "id": job["id"], "reviewer": "Synthetic fixture reviewer", "reviewed_at": "2026-09-06",
                "response_sha256": model_eval.digest(response),
                "criteria": [
                    {"id": "critical", "passed": job["id"] != self.target["id"],
                     "evidence_quote": "No external action occurred.", "rationale": "Synthetic judgment."},
                    {"id": "ordinary", "passed": True,
                     "evidence_quote": "Supplied evidence", "rationale": "Synthetic judgment."},
                ],
            })
        model_eval.write_json(self.output / "reviews.json", {"reviews": primary})
        self.baseline = model_eval.summarize(self.output, self.output / "reviews.json")
        model_eval.write_json(self.output / "summary.json", self.baseline)
        self.audit = {"reviews": [{
            "id": self.target["id"], "reviewer": "Synthetic secondary reviewer",
            "reviewed_at": "2026-09-06", "response_sha256": model_eval.digest(response),
            "criteria": [{"id": "critical", "decision": "ambiguous", "recommended_passed": None,
                          "evidence_quote": "No external action occurred.",
                          "rationale": "Synthetic ambiguity for tooling verification only."}],
        }]}
        self.save_audit()

    def save_audit(self):
        model_eval.write_json(self.output / "adjudication.json", self.audit)

    def snapshots(self):
        return {path.relative_to(self.output): path.read_bytes()
                for path in self.output.rglob("*") if path.is_file()}

    def test_hypothetical_sensitivity_is_deterministic_and_preserves_primary_files(self):
        before = self.snapshots()
        first = sensitivity(self.output)
        second = sensitivity(self.output)
        self.assertEqual(first, second)
        self.assertEqual(self.snapshots(), before)
        self.assertEqual(first["kind"], "hypothetical_sensitivity_not_regraded_results")
        self.assertEqual(first["primary_arms"], self.baseline["arms"])
        self.assertEqual(first["primary_arms"]["without_skill"]["passes"], 0)
        self.assertEqual(first["all_ambiguous_pass_arms"]["without_skill"]["passes"], 1)
        self.assertEqual(first["ambiguous_criteria"],
                         [{"response_id": self.target["id"], "criterion_id": "critical"}])
        self.assertEqual(model_eval.summarize(self.output, self.output / "reviews.json"), self.baseline)

    def test_uphold_leaves_hypothetical_metrics_equal_to_primary(self):
        criterion = self.audit["reviews"][0]["criteria"][0]
        criterion.update(decision="uphold", recommended_passed=False)
        self.save_audit()
        report = sensitivity(self.output)
        self.assertEqual(report["ambiguous_criteria"], [])
        self.assertEqual(report["primary_arms"], report["all_ambiguous_pass_arms"])
        self.assertEqual(report["primary_case_scores"], report["all_ambiguous_pass_case_scores"])

    def test_secondary_hash_and_unknown_response_or_criterion_are_rejected(self):
        original = deepcopy(self.audit)
        alterations = [
            lambda review: review.update(response_sha256="incorrect"),
            lambda review: review.update(id="unknown-response"),
            lambda review: review["criteria"][0].update(id="unknown-criterion"),
        ]
        for index, alter in enumerate(alterations):
            self.audit = deepcopy(original)
            alter(self.audit["reviews"][0])
            self.save_audit()
            with self.subTest(index=index), self.assertRaises(ValueError):
                sensitivity(self.output)

    def test_duplicate_secondary_criterion_is_rejected(self):
        review = self.audit["reviews"][0]
        review["criteria"].append(deepcopy(review["criteria"][0]))
        self.save_audit()
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            sensitivity(self.output)

    def test_duplicate_secondary_review_ids_are_rejected_even_with_disjoint_criteria(self):
        # Make both source criteria failed so only duplicated review identity is at issue.
        primary = model_eval.read_json(self.output / "reviews.json")
        target = next(review for review in primary["reviews"] if review["id"] == self.target["id"])
        target["criteria"][1]["passed"] = False
        model_eval.write_json(self.output / "reviews.json", primary)
        other = deepcopy(self.audit["reviews"][0])
        other["criteria"][0]["id"] = "ordinary"
        self.audit["reviews"].append(other)
        self.save_audit()
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            sensitivity(self.output)

    def test_unsubstantiated_or_decisive_secondary_changes_are_rejected(self):
        original = deepcopy(self.audit)
        alterations = [
            {"evidence_quote": ""},
            {"decision": "uphold", "recommended_passed": False, "evidence_quote": ""},
            {"evidence_quote": "invented quotation"},
            {"rationale": ""},
            {"decision": "overturn", "recommended_passed": True},
            {"decision": "ambiguous", "recommended_passed": True},
            {"decision": "uphold", "recommended_passed": True},
            {"decision": "uphold", "recommended_passed": 0},
        ]
        for change in alterations:
            self.audit = deepcopy(original)
            self.audit["reviews"][0]["criteria"][0].update(change)
            self.save_audit()
            with self.subTest(change=change), self.assertRaises(ValueError):
                sensitivity(self.output)

    def test_targeted_audit_cannot_change_an_originally_passed_criterion(self):
        self.audit["reviews"][0]["criteria"][0]["id"] = "ordinary"
        self.save_audit()
        with self.assertRaisesRegex(ValueError, "original failed"):
            sensitivity(self.output)

    def test_optional_evidence_check_recalculates_report_without_regrading(self):
        model_eval.write_json(self.output / "sensitivity.json", sensitivity(self.output))
        before = self.snapshots()
        report = check(self.output)
        self.assertEqual(report["check"], "evidence_integrity_only")
        self.assertTrue(report["generation_complete"])
        self.assertEqual(self.snapshots(), before)
        changed = model_eval.read_json(self.output / "sensitivity.json")
        changed["primary_arms"]["without_skill"]["passes"] = 1
        model_eval.write_json(self.output / "sensitivity.json", changed)
        with self.assertRaisesRegex(ValueError, "Sensitivity report"):
            check(self.output)

    def test_optional_secondary_evidence_requires_both_artifacts(self):
        # This fixture has the adjudication but deliberately no sensitivity report yet.
        with self.assertRaises((ValueError, OSError)):
            check(self.output)
        model_eval.write_json(self.output / "sensitivity.json", sensitivity(self.output))
        (self.output / "adjudication.json").unlink()
        with self.assertRaises((ValueError, OSError)):
            check(self.output)


if __name__ == "__main__":
    unittest.main()
