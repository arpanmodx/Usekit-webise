import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  TOOLS,
  CATEGORIES,
  getToolBySlug,
  getCategoryBySlug,
} from './src/lib/tools';
import { getSiteUrl, SITE_CONFIG } from './src/lib/siteConfig';
import {
  buildHomeMetadata,
  buildToolMetadata,
  buildCategoryMetadata,
  buildStaticPageMetadata,
  type PageMetadata,
} from './src/lib/seo';

dotenv.config();

const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const LEGAL_PAGES: Record<string, { title: string; description: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description:
      'Read the UseKit Privacy Policy. Learn how our client-side calculators and utilities protect your privacy by processing data in your browser.',
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions',
    description:
      'Review the Terms and Conditions for using UseKit online calculators, converters, and everyday utilities.',
  },
  'about-us': {
    title: 'About Us',
    description:
      'Learn about UseKit — Everyday Tools. All in One Place. Built for speed, accuracy, accessibility, and 100% browser privacy.',
  },
  'contact-us': {
    title: 'Contact Us',
    description:
      'Contact the UseKit engineering team to report an issue, suggest a new utility tool, or ask a question.',
  },
  disclaimer: {
    title: 'Disclaimer',
    description:
      'Read the UseKit informational disclaimer regarding financial, tax, health, and general utility calculations.',
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description:
      'Understand how UseKit uses essential local storage and optional advertising/analytics cookies.',
  },
};

function resolveRouteMetadataAndHtml(pathname: string): {
  status: number;
  meta: PageMetadata;
  ssrShellHtml: string;
} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const seg = clean.startsWith('/') ? clean.slice(1) : clean;

  if (clean === '/') {
    const meta = buildHomeMetadata();
    const ssrShellHtml = `
      <div class="sr-only">
        <h1>${escapeHtml(SITE_CONFIG.h1)}</h1>
        <p>${escapeHtml(SITE_CONFIG.tagline)} — ${escapeHtml(SITE_CONFIG.defaultDescription)}</p>
        <h2>Popular Calculators & Everyday Utilities</h2>
        <ul>
          ${TOOLS.map((t) => `<li><a href="/${t.slug}">${escapeHtml(t.name)}</a>: ${escapeHtml(t.shortDescription)}</li>`).join('')}
        </ul>
      </div>
    `;
    return { status: 200, meta, ssrShellHtml };
  }

  if (seg.startsWith('category/')) {
    const catSlug = seg.replace('category/', '');
    const cat = getCategoryBySlug(catSlug);
    if (cat) {
      const meta = buildCategoryMetadata(cat);
      const ssrShellHtml = `
        <div class="sr-only">
          <h1>${escapeHtml(cat.name)}</h1>
          <p>${escapeHtml(cat.seoDescription)}</p>
        </div>
      `;
      return { status: 200, meta, ssrShellHtml };
    }
  }

  if (seg in LEGAL_PAGES) {
    const info = LEGAL_PAGES[seg];
    const meta = buildStaticPageMetadata(seg, info.title, info.description);
    const ssrShellHtml = `
      <div class="sr-only">
        <h1>${escapeHtml(info.title)}</h1>
        <p>${escapeHtml(info.description)}</p>
      </div>
    `;
    return { status: 200, meta, ssrShellHtml };
  }

  const tool = getToolBySlug(seg);
  if (tool) {
    const meta = buildToolMetadata(tool);
    const ssrShellHtml = `
      <div class="sr-only">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/category/${tool.categorySlug}">${escapeHtml(tool.category)}</a> / <span>${escapeHtml(tool.name)}</span>
        </nav>
        <h1>${escapeHtml(tool.name)}</h1>
        <p>${escapeHtml(tool.shortDescription)}</p>
        <h2>How to Use ${escapeHtml(tool.name)}</h2>
        <ol>${tool.howTo.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
        ${tool.guideSections
          .map(
            (g) =>
              `<h2>${escapeHtml(g.heading)}</h2>${g.paragraphs
                .map((p) => `<p>${escapeHtml(p)}</p>`)
                .join('')}`
          )
          .join('')}
        <h2>Frequently Asked Questions</h2>
        ${tool.faqs
          .map(
            (f) =>
              `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`
          )
          .join('')}
      </div>
    `;
    return { status: 200, meta, ssrShellHtml };
  }

  const meta = buildStaticPageMetadata(
    seg || '404',
    '404 — Page Not Found',
    'The requested page or utility tool could not be found on UseKit.',
    true
  );
  return {
    status: 404,
    meta,
    ssrShellHtml: `<div class="sr-only"><h1>404 — Page or Tool Not Found</h1></div>`,
  };
}

