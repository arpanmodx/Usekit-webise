import React from 'react';
import { CATEGORIES, getPopularTools } from '../../lib/tools';
import { SITE_CONFIG } from '../../lib/siteConfig';

export interface FooterProps {
  onNavigate: (href: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const popularTools = getPopularTools().slice(0, 8);
  const currentYear = new Date().getFullYear();

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white inline-block"
            >
              {SITE_CONFIG.name}
            </a>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Fast, accurate, privacy-first web utilities and calculators that run directly in your browser without uploading personal files or data.
            </p>
          </div>

          {/* Column 2: Popular Tools */}
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Popular Calculators
            </h2>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <a
                    href={`/${tool.slug}`}
                    onClick={(e) => handleLink(e, `/${tool.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tool Categories */}
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Browse Categories
            </h2>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <a
                    href={`/category/${cat.slug}`}
                    onClick={(e) => handleLink(e, `/category/${cat.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal, Trust & Sitemap */}
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Company & Legal
            </h2>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="/about-us"
                  onClick={(e) => handleLink(e, '/about-us')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  onClick={(e) => handleLink(e, '/contact-us')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => handleLink(e, '/privacy-policy')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  onClick={(e) => handleLink(e, '/terms-and-conditions')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => handleLink(e, '/disclaimer')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  onClick={(e) => handleLink(e, '/cookie-policy')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li className="pt-1 flex items-center gap-3">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  XML Sitemap
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {currentYear} {SITE_CONFIG.name}. All rights reserved. Calculations run locally in your browser.
          </p>
          <p>Built for speed, accessibility, and privacy.</p>
        </div>
      </div>
    </footer>
  );
};
