import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'usekit-theme';
const FAVORITES_KEY = 'usekit-favorites';
const RECENT_KEY = 'usekit-recent-tools';
const COOKIE_CONSENT_KEY = 'usekit-cookie-consent';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    } catch {
      return 'system';
    }
  });

  const applyThemeToDom = useCallback((mode: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = mode === 'dark' || (mode === 'system' && prefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyThemeToDom(theme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyThemeToDom('system');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyThemeToDom]);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch {
        // Ignore storage quota errors
      }
      applyThemeToDom(mode);
    },
    [applyThemeToDom]
  );

  return { theme, setTheme };
}

export function useToolHistoryAndFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const recordToolVisit = useCallback((slug: string) => {
    setRecentSlugs((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 8);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  return {
    favorites,
    recentSlugs,
    isFavorite: (slug: string) => favorites.includes(slug),
    toggleFavorite,
    recordToolVisit,
  };
}

export function useCookieConsent() {
  const [consent, setConsentState] = useState<'accepted' | 'essential' | null>(() => {
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      return saved === 'accepted' || saved === 'essential' ? saved : null;
    } catch {
      return 'essential';
    }
  });

  const saveConsent = useCallback((choice: 'accepted' | 'essential') => {
    setConsentState(choice);
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // Ignore
    }
  }, []);

  return { consent, saveConsent };
}
