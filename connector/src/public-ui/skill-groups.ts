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
    summary: 'Write product titles, descriptions, and bullet points from confirmed facts.',
    prompt: 'Write a Shopify product title, short description, and three bullets from my product specs. Ask about missing facts first and do not publish anything.',
  },
  {
    slug: 'shopify-catalog-operations',
    name: 'Catalog & Inventory',
    category: 'Catalog',
    summary: 'Plan bulk CSV edits, inventory counts, subscriptions, and TikTok Shop or Amazon sync.',
    prompt: 'Check my Shopify product CSV for missing prices, blank inventory, duplicate SKUs, and channel sync issues. Give me a fix plan before I change anything.',
  },
  {
    slug: 'shopify-product-page',
    name: 'Product Pages',
    category: 'Catalog',
    summary: 'Improve product page copy, reviews, offers, and the mobile layout.',
    prompt: 'Review my Shopify product page on mobile. Point out what stops buyers from adding to cart and draft clearer copy.',
  },
  {
    slug: 'shopify-merchandising',
    name: 'Merchandising',
    category: 'Catalog',
    summary: 'Sort collections, plan bundles, and pick featured products to raise average order value.',
    prompt: 'Help me sort my top Shopify collection and plan a simple bundle using our best sellers and stock levels.',
  },
  {
    slug: 'shopify-product-research',
    name: 'Product Research',
    category: 'Catalog',
    summary: 'Check demand, margin, competitors, and risks before you add a product.',
    prompt: 'Research this product idea using public reviews and competitor prices. Show the pros, risks, and missing facts.',
  },
  {
    slug: 'shopify-order-operations',
    name: 'Order Operations',
    category: 'Orders & Support',
    summary: 'Handle refunds, order routing, shipping rates, 3PL delays, and chargeback evidence.',
    prompt: 'Check why our Shopify orders split across locations or show the wrong shipping rates. Draft a fix plan before we change any rules.',
  },
  {
    slug: 'shopify-support',
    name: 'Customer Support',
    category: 'Orders & Support',
    summary: 'Draft replies about shipping delays, returns, common questions, and subscriptions.',
    prompt: 'Draft calm replies for these customer tickets using only our shipping, return, and subscription rules. Flag any policy gaps first.',
  },
  {
    slug: 'shopify-flow-automation',
    name: 'Shopify Flow',
    category: 'Orders & Support',
    summary: 'Build workflows for fraud holds, low-stock alerts, and VIP tags, and test them first.',
    prompt: 'Design a Shopify Flow rule that holds high-risk orders and sends a low-stock alert to our team without duplicate messages.',
  },
  {
    slug: 'shopify-va',
    name: 'Daily Store Coordinator',
    category: 'Orders & Support',
    summary: 'Prioritize daily store tasks, run quality checks, and write end-of-shift notes.',
    prompt: 'Sort my Shopify task list for today by priority, list what client facts are missing, and draft a short handover note.',
  },
  {
    slug: 'shopify-va-training',
    name: 'VA Onboarding & SOPs',
    category: 'Orders & Support',
    summary: 'Write store checklists, staff permission rules, and practice tasks for new VAs.',
    prompt: 'Build a first-week onboarding checklist for a new Shopify VA. Cover listings, inventory checks, and order-handling rules.',
  },
  {
    slug: 'shopify-google-ads',
    name: 'Google Ads & Shopping',
    category: 'Growth & Ads',
    summary: 'Fix Merchant Center feed errors, Performance Max campaign structure, and wasted search spend.',
    prompt: 'Review our Google Merchant Center feed and Shopping campaigns. Spot price mismatches, missing GTINs, and margin splits.',
  },
  {
    slug: 'shopify-meta-ads',
    name: 'Meta Ads',
    category: 'Growth & Ads',
    summary: 'Check Advantage+ campaigns, Conversions API tracking, and budget rules.',
    prompt: 'Review our Meta Advantage+ campaigns and Shopify Conversions API setup. Show what to fix before we raise budget.',
  },
  {
    slug: 'shopify-creative-strategy',
    name: 'Ad Creative Strategy',
    category: 'Growth & Ads',
    summary: 'Plan new ad angles, hooks, and test briefs from customer reviews.',
    prompt: 'Turn our top buyer reviews into five distinct ad angles and short video hooks for Meta and TikTok.',
  },
  {
    slug: 'shopify-seo',
    name: 'Shopify SEO',
    category: 'Growth & Ads',
    summary: 'Improve collection pages, internal links, and page titles for organic search.',
    prompt: 'Review our top Shopify collections and product titles for organic search gaps. List the fixes with the most impact for the least work first.',
  },
  {
    slug: 'shopify-cro',
    name: 'Conversion Rate (CRO)',
    category: 'Growth & Ads',
    summary: 'Find where shoppers drop off between the landing page and checkout.',
    prompt: 'Look at our store funnel numbers from product view to checkout. List the biggest drop-off points and simple tests to run.',
  },
  {
    slug: 'shopify-email-marketing',
    name: 'Email & SMS Flows',
    category: 'Growth & Ads',
    summary: 'Plan welcome, abandoned cart, and repeat-purchase email flows.',
    prompt: 'Outline a three-email abandoned cart flow and a welcome series for our Shopify store, in a plain, friendly brand voice.',
  },
  {
    slug: 'shopify-store-audit',
    name: 'Store Audit',
    category: 'Store & Theme',
    summary: 'Run full store reviews, launch and Black Friday checks, app cleanup, and review moderation.',
    prompt: 'Run a full store review and launch readiness check covering checkout, apps, tracking, and mobile speed. Rank the top five fixes.',
  },
  {
    slug: 'shopify-analytics',
    name: 'Store Analytics',
    category: 'Store & Theme',
    summary: 'Report net sales, top sellers, margins, and profit after ad spend.',
    prompt: 'Compare our Shopify net sales, refunds, and ad spend for the last 30 days. Show what changed and what may explain it.',
  },
  {
    slug: 'shopify-theme-development',
    name: 'Theme Development',
    category: 'Store & Theme',
    summary: 'Edit Liquid, theme sections, checkout UI extensions, and web pixels without breaking the live store.',
    prompt: 'Check this Shopify theme bug and tell me whether the fix belongs in Liquid theme code, a web pixel, or checkout settings.',
  },
];
