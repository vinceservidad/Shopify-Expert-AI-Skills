"""Browser checks against a synthetic DOM harness using the real example JS.

The harness mimics the Liquid markup. It is NOT Shopify Liquid rendering, a real
cart, or a production theme/editor test. Every request stays on localhost.
"""
import html
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import threading
import unittest
from urllib.parse import parse_qs, urlsplit
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'skills' / 'shopify-theme-development' / 'assets' / 'worked-example'
DATA = json.loads((ASSETS / 'input.json').read_text())
JAVASCRIPT = (ASSETS / 'theme' / 'assets' / 'skills-variant-picker.js').read_text()


def markup(selected):
    escape = lambda value: html.escape(str(value), quote=True)
    variant = next((v for v in DATA['variants'] if v['id'] == selected), None)
    links = ''.join(
        f'<a href="{DATA["product_path"]}?variant={v["id"]}" data-variant-id="{v["id"]}" '
        f'data-price="{escape(v["price"])}" data-available="{str(v["available"]).lower()}" '
        f'{"aria-current=true" if v["id"] == selected else ""}>{escape(v["title"])}</a>'
        for v in DATA['variants'])
    available = variant and variant['available']
    label = 'Add to cart' if available else ('Sold out' if variant else 'Unavailable')
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Synthetic variant harness</title>
<style>body{{font-family:sans-serif;max-width:48rem;margin:0 auto;padding:1.5rem}}
nav{{display:flex;flex-wrap:wrap;gap:1rem;margin-block:1.5rem}}a,button{{padding:.75rem 1rem;display:inline-block}}
[aria-current=true]{{font-weight:bold;outline:2px solid currentColor}}:focus-visible{{outline:3px solid currentColor;outline-offset:4px}}</style>
<script src="/skills-variant-picker.js" defer></script></head><body><main>
<p>Synthetic browser fixture. No store connection.</p>
<skills-variant-picker data-update-url="true" data-default-variant="101">
<h1>{escape(DATA['product_title'])}</h1><p data-price>{escape(variant['price']) if variant else ''}</p>
<nav aria-label="Choose a color">{links}</nav>
<form action="/cart/add" method="post"><input type="hidden" name="id" value="{variant['id'] if variant else ''}" {'disabled' if not variant else ''}>
<button type="submit" name="add" data-add-label="Add to cart" data-sold-out-label="Sold out" data-unavailable-label="Unavailable" {'disabled' if not available else ''}>{label}</button></form>
<p data-status role="status" aria-live="polite" aria-atomic="true"></p>
</skills-variant-picker></main></body></html>'''


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        request = urlsplit(self.path)
        if request.path == '/skills-variant-picker.js':
            body, content_type = JAVASCRIPT, 'text/javascript; charset=utf-8'
        elif request.path == DATA['product_path']:
            selected = parse_qs(request.query).get('variant', [DATA['default_variant']])[0]
            body, content_type = markup(selected), 'text/html; charset=utf-8'
        else:
            self.send_error(404); return
        self.send_response(200); self.send_header('Content-Type', content_type); self.end_headers()
        self.wfile.write(body.encode())
    def log_message(self, *args):
        pass


class VariantBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True); cls.thread.start()
        cls.origin = f'http://127.0.0.1:{cls.server.server_port}'
        cls.playwright = sync_playwright().start()
        args = {'headless': True}
        if os.getenv('BROWSER_EXECUTABLE'): args['executable_path'] = os.environ['BROWSER_EXECUTABLE']
        cls.browser = cls.playwright.chromium.launch(**args)
    @classmethod
    def tearDownClass(cls):
        cls.browser.close(); cls.playwright.stop()
        cls.server.shutdown(); cls.server.server_close(); cls.thread.join()
    def setUp(self):
        self.context = self.browser.new_context(viewport={'width':390,'height':844})
        self.addCleanup(self.context.close)
        self.page = self.context.new_page()
        self.errors = []; self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.goto(self.origin + DATA['product_path'] + '?campaign=fixture#details')
        self.page.wait_for_function("customElements.get('skills-variant-picker') !== undefined")
    def tearDown(self):
        self.assertEqual(self.errors, [])
    def state(self, selector='skills-variant-picker'):
        return self.page.locator(selector).evaluate("""el => ({id:el.querySelector('[name=id]').value,
          price:el.querySelector('[data-price]').textContent,
          disabled:el.querySelector('button').disabled,
          submittedId:new FormData(el.querySelector('form')).get('id')})""")
    def test_initial_variant(self):
        self.assertEqual(self.state(), {'id':'101','price':'£24.00','disabled':False,'submittedId':'101'})
    def test_change_updates_price_id_url_and_form(self):
        self.page.get_by_role('link',name='Moss',exact=True).click()
        self.assertEqual(self.state(), {'id':'102','price':'£26.00','disabled':False,'submittedId':'102'})
        self.assertIn('campaign=fixture', self.page.url); self.assertIn('variant=102', self.page.url)
        self.assertTrue(self.page.url.endswith('#details'))
        self.assertEqual(self.page.locator('[aria-current=true]').inner_text(),'Moss')
    def test_sold_out_variant_is_disabled(self):
        self.page.get_by_role('link',name='Clay',exact=True).click()
        self.assertTrue(self.state()['disabled'])
        self.assertEqual(self.page.get_by_role('button').inner_text(),'Sold out')
    def test_keyboard_selection(self):
        self.page.get_by_role('link',name='Moss',exact=True).focus(); self.page.keyboard.press('Enter')
        self.assertEqual(self.state()['submittedId'],'102')
        self.assertIn('Moss',self.page.get_by_role('status').inner_text())
    def test_browser_back_restores_previous_selection(self):
        self.page.get_by_role('link',name='Moss',exact=True).click(); self.page.go_back()
        self.assertEqual(self.state()['id'],'101')
    def test_reinsert_does_not_duplicate_listeners(self):
        self.page.evaluate("""() => {const el=document.querySelector('skills-variant-picker');const parent=el.parentNode;
          el.remove();parent.append(el);el.remove();parent.append(el);window.changes=0;
          el.addEventListener('skills:variant-change',()=>window.changes++);} """)
        self.page.get_by_role('link',name='Moss',exact=True).click()
        self.assertEqual(self.page.evaluate('window.changes'),1)
    def test_multiple_instances_do_not_cross_update(self):
        self.page.evaluate("""() => {const clone=document.querySelector('skills-variant-picker').cloneNode(true);
          clone.dataset.updateUrl='false';clone.id='secondary';document.querySelector('main').append(clone);} """)
        self.page.locator('#secondary').get_by_role('link',name='Moss',exact=True).click()
        self.assertEqual(self.state('skills-variant-picker:not(#secondary)')['id'],'101')
        self.assertEqual(self.state('#secondary')['id'],'102')
        self.assertNotIn('variant=',self.page.url)
    def test_reloading_asset_does_not_register_twice(self):
        self.page.add_script_tag(content=JAVASCRIPT)
        self.page.get_by_role('link',name='Moss',exact=True).click()
        self.assertEqual(self.state()['id'],'102')
    def test_invalid_history_variant_blocks_stale_submission(self):
        self.page.evaluate("history.pushState({},'', '?variant=999');window.dispatchEvent(new PopStateEvent('popstate'))")
        self.assertTrue(self.state()['disabled']); self.assertIsNone(self.state()['submittedId'])
    def test_no_javascript_follows_variant_link(self):
        context = self.browser.new_context(java_script_enabled=False)
        try:
            page=context.new_page();page.goto(self.origin+DATA['product_path'])
            page.get_by_role('link',name='Moss',exact=True).click()
            self.assertEqual(page.locator('input[name=id]').get_attribute('value'),'102')
            self.assertEqual(page.locator('[data-price]').inner_text(),'£26.00')
        finally: context.close()
    def test_title_treated_as_text_not_html(self):
        self.page.get_by_role('link',name='Moss',exact=True).evaluate("el=>el.textContent='Moss <img src=x>'")
        self.page.get_by_role('link',name='Moss <img src=x>',exact=True).click()
        self.assertEqual(self.page.locator('[data-status] img').count(),0)
        self.assertIn('<img src=x>',self.page.get_by_role('status').inner_text())
    def test_mobile_has_no_horizontal_overflow(self):
        self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        screenshot=os.getenv('EXAMPLE_SCREENSHOT')
        if screenshot:self.page.screenshot(path=screenshot,full_page=True)


if __name__ == '__main__':
    unittest.main()
