import { getSiteUrl, SITE_CONFIG } from './siteConfig';
import type { ToolDefinition, CategoryDefinition } from './tools';

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogType: 'website' | 'article';
  robots: string;
  jsonLd: Record<string, unknown>[];
}

export function buildHomeMetadata(): PageMetadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(SITE_CONFIG.name)}&subtitle=${encodeURIComponent(SITE_CONFIG.tagline)}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      alternateName: SITE_CONFIG.tagline,
      url: canonical,
      description: SITE_CONFIG.defaultDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.organization.name,
      legalName: SITE_CONFIG.organization.legalName,
      url: canonical,
      logo: `${siteUrl}/icon.svg`,
    },
  ];

  return {
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    canonical,
    ogTitle: SITE_CONFIG.defaultTitle,
    ogDescription: SITE_CONFIG.defaultDescription,
    ogUrl: canonical,
    ogImage,
    ogType: 'website',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    jsonLd,
  };
}

export function buildToolMetadata(tool: ToolDefinition): PageMetadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/${tool.slug}`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(tool.name)}&subtitle=${encodeURIComponent(tool.shortDescription)}&category=${encodeURIComponent(tool.category)}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      url: canonical,
      description: tool.metaDescription,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. HTML5 compliant browser.',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: `${siteUrl}/`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.category,
          item: `${siteUrl}/category/${tool.categorySlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: canonical,
        },
      ],
    },
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return {
    title: tool.seoTitle,
    description: tool.metaDescription,
    canonical,
    ogTitle: tool.seoTitle,
    ogDescription: tool.metaDescription,
    ogUrl: canonical,
    ogImage,
    ogType: 'website',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    jsonLd,
  };
}

export function buildCategoryMetadata(category: CategoryDefinition): PageMetadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/category/${category.slug}`;
  const title = `${category.name} — Free Online ${category.name} | ${SITE_CONFIG.name}`;
  const description = category.seoDescription;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(category.name)}&subtitle=${encodeURIComponent(category.description)}&category=Category`;

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description,
      url: canonical,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category.name,
          item: canonical,
        },
      ],
    },
  ];

  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage,
    ogType: 'website',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    jsonLd,
  };
}

export function buildStaticPageMetadata(
  slug: string,
  pageTitle: string,
  description: string,
  noindex = false
): PageMetadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/${slug.replace(/^\/+/, '')}`;
  const fullTitle = `${pageTitle} | ${SITE_CONFIG.name}`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(pageTitle)}&subtitle=${encodeURIComponent(SITE_CONFIG.tagline)}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: fullTitle,
      description,
      url: canonical,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pageTitle,
          item: canonical,
        },
      ],
    },
  ];

  return {
    title: fullTitle,
    description,
    canonical,
    ogTitle: fullTitle,
    ogDescription: description,
    ogUrl: canonical,
    ogImage,
    ogType: 'website',
    robots: noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    jsonLd,
  };
}

/**
 * Synchronizes document head metadata and JSON-LD scripts during client-side navigation
 */
export function applyClientMetadata(meta: PageMetadata): void {
  if (typeof document === 'undefined') return;
  document.title = meta.title;

  const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
    let el = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  setMetaTag('meta[name="robots"]', 'name', 'robots', meta.robots);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.ogTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.ogDescription);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.ogUrl);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.ogTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.ogDescription);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', meta.ogImage);

  let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', meta.canonical);

  // Replace JSON-LD scripts
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((node) => node.remove());
  meta.jsonLd.forEach((schemaObj) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObj);
    document.head.appendChild(script);
  });
}
