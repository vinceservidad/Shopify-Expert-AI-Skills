// Fixed report and store-check inputs. Callers choose from named options; no caller text reaches ShopifyQL or Shopify search.

export const REPORT_IDS = ['sales_over_time', 'sales_by_product', 'sales_by_channel', 'new_vs_returning', 'sessions_over_time', 'sessions_by_source'] as const;
export type ReportId = typeof REPORT_IDS[number];
export const REPORT_PERIODS = [7, 30, 90, 365] as const;
export type ReportPeriod = typeof REPORT_PERIODS[number];

const REPORTS: Record<ReportId, { description: string; query: (days: ReportPeriod) => string }> = {
  sales_over_time: { description: 'Net sales, orders and average order value by day.',
    query: days => `FROM sales SHOW net_sales, orders, average_order_value TIMESERIES day SINCE -${days}d UNTIL today` },
  sales_by_product: { description: 'Top 25 products by net sales, with orders and net items sold.',
    query: days => `FROM sales SHOW net_sales, orders, net_items_sold GROUP BY product_title SINCE -${days}d UNTIL today ORDER BY net_sales DESC LIMIT 25` },
  sales_by_channel: { description: 'Net sales and orders by sales channel.',
    query: days => `FROM sales SHOW net_sales, orders GROUP BY sales_channel SINCE -${days}d UNTIL today ORDER BY net_sales DESC LIMIT 25` },
  new_vs_returning: { description: 'Net sales and orders from new versus returning customers.',
    query: days => `FROM sales SHOW net_sales, orders GROUP BY new_or_returning_customer SINCE -${days}d UNTIL today` },
  sessions_over_time: { description: 'Online store sessions and conversion rate by day.',
    query: days => `FROM sessions SHOW sessions, conversion_rate TIMESERIES day SINCE -${days}d UNTIL today` },
  sessions_by_source: { description: 'Top 25 referrer sources by sessions, with conversion rate.',
    query: days => `FROM sessions SHOW sessions, conversion_rate GROUP BY referrer_source SINCE -${days}d UNTIL today ORDER BY sessions DESC LIMIT 25` },
};

export function reportQuery(report: ReportId, days: ReportPeriod): string {
  if (!REPORT_IDS.includes(report) || !REPORT_PERIODS.includes(days)) throw new Error('Unknown report or period');
  return REPORTS[report].query(days);
}
export const reportDescriptions = () => REPORT_IDS.map(id => ({ id, description: REPORTS[id].description }));

const isoDate = (date: Date) => date.toISOString().slice(0, 10);
const isoInstant = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');

export function customerSummaryVariables(days: ReportPeriod, now = new Date()) {
  if (!REPORT_PERIODS.includes(days)) throw new Error('Unknown period');
  return { since: `created_at:>='${isoDate(new Date(now.getTime() - days * 86400000))}'` };
}

export type DailyCheckOptions = { olderThanHours: number; lowStockThreshold: number };
export function dailyCheckVariables(options: DailyCheckOptions, now = new Date()) {
  const hours = Math.trunc(options.olderThanHours), threshold = Math.trunc(options.lowStockThreshold);
  if (!(hours >= 1 && hours <= 720) || !(threshold >= 0 && threshold <= 1000)) throw new Error('Out-of-range daily check option');
  const cutoff = isoInstant(new Date(now.getTime() - hours * 3600000));
  return {
    unfulfilled: `status:open fulfillment_status:unfulfilled created_at:<'${cutoff}'`,
    payment: 'status:open (financial_status:pending OR financial_status:partially_paid OR financial_status:authorized)',
    outOfStock: 'status:active inventory_total:<=0',
    lowStock: `status:active inventory_total:>0 inventory_total:<=${threshold}`,
    drafts: 'status:draft',
    active: 'status:active',
  };
}

