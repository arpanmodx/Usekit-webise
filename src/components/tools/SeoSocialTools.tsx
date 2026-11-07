import React, { useState, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { DownloadButton } from '../ui/DownloadButton';
import { ResetButton } from '../ui/ResetButton';
import { ResultBox } from '../ui/ResultBox';

// 1. Meta Tag Generator
export const MetaTagGenerator: React.FC = () => {
  const [title, setTitle] = useState('UseKit — Everyday Tools. All in One Place.');
  const [description, setDescription] = useState('Free online calculators, PDF utilities, image converters, text processors, and developer tools running privately in your browser.');
  const [keywords, setKeywords] = useState('online tools, calculators, pdf merger, image compressor, json formatter');
  const [author, setAuthor] = useState('UseKit');
  const [robots, setRobots] = useState('index, follow');
  const [canonical, setCanonical] = useState('https://usekit.vercel.app/');
  const [charset, setCharset] = useState('UTF-8');

  const output = useMemo(() => {
    const lines = [
      `<meta charset="${charset}">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      `<title>${title}</title>`,
      `<meta name="title" content="${title.replace(/"/g, '&quot;')}">`,
      `<meta name="description" content="${description.replace(/"/g, '&quot;')}">`,
    ];
    if (keywords.trim()) lines.push(`<meta name="keywords" content="${keywords.replace(/"/g, '&quot;')}">`);
    if (author.trim()) lines.push(`<meta name="author" content="${author.replace(/"/g, '&quot;')}">`);
    lines.push(`<meta name="robots" content="${robots}">`);
    if (canonical.trim()) lines.push(`<link rel="canonical" href="${canonical.trim()}">`);
    return lines.join('\n');
  }, [title, description, keywords, author, robots, canonical, charset]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`Page Title (${title.length}/60 chars)`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          helperText={title.length > 60 ? 'Recommended under 60 characters for Google SERP' : 'Optimal length'}
        />
        <Input label="Canonical URL" value={canonical} onChange={(e) => setCanonical(e.target.value)} />
      </div>
      <Textarea
        label={`Meta Description (${description.length}/160 chars)`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Keywords (comma separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        <Input label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <Select
          label="Robots Directive"
          value={robots}
          onChange={(e) => setRobots(e.target.value)}
          options={[
            { value: 'index, follow', label: 'index, follow' },
            { value: 'noindex, follow', label: 'noindex, follow' },
            { value: 'index, nofollow', label: 'index, nofollow' },
            { value: 'noindex, nofollow', label: 'noindex, nofollow' },
          ]}
        />
      </div>
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Google Search Preview</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{canonical || 'https://example.com'}</p>
        <p className="text-lg font-medium text-blue-700 dark:text-blue-400 hover:underline truncate">{title || 'Untitled Page'}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{description || 'No description provided.'}</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">Generated HTML Meta Tags</span>
          <CopyButton text={output} />
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">{output}</pre>
      </div>
    </div>
  );
};

// 2. Meta Tag Analyzer
export const MetaTagAnalyzer: React.FC = () => {
  const [html, setHtml] = useState(
    `<title>UseKit — All Your Everyday Tools in One Place</title>\n<meta name="description" content="Use 90+ free browser-based calculators, PDF tools, image converters, and developer utilities with zero file uploads.">\n<meta name="robots" content="index, follow">\n<link rel="canonical" href="https://usekit.vercel.app/">\n<meta property="og:title" content="UseKit — Everyday Tools">\n<meta property="og:image" content="https://usekit.vercel.app/api/og">`
  );

  const analysis = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<html><head>${html}</head></html>`, 'text/html');
    const title = doc.querySelector('title')?.textContent?.trim() || '';
    const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
    const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content')?.trim() || '';
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() || '';
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() || '';
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim() || '';

    const checks = [
      {
        label: 'Title Tag',
        value: title || 'Missing',
        status: title.length >= 30 && title.length <= 60 ? 'Optimal' : title ? `Length (${title.length} chars) — aim for 30–60` : 'Missing',
        ok: title.length >= 10 && title.length <= 65,
      },
      {
        label: 'Meta Description',
        value: desc || 'Missing',
        status: desc.length >= 110 && desc.length <= 160 ? 'Optimal' : desc ? `Length (${desc.length} chars) — aim for 120–160` : 'Missing',
        ok: desc.length >= 50 && desc.length <= 165,
      },
      {
        label: 'Canonical Link',
        value: canonical || 'Missing',
        status: canonical.startsWith('http') ? 'Valid URL' : 'Missing or relative',
        ok: canonical.startsWith('http'),
      },
      {
        label: 'Robots Meta',
        value: robots || 'Not specified (defaults to index, follow)',
        status: !robots.includes('noindex') ? 'Indexable' : 'Blocked (noindex)',
        ok: !robots.includes('noindex'),
      },
      {
        label: 'Open Graph Tags',
        value: ogTitle ? `og:title + ${ogImage ? 'og:image present' : 'missing og:image'}` : 'Missing',
        status: ogTitle && ogImage ? 'Complete' : 'Incomplete',
        ok: Boolean(ogTitle && ogImage),
      },
    ];
    return checks;
  }, [html]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Paste HTML <head> Markup to Analyze"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        rows={6}
        className="font-mono text-xs"
      />
      <div className="space-y-2.5">
        {analysis.map((item) => (
          <div key={item.label} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.ok ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 break-all">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Open Graph Generator
export const OpenGraphGenerator: React.FC = () => {
  const [title, setTitle] = useState('UseKit — All Your Everyday Tools in One Place');
  const [siteName, setSiteName] = useState('UseKit');
  const [url, setUrl] = useState('https://usekit.vercel.app/');
  const [type, setType] = useState('website');
  const [image, setImage] = useState('https://usekit.vercel.app/api/og?title=UseKit');
  const [description, setDescription] = useState('90+ fast, privacy-first online tools for calculations, PDFs, images, and code.');

  const code = useMemo(() => {
    return [
      `<meta property="og:type" content="${type}">`,
      `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}">`,
      `<meta property="og:site_name" content="${siteName.replace(/"/g, '&quot;')}">`,
      `<meta property="og:url" content="${url.trim()}">`,
      `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}">`,
      `<meta property="og:image" content="${image.trim()}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}">`,
      `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}">`,
      `<meta name="twitter:image" content="${image.trim()}">`,
    ].join('\n');
  }, [title, siteName, url, type, image, description]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="OG Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Site Name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        <Input label="Page URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Select
          label="OG Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: 'website', label: 'website' },
            { value: 'article', label: 'article' },
            { value: 'product', label: 'product' },
            { value: 'profile', label: 'profile' },
          ]}
        />
      </div>
      <Input label="OG Image URL (1200x630 recommended)" value={image} onChange={(e) => setImage(e.target.value)} />
      <Textarea label="OG Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">Open Graph & Twitter Card HTML</span>
          <CopyButton text={code} />
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">{code}</pre>
      </div>
    </div>
  );
};

