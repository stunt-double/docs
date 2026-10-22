import assert from 'node:assert/strict';
import { test } from 'node:test';

import { docsHref } from './links.ts';

test('maps old docs links to docs paths and other root links to marketing', () => {
  assert.equal(docsHref('/support/docs'), '/');
  assert.equal(docsHref('/support/docs/api/mcp#scopes'), '/api/mcp#scopes');
  assert.equal(docsHref('/guides/figma'), '/guides/figma');
  assert.equal(docsHref('/integrations'), '/integrations');
  assert.equal(docsHref('/mcp/connect#auth'), '/mcp/connect#auth');
  assert.equal(docsHref('/tutorials/self-hosted-worker'), '/tutorials/self-hosted-worker');
  assert.equal(docsHref('/index-ranking/improve-your-score'), '/index-ranking/improve-your-score');
  assert.equal(docsHref('/mcpx'), 'https://www.stuntdouble.io/mcpx');
  assert.equal(docsHref('/pricing'), 'https://www.stuntdouble.io/pricing');
  assert.equal(docsHref('/support'), 'https://www.stuntdouble.io/support');
  assert.equal(docsHref('/support/docsx'), 'https://www.stuntdouble.io/support/docsx');
  assert.equal(docsHref('https://a.b/c'), 'https://a.b/c');
  assert.equal(docsHref('#anchor'), '#anchor');
});
