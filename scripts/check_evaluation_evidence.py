#!/usr/bin/env python3
"""Offline integrity audit of every recorded experiment; never invokes a model.

Each immediate directory in evals/results is a recorded experiment and must keep
its frozen plan, reviews and recomputable summary, including failed/partial runs.
Integrity success is not a completion claim or a model-performance pass. Missing,
interrupted and invalid invocations stay visible in the frozen planned denominator.
The checker cannot detect a whole directory removed from Git history; reviewers
must inspect deletions rather than treating these self-contained hashes as proof
against intentional replacement of all evidence.
"""
import builtins
from collections import Counter
from pathlib import Path
import json
import sys

from model_evaluations import parse_codex, records, summarize, verify_frozen

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = ("manifest.json", "manifest.sha256", "prompts.json", "reviews.json", "summary.json")
STATUSES = ("completed", "invalid", "interrupted_or_running", "missing")


def read_strict(path: Path):
    """Reject ambiguous JSON before the frozen runner reads the same evidence."""
    def unique_object(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError(f"Duplicate JSON key in {path.name}: {key}")
            result[key] = value
        return result

    def invalid_constant(value):
        raise ValueError(f"Non-finite JSON number in {path.name}: {value}")

    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=unique_object,
                      parse_constant=invalid_constant)


def validate_status(record):
    """Do not let an arbitrary status bypass the runner's completion checks."""
    status = record.get("status")
    if status not in STATUSES[:-1]:
        raise ValueError(f"Unknown recorded invocation status: {status}")
    if status == "interrupted_or_running":
        if set(record) != {"id", "status", "started_at"} or not record["started_at"]:
            raise ValueError("Interrupted reservation must retain the runner's reservation shape")
        return
    required = {"id", "started_at", "finished_at", "duration_seconds", "exit_code", "status",
                "problems", "response", "response_sha256", "usage", "events", "events_sha256",
                "diagnostics", "diagnostics_sha256", "prompt_sha256"}
    if not required <= record.keys():
        raise ValueError("Terminal invocation is missing runner evidence or diagnostics")
    problems = record["problems"]
    if not isinstance(problems, list) or any(not isinstance(p, str) or not p for p in problems):
        raise ValueError("Invocation problems must be a list of nonempty strings")
    if status == "completed":
        if problems:
            raise ValueError("Completed invocation cannot contain recorded problems")
        return  # records() already replays completed events and validates hashes.
    if not problems:
        raise ValueError("Invalid invocation requires retained failure diagnostics")
    if problems == ["timeout"]:
        if record["exit_code"] is not None or record["response"] != "":
            raise ValueError("Timeout status contradicts the runner's timeout record")
        return
    exception = getattr(builtins, problems[0], None) if len(problems) == 1 else None
    if isinstance(exception, type) and issubclass(exception, (OSError, ValueError)):
        if record["exit_code"] is not None or record["response"] != "":
            raise ValueError("Infrastructure exception is missing its runner evidence")
        return
    try:
        response, _, replayed_problems = parse_codex(record["events"], record["exit_code"])
    except ValueError:
        if problems != ["malformed_event_stream"] or record["response"] != "":
            raise ValueError("Malformed invocation does not match its recorded failure") from None
        return
    if not replayed_problems or problems != replayed_problems or record["response"] != response:
        raise ValueError("Invalid status contradicts invocation events")


def check(directory: Path):
    if directory.is_symlink() or not directory.is_dir():
        raise ValueError("Recorded experiment must be a real directory")
    missing = [name for name in REQUIRED_FILES if not (directory / name).is_file()]
    if missing:
        raise ValueError(f"{directory.name}: missing required evidence: {', '.join(missing)}")
    for path in directory.rglob("*"):
        if path.is_symlink():
            raise ValueError(f"Symlinked evidence is not self-contained: {path.name}")
    for name in REQUIRED_FILES:
        if name.endswith(".json"):
            read_strict(directory / name)
    response_directory = directory / "responses"
    if response_directory.exists():
        if not response_directory.is_dir():
            raise ValueError("Responses must be a directory")
        for path in response_directory.iterdir():
            if not path.is_file() or path.suffix != ".json":
                raise ValueError(f"Unexpected response artifact: {path.name}")
            validate_status(read_strict(path))
    manifest, _ = verify_frozen(directory)
    if type(manifest["repeats"]) is not int or manifest["repeats"] < 1:
        raise ValueError("Frozen repeat count must be a positive integer")
    response_records = records(directory, manifest)
    expected = summarize(directory, directory / "reviews.json")
    actual = read_strict(directory / "summary.json")
    # Type-sensitive equality also rejects true substituted for 1 or false for 0.
    if json.dumps(actual, sort_keys=True, allow_nan=False) != json.dumps(expected, sort_keys=True, allow_nan=False):
        raise ValueError("Published summary does not match actual responses and reviews")
    if (directory / "adjudication.json").exists() or (directory / "sensitivity.json").exists():
        from evaluation_sensitivity import sensitivity
        read_strict(directory / "adjudication.json")
        recorded_sensitivity = read_strict(directory / "sensitivity.json")
        if json.dumps(recorded_sensitivity, sort_keys=True) != json.dumps(sensitivity(directory), sort_keys=True):
            raise ValueError("Sensitivity report does not match preserved primary and secondary evidence")
    counts = Counter(record["status"] for record in response_records.values())
    counts["missing"] = len(manifest["jobs"]) - len(response_records)
    return {"run": directory.name, "distinct_cases": len(manifest["cases"]),
            "planned": len(manifest["jobs"]), "invocations": {status: counts[status] for status in STATUSES},
            "generation_complete": counts["completed"] == len(manifest["jobs"]),
            "check": "evidence_integrity_only"}


def check_all(results: Path):
    """Discover runs independently of summary presence so omission cannot hide one."""
    if results.is_symlink() or not results.is_dir():
        raise ValueError("Recorded evaluation directory is missing or symlinked")
    runs = []
    for path in sorted(results.iterdir()):
        if path.is_symlink():
            raise ValueError(f"Symlinked result artifact: {path.name}")
        if path.is_dir():
            runs.append(path)
        elif path.suffix != ".md" and path.name != ".gitkeep":
            raise ValueError(f"Results must be grouped into experiment directories: {path.name}")
    if not runs:
        raise ValueError("No recorded evaluation experiment to verify")
    return [check(directory) for directory in runs]


if __name__ == "__main__":
    try:
        for report in check_all(ROOT / "evals/results"):
            print(json.dumps(report))
    except (OSError, ValueError, KeyError, TypeError, ZeroDivisionError) as error:
        print(f"Recorded evidence check failed: {error}", file=sys.stderr)
        raise SystemExit(1) from None
