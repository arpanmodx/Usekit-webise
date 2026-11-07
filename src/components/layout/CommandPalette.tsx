import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, Star, History } from 'lucide-react';
import { TOOLS, getToolBySlug, type ToolDefinition } from '../../lib/tools';
import { ToolIcon } from '../ui/ToolIcon';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  recentSlugs: string[];
  favorites: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  recentSlugs,
  favorites,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Parent handles opening via state, or we trigger a custom event
          window.dispatchEvent(new CustomEvent('usekit:open-search'));
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const results: ToolDefinition[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const favTools = favorites
        .map((s) => getToolBySlug(s))
        .filter((t): t is ToolDefinition => Boolean(t));
      const recTools = recentSlugs
        .filter((s) => !favorites.includes(s))
        .map((s) => getToolBySlug(s))
        .filter((t): t is ToolDefinition => Boolean(t));
      const combined = [...favTools, ...recTools];
      if (combined.length > 0) {
        const remaining = TOOLS.filter((t) => !combined.some((c) => c.slug === t.slug));
        return [...combined, ...remaining].slice(0, 12);
      }
      return TOOLS.slice(0, 12);
    }

    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query, favorites, recentSlugs]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (tool: ToolDefinition) => {
    onClose();
    onNavigate(`/${tool.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-xs pt-14 sm:pt-24 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search UseKit Tools"
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  results.length > 0 ? (prev - 1 + results.length) % results.length : 0
                );
              } else if (e.key === 'Enter' && results[selectedIndex]) {
                e.preventDefault();
                handleSelect(results[selectedIndex]);
              }
            }}
            placeholder="Search calculators, converters, and tools by name or keyword..."
            className="w-full h-14 px-3.5 text-sm sm:text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {results.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No tools matched "{query}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for "age", "bmi", "loan", "emi", "gst", "discount", "unit", or "percentage".
              </p>
            </div>
          ) : (
            results.map((tool, index) => {
              const isSelected = index === selectedIndex;
              const isFav = favorites.includes(tool.slug);
              const isRec = recentSlugs.includes(tool.slug);

              return (
                <button
                  key={tool.slug}
                  type="button"
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <ToolIcon name={tool.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{tool.name}</span>
                        {isFav && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                        {!isFav && isRec && <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {tool.category} · {tool.shortDescription}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Use ↑↓ arrows to navigate, Enter to open, Esc to close</span>
          <span>{TOOLS.length} Active Tools</span>
        </div>
      </div>
    </div>
  );
};
