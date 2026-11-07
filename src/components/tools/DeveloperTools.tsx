import React, { useState, useMemo } from 'react';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { DownloadButton } from '../ui/DownloadButton';
import { ResetButton } from '../ui/ResetButton';
import { formatNumber } from '../../lib/querySync';

// 1. JSON Formatter + Validator
export const JsonFormatterValidator: React.FC = () => {
  const [input, setInput] = useState(
    '{"platform":"UseKit","privacyFirst":true,"toolsCount":90,"categories":["Calculators","Developer","Image","PDF"]}'
  );
  const [indent, setIndent] = useState<'2' | '4' | 'minify'>('2');

  const analysis = useMemo(() => {
    if (!input.trim()) return { valid: false, error: 'Enter JSON to validate and format.', output: '' };
    try {
      const parsed = JSON.parse(input);
      const output =
        indent === 'minify'
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, Number(indent));
      return {
        valid: true,
        error: null,
        output,
        sizeBytes: new TextEncoder().encode(output).length,
      };
    } catch (e) {
      return {
        valid: false,
        error: (e as Error).message,
        output: '',
        sizeBytes: 0,
      };
    }
  }, [input, indent]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['2', '4', 'minify'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setIndent(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                indent === m
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
              }`}
            >
              {m === 'minify' ? 'Minify (1-Line)' : `${m}-Space Indent`}
            </button>
          ))}
        </div>
        <span
          className={`text-xs font-semibold ${
            analysis.valid
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {analysis.valid ? `Valid JSON (${analysis.sizeBytes} bytes)` : 'Invalid JSON Syntax'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Raw JSON Input"
          rows={10}
          className="font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Textarea
          label="Formatted / Validated Output"
          rows={10}
          className="font-mono text-xs"
          value={analysis.valid ? analysis.output : `Syntax Error:\n${analysis.error}`}
          readOnly
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={() => setInput('')} size="sm" />
        {analysis.valid && (
          <div className="flex items-center gap-2">
            <CopyButton text={analysis.output} label="Copy JSON" size="sm" />
            <DownloadButton
              content={analysis.output}
              filename="formatted.json"
              mimeType="application/json"
              label="Download .json"
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// 2. HTML Formatter
export const HtmlFormatter: React.FC = () => {
  const [html, setHtml] = useState(
    '<div class="card"><header><h2>UseKit</h2><p>Everyday Tools. All in One Place.</p></header><main><button type="button">Get Started</button></main></div>'
  );
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');

  const formatted = useMemo(() => {
    if (!html.trim()) return '';
    if (mode === 'minify') {
      return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    const tokens = html
      .replace(/>\s*</g, '>\n<')
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    let indentLevel = 0;
    const lines: string[] = [];

    for (const token of tokens) {
      const isClosing = /^<\//.test(token);
      const tagMatch = /^<([a-zA-Z0-9-]+)/.exec(token);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      const isSelfClosing = /\/>$/.test(token) || voidTags.has(tagName) || /^<!/.test(token);
      const hasInlineClose = /<([a-zA-Z0-9-]+)[^>]*>.*<\/\1>$/.test(token);

      if (isClosing) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      lines.push(`${'  '.repeat(indentLevel)}${token}`);
      if (!isClosing && !isSelfClosing && !hasInlineClose && token.startsWith('<')) {
        indentLevel += 1;
      }
    }
    return lines.join('\n');
  }, [html, mode]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          variant={mode === 'beautify' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('beautify')}
        >
          Beautify / Indent HTML
        </Button>
        <Button
          variant={mode === 'minify' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('minify')}
        >
          Minify HTML
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Input HTML"
          rows={9}
          className="font-mono text-xs"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />
        <Textarea
          label="Formatted HTML Output"
          rows={9}
          className="font-mono text-xs"
          value={formatted}
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setHtml('')} size="sm" />
        <CopyButton text={formatted} label="Copy HTML" size="sm" />
      </div>
    </div>
  );
};

// 3. CSS Minifier
export const CssMinifier: React.FC = () => {
  const [css, setCss] = useState(
    `/* Main Card Styles */\n.card {\n  display: flex;\n  padding: 16px 24px;\n  background-color: #ffffff;\n  border-radius: 12px;\n}\n`
  );

  const res = useMemo(() => {
    const minified = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    const origBytes = new TextEncoder().encode(css).length;
    const minBytes = new TextEncoder().encode(minified).length;
    const savedPct = origBytes > 0 ? ((origBytes - minBytes) / origBytes) * 100 : 0;
    return { minified, origBytes, minBytes, savedPct };
  }, [css]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultBox label="Original CSS Size" value={`${formatNumber(res.origBytes)} B`} />
        <ResultBox highlight label="Minified CSS Size" value={`${formatNumber(res.minBytes)} B`} />
        <ResultBox
          highlight
          label="Bytes Saved"
          value={`${formatNumber(Math.max(0, res.savedPct), 1)}%`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Source CSS"
          rows={8}
          className="font-mono text-xs"
          value={css}
          onChange={(e) => setCss(e.target.value)}
        />
        <Textarea
          label="Minified CSS"
          rows={8}
          className="font-mono text-xs"
          value={res.minified}
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setCss('')} size="sm" />
        <CopyButton text={res.minified} label="Copy Minified CSS" size="sm" />
      </div>
    </div>
  );
};

// 4. JavaScript Minifier
export const JsMinifier: React.FC = () => {
  const [js, setJs] = useState(
    `// Calculate compound growth\nfunction calculateGrowth(principal, rate, years) {\n  const factor = Math.pow(1 + rate / 100, years);\n  return principal * factor;\n}\n`
  );

  const res = useMemo(() => {
    // Safe token-aware JS minifier stripping comments and collapsing non-string whitespace
    const minified = js
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .split(/\r?\n/)
      .map((l) => l.replace(/\s*\/\/.*$/, '').trim())
      .filter(Boolean)
      .join(' ')
      .replace(/\s*([=+\-*/%&|^!<>?:;,{}()[\]])\s*/g, '$1');

    const origBytes = new TextEncoder().encode(js).length;
    const minBytes = new TextEncoder().encode(minified).length;
    const savedPct = origBytes > 0 ? ((origBytes - minBytes) / origBytes) * 100 : 0;
    return { minified, origBytes, minBytes, savedPct };
  }, [js]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultBox label="Original JS Size" value={`${formatNumber(res.origBytes)} B`} />
        <ResultBox highlight label="Minified JS Size" value={`${formatNumber(res.minBytes)} B`} />
        <ResultBox
          highlight
          label="Reduction"
          value={`${formatNumber(Math.max(0, res.savedPct), 1)}%`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Input JavaScript"
          rows={8}
          className="font-mono text-xs"
          value={js}
          onChange={(e) => setJs(e.target.value)}
        />
        <Textarea
          label="Minified JavaScript"
          rows={8}
          className="font-mono text-xs"
          value={res.minified}
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setJs('')} size="sm" />
        <CopyButton text={res.minified} label="Copy Minified JS" size="sm" />
      </div>
    </div>
  );
};

// 5. Base64 Encoder / Decoder
export const Base64EncoderDecoder: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('UseKit — Everyday Tools. All in One Place.');

  const result = useMemo(() => {
    if (!input) return { output: '', error: null };
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(input);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return { output: btoa(binary), error: null };
      } else {
        const binary = atob(input.trim());
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        return { output: new TextDecoder().decode(bytes), error: null };
      }
    } catch {
      return { output: '', error: 'Invalid Base64 string provided for decoding.' };
    }
  }, [input, mode]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          variant={mode === 'encode' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('encode')}
        >
          Encode to Base64
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('decode')}
        >
          Decode from Base64
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label={mode === 'encode' ? 'Plain UTF-8 Text' : 'Base64 Encoded String'}
          rows={6}
          className="font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Textarea
          label={mode === 'encode' ? 'Base64 Output' : 'Decoded UTF-8 Text'}
          rows={6}
          className="font-mono text-xs"
          value={result.error || result.output}
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setInput('')} size="sm" />
        <CopyButton text={result.output} label="Copy Output" size="sm" />
      </div>
    </div>
  );
};

// 6. URL Encoder / Decoder
export const UrlEncoderDecoder: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('https://usekit.vercel.app/gst-calculator?amount=1500&rate=18%');

  const output = useMemo(() => {
    try {
      return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return 'Malformed URI component sequence.';
    }
  }, [input, mode]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          variant={mode === 'encode' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('encode')}
        >
          URL Encode (Percent-Encoding)
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('decode')}
        >
          URL Decode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Input String / URL"
          rows={5}
          className="font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Textarea
          label="Result"
          rows={5}
          className="font-mono text-xs"
          value={output}
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setInput('')} size="sm" />
        <CopyButton text={output} label="Copy Result" size="sm" />
      </div>
    </div>
  );
};

