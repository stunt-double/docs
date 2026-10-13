import assert from 'node:assert/strict';
import { test } from 'node:test';

import { GALLERY_BRANDS, GALLERY_ICONS, ICON_CATEGORIES } from '../src/components/icon-gallery-data.ts';
import { svgInner } from './sync-icons.mjs';

test('svgInner keeps only the elements inside the root svg', () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <path d="M4 12h16"/>\n  <path d="M14 6l6 6-6 6"/>\n</svg>\n`;
  assert.equal(svgInner(svg), '<path d="M4 12h16"/> <path d="M14 6l6 6-6 6"/>');
});

test('svgInner keeps attributes apart when a tag wraps across lines', () => {
  const svg = `<svg viewBox="0 0 24 24">\n  <path\n    d="M4 12h16"\n    fill="#000"\n  />\n</svg>`;
  assert.equal(svgInner(svg), '<path d="M4 12h16" fill="#000" />');
});

test('svgInner rejects a file that is not an SVG', () => {
  assert.throws(() => svgInner('<html></html>'), /not an SVG/);
});

test('every vendored icon has geometry and a known category', () => {
  assert.ok(GALLERY_ICONS.length > 0);
  const names = new Set();
  for (const icon of GALLERY_ICONS) {
    assert.ok(icon.svg.length > 0, icon.name);
    assert.ok(ICON_CATEGORIES.includes(icon.category), icon.name);
    assert.ok(!names.has(icon.name), `duplicate ${icon.name}`);
    names.add(icon.name);
  }
});

test('every vendored brand mark has a color and a mono variant', () => {
  assert.ok(GALLERY_BRANDS.length > 0);
  for (const brand of GALLERY_BRANDS) {
    assert.ok(brand.color.length > 0, brand.name);
    assert.ok(brand.mono.length > 0, brand.name);
  }
});