function injectMetadataIntoHtml(
  templateHtml: string,
  meta: PageMetadata,
  ssrShellHtml: string
): string {
  let html = templateHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(meta.title)}</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(meta.robots)}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(meta.ogUrl)}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(meta.ogDescription)}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />`
  );

  const schemaScripts = meta.jsonLd
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n    ');

  html = html.replace('<!--Server-Injected-Schema-->', schemaScripts);
  html = html.replace('<!--Server-Injected-SEO-Shell-->', ssrShellHtml);

  return html;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Security Headers (AdSense & Modern Browser Compatible)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self' https: data: blob:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' ws: wss: https:",
        "frame-src 'self' https:",
        "frame-ancestors *",
      ].join('; ')
    );
    next();
  });

  // Dynamic /robots.txt using NEXT_PUBLIC_SITE_URL
  app.get('/robots.txt', (_req, res) => {
    const siteUrl = getSiteUrl();
    const txt = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      '',
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(txt);
  });

  // Dynamic /sitemap.xml generated from the single tool registry
  app.get('/sitemap.xml', (_req, res) => {
    const siteUrl = getSiteUrl();
    const today = new Date().toISOString().split('T')[0];

    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
      { loc: `${siteUrl}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    ];

    // Add all Tools from registry
    for (const tool of TOOLS) {
      urls.push({
        loc: `${siteUrl}/${tool.slug}`,
        lastmod: tool.dateAdded || today,
        changefreq: 'weekly',
        priority: '0.9',
      });
    }

    // Add all Category pages
    for (const cat of CATEGORIES) {
      urls.push({
        loc: `${siteUrl}/category/${cat.slug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8',
      });
    }

    // Add Legal & Company pages
    for (const slug of Object.keys(LEGAL_PAGES)) {
      urls.push({
        loc: `${siteUrl}/${slug}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: '0.5',
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  });

  // Dynamic OpenGraph Social Card endpoint (/api/og)
  app.get('/api/og', (req, res) => {
    const title = String(req.query.title || SITE_CONFIG.name).slice(0, 70);
    const subtitle = String(req.query.subtitle || SITE_CONFIG.tagline).slice(0, 120);
    const category = String(req.query.category || 'Everyday Utility').slice(0, 40);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#0F172A"/>
      <rect x="64" y="64" width="1072" height="502" rx="32" fill="#1E293B" stroke="#334155" stroke-width="2"/>
      <text x="120" y="160" fill="#60A5FA" font-family="sans-serif" font-size="24" font-weight="600">${escapeHtml(
        SITE_CONFIG.name
      )} · ${escapeHtml(category)}</text>
      <text x="120" y="290" fill="#FFFFFF" font-family="sans-serif" font-size="60" font-weight="700">${escapeHtml(
        title
      )}</text>
      <text x="120" y="370" fill="#94A3B8" font-family="sans-serif" font-size="28" font-weight="400">${escapeHtml(
        subtitle
      )}</text>
      <text x="120" y="495" fill="#64748B" font-family="sans-serif" font-size="22" font-weight="500">${escapeHtml(
        SITE_CONFIG.tagline
      )} — 100% Browser-First &amp; Private</text>
    </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(svg);
  });

  // Serverless Contact Form Route
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    res.status(200).json({
      ok: true,
      receivedAt: new Date().toISOString(),
      summary: `Message from ${String(name).slice(0, 60)} (${String(subject || 'General').slice(0, 80)}) received.`,
    });
  });

  // First-Party IP & Edge Header Inspector (/api/ip)
  app.get('/api/ip', (req, res) => {
    const forwarded = String(req.headers['x-forwarded-for'] || '');
    const ip = forwarded.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    const country = String(req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || 'Detected via Edge');
    const city = String(req.headers['x-vercel-ip-city'] || 'Local / Edge Node');
    const region = String(req.headers['x-vercel-ip-country-region'] || '—');
    const timezone = String(req.headers['x-vercel-ip-timezone'] || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    const language = String(req.headers['accept-language'] || 'en-US').split(',')[0];

    res.status(200).json({
      ip,
      country,
      city,
      region,
      timezone,
      language,
    });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      const pathname = url.split('?')[0];

      // Let static assets pass through
      if (pathname.includes('.') && !pathname.endsWith('.html')) {
        next();
        return;
      }

      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const { status, meta, ssrShellHtml } = resolveRouteMetadataAndHtml(pathname);
        const finalHtml = injectMetadataIntoHtml(template, meta, ssrShellHtml);
        res.status(status).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(finalHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.use('*', (req, res) => {
      const pathname = req.originalUrl.split('?')[0];
      const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
      const { status, meta, ssrShellHtml } = resolveRouteMetadataAndHtml(pathname);
      const finalHtml = injectMetadataIntoHtml(template, meta, ssrShellHtml);
      res.status(status).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(finalHtml);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UseKit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
