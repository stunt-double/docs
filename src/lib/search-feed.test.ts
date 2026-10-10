import assert from 'node:assert/strict';
import { test } from 'node:test';

import { sectionHash, sectionsFromMdx } from './search-feed.ts';

const page = { path: '/tutorials/x', title: 'X', origin: 'https://docs.stuntdouble.io' };

test('splits at h2 and h3, slugs duplicates, keeps prose only', () => {
  const src = [
    '---',
    'title: "X"',
    '---',
    '# X',
    'An opening paragraph that is long enough to keep as a section.',
    '## Setup',
    'Install the **thing** from [the docs](/a) and carry on with setup.',
    '```ts',
    'const secret = 1;',
    '```',
    '### Setup',
    '<Callout>Text inside a callout survives the tag strip.</Callout> And more.',
    '## Short',
    'tiny',
  ].join('\n');
  const sections = sectionsFromMdx(src, page);
  assert.deepEqual(
    sections.map((s) => [s.heading, s.anchor, s.url]),
    [
      [null, '', 'https://docs.stuntdouble.io/tutorials/x'],
      ['Setup', 'setup', 'https://docs.stuntdouble.io/tutorials/x#setup'],
      ['Setup', 'setup-1', 'https://docs.stuntdouble.io/tutorials/x#setup-1'],
    ]
  );
  assert.equal(sections[1]?.text, 'Install the thing from the docs and carry on with setup.');
  assert.ok(!sections.some((s) => s.text.includes('secret')));
  assert.equal(sections[1]?.hash, sectionHash('X', 'Setup', sections[1]!.text));
});