// 7. HTML Entity Encoder / Decoder
export const HtmlEntityEncoderDecoder: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('<script>alert("XSS & Injection Test © 2025")</script>');

  const output = useMemo(() => {
    if (mode === 'encode') {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    } else {
      return input
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
    }
  }, [input, mode]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          variant={mode === 'encode' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('encode')}
        >
          Encode HTML Entities
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setMode('decode')}
        >
          Decode HTML Entities
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Input"
          rows={5}
          className="font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Textarea
          label="Output"
          rows={5}
          className="font-mono text-xs"
          value={output}
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setInput('')} size="sm" />
        <CopyButton text={output} label="Copy Entities" size="sm" />
      </div>
    </div>
  );
};

// 8. UUID Generator
function generateCryptoUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const UuidGenerator: React.FC = () => {
  const [count, setCount] = useState('5');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [seed, setSeed] = useState(0);

  const uuids = useMemo(() => {
    void seed;
    const n = Math.min(100, Math.max(1, parseInt(count, 10) || 1));
    const list: string[] = [];
    for (let i = 0; i < n; i++) {
      let id = generateCryptoUuid();
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    return list.join('\n');
  }, [count, uppercase, hyphens, seed]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-36">
          <Input
            type="number"
            min="1"
            max="100"
            label="How Many UUIDs"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm pb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
          />
          <span>UPPERCASE</span>
        </label>
        <label className="inline-flex items-center gap-2 text-sm pb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(e) => setHyphens(e.target.checked)}
          />
          <span>Include Hyphens</span>
        </label>
        <div className="pb-1">
          <Button variant="primary" size="md" onClick={() => setSeed((s) => s + 1)}>
            Regenerate UUIDs (v4)
          </Button>
        </div>
      </div>

      <Textarea
        label="Generated RFC 4122 v4 UUIDs"
        rows={7}
        className="font-mono text-xs"
        value={uuids}
        readOnly
      />

      <div className="flex justify-end">
        <CopyButton text={uuids} label="Copy All UUIDs" size="sm" />
      </div>
    </div>
  );
};

// 9. Regex Tester
export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+)');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState(
    'Contact our team at support@usekit.app or engineering@example.org for technical assistance.'
  );

  const testResult = useMemo(() => {
    if (!pattern) return { error: null, matches: [] };
    try {
      const safeFlags = flags.includes('g') ? flags : `${flags}g`;
      const regex = new RegExp(pattern, safeFlags);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      let m: RegExpExecArray | null;
      let guard = 0;
      while ((m = regex.exec(testString)) !== null && guard < 200) {
        guard++;
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1),
        });
        if (m.index === regex.lastIndex) regex.lastIndex++;
      }
      return { error: null, matches };
    } catch (e) {
      return { error: (e as Error).message, matches: [] };
    }
  }, [pattern, flags, testString]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-3">
          <Input
            label="Regular Expression Pattern"
            prefixAddon="/"
            suffixAddon="/"
            className="font-mono"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
        </div>
        <Input
          label="Flags (g, i, m, s, u)"
          className="font-mono"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
        />
      </div>

      <Textarea
        label="Test String"
        rows={5}
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
      />

      {testResult.error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-mono">
          {testResult.error}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Matches Found: {testResult.matches.length}
          </div>
          {testResult.matches.length === 0 ? (
            <p className="text-xs text-slate-500">No matches found in the test string.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
              {testResult.matches.map((item, idx) => (
                <div
                  key={`${item.index}-${idx}`}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <span>
                    Match #{idx + 1}: <strong className="text-blue-600 dark:text-blue-400">"{item.match}"</strong>
                  </span>
                  <span className="text-slate-500">Index: {item.index}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
