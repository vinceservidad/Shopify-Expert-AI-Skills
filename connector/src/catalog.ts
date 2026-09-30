import { readdir, readFile, realpath } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { parseDocument } from 'yaml';
import { ConnectorError } from './shopify.js';

export type Skill = { name: string; description: string };

export async function discoverSkillsRoot(): Promise<string> {
  if (process.env.SHOPIFY_SKILLS_ROOT) return realpath(process.env.SHOPIFY_SKILLS_ROOT);
  let directory = dirname(resolve(process.argv[1] ?? '.'));
  for (let depth = 0; depth < 4; depth++) {
    try { return await realpath(join(directory, 'skills')); } catch { directory = dirname(directory); }
  }
  throw new ConnectorError('SKILLS_UNAVAILABLE', 'Set SHOPIFY_SKILLS_ROOT to the complete skills directory.');
}

export async function listSkills(root: string): Promise<Skill[]> {
  const entries = await readdir(root, { withFileTypes: true });
  return Promise.all(entries.filter(entry => entry.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name)).map(async entry => {
      const text = await readSkill(root, entry.name);
      try {
        const lines = text.split(/\r?\n/), closing = lines.indexOf('---', 1);
        if (lines[0] !== '---' || closing < 1) throw new Error('Missing frontmatter');
        const document = parseDocument(lines.slice(1, closing).join('\n'), { prettyErrors: false });
        if (document.errors.length || document.warnings.length) throw new Error('Invalid YAML');
        const metadata = document.toJS({ maxAliasCount: 50 }) as { name?: unknown; description?: unknown };
        if (metadata?.name !== entry.name || typeof metadata.description !== 'string' || !metadata.description.trim()) {
          throw new Error('Invalid skill identity');
        }
        return { name: entry.name, description: metadata.description };
      } catch { throw new ConnectorError('INVALID_SKILL_METADATA', 'Skill discovery found invalid frontmatter. Validate the installed skill package.'); }
    }));
}

export async function readSkill(root: string, name: string, resource = 'SKILL.md'): Promise<string> {
  if (!/^shopify-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
      || !(resource === 'SKILL.md' || /^references\/[a-z0-9][a-z0-9_/-]*\.md$/i.test(resource))
      || resource.split('/').includes('..')) {
    throw new ConnectorError('INVALID_SKILL_PATH', 'Choose a listed skill and SKILL.md or its Markdown reference path.');
  }
  const realRoot = await realpath(root);
  try {
    const skillRoot = await realpath(join(realRoot, name));
    if (basename(skillRoot) !== name || dirname(skillRoot) !== realRoot) throw new Error('Outside catalog');
    const target = await realpath(join(skillRoot, resource));
    const path = relative(skillRoot, target);
    if (path.startsWith('..') || isAbsolute(path)) throw new Error('Outside skill');
    return await readFile(target, 'utf8');
  } catch { throw new ConnectorError('SKILL_NOT_FOUND', 'This skill or reference is unavailable in the installed package.'); }
}
