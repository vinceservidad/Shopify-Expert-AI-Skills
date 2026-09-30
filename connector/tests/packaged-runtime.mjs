import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

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
      assert.equal((await client.listTools()).tools.length,8);
      const skills = await client.callTool({name:'list_shopify_skills',arguments:{}});
      assert.equal(skills.structuredContent.skills.length,19);
      const guide = await client.callTool({name:'read_shopify_skill',arguments:{name:'shopify-va',resource:'references/connected-store-work.md'}});
      assert.equal(guide.isError,undefined);
      assert.ok(guide.structuredContent.text.length > 100);
      const connection = await client.callTool({name:'shopify_connection_status',arguments:{}});
      assert.equal(connection.structuredContent.connected,false);
      assert.equal((await client.callTool({name:'shopify_get_shop',arguments:{}})).isError,true);
      console.log(`Verified extracted standalone runtime using ${config}: 19 skills, 8 read-only tools, no credentials required.`);
    } finally { await client.close(); }
  }
} finally { await rm(destination,{recursive:true,force:true}); }
