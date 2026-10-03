import { renderDocsOgImage } from '../_components/docs-og';

export const alt = 'Stunt Double documentation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderDocsOgImage('/support/docs/stuntkit');
}
