import { ConnectorError } from './shopify.js';

export const WORKFLOW_IDS = ['client_setup', 'daily_work_plan', 'product_listing_check', 'catalog_review',
  'stock_review', 'customer_reply', 'end_of_day_handover', 'va_training'] as const;
export type WorkflowId = typeof WORKFLOW_IDS[number];
export type Workflow = {
  id: WorkflowId; title: string; purpose: string; owner_skill: string; reference: string;
  required_inputs: readonly string[]; optional_inputs: readonly string[]; evidence_tools: readonly string[];
  steps: readonly string[]; output_sections: readonly string[]; qa: readonly string[];
};
const targetRead = ['shopify_connection_status', 'shopify_get_shop'];
const productReads = [...targetRead, 'shopify_search_products', 'shopify_get_product_details', 'shopify_get_product_variants'];
const stockReads = [...productReads, 'shopify_get_inventory_levels'];
const orderReads = [...targetRead, 'shopify_list_order_summaries', 'shopify_get_order_details'];

/** Task instructions, not a scheduler or a store-action engine. No client content is stored here. */
export const WORKFLOWS: readonly Workflow[] = [
  {
    id: 'client_setup', title: "Set up my client's work guide", purpose: 'Prepare a reusable client brief and approval map from client-provided information.',
    owner_skill: 'shopify-va', reference: 'references/client-setup.md',
    required_inputs: ['assigned_tasks', 'approval_roles'], optional_inputs: ['client_brief', 'brand_voice', 'policies', 'escalation_roles', 'store_identity'], evidence_tools: targetRead,
    steps: ['Collect assigned tasks and approval roles.', 'Record brand, policy and store information with source dates.', 'Mark missing instructions and escalation roles.', 'Keep the brief in the client chat or project files for owner review.'],
    output_sections: ['Client brief draft', 'Task checklist', 'Approval and escalation roles', 'Missing information'],
    qa: ['Never request owner passwords or unnecessary customer data.', 'A prepared brief grants no new permissions.', 'Do not invent client policies or approval roles.'],
  },
  {
    id: 'daily_work_plan', title: "Plan today's work", purpose: 'Prioritize an on-demand task queue using approved deadlines and available evidence.',
    owner_skill: 'shopify-va', reference: 'references/daily-work-plan.md',
    required_inputs: ['task_queue'], optional_inputs: ['client_work_guide', 'deadlines', 'prior_handover', 'stock_thresholds', 'source_cutoff'], evidence_tools: [...stockReads, 'shopify_list_order_summaries', 'shopify_get_order_details'],
    steps: ['Confirm the task queue, target and cutoff.', 'Use only relevant supplied or connected evidence.', 'Separate urgent work, blocked work and owner decisions.', 'Prepare the plan without starting a scheduled or unattended run.'],
    output_sections: ['Prioritized task list', 'Evidence and coverage', 'Blocked work', 'Owner decisions'],
    qa: ['Do not invent deadlines or stock thresholds.', 'State filters, retrieval time and partial coverage.', 'A planned task is not a completed action.'],
  },
  {
    id: 'product_listing_check', title: 'Check this product listing', purpose: 'Compare listing evidence with approved product facts and prepare corrections for review.',
    owner_skill: 'shopify-product-listing', reference: 'references/product-listing-check.md',
    required_inputs: ['approved_product_facts', 'product_record'], optional_inputs: ['listing_requirements', 'brand_voice'], evidence_tools: productReads,
    steps: ['Confirm the product and approved source.', 'Compare description, media, search details and variant evidence.', 'Keep unsupported claims and unavailable fields unresolved.', 'Draft proposed corrections and review the exact target before any external-edit handoff.'],
    output_sections: ['Source comparison', 'Listing issues', 'Proposed corrections', 'Missing facts', 'Review checklist'],
    qa: ['Do not invent claims, prices, product specifications or missing media.', 'One media or variant page is not complete coverage.', 'A draft correction has not been saved or published.'],
  },
  {
    id: 'catalog_review', title: 'Review my product catalog', purpose: 'Identify conflicts and inconsistencies within an explicitly inspected catalog scope.',
    owner_skill: 'shopify-catalog-operations', reference: 'references/catalog-review.md',
    required_inputs: ['catalog_scope', 'catalog_records'], optional_inputs: ['catalog_standards', 'approval_roles'], evidence_tools: productReads,
    steps: ['Record the inspected scope, filters and pagination.', 'Check identifiers and listing consistency against approved catalog rules.', 'Separate confirmed conflicts from warnings requiring an owner decision.', 'Prepare a correction plan with protected identifiers and verification steps.'],
    output_sections: ['Coverage', 'Confirmed conflicts', 'Warnings and missing rules', 'Proposed correction plan'],
    qa: ['Duplicate checks apply only to inspected records.', 'Missing SKUs are not automatically errors when client requirements are unknown.', 'Preserve handles, identifiers and unrelated fields.'],
  },
  {
    id: 'stock_review', title: 'Review stock', purpose: 'Review location quantities and tracking using client-defined stock thresholds.',
    owner_skill: 'shopify-catalog-operations', reference: 'references/stock-review.md',
    required_inputs: ['stock_scope', 'inventory_records', 'stock_thresholds'], optional_inputs: ['sales_history', 'lead_times', 'approval_roles'], evidence_tools: stockReads,
    steps: ['Confirm products, locations and owner thresholds.', 'Read tracking and quantity states without conflating available, on-hand and committed stock.', 'Mark untracked items, negative quantities and incomplete pages for review.', 'Require sales evidence and lead times before proposing a reorder quantity.'],
    output_sections: ['Coverage and locations', 'Stock exceptions', 'Unknowns', 'Owner decisions'],
    qa: ['Never invent thresholds, demand or lead times.', 'Untracked inventory is not confirmed out of stock.', 'Do not change quantities or place purchase orders.'],
  },
  {
    id: 'customer_reply', title: 'Help me answer this customer', purpose: 'Prepare a policy-grounded reply draft and any necessary escalation.',
    owner_skill: 'shopify-support', reference: 'references/customer-reply.md',
    required_inputs: ['customer_message', 'approved_policies'], optional_inputs: ['verified_order_facts', 'verified_tracking_facts', 'brand_voice', 'escalation_roles'], evidence_tools: orderReads,
    steps: ['Use a redacted message and the applicable approved policy.', 'Verify order facts only when the question needs them.', 'Use a holding draft when policy or shipping evidence is missing.', 'Separate the customer-facing draft from internal escalation and actions needing approval.'],
    output_sections: ['Reply draft', 'Verified facts', 'Unknowns and policy basis', 'Internal escalation'],
    qa: ['Fulfilled does not prove shipped or delivered.', 'Do not invent a delivery date or policy exception.', 'Never claim a message was sent, an order changed or a refund issued without evidence.'],
  },
  {
    id: 'end_of_day_handover', title: 'Prepare my end-of-day handover', purpose: 'Summarize actual task states and evidence without inventing completion.',
    owner_skill: 'shopify-va', reference: 'references/end-of-day-handover.md',
    required_inputs: ['task_log'], optional_inputs: ['verification_evidence', 'blocked_tasks', 'priorities'], evidence_tools: [...stockReads, 'shopify_list_order_summaries', 'shopify_get_order_details'],
    steps: ['Compare each task with its requested finished state.', 'Separate drafts, verified changes and unverified claims.', 'Record blockers, failed external edits and approval needs.', 'List the next owner and action using the client\'s preferred report format when provided.'],
    output_sections: ['Drafts ready', 'Verified changes', 'Blocked or unverified work', 'Next actions'],
    qa: ['A save claim or plan is not verification.', 'A failed external edit remains failed or blocked.', 'A completed draft task is not a published store change.'],
  },
  {
    id: 'va_training', title: 'Train a new VA', purpose: 'Prepare supervised practice tasks, exception cases and reviewer criteria.',
    owner_skill: 'shopify-va-training', reference: 'references/va-training.md',
    required_inputs: ['role_charter', 'current_sops'], optional_inputs: ['approved_policies', 'reviewer_criteria', 'learner_baseline', 'practice_environment'], evidence_tools: [],
    steps: ['Confirm the role, permitted work and existing instructions.', 'Use sanitized practice data or the named test environment.', 'Prepare normal and exception tasks with review criteria.', 'Have the accountable reviewer assess the observed work before any access progression.'],
    output_sections: ['Practice plan', 'Task instructions', 'Exception exercises', 'Reviewer checklist'],
    qa: ['Exercises and quiz completion do not certify expertise.', 'Do not grant access or infer production readiness.', 'Keep learner and customer information private.'],
  },
];

