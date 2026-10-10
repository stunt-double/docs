// Ported from @stuntdouble/platform/ads/attribution in the Stunt Double monorepo.
// Keep the country list in step with it.

/**
 * Whether the visitor's location needs an explicit opt-in before analytics
 * and ad cookies run. Each app's proxy writes it from Vercel's geolocation,
 * and the consent banner and defaults in `@stuntdouble/ui/consent` read it
 * (that module mirrors the name, since this one has no runtime imports).
 */
export const CONSENT_REGION_COOKIE = 'sd_consent_region';

/** `required`: ask first, everything off until an Allow. `optional`: on until turned off. */
export type ConsentRegion = 'required' | 'optional';

/**
 * Where analytics and ad cookies need opt-in consent: the EEA (the EU plus
 * Iceland, Liechtenstein and Norway) under the GDPR and ePrivacy Directive,
 * the UK under UK GDPR and PECR, and Switzerland under the FADP. The same
 * list Google asks consent mode v2 to cover.
 */
const CONSENT_REQUIRED_COUNTRIES = new Set([
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
  'IS',
  'LI',
  'NO',
  'GB',
  'CH',
]);

/**
 * The consent region for an ISO 3166-1 alpha-2 country code, as Vercel's
 * `x-vercel-ip-country` header gives it. An unknown or missing country asks
 * first: not knowing where someone is must never switch tracking on.
 */
export function consentRegionForCountry(country: string | null | undefined): ConsentRegion {
  if (typeof country !== 'string' || !/^[A-Za-z]{2}$/.test(country.trim())) return 'required';
  return CONSENT_REQUIRED_COUNTRIES.has(country.trim().toUpperCase()) ? 'required' : 'optional';
}
