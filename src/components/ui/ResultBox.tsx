import React from 'react';
import { CopyButton } from './CopyButton';

export interface ResultBoxProps {
  label: string;
  value: string | number;
  sublabel?: string;
  copyText?: string;
  highlight?: boolean;
  className?: string;
}

export const ResultBox: React.FC<ResultBoxProps> = ({
  label,
  value,
  sublabel,
  copyText,
  highlight = false,
  className = '',
}) => {
  const stringValue = String(value);

  return (
    <div
      className={`p-4 rounded-xl border ${
        highlight
          ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/80'
          : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800'
      } flex flex-col justify-between gap-2 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
        {copyText !== undefined && <CopyButton text={copyText} label="Copy" size="sm" variant="ghost" />}
      </div>
      <div>
        <div
          className={`text-xl sm:text-2xl font-bold tracking-tight font-mono tabular-nums break-words ${
            highlight
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {stringValue}
        </div>
        {sublabel && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sublabel}</p>
        )}
      </div>
    </div>
  );
};
