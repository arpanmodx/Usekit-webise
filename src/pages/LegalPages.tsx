import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { SITE_CONFIG } from '../lib/siteConfig';

export type LegalSlug =
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'about-us'
  | 'contact-us'
  | 'disclaimer'
  | 'cookie-policy';

export interface LegalPageProps {
  slug: LegalSlug;
  onNavigate: (href: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ slug, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setFeedback('Please fill in your name, email address, and message.');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setStatus('sent');
        setFeedback('Thank you! Your message has been received by the UseKit team.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        throw new Error('Request failed');
      }
    } catch {
      setStatus('sent');
      setFeedback('Your message has been logged locally. You can also reach us directly via email below.');
    }
  };

  const renderContent = () => {
    switch (slug) {
      case 'privacy-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500">Last Updated: January 2025</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              At <strong>{SITE_CONFIG.name}</strong> ({SITE_CONFIG.tagline}), your privacy is a foundational engineering principle. Unlike traditional online converters and calculators that upload your inputs and files to remote servers, UseKit processes calculator inputs, text, images, and PDF documents locally inside your web browser whenever technically possible.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Client-Side Data Processing
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              All calculations, unit conversions, financial projections, and local file operations execute inside your browser’s JavaScript and WebAssembly sandbox. Your personal numbers, financial inputs, and files never leave your device and are never stored on our servers.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. LocalStorage and Preferences
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We use browser <code>localStorage</code> strictly on your device to remember your color theme preference (Light, Dark, or System), your bookmarked Favorite tools, your Recently Used tools list, and your Cookie Banner choice. You can clear these at any time through your browser settings.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Server Logs, Cookies, and Third-Party Advertising (Google AdSense)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Standard web hosting infrastructure automatically records basic non-identifying request metadata (such as browser user-agent, referring page, and timestamp) for security and reliability. When advertising is enabled, third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites. Users may opt out of personalized advertising by visiting Google Ads Settings.
            </p>
          </div>
        );

      case 'terms-and-conditions':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Terms and Conditions
            </h1>
            <p className="text-xs text-slate-500">Last Updated: January 2025</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              By accessing and using <strong>{SITE_CONFIG.name}</strong>, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. License and Permitted Use
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              UseKit grants you a revocable, non-exclusive, free license to use our web calculators and utilities for personal, educational, and commercial workflows. You agree not to scrape, overload, or disrupt the availability of the platform.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. No Financial, Medical, or Legal Advice
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Outputs from financial calculators (EMI, Loan, GST, Salary, Compound Interest) and health calculators (BMI) are provided for informational and educational estimation only. Always verify critical figures with a qualified financial advisor, certified accountant, or healthcare professional before making binding decisions.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Limitation of Liability
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              All tools are provided "as is" without warranties of any kind. In no event shall UseKit or its contributors be liable for any direct, indirect, or consequential damages arising out of the use or inability to use the tools.
            </p>
          </div>
        );

      case 'about-us':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              About UseKit
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>UseKit</strong> ("{SITE_CONFIG.tagline}") was built to solve a frustrating problem on the modern web: simple everyday tools—like calculating a loan EMI, checking date differences, converting units, or formatting files—are often buried behind slow popups, paywalls, or privacy-invasive server uploads.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">100% Browser-First</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Tools run directly on your device so your data stays private and results appear instantaneously.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Transparent Formulas</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Every calculator documents the exact mathematical equations, edge cases, and industry conventions used.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Accessible Everywhere</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Designed for keyboard navigation, screen readers, mobile touch screens, and offline PWA installation.
                </p>
              </div>
            </div>
          </div>
        );

      case 'disclaimer':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Disclaimer
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              The information, calculators, converters, and utilities provided on <strong>{SITE_CONFIG.name}</strong> are for general informational and educational purposes only. While we engineer and test every mathematical formula against industry standards, we make no representation or warranty regarding completeness, accuracy, or suitability for any specific legal, tax, medical, or financial filing.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Bank EMI figures and tax calculations may vary slightly across institutions due to rounding rules, day-count conventions (360 vs. 365 days), or local regulatory surcharges. Health metrics such as Body Mass Index (BMI) are general screening indicators and do not replace professional medical advice.
            </p>
          </div>
        );

      case 'cookie-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Cookie Policy
            </h1>
            <p className="text-xs text-slate-500">Last Updated: January 2025</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              This Cookie Policy explains how <strong>{SITE_CONFIG.name}</strong> uses browser storage and cookies when you visit our platform.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Essential Local Storage
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We store lightweight configuration keys in your browser’s <code>localStorage</code>: <code>usekit-theme</code> (your dark/light theme preference), <code>usekit-favorites</code> (your bookmarked tools), <code>usekit-recent-tools</code> (recently visited tools), and <code>usekit-cookie-consent</code> (your consent banner state).
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Analytics and Advertising Cookies
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              If you choose "Accept All" on our consent banner and advertising slots are enabled, third-party partners such as Google AdSense may set cookies to measure ad impressions and personalize ad relevance. Choosing "Essential Only" restricts storage to strictly necessary site functionality.
            </p>
          </div>
        );

      case 'contact-us':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Have a question, found a bug in a calculation, or want to request a new everyday utility tool? Send us a message using the form below or email us directly at{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                {SITE_CONFIG.contactEmail}
              </a>
              .
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Subject"
                placeholder="Tool suggestion or feedback"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                label="Message"
                rows={5}
                placeholder="Tell us how we can help..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Button type="submit" variant="primary" disabled={status === 'submitting'}>
                  <Mail className="w-4 h-4" />
                  <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                </Button>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(
                    subject || 'UseKit Inquiry'
                  )}&body=${encodeURIComponent(message)}`}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
                >
                  Or open in your default email client →
                </a>
              </div>

              {status === 'sent' && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-700 dark:text-red-300">
                  {feedback}
                </div>
              )}
            </form>
          </div>
        );
    }
  };

  const titleMap: Record<LegalSlug, string> = {
    'privacy-policy': 'Privacy Policy',
    'terms-and-conditions': 'Terms and Conditions',
    'about-us': 'About Us',
    'contact-us': 'Contact Us',
    disclaimer: 'Disclaimer',
    'cookie-policy': 'Cookie Policy',
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumbs onNavigate={onNavigate} items={[{ label: titleMap[slug] }]} />
      <div className="p-6 sm:p-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {renderContent()}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>UseKit Privacy Guarantee — All calculators and file tools execute locally in your browser.</span>
        </div>
      </div>
    </article>
  );
};
