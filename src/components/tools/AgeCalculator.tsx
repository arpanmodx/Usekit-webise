import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { CopyButton } from '../ui/CopyButton';
import { ResetButton } from '../ui/ResetButton';
import { getQueryParam, syncQueryParams, formatNumber } from '../../lib/querySync';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseDateParts(isoDate: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() !== month - 1 ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function getDaysInMonth(year: number, monthOneBased: number): number {
  return new Date(Date.UTC(year, monthOneBased, 0)).getUTCDate();
}

export const AgeCalculator: React.FC = () => {
  const todayIso = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const [dob, setDob] = useState(() => getQueryParam('dob', '1996-05-15'));
  const [targetDate, setTargetDate] = useState(() => getQueryParam('target', todayIso));

  useEffect(() => {
    syncQueryParams({ dob, target: targetDate });
  }, [dob, targetDate]);

  const calculation = useMemo(() => {
    const start = parseDateParts(dob);
    const end = parseDateParts(targetDate);

    if (!start || !end) {
      return { error: 'Please enter valid calendar dates in YYYY-MM-DD format.' };
    }

    const startUtc = Date.UTC(start.year, start.month - 1, start.day);
    const endUtc = Date.UTC(end.year, end.month - 1, end.day);

    if (startUtc > endUtc) {
      return { error: 'Date of Birth must be on or before the target calculation date.' };
    }

    let years = end.year - start.year;
    let months = end.month - start.month;
    let days = end.day - start.day;

    if (days < 0) {
      const prevMonth = end.month === 1 ? 12 : end.month - 1;
      const prevMonthYear = end.month === 1 ? end.year - 1 : end.year;
      days += getDaysInMonth(prevMonthYear, prevMonth);
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const totalDays = Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingWeekDays = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    const birthDayOfWeek = DAYS_OF_WEEK[new Date(startUtc).getUTCDay()];
    const isLeapBirthYear =
      (start.year % 4 === 0 && start.year % 100 !== 0) || start.year % 400 === 0;

    // Next birthday calculation relative to targetDate
    let nextBdayYear = end.year;
    if (
      end.month > start.month ||
      (end.month === start.month && end.day >= start.day)
    ) {
      nextBdayYear = end.year + 1;
    }
    const nextBdayDay =
      start.month === 2 &&
      start.day === 29 &&
      !((nextBdayYear % 4 === 0 && nextBdayYear % 100 !== 0) || nextBdayYear % 400 === 0)
        ? 28
        : start.day;
    const nextBdayUtc = Date.UTC(nextBdayYear, start.month - 1, nextBdayDay);
    const daysUntilNextBirthday = Math.round((nextBdayUtc - endUtc) / (1000 * 60 * 60 * 24));
    const nextBirthdayWeekday = DAYS_OF_WEEK[new Date(nextBdayUtc).getUTCDay()];

    return {
      error: null,
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      remainingWeekDays,
      totalDays,
      totalHours,
      totalMinutes,
      birthDayOfWeek,
      isLeapBirthYear,
      daysUntilNextBirthday,
      nextBirthdayWeekday,
    };
  }, [dob, targetDate]);

  const handleReset = () => {
    setDob('1996-05-15');
    setTargetDate(todayIso);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date of Birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <Input
          type="date"
          label="Calculate Age As Of"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <ResetButton onReset={handleReset} />
        {!calculation.error && (
          <CopyButton
            text={`Exact Age: ${calculation.years} years, ${calculation.months} months, ${calculation.days} days (Total: ${formatNumber(calculation.totalDays ?? 0)} days)`}
            label="Copy Summary"
            size="md"
          />
        )}
      </div>

      {calculation.error ? (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300"
        >
          {calculation.error}
        </div>
      ) : (
        <div className="space-y-4">
          <ResultBox
            highlight
            label="Exact Chronological Age"
            value={`${calculation.years} Years, ${calculation.months} Months, ${calculation.days} Days`}
            sublabel={`Born on a ${calculation.birthDayOfWeek}${calculation.isLeapBirthYear ? ' (Leap Year)' : ''}`}
            copyText={`${calculation.years} years, ${calculation.months} months, ${calculation.days} days`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultBox
              label="Age in Total Months"
              value={`${formatNumber(calculation.totalMonths ?? 0)} months, ${calculation.days} days`}
              copyText={`${calculation.totalMonths} months, ${calculation.days} days`}
            />
            <ResultBox
              label="Age in Total Weeks"
              value={`${formatNumber(calculation.totalWeeks ?? 0)} weeks, ${calculation.remainingWeekDays} days`}
              copyText={`${calculation.totalWeeks} weeks, ${calculation.remainingWeekDays} days`}
            />
            <ResultBox
              label="Age in Total Days"
              value={`${formatNumber(calculation.totalDays ?? 0)} days`}
              copyText={String(calculation.totalDays)}
            />
            <ResultBox
              label="Age in Total Hours"
              value={`${formatNumber(calculation.totalHours ?? 0)} hrs`}
              copyText={String(calculation.totalHours)}
            />
            <ResultBox
              label="Age in Total Minutes"
              value={`${formatNumber(calculation.totalMinutes ?? 0)} mins`}
              copyText={String(calculation.totalMinutes)}
            />
            <ResultBox
              label="Next Birthday Countdown"
              value={`${formatNumber(calculation.daysUntilNextBirthday ?? 0)} days`}
              sublabel={`Falls on a ${calculation.nextBirthdayWeekday}`}
              copyText={`${calculation.daysUntilNextBirthday} days`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
