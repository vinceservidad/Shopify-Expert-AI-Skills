/** Served as a same-origin asset; private client files and ID tokens stay out of persistent browser storage. */
export const APP_HOME_SCRIPT = String.raw`(() => {
  'use strict';
  const element = id => document.getElementById(id);
  const status = (id, message, error = false) => {
    const node = element(id);
    node.textContent = message;
    node.classList.toggle('error-text', error);
    node.classList.toggle('success-text', !error && !!message);
  };
  const disabled = (node, value) => { if (value) node.setAttribute('disabled', ''); else node.removeAttribute('disabled'); };
  const errors = {
    invalid_session: 'Your Shopify session could not be verified. Reopen the app in Shopify, then try again.',
    owner_approval_required: 'The store owner must review, approve or disconnect this AI connection.',
    pairing_unavailable: 'This request code is missing, expired or already used. Start a new request from the original sign-in tab.',
    approval_review_required: 'Review this request again before approving it. Its review may have expired.',
    shopify_authorization_failed: 'Shopify could not verify this request. Try again. No connection was confirmed.',
    public_mode_required: 'Public store connection is not enabled on this service.',
    MISSING_SCOPE: 'This read needs an approved permission that is not available. Ask the owner to check the app installation.',
    SHOPIFY_UNAUTHORIZED: 'Shopify access has expired or been removed. Reopen the app and reconnect.',
    SHOPIFY_FORBIDDEN: 'Shopify denied this read. Ask the owner to check the app permissions.',
    SHOPIFY_THROTTLED: 'Shopify is limiting requests. Wait a moment and try the read again.',
    GRAPHQL_ERROR: 'Shopify could not supply this read. Order information may require app data-access approval.',
    RESOURCE_NOT_FOUND: 'This record is unavailable in this store or access window. This does not prove it never existed.',
    UPSTREAM_UNAVAILABLE: 'Shopify could not be reached. Try the read again later.',
    INVALID_RESPONSE: 'The returned data could not be verified. No result is confirmed.',
    rate_limit_exceeded: 'Too many requests were made. Wait a moment before trying again.',
  };
  function errorText(error) {
    return errors[error && error.code] || 'The request could not be completed. Try again or ask the owner for help. No result was verified.';
  }
  async function api(path, body) {
    if (!window.shopify || typeof window.shopify.idToken !== 'function') throw {code: 'invalid_session'};
    const idToken = await window.shopify.idToken();
    const response = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'omit', cache: 'no-store',
      headers: {'Authorization': 'Bearer ' + idToken, ...(body === undefined ? {} : {'Content-Type': 'application/json'})},
      ...(body === undefined ? {} : {body: JSON.stringify(body)}),
      signal: AbortSignal.timeout(25000),
    });
    let data;
    try { data = await response.json(); } catch { throw {code: 'INVALID_RESPONSE'}; }
    if (!response.ok) {
      const code = typeof data.error === 'string' ? data.error : data.error && data.error.code;
      throw {code: typeof code === 'string' ? code : 'request_failed'};
    }
    return data;
  }
  const text = value => value === undefined || value === null || value === '' ? 'Unknown' : String(value);
  const add = (parent, tag, content, className) => {
    const node = document.createElement(tag);
    if (content !== undefined) node.textContent = text(content);
    if (className) node.className = className;
    parent.append(node); return node;
  };
  function date(value) {
    if (typeof value === 'number' && value < 100000000000) value *= 1000;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'Unknown' : parsed.toLocaleString();
  }
  function facts(parent, entries) {
    const list = add(parent, 'dl');
    for (const [label, value] of entries) { add(list, 'dt', label); add(list, 'dd', value); }
    return list;
  }
  function table(parent, caption, headings, rows) {
    if (!rows.length) { add(parent, 'p', 'No records were returned for this checked page.'); return; }
    const tableNode = add(parent, 'table');
    add(tableNode, 'caption', caption);
    const header = add(add(tableNode, 'thead'), 'tr');
    for (const heading of headings) { const cell = add(header, 'th', heading); cell.scope = 'col'; }
    const body = add(tableNode, 'tbody');
    for (const values of rows) {
      const row = add(body, 'tr');
      for (const value of values) {
        const cell = add(row, 'td');
        if (typeof value === 'function') value(cell); else cell.textContent = text(value);
      }
    }
  }
  const nodes = connection => connection && Array.isArray(connection.nodes) ? connection.nodes : [];
  function descriptionText(value) {
    if (typeof value !== 'string') return 'Unknown';
    return value.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<\/?(?:p|div|h[1-6]|li|br|ul|ol)\b[^>]*>/gi, '\n').replace(/<[^>]*>/g, '')
      .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, entity) => ({amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' '})[entity])
      .replace(/&#(x[\da-f]+|\d+);/gi, (match, digits) => {
        const code = digits[0].toLowerCase() === 'x' ? parseInt(digits.slice(1), 16) : parseInt(digits, 10);
        return code > 0 && code <= 1114111 ? String.fromCodePoint(code) : match;
      }).replace(/\n{3,}/g, '\n\n').trim();
  }
  let isOwner = false, reading = false, lastPage, review;
  let sessionGeneration = 0, evidenceGeneration = 0, reviewGeneration = 0, connectionsGeneration = 0;
  let approvalInFlight = false;
  function readButton(parent, label, operation, variables) {
    const button = add(parent, 's-button', label);
    button.setAttribute('data-read-action', '');
    button.addEventListener('click', () => read(operation, variables));
    return button;
  }
  function showEvidence(payload, operation, variables) {
    const result = element('evidence-result'); result.replaceChildren();
    add(result, 'p', 'Store: ' + text(payload.shop) + ' · Read at: ' + date(payload.observedAt), 'evidence-meta');
    const data = payload.data || {};
    let connection;
    if (operation === 'shop') {
      const shop = data.shop || {};
      facts(result, [['Store', shop.name], ['Currency', shop.currencyCode], ['Time zone', shop.ianaTimezone], ['Storefront', shop.primaryDomain && shop.primaryDomain.url]]);
    } else if (operation === 'products') {
      connection = data.products;
      table(result, 'Checked products', ['Product', 'Status', 'Total inventory', 'Read more'], nodes(connection).map(product => [product.title, product.status, product.totalInventory, cell => {
        readButton(cell, 'Listing details', 'productDetails', {id: product.id, first: 20});
        readButton(cell, 'Variants and SKUs', 'variants', {id: product.id, first: 20});
      }]));
    } else if (operation === 'variants') {
      const product = data.product || {}; add(result, 'h3', product.title);
      connection = product.variants;
      table(result, 'Checked variants', ['Variant', 'SKU', 'Price', 'Stock'], nodes(connection).map(variant => [variant.title, variant.sku, variant.price, cell => {
        if (variant.inventoryItem && variant.inventoryItem.id) readButton(cell, 'Stock by location', 'inventory', {id: variant.inventoryItem.id, first: 20});
        else add(cell, 'span', 'Inventory reference unavailable');
      }]));
    } else if (operation === 'productDetails') {
      const product = data.product || {};
      facts(result, [['Search title', product.seo && product.seo.title], ['Search description', product.seo && product.seo.description]]);
      add(result, 'h3', 'Description from the checked record');
      // Untrusted descriptions are text only: no store HTML executes inside App Home.
      add(result, 'p', descriptionText(product.descriptionHtml));
      const source = add(result, 'details'); add(source, 'summary', 'View the description source');
      add(source, 'pre', product.descriptionHtml, 'request');
      connection = product.media;
      table(result, 'Checked media information', ['Alt text', 'Type', 'Status'], nodes(connection).map(media => [media.alt, media.mediaContentType, media.status]));
      add(result, 'p', 'Compare the description and claims with approved product facts. Missing media alt text is a review item; this does not inspect the actual image.');
    } else if (operation === 'inventory') {
      const inventory = data.inventoryItem || {}; connection = inventory.inventoryLevels;
      facts(result, [['SKU', inventory.sku], ['Stock tracking', inventory.tracked === true ? 'Tracked' : inventory.tracked === false ? 'Not tracked' : 'Unknown']]);
      table(result, 'Checked location quantities', ['Location ID', 'Available', 'On hand', 'Committed'], nodes(connection).map(level => {
        const quantities = Array.isArray(level.quantities) ? level.quantities : [];
        const quantity = name => { const item = quantities.find(value => value.name === name); return item && item.quantity; };
        return [level.location && level.location.id, quantity('available'), quantity('on_hand'), quantity('committed')];
      }));
      add(result, 'p', 'Use the owner\'s location map and stock thresholds. Untracked stock is not confirmed out of stock. No reorder quantity or inventory change has been prepared.');
    } else if (operation === 'orders') {
      connection = data.orders;
      table(result, 'Checked order summaries', ['Order', 'Created', 'Financial status', 'Total', 'Read more'], nodes(connection).map(order => {
        const money = order.totalPriceSet && order.totalPriceSet.shopMoney;
        return [order.name, date(order.createdAt), order.displayFinancialStatus, money ? text(money.amount) + ' ' + text(money.currencyCode) : undefined, cell => readButton(cell, 'Order details', 'orderDetails', {id: order.id, first: 20})];
      }));
      add(result, 'p', 'Only permitted recent orders are available. These summaries do not verify delivery dates, refunds or customer communication.');
    } else if (operation === 'orderDetails') {
      const order = data.order || {}; connection = order.lineItems;
      facts(result, [['Financial status', order.displayFinancialStatus], ['Fulfillment status', order.displayFulfillmentStatus], ['Cancellation', order.cancelledAt ? date(order.cancelledAt) : 'No cancellation timestamp returned']]);
      table(result, 'Checked order items', ['Item', 'Quantity', 'SKU'], nodes(connection).map(item => [item.name, item.quantity, item.sku]));
      add(result, 'p', 'Fulfillment status does not verify a delivery date. A customer reply remains a draft until there is separate evidence it was sent.');
    }
    const page = connection && connection.pageInfo;
    const more = page && page.hasNextPage === true && typeof page.endCursor === 'string';
    lastPage = more ? {operation, variables: {...variables, after: page.endCursor}} : undefined;
    element('next-page').hidden = !more;
    add(result, 'p', more ? 'More records remain. Read the next page before claiming a complete check.' : connection ? 'End of this checked list. Other filters, products or nested lists may still need review.' : 'Store identity check only. No full catalog, stock or order review was performed.', 'evidence-meta');
    status('evidence-status', 'Read completed. Review the evidence and coverage below.');
  }
  async function read(operation, variables) {
    if (reading) return;
    const generation = ++evidenceGeneration, session = sessionGeneration;
    reading = true; lastPage = undefined; element('next-page').hidden = true;
    for (const button of document.querySelectorAll('[data-read-action],#read-shop,#read-products,#read-orders,#next-page')) disabled(button, true);
    element('evidence-result').replaceChildren(); status('evidence-status', 'Reading the selected store. Nothing is being changed…');
    try {
      const result = await api('/app/checks', {operation, variables});
      if (generation === evidenceGeneration && session === sessionGeneration) showEvidence(result, operation, variables);
    }
    catch (error) { if (generation === evidenceGeneration && session === sessionGeneration) status('evidence-status', errorText(error), true); }
    finally {
      if (generation === evidenceGeneration && session === sessionGeneration) {
        reading = false;
        for (const button of document.querySelectorAll('[data-read-action],#read-shop,#read-products,#read-orders,#next-page')) disabled(button, false);
      }
    }
  }
  function clearReview() {
    reviewGeneration++;
    review = undefined; element('pairing-review').hidden = true;
    element('pairing-facts').replaceChildren(); disabled(element('approve-pairing'), true);
    disabled(element('inspect-pairing'), !isOwner || approvalInFlight);
  }
  async function inspectPairing() {
    if (!isOwner) { status('pairing-status', errors.owner_approval_required, true); return; }
    clearReview(); disabled(element('inspect-pairing'), true);
    const generation = reviewGeneration, session = sessionGeneration;
    status('pairing-status', 'Checking this request. No connection has been approved…');
    const code = element('pairing-code').value.trim();
    try {
      const result = await api('/app/pairing/inspect', {pairing_code: code});
      if (generation !== reviewGeneration || session !== sessionGeneration || code !== element('pairing-code').value.trim()) return;
      review = {code, token: result.review_token, expiry: result.expires_at};
      const list = element('pairing-facts');
      for (const [label, value] of [['Store', result.shop], ['Requesting app', result.client_name], ['Return destination', result.return_origin], ['Read permissions', Array.isArray(result.permissions) ? result.permissions.join(', ') : 'Unknown'], ['Request expires', date(result.expires_at)]]) {
        add(list, 'dt', label); add(list, 'dd', value);
      }
      element('pairing-review').hidden = false; disabled(element('approve-pairing'), false);
      status('pairing-status', 'Review the store and destination. Only approve the request you started or explicitly authorized.');
      element('approve-pairing').focus();
    } catch (error) { if (generation === reviewGeneration && session === sessionGeneration) status('pairing-status', errorText(error), true); }
    finally { if (generation === reviewGeneration && session === sessionGeneration) disabled(element('inspect-pairing'), !isOwner); }
  }
  async function approvePairing() {
    if (!isOwner || !review || approvalInFlight) return;
    const current = review, generation = reviewGeneration, session = sessionGeneration;
    approvalInFlight = true;
    element('pairing-code').disabled = true;
    disabled(element('approve-pairing'), true); disabled(element('inspect-pairing'), true); disabled(element('cancel-pairing'), true);
    status('pairing-status', 'Approving the displayed read-only connection…');
    try {
      const result = await api('/app/pairing/approve', {pairing_code: current.code, review_token: current.token});
      if (generation !== reviewGeneration || session !== sessionGeneration) return;
      clearReview(); element('pairing-code').value = '';
      status('pairing-status', 'Approved for ' + text(result.shop) + '. Return to the original sign-in tab to finish.');
      await loadConnections();
    } catch (error) {
      if (generation === reviewGeneration && session === sessionGeneration) { clearReview(); status('pairing-status', errorText(error), true); }
    } finally {
      approvalInFlight = false;
      element('pairing-code').disabled = false;
      disabled(element('cancel-pairing'), false);
      disabled(element('inspect-pairing'), !isOwner);
    }
  }
  async function loadConnections() {
    const generation = ++connectionsGeneration, session = sessionGeneration;
    disabled(element('refresh-connections'), true); status('connections-status', 'Reading approved connections…');
    const container = element('connections-list'); container.replaceChildren();
    try {
      const result = await api('/app/connections');
      if (generation !== connectionsGeneration || session !== sessionGeneration) return;
      const connections = Array.isArray(result.connections) ? result.connections : [];
      if (!connections.length) status('connections-status', 'No active AI connections for this store.');
      else {
        status('connections-status', connections.length + ' active connection' + (connections.length === 1 ? '.' : 's.'));
        for (const connection of connections) {
          const card = add(container, 'div', undefined, 'connection-card');
          facts(card, [['Requesting app', connection.client_name], ['Return destination', connection.return_origin], ['Created', date(connection.created_at)], ['Expires', date(connection.expires_at)]]);
          if (isOwner) {
            const button = add(card, 's-button', 'Disconnect');
            let confirmed = false;
            button.addEventListener('click', async () => {
              if (generation !== connectionsGeneration || session !== sessionGeneration) return;
              if (!confirmed) { confirmed = true; button.textContent = 'Confirm disconnect'; add(card, 'p', 'This stops future access for this connection. Its existing AI conversations remain.'); return; }
              disabled(button, true); status('connections-status', 'Disconnecting the selected client…');
              try {
                await api('/app/disconnect', {connection_id: connection.id});
                if (generation === connectionsGeneration && session === sessionGeneration) await loadConnections();
              } catch (error) {
                if (generation === connectionsGeneration && session === sessionGeneration) { status('connections-status', errorText(error), true); confirmed = false; button.textContent = 'Disconnect'; disabled(button, false); }
              }
            });
          }
        }
      }
    } catch (error) { if (generation === connectionsGeneration && session === sessionGeneration) status('connections-status', errorText(error), true); }
    finally { if (generation === connectionsGeneration && session === sessionGeneration) disabled(element('refresh-connections'), false); }
  }
  async function loadSession() {
    const generation = ++sessionGeneration;
    evidenceGeneration++; connectionsGeneration++; reading = false; lastPage = undefined;
    clearReview(); element('authenticated-content').hidden = true;
    element('evidence-result').replaceChildren(); element('connections-list').replaceChildren(); element('next-page').hidden = true;
    isOwner = false; disabled(element('inspect-pairing'), true); disabled(element('retry-session'), true);
    status('session-status', 'Checking your Shopify session…');
    try {
      const result = await api('/app/session', {});
      if (generation !== sessionGeneration) return;
      isOwner = result.is_owner === true;
      element('authenticated-content').hidden = false;
      for (const button of document.querySelectorAll('[data-read-action],#read-shop,#read-products,#read-orders,#next-page')) disabled(button, false);
      status('session-status', 'Verified store: ' + text(result.shop) + '. ' + (isOwner ? 'Store owner approval is available.' : 'Your staff permissions apply to store reads. Owner approval is required for AI connections.'));
      element('owner-guidance').textContent = isOwner ? 'Review the connection request from ChatGPT or Claude before approving read access to this store.' : 'You can view permitted store evidence. Ask the store owner to review connection requests inside this app.';
      disabled(element('inspect-pairing'), !isOwner);
      await loadConnections();
    } catch (error) { if (generation === sessionGeneration) status('session-status', errorText(error), true); }
    finally { if (generation === sessionGeneration) disabled(element('retry-session'), false); }
  }
  element('retry-session').addEventListener('click', loadSession);
  element('product-search').addEventListener('submit', event => {event.preventDefault(); read('products', {first: 20, query: element('product-query').value.trim()});});
  element('read-shop').addEventListener('click', () => read('shop', {}));
  element('read-products').addEventListener('click', () => read('products', {first: 20, query: element('product-query').value.trim()}));
  element('read-orders').addEventListener('click', () => read('orders', {first: 20}));
  element('next-page').addEventListener('click', () => {if (lastPage) read(lastPage.operation, lastPage.variables);});
  element('pairing-form').addEventListener('submit', event => {event.preventDefault(); inspectPairing();});
  element('pairing-code').addEventListener('input', clearReview);
  element('inspect-pairing').addEventListener('click', inspectPairing);
  element('approve-pairing').addEventListener('click', approvePairing);
  element('cancel-pairing').addEventListener('click', () => {clearReview(); status('pairing-status', 'Review cancelled. No connection was approved.'); element('pairing-code').focus();});
  element('refresh-connections').addEventListener('click', loadConnections);
  loadSession();
})();`;
