import React, { useState, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { ResetButton } from '../ui/ResetButton';
import { ResultBox } from '../ui/ResultBox';

// 1. Random Number Generator
export const RandomNumberGenerator: React.FC = () => {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('5');
  const [unique, setUnique] = useState(true);
  const [results, setResults] = useState<number[]>([42, 17, 89, 3, 64]);

  const generate = () => {
    const low = Math.ceil(Number(min) || 0);
    const high = Math.floor(Number(max) || 100);
    const qty = Math.min(200, Math.max(1, Number(count) || 1));
    if (low > high) return;

    const poolSize = high - low + 1;
    const nums: number[] = [];
    const used = new Set<number>();

    for (let i = 0; i < qty; i++) {
      if (unique && used.size >= poolSize) break;
      let val: number;
      do {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        val = low + (buf[0] % poolSize);
      } while (unique && used.has(val));
      used.add(val);
      nums.push(val);
    }
    setResults(nums);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Minimum Value" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
        <Input label="Maximum Value" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
        <Input label="Quantity (1–200)" type="number" min="1" max="200" value={count} onChange={(e) => setCount(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="rounded text-blue-600" />
          No duplicate numbers
        </label>
        <Button onClick={generate}>Generate Numbers</Button>
        <CopyButton text={results.join(', ')} label="Copy Results" />
      </div>
      <div className="flex flex-wrap gap-2.5 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {results.map((n, idx) => (
          <span key={idx} className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-lg font-bold text-blue-600 dark:text-blue-400 shadow-xs">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
};

// 2. Random Name Picker
export const RandomNamePicker: React.FC = () => {
  const [namesText, setNamesText] = useState('Aarav Sharma\nPriya Patel\nRohan Gupta\nAnanya Roy\nVikram Singh\nNeha Verma');
  const [pickCount, setPickCount] = useState('1');
  const [winners, setWinners] = useState<string[]>(['Priya Patel']);

  const allNames = useMemo(
    () =>
      namesText
        .split('\n')
        .map((n) => n.trim())
        .filter(Boolean),
    [namesText]
  );

  const pickWinners = () => {
    if (allNames.length === 0) return;
    const shuffled = [...allNames];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      const j = buf[0] % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const qty = Math.min(shuffled.length, Math.max(1, Number(pickCount) || 1));
    setWinners(shuffled.slice(0, qty));
  };

  return (
    <div className="space-y-6">
      <Textarea
        label={`Participant Names (${allNames.length} entries, one per line)`}
        value={namesText}
        onChange={(e) => setNamesText(e.target.value)}
        rows={6}
      />
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-40">
          <Input label="Number of Winners" type="number" min="1" max={allNames.length || 1} value={pickCount} onChange={(e) => setPickCount(e.target.value)} />
        </div>
        <Button onClick={pickWinners}>Pick Random Winner(s)</Button>
        {winners.length > 0 && <CopyButton text={winners.join(', ')} label="Copy Winner(s)" />}
      </div>
      {winners.length > 0 && (
        <ResultBox
          label="Selected Winner(s)"
          value={winners.join(' • ')}
          sublabel={`Picked fairly from ${allNames.length} total entries using Web Crypto RNG`}
          highlight
        />
      )}
    </div>
  );
};

// 3. Coin Flip
export const CoinFlip: React.FC = () => {
  const [side, setSide] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [headsCount, setHeadsCount] = useState(1);
  const [tailsCount, setTailsCount] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      const isHeads = buf[0] % 2 === 0;
      setSide(isHeads ? 'HEADS' : 'TAILS');
      if (isHeads) setHeadsCount((c) => c + 1);
      else setTailsCount((c) => c + 1);
      setFlipping(false);
    }, 180);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="py-8 flex flex-col items-center justify-center">
        <div
          className={`w-36 h-36 rounded-full border-4 flex items-center justify-center text-2xl font-extrabold tracking-wider transition-transform duration-200 ${
            flipping ? 'scale-90 opacity-60' : 'scale-100'
          } ${
            side === 'HEADS'
              ? 'bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-950/60 dark:border-amber-500 dark:text-amber-300'
              : 'bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-950/60 dark:border-blue-500 dark:text-blue-300'
          }`}
        >
          {side}
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={flip} size="lg">Flip Coin</Button>
        <ResetButton
          onReset={() => {
            setHeadsCount(0);
            setTailsCount(0);
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <ResultBox label="Heads Count" value={headsCount} />
        <ResultBox label="Tails Count" value={tailsCount} />
      </div>
    </div>
  );
};

// 4. Dice Roller
export const DiceRoller: React.FC = () => {
  const [diceCount, setDiceCount] = useState('2');
  const [sides, setSides] = useState('6');
  const [rolls, setRolls] = useState<number[]>([4, 6]);

  const rollDice = () => {
    const qty = Math.min(20, Math.max(1, Number(diceCount) || 1));
    const maxSides = Math.max(2, Number(sides) || 6);
    const out: number[] = [];
    for (let i = 0; i < qty; i++) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      out.push(1 + (buf[0] % maxSides));
    }
    setRolls(out);
  };

  const total = rolls.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Number of Dice (1–20)" type="number" min="1" max="20" value={diceCount} onChange={(e) => setDiceCount(e.target.value)} />
        <Select
          label="Dice Type (Sides)"
          value={sides}
          onChange={(e) => setSides(e.target.value)}
          options={[
            { value: '4', label: 'D4 (4-sided)' },
            { value: '6', label: 'D6 (Standard 6-sided)' },
            { value: '8', label: 'D8 (8-sided)' },
            { value: '10', label: 'D10 (10-sided)' },
            { value: '12', label: 'D12 (12-sided)' },
            { value: '20', label: 'D20 (20-sided)' },
          ]}
        />
      </div>
      <Button onClick={rollDice} size="lg">Roll Dice</Button>
      <div className="flex flex-wrap gap-3 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {rolls.map((r, i) => (
          <div key={i} className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center font-mono text-xl font-extrabold text-slate-900 dark:text-white shadow-xs">
            {r}
          </div>
        ))}
      </div>
      <ResultBox label="Sum of All Dice" value={total} sublabel={`Average per die: ${(total / rolls.length).toFixed(2)}`} highlight />
    </div>
  );
};

