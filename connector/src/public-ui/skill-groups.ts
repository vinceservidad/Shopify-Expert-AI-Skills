/** Every skill in skills/, grouped for repo parity (tests/skill-groups.test.ts) plus
 *  human-facing catalog entries so marketing UI never leaks raw internal slugs. */
export const SKILL_GROUPS: readonly { title: string; skills: readonly string[] }[] = [
  { title: 'Coordination', skills: ['shopify-va', 'shopify-va-training'] },
  { title: 'Catalog and listings', skills: ['shopify-product-listing', 'shopify-catalog-operations', 'shopify-product-page', 'shopify-merchandising', 'shopify-product-research'] },
  { title: 'Orders and support', skills: ['shopify-order-operations', 'shopify-support', 'shopify-flow-automation'] },
  { title: 'Growth', skills: ['shopify-seo', 'shopify-cro', 'shopify-email-marketing', 'shopify-google-ads', 'shopify-meta-ads', 'shopify-creative-strategy'] },
  { title: 'Store and data', skills: ['shopify-store-audit', 'shopify-analytics', 'shopify-theme-development'] },
];

export const SKILL_COUNT = SKILL_GROUPS.reduce((total, group) => total + group.skills.length, 0);

export type SkillCategory = 'Catalog' | 'Orders & Support' | 'Growth & Ads' | 'Store & Theme';

export type SkillCatalogEntry = {
  slug: string;
  name: string;
  category: SkillCategory;
  summary: string;
  prompt: string;
};

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  'Catalog',
  'Orders & Support',
  'Growth & Ads',
  'Store & Theme',
];

