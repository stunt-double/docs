import assert from 'node:assert/strict';
import { test } from 'node:test';

import { AGENTS_MD, llmsTxt, markdownUrl } from './agents.ts';

test('points a page path at its absolute Markdown twin', () => {
  assert.equal(markdownUrl('/'), 'https://docs.stuntdouble.io/index.md');
  assert.equal(markdownUrl('/guides/figma'), 'https://docs.stuntdouble.io/guides/figma.md');
  assert.equal(markdownUrl('/mcp/'), 'https://docs.stuntdouble.io/mcp.md');
});

test('llms.txt swaps the title and makes links absolute Markdown', () => {
  const out = llmsTxt('# Docs\n\n\n- **Start here**\n- [Quickstart](/getting-started): Begin.\n- [Site](https://x.io)\n');
  assert.match(out, /^# Stunt Double Docs\n\n> /);
  assert.ok(!/^# Docs$/m.test(out));
  assert.ok(out.includes('- [Quickstart](https://docs.stuntdouble.io/getting-started.md): Begin.'));
  assert.ok(out.includes('- [Site](https://x.io)'));
});

test('agents.md says when to use the docs', () => {
  assert.match(AGENTS_MD, /## When to use these docs/);
  assert.ok(AGENTS_MD.includes('https://app.stuntdouble.io/api/mcp'));
});
