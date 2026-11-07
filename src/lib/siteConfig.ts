export function getSiteUrl(): string {
  let raw = 'https://usekit.vercel.app';
  try {
    if (typeof process !== 'undefined' && process.env) {
      raw =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.VITE_SITE_URL ||
        process.env.APP_URL ||
        raw;
    }
  } catch {
    // Ignore in strict browser environments
  }

  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    if (metaEnv) {
      raw =
        metaEnv.NEXT_PUBLIC_SITE_URL ||
        metaEnv.VITE_SITE_URL ||
        raw;
    }
  } catch {
    // Ignore in Node SSR context
  }

  return raw.replace(/\/+$/, '');
}

export function isAdsEnabled(): boolean {
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NEXT_PUBLIC_ENABLE_ADS === 'true' || process.env.VITE_ENABLE_ADS === 'true') {
        return true;
      }
    }
  } catch {
    // Ignore
  }
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    if (metaEnv) {
      return metaEnv.NEXT_PUBLIC_ENABLE_ADS === 'true' || metaEnv.VITE_ENABLE_ADS === 'true';
    }
  } catch {
    // Ignore
  }
  return false;
}

export const SITE_CONFIG = {
  name: 'UseKit',
  tagline: 'Everyday Tools. All in One Place.',
  h1: 'All Your Everyday Tools in One Place',
  defaultTitle: 'UseKit — Everyday Tools. All in One Place.',
  defaultDescription:
    'Free, fast, privacy-first online utility tools: calculators, unit converters, text utilities, image & PDF tools, and developer helpers in one place.',
  contactEmail: 'support@usekit.app',
  organization: {
    name: 'UseKit',
    legalName: 'UseKit Web Utilities',
    foundingDate: '2025',
  },
};
