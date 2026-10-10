import assert from 'node:assert/strict';
import { test } from 'node:test';

import { docsHref } from './links.ts';

test('maps old docs links to docs paths and other root links to marketing', () => {
  assert.equal(docsHref('/support/docs'), '/');
  assert.equal(docsHref('/support/docs/api/mcp#scopes'), '/api/mcp#scopes');
  assert.equal(docsHref('/guides/figma'), '/guides/figma');
  assert.equal(docsHref('/integrations'), 'https://www.stuntdouble.io/integrations');
  assert.equal(docsHref('/support'), 'https://www.stuntdouble.io/support');
  assert.equal(docsHref('/support/docsx'), 'https://www.stuntdouble.io/support/docsx');
  assert.equal(docsHref('https://a.b/c'), 'https://a.b/c');
  assert.equal(docsHref('#anchor'), '#anchor');
});
