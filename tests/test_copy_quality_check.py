"""Keeps the shared copy quality check identical in every copy-writing skill."""
from __future__ import annotations

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
REFERENCE = "references/copy-quality-check.md"
COPY_SKILLS = (
    "shopify-analytics",
    "shopify-creative-strategy",
    "shopify-email-marketing",
    "shopify-google-ads",
    "shopify-meta-ads",
    "shopify-product-listing",
    "shopify-product-page",
    "shopify-seo",
    "shopify-support",
    "shopify-va",
)


class CopyQualityCheckTests(unittest.TestCase):
    def test_copies_are_identical(self):
        texts = {name: (ROOT / "skills" / name / REFERENCE).read_text(encoding="utf-8") for name in COPY_SKILLS}
        canonical = texts["shopify-product-page"]
        for name, text in texts.items():
            with self.subTest(skill=name):
                self.assertEqual(text, canonical, f"{name} copy drifted; copy the shopify-product-page version")

    def test_entrypoint_runs_check_before_handoff(self):
        for name in COPY_SKILLS:
            with self.subTest(skill=name):
                entry = (ROOT / "skills" / name / "SKILL.md").read_text(encoding="utf-8")
                self.assertIn(f"Before handoff, run [{REFERENCE}]({REFERENCE})", entry)

    def test_all_fifteen_rules_present(self):
        text = (ROOT / "skills" / "shopify-product-page" / REFERENCE).read_text(encoding="utf-8")
        for number in range(1, 16):
            self.assertIn(f"\n{number}. **", text)
        for phrase in ("Em dashes", "Portability test", "What changed", "exact platform term"):
            self.assertIn(phrase, text)

    def test_reference_follows_its_own_em_dash_limit(self):
        text = (ROOT / "skills" / "shopify-product-page" / REFERENCE).read_text(encoding="utf-8")
        self.assertLessEqual(text.count("—"), 2)


if __name__ == "__main__":
    unittest.main()
