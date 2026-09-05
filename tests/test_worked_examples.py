"""Regression checks of authored synthetic examples, not AI performance scores."""
from copy import deepcopy
from decimal import Decimal
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from worked_examples import analytics, audit, catalog, check_examples, listing, money, percentage


def fixture(name):
    return json.loads((ROOT / 'skills' / name / 'assets' / 'worked-example' / 'input.json').read_text())


class WorkedExampleTests(unittest.TestCase):
    def test_all_authored_results_match(self):
        self.assertEqual(check_examples(), [])

    def test_money_rejects_ambiguous_values(self):
        for value in (None, '', True, 1.23, 'NaN', 'Infinity', '-1', '1.001'):
            with self.subTest(value=value), self.assertRaises(ValueError):
                money(value)

    def test_zero_denominator_is_unknown_not_zero(self):
        self.assertIsNone(percentage(Decimal('10'), Decimal('0')))

    def test_analytics_independent_totals_and_bridge(self):
        result = analytics(fixture('shopify-analytics'))
        current = result['periods']['current']
        self.assertEqual(current['net_sales'], '11000.00')
        self.assertEqual(current['contribution_after_media'], '1732.00')
        self.assertEqual(Decimal(result['bridge']['pre_media_change']) - Decimal(result['bridge']['additional_media_cost']), Decimal('-568.00'))

    def test_analytics_rankings_differ_by_definition(self):
        current = analytics(fixture('shopify-analytics'))['periods']['current']
        self.assertEqual(current['ranked_by_net_sales'][1]['product_id'], 'bottle')
        self.assertEqual(current['ranked_by_net_units'][1], 'tote')

    def test_attribution_cannot_change_ledger(self):
        data = fixture('shopify-analytics')
        data['attribution_views'][0]['reported_value'] = '999999.00'
        result = analytics(data)
        self.assertEqual(result['periods']['current']['net_sales'], '11000.00')
        self.assertTrue(all(not v['additive'] for v in result['attribution_views']))

    def test_missing_cost_not_assumed_zero(self):
        data = fixture('shopify-analytics')
        data['periods']['current']['products'][0]['cogs'] = None
        with self.assertRaises(ValueError): analytics(data)

    def test_duplicate_product_rejected(self):
        data = fixture('shopify-analytics')
        data['periods']['current']['products'].append(data['periods']['current']['products'][0])
        with self.assertRaises(ValueError): analytics(data)

    def test_unequal_periods_rejected(self):
        data = fixture('shopify-analytics'); data['periods']['current']['end'] = '2026-08-27'
        with self.assertRaises(ValueError): analytics(data)

    def test_overlapping_periods_rejected(self):
        data = fixture('shopify-analytics')
        data['periods']['current'].update(start='2026-08-10', end='2026-08-23')
        with self.assertRaises(ValueError): analytics(data)

    def test_mixed_population_rejected(self):
        data = fixture('shopify-analytics'); data['periods']['current']['products'].pop()
        with self.assertRaises(ValueError): analytics(data)

    def test_wrong_currency_rejected(self):
        data = fixture('shopify-analytics'); data['currency'] = 'USD'
        with self.assertRaises(ValueError): analytics(data)

    def test_negative_contribution_allowed(self):
        data = fixture('shopify-analytics'); data['periods']['current']['media_cost'] = '10000.00'
        self.assertEqual(analytics(data)['periods']['current']['contribution_after_media'], '-5268.00')

    def test_returns_are_deducted_once(self):
        data = fixture('shopify-analytics')
        data['periods']['current']['products'][0]['returns'] = '700.00'
        self.assertEqual(analytics(data)['periods']['current']['net_sales'], '10900.00')

    def test_listing_unknowns_are_not_fabricated(self):
        result = listing(fixture('shopify-product-listing'))
        self.assertIsNone(result['draft']['variants'][0]['weight_grams'])
        self.assertIsNone(result['draft']['variants'][0]['inventory_quantity'])
        self.assertEqual(result['external_state'], 'not_saved')
        self.assertEqual(result['draft']['proposed_channels'], [])

    def test_listing_excludes_unsupported_claims(self):
        result = listing(fixture('shopify-product-listing'))
        for claim in result['unsupported_claims_excluded']:
            self.assertNotIn(claim, result['draft']['description'])

    def test_listing_duplicate_handle_rejected(self):
        data = fixture('shopify-product-listing'); data['existing_handles'] = ['field-ceramic-mug']
        with self.assertRaises(ValueError): listing(data)

    def test_listing_duplicate_sku_rejected(self):
        data = fixture('shopify-product-listing'); data['existing_skus'] = ['FIELD-SAND-350']
        with self.assertRaises(ValueError): listing(data)

    def test_changed_facts_cannot_reuse_fixed_copy(self):
        data = fixture('shopify-product-listing'); data['approved_source']['capacity_ml'] = 500
        with self.assertRaises(ValueError): listing(data)

    def test_catalog_blocks_entire_batch_with_exceptions(self):
        result = catalog(fixture('shopify-catalog-operations'))
        self.assertEqual(len(result['candidate_changes']), 2)
        self.assertEqual(len(result['exceptions']), 2)
        self.assertFalse(result['batch_ready'])
        self.assertFalse(result['import_file_created'])

    def test_catalog_protected_fields_preserved(self):
        data = fixture('shopify-catalog-operations'); result = catalog(data)
        for before, after in zip(data['before'], result['simulated_candidate_rows']):
            for key in ('variant_id', 'product_id', 'handle', 'sku', 'option', 'inventory_quantity'):
                self.assertEqual(before[key], after[key])

    def test_catalog_blank_is_not_zero_or_keep(self):
        result = catalog(fixture('shopify-catalog-operations'))
        self.assertEqual(result['simulated_candidate_rows'][1]['price'], '26.00')
        self.assertEqual(result['exceptions'][0]['reason'], 'blank_invalid_or_ambiguous_value')

    def test_catalog_explicit_clear_is_not_omission(self):
        data = fixture('shopify-catalog-operations')
        result = catalog(data)
        self.assertIsNone(result['simulated_candidate_rows'][3]['compare_at_price'])
        self.assertEqual(result['simulated_candidate_rows'][0]['compare_at_price'], '30.00')

    def test_catalog_unknown_identifier(self):
        data = fixture('shopify-catalog-operations'); data['requested_changes'] = [{'variant_id':'999','set':{'price':'1.00'}}]
        self.assertEqual(catalog(data)['exceptions'][0]['reason'], 'unknown_identifier')

    def test_catalog_duplicate_identifier_rejected(self):
        data = fixture('shopify-catalog-operations'); data['requested_changes'].append(data['requested_changes'][0])
        with self.assertRaises(ValueError): catalog(data)

    def test_catalog_set_clear_conflict_rejected(self):
        data = fixture('shopify-catalog-operations')
        data['requested_changes'] = [{'variant_id':'104','set':{'compare_at_price':'12.00'},'clear':['compare_at_price']}]
        self.assertFalse(catalog(data)['batch_ready'])

    def test_catalog_rollback_reconstructs_original(self):
        data = fixture('shopify-catalog-operations'); result = catalog(data)
        restored = {row['variant_id']: deepcopy(row) for row in result['simulated_candidate_rows']}
        for operation in result['rollback_if_applied']:
            restored[operation['variant_id']][operation['field']] = operation['restore']
        self.assertEqual(list(restored.values()), data['before'])

    def test_audit_uses_weighted_rate(self):
        result = audit(fixture('shopify-store-audit'))
        self.assertEqual(result['conversion_rates_pct']['current']['overall'], '2.67')
        self.assertNotEqual(result['conversion_rates_pct']['current']['overall'], '3.25')

    def test_audit_missing_evidence_not_invented(self):
        data = fixture('shopify-store-audit'); data['findings'][0]['evidence_ids'] = ['made-up']
        with self.assertRaises(ValueError): audit(data)

    def test_audit_does_not_claim_causation_or_lift(self):
        result = audit(fixture('shopify-store-audit'))
        self.assertFalse(result['causal_claim'])
        self.assertTrue(all(row['estimated_lift'] is None for row in result['issues']))

    def test_audit_invalid_denominator(self):
        data = fixture('shopify-store-audit'); data['funnel']['current'][0]['sessions_with_purchase'] = 1001
        with self.assertRaises(ValueError): audit(data)

    def test_runner_refuses_production_inputs(self):
        for name, function in [('shopify-analytics', analytics), ('shopify-store-audit', audit),
                               ('shopify-product-listing', listing), ('shopify-catalog-operations', catalog)]:
            data = fixture(name); data['synthetic'] = False
            with self.subTest(name=name), self.assertRaises(ValueError): function(data)

    def test_functions_do_not_mutate_inputs(self):
        for name, function in [('shopify-analytics', analytics), ('shopify-store-audit', audit),
                               ('shopify-product-listing', listing), ('shopify-catalog-operations', catalog)]:
            data = fixture(name); before = deepcopy(data); function(data)
            with self.subTest(name=name): self.assertEqual(data, before)

    def test_missing_fixture_is_failure(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(len(check_examples(Path(tmp))), 4)


if __name__ == '__main__':
    unittest.main()
