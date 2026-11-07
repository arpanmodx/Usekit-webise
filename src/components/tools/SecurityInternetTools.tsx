import React, { useState, useMemo, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import jsQR from 'jsqr';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { FileDropzone } from '../ui/FileDropzone';
import { ResultBox } from '../ui/ResultBox';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { ResetButton } from '../ui/ResetButton';
import { formatNumber } from '../../lib/querySync';

// 1. Password Generator (crypto.getRandomValues)
export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState('16');
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [nonce, setNonce] = useState(0);

  const generated = useMemo(() => {
    void nonce;
    const len = Math.min(128, Math.max(6, parseInt(length, 10) || 16));
    let u = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let l = 'abcdefghijklmnopqrstuvwxyz';
    let n = '0123456789';
    const s = '!@#$%^&*()-_=+[]{};:,.<>?';

    if (excludeAmbiguous) {
      u = u.replace(/[IO]/g, '');
      l = l.replace(/[lo]/g, '');
      n = n.replace(/[01]/g, '');
    }

    let pool = '';
    if (upper) pool += u;
    if (lower) pool += l;
    if (numbers) pool += n;
    if (symbols) pool += s;
    if (!pool) pool = l + n;

    const randValues = new Uint32Array(len);
    crypto.getRandomValues(randValues);
    let password = '';
    for (let i = 0; i < len; i++) {
      password += pool[randValues[i] % pool.length];
    }

    const entropyBits = Math.round(len * Math.log2(pool.length));
    return { password, entropyBits, poolSize: pool.length };
  }, [length, upper, lower, numbers, symbols, excludeAmbiguous, nonce]);

  return (
    <div className="space-y-6">
      <ResultBox
        highlight
        label="Cryptographically Generated Password"
        value={generated.password}
        sublabel={`Entropy: ~${generated.entropyBits} bits (Pool: ${generated.poolSize} chars)`}
        copyText={generated.password}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <Input
          type="number"
          min="6"
          max="128"
          label="Password Length (6 – 128)"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
        <Button variant="primary" size="md" onClick={() => setNonce((v) => v + 1)}>
          Generate New Password
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
          <span>Uppercase (A–Z)</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
          <span>Lowercase (a–z)</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
          <span>Numbers (0–9)</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
          <span>Symbols (!@#$%...)</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
          />
          <span>Exclude Ambiguous (0, O, 1, l, I)</span>
        </label>
      </div>
    </div>
  );
};

// 2. Password Strength Checker
export const PasswordStrengthChecker: React.FC = () => {
  const [pwd, setPwd] = useState('Tr0ub4dor&3#UseKit!');

  const audit = useMemo(() => {
    const len = pwd.length;
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;

    const entropy = len > 0 && pool > 0 ? Math.round(len * Math.log2(pool)) : 0;
    let rating = 'Weak';
    let crackTime = 'Seconds';
    if (entropy >= 80) {
      rating = 'Very Strong';
      crackTime = 'Centuries (Offline Fast Hash)';
    } else if (entropy >= 60) {
      rating = 'Strong';
      crackTime = 'Years to Decades';
    } else if (entropy >= 45) {
      rating = 'Moderate';
      crackTime = 'Days to Weeks';
    }

    return { len, pool, entropy, rating, crackTime };
  }, [pwd]);

  return (
    <div className="space-y-6">
      <Input
        type="text"
        label="Enter Password to Audit Locally (Never Sent to Any Server)"
        className="font-mono"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultBox highlight label="Strength Rating" value={audit.rating} />
        <ResultBox
          highlight
          label="Information Entropy"
          value={`${audit.entropy} bits`}
          sublabel={`${audit.len} chars, pool size ${audit.pool}`}
        />
        <ResultBox label="Estimated Crack Time" value={audit.crackTime} />
      </div>
    </div>
  );
};

// 3. QR Code Generator
export const QrCodeGenerator: React.FC = () => {
  const [content, setContent] = useState('https://usekit.vercel.app');
  const [size, setSize] = useState('280');
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    const text = content.trim() || 'https://usekit.vercel.app';
    const px = Math.min(1000, Math.max(120, parseInt(size, 10) || 280));
    QRCode.toDataURL(text, {
      width: px,
      margin: 2,
      errorCorrectionLevel: ecLevel,
      color: { dark: fgColor, light: bgColor },
    })
      .then((url) => setDataUrl(url))
      .catch(() => setDataUrl(''));
  }, [content, size, ecLevel, fgColor, bgColor]);

  const handleDownloadQr = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'usekit-qrcode.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="URL or Text to Encode"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <Select
          label="Error Correction"
          value={ecLevel}
          onChange={(e) => setEcLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
          options={[
            { value: 'L', label: 'Low (7% recovery)' },
            { value: 'M', label: 'Medium (15% recovery)' },
            { value: 'Q', label: 'Quartile (25% recovery)' },
            { value: 'H', label: 'High (30% recovery)' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="number"
          min="120"
          max="1000"
          label="Image Size (px)"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <Input
          type="color"
          label="Foreground Color"
          value={fgColor}
          onChange={(e) => setFgColor(e.target.value)}
        />
        <Input
          type="color"
          label="Background Color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </div>

      {dataUrl && (
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
          <img
            src={dataUrl}
            alt="Generated QR code"
            referrerPolicy="no-referrer"
            className="rounded-lg border border-slate-200 shadow-xs"
          />
          <Button variant="primary" size="md" onClick={handleDownloadQr}>
            Download QR Code (.PNG)
          </Button>
        </div>
      )}
    </div>
  );
};

// 4. QR Code Reader
export const QrCodeReader: React.FC = () => {
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImage = (files: File[]) => {
    const f = files[0];
    setError(null);
    setDecodedText(null);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, imgData.width, imgData.height);
      if (code && code.data) {
        setDecodedText(code.data);
      } else {
        setError('No readable QR code was detected in the selected image.');
      }
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/*"
        onFilesSelected={handleImage}
        label="Upload an image or screenshot containing a QR code to decode locally"
      />

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {decodedText && (
        <ResultBox
          highlight
          label="Decoded QR Code Payload"
          value={decodedText}
          copyText={decodedText}
        />
      )}
    </div>
  );
};

// 5. Barcode Generator
export const BarcodeGenerator: React.FC = () => {
  const [value, setValue] = useState('USEKIT-2025');
  const [format, setFormat] = useState('CODE128');
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      setError(null);
      JsBarcode(svgRef.current, value || '123456', {
        format,
        lineColor: '#0f172a',
        background: '#ffffff',
        width: 2,
        height: 80,
        displayValue: true,
      });
    } catch {
      setError(`Value "${value}" is not valid for ${format} barcode specification.`);
    }
  }, [value, format]);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${value}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Barcode Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Select
          label="Barcode Symbology"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[
            { value: 'CODE128', label: 'CODE128 (Alphanumeric)' },
            { value: 'CODE39', label: 'CODE39 (Industrial)' },
            { value: 'EAN13', label: 'EAN-13 (12 or 13 Digits)' },
            { value: 'UPC', label: 'UPC-A (11 or 12 Digits)' },
            { value: 'ITF14', label: 'ITF-14 (14 Digits)' },
          ]}
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="p-6 rounded-xl bg-white border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
        <svg ref={svgRef} className="max-w-full" />
        <Button variant="primary" size="sm" onClick={downloadSvg}>
          Download Barcode (.SVG)
        </Button>
      </div>
    </div>
  );
};

// 6. URL Parser
export const UrlParser: React.FC = () => {
  const [urlStr, setUrlStr] = useState(
    'https://usekit.vercel.app:443/emi-calculator?p=500000&r=8.5&t=10#schedule'
  );

  const parsed = useMemo(() => {
    try {
      const u = new URL(urlStr.trim());
      const params: [string, string][] = [];
      u.searchParams.forEach((v, k) => params.push([k, v]));
      return {
        valid: true,
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || '(default)',
        pathname: u.pathname,
        origin: u.origin,
        hash: u.hash || '(none)',
        params,
      };
    } catch {
      return { valid: false };
    }
  }, [urlStr]);

  return (
    <div className="space-y-6">
      <Input
        label="Full URL to Inspect"
        value={urlStr}
        onChange={(e) => setUrlStr(e.target.value)}
      />

      {!parsed.valid ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          Please enter a valid absolute URL including protocol (e.g., https://...).
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox label="Protocol" value={parsed.protocol ?? ''} />
            <ResultBox highlight label="Hostname / Domain" value={parsed.hostname ?? ''} />
            <ResultBox label="Pathname" value={parsed.pathname ?? ''} />
            <ResultBox label="Origin" value={parsed.origin ?? ''} />
            <ResultBox label="Port" value={parsed.port ?? ''} />
            <ResultBox label="Hash / Fragment" value={parsed.hash ?? ''} />
          </div>

          {parsed.params && parsed.params.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2 px-4">Query Parameter Key</th>
                    <th className="py-2 px-4">Decoded Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {parsed.params.map(([k, v], i) => (
                    <tr key={`${k}-${i}`}>
                      <td className="py-2 px-4 font-semibold text-blue-600 dark:text-blue-400">{k}</td>
                      <td className="py-2 px-4">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 7. IP Address Info (Serverless request headers inspection)
export const IpAddressInfo: React.FC = () => {
  const [info, setInfo] = useState<{
    ip: string;
    country: string;
    region: string;
    city: string;
    timezone: string;
    language: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/ip')
      .then((r) => r.json())
      .then((data) => setInfo(data))
      .catch(() => {
        setInfo({
          ip: '127.0.0.1 (Local Client)',
          country: 'Local',
          region: '—',
          city: '—',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        });
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultBox
          highlight
          label="Client IP Address"
          value={info?.ip || 'Detecting...'}
          copyText={info?.ip}
        />
        <ResultBox
          label="Detected Timezone"
          value={info?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
        />
        <ResultBox
          label="Country / Edge Region"
          value={info?.country || 'Direct Connection'}
          sublabel={info?.city && info.city !== '—' ? `City: ${info.city}` : 'Read from request headers'}
        />
      </div>
    </div>
  );
};

// 8. User Agent Viewer
export const UserAgentViewer: React.FC = () => {
  const [ua, setUa] = useState(() => (typeof navigator !== 'undefined' ? navigator.userAgent : ''));

  const parsed = useMemo(() => {
    let browser = 'Unknown Browser';
    if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome/')) browser = 'Google Chrome / Chromium';
    else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Apple Safari';

    let os = 'Unknown OS';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS X')) os = 'macOS / iOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('Linux')) os = 'Linux';

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    const screenRes =
      typeof window !== 'undefined'
        ? `${window.screen.width} × ${window.screen.height} (@${window.devicePixelRatio}x)`
        : '—';

    return { browser, os, deviceType: isMobile ? 'Mobile / Tablet' : 'Desktop', screenRes };
  }, [ua]);

  return (
    <div className="space-y-6">
      <Input
        label="User-Agent String (Editable to test other UA strings)"
        className="font-mono text-xs"
        value={ua}
        onChange={(e) => setUa(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResultBox highlight label="Browser Family" value={parsed.browser} />
        <ResultBox highlight label="Operating System" value={parsed.os} />
        <ResultBox label="Device Category" value={parsed.deviceType} />
        <ResultBox label="Screen Resolution" value={parsed.screenRes} />
      </div>

      <div className="flex justify-end">
        <CopyButton text={ua} label="Copy User-Agent" size="sm" />
      </div>
    </div>
  );
};
