import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { getQueryParam, syncQueryParams, formatNumber } from '../../lib/querySync';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [m1Pct, setM1Pct] = useState(() => getQueryParam('p1', '18'));
  const [m1Base, setM1Base] = useState(() => getQueryParam('b1', '250'));

  // Mode 2: X is what % of Y?
  const [m2Part, setM2Part] = useState(() => getQueryParam('x2', '45'));
  const [m2Whole, setM2Whole] = useState(() => getQueryParam('y2', '180'));

  // Mode 3: Percentage change from X to Y
  const [m3Old, setM3Old] = useState(() => getQueryParam('old', '120'));
  const [m3New, setM3New] = useState(() => getQueryParam('new', '150'));

  // Mode 4: Increase/Decrease X by Y%
  const [m4Val, setM4Val] = useState(() => getQueryParam('v4', '500'));
  const [m4Pct, setM4Pct] = useState(() => getQueryParam('p4', '15'));

  useEffect(() => {
    syncQueryParams({ p1: m1Pct, b1: m1Base, x2: m2Part, y2: m2Whole, old: m3Old, new: m3New });
  }, [m1Pct, m1Base, m2Part, m2Whole, m3Old, m3New]);

  const v1Pct = parseFloat(m1Pct);
  const v1Base = parseFloat(m1Base);
  const res1 = Number.isFinite(v1Pct) && Number.isFinite(v1Base) ? (v1Pct / 100) * v1Base : null;

  const v2Part = parseFloat(m2Part);
  const v2Whole = parseFloat(m2Whole);
  const res2 =
    Number.isFinite(v2Part) && Number.isFinite(v2Whole) && v2Whole !== 0
      ? (v2Part / v2Whole) * 100
      : null;

  const v3Old = parseFloat(m3Old);
  const v3New = parseFloat(m3New);
  const res3Change =
    Number.isFinite(v3Old) && Number.isFinite(v3New) && v3Old !== 0
      ? ((v3New - v3Old) / Math.abs(v3Old)) * 100
      : null;
  const res3Diff = Number.isFinite(v3Old) && Number.isFinite(v3New) ? v3New - v3Old : null;

  const v4Val = parseFloat(m4Val);
  const v4Pct = parseFloat(m4Pct);
  const res4Inc =
    Number.isFinite(v4Val) && Number.isFinite(v4Pct) ? v4Val * (1 + v4Pct / 100) : null;
  const res4Dec =
    Number.isFinite(v4Val) && Number.isFinite(v4Pct) ? v4Val * (1 - v4Pct / 100) : null;

  const handleReset = () => {
    setM1Pct('18');
    setM1Base('250');
    setM2Part('45');
    setM2Whole('180');
    setM3Old('120');
    setM3New('150');
    setM4Val('500');
    setM4Pct('15');
  };

  return (
    <div className="space-y-8">
      {/* Card 1: What is X% of Y? */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          1. Find Percentage of a Number (What is X% of Y?)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            type="number"
            step="any"
            label="Percentage (X)"
            suffixAddon="%"
            value={m1Pct}
            onChange={(e) => setM1Pct(e.target.value)}
          />
          <Input
            type="number"
            step="any"
            label="Base Value (Y)"
            value={m1Base}
            onChange={(e) => setM1Base(e.target.value)}
          />
          <ResultBox
            highlight
            label={`${m1Pct || 0}% of ${m1Base || 0}`}
            value={res1 !== null ? formatNumber(res1, 4) : '—'}
            sublabel={res1 !== null ? `Formula: (${m1Pct} ÷ 100) × ${m1Base}` : 'Enter valid numbers'}
            copyText={res1 !== null ? formatNumber(res1, 4) : undefined}
          />
        </div>
      </div>

      {/* Card 2: X is what % of Y? */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          2. Find What Percent One Number Is of Another (X is what % of Y?)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            type="number"
            step="any"
            label="Part Value (X)"
            value={m2Part}
            onChange={(e) => setM2Part(e.target.value)}
          />
          <Input
            type="number"
            step="any"
            label="Total Value (Y)"
            value={m2Whole}
            onChange={(e) => setM2Whole(e.target.value)}
          />
          <ResultBox
            highlight
            label="Percentage Result"
            value={res2 !== null ? `${formatNumber(res2, 3)}%` : '—'}
            sublabel={
              v2Whole === 0
                ? 'Total value (Y) cannot be zero'
                : res2 !== null
                ? `Formula: (${m2Part} ÷ ${m2Whole}) × 100`
                : 'Enter valid numbers'
            }
            copyText={res2 !== null ? `${formatNumber(res2, 3)}%` : undefined}
          />
        </div>
      </div>

      {/* Card 3: Percentage Increase / Decrease */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          3. Percentage Change (Increase or Decrease from X to Y)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            type="number"
            step="any"
            label="Starting Value (X)"
            value={m3Old}
            onChange={(e) => setM3Old(e.target.value)}
          />
          <Input
            type="number"
            step="any"
            label="Final Value (Y)"
            value={m3New}
            onChange={(e) => setM3New(e.target.value)}
          />
          <ResultBox
            highlight
            label="Percentage Change"
            value={
              res3Change !== null
                ? `${res3Change >= 0 ? '+' : ''}${formatNumber(res3Change, 3)}%`
                : '—'
            }
            sublabel={
              res3Change !== null && res3Diff !== null
                ? `${res3Change >= 0 ? 'Increase' : 'Decrease'} of ${formatNumber(Math.abs(res3Diff), 4)}`
                : 'Starting value cannot be zero'
            }
            copyText={res3Change !== null ? `${formatNumber(res3Change, 3)}%` : undefined}
          />
        </div>
      </div>

      {/* Card 4: Add or Subtract X% */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          4. Add or Subtract a Percentage (Markup / Markdown)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="number"
            step="any"
            label="Initial Number"
            value={m4Val}
            onChange={(e) => setM4Val(e.target.value)}
          />
          <Input
            type="number"
            step="any"
            label="Percentage to Add / Subtract"
            suffixAddon="%"
            value={m4Pct}
            onChange={(e) => setM4Pct(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResultBox
            label={`After Adding +${m4Pct || 0}%`}
            value={res4Inc !== null ? formatNumber(res4Inc, 4) : '—'}
            sublabel="Base × (1 + P/100)"
            copyText={res4Inc !== null ? formatNumber(res4Inc, 4) : undefined}
          />
          <ResultBox
            label={`After Subtracting −${m4Pct || 0}%`}
            value={res4Dec !== null ? formatNumber(res4Dec, 4) : '—'}
            sublabel="Base × (1 − P/100)"
            copyText={res4Dec !== null ? formatNumber(res4Dec, 4) : undefined}
          />
        </div>
      </div>

      <div className="flex justify-start">
        <ResetButton onReset={handleReset} />
      </div>
    </div>
  );
};

export default PercentageCalculator;
