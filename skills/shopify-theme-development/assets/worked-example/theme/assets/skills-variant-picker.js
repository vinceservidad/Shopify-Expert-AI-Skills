/* Teaching example for a small, single-option, one-time-purchase product.
 * Scope: price, variant ID, availability, links, keyboard and DOM lifecycle.
 * No global theme objects, numeric ID coercion, innerHTML, cart requests or writes.
 */
(() => {
  if (customElements.get('skills-variant-picker')) return;
  class SkillsVariantPicker extends HTMLElement {
    connectedCallback() {
      this.controller?.abort();
      this.form = this.querySelector('form');
      this.input = this.form?.querySelector('input[name="id"]');
      this.price = this.querySelector('[data-current-price]');
      this.button = this.form?.querySelector('button[type="submit"]');
      this.status = this.querySelector('[data-status]');
      if (!this.input || !this.price || !this.button || !this.status) return;
      this.controller = new AbortController();
      const { signal } = this.controller;
      this.addEventListener('click', (event) => {
        const link = event.target.closest?.('a[data-variant-id]');
        if (!link || link.closest('skills-variant-picker') !== this || event.defaultPrevented ||
            event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
            link.target || link.hasAttribute('download')) return;
        const url = new URL(link.href, location.href);
        const state = this.readState(link);
        if (!state || url.origin !== location.origin || url.pathname !== location.pathname) return;
        event.preventDefault();
        this.select(link, state);
        if (this.dataset.updateUrl === 'true') {
          const next = new URL(location.href);
          next.searchParams.set('variant', state.id);
          if (next.href !== location.href) history.pushState(history.state, '', next);
        }
      }, { signal });
      if (this.dataset.updateUrl === 'true') {
        window.addEventListener('popstate', () => {
          const id = new URL(location.href).searchParams.get('variant') || this.dataset.defaultVariant;
          const link = [...this.querySelectorAll('a[data-variant-id]')].find((el) => el.dataset.variantId === id);
          const state = link && this.readState(link);
          if (state) this.select(link, state);
          else this.unavailable();
        }, { signal });
      }
    }
    disconnectedCallback() { this.controller?.abort(); }
    readState(link) {
      const { variantId: id, price, available } = link.dataset;
      if (!id || !/^\d+$/.test(id) || !price || !['true', 'false'].includes(available)) return null;
      return { id, price, available: available === 'true', title: link.textContent.trim() };
    }
    select(link, state) {
      this.input.value = state.id;
      this.input.disabled = false;
      this.price.textContent = state.price;
      this.button.disabled = !state.available;
      this.button.textContent = state.available ? this.button.dataset.addLabel : this.button.dataset.soldOutLabel;
      this.status.textContent = `${state.title}: ${state.price}. ${this.button.textContent}`;
      this.querySelectorAll('a[data-variant-id]').forEach((item) => {
        if (item === link) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      this.dispatchEvent(new CustomEvent('skills:variant-change', { bubbles: true, detail: { id: state.id } }));
    }
    unavailable() {
      this.input.value = '';
      this.input.disabled = true;
      this.price.textContent = '';
      this.button.disabled = true;
      this.button.textContent = this.button.dataset.unavailableLabel;
      this.status.textContent = this.button.dataset.unavailableLabel;
      this.querySelectorAll('[aria-current]').forEach((item) => item.removeAttribute('aria-current'));
    }
  }
  customElements.define('skills-variant-picker', SkillsVariantPicker);
})();
