"""Regression checks for the actual Liquid fixture and fail-closed adapters."""
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'skills/shopify-theme-development/assets/worked-example'


class Elements(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.elements = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def one(self, tag, **matching):
        matches = [attrs for name, attrs in self.elements
                   if name == tag and all(attrs.get(key) == value for key, value in matching.items())]
        if len(matches) != 1:
            raise AssertionError(f'Expected one {tag} matching {matching}, found {len(matches)}')
        return matches[0]


class LiquidRendererTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.temp = Path(self.directory.name)
        self.theme = self.temp / 'theme'
        shutil.copytree(ASSETS / 'theme', self.theme)
        self.data = json.loads((ASSETS / 'input.json').read_text())

    def render(self, *args, success=True):
        input_path = self.temp / 'input.json'
        input_path.write_text(json.dumps(self.data))
        result = subprocess.run(
            ['bundle', 'exec', 'ruby', str(ROOT / 'scripts/render_theme_fixture.rb'),
             '--theme', str(self.theme), '--input', str(input_path), *args],
            cwd=ROOT, env={**os.environ, 'BUNDLE_GEMFILE': str(ROOT / 'Gemfile.theme')},
            text=True, capture_output=True, timeout=30)
        if success:
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertNotIn('Liquid error', result.stdout)
            return result.stdout
        self.assertNotEqual(result.returncode, 0, 'Renderer unexpectedly accepted an invalid fixture')
        self.assertEqual(result.stdout, '', 'Failed rendering must not emit a partial success document')
        return result.stderr

    def mutate(self, relative, before, after):
        target = self.theme / relative
        source = target.read_text()
        self.assertIn(before, source)
        target.write_text(source.replace(before, after))

    def test_default_variant_is_available_with_selected_id_and_price(self):
        source = self.render()
        elements = Elements(source)
        self.assertEqual(elements.one('input', name='id')['value'], '101')
        self.assertNotIn('disabled', elements.one('button', name='add'))
        self.assertIn('<p data-current-price>£24.00</p>', source)

    def test_selected_variant_deep_link_is_rendered_from_actual_liquid(self):
        source = self.render('--variant', '102')
        elements = Elements(source)
        self.assertEqual(elements.one('input', name='id')['value'], '102')
        self.assertEqual(elements.one('a', **{'data-variant-id': '102'})['aria-current'], 'true')
        self.assertIn('<p data-current-price>£26.00</p>', source)

    def test_sold_out_selection_keeps_id_but_disables_purchase(self):
        elements = Elements(self.render('--variant', '103'))
        self.assertEqual(elements.one('input', name='id')['value'], '103')
        self.assertIn('disabled', elements.one('button', name='add'))

    def test_all_unavailable_variants_render_first_as_disabled_default(self):
        for variant in self.data['variants']:
            variant['available'] = False
        elements = Elements(self.render())
        self.assertEqual(elements.one('skills-variant-picker')['data-default-variant'], '101')
        self.assertIn('disabled', elements.one('button', name='add'))

    def test_unavailable_first_variant_does_not_override_available_default(self):
        self.data['variants'][0]['available'] = False
        elements = Elements(self.render())
        self.assertEqual(elements.one('skills-variant-picker')['data-default-variant'], '102')
        self.assertEqual(elements.one('input', name='id')['value'], '102')

    def test_product_form_contract_is_present_in_rendered_source(self):
        elements = Elements(self.render())
        form = elements.one('form')
        self.assertEqual(form['action'], '/cart/add')
        self.assertEqual(form['method'], 'post')
        self.assertEqual(form['enctype'], 'multipart/form-data')
        self.assertEqual(form['id'], 'SkillsProductForm-template--fixture__main')
        self.assertEqual(elements.one('input', name='product-id')['value'], '900001')
        self.assertEqual(elements.one('input', name='form_type')['value'], 'product')

    def test_invalid_liquid_syntax_fails(self):
        self.mutate('sections/main-product.liquid', '{% endfor %}', '{% endif %}')
        self.assertIn('SyntaxError', self.render(success=False))

    def test_undefined_liquid_variable_fails(self):
        self.mutate('sections/main-product.liquid', 'product.title', 'product.not_a_field')
        self.assertIn('UndefinedVariable', self.render(success=False))

    def test_unsupported_liquid_filter_fails(self):
        self.mutate('sections/main-product.liquid', ' | money', ' | imaginary_money')
        self.assertIn('UndefinedFilter', self.render(success=False))

    def test_missing_translation_fails(self):
        path = self.theme / 'locales/en.default.json'
        translations = json.loads(path.read_text())
        del translations['products']['product']['sold_out']
        path.write_text(json.dumps(translations))
        self.assertIn('Missing fixture translation', self.render(success=False))

    def test_null_translation_is_not_silently_rendered_as_empty_text(self):
        self.mutate('locales/en.default.json', '"Sold out"', 'null')
        self.assertIn('Fixture translation must be a string', self.render(success=False))

    def test_bad_section_schema_json_fails(self):
        self.mutate('sections/main-product.liquid', '"settings": [],', '"settings": [,],')
        self.assertIn('Invalid section schema JSON', self.render(success=False))

    def test_missing_section_file_fails(self):
        self.mutate('templates/product.json', '"main-product"', '"missing-product"')
        self.assertIn('missing-product.liquid', self.render(success=False))

    def test_template_order_must_match_existing_sections(self):
        self.mutate('templates/product.json', '"order":["main"]', '"order":["unknown"]')
        self.assertIn('Template order', self.render(success=False))

    def test_unknown_product_form_signature_fails(self):
        self.mutate('sections/main-product.liquid', "form 'product', product", "form 'contact', product")
        self.assertIn('supports only product forms', self.render(success=False))

    def test_missing_layout_script_asset_fails(self):
        (self.theme / 'assets/skills-variant-picker.js').unlink()
        self.assertIn('Missing fixture asset', self.render(success=False))

    def test_unrecognized_variant_is_not_silently_treated_as_shopify_behavior(self):
        self.assertIn('Unknown fixture variant', self.render('--variant', '999', success=False))

    def test_fixture_must_be_explicitly_synthetic(self):
        self.data['synthetic'] = False
        self.assertIn('Only explicitly synthetic', self.render(success=False))

    def test_renderer_does_not_substitute_hard_coded_html_for_liquid_form_id(self):
        self.mutate('sections/main-product.liquid', 'value="{{ current_variant.id }}"', 'value="999"')
        elements = Elements(self.render('--variant', '102'))
        # Prove a source defect reaches the same markup that browser checks read.
        # The normal selected-ID acceptance assertion must reject this mutation.
        with self.assertRaises(AssertionError):
            self.assertEqual(elements.one('input', name='id')['value'], '102')


if __name__ == '__main__':
    unittest.main()