// 5. Text to Binary
export const TextToBinary: React.FC = () => {
  const [text, setText] = useState('UseKit');

  const binary = useMemo(() => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    return Array.from(bytes)
      .map((b) => b.toString(2).padStart(8, '0'))
      .join(' ');
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea label="Enter Plain Text (UTF-8)" value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">8-Bit Binary Output</span>
          <CopyButton text={binary} />
        </div>
        <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs break-words">{binary || '—'}</div>
      </div>
    </div>
  );
};

// 6. Binary to Text
export const BinaryToText: React.FC = () => {
  const [binary, setBinary] = useState('01010101 01110011 01100101 01001011 01101001 01110100');

  const decoded = useMemo(() => {
    const cleaned = binary.trim();
    if (!cleaned) return '';
    try {
      const tokens = cleaned.split(/\s+/);
      const bytes = new Uint8Array(
        tokens.map((t) => {
          if (!/^[01]+$/.test(t)) throw new Error('Invalid binary token');
          return parseInt(t, 2);
        })
      );
      return new TextDecoder().decode(bytes);
    } catch {
      return 'Invalid binary sequence — enter space-separated 8-bit binary bytes (0 and 1 only).';
    }
  }, [binary]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Space-Separated Binary Bytes"
        value={binary}
        onChange={(e) => setBinary(e.target.value)}
        rows={4}
        className="font-mono text-xs"
      />
      <ResultBox label="Decoded UTF-8 Text" value={decoded || '—'} highlight />
      <CopyButton text={decoded} label="Copy Decoded Text" />
    </div>
  );
};

