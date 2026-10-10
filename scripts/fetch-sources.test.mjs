import assert from 'node:assert/strict';
import { test } from 'node:test';

import { highestSemverTag } from './fetch-sources.mjs';

test('picks the highest semver tag numerically, skipping pre-releases and non-semver', () => {
  const out = [
    'a\trefs/tags/v1.9.0',
    'b\trefs/tags/v1.14.0',
    'c\trefs/tags/v1.13.2',
    'd\trefs/tags/v2.0.0-rc.1',
    'e\trefs/tags/latest',
    'f\trefs/tags/desktop-v9.0.0',
  ].join('\n');
  assert.equal(highestSemverTag(out), 'v1.14.0');
});

test('returns null when there is no release tag', () => {
  assert.equal(highestSemverTag(''), null);
  assert.equal(highestSemverTag('a\trefs/tags/nightly'), null);
});
