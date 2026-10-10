import assert from 'node:assert/strict';
import { test } from 'node:test';

import { readmeToMdx } from './generate.mjs';

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
