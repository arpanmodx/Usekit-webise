import React, { useEffect, useRef, useState } from 'react';

// Sequential loader queue prevents concurrent atOptions overwrites across multiple banners
let adLoadQueue: Promise<void> = Promise.resolve();

function enqueueAdLoad(task: () => Promise<void>): Promise<void> {
  const next = adLoadQueue.then(task, task);
  adLoadQueue = next;
  return next;
}

export interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
  routeKey?: string;
  label?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adKey,
  width,
  height,
  routeKey = '',
  label = 'Advertisement',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    enqueueAdLoad(
      () =>
        new Promise<void>((resolve) => {
          const el = containerRef.current;
          if (cancelled || !el) {
            resolve();
            return;
          }

          el.innerHTML = '';

          const win = window as unknown as Record<string, unknown>;
          win.atOptions = {
            key: adKey,
            format: 'iframe',
            height,
            width,
            params: {},
          };

          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = `https://bauval.org/22/${adKey}`;
          script.async = false;

          let settled = false;
          const finish = () => {
            if (!settled) {
              settled = true;
              resolve();
            }
          };

          const timeoutId = window.setTimeout(finish, 4000);
          script.onload = () => {
            window.clearTimeout(timeoutId);
            finish();
          };
          script.onerror = () => {
            window.clearTimeout(timeoutId);
            finish();
          };

          el.appendChild(script);
        })
    );

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [adKey, width, height, routeKey]);

  return (
    <aside
      aria-label={label}
      className={`w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div
        ref={containerRef}
        style={{ maxWidth: '100%' }}
        className="flex items-center justify-center overflow-hidden"
      />
    </aside>
  );
};

/**
 * Automatically selects the exact banner size for the current viewport:
 * - Desktop (>= 768px): 728x90 Leaderboard
 * - Tablet (>= 500px): 468x60 Banner
 * - Mobile (< 500px): 320x50 Mobile Banner
 */
export const ResponsiveBannerAd: React.FC<{ routeKey?: string; className?: string }> = ({
  routeKey = '',
  className = '',
}) => {
  const [size, setSize] = useState<{ key: string; width: number; height: number } | null>(null);

  useEffect(() => {
    const pickSize = () => {
      const w = window.innerWidth;
      if (w >= 768) {
        return { key: '66226d1fccd92fd0beba5f1e8ee0ea0c', width: 728, height: 90 };
      }
      if (w >= 500) {
        return { key: '40dc08f78314ae8b6eab4166eb450778', width: 468, height: 60 };
      }
      return { key: '4e4bcf1f951bcf24e3027381ac68e1ab', width: 320, height: 50 };
    };

    const next = pickSize();
    setSize((prev) => (prev?.key === next.key ? prev : next));

    const onResize = () => {
      const updated = pickSize();
      setSize((prev) => (prev?.key === updated.key ? prev : updated));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!size) return null;

  return (
    <AdBanner
      adKey={size.key}
      width={size.width}
      height={size.height}
      routeKey={routeKey}
      className={className}
    />
  );
};

/** 300x250 Medium Rectangle */
export const RectangleAdBanner: React.FC<{ routeKey?: string; className?: string }> = ({
  routeKey = '',
  className = '',
}) => (
  <AdBanner
    adKey="d77546b577ba4934c36125938e88910c"
    width={300}
    height={250}
    routeKey={routeKey}
    className={className}
  />
);

/** 468x60 Classic Banner (falls back to 320x50 on narrow mobile viewports) */
export const CompactBannerAd: React.FC<{ routeKey?: string; className?: string }> = ({
  routeKey = '',
  className = '',
}) => {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 500);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <AdBanner
      adKey={isNarrow ? '4e4bcf1f951bcf24e3027381ac68e1ab' : '40dc08f78314ae8b6eab4166eb450778'}
      width={isNarrow ? 320 : 468}
      height={isNarrow ? 50 : 60}
      routeKey={routeKey}
      className={className}
    />
  );
};

/** 160x600 Vertical Skyscraper */
export const SkyscraperAdBanner: React.FC<{ routeKey?: string; className?: string }> = ({
  routeKey = '',
  className = '',
}) => (
  <AdBanner
    adKey="c250fb16d1aaa105919a0db386e1d7d2"
    width={160}
    height={600}
    routeKey={routeKey}
    className={className}
  />
);

/** Native Banner Widget (bauval.org container-2394a3a27fb27a049481e399697acb6e) */
export const NativeAdBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Avoid duplicating script if already injected
    if (el.querySelector('script[data-native-ad="2394a3a27fb27a049481e399697acb6e"]')) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-native-ad', '2394a3a27fb27a049481e399697acb6e');
    script.src = 'https://bauval.org/21/2394a3a27fb27a049481e399697acb6e';
    el.appendChild(script);
  }, []);

  return (
    <aside
      aria-label="Sponsored Recommendations"
      ref={wrapperRef}
      className={`w-full max-w-6xl mx-auto px-4 sm:px-6 ${className}`}
    >
      <div id="container-2394a3a27fb27a049481e399697acb6e" />
    </aside>
  );
};
