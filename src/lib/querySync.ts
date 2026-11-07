export function getQueryParam(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    const params = new URLSearchParams(window.location.search);
    const val = params.get(key);
    return val !== null && val.trim() !== '' ? val : fallback;
  } catch {
    return fallback;
  }
}

export function syncQueryParams(paramsObj: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    Object.entries(paramsObj).forEach(([k, v]) => {
      const str = String(v).trim();
      if (str) {
        url.searchParams.set(k, str);
      } else {
        url.searchParams.delete(k);
      }
    });
    window.history.replaceState({}, '', url.toString());
  } catch {
    // Ignore history API restrictions in sandboxed environments
  }
}

export function formatNumber(num: number, maxDecimals = 2): string {
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(num);
}

export function formatCurrency(num: number, decimals = 2): string {
  if (!Number.isFinite(num)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
