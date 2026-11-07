import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatNumber } from '../../lib/querySync';

export const TimeCalculator: React.FC = () => {
  const [operation, setOperation] = useState<'add' | 'subtract'>(() =>
    getQueryParam('op', 'add') === 'subtract' ? 'subtract' : 'add'
  );
  const [d1Days, setD1Days] = useState(() => getQueryParam('d1', '1'));
  const [d1Hours, setD1Hours] = useState(() => getQueryParam('h1', '8'));
  const [d1Minutes, setD1Minutes] = useState(() => getQueryParam('m1', '45'));
  const [d1Seconds, setD1Seconds] = useState(() => getQueryParam('s1', '30'));

  const [d2Days, setD2Days] = useState(() => getQueryParam('d2', '0'));
  const [d2Hours, setD2Hours] = useState(() => getQueryParam('h2', '5'));
  const [d2Minutes, setD2Minutes] = useState(() => getQueryParam('m2', '35'));
  const [d2Seconds, setD2Seconds] = useState(() => getQueryParam('s2', '45'));

  useEffect(() => {
    syncQueryParams({
      op: operation,
      d1: d1Days,
      h1: d1Hours,
      m1: d1Minutes,
      s1: d1Seconds,
      d2: d2Days,
      h2: d2Hours,
      m2: d2Minutes,
      s2: d2Seconds,
    });
  }, [operation, d1Days, d1Hours, d1Minutes, d1Seconds, d2Days, d2Hours, d2Minutes, d2Seconds]);

  const calc = useMemo(() => {
    const toSec = (d: string, h: string, m: string, s: string) => {
      const dd = parseFloat(d) || 0;
      const hh = parseFloat(h) || 0;
      const mm = parseFloat(m) || 0;
      const ss = parseFloat(s) || 0;
      return dd * 86400 + hh * 3600 + mm * 60 + ss;
    };

    const sec1 = toSec(d1Days, d1Hours, d1Minutes, d1Seconds);
    const sec2 = toSec(d2Days, d2Hours, d2Minutes, d2Seconds);
    const rawDiff = operation === 'add' ? sec1 + sec2 : sec1 - sec2;
    const isNegative = rawDiff < 0;
    const absSeconds = Math.round(Math.abs(rawDiff));

    const days = Math.floor(absSeconds / 86400);
    const remAfterDays = absSeconds % 86400;
    const hours = Math.floor(remAfterDays / 3600);
    const remAfterHours = remAfterDays % 3600;
    const minutes = Math.floor(remAfterHours / 60);
    const seconds = remAfterHours % 60;

    const totalHoursFloor = Math.floor(absSeconds / 3600);
    const decimalHours = (rawDiff / 3600);
    const decimalDays = (rawDiff / 86400);
    const decimalMinutes = (rawDiff / 60);

    const signPrefix = isNegative ? '−' : '';
    const formattedClock = `${signPrefix}${String(totalHoursFloor).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return {
      isNegative,
      signPrefix,
      days,
      hours,
      minutes,
      seconds,
      absSeconds,
      formattedClock,
      decimalHours,
      decimalDays,
      decimalMinutes,
    };
  }, [operation, d1Days, d1Hours, d1Minutes, d1Seconds, d2Days, d2Hours, d2Minutes, d2Seconds]);

  const handleReset = () => {
    setOperation('add');
    setD1Days('1');
    setD1Hours('8');
    setD1Minutes('45');
    setD1Seconds('30');
    setD2Days('0');
    setD2Hours('5');
    setD2Minutes('35');
    setD2Seconds('45');
  };

  return (
    <div className="space-y-6">
      {/* Duration A */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Duration A (Starting Duration)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            type="number"
            step="1"
            label="Days"
            value={d1Days}
            onChange={(e) => setD1Days(e.target.value)}
          />
          <Input
            type="number"
            step="1"
            label="Hours"
            value={d1Hours}
            onChange={(e) => setD1Hours(e.target.value)}
          />
          <Input
            type="number"
            step="1"
            label="Minutes"
            value={d1Minutes}
            onChange={(e) => setD1Minutes(e.target.value)}
          />
          <Input
            type="number"
            step="1"
            label="Seconds"
            value={d1Seconds}
            onChange={(e) => setD1Seconds(e.target.value)}
          />
        </div>
      </div>

      {/* Operation Selector */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setOperation('add')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              operation === 'add'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            + Add Duration
          </button>
          <button
            type="button"
            onClick={() => setOperation('subtract')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              operation === 'subtract'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            − Subtract Duration
          </button>
        </div>
      </div>

      {/* Duration B */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Duration B ({operation === 'add' ? 'Duration to Add' : 'Duration to Subtract'})
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            type="number"
            step="1"
            label="Days"
            value={d2Days}
            onChange={(e) => setD2Days(e.target.value)}
          />
          <Input
            type="number"
            step="1"
            label="Hours"
            value={d2Hours}
            onChange={(e) => setD2Hours(e.target.value)}
          />
          <Input
            type="number"
            step="1"
            label="Minutes"
            value={d2Minutes}
            onChange={(e) => setD2Minutes(e.target.value)}
          />
          <Input
            type="number"
            step="1"
            label="Seconds"
            value={d2Seconds}
            onChange={(e) => setD2Seconds(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={handleReset} size="sm" />
        <CopyButton
          text={`${calc.signPrefix}${calc.days}d ${calc.hours}h ${calc.minutes}m ${calc.seconds}s (${formatNumber(calc.decimalHours, 2)} decimal hrs)`}
          label="Copy Time Result"
          size="sm"
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResultBox
            highlight
            label="Normalized Duration (D / H / M / S)"
            value={`${calc.signPrefix}${calc.days}d ${calc.hours}h ${calc.minutes}m ${calc.seconds}s`}
            sublabel="Base-60 & 24-hour normalized result"
            copyText={`${calc.signPrefix}${calc.days}d ${calc.hours}h ${calc.minutes}m ${calc.seconds}s`}
          />
          <ResultBox
            highlight
            label="Total Hours Clock (HH:MM:SS)"
            value={calc.formattedClock}
            sublabel={`Decimal Payroll Hours: ${formatNumber(calc.decimalHours, 4)} hrs`}
            copyText={calc.formattedClock}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultBox
            label="In Decimal Hours"
            value={`${formatNumber(calc.decimalHours, 4)} hrs`}
            sublabel="Ideal for payroll & timesheets"
            copyText={formatNumber(calc.decimalHours, 4)}
          />
          <ResultBox
            label="In Total Minutes"
            value={`${formatNumber(calc.decimalMinutes, 2)} mins`}
            copyText={formatNumber(calc.decimalMinutes, 2)}
          />
          <ResultBox
            label="In Total Seconds"
            value={`${calc.signPrefix}${formatNumber(calc.absSeconds)} secs`}
            copyText={`${calc.signPrefix}${calc.absSeconds}`}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeCalculator;
