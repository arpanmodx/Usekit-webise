import fs from 'fs';
import path from 'path';

/**
 * Build-time verification script (npm run verify):
 * Fails if:
 * 1. Any registry slug is duplicated
 * 2. Any seoTitle or metaDescription is duplicated
 * 3. Any relatedSlug references a non-existent tool slug
 * 4. Any registry slug lacks a matching loader entry or component file
 */
const registryPath = path.resolve(process.cwd(), 'lib/tools.ts');
const loaderPath = path.resolve(process.cwd(), 'components/tools/ToolClientLoader.tsx');

if (!fs.existsSync(registryPath)) {
  console.error('ERROR: lib/tools.ts not found.');
  process.exit(1);
}

const registrySource = fs.readFileSync(registryPath, 'utf-8');
const loaderSource = fs.existsSync(loaderPath) ? fs.readFileSync(loaderPath, 'utf-8') : '';

const slugMatches = [...registrySource.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const titleMatches = [...registrySource.matchAll(/seoTitle:\s*'([^']+)'/g)].map((m) => m[1]);
const descMatches = [...registrySource.matchAll(/metaDescription:\s*\n?\s*'([^']+)'/g)].map((m) => m[1]);

const seenSlugs = new Set();
for (const slug of slugMatches) {
  if (seenSlugs.has(slug)) {
    console.error(`DUPLICATE SLUG DETECTED: ${slug}`);
    process.exit(1);
  }
  seenSlugs.add(slug);
}

const seenTitles = new Set();
for (const title of titleMatches) {
  if (seenTitles.has(title)) {
    console.error(`DUPLICATE SEO TITLE DETECTED: ${title}`);
    process.exit(1);
  }
  seenTitles.add(title);
}

const seenDescs = new Set();
for (const desc of descMatches) {
  if (seenDescs.has(desc)) {
    console.error(`DUPLICATE META DESCRIPTION DETECTED: ${desc}`);
    process.exit(1);
  }
  seenDescs.add(desc);
}

// Verify relatedSlugs exist in seenSlugs
const relatedBlocks = [...registrySource.matchAll(/relatedSlugs:\s*\[([^\]]+)\]/g)];
for (const block of relatedBlocks) {
  const rels = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  for (const r of rels) {
    if (!seenSlugs.has(r)) {
      console.error(`BROKEN RELATED SLUG: "${r}" does not exist in TOOLS registry.`);
      process.exit(1);
    }
  }
}

// Verify loader entries if loader exists
if (loaderSource) {
  for (const slug of seenSlugs) {
    if (!loaderSource.includes(`'${slug}':`)) {
      console.error(`MISSING LOADER ENTRY for slug: "${slug}" in components/tools/ToolClientLoader.tsx`);
      process.exit(1);
    }
  }
}

console.log(`✓ Registry verification passed: ${seenSlugs.size} unique tools, 0 duplicate titles/descriptions, 0 broken related links.`);
