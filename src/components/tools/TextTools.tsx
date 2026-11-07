import React, { useState, useMemo } from 'react';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { ResetButton } from '../ui/ResetButton';
import { formatNumber } from '../../lib/querySync';

// 1. Word Counter
export const WordCounter: React.FC = () => {
  const [text, setText] = useState(
    'UseKit provides fast, privacy-first browser tools for writers, students, engineers, and marketers. Paste or type your text here to analyze word count, character length, sentence structure, and reading time instantly.'
  );

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const charWithSpaces = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      : 0;
    const readingMinutes = Math.ceil(wordCount / 225);
    const speakingMinutes = Math.ceil(wordCount / 130);

    // Top keywords
    const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'you', 'your', 'are', 'from', 'or', 'in', 'to', 'of', 'a', 'is', 'on', 'by']);
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2 && !stopWords.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1;
      }
    });
    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      wordCount,
      charWithSpaces,
      charNoSpaces,
      sentences,
      paragraphs,
      readingMinutes,
      speakingMinutes,
      topKeywords,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Enter or Paste Text"
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your article, essay, or social post here..."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResetButton onReset={() => setText('')} label="Clear Text" size="sm" />
        <CopyButton text={text} label="Copy Text" size="sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <ResultBox highlight label="Words" value={formatNumber(stats.wordCount)} />
        <ResultBox highlight label="Characters" value={formatNumber(stats.charWithSpaces)} />
        <ResultBox label="No Spaces" value={formatNumber(stats.charNoSpaces)} />
        <ResultBox label="Sentences" value={formatNumber(stats.sentences)} />
        <ResultBox label="Paragraphs" value={formatNumber(stats.paragraphs)} />
        <ResultBox
          label="Reading Time"
          value={`~${stats.readingMinutes} min`}
          sublabel={`Speaking: ~${stats.speakingMinutes} min`}
        />
      </div>

      {stats.topKeywords.length > 0 && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2.5">
            Top Keyword Density
          </h3>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            {stats.topKeywords.map(([word, count]) => (
              <span key={word} className="text-slate-700 dark:text-slate-300">
                <strong>{word}</strong>: {count} ({((count / stats.wordCount) * 100).toFixed(1)}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Character Counter
export const CharacterCounter: React.FC = () => {
  const [text, setText] = useState(
    'Check exact character length, UTF-8 byte size, and social media platform limits in real time.'
  );

  const metrics = useMemo(() => {
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const utf8Bytes = new TextEncoder().encode(text).length;
    return { chars, noSpaces, lines, utf8Bytes };
  }, [text]);

  const limits = [
    { name: 'Google Meta Title', max: 60 },
    { name: 'Google Meta Description', max: 160 },
    { name: 'SMS Message', max: 160 },
    { name: 'X / Twitter Post', max: 280 },
    { name: 'YouTube Video Title', max: 100 },
  ];

  return (
    <div className="space-y-6">
      <Textarea
        label="Your Text"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to inspect exact character counts and platform limits..."
      />

      <div className="flex justify-between">
        <ResetButton onReset={() => setText('')} label="Clear" size="sm" />
        <CopyButton text={text} label="Copy Text" size="sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ResultBox highlight label="Characters (With Spaces)" value={formatNumber(metrics.chars)} />
        <ResultBox label="Characters (No Spaces)" value={formatNumber(metrics.noSpaces)} />
        <ResultBox label="UTF-8 Byte Size" value={`${formatNumber(metrics.utf8Bytes)} B`} />
        <ResultBox label="Total Lines" value={formatNumber(metrics.lines)} />
      </div>

      <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Platform Character Limit Check
        </h3>
        {limits.map((lim) => {
          const remaining = lim.max - metrics.chars;
          const over = remaining < 0;
          return (
            <div key={lim.name} className="flex items-center justify-between text-xs py-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">{lim.name}</span>
              <span
                className={`font-mono ${
                  over ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500'
                }`}
              >
                {metrics.chars} / {lim.max} ({over ? `${Math.abs(remaining)} over` : `${remaining} left`})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Case Converter
export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('Convert any text between UPPERCASE, lowercase, Title Case, and developer naming conventions.');

  const tokenize = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const transform = (mode: string) => {
    switch (mode) {
      case 'upper':
        setText(text.toUpperCase());
        break;
      case 'lower':
        setText(text.toLowerCase());
        break;
      case 'title':
        setText(
          text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        );
        break;
      case 'sentence':
        setText(
          text
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        );
        break;
      case 'camel': {
        const words = tokenize(text);
        setText(
          words
            .map((w, i) =>
              i === 0
                ? w.toLowerCase()
                : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
            )
            .join('')
        );
        break;
      }
      case 'pascal': {
        const words = tokenize(text);
        setText(
          words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join('')
        );
        break;
      }
      case 'snake':
        setText(tokenize(text).map((w) => w.toLowerCase()).join('_'));
        break;
      case 'kebab':
        setText(tokenize(text).map((w) => w.toLowerCase()).join('-'));
        break;
      case 'constant':
        setText(tokenize(text).map((w) => w.toUpperCase()).join('_'));
        break;
    }
  };

  return (
    <div className="space-y-5">
      <Textarea
        label="Input / Output Text"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => transform('upper')}>
          UPPERCASE
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('lower')}>
          lowercase
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('title')}>
          Title Case
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('sentence')}>
          Sentence case
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('camel')}>
          camelCase
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('pascal')}>
          PascalCase
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('snake')}>
          snake_case
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('kebab')}>
          kebab-case
        </Button>
        <Button variant="secondary" size="sm" onClick={() => transform('constant')}>
          CONSTANT_CASE
        </Button>
      </div>

      <div className="flex justify-between pt-2">
        <ResetButton onReset={() => setText('')} label="Clear" size="sm" />
        <CopyButton text={text} label="Copy Converted Text" size="sm" />
      </div>
    </div>
  );
};

// 4. Text Reverser
export const TextReverser: React.FC = () => {
  const [text, setText] = useState('Everyday Tools. All in One Place.');
  const [mode, setMode] = useState<'chars' | 'words' | 'each-word' | 'lines'>('chars');

  const output = useMemo(() => {
    if (!text) return '';
    if (mode === 'chars') return Array.from(text).reverse().join('');
    if (mode === 'words') return text.split(/\s+/).reverse().join(' ');
    if (mode === 'each-word')
      return text
        .split(' ')
        .map((w) => Array.from(w).reverse().join(''))
        .join(' ');
    return text.split(/\r?\n/).reverse().join('\n');
  }, [text, mode]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'chars', label: 'Reverse All Characters' },
          { id: 'words', label: 'Reverse Word Order' },
          { id: 'each-word', label: 'Reverse Letters in Each Word' },
          { id: 'lines', label: 'Reverse Line Order' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id as typeof mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
              mode === m.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Textarea
        label="Original Text"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Textarea label="Reversed Output" rows={4} value={output} readOnly />

      <div className="flex justify-between">
        <ResetButton onReset={() => setText('')} size="sm" />
        <CopyButton text={output} label="Copy Reversed Text" size="sm" />
      </div>
    </div>
  );
};

// 5. Remove Duplicate Lines
export const RemoveDuplicateLines: React.FC = () => {
  const [input, setInput] = useState('apple\nbanana\napple\norange\nbanana\ngrape');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);

  const res = useMemo(() => {
    const rawLines = input.split(/\r?\n/);
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of rawLines) {
      const processed = trimLines ? line.trim() : line;
      if (removeEmpty && processed === '') continue;
      const key = caseSensitive ? processed : processed.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(processed);
      }
    }

    return {
      originalCount: rawLines.length,
      uniqueCount: unique.length,
      removedCount: Math.max(0, rawLines.length - unique.length),
      output: unique.join('\n'),
    };
  }, [input, caseSensitive, trimLines, removeEmpty]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          <span>Case-Sensitive Matching</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
          />
          <span>Trim Leading/Trailing Spaces</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={(e) => setRemoveEmpty(e.target.checked)}
          />
          <span>Remove Empty Lines</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label={`Input Lines (${res.originalCount})`}
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Textarea
          label={`Deduplicated Output (${res.uniqueCount} unique, ${res.removedCount} removed)`}
          rows={8}
          value={res.output}
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setInput('')} size="sm" />
        <CopyButton text={res.output} label="Copy Unique Lines" size="sm" />
      </div>
    </div>
  );
};

