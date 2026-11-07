import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatNumber } from '../../lib/querySync';

function parseDateUtc(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return dt;
}

export const DateDifferenceCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState(() => getQueryParam('start', '2025-01-01'));
  const [endDate, setEndDate] = useState(() => getQueryParam('end', '2025-12-31'));
  const [includeEnd, setIncludeEnd] = useState(() => getQueryParam('inc', 'false') === 'true');

  useEffect(() => {
    syncQueryParams({ start: startDate, end: endDate, inc: includeEnd });
  }, [startDate, endDate, includeEnd]);

  const calc = useMemo(() => {
    const dt1 = parseDateUtc(startDate);
    const dt2 = parseDateUtc(endDate);
    if (!dt1 || !dt2) {
      return { error: 'Please select valid Start and End calendar dates.' };
    }

    const isReversed = dt1.getTime() > dt2.getTime();
    const first = isReversed ? dt2 : dt1;
    const second = isReversed ? dt1 : dt2;

    const effectiveSecond = includeEnd
      ? new Date(second.getTime() + 24 * 60 * 60 * 1000)
      : second;

    let years = effectiveSecond.getUTCFullYear() - first.getUTCFullYear();
    let months = effectiveSecond.getUTCMonth() - first.getUTCMonth();
    let days = effectiveSecond.getUTCDate() - first.getUTCDate();

    if (days < 0) {
      const prevMonthLastDay = new Date(
        Date.UTC(effectiveSecond.getUTCFullYear(), effectiveSecond.getUTCMonth(), 0)
      ).getUTCDate();
      days += prevMonthLastDay;
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const totalDays = Math.round(
      (effectiveSecond.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weeks = Math.floor(totalDays / 7);
    const remainderDays = totalDays % 7;

    // Count weekdays vs weekend days accurately using O(1) modular arithmetic
    const fullWeeks = Math.floor(totalDays / 7);
    let weekdays = fullWeeks * 5;
    let weekendDays = fullWeeks * 2;
    const startDow = first.getUTCDay();

    for (let i = 0; i < remainderDays; i++) {
      const dow = (startDow + i) % 7;
      if (dow === 0 || dow === 6) {
        weekendDays += 1;
      } else {
        weekdays += 1;
      }
    }

    return {
      error: null,
      isReversed,
      years,
      months,
      days,
      totalDays,
      weeks,
      remainderDays,
      weekdays,
      weekendDays,
      totalHours: totalDays * 24,
    };
  }, [startDate, endDate, includeEnd]);

  const handleReset = () => {
    setStartDate('2025-01-01');
    setEndDate('2025-12-31');
    setIncludeEnd(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeEnd}
            onChange={(e) => setIncludeEnd(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span>Include End Date (+1 calendar day)</span>
        </label>

        <div className="flex items-center gap-2">
          <ResetButton onReset={handleReset} size="sm" />
          {!calc.error && (
            <CopyButton
              text={`Duration: ${calc.years} years, ${calc.months} months, ${calc.days} days (${formatNumber(calc.totalDays ?? 0)} total calendar days, ${formatNumber(calc.weekdays ?? 0)} weekdays)`}
              label="Copy Duration"
              size="sm"
            />
          )}
        </div>
      </div>

      {calc.error ? (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300"
        >
          {calc.error}
        </div>
      ) : (
        <div className="space-y-4">
          <ResultBox
            highlight
            label="Calendar Span Breakdown"
            value={`${calc.years} Years, ${calc.months} Months, ${calc.days} Days`}
            sublabel={
              calc.isReversed
                ? 'Note: End Date precedes Start Date (absolute duration shown)'
                : includeEnd
                ? 'Inclusive of both start and end dates'
                : 'Exclusive end-date elapsed span'
            }
            copyText={`${calc.years} years, ${calc.months} months, ${calc.days} days`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultBox
              highlight
              label="Total Calendar Days"
              value={`${formatNumber(calc.totalDays ?? 0)} days`}
              sublabel={`${formatNumber(calc.totalHours ?? 0)} total hours`}
              copyText={String(calc.totalDays)}
            />
            <ResultBox
              label="Weeks & Remainder Days"
              value={`${formatNumber(calc.weeks ?? 0)} wks, ${calc.remainderDays} d`}
              sublabel="7-day week intervals"
              copyText={`${calc.weeks} weeks, ${calc.remainderDays} days`}
            />
            <ResultBox
              label="Business Weekdays (Mon–Fri)"
              value={`${formatNumber(calc.weekdays ?? 0)} days`}
              sublabel="Excluding Saturdays & Sundays"
              copyText={String(calc.weekdays)}
            />
            <ResultBox
              label="Weekend Days (Sat–Sun)"
              value={`${formatNumber(calc.weekendDays ?? 0)} days`}
              sublabel="Saturdays & Sundays in span"
              copyText={String(calc.weekendDays)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateDifferenceCalculator;
