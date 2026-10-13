import assert from 'node:assert/strict';
import { test } from 'node:test';

import { clean, mcpPages, readmeToMdx } from './generate.mjs';

const at = { repo: 'stunt-double/x', tag: 'v1.0.0' };

test('escapes JSX-like text outside code and keeps code intact', () => {
  const src = ['Use {id} and <b>', '`{inline}`', '```', '<div>{x}</div>', '```'].join('\n');
  assert.equal(
    readmeToMdx(src, at),
    ['Use &#123;id&#125; and &#60;b&#62;', '`{inline}`', '```', '<div>{x}</div>', '```'].join('\n')
  );
});

test('points relative links at the tagged blob and drops comments', () => {
  assert.equal(
    readmeToMdx('<!-- hi -->See [c](./CONTRIBUTING.md#releasing) and [w](https://a.b)', at),
    'See [c](https://github.com/stunt-double/x/blob/v1.0.0/CONTRIBUTING.md#releasing) and [w](https://a.b)'
  );
});

test('keeps blockquote markers', () => {
  assert.equal(readmeToMdx('> > a <b> | c |', at), '> > a &#60;b&#62; | c |');
});

test('turns centred README images into img tags on the raw file', () => {
  assert.equal(
    readmeToMdx('<p align="center">\n  <a href="https://a.b"><img src="./assets/x.gif" alt="A {demo}" width="100%"></a>\n</p>', at),
    `<img src="https://raw.githubusercontent.com/stunt-double/x/v1.0.0/assets/x.gif" alt="A demo" style={{ width: '100%' }} />`
  );
});

test('clean takes out em dashes and internal plugin notes', () => {
  assert.equal(clean('Run it \u2014 all of it \u2014 now'), 'Run it (all of it) now');
  assert.equal(clean('A \u2014 b'), 'A: b');
  assert.equal(clean('| a | \u2014 | \u2014 |'), '| a | n/a | n/a |');
  assert.equal(clean('Keep\n\nSee CONTRIBUTING.md for releases\n\nThis'), 'Keep\n\nThis');
});

test('mcpPages splits the README by client and ends every page with an edit link', () => {
  const readme = [
    '# Server',
    '',
    'Tagline.',
    '',
    'Intro.',
    '',
    '## This repository',
    '',
    'Plugin internals.',
    '',
    '## Quick Start',
    '',
    '### Claude Code',
    '',
    '```bash',
    '# not a heading',
    '```',
    '',
    '### Cursor / Windsurf',
    '',
    'JSON.',
    '',
    '### Skills (any agent)',
    '',
    'Install them.',
    '',
    '| a | b |',
    '',
    '## Available Tools',
    '',
    'Tools table.',
    '',
    '## Verifying changes',
    '',
    'Internal.',
  ].join('\n');
  const pages = mcpPages(
    {
      readme,
      skills: [{ file: 'skills/x/SKILL.md', text: '---\nname: x\ndescription: Do x \u2014 well\n---\n\n# Do X\n\nBody.' }],
      rules: [{ file: 'rules/r.mdc', text: '---\ndescription: A rule.\nalwaysApply: true\n---\n\nr:' }],
      agents: [{ file: 'agents/a.md', text: '---\nname: a\ndescription: An agent\n---\n\n# A\n\n## Use\n' }],
    },
    at
  );
  assert.deepEqual(Object.keys(pages).sort(), [
    'agents.mdx',
    'clients/claude-code.mdx',
    'clients/cursor-windsurf.mdx',
    'clients/meta.json',
    'index.mdx',
    'rules.mdx',
    'skills/index.mdx',
    'skills/meta.json',
    'skills/x.mdx',
    'tools.mdx',
  ]);
  assert.match(pages['index.mdx'], /description: "Tagline\."/);
  assert.doesNotMatch(pages['index.mdx'], /Plugin internals|Internal\./);
  assert.match(pages['clients/cursor-windsurf.mdx'], /title: "Cursor and Windsurf"/);
  assert.match(pages['clients/claude-code.mdx'], /title: "Claude Code"\nicon: "claude-code"\n/);
  assert.doesNotMatch(pages['clients/cursor-windsurf.mdx'], /icon:/);
  assert.match(pages['skills/x.mdx'], /title: "Do X"\ndescription: "Do x: well"/);
  assert.doesNotMatch(pages['skills/index.mdx'], /\| a \|/);
  assert.match(pages['agents.mdx'], /### Use/);
  for (const [path, content] of Object.entries(pages)) {
    if (path.endsWith('.mdx')) assert.match(content, /Edit on GitHub.*blob\/v1\.0\.0\//, path);
    assert.doesNotMatch(content, /\u2014/, path);
  }
});
