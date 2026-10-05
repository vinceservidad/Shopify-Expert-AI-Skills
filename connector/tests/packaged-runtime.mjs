import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from '../build/mcp.js';
import { WORKFLOWS, listWorkflows, prepareWorkflow } from '../build/workflows.js';
import { readSkill, listSkills } from '../build/catalog.js';

const skillsRoot = resolve('../skills');
const legacyNames = ['list_shopify_skills', 'read_shopify_skill', 'shopify_connection_status', 'shopify_get_shop',
  'shopify_search_products', 'shopify_get_product_variants', 'shopify_get_inventory_levels', 'shopify_list_order_summaries'];
const server = createServer({ skillsRoot });
const baseline = new Client({ name: 'package-source-comparison', version: '1.0.0' });
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await server.connect(serverTransport); await baseline.connect(clientTransport);
let sourceTools;
// In-memory responses retain undefined optional SDK properties; compare the JSON wire contract.
try { sourceTools = JSON.parse(JSON.stringify((await baseline.listTools()).tools)); }
finally { await baseline.close(); await server.close(); }
const expectedSkills = await listSkills(skillsRoot);
const expectedPreparations = new Map(await Promise.all(WORKFLOWS.map(async workflow => [workflow.id,
  await prepareWorkflow(workflow.id, [], (name, resource) => readSkill(skillsRoot, name, resource))])));

const destination = await mkdtemp(join(tmpdir(), 'toolkit-package-'));
try {
  const archive = resolve('../dist/shopify-va-toolkit.plugin');
  execFileSync(process.env.PYTHON ?? 'python3', ['-c',
    'import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); assert all(not n.startswith("/") and ".." not in n.split("/") for n in z.namelist()); z.extractall(sys.argv[2])',
    archive, destination]);
  const manifest = JSON.parse(await readFile(join(destination, 'plugin.json'), 'utf8'));
  assert.equal(manifest.name, 'shopify-va-toolkit');
  const configs = ['mcp.json', '.mcp.json'];
  for (const config of configs) {
    const data = JSON.parse(await readFile(join(destination, config), 'utf8'));
    const server = data.mcpServers['shopify-va-toolkit'];
    const args = server.args.map(value => value.replace(/\$\{(?:CLAUDE_)?PLUGIN_ROOT\}/g, destination));
    const env = Object.fromEntries(Object.entries(server.env).map(([key,value]) => [key,value.replace(/\$\{(?:CLAUDE_)?PLUGIN_ROOT\}/g,destination)]));
    const client = new Client({name:'packaged-runtime-test',version:'1.0.0'});
    await client.connect(new StdioClientTransport({command:process.execPath,args,env:{PATH:process.env.PATH ?? '',...env},stderr:'pipe'}));
    try {
      const tools = (await client.listTools()).tools;
      assert.equal(tools.length,12);
      assert.deepEqual(tools, sourceTools, `${config} exposes the same contracts as the Node connector`);
      for (const name of legacyNames) assert.ok(tools.some(tool => tool.name === name));
      assert.ok(tools.every(tool => tool.annotations?.readOnlyHint === true && tool.annotations?.destructiveHint === false));
      const skills = await client.callTool({name:'list_shopify_skills',arguments:{}});
      assert.equal(skills.structuredContent.skills.length,19);
      assert.deepEqual(skills.structuredContent.skills, expectedSkills, 'Every original skill remains packaged');
      const workflows = await client.callTool({name:'list_shopify_va_workflows',arguments:{}});
      assert.deepEqual(workflows.structuredContent.workflows,listWorkflows());
      for (const workflow of WORKFLOWS) {
        const prepared = await client.callTool({name:'prepare_shopify_va_task',arguments:{workflow_id:workflow.id}});
        assert.equal(prepared.isError,undefined);
        assert.deepEqual(prepared.structuredContent,expectedPreparations.get(workflow.id), `${config} packages the complete ${workflow.id} instructions`);
        const reference = await client.callTool({name:'read_shopify_skill',arguments:{name:workflow.owner_skill,resource:workflow.reference}});
        assert.equal(reference.isError,undefined);
        assert.equal(reference.structuredContent.text,await readSkill(skillsRoot,workflow.owner_skill,workflow.reference));
      }
      const missingPolicy = await client.callTool({name:'prepare_shopify_va_task',arguments:{workflow_id:'customer_reply',provided_input_keys:['customer_message']}});
      assert.deepEqual(missingPolicy.structuredContent.missing_inputs,['approved_policies']);
      assert.equal((await client.callTool({name:'prepare_shopify_va_task',arguments:{workflow_id:'customer_reply',provided_input_keys:['invented_policy']}})).isError,true);
      assert.equal((await client.callTool({name:'prepare_shopify_va_task',arguments:{workflow_id:'customer_reply',client_brief:'Private client content'}})).isError,true);
      const guide = await client.callTool({name:'read_shopify_skill',arguments:{name:'shopify-va',resource:'references/connected-store-work.md'}});
      assert.equal(guide.isError,undefined);
      assert.ok(guide.structuredContent.text.length > 100);
      const connection = await client.callTool({name:'shopify_connection_status',arguments:{}});
      assert.equal(connection.structuredContent.connected,false);
      assert.equal((await client.callTool({name:'shopify_get_shop',arguments:{}})).isError,true);
      for (const [name,id] of [['shopify_get_product_details','gid://shopify/Product/1'],['shopify_get_order_details','gid://shopify/Order/1']]) {
        const result = await client.callTool({name,arguments:{id}});
        assert.equal(result.isError,true); assert.equal(result.structuredContent.error.code,'NOT_CONNECTED');
      }
      console.log(`Verified extracted standalone runtime using ${config}: 19 skills, 8 complete VA workflows, 12 read-only tools, Node contract parity, no credentials required.`);
    } finally { await client.close(); }
  }
} finally { await rm(destination,{recursive:true,force:true}); }
