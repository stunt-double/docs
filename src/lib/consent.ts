// Ported from @stuntdouble/ui/consent in the Stunt Double monorepo. Keep the cookie
// names, version and signals in step with it: one choice covers every stuntdouble.io site.

/**
 * Analytics consent for the public sites (stuntdouble.io, index.stuntdouble.io).
 * It covers Google Analytics and, on the marketing site, the Opinly pixel,
 * which is only loaded once analytics are allowed (`ConsentGate`).
 *
 * Whether a visitor is asked first depends on where they are. Each app's
 * proxy writes `sd_consent_region` from Vercel's geolocation: `required` in the
 * EEA, the UK and Switzerland (and whenever the location is unknown, including
 * a page served without the proxy), `optional` everywhere else.
 *
 * - `required`: consent mode v2 in its advanced form. gtag loads on every page
 *   with every signal denied, so Google Analytics sends only cookieless pings
 *   (which GA4 leaves out of its reports) until the visitor allows it, and the
 *   banner opens on its own.
 * - `optional`: every signal starts granted and the banner stays closed. The
 *   footer's "Cookie settings" still opens it, and a decline turns everything
 *   off exactly as it does in a `required` region.
 *
 * One Allow grants every signal in `GRANTED_SIGNALS`: analytics, plus the
 * three ad signals Google Ads needs to measure conversions and build
 * remarketing audiences from the GA4 property.
 *
 * The choice lives in a cookie on the registrable domain rather than in
 * localStorage, so one answer covers both sites (and GA's own `_ga` cookie is
 * shared across them the same way). Anywhere else (previews, localhost) the
 * cookie is host-only.
 */

export type ConsentChoice = 'granted' | 'denied';

export const CONSENT_COOKIE = 'sd_consent';

/**
 * Written by each app's proxy: `optional` where analytics may run until turned
 * off, `required` (or missing) where they wait for an Allow. Mirrors
 * `CONSENT_REGION_COOKIE` in `@stuntdouble/platform/ads/attribution`, which owns
 * the country list.
 */
export const CONSENT_REGION_COOKIE = 'sd_consent_region';

/**
 * Bumped whenever the banner starts asking for more than it did, so a choice
 * made against the old wording is not stretched to cover the new one: an
 * older value reads as no choice and the banner asks again. 2 added the ad
 * signals to what Allow grants.
 */
const CONSENT_VERSION = 2;

/** Ask again after a year, the usual ceiling for a remembered choice. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Dispatched on `window` to reopen the banner (the footer's "Cookie settings"). */
export const CONSENT_OPEN_EVENT = 'sd:consent-open';

/** Dispatched on `window` after a choice is saved, with the choice as `detail`. */
export const CONSENT_CHANGE_EVENT = 'sd:consent-change';

const SHARED_DOMAIN = 'stuntdouble.io';

/** What a single Allow grants. Declining sets all of them back to denied. */
const GRANTED_SIGNALS = [
  'analytics_storage',
  'ad_storage',
  'ad_user_data',
  'ad_personalization',
] as const;

function signals(choice: ConsentChoice): Record<(typeof GRANTED_SIGNALS)[number], ConsentChoice> {
  return Object.fromEntries(GRANTED_SIGNALS.map((signal) => [signal, choice])) as Record<
    (typeof GRANTED_SIGNALS)[number],
    ConsentChoice
  >;
}

type Gtag = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  const fn = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof fn === 'function') fn(...args);
}

function cookieDomain(): string {
  const host = window.location.hostname;
  return host === SHARED_DOMAIN || host.endsWith(`.${SHARED_DOMAIN}`)
    ? `; Domain=.${SHARED_DOMAIN}`
    : '';
}

export function readConsent(): ConsentChoice | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)\\.${CONSENT_VERSION}(?:;|$)`)
  );
  return match ? (match[1] as ConsentChoice) : null;
}

/**
 * Whether the visitor has to allow analytics before they run. True unless the
 * proxy said otherwise, so a missing or unreadable cookie never switches
 * tracking on.
 */
export function consentRequired(): boolean {
  return !new RegExp(`(?:^|; )${CONSENT_REGION_COOKIE}=optional(?:;|$)`).test(document.cookie);
}

/**
 * What is actually in force: the visitor's choice if they made one, otherwise
 * the default for their region (`granted` where consent is optional, null,
 * meaning nothing runs yet, where it is required). A decline on an older
 * banner still counts: asking for more never turns a no into a yes.
 */
export function effectiveConsent(): ConsentChoice | null {
  const choice = readConsent();
  if (choice) return choice;
  if (new RegExp(`(?:^|; )${CONSENT_COOKIE}=denied(?:\\.\\d+)?(?:;|$)`).test(document.cookie)) {
    return 'denied';
  }
  return consentRequired() ? null : 'granted';
}

/**
 * The Opinly pixel keeps its visitor and session ids in web storage rather
 * than cookies (keys as named in static.opinly.ai/p.js).
 */
function clearOpinlyStorage() {
  for (const area of [window.localStorage, window.sessionStorage]) {
    try {
      for (const key of Object.keys(area)) {
        if (key.startsWith('_opinly_') || key.startsWith('opinly_')) area.removeItem(key);
      }
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
  }
}

/** Remove Google's own cookies, so withdrawing consent also clears what they set. */
function clearAnalyticsCookies() {
  const names = document.cookie
    .split('; ')
    .map((pair) => pair.split('=')[0] ?? '')
    // `_ga*` are Google Analytics, `_gcl_*` the Google Ads click cookies.
    .filter((name) => name === '_ga' || name.startsWith('_ga_') || name.startsWith('_gcl_'));
  for (const name of names) {
    for (const domain of [
      '',
      `; Domain=.${SHARED_DOMAIN}`,
      `; Domain=${window.location.hostname}`,
    ]) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
    }
  }
}

export function setConsent(choice: ConsentChoice) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${choice}.${CONSENT_VERSION}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${cookieDomain()}${secure}`;
  gtag('consent', 'update', signals(choice));
  if (choice === 'denied') {
    clearAnalyticsCookies();
    clearOpinlyStorage();
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGE_EVENT, { detail: choice }));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/**
 * The consent defaults, as an inline script for `<head>`. It has to run before
 * gtag's `config` command or the defaults do not apply, which is why it is a
 * parser-blocking inline script rather than a `next/script`: those run after
 * hydration, the same time as the Google Analytics tag itself.
 *
 * Every signal starts granted where the proxy marked the region `optional`,
 * and denied everywhere else. A saved choice is then applied synchronously,
 * so a returning visitor's first page view already reflects it: an Allow from
 * the current banner grants, and a decline from any banner denies.
 */
export const CONSENT_DEFAULTS_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
(function(c){
gtag('consent','default',/(?:^|; )${CONSENT_REGION_COOKIE}=optional(?:;|$)/.test(c)?${JSON.stringify(signals('granted'))}:${JSON.stringify(signals('denied'))});
gtag('set','ads_data_redaction',true);
if(/(?:^|; )${CONSENT_COOKIE}=granted\\.${CONSENT_VERSION}(?:;|$)/.test(c)){gtag('consent','update',${JSON.stringify(signals('granted'))});}
else if(/(?:^|; )${CONSENT_COOKIE}=denied(?:\\.\\d+)?(?:;|$)/.test(c)){gtag('consent','update',${JSON.stringify(signals('denied'))});}
})(document.cookie);`;