export function listWorkflows() {
  return WORKFLOWS.map(({ id, title, purpose, owner_skill, reference, required_inputs, optional_inputs, evidence_tools }) => ({
    id, title, purpose, owner_skill, reference, required_inputs: [...required_inputs], optional_inputs: [...optional_inputs], evidence_tools: [...evidence_tools],
  }));
}

export async function prepareWorkflow(
  workflowId: string, providedInputKeys: readonly string[], readGuide: (name: string, resource?: string) => Promise<string>,
) {
  const workflow = WORKFLOWS.find(item => item.id === workflowId);
  if (!workflow) throw new ConnectorError('INVALID_WORKFLOW', 'Choose a workflow from list_shopify_va_workflows.');
  if (providedInputKeys.length > 30 || providedInputKeys.some(key => !/^[a-z][a-z0-9_]{0,63}$/.test(key)
      || ![...workflow.required_inputs, ...workflow.optional_inputs].includes(key))) {
    throw new ConnectorError('INVALID_WORKFLOW_INPUT', 'Provide only input names listed for the selected workflow, not client document content.');
  }
  const provided = [...new Set(providedInputKeys)];
  const [skill, guide] = await Promise.all([readGuide(workflow.owner_skill, 'SKILL.md'), readGuide(workflow.owner_skill, workflow.reference)]);
  return {
    workflow_id: workflow.id, title: workflow.title, purpose: workflow.purpose, owner_skill: workflow.owner_skill,
    reference: workflow.reference, required_inputs: [...workflow.required_inputs], optional_inputs: [...workflow.optional_inputs],
    provided_input_keys: provided, missing_inputs: workflow.required_inputs.filter(key => !provided.includes(key)),
    inputs_verified: false, input_note: 'Input names mean the information is available in the client chat or project. They do not verify its contents.',
    mode: 'read-only-or-draft', client_context_storage: 'chat-or-project-files',
    relevant_guides: [{ name: workflow.owner_skill, resource: 'SKILL.md' }, { name: workflow.owner_skill, resource: workflow.reference }],
    guidance: `Owner skill instructions:\n\n${skill}\n\nWorkflow instructions:\n\n${guide}`,
    steps: [...workflow.steps], output_sections: [...workflow.output_sections], qa: [...workflow.qa], evidence_tools: [...workflow.evidence_tools],
    external_edit_handoff: {
      authorized_by_this_tool: false,
      requirements: ['A separate authorized editing connection supporting the action.', 'The correct store and exact target.',
        'User approval for the named change.', 'Verification of the saved or live result before reporting that state.'],
    },
    warning: 'This tool prepares instructions only. It does not analyze client files, verify input facts, fetch store data, schedule work or perform actions.',
  };
}
