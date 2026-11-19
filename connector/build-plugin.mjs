import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const result = await build({ entryPoints: ['src/stdio.ts'], bundle: true, platform: 'node', target: 'node24',
  format: 'cjs', outfile: 'build/plugin/connector.cjs', legalComments: 'linked', metafile: true });
const packages = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
  const marker = input.lastIndexOf('node_modules/');
  if (marker < 0) continue;
  const parts = input.slice(marker + 13).split('/');
  packages.add(join(input.slice(0, marker + 13), parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]));
}
const notices = [];
for (const directory of [...packages].sort()) {
  const metadata = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
  let license;
  for (const filename of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENCE', 'LICENCE.md', 'license']) {
    try { license = await readFile(join(directory, filename), 'utf8'); break; } catch { /* Try the next conventional name. */ }
  }
  if (!license) throw new Error(`Missing bundled dependency license: ${metadata.name}`);
  notices.push(`${metadata.name}@${metadata.version}\n${license}`);
}
await writeFile('build/plugin/THIRD-PARTY-NOTICES.txt', notices.join('\n\n'));
