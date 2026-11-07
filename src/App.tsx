import React, { useState, useEffect, useCallback } from 'react';
import { getToolBySlug, getCategoryBySlug } from './lib/tools';
import {
  buildHomeMetadata,
  buildToolMetadata,
  buildCategoryMetadata,
  buildStaticPageMetadata,
  applyClientMetadata,
} from './lib/seo';
import { useTheme, useToolHistoryAndFavorites } from './hooks/useUserPreferences';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { CookieBanner } from './components/ui/CookieBanner';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { CategoryPage } from './pages/CategoryPage';
import { LegalPage, type LegalSlug } from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

const LEGAL_SLUGS: Record<LegalSlug, { title: string; description: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description:
      'Read the UseKit Privacy Policy. Learn how our client-side calculators and utilities protect your privacy by processing data in your browser.',
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions',
    description:
      'Review the Terms and Conditions for using UseKit online calculators, converters, and everyday utilities.',
  },
  'about-us': {
    title: 'About Us',
    description:
      'Learn about UseKit — Everyday Tools. All in One Place. Built for speed, accuracy, accessibility, and 100% browser privacy.',
  },
  'contact-us': {
    title: 'Contact Us',
    description:
      'Contact the UseKit engineering team to report an issue, suggest a new utility tool, or ask a question.',
  },
  disclaimer: {
    title: 'Disclaimer',
    description:
      'Read the UseKit informational disclaimer regarding financial, tax, health, and general utility calculations.',
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description:
      'Understand how UseKit uses essential local storage and optional advertising/analytics cookies.',
  },
};

export default function App() {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    favorites,
    recentSlugs,
    isFavorite,
    toggleFavorite,
    recordToolVisit,
  } = useToolHistoryAndFavorites();

  const navigate = useCallback((href: string) => {
    if (typeof window === 'undefined') return;
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
        setPathname('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const url = new URL(href, window.location.origin);
    window.history.pushState({}, '', url.pathname + url.search + url.hash);
    setPathname(url.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname);
    };
    const onOpenSearchEvent = () => {
      setSearchOpen(true);
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('usekit:open-search', onOpenSearchEvent);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('usekit:open-search', onOpenSearchEvent);
    };
  }, []);

  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const topSegment = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

  // Synchronize SEO metadata & record tool history on route changes
  useEffect(() => {
    if (cleanPath === '/') {
      applyClientMetadata(buildHomeMetadata());
      return;
    }

    if (topSegment.startsWith('category/')) {
      const catSlug = topSegment.replace('category/', '');
      const cat = getCategoryBySlug(catSlug);
      if (cat) {
        applyClientMetadata(buildCategoryMetadata(cat));
        return;
      }
    }

    if (topSegment in LEGAL_SLUGS) {
      const legal = LEGAL_SLUGS[topSegment as LegalSlug];
      applyClientMetadata(buildStaticPageMetadata(topSegment, legal.title, legal.description));
      return;
    }

    const tool = getToolBySlug(topSegment);
    if (tool) {
      applyClientMetadata(buildToolMetadata(tool));
      recordToolVisit(tool.slug);
      return;
    }

    applyClientMetadata(
      buildStaticPageMetadata(
        topSegment || '404',
        '404 — Page Not Found',
        'The requested page or utility tool could not be found on UseKit.',
        true
      )
    );
  }, [cleanPath, topSegment, recordToolVisit]);

  const renderRoute = () => {
    if (cleanPath === '/') {
      return (
        <HomePage
          onNavigate={navigate}
          favorites={favorites}
          recentSlugs={recentSlugs}
          onToggleFavorite={toggleFavorite}
        />
      );
    }

    if (topSegment.startsWith('category/')) {
      const catSlug = topSegment.replace('category/', '');
      const cat = getCategoryBySlug(catSlug);
      if (cat) {
        return (
          <CategoryPage
            category={cat}
            onNavigate={navigate}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      }
    }

    if (topSegment in LEGAL_SLUGS) {
      return <LegalPage slug={topSegment as LegalSlug} onNavigate={navigate} />;
    }

    const tool = getToolBySlug(topSegment);
    if (tool) {
      return (
        <ToolPage
          tool={tool}
          onNavigate={navigate}
          isFavorite={isFavorite(tool.slug)}
          onToggleFavorite={toggleFavorite}
        />
      );
    }

    return <NotFoundPage onNavigate={navigate} onOpenSearch={() => setSearchOpen(true)} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main id="main-content" className="flex-1">
        {renderRoute()}
      </main>

      <Footer onNavigate={navigate} />

      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
        recentSlugs={recentSlugs}
        favorites={favorites}
      />

      <CookieBanner onNavigate={navigate} />
    </div>
  );
}
