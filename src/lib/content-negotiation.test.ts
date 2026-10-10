import assert from 'node:assert/strict';
import { test } from 'node:test';

import { markdownPath, prefersMarkdown, varyWithAccept } from './content-negotiation.ts';

test('a browser gets HTML, an agent asking for markdown gets markdown', () => {
  assert.equal(prefersMarkdown('text/html,application/xhtml+xml,*/*;q=0.8'), false);
  assert.equal(prefersMarkdown(undefined), false);
  assert.equal(prefersMarkdown('text/markdown'), true);
  assert.equal(prefersMarkdown('text/markdown, text/html;q=0.5'), true);
  assert.equal(prefersMarkdown('text/html;q=0, */*'), true);
});

test('Vary gains Accept once', () => {
  assert.equal(varyWithAccept(null), 'Accept');
  assert.equal(varyWithAccept('rsc'), 'rsc, Accept');
  assert.equal(varyWithAccept('rsc, Accept'), 'rsc, Accept');
});

test('markdown paths map onto the /md route', () => {
  assert.equal(markdownPath('/'), '/md');
  assert.equal(markdownPath('/concepts'), '/md/concepts');
  assert.equal(markdownPath('/guides/figma.md'), '/md/guides/figma');
  assert.equal(markdownPath('/index.md'), '/md');
});
