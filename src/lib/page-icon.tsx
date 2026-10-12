import { icons } from 'lucide-react';
import { createElement, type ReactNode } from 'react';

import { BrandIcon, isBrandIcon } from '@/components/brand-icons';
import { isProductIcon, ProductIcon } from '@/components/icons';

/**
 * The sidebar icon for a page or folder's `icon` name. A Continuity product
 * icon (`actor`, `checklist`, ...) wins, then a brand glyph for an
 * integration or AI provider (`github`, `cursor`, ...); anything else is a Lucide name
 * (`GitBranch`), drawn on the product icons' 1.5 stroke, square caps and
 * mitred joins so the two sets sit together.
 */
export function pageIcon(name: string | undefined): ReactNode {
  if (!name) return undefined;
  if (isProductIcon(name)) return createElement(ProductIcon, { name });
  if (isBrandIcon(name)) return createElement(BrandIcon, { name });
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) {
    console.warn(`Unknown page icon: ${name}`);
    return undefined;
  }
  return createElement(Icon, { strokeWidth: 1.5, strokeLinecap: 'square', strokeLinejoin: 'miter' });
}
