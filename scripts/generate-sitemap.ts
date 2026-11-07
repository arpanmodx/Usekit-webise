import fs from 'fs';
import path from 'path';
import { TOOLS, CATEGORIES } from '../src/lib/tools';
import { getSiteUrl } from '../src/lib/siteConfig';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://usekit-daily.vercel.app').replace(/\/+$/, '');
const today = new Date().toISOString().split('T')[0];

const LEGAL_SLUGS = [
  'privacy-policy',
  'terms-and-conditions',
  'about-us',
  'contact-us',
  'disclaimer',
  'cookie-policy',
];

const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
  { loc: `${siteUrl}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
];

for (const tool of TOOLS) {
  urls.push({
    loc: `${siteUrl}/${tool.slug}`,
    lastmod: tool.dateAdded || today,
    changefreq: 'weekly',
    priority: '0.9',
  });
}

for (const cat of CATEGORIES) {
  urls.push({
    loc: `${siteUrl}/category/${cat.slug}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
  });
}

for (const slug of LEGAL_SLUGS) {
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
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf-8');
console.log(`Generated public/sitemap.xml with ${urls.length} URLs for ${siteUrl}`);
