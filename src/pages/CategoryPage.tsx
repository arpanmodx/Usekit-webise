import React from 'react';
import { getToolsByCategory, CATEGORIES, type CategoryDefinition } from '../lib/tools';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ToolCard } from '../components/ui/ToolCard';
import { ToolIcon } from '../components/ui/ToolIcon';
import { Button } from '../components/ui/Button';

export interface CategoryPageProps {
  category: CategoryDefinition;
  onNavigate: (href: string) => void;
  favorites: string[];
  onToggleFavorite: (slug: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  onNavigate,
  favorites,
  onToggleFavorite,
}) => {
  const tools = getToolsByCategory(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div>
        <Breadcrumbs onNavigate={onNavigate} items={[{ label: category.name }]} />
        <div className="flex items-center gap-3.5 mt-2">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60">
            <ToolIcon name={category.iconName} className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">
              {category.seoDescription}
            </p>
          </div>
        </div>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              onNavigate={onNavigate}
              isFavorite={favorites.includes(tool.slug)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {category.name} — Scheduled for Upcoming Phase Rollout
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Our {category.name.toLowerCase()} suite is structured in the UseKit registry and scheduled for the upcoming phase deployment. In the meantime, explore our complete set of active Calculators and Converters.
          </p>
          <Button variant="primary" size="sm" onClick={() => onNavigate('/category/calculators')}>
            Explore Active Calculators
          </Button>
        </div>
      )}

      {/* Other Categories */}
      <section aria-labelledby="other-categories-heading" className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2
          id="other-categories-heading"
          className="text-lg font-bold text-slate-900 dark:text-white mb-4"
        >
          Other Tool Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <a
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/category/${c.slug}`);
              }}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
            >
              {c.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
