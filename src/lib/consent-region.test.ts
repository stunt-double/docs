import assert from 'node:assert/strict';
import { test } from 'node:test';

import { consentRegionForCountry } from './consent-region.ts';

test('the EEA, the UK and Switzerland ask first', () => {
  for (const country of ['DE', 'fr', 'GB', 'CH', 'NO', ' ie ']) {
    assert.equal(consentRegionForCountry(country), 'required', country);
  }
});

test('elsewhere analytics run until turned off', () => {
  for (const country of ['US', 'AU', 'CA', 'JP']) {
    assert.equal(consentRegionForCountry(country), 'optional', country);
  }
});

test('an unknown location asks first', () => {
  for (const country of [undefined, null, '', 'XYZ', '1A']) {
    assert.equal(consentRegionForCountry(country), 'required', String(country));
  }
});
