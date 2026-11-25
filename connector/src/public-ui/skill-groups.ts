/** Every skill in skills/, grouped for repo parity (tests/skill-groups.test.ts) plus
 *  clean human-facing catalog entries so marketing UI never leaks raw internal slugs. */
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
    summary: 'Write clean titles, descriptions, and bullets from real facts.',
    prompt: 'Write a Shopify product title, short description, and three bullets from my product specs. Ask about missing facts first and do not publish anything.',
  },
  {
    slug: 'shopify-catalog-operations',
    name: 'Catalog & Inventory',
    category: 'Catalog',
    summary: 'Plan safe bulk CSV edits, tags, prices, and stock checks.',
    prompt: 'Check my Shopify product sheet for missing prices, blank stock, and messy tags. Give me a safe fix plan before I import it.',
  },
  {
    slug: 'shopify-product-page',
    name: 'Product Pages',
    category: 'Catalog',
    summary: 'Fix weak product page copy, proof, offers, and mobile layout.',
    prompt: 'Review my Shopify product page on mobile. Point out what stops buyers from adding to cart and draft clearer copy.',
  },
  {
    slug: 'shopify-merchandising',
    name: 'Merchandising',
    category: 'Catalog',
    summary: 'Sort collections, bundles, and featured picks to lift cart size.',
    prompt: 'Help me sort my top Shopify collection and plan a simple bundle using our best sellers and stock levels.',
  },
  {
    slug: 'shopify-product-research',
    name: 'Product Research',
    category: 'Catalog',
    summary: 'Check demand, margin, rivals, and risks before adding a product.',
    prompt: 'Research this new product idea using public buyer reviews and store prices. Show clear pros, risks, and missing facts.',
  },
  {
    slug: 'shopify-order-operations',
    name: 'Order Operations',
    category: 'Orders & Support',
    summary: 'Handle holds, refunds, routing, and multi-warehouse orders safely.',
    prompt: 'Check why our Shopify orders split across warehouses and write a safe fix plan for our routing rules and markets.',
  },
  {
    slug: 'shopify-support',
    name: 'Customer Support',
    category: 'Orders & Support',
    summary: 'Draft calm, policy-safe replies for shipping, returns, and FAQs.',
    prompt: 'Draft calm replies for these customer tickets using only our return and shipping rules. Flag any policy gaps first.',
  },
  {
    slug: 'shopify-flow-automation',
    name: 'Shopify Flow',
    category: 'Orders & Support',
    summary: 'Design fraud holds, low-stock alerts, VIP tags, and safe tests.',
    prompt: 'Design a Shopify Flow rule that holds high-risk orders and sends a low-stock alert to our team without duplicate messages.',
  },
  {
    slug: 'shopify-va',
    name: 'Daily Store Coordinator',
    category: 'Orders & Support',
    summary: 'Sort mixed daily store tasks, QA checks, and shift handovers.',
    prompt: 'Sort my Shopify task list for today by priority, list what client facts are missing, and draft a short handover note.',
  },
  {
    slug: 'shopify-va-training',
    name: 'VA Onboarding & SOPs',
    category: 'Orders & Support',
    summary: 'Build step-by-step store checklists, role limits, and QA drills.',
    prompt: 'Build a week-one onboarding checklist for a new Shopify assistant covering listings, stock checks, and safe order rules.',
  },
  {
    slug: 'shopify-google-ads',
    name: 'Google Ads & Shopping',
    category: 'Growth & Ads',
    summary: 'Fix Merchant Center feeds, Performance Max splits, and search waste.',
    prompt: 'Review our Google Merchant Center feed and Shopping campaigns. Spot price mismatches, missing GTINs, and margin splits.',
  },
  {
    slug: 'shopify-meta-ads',
    name: 'Meta Ads',
    category: 'Growth & Ads',
    summary: 'Check Advantage+ campaigns, Conversions API tracking, and spend rules.',
    prompt: 'Review our Meta Advantage+ campaigns and Shopify Conversions API setup. Show what to fix before we raise budget.',
  },
  {
    slug: 'shopify-creative-strategy',
    name: 'Ad Creative Strategy',
    category: 'Growth & Ads',
    summary: 'Plan fresh ad angles, hooks, and test briefs from buyer proof.',
    prompt: 'Turn our top buyer reviews into five distinct ad angles and short video hooks for Meta and TikTok.',
  },
  {
    slug: 'shopify-seo',
    name: 'Shopify SEO',
    category: 'Growth & Ads',
    summary: 'Improve collection pages, product links, titles, and search traffic.',
    prompt: 'Review our top Shopify collections and product titles for organic search gaps. List the easiest high-impact fixes first.',
  },
  {
    slug: 'shopify-cro',
    name: 'Conversion Rate (CRO)',
    category: 'Growth & Ads',
    summary: 'Spot where buyers drop off from landing page to checkout.',
    prompt: 'Look at our store funnel numbers from product view to checkout. List the biggest drop-off points and simple tests to run.',
  },
  {
    slug: 'shopify-email-marketing',
    name: 'Email & SMS Flows',
    category: 'Growth & Ads',
    summary: 'Plan welcome, cart recovery, and repeat-buyer email sequences.',
    prompt: 'Outline a three-part abandoned cart email flow and welcome series for our Shopify store in plain, friendly brand voice.',
  },
  {
    slug: 'shopify-store-audit',
    name: 'Store Audit',
    category: 'Store & Theme',
    summary: 'Check storefront trust, speed, buyer flow, and tracking gaps.',
    prompt: 'Run a full trust and buyer-flow review of our Shopify store. Rank the top five issues blocking sales today.',
  },
  {
    slug: 'shopify-analytics',
    name: 'Store Analytics',
    category: 'Store & Theme',
    summary: 'Track real sales, top sellers, margins, and ad profit clearly.',
    prompt: 'Compare our Shopify net sales, refunds, and ad spend for the last 30 days. Explain what drove the profit change.',
  },
  {
    slug: 'shopify-theme-development',
    name: 'Theme Development',
    category: 'Store & Theme',
    summary: 'Work safely on Liquid, sections, Checkout UI, and Web Pixels.',
    prompt: 'Check this Shopify theme bug and tell me whether the fix belongs in Liquid theme code, a Web Pixel, or Checkout settings.',
  },
];
