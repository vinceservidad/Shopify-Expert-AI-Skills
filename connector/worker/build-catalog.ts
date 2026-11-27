import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { listSkills, readSkill } from '../src/catalog.js';
const root = resolve('../skills');
const skills = await listSkills(root);
const documents: Record<string, string> = {};
for (const skill of skills) {
  documents[`${skill.name}/SKILL.md`] = await readSkill(root, skill.name);
  async function references(directory: string) {
    let entries;
    try { entries = await readdir(join(root, skill.name, directory), { withFileTypes: true }); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return; throw error; }
    for (const entry of entries) {
      const path = `${directory}/${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error('Worker references must not be symlinks.');
      if (entry.isDirectory()) await references(path);
      else if (entry.name.endsWith('.md')) documents[`${skill.name}/${path}`] = await readSkill(root, skill.name, path);
    }
  }
  await references('references');
}
await mkdir('worker/generated', { recursive: true });
await writeFile('worker/generated/catalog.json', JSON.stringify({ skills, documents }));
console.log(`Bundled ${skills.length} canonical skills and ${Object.keys(documents).length} Markdown documents.`);
