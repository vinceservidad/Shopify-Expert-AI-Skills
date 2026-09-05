"""Offline reference calculations for synthetic examples, not an AI evaluator or store tool.

These small, deliberately bounded functions implement the fixture contracts. They
never connect to Shopify, create an import file, or mutate their inputs. Expected
results are checked in separately so changing a calculation cannot bless itself.
"""
from __future__ import annotations

import argparse
from copy import deepcopy
from datetime import date
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ZERO = Decimal('0')
MONEY_FIELDS = ('gross_sales', 'discounts', 'returns', 'cogs', 'payment_fees', 'fulfillment', 'shipping_subsidy')


def money(value: object) -> Decimal:
    if not isinstance(value, str):
        raise ValueError('Money must be an explicit decimal string, not a float or null')
    try:
        number = Decimal(value)
    except InvalidOperation as exc:
        raise ValueError('Invalid money value') from exc
    try:
        valid = number.is_finite() and number >= 0 and number == number.quantize(Decimal('.01'))
    except InvalidOperation:
        valid = False
    if not valid:
        raise ValueError('Money must be finite, nonnegative, and use at most two decimal places')
    return number


def fmt(value: Decimal) -> str:
    return str(value.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))


def percentage(numerator: Decimal, denominator: Decimal) -> str | None:
    return fmt(100 * numerator / denominator) if denominator else None


def unique(records: list[dict], field: str) -> dict[str, dict]:
    result = {}
    for record in records:
        identifier = record.get(field)
        if not isinstance(identifier, str) or not identifier or identifier in result:
            raise ValueError(f'Missing or duplicate {field}')
        result[identifier] = record
    return result


def fixture_contract(data: dict) -> None:
    if data.get('synthetic') is not True or data.get('authorization') not in ('read-only', 'draft-only'):
        raise ValueError('This runner accepts explicitly synthetic, non-production fixtures only')


def analytics(data: dict) -> dict:
    fixture_contract(data)
    if data.get('currency') != 'GBP' or data.get('timezone') != 'Europe/London':
        raise ValueError('This example requires its named currency and timezone')
    periods = data['periods']
    if set(periods) != {'previous', 'current'}:
        raise ValueError('Both comparison periods are required')
    results, lengths, product_sets = {}, [], []
    for label in ('previous', 'current'):
        period = periods[label]
        start, end = date.fromisoformat(period['start']), date.fromisoformat(period['end'])
        if end < start:
            raise ValueError('Invalid period')
        lengths.append((end - start).days + 1)
        products = unique(period['products'], 'product_id')
        product_sets.append(set(products))
        if not products:
            raise ValueError('Missing product population')
        totals = {key: ZERO for key in MONEY_FIELDS}
        rankings = []
        for identifier, row in products.items():
            values = {key: money(row[key]) for key in MONEY_FIELDS}
            if any(type(row[key]) is not int or row[key] < 0 for key in ('units_sold', 'units_returned')):
                raise ValueError('Unit counts must be nonnegative integers')
            for key, value in values.items():
                totals[key] += value
            net = values['gross_sales'] - values['discounts'] - values['returns']
            rankings.append({'product_id': identifier, 'net_sales': fmt(net),
                             'net_units': row['units_sold'] - row['units_returned']})
        net = totals['gross_sales'] - totals['discounts'] - totals['returns']
        pre_media = net - sum((totals[key] for key in ('cogs', 'payment_fees', 'fulfillment', 'shipping_subsidy')), ZERO)
        media = money(period['media_cost'])
        results[label] = {
            'net_sales': fmt(net), 'pre_media_contribution': fmt(pre_media),
            'media_cost': fmt(media), 'contribution_after_media': fmt(pre_media - media),
            'ranked_by_net_sales': sorted(rankings, key=lambda row: (-Decimal(row['net_sales']), row['product_id'])),
            'ranked_by_net_units': [r['product_id'] for r in sorted(rankings, key=lambda r: (-r['net_units'], r['product_id']))],
        }
    if lengths[0] != lengths[1] or product_sets[0] != product_sets[1]:
        raise ValueError('Periods and product populations must be comparable')
    if date.fromisoformat(periods['previous']['end']) >= date.fromisoformat(periods['current']['start']):
        raise ValueError('Comparison periods must not overlap')
    previous, current = results['previous'], results['current']
    revenue_change = Decimal(current['net_sales']) - Decimal(previous['net_sales'])
    profit_change = Decimal(current['contribution_after_media']) - Decimal(previous['contribution_after_media'])
    channel_views = []
    for row in data['attribution_views']:
        # Report the source under its own settings. Never add these values to ledger sales.
        value = money(row['reported_value'])
        channel_views.append({'source': row['source'], 'reported_value': fmt(value), 'additive': False,
                              'definition': row['definition']})
    return {'periods': results, 'net_sales_change_pct': percentage(revenue_change, Decimal(previous['net_sales'])),
            'contribution_change': fmt(profit_change),
            'contribution_change_pct': percentage(profit_change, Decimal(previous['contribution_after_media'])),
            'bridge': {'pre_media_change': fmt(Decimal(current['pre_media_contribution']) - Decimal(previous['pre_media_contribution'])),
                       'additional_media_cost': fmt(Decimal(current['media_cost']) - Decimal(previous['media_cost']))},
            'attribution_views': channel_views, 'causal_claim': False, 'external_state': 'unchanged'}


