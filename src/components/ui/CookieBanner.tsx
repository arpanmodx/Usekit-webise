import React from 'react';
import { Button } from './Button';
import { useCookieConsent } from '../../hooks/useUserPreferences';

export interface CookieBannerProps {
  onNavigate: (href: string) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const { consent, saveConsent } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent Preferences"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          We use essential local storage for your theme, recent tools, and saved favorites, and may use cookies for analytics or advertising compliance. Read our{' '}
          <a
            href="/cookie-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/cookie-policy');
            }}
            className="underline font-medium text-slate-900 dark:text-white hover:text-blue-600"
          >
            Cookie Policy
          </a>{' '}
          and{' '}
          <a
            href="/privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/privacy-policy');
            }}
            className="underline font-medium text-slate-900 dark:text-white hover:text-blue-600"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => saveConsent('essential')}>
            Essential Only
          </Button>
          <Button variant="primary" size="sm" onClick={() => saveConsent('accepted')}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};
