export function getSiteUrl(): string {
  let raw = 'https://usekit-daily.vercel.app';
  try {
    if (typeof window !== 'undefined' && window.location?.origin) {
      const origin = window.location.origin;
      if (
        !origin.includes('localhost') &&
        !origin.includes('127.0.0.1') &&
        !origin.includes('asia-east1.run.app')
      ) {
        return origin.replace(/\/+$/, '');
      }
    }
  } catch {
    // Ignore
  }

  try {
    if (typeof process !== 'undefined' && process.env) {
      const appUrl = process.env.APP_URL;
      const validAppUrl =
        appUrl && !appUrl.includes('asia-east1.run.app') ? appUrl : undefined;
      raw =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.VITE_SITE_URL ||
        validAppUrl ||
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
  directAdLinkUrl: 'https://araplhn.org/4/38abcde1f415ac84b6e48b711cf82e3e',
  smartLinks: [
    {
      id: '32285739',
      label: 'Explore Featured Partner Tools →',
      url: 'https://asiafilm.org/4/42129c6a2706766cb389ff8554a4e364',
    },
    {
      id: '32286720',
      label: 'Recommended Web Offers →',
      url: 'https://asiafilm.org/4/5c60cc61ae51fb58152b63506543f139',
    },
    {
      id: '32285957',
      label: 'Discover Featured Resources →',
      url: 'https://araplhn.org/4/38abcde1f415ac84b6e48b711cf82e3e',
    },
  ],
  organization: {
    name: 'UseKit',
    legalName: 'UseKit Web Utilities',
    foundingDate: '2025',
  },
};