// 4. Robots.txt Generator
export const RobotsTxtGenerator: React.FC = () => {
  const [defaultAccess, setDefaultAccess] = useState<'allow' | 'disallow'>('allow');
  const [sitemap, setSitemap] = useState('https://usekit.vercel.app/sitemap.xml');
  const [disallowPaths, setDisallowPaths] = useState('/api/\n/admin/\n/private/');
  const [crawlDelay, setCrawlDelay] = useState('');

  const output = useMemo(() => {
    const lines = ['User-agent: *'];
    if (defaultAccess === 'disallow') {
      lines.push('Disallow: /');
    } else {
      lines.push('Allow: /');
      disallowPaths
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((p) => lines.push(`Disallow: ${p}`));
    }
    if (crawlDelay.trim()) lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
    if (sitemap.trim()) lines.push(`\nSitemap: ${sitemap.trim()}`);
    return lines.join('\n');
  }, [defaultAccess, sitemap, disallowPaths, crawlDelay]);

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Default All Bots (*)"
          value={defaultAccess}
          onChange={(e) => setDefaultAccess(e.target.value as 'allow' | 'disallow')}
          options={[
            { value: 'allow', label: 'Allow All Crawlers' },
            { value: 'disallow', label: 'Block All Crawlers' },
          ]}
        />
        <Input label="Crawl Delay (seconds, optional)" type="number" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} />
        <Input label="Sitemap URL" value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
      </div>
      <Textarea label="Disallowed Directories (one per line)" value={disallowPaths} onChange={(e) => setDisallowPaths(e.target.value)} rows={4} className="font-mono text-xs" />
      <div className="flex flex-wrap gap-3">
        <CopyButton text={output} label="Copy robots.txt" />
        <DownloadButton content={output} filename="robots.txt" label="Download robots.txt" />
      </div>
      <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">{output}</pre>
    </div>
  );
};

