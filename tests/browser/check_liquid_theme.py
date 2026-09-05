"""Actual Liquid source -> official Liquid core -> Chromium -> local POST capture.

Shopify-specific extensions use documented fixture adapters. No store, editor,
market or Shopify cart service is contacted or represented as verified.
"""
from email.parser import BytesParser
from email.policy import default
import functools
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

import check_variant_picker as synthetic

ROOT = Path(__file__).resolve().parents[2]


def render_liquid(*args):
    env = {**os.environ, 'BUNDLE_GEMFILE': str(ROOT / 'Gemfile.theme')}
    result = subprocess.run(
        ['bundle', 'exec', 'ruby', str(ROOT / 'scripts/render_theme_fixture.rb'), *args],
        cwd=ROOT, env=env, text=True, capture_output=True, timeout=30, check=True)
    return result.stdout


@functools.lru_cache(maxsize=3)
def markup(selected):
    return render_liquid('--variant', selected)


class LiquidHandler(synthetic.Handler):
    renderer = staticmethod(markup)
    submissions = []

    def do_POST(self):
        if self.path != '/cart/add':
            self.send_error(404)
            return
        length = int(self.headers.get('Content-Length', '0'))
        if not 0 < length <= 8192:
            self.send_error(413)
            return
        # Capture the browser's actual multipart submission without modeling
        # Shopify acceptance, inventory validation, taxes or checkout.
        body = self.rfile.read(length)
        message = BytesParser(policy=default).parsebytes(
            f'Content-Type: {self.headers["Content-Type"]}\r\nMIME-Version: 1.0\r\n\r\n'.encode() + body)
        fields = {part.get_param('name', header='content-disposition'): part.get_payload(decode=True).decode('utf-8')
                  for part in message.iter_parts()}
        self.submissions.append(fields)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'local_capture_only': True, 'fields': fields}).encode())


class LiquidThemeBrowserTests(synthetic.VariantBrowserTests):
    """Run all 12 original behaviors against actual rendered source, plus gaps."""
    handler_class = LiquidHandler

    @classmethod
    def setUpClass(cls):
        # Missing Ruby/gems are a hard failure, not a skipped verification pass.
        for selected in ('101', '102', '103'):
            markup(selected)
        super().setUpClass()

    def setUp(self):
        LiquidHandler.submissions.clear()
        super().setUp()

    def test_rendered_product_form_posts_selected_variant_to_local_capture(self):
        self.page.get_by_role('link', name='Moss', exact=True).click()
        self.page.get_by_role('button', name='Add to cart', exact=True).click()
        self.page.wait_for_url(self.origin + '/cart/add')
        self.assertEqual(len(LiquidHandler.submissions), 1)
        fields = LiquidHandler.submissions[0]
        self.assertEqual(fields['id'], '102')
        self.assertEqual(fields['form_type'], 'product')
        self.assertEqual(fields['product-id'], '900001')
        self.assertEqual(fields['utf8'], '✓')

    def test_direct_sold_out_deep_link_renders_disabled_form_without_javascript(self):
        context = self.browser.new_context(java_script_enabled=False)
        try:
            page = context.new_page()
            page.goto(self.origin + synthetic.DATA['product_path'] + '?variant=103')
            self.assertEqual(page.locator('input[name=id]').get_attribute('value'), '103')
            self.assertTrue(page.get_by_role('button', name='Sold out', exact=True).is_disabled())
            self.assertEqual(page.locator('[data-current-price]').inner_text(), '£28.00')
        finally:
            context.close()

    def test_fresh_rendered_section_replacement_initializes_controller(self):
        replacement = render_liquid('--variant', '102', '--section-only')
        self.page.evaluate('''html => {
            const section = document.querySelector('.shopify-section');
            section.dispatchEvent(new CustomEvent('shopify:section:unload', {bubbles:true}));
            section.outerHTML = html;
            document.querySelector('.shopify-section').dispatchEvent(
                new CustomEvent('shopify:section:load', {bubbles:true}));
            window.changes = 0;
            document.querySelector('skills-variant-picker').addEventListener(
                'skills:variant-change', () => window.changes++);
        }''', replacement)
        self.assertEqual(self.state()['id'], '102')
        self.page.get_by_role('link', name='Sand', exact=True).click()
        self.assertEqual(self.state()['id'], '101')
        self.assertEqual(self.page.evaluate('window.changes'), 1)

    def test_two_server_rendered_sections_have_unique_form_ids(self):
        secondary = render_liquid('--variant', '101', '--section-only', '--section-id', 'secondary')
        self.page.evaluate('''html => {
            document.querySelector('main').insertAdjacentHTML('beforeend', html);
            document.querySelector('#shopify-section-secondary skills-variant-picker').dataset.updateUrl = 'false';
        }''', secondary)
        self.assertEqual(self.page.locator('form').evaluate_all(
            'forms => new Set(forms.map(form => form.id)).size'), 2)
        self.page.locator('#shopify-section-secondary').get_by_role('link', name='Moss', exact=True).click()
        self.assertEqual(self.state('#shopify-section-secondary skills-variant-picker')['id'], '102')
        self.assertEqual(self.state('#shopify-section-template--fixture__main skills-variant-picker')['id'], '101')
        self.assertNotIn('variant=', self.page.url)

    def test_liquid_escapes_untrusted_product_and_variant_titles(self):
        data = json.loads(json.dumps(synthetic.DATA))
        hostile = '<img src=x onerror="window.injected=true"> & "quotes"'
        data['product_title'] = hostile
        data['variants'][0]['title'] = hostile
        with tempfile.TemporaryDirectory() as directory:
            input_path = Path(directory) / 'input.json'
            input_path.write_text(json.dumps(data))
            rendered = render_liquid('--input', str(input_path))
        self.page.set_content(rendered)
        self.assertEqual(self.page.locator('h1').inner_text(), hostile)
        self.assertEqual(self.page.locator('nav a').first.inner_text(), hostile)
        self.assertEqual(self.page.locator('img').count(), 0)
        self.assertIsNone(self.page.evaluate('window.injected'))


if __name__ == '__main__':
    unittest.main()
