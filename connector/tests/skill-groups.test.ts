import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SKILL_COUNT, SKILL_GROUPS } from '../src/public-ui/skill-groups.js';

const skills = join(import.meta.dirname, '../../skills');
const canonical = readdirSync(skills).filter(name => statSync(join(skills, name)).isDirectory()).sort();

test('the public skills tree lists every skill exactly once', () => {
  const listed = SKILL_GROUPS.flatMap(group => group.skills);
  assert.equal(new Set(listed).size, listed.length);
  assert.deepEqual([...listed].sort(), canonical);
  assert.equal(SKILL_COUNT, canonical.length);
  for (const skill of listed) assert.ok(statSync(join(skills, skill, 'SKILL.md')).isFile(), skill);
});