export const SKILL_CATALOG: readonly SkillCatalogEntry[] = [
  {
    slug: 'shopify-product-listing',
    name: 'Product Listings',
    category: 'Catalog',
    summary: 'Turns confirmed product specs into titles, descriptions, and bullets without guessing missing details.',
    prompt: 'Write a Shopify product title, short description, and three bullets from my product specs. Ask about missing facts first and do not publish anything.',
  },
  {
    slug: 'shopify-catalog-operations',
    name: 'Catalog & Inventory',
    category: 'Catalog',
    summary: 'Checks bulk CSV imports, stock cleanups, and TikTok Shop and Amazon SKU sync before anything is changed.',
    prompt: 'Check my Shopify product CSV for missing prices, blank inventory, duplicate SKUs, and channel sync issues. Give me a fix plan before I change anything.',
  },
  {
    slug: 'shopify-product-page',
    name: 'Product Pages',
    category: 'Catalog',
    summary: 'Reviews the mobile layout for conversion blockers and drafts clearer product copy.',
    prompt: 'Review my Shopify product page on mobile. Point out what stops buyers from adding to cart and draft clearer copy.',
  },
  {
    slug: 'shopify-merchandising',
    name: 'Merchandising',
    category: 'Catalog',
    summary: 'Sorts collections, picks in-stock products to feature, and plans simple bundles.',
    prompt: 'Help me sort my top Shopify collection and plan a simple bundle using our best sellers and stock levels.',
  },
  {
    slug: 'shopify-product-research',
    name: 'Product Research',
    category: 'Catalog',
    summary: 'Checks real demand, margin, and competitor pricing before a store commits budget to a new product.',
    prompt: 'Research this product idea using public reviews and competitor prices. Show the pros, risks, and missing facts.',
  },
  {
    slug: 'shopify-order-operations',
    name: 'Order Operations',
    category: 'Orders & Support',
    summary: 'Traces split shipments, stuck 3PL orders, and shipping errors, and builds Shopify Payments chargeback evidence.',
    prompt: 'Check why our Shopify orders split across locations or show the wrong shipping rates. Draft a fix plan before we change any rules.',
  },
  {
    slug: 'shopify-support',
    name: 'Customer Support',
    category: 'Orders & Support',
    summary: 'Drafts calm customer replies from your shipping, return, and subscription rules and flags policy gaps.',
    prompt: 'Draft calm replies for these customer tickets using only our shipping, return, and subscription rules. Flag any policy gaps first.',
  },
  {
    slug: 'shopify-flow-automation',
    name: 'Shopify Flow',
    category: 'Orders & Support',
    summary: 'Designs fraud holds, low-stock alerts, and VIP tags with a test step before going live.',
    prompt: 'Design a Shopify Flow rule that holds high-risk orders and sends a low-stock alert to our team without duplicate messages.',
  },
  {
    slug: 'shopify-va',
    name: 'Daily Store Coordinator',
    category: 'Orders & Support',
    summary: 'Ranks the day\'s tasks, lists unconfirmed facts, and drafts the end-of-shift handover.',
    prompt: 'Sort my Shopify task list for today by priority, list which facts I still need from the store owner, and draft a short handover note.',
  },
  {
    slug: 'shopify-va-training',
    name: 'VA Onboarding & SOPs',
    category: 'Orders & Support',
    summary: 'Builds store checklists, staff permission rules, and realistic practice tasks for a new VA.',
    prompt: 'Build a first-week onboarding checklist for a new Shopify VA. Cover listings, inventory checks, and order-handling rules.',
  },
  {
    slug: 'shopify-google-ads',
    name: 'Google Ads & Shopping',
    category: 'Growth & Ads',
    summary: 'Finds Google Merchant Center feed disapprovals, price mismatches, and wasted Performance Max spend.',
    prompt: 'Review our Google Merchant Center feed and Shopping campaigns. Spot price mismatches, missing GTINs, and margin splits.',
  },
  {
    slug: 'shopify-meta-ads',
    name: 'Meta Ads',
    category: 'Growth & Ads',
    summary: 'Checks Advantage+ structure and Shopify Conversions API tracking health before you raise ad budget.',
    prompt: 'Review our Meta Advantage+ campaigns and Shopify Conversions API setup. Show what to fix before we raise budget.',
  },
  {
    slug: 'shopify-creative-strategy',
    name: 'Ad Creative Strategy',
    category: 'Growth & Ads',
    summary: 'Turns customer reviews into distinct ad angles, short video hooks, and structured test briefs.',
    prompt: 'Turn our top buyer reviews into five distinct ad angles and short video hooks for Meta and TikTok.',
  },
  {
    slug: 'shopify-seo',
    name: 'Shopify SEO',
    category: 'Growth & Ads',
    summary: 'Works on collection pages, product titles, and internal links for organic search.',
    prompt: 'Review our top Shopify collections and product titles for organic search gaps. List the fixes with the most impact for the least work first.',
  },
  {
    slug: 'shopify-cro',
    name: 'Conversion Rate (CRO)',
    category: 'Growth & Ads',
    summary: 'Pinpoints where shoppers drop off before checkout and ranks simple tests to run.',
    prompt: 'Look at our store funnel numbers from product view to checkout. List the biggest drop-off points and simple tests to run.',
  },
  {
    slug: 'shopify-email-marketing',
    name: 'Email & SMS Flows',
    category: 'Growth & Ads',
    summary: 'Maps welcome, abandoned cart, and repeat-buyer sequences in the store\'s own voice.',
    prompt: 'Outline a three-email abandoned cart flow and a welcome series for our Shopify store, in a plain, friendly brand voice.',
  },
  {
    slug: 'shopify-store-audit',
    name: 'Store Audit',
    category: 'Store & Theme',
    summary: 'Audits checkout, apps, and review spam before a launch, migration, or Black Friday sale.',
    prompt: 'Run a store review and launch check on checkout, apps, tracking, and mobile speed. Rank the top five fixes.',
  },
  {
    slug: 'shopify-analytics',
    name: 'Store Analytics',
    category: 'Store & Theme',
    summary: 'Puts net sales, refunds, and ad spend in one plain breakdown for the weekly report.',
    prompt: 'Compare our Shopify net sales, refunds, and ad spend for the last 30 days. Show what changed and what may explain it.',
  },
  {
    slug: 'shopify-theme-development',
    name: 'Theme Development',
    category: 'Store & Theme',
    summary: 'Guides Liquid edits, Checkout UI extensions, and Web Pixels on a duplicate theme first.',
    prompt: 'Check this Shopify theme bug and tell me whether the fix belongs in Liquid theme code, a Web Pixel, or Shopify Admin checkout settings.',
  },
];
