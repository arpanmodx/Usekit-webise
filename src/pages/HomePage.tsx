import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, Zap, Lock, ArrowRight } from 'lucide-react';
import {
  TOOLS,
  CATEGORIES,
  getPopularTools,
  getMostUsedTools,
  getRecentlyAddedTools,
  getToolBySlug,
  type ToolDefinition,
  type CategorySlug,
} from '../lib/tools';
import { SITE_CONFIG } from '../lib/siteConfig';
import { ToolCard } from '../components/ui/ToolCard';
import { ToolIcon } from '../components/ui/ToolIcon';
import { AdSlot } from '../components/ui/AdSlot';

export interface HomePageProps {
  onNavigate: (href: string) => void;
  favorites: string[];
  recentSlugs: string[];
  onToggleFavorite: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  favorites,
  recentSlugs,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategorySlug>('all');

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.categorySlug === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const popularTools = useMemo(() => getPopularTools(), []);
  const mostUsedTools = useMemo(() => getMostUsedTools(), []);
  const recentlyAdded = useMemo(() => getRecentlyAddedTools(6), []);

  const favoriteTools = useMemo(
    () =>
      favorites
        .map((s) => getToolBySlug(s))
        .filter((t): t is ToolDefinition => Boolean(t)),
    [favorites]
  );

  const recentTools = useMemo(
    () =>
      recentSlugs
        .map((s) => getToolBySlug(s))
        .filter((t): t is ToolDefinition => Boolean(t)),
    [recentSlugs]
  );

  const isFiltering = searchQuery.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="space-y-16 pb-10">
      {/* Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-tight">
            {SITE_CONFIG.tagline}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
            {SITE_CONFIG.h1}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Fast, accurate, privacy-first calculators, converters, and everyday utilities that run directly in your browser with zero sign-up required.
          </p>

          {/* Instant Search Bar */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators & utilities (e.g., Age, BMI, EMI, GST, Discount, Unit Converter)..."
                aria-label="Search all tools"
                className="w-full h-13 pl-12 pr-20 text-sm sm:text-base rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <span className="hidden sm:inline-block absolute right-4 font-mono text-xs text-slate-400 select-none">
                  ⌘K
                </span>
              )}
            </div>
          </div>

          {/* Trust Markers */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Client-Side Privacy</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Instant Zero-Latency Results</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>No Account or Sign-Up Required</span>
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Interactive Category Filter Bar */}
        <section aria-label="Filter tools by category">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Filtered Results View */}
        {isFiltering ? (
          <section aria-labelledby="filtered-results-heading" className="space-y-5">
            <div className="flex items-center justify-between">
              <h2
                id="filtered-results-heading"
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
              >
                {searchQuery
                  ? `Search Results for "${searchQuery}" (${filteredTools.length})`
                  : `${CATEGORIES.find((c) => c.slug === selectedCategory)?.name} (${filteredTools.length})`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>

            {filteredTools.length === 0 ? (
              <div className="p-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  No matching tools found in this view
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Try clearing the category filter or searching for another utility keyword.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    onNavigate={onNavigate}
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Saved Favorites & Recently Used (When Present) */}
            {(favoriteTools.length > 0 || recentTools.length > 0) && (
              <section aria-label="Your Saved and Recent Tools" className="space-y-8">
                {favoriteTools.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Your Favorite Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteTools.map((tool) => (
                        <ToolCard
                          key={tool.slug}
                          tool={tool}
                          onNavigate={onNavigate}
                          isFavorite={true}
                          onToggleFavorite={onToggleFavorite}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {recentTools.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Recently Used
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recentTools.slice(0, 4).map((tool) => (
                        <ToolCard
                          key={tool.slug}
                          tool={tool}
                          onNavigate={onNavigate}
                          isFavorite={favorites.includes(tool.slug)}
                          onToggleFavorite={onToggleFavorite}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Popular Tools Section */}
            <section id="popular-tools" aria-labelledby="popular-heading" className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <h2
                    id="popular-heading"
                    className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
                  >
                    Popular Tools
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Essential financial, percentage, date, and health calculators for daily tasks.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    onNavigate={onNavigate}
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* Most Used Curated Section */}
            <section aria-labelledby="most-used-heading" className="space-y-5">
              <div>
                <h2
                  id="most-used-heading"
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
                >
                  Most Used Everyday Calculators
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Curated core utilities with shareable URL parameters and instant breakdowns.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mostUsedTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    onNavigate={onNavigate}
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </section>

            <AdSlot slotId="homepage-mid" format="horizontal" />

            {/* Browse by Category */}
            <section id="categories" aria-labelledby="categories-heading" className="space-y-5">
              <div>
                <h2
                  id="categories-heading"
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
                >
                  Browse by Category
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Explore tools organized by functional domain.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => {
                  const count = TOOLS.filter((t) => t.categorySlug === cat.slug).length;
                  return (
                    <a
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/category/${cat.slug}`);
                      }}
                      className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <ToolIcon name={cat.iconName} className="w-5 h-5" />
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                            {count} {count === 1 ? 'tool' : 'tools'}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400">
                        <span>Explore {cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* All Calculators Directory & Recently Added */}
            <section aria-labelledby="all-tools-heading" className="space-y-5">
              <div>
                <h2
                  id="all-tools-heading"
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
                >
                  Recently Added & Complete Tool Directory
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  All {TOOLS.length} active utilities available right now on UseKit ({recentlyAdded.length} featured new additions).
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOOLS.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    onNavigate={onNavigate}
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
