import React from 'react';
import { Home, Search } from 'lucide-react';
import { getPopularTools } from '../lib/tools';
import { Button } from '../components/ui/Button';
import { ToolCard } from '../components/ui/ToolCard';

export interface NotFoundPageProps {
  onNavigate: (href: string) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, onOpenSearch }) => {
  const popular = getPopularTools().slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-12">
      <div className="p-8 sm:p-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
          ERROR 404
        </p>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Page or Tool Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
          The URL you requested does not match any active tool or page. Use our instant search or browse our most popular tools below.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={() => onNavigate('/')}>
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Button>
          <Button variant="outline" onClick={onOpenSearch}>
            <Search className="w-4 h-4" />
            <span>Search All Tools (⌘K)</span>
          </Button>
        </div>
      </div>

      <section aria-labelledby="popular-404-heading" className="space-y-4">
        <h2
          id="popular-404-heading"
          className="text-xl font-bold text-slate-900 dark:text-white tracking-tight"
        >
          Popular Everyday Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
};