// 5. XML Sitemap Generator
export const XmlSitemapGenerator: React.FC = () => {
  const [urlsText, setUrlsText] = useState('https://usekit.vercel.app/\nhttps://usekit.vercel.app/age-calculator\nhttps://usekit.vercel.app/pdf-merger\nhttps://usekit.vercel.app/image-compressor');
  const [changefreq, setChangefreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  const xml = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const urls = urlsText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));
    const items = urls
      .map(
        (u) => `  <url>\n    <loc>${u.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
      )
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [urlsText, changefreq, priority]);

  const downloadXml = () => {
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Textarea label="Enter Page URLs (one full URL per line)" value={urlsText} onChange={(e) => setUrlsText(e.target.value)} rows={5} className="font-mono text-xs" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Change Frequency"
          value={changefreq}
          onChange={(e) => setChangefreq(e.target.value)}
          options={[
            { value: 'daily', label: 'daily' },
            { value: 'weekly', label: 'weekly' },
            { value: 'monthly', label: 'monthly' },
            { value: 'yearly', label: 'yearly' },
          ]}
        />
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={[
            { value: '1.0', label: '1.0 (Highest)' },
            { value: '0.8', label: '0.8 (High)' },
            { value: '0.6', label: '0.6 (Medium)' },
            { value: '0.4', label: '0.4 (Low)' },
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <CopyButton text={xml} label="Copy sitemap.xml" />
        <DownloadButton content={xml} filename="sitemap.xml" mimeType="application/xml;charset=utf-8" label="Download sitemap.xml" />
      </div>
      <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80">{xml}</pre>
    </div>
  );
};

// 6. Hashtag Generator (Rule-based / Template-based)
export const HashtagGenerator: React.FC = () => {
  const [topic, setTopic] = useState('Web Development');
  const [niche, setNiche] = useState<'tech' | 'business' | 'fitness' | 'creator' | 'education'>('tech');

  const hashtags = useMemo(() => {
    const clean = topic
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    const camel = clean.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') || 'Topic';
    const lower = clean.join('').toLowerCase() || 'topic';

    const nicheBanks: Record<string, string[]> = {
      tech: ['TechTips', 'CodingLife', 'SoftwareEngineering', 'DeveloperTools', 'WebDev', 'BuildInPublic', 'Programming', 'TechCommunity'],
      business: ['Entrepreneurship', 'StartupGrowth', 'DigitalMarketing', 'ProductivityHacks', 'SmallBusinessTips', 'BusinessStrategy', 'FounderLife'],
      fitness: ['FitnessJourney', 'HealthyLifestyle', 'WorkoutMotivation', 'StrengthTraining', 'DailyFitness', 'WellnessTips', 'FitLife'],
      creator: ['ContentCreator', 'CreatorEconomy', 'SocialMediaTips', 'VideoMarketing', 'DigitalCreator', 'GrowthStrategy', 'CreativeProcess'],
      education: ['LearnEveryday', 'StudyTips', 'OnlineLearning', 'SkillBuilding', 'CareerGrowth', 'KnowledgeSharing', 'EdTech'],
    };

    const custom = [
      `#${camel}`,
      `#${camel}Tips`,
      `#${camel}Guide`,
      `#${camel}2025`,
      `#Learn${camel}`,
      `#${camel}Community`,
      `#${lower}daily`,
    ];
    const bank = (nicheBanks[niche] || nicheBanks.tech).map((t) => `#${t}`);
    return Array.from(new Set([...custom, ...bank]));
  }, [topic, niche]);

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Rule-based hashtag combination builder — combines your primary topic stem with proven category modifiers.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Primary Topic or Keyword" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Personal Finance" />
        <Select
          label="Category Preset"
          value={niche}
          onChange={(e) => setNiche(e.target.value as any)}
          options={[
            { value: 'tech', label: 'Technology & Software' },
            { value: 'business', label: 'Business & Marketing' },
            { value: 'creator', label: 'Content Creation & Social' },
            { value: 'education', label: 'Education & Tutorials' },
            { value: 'fitness', label: 'Health & Fitness' },
          ]}
        />
      </div>
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-400">{hashtags.length} Hashtags Generated</span>
          <CopyButton text={hashtags.join(' ')} label="Copy All Hashtags" />
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-blue-600 dark:text-blue-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. YouTube Title Generator (Template-based)
export const YoutubeTitleGenerator: React.FC = () => {
  const [topic, setTopic] = useState('TypeScript Performance Optimization');
  const [audience, setAudience] = useState('Web Developers');
  const [timeframe, setTimeframe] = useState('15 Minutes');

  const titles = useMemo(() => {
    const t = topic.trim() || 'Your Topic';
    const a = audience.trim() || 'Beginners';
    const tf = timeframe.trim() || '10 Minutes';
    return [
      `How to Master ${t} in ${tf} (Step-by-Step Guide)`,
      `${t} Explained: The Complete Guide for ${a}`,
      `7 ${t} Mistakes Most ${a} Make (And How to Fix Them)`,
      `I Tried Every ${t} Workflow — Here Is What Actually Works`,
      `Stop Doing ${t} the Old Way! Do This Instead (2025 Guide)`,
      `The Ultimate ${t} Checklist for ${a}`,
      `From Zero to Pro: ${t} Crash Course in ${tf}`,
      `Why 90% of ${a} Struggle With ${t} (Practical Breakdown)`,
    ];
  }, [topic, audience, timeframe]);

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Template-driven title builder using high-CTR editorial frameworks with character-length indicators.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Video Topic / Subject" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Input label="Target Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
        <Input label="Timeframe / Outcome" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} />
      </div>
      <div className="space-y-2.5">
        {titles.map((title, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
              <span className={`text-[11px] font-mono ${title.length <= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {title.length} chars {title.length <= 70 ? '(Fits desktop & mobile feed)' : '(May truncate on mobile)'}
              </span>
            </div>
            <CopyButton text={title} />
          </div>
        ))}
      </div>
    </div>
  );
};

// 8. YouTube Description Generator (Template-based)
export const YoutubeDescriptionGenerator: React.FC = () => {
  const [summary, setSummary] = useState('In this video, we break down practical strategies to speed up your workflow using free browser-based utilities.');
  const [timestamps, setTimestamps] = useState('00:00 Introduction\n01:30 Core Setup\n04:15 Live Demo\n08:45 Key Takeaways');
  const [website, setWebsite] = useState('https://usekit.vercel.app');
  const [tags, setTags] = useState('#Productivity #WebTools #Tutorial');

  const description = useMemo(() => {
    return [
      summary.trim(),
      '',
      '🔗 RESOURCES & LINKS',
      `• Official Website: ${website.trim()}`,
      '',
      '⏱️ TIMESTAMPS / CHAPTERS',
      timestamps.trim(),
      '',
      '📌 SUBSCRIBE & STAY CONNECTED',
      'If you found this video helpful, hit Like and Subscribe for weekly tutorials!',
      '',
      tags.trim(),
    ].join('\n');
  }, [summary, timestamps, website, tags]);

  return (
    <div className="space-y-6">
      <Textarea label="Video Summary Paragraph (First 2 lines appear in search)" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
      <Textarea label="Video Chapters (Starts with 00:00)" value={timestamps} onChange={(e) => setTimestamps(e.target.value)} rows={4} className="font-mono text-xs" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Primary Link / Resource URL" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <Input label="Hashtags (3–5 recommended)" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">Formatted YouTube Description</span>
          <CopyButton text={description} />
        </div>
        <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-sans whitespace-pre-wrap text-slate-800 dark:text-slate-200">
          {description}
        </pre>
      </div>
    </div>
  );
};

// 9. Social Bio Generator (Template-based)
export const SocialBioGenerator: React.FC = () => {
  const [role, setRole] = useState('Full-Stack Engineer');
  const [specialty, setSpecialty] = useState('fast web apps & developer tools');
  const [proof, setProof] = useState('10+ years shipping production software');
  const [cta, setCta] = useState('Try my free toolset below 👇');

  const bios = useMemo(() => {
    const r = role.trim() || 'Creator';
    const s = specialty.trim() || 'digital products';
    const p = proof.trim() || 'Building in public';
    const c = cta.trim() || 'Links below 👇';
    return [
      `${r} building ${s}. ${p}. ${c}`,
      `⚡ ${r}\n🛠️ Focused on ${s}\n📈 ${p}\n🔗 ${c}`,
      `Helping teams with ${s} | ${r} | ${p} | ${c}`,
      `${r} • Obsessed with ${s} • ${p} • ${c}`,
    ];
  }, [role, specialty, proof, cta]);

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Rule-based social profile bio formatter with live 150-character Instagram and 160-character X/Twitter limits.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Your Role / Title" value={role} onChange={(e) => setRole(e.target.value)} />
        <Input label="What You Build / Teach" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
        <Input label="Credibility / Milestone" value={proof} onChange={(e) => setProof(e.target.value)} />
        <Input label="Call to Action (CTA)" value={cta} onChange={(e) => setCta(e.target.value)} />
      </div>
      <div className="space-y-3">
        {bios.map((bio, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-900 dark:text-white whitespace-pre-line">{bio}</p>
              <p className="text-[11px] font-mono text-slate-500">{bio.length} / 160 characters</p>
            </div>
            <CopyButton text={bio} />
          </div>
        ))}
      </div>
    </div>
  );
};
