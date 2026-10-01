/** Every skill in skills/, grouped for the public page. tests/skill-groups.test.ts keeps this
 *  identical to the repository so the page never lists a skill that does not exist. */
export const SKILL_GROUPS: readonly { title: string; skills: readonly string[] }[] = [
  { title: 'Coordination', skills: ['shopify-va', 'shopify-va-training'] },
  { title: 'Catalog and listings', skills: ['shopify-product-listing', 'shopify-catalog-operations', 'shopify-product-page', 'shopify-merchandising', 'shopify-product-research'] },
  { title: 'Orders and support', skills: ['shopify-order-operations', 'shopify-support', 'shopify-flow-automation'] },
  { title: 'Growth', skills: ['shopify-seo', 'shopify-cro', 'shopify-email-marketing', 'shopify-google-ads', 'shopify-meta-ads', 'shopify-creative-strategy'] },
  { title: 'Store and data', skills: ['shopify-store-audit', 'shopify-analytics', 'shopify-theme-development'] },
];
export const SKILL_COUNT = SKILL_GROUPS.reduce((total, group) => total + group.skills.length, 0);
