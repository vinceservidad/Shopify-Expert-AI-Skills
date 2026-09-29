import { build } from 'esbuild';
await build({ entryPoints: ['src/stdio.ts'], bundle: true, platform: 'node', target: 'node24',
  format: 'cjs', outfile: 'build/plugin/connector.cjs', legalComments: 'linked' });