// 7. Number to Words (International English, Indian English Lakh/Crore, Bengali, and Hindi)
const EN_ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const EN_TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitEn(n: number): string {
  if (n < 20) return EN_ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${EN_TENS[t]}${o ? '-' + EN_ONES[o] : ''}`;
}

function threeDigitEn(n: number): string {
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const parts: string[] = [];
  if (h > 0) parts.push(`${EN_ONES[h]} Hundred`);
  if (rem > 0) parts.push(twoDigitEn(rem));
  return parts.join(' ');
}

function toInternationalEnglish(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + toInternationalEnglish(Math.abs(num));
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  let n = Math.floor(num);
  const parts: string[] = [];
  let scaleIdx = 0;
  while (n > 0 && scaleIdx < scales.length) {
    const chunk = n % 1000;
    if (chunk > 0) {
      const chunkWords = threeDigitEn(chunk);
      parts.unshift(scales[scaleIdx] ? `${chunkWords} ${scales[scaleIdx]}` : chunkWords);
    }
    n = Math.floor(n / 1000);
    scaleIdx++;
  }
  return parts.join(', ');
}

function toIndianEnglish(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + toIndianEnglish(Math.abs(num));
  let n = Math.floor(num);
  const parts: string[] = [];
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const hundred = Math.floor(n / 100);
  const rem = n % 100;

  if (crore > 0) parts.push(`${toIndianEnglish(crore)} Crore`);
  if (lakh > 0) parts.push(`${twoDigitEn(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${twoDigitEn(thousand)} Thousand`);
  if (hundred > 0) parts.push(`${EN_ONES[hundred]} Hundred`);
  if (rem > 0) parts.push(twoDigitEn(rem));
  return parts.join(' ');
}

const BN_WORDS: Record<number, string> = {
  0: 'শূন্য', 1: 'এক', 2: 'দুই', 3: 'তিন', 4: 'চার', 5: 'পাঁচ', 6: 'ছয়', 7: 'সাত', 8: 'আট', 9: 'নয়', 10: 'দশ',
  11: 'এগারো', 12: 'বারো', 13: 'তেরো', 14: 'চৌদ্দ', 15: 'পনেরো', 16: 'ষোলো', 17: 'সতেরো', 18: 'আঠারো', 19: 'উনিশ', 20: 'বিশ',
  21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ', 26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আঠাশ', 29: 'ঊনত্রিশ', 30: 'ত্রিশ',
  40: 'চল্লিশ', 50: 'পঞ্চাশ', 60: 'ষাট', 70: 'সত্তর', 80: 'আশি', 90: 'নব্বই',
};

function twoDigitBn(n: number): string {
  if (BN_WORDS[n]) return BN_WORDS[n];
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  return `${BN_WORDS[tens] || ''} ${BN_WORDS[ones] || ''}`.trim();
}

function toBengaliWords(num: number): string {
  if (num === 0) return BN_WORDS[0];
  if (num < 0) return 'ঋণাত্মক ' + toBengaliWords(Math.abs(num));
  let n = Math.floor(num);
  const parts: string[] = [];
  const koti = Math.floor(n / 10000000);
  n %= 10000000;
  const lokkho = Math.floor(n / 100000);
  n %= 100000;
  const hajar = Math.floor(n / 1000);
  n %= 1000;
  const shoto = Math.floor(n / 100);
  const rem = n % 100;

  if (koti > 0) parts.push(`${toBengaliWords(koti)} কোটি`);
  if (lokkho > 0) parts.push(`${twoDigitBn(lokkho)} লক্ষ`);
  if (hajar > 0) parts.push(`${twoDigitBn(hajar)} হাজার`);
  if (shoto > 0) parts.push(`${BN_WORDS[shoto]} শত`);
  if (rem > 0) parts.push(twoDigitBn(rem));
  return parts.join(' ');
}

const HI_WORDS: Record<number, string> = {
  0: 'शून्य', 1: 'एक', 2: 'दो', 3: 'तीन', 4: 'चार', 5: 'पाँच', 6: 'छह', 7: 'सात', 8: 'आठ', 9: 'नौ', 10: 'दस',
  11: 'ग्यारह', 12: 'बारह', 13: 'तेरह', 14: 'चौदह', 15: 'पंद्रह', 16: 'सोलह', 17: 'सत्रह', 18: 'अठारह', 19: 'उन्नीस', 20: 'बीस',
  30: 'तीस', 40: 'चालीस', 50: 'पचास', 60: 'साठ', 70: 'सत्तर', 80: 'अस्सी', 90: 'नब्बे',
};

function twoDigitHi(n: number): string {
  if (HI_WORDS[n]) return HI_WORDS[n];
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  return `${HI_WORDS[ones] || ''} ${HI_WORDS[tens] || ''}`.trim();
}

function toHindiWords(num: number): string {
  if (num === 0) return HI_WORDS[0];
  if (num < 0) return 'ऋण ' + toHindiWords(Math.abs(num));
  let n = Math.floor(num);
  const parts: string[] = [];
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const hajar = Math.floor(n / 1000);
  n %= 1000;
  const sau = Math.floor(n / 100);
  const rem = n % 100;

  if (crore > 0) parts.push(`${toHindiWords(crore)} करोड़`);
  if (lakh > 0) parts.push(`${twoDigitHi(lakh)} लाख`);
  if (hajar > 0) parts.push(`${twoDigitHi(hajar)} हज़ार`);
  if (sau > 0) parts.push(`${HI_WORDS[sau]} सौ`);
  if (rem > 0) parts.push(twoDigitHi(rem));
  return parts.join(' ');
}

export const NumberToWords: React.FC = () => {
  const [numberStr, setNumberStr] = useState('1250000');
  const num = Math.min(999999999999, Math.max(0, Math.floor(Number(numberStr) || 0)));

  const intlEn = useMemo(() => toInternationalEnglish(num), [num]);
  const indianEn = useMemo(() => toIndianEnglish(num), [num]);
  const bengali = useMemo(() => toBengaliWords(num), [num]);
  const hindi = useMemo(() => toHindiWords(num), [num]);

  return (
    <div className="space-y-6">
      <Input
        label="Enter Number (0 to 999,999,999,999)"
        type="number"
        min="0"
        value={numberStr}
        onChange={(e) => setNumberStr(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">International English (Million / Billion)</p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{intlEn}</p>
          </div>
          <CopyButton text={intlEn} />
        </div>
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Indian Numbering System (Lakh / Crore)</p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{indianEn}</p>
          </div>
          <CopyButton text={indianEn} />
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Bengali (বাংলা কথায়)</p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{bengali}</p>
          </div>
          <CopyButton text={bengali} />
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Hindi (हिन्दी शब्दों में)</p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{hindi}</p>
          </div>
          <CopyButton text={hindi} />
        </div>
      </div>
    </div>
  );
};
