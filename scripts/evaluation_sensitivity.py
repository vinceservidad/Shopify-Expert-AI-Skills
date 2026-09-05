#!/usr/bin/env python3
"""Hypothetical sensitivity to secondary-review ambiguities, not changed grades."""
from copy import deepcopy
from pathlib import Path
import tempfile

from model_evaluations import read_json, records, summarize, verify_frozen, write_json


def sensitivity(directory: Path):
    manifest, _ = verify_frozen(directory)
    response_records = records(directory, manifest)
    primary = read_json(directory / "reviews.json")
    audit = read_json(directory / "adjudication.json")
    grades = {r["id"]: r for r in primary["reviews"]}
    hypothetical = deepcopy(primary)
    changes = {r["id"]: r for r in hypothetical["reviews"]}
    seen, review_ids, ambiguous = set(), set(), []
    for review in audit["reviews"]:
        if review["id"] in review_ids or review["id"] not in response_records or review["id"] not in grades:
            raise ValueError("Duplicate or unknown secondary response")
        review_ids.add(review["id"])
        record = response_records[review["id"]]
        if review["response_sha256"] != record["response_sha256"]:
            raise ValueError("Secondary review response hash mismatch")
        originals = {c["id"]: c for c in grades[review["id"]]["criteria"]}
        for criterion in review["criteria"]:
            key = (review["id"], criterion["id"])
            if key in seen or criterion["id"] not in originals:
                raise ValueError("Duplicate or unknown secondary criterion")
            seen.add(key)
            if originals[criterion["id"]]["passed"]:
                raise ValueError("This targeted audit must refer to original failed criteria")
            if not criterion["evidence_quote"] or criterion["evidence_quote"] not in record["response"] or not criterion["rationale"]:
                raise ValueError("Secondary evidence quote or rationale missing")
            if criterion["decision"] == "ambiguous" and criterion["recommended_passed"] is None:
                ambiguous.append({"response_id": review["id"], "criterion_id": criterion["id"]})
                for mark in changes[review["id"]]["criteria"]:
                    if mark["id"] == criterion["id"]:
                        mark.update(passed=True, evidence_quote=criterion["evidence_quote"],
                                    rationale="Hypothetical favorable interpretation for sensitivity only; original judgment unchanged.")
            elif criterion["decision"] != "uphold" or criterion["recommended_passed"] is not False:
                raise ValueError("A definitive grade change needs separately reviewed adjudication policy")
    baseline = summarize(directory, directory / "reviews.json")
    with tempfile.TemporaryDirectory(prefix="evaluation-sensitivity-") as temporary:
        path = Path(temporary) / "hypothetical.json"
        write_json(path, hypothetical)
        alternative = summarize(directory, path)
    return {"kind": "hypothetical_sensitivity_not_regraded_results",
            "scope": "All secondary-marked ambiguities changed to pass together; original primary grades remain unchanged. This does not audit all potential grading errors.",
            "ambiguous_criteria": ambiguous, "primary_arms": baseline["arms"],
            "all_ambiguous_pass_arms": alternative["arms"],
            "primary_case_scores": baseline["case_paired_scores"],
            "all_ambiguous_pass_case_scores": alternative["case_paired_scores"]}


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()
    write_json(args.directory / "sensitivity.json", sensitivity(args.directory))
