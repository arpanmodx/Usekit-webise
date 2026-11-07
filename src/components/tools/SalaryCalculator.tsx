import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency } from '../../lib/querySync';

type PayFrequency = 'annual' | 'monthly' | 'semimonthly' | 'biweekly' | 'weekly' | 'daily' | 'hourly';

export const SalaryCalculator: React.FC = () => {
  const [amount, setAmount] = useState(() => getQueryParam('pay', '85000'));
  const [frequency, setFrequency] = useState<PayFrequency>(() => {
    const f = getQueryParam('freq', 'annual') as PayFrequency;
    return ['annual', 'monthly', 'semimonthly', 'biweekly', 'weekly', 'daily', 'hourly'].includes(f)
      ? f
      : 'annual';
  });
  const [hoursPerWeek, setHoursPerWeek] = useState(() => getQueryParam('hrs', '40'));
  const [daysPerWeek, setDaysPerWeek] = useState(() => getQueryParam('days', '5'));
  const [unpaidDaysOff, setUnpaidDaysOff] = useState(() => getQueryParam('pto', '15'));
  const [taxRatePct, setTaxRatePct] = useState(() => getQueryParam('tax', '22'));

  useEffect(() => {
    syncQueryParams({
      pay: amount,
      freq: frequency,
      hrs: hoursPerWeek,
      days: daysPerWeek,
      pto: unpaidDaysOff,
      tax: taxRatePct,
    });
  }, [amount, frequency, hoursPerWeek, daysPerWeek, unpaidDaysOff, taxRatePct]);

  const calc = useMemo(() => {
    const val = parseFloat(amount);
    const hrsWeek = parseFloat(hoursPerWeek);
    const daysWeek = parseFloat(daysPerWeek);
    const daysOff = Math.max(0, parseFloat(unpaidDaysOff) || 0);
    const taxPct = Math.min(100, Math.max(0, parseFloat(taxRatePct) || 0));

    if (!Number.isFinite(val) || val < 0) {
      return { error: 'Please enter a valid non-negative salary or pay rate.' };
    }
    if (!Number.isFinite(hrsWeek) || hrsWeek <= 0 || hrsWeek > 168) {
      return { error: 'Hours per week must be between 1 and 168.' };
    }
    if (!Number.isFinite(daysWeek) || daysWeek <= 0 || daysWeek > 7) {
      return { error: 'Days per week must be between 1 and 7.' };
    }

    const totalWeeksPerYear = 52;
    const totalWorkDaysYear = totalWeeksPerYear * daysWeek;
    const totalHoursYear = totalWeeksPerYear * hrsWeek;
    const hoursPerDay = hrsWeek / daysWeek;

    let unadjustedAnnual = 0;
    switch (frequency) {
      case 'annual':
        unadjustedAnnual = val;
        break;
      case 'monthly':
        unadjustedAnnual = val * 12;
        break;
      case 'semimonthly':
        unadjustedAnnual = val * 24;
        break;
      case 'biweekly':
        unadjustedAnnual = val * 26;
        break;
      case 'weekly':
        unadjustedAnnual = val * 52;
        break;
      case 'daily':
        unadjustedAnnual = val * totalWorkDaysYear;
        break;
      case 'hourly':
        unadjustedAnnual = val * totalHoursYear;
        break;
    }

    const hourlyRate = unadjustedAnnual / totalHoursYear;
    const adjustedWorkDaysYear = Math.max(0, totalWorkDaysYear - daysOff);
    const adjustedAnnual = hourlyRate * hoursPerDay * adjustedWorkDaysYear;
    const netFactor = 1 - taxPct / 100;

    const buildRow = (label: string, divisor: number) => ({
      label,
      unadjustedGross: unadjustedAnnual / divisor,
      adjustedGross: adjustedAnnual / divisor,
      netTakeHome: (adjustedAnnual / divisor) * netFactor,
    });

    const rows = [
      buildRow('Annual (1× / yr)', 1),
      buildRow('Monthly (12× / yr)', 12),
      buildRow('Semi-Monthly (24× / yr)', 24),
      buildRow('Bi-Weekly (26× / yr)', 26),
      buildRow('Weekly (52× / yr)', 52),
      buildRow(`Daily (${totalWorkDaysYear} d/yr)`, totalWorkDaysYear),
      buildRow(`Hourly (${totalHoursYear} hrs/yr)`, totalHoursYear),
    ];

    return {
      error: null,
      unadjustedAnnual,
      adjustedAnnual,
      netAnnual: adjustedAnnual * netFactor,
      netMonthly: (adjustedAnnual * netFactor) / 12,
      hourlyRate,
      rows,
    };
  }, [amount, frequency, hoursPerWeek, daysPerWeek, unpaidDaysOff, taxRatePct]);

  const handleReset = () => {
    setAmount('85000');
    setFrequency('annual');
    setHoursPerWeek('40');
    setDaysPerWeek('5');
    setUnpaidDaysOff('15');
    setTaxRatePct('22');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          type="number"
          min="0"
          step="any"
          label="Gross Pay Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          label="Pay Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as PayFrequency)}
          options={[
            { value: 'annual', label: 'Per Year (Annual)' },
            { value: 'monthly', label: 'Per Month' },
            { value: 'semimonthly', label: 'Semi-Monthly (24×/yr)' },
            { value: 'biweekly', label: 'Bi-Weekly (26×/yr)' },
            { value: 'weekly', label: 'Per Week' },
            { value: 'daily', label: 'Per Day' },
            { value: 'hourly', label: 'Per Hour' },
          ]}
        />
        <Input
          type="number"
          min="1"
          max="168"
          step="1"
          label="Hours Worked per Week"
          suffixAddon="hrs"
          value={hoursPerWeek}
          onChange={(e) => setHoursPerWeek(e.target.value)}
        />
        <Input
          type="number"
          min="1"
          max="7"
          step="0.5"
          label="Days Worked per Week"
          suffixAddon="days"
          value={daysPerWeek}
          onChange={(e) => setDaysPerWeek(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="260"
          step="1"
          label="Unpaid Holidays & Vacation / Yr"
          suffixAddon="days"
          value={unpaidDaysOff}
          onChange={(e) => setUnpaidDaysOff(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.5"
          label="Est. Tax & Deductions (%)"
          suffixAddon="%"
          value={taxRatePct}
          onChange={(e) => setTaxRatePct(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={handleReset} size="sm" />
        {!calc.error && (
          <CopyButton
            text={`Gross Annual: ${formatCurrency(calc.unadjustedAnnual ?? 0)} | Hourly Rate: ${formatCurrency(calc.hourlyRate ?? 0)}/hr | Est. Net Monthly: ${formatCurrency(calc.netMonthly ?? 0)}`}
            label="Copy Salary Summary"
            size="sm"
          />
        )}
      </div>

      {calc.error ? (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300"
        >
          {calc.error}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultBox
              highlight
              label="Unadjusted Gross Annual"
              value={formatCurrency(calc.unadjustedAnnual ?? 0)}
              sublabel="Full 52-week baseline"
              copyText={formatCurrency(calc.unadjustedAnnual ?? 0)}
            />
            <ResultBox
              highlight
              label="Equivalent Hourly Wage"
              value={`${formatCurrency(calc.hourlyRate ?? 0)} / hr`}
              sublabel={`Based on ${hoursPerWeek} hrs/week`}
              copyText={formatCurrency(calc.hourlyRate ?? 0)}
            />
            <ResultBox
              label="Holiday-Adjusted Gross Annual"
              value={formatCurrency(calc.adjustedAnnual ?? 0)}
              sublabel={`After ${unpaidDaysOff} unpaid days off`}
              copyText={formatCurrency(calc.adjustedAnnual ?? 0)}
            />
            <ResultBox
              label="Estimated Net Monthly Take-Home"
              value={formatCurrency(calc.netMonthly ?? 0)}
              sublabel={`After ${taxRatePct}% effective deductions`}
              copyText={formatCurrency(calc.netMonthly ?? 0)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Pay Period</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Unadjusted Gross</th>
                  <th className="py-2.5 px-4 font-semibold text-right">PTO-Adjusted Gross</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Est. Net Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {calc.rows?.map((r) => (
                  <tr key={r.label} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-sans font-medium">{r.label}</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(r.unadjustedGross)}</td>
                    <td className="py-2.5 px-4 text-right text-blue-600 dark:text-blue-400">
                      {formatCurrency(r.adjustedGross)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(r.netTakeHome)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryCalculator;