// 6. Text Cleaner
export const TextCleaner: React.FC = () => {
  const [text, setText] = useState(
    '   Hello   world!   <p>This   text   has   extra   spaces</p>\n\n\nand   blank   lines.   '
  );
  const [stripHtml, setStripHtml] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [stripPunctuation, setStripPunctuation] = useState(false);

  const cleaned = useMemo(() => {
    let out = text;
    if (stripHtml) out = out.replace(/<[^>]*>/g, '');
    if (stripPunctuation) out = out.replace(/[^\w\s\n]/g, '');
    if (collapseSpaces) {
      out = out
        .split(/\r?\n/)
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .join('\n');
    }
    if (removeEmptyLines) {
      out = out
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0)
        .join('\n');
    }
    return out.trim();
  }, [text, stripHtml, collapseSpaces, removeEmptyLines, stripPunctuation]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={stripHtml}
            onChange={(e) => setStripHtml(e.target.checked)}
          />
          <span>Strip HTML Tags</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={collapseSpaces}
            onChange={(e) => setCollapseSpaces(e.target.checked)}
          />
          <span>Collapse Extra Spaces</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmptyLines}
            onChange={(e) => setRemoveEmptyLines(e.target.checked)}
          />
          <span>Remove Blank Lines</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={stripPunctuation}
            onChange={(e) => setStripPunctuation(e.target.checked)}
          />
          <span>Remove Punctuation</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Dirty Input Text"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Textarea label="Cleaned Output" rows={7} value={cleaned} readOnly />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setText('')} size="sm" />
        <CopyButton text={cleaned} label="Copy Cleaned Text" size="sm" />
      </div>
    </div>
  );
};

