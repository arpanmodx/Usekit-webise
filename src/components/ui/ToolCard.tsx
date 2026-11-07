import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import type { ToolDefinition } from '../../lib/tools';
import { ToolIcon } from './ToolIcon';

export interface ToolCardProps {
  tool: ToolDefinition;
  onNavigate: (href: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onNavigate,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const href = `/${tool.slug}`;

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ToolIcon name={tool.iconName} className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(tool.slug);
                }}
                aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Save ${tool.name} to favorites`}
                className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Star
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>{tool.category}</span>
          <span aria-hidden="true">·</span>
          <span>Browser Utility</span>
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(href);
            }}
            className="focus:outline-none after:absolute after:inset-0"
          >
            {tool.name}
          </a>
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400">
        <span>Open Tool</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
};