def listing(data: dict) -> dict:
    fixture_contract(data)
    source = data['approved_source']
    variants = list(unique(source['variants'], 'sku').values())
    colors = [v['color'] for v in variants]
    if len(set(colors)) != len(colors) or len(colors) != 2:
        raise ValueError('This bounded fixture expects two unique color variants')
    if source['handle'] in data['existing_handles'] or any(v['sku'] in data['existing_skus'] for v in variants):
        raise ValueError('Duplicate product handle or SKU requires review')
    if source['capacity_ml'] != 350 or source['material'] != 'ceramic' or source['finish'] != 'matte':
        raise ValueError('Update and review the worked copy before changing product facts')
    mapped = []
    for v in variants:
        mapped.append({'sku': v['sku'], 'color': v['color'], 'price': fmt(money(v['price'])),
                       'barcode': v.get('barcode'), 'weight_grams': v.get('weight_grams'),
                       'inventory_quantity': v.get('inventory_quantity')})
    unknowns = [field for field in ('product_category',) if source.get(field) is None]
    for field in ('barcode', 'weight_grams', 'inventory_quantity'):
        if any(v[field] is None for v in mapped):
            unknowns.append(field)
    return {'draft': {'title': source['title'], 'handle': source['handle'], 'vendor': source['vendor'],
                      'description': f'A 350 ml ceramic mug with a matte finish. Choose {colors[0]} or {colors[1]}.',
                      'proposed_status': 'draft', 'proposed_channels': [], 'variants': mapped},
            'sources': {'title': 'approved_source.title', 'description': ['approved_source.capacity_ml',
                        'approved_source.material', 'approved_source.finish', 'approved_source.variants'],
                        'prices': 'approved_source.variants'},
            'unknown_fields': unknowns,
            'publication_blockers': sorted(set(unknowns) & set(data['store_policy']['required_before_publication'])),
            'unsupported_claims_excluded': data['unverified_requested_claims'],
            'external_state': 'not_saved', 'authorization': 'draft-only'}


def catalog(data: dict) -> dict:
    fixture_contract(data)
    before = unique(data['before'], 'variant_id')
    requests = unique(data['requested_changes'], 'variant_id')
    allowed = set(data['scope']['allowed_fields'])
    if not allowed <= {'price', 'compare_at_price'}:
        raise ValueError('This example only permits scoped pricing fields')
    candidates, exceptions, rollback = [], [], []
    simulated = deepcopy(before)
    for identifier, request in requests.items():
        if identifier not in before:
            exceptions.append({'variant_id': identifier, 'reason': 'unknown_identifier'})
            continue
        sets, clears = request.get('set', {}), request.get('clear', [])
        if not isinstance(sets, dict) or not isinstance(clears, list) or not all(isinstance(v, str) for v in clears):
            raise ValueError('Invalid operation schema')
        fields = set(sets) | set(clears)
        if not fields <= allowed or set(sets) & set(clears) or len(clears) != len(set(clears)):
            exceptions.append({'variant_id': identifier, 'reason': 'out_of_scope_or_conflicting_operation'})
            continue
        after = deepcopy(before[identifier])
        try:
            for field, value in sets.items():
                after[field] = fmt(money(value))
            for field in clears:
                if field != 'compare_at_price':
                    raise ValueError('Required price cannot be cleared')
                after[field] = None
            if after.get('compare_at_price') is not None and money(after['compare_at_price']) <= money(after['price']):
                raise ValueError('Non-discount compare-at price needs review in this example')
        except ValueError:
            exceptions.append({'variant_id': identifier, 'reason': 'blank_invalid_or_ambiguous_value'})
            continue
        for field in sorted(fields):
            old, new = before[identifier][field], after[field]
            if old != new:
                candidates.append({'variant_id': identifier, 'field': field, 'before': old, 'after': new})
                rollback.append({'variant_id': identifier, 'field': field, 'restore': old})
        simulated[identifier] = after
    return {'candidate_changes': candidates, 'exceptions': exceptions, 'rollback_if_applied': rollback,
            'simulated_candidate_rows': list(simulated.values()), 'record_count': len(before),
            'batch_ready': not exceptions, 'external_state': 'unchanged', 'import_file_created': False}