// 7. Text to Slug
export const TextToSlug: React.FC = () => {
  const [input, setInput] = useState('How to Calculate GST in India (2025 Complete Guide!)');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [removeStopWords, setRemoveStopWords] = useState(false);

  const slug = useMemo(() => {
    const stops = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'with']);
    let s = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-_]/g, ' ');
    let words = s.trim().split(/[\s-_]+/).filter(Boolean);
    if (removeStopWords) {
      words = words.filter((w) => !stops.has(w));
    }
    return words.join(separator);
  }, [input, separator, removeStopWords]);

  return (
    <div className="space-y-5">
      <Input
        label="Article Title or Phrase"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter headline to convert into an SEO-friendly URL slug..."
      />

      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
        <div className="inline-flex items-center gap-2">
          <span className="font-medium">Separator:</span>
          <button
            type="button"
            onClick={() => setSeparator('-')}
            className={`px-2.5 py-1 rounded border cursor-pointer ${
              separator === '-' ? 'bg-blue-600 text-white border-blue-600' : ''
            }`}
          >
            Hyphen (-)
          </button>
          <button
            type="button"
            onClick={() => setSeparator('_')}
            className={`px-2.5 py-1 rounded border cursor-pointer ${
              separator === '_' ? 'bg-blue-600 text-white border-blue-600' : ''
            }`}
          >
            Underscore (_)
          </button>
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeStopWords}
            onChange={(e) => setRemoveStopWords(e.target.checked)}
          />
          <span>Remove Stop Words (a, the, in, to, of...)</span>
        </label>
      </div>

      <ResultBox
        highlight
        label="Generated URL Slug"
        value={slug || '—'}
        sublabel={`${slug.length} characters`}
        copyText={slug}
      />
    </div>
  );
};

