import React from 'react';
import { isAdsEnabled } from '../../lib/siteConfig';

export interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

/**
 * AdSense-ready AdSlot component.
 * Off by default behind NEXT_PUBLIC_ENABLE_ADS="true".
 * Reserves fixed min-height when enabled to prevent Cumulative Layout Shift (CLS).
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default-ad-slot',
  format = 'horizontal',
  className = '',
}) => {
  if (!isAdsEnabled()) {
    return null;
  }

  const minHeightClass = format === 'rectangle' ? 'min-h-[250px]' : 'min-h-[90px]';

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 w-full flex flex-col items-center justify-center ${className}`}
    >
      <span className="text-[11px] text-slate-400 dark:text-slate-500 mb-1.5 select-none">
        Advertisement
      </span>
      <div
        data-ad-slot={slotId}
        className={`w-full max-w-4xl ${minHeightClass} rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-center text-xs text-slate-400 dark:text-slate-600`}
      >
        <span>Ad Slot ({slotId})</span>
      </div>
    </aside>
  );
};
