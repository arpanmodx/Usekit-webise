import React, { Suspense, useState } from 'react';
import { Star, Share2, ShieldCheck, Check } from 'lucide-react';
import { getRelatedTools, type ToolDefinition } from '../lib/tools';
import { TOOL_COMPONENTS } from '../lib/toolLoaders';
import { getSiteUrl } from '../lib/siteConfig';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ToolIcon } from '../components/ui/ToolIcon';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import { ToolCard } from '../components/ui/ToolCard';
import { AdSlot } from '../components/ui/AdSlot';
import { Button } from '../components/ui/Button';
import { ToolErrorBoundary } from '../components/ui/ToolErrorBoundary';

export interface ToolPageProps {
  tool: ToolDefinition;
  onNavigate: (href: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({
  tool,
  onNavigate,
  isFavorite,
  onToggleFavorite,
}) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const ToolComponent = TOOL_COMPONENTS[tool.slug];
  const relatedTools = getRelatedTools(tool);

  const handleShareUrl = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Breadcrumbs
        onNavigate={onNavigate}
        items={[
          { label: tool.category, href: `/category/${tool.categorySlug}` },
          { label: tool.name },
        ]}
      />

      {/* Tool Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-800/60">
              <ToolIcon name={tool.iconName} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{tool.category}</span>
                <span aria-hidden="true">·</span>
                <span>100% Browser-Based</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {tool.name}
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleFavorite(tool.slug)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
              }`}
            />
            <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareUrl}>
            {linkCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${tool.name} — ${tool.shortDescription} ${getSiteUrl()}/${tool.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(`${getSiteUrl()}/${tool.slug}`)}&text=${encodeURIComponent(tool.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Telegram
          </a>
        </div>
      </header>

      {/* Main Interactive Tool Workbench */}
      <section
        aria-label={`${tool.name} Interactive Workspace`}
        className="p-5 sm:p-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
      >
        {tool.isFileTool && (
          <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Your files never leave your device — processed 100% locally in your browser.</span>
          </div>
        )}

        <ToolErrorBoundary>
          <Suspense
            fallback={
              <div className="py-12 space-y-4 animate-pulse">
                <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                </div>
              </div>
            }
          >
            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <div className="p-6 text-center text-sm text-slate-500">
                Tool component unavailable.
              </div>
            )}
          </Suspense>
        </ToolErrorBoundary>
      </section>

      {/* AdSlot placed strictly outside tool controls */}
      <AdSlot slotId={`tool-${tool.slug}-below`} format="horizontal" />

      {/* How to Use Section */}
      <section aria-labelledby="how-to-heading" className="mt-12">
        <h2
          id="how-to-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-4"
        >
          How to Use the {tool.name}
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tool.howTo.map((step, index) => (
            <li
              key={step}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
            >
              <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Deep Domain Guide & Educational Content (300+ words) */}
      <section aria-label={`About ${tool.name}`} className="mt-12 space-y-8">
        {tool.guideSections.map((section) => (
          <div
            key={section.heading}
            className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-[75ch]"
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* FAQ Accordion */}
      <FAQAccordion faqs={tool.faqs} title={`${tool.name} — Frequently Asked Questions`} />

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-tools-heading" className="mt-14">
          <div className="flex items-center justify-between mb-5">
            <h2
              id="related-tools-heading"
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
            >
              Related Tools
            </h2>
            <a
              href={`/category/${tool.categorySlug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/category/${tool.categorySlug}`);
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all {tool.category} →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <ToolCard
                key={rel.slug}
                tool={rel}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