// 8. Lorem Ipsum Generator
const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.',
  'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
  'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
];

export const LoremIpsumGenerator: React.FC = () => {
  const [count, setCount] = useState('3');
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');

  const output = useMemo(() => {
    const n = Math.min(100, Math.max(1, parseInt(count, 10) || 1));
    if (unit === 'sentences') {
      const list: string[] = [];
      for (let i = 0; i < n; i++) {
        list.push(LOREM_SENTENCES[i % LOREM_SENTENCES.length]);
      }
      return list.join(' ');
    }
    if (unit === 'words') {
      const allWords = LOREM_SENTENCES.join(' ')
        .replace(/[.,]/g, '')
        .toLowerCase()
        .split(' ');
      const list: string[] = [];
      for (let i = 0; i < n; i++) {
        list.push(allWords[i % allWords.length]);
      }
      return list.join(' ');
    }
    const paras: string[] = [];
    for (let p = 0; p < n; p++) {
      const s1 = LOREM_SENTENCES[(p * 3) % LOREM_SENTENCES.length];
      const s2 = LOREM_SENTENCES[(p * 3 + 1) % LOREM_SENTENCES.length];
      const s3 = LOREM_SENTENCES[(p * 3 + 2) % LOREM_SENTENCES.length];
      paras.push(`${s1} ${s2} ${s3}`);
    }
    return paras.join('\n\n');
  }, [count, unit]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="number"
          min="1"
          max="100"
          label="Quantity"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
        <Select
          label="Generate Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value as typeof unit)}
          options={[
            { value: 'paragraphs', label: 'Paragraphs' },
            { value: 'sentences', label: 'Sentences' },
            { value: 'words', label: 'Words' },
          ]}
        />
      </div>

      <Textarea label="Generated Placeholder Text" rows={8} value={output} readOnly />

      <div className="flex justify-end">
        <CopyButton text={output} label="Copy Lorem Ipsum" size="sm" />
      </div>
    </div>
  );
};

// 9. Text Sorter
export const TextSorter: React.FC = () => {
  const [text, setText] = useState('Delta\nAlpha\nCharlie\nBravo\nEcho');
  const [sortMode, setSortMode] = useState<'az' | 'za' | 'short' | 'long' | 'numeric'>('az');

  const sorted = useMemo(() => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const copy = [...lines];
    if (sortMode === 'az') copy.sort((a, b) => a.localeCompare(b));
    else if (sortMode === 'za') copy.sort((a, b) => b.localeCompare(a));
    else if (sortMode === 'short') copy.sort((a, b) => a.length - b.length);
    else if (sortMode === 'long') copy.sort((a, b) => b.length - a.length);
    else if (sortMode === 'numeric')
      copy.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
    return copy.join('\n');
  }, [text, sortMode]);

  return (
    <div className="space-y-5">
      <Select
        label="Sorting Order"
        value={sortMode}
        onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
        options={[
          { value: 'az', label: 'Alphabetical (A → Z)' },
          { value: 'za', label: 'Reverse Alphabetical (Z → A)' },
          { value: 'short', label: 'Line Length (Shortest → Longest)' },
          { value: 'long', label: 'Line Length (Longest → Shortest)' },
          { value: 'numeric', label: 'Numerical Value (Ascending)' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Unsorted Lines"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Textarea label="Sorted Output" rows={7} value={sorted} readOnly />
      </div>

      <div className="flex justify-between">
        <ResetButton onReset={() => setText('')} size="sm" />
        <CopyButton text={sorted} label="Copy Sorted Lines" size="sm" />
      </div>
    </div>
  );
};