type Count = { count?: number; precision?: string } | null | undefined;
type Nodes<T> = { nodes?: T[] } | null | undefined;
type DailyData = {
  unfulfilledCount?: Count; unfulfilled?: Nodes<{ name?: string; createdAt?: string }>;
  paymentCount?: Count; payment?: Nodes<{ name?: string; displayFinancialStatus?: string }>;
  outOfStockCount?: Count; lowStock?: Nodes<{ title?: string; totalInventory?: number }>;
  draftCount?: Count; recentActive?: Nodes<{ title?: string; mediaCount?: { count?: number } | null }>;
};

const countOf = (value: Count) => (typeof value?.count === 'number' ? value.count : null);
const atLeast = (value: Count) => (value?.precision === 'AT_LEAST' ? ' or more' : '');

/** Turns one dailyCheck read into ranked to-do items. Every number comes from the read; nothing is estimated. */
export function summarizeDailyCheck(data: DailyData, options: DailyCheckOptions) {
  const checks: { id: string; priority: 1 | 2 | 3; count: number | null; finding: string; examples: string[]; coverage: string }[] = [];
  const names = <T>(nodes: Nodes<T>, pick: (node: T) => string | undefined) => (nodes?.nodes ?? []).map(pick).filter((v): v is string => !!v).slice(0, 10);
  const unfulfilled = countOf(data.unfulfilledCount);
  checks.push({ id: 'unfulfilled_orders', priority: 1, count: unfulfilled,
    finding: unfulfilled === null ? 'Unfulfilled order count was unavailable.' : `${unfulfilled}${atLeast(data.unfulfilledCount)} open orders are unfulfilled after ${options.olderThanHours} hours.`,
    examples: names(data.unfulfilled, node => node.name), coverage: 'Count from Shopify; examples are the 10 oldest. Shopify order-access limits apply.' });
  const payment = countOf(data.paymentCount);
  checks.push({ id: 'payment_follow_up', priority: 1, count: payment,
    finding: payment === null ? 'Payment status count was unavailable.' : `${payment}${atLeast(data.paymentCount)} open orders are pending, partially paid or authorized but not captured.`,
    examples: names(data.payment, node => node.name && `${node.name} (${node.displayFinancialStatus ?? 'unknown'})`), coverage: 'Count from Shopify; examples are the 10 newest.' });
  const outOfStock = countOf(data.outOfStockCount);
  checks.push({ id: 'out_of_stock', priority: 2, count: outOfStock,
    finding: outOfStock === null ? 'Out-of-stock count was unavailable.' : `${outOfStock}${atLeast(data.outOfStockCount)} active products have total inventory of 0 or less.`,
    examples: [], coverage: 'Count from Shopify. Products that do not track inventory can still show 0.' });
  const low = data.lowStock?.nodes ?? [];
  checks.push({ id: 'low_stock', priority: 2, count: low.length,
    finding: `${low.length} active products have 1 to ${options.lowStockThreshold} units in total${low.length === 20 ? ' (first 20 shown; there may be more)' : ''}.`,
    examples: low.slice(0, 10).map(node => `${node.title ?? 'Untitled'} (${node.totalInventory ?? '?'})`), coverage: 'Lowest 20 by total inventory across locations.' });
  const recent = data.recentActive?.nodes ?? [];
  const noMedia = recent.filter(node => node.mediaCount?.count === 0);
  checks.push({ id: 'missing_media', priority: 3, count: noMedia.length,
    finding: `${noMedia.length} of the ${recent.length} most recently updated active products have no images or video.`,
    examples: noMedia.slice(0, 10).map(node => node.title ?? 'Untitled'), coverage: `Sample of the ${recent.length} most recently updated active products, not the whole catalog.` });
  const drafts = countOf(data.draftCount);
  checks.push({ id: 'draft_products', priority: 3, count: drafts,
    finding: drafts === null ? 'Draft product count was unavailable.' : `${drafts}${atLeast(data.draftCount)} products are still in draft.`,
    examples: [], coverage: 'Count from Shopify.' });
  const todo = checks.filter(check => (check.count ?? 0) > 0).sort((a, b) => a.priority - b.priority);
  return { checks, todo: todo.map(check => ({ id: check.id, priority: check.priority, finding: check.finding })),
    note: 'Store evidence only. Confirm each item in Shopify admin before acting; this check changes nothing.' };
}