def audit(data: dict) -> dict:
    fixture_contract(data)
    evidence = unique(data['evidence'], 'id')
    rates, totals = {}, {}
    for period in ('previous', 'current'):
        rows = unique(data['funnel'][period], 'device')
        total_sessions = total_converted = 0
        for row in rows.values():
            sessions, converted = row['sessions'], row['sessions_with_purchase']
            if type(sessions) is not int or type(converted) is not int or not 0 <= converted <= sessions:
                raise ValueError('Invalid session-based conversion denominator')
            total_sessions += sessions
            total_converted += converted
        totals[period] = (total_sessions, total_converted)
        rates[period] = {device: percentage(Decimal(r['sessions_with_purchase']), Decimal(r['sessions'])) for device, r in rows.items()}
        rates[period]['overall'] = percentage(Decimal(total_converted), Decimal(total_sessions))
    issues = []
    for finding in data['findings']:
        if not finding['evidence_ids'] or any(key not in evidence for key in finding['evidence_ids']):
            raise ValueError('Every finding must cite supplied evidence')
        if finding['kind'] == 'purchase_control_obstructed':
            priority, action = 1, 'Prepare a scoped overlay correction; verify keyboard and mobile purchase controls before approval.'
        elif finding['kind'] == 'conflicting_delivery_copy':
            priority, action = 2, 'Ask the policy owner to resolve the conflict before changing either promise.'
        else:
            raise ValueError('Unknown finding class needs editorial review')
        issues.append({'id': finding['id'], 'priority': priority, 'evidence_ids': finding['evidence_ids'],
                       'observation': finding['observation'], 'recommended_action': action,
                       'estimated_lift': None})
    prev_sessions, prev_converted = totals['previous']
    cur_sessions, cur_converted = totals['current']
    change = (fmt(100 * (Decimal(cur_converted) / cur_sessions - Decimal(prev_converted) / prev_sessions))
              if cur_sessions and prev_sessions else None)
    return {'coverage': 'limited_to_supplied_synthetic_evidence', 'conversion_rates_pct': rates,
            'overall_change_percentage_points': change, 'issues': sorted(issues, key=lambda r: (r['priority'], r['id'])),
            'unknowns': data['missing_evidence'], 'causal_claim': False, 'external_state': 'unchanged'}


EXAMPLES = {'shopify-analytics': analytics, 'shopify-product-listing': listing,
            'shopify-catalog-operations': catalog, 'shopify-store-audit': audit}


def check_examples(root: Path = ROOT) -> list[str]:
    errors = []
    for name, function in EXAMPLES.items():
        folder = root / 'skills' / name / 'assets' / 'worked-example'
        try:
            data = json.loads((folder / 'input.json').read_text(encoding='utf-8'))
            expected = json.loads((folder / 'expected.json').read_text(encoding='utf-8'))
            result = function(data)
            if result != expected:
                errors.append(f'{name}: calculated output differs from reviewed expected.json')
        except (KeyError, OSError, TypeError, ValueError) as exc:
            errors.append(f'{name}: {exc}')
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    errors = check_examples(args.root)
    for error in errors:
        print('FAIL:', error)
    if not errors:
        print('Four synthetic data examples match their checked-in results. No model evaluation was run.')
    return int(bool(errors))


if __name__ == '__main__':
    raise SystemExit(main())
