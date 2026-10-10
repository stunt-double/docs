import assert from 'node:assert/strict';
import { test } from 'node:test';

import { absoluteUrl } from './site.ts';

test('builds absolute docs.stuntdouble.io URLs', () => {
  assert.equal(absoluteUrl('/'), 'https://docs.stuntdouble.io');
  assert.equal(absoluteUrl('/guides/figma'), 'https://docs.stuntdouble.io/guides/figma');
  assert.equal(absoluteUrl('concepts'), 'https://docs.stuntdouble.io/concepts');
});
