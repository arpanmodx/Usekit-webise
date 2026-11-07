import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency, formatNumber } from '../../lib/querySync';

interface YearRow {
  year: number;
  totalContributions: number;
  yearlyInterest: number;
  totalInterest: number;
  endingBalance: number;
}

export const CompoundInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(() => getQueryParam('p', '10000'));
  const [monthlyContribution, setMonthlyContribution] = useState(() => getQueryParam('pmt', '200'));
  const [rate, setRate] = useState(() => getQueryParam('r', '8'));
  const [years, setYears] = useState(() => getQueryParam('t', '10'));
  const [frequency, setFrequency] = useState(() => getQueryParam('n', '12'));

  useEffect(() => {
    syncQueryParams({
      p: principal,
      pmt: monthlyContribution,
      r: rate,
      t: years,
      n: frequency,
    });
  }, [principal, monthlyContribution, rate, years, frequency]);

  const calc = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const annualRate = parseFloat(rate);
    const totalYears = parseInt(years, 10);
    const n = parseInt(frequency, 10) || 12;

    if (P < 0 || PMT < 0) {
      return { error: 'Initial principal and monthly contribution cannot be negative.' };
    }
    if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) {
      return { error: 'Please enter a valid annual interest rate between 0% and 100%.' };
    }
    if (!Number.isFinite(totalYears) || totalYears < 1 || totalYears > 60) {
      return { error: 'Please enter a time horizon between 1 and 60 years.' };
    }

    const r = annualRate / 100;
    const apy = (Math.pow(1 + r / n, n) - 1) * 100;

    // Effective monthly growth rate corresponding to compounding frequency n
    const effectiveMonthlyRate = Math.pow(1 + r / n, n / 12) - 1;

    let balance = P;
    let cumulativeContributions = P;
    let cumulativeInterest = 0;
    const schedule: YearRow[] = [];

    for (let y = 1; y <= totalYears; y++) {
      let yearInterest = 0;
      for (let m = 1; m <= 12; m++) {
        const interestForMonth = balance * effectiveMonthlyRate;
        yearInterest += interestForMonth;
        balance += interestForMonth + PMT;
        cumulativeContributions += PMT;
      }
      cumulativeInterest += yearInterest;
      schedule.push({
        year: y,
        totalContributions: cumulativeContributions,
        yearlyInterest: yearInterest,
        totalInterest: cumulativeInterest,
        endingBalance: balance,
      });
    }

    const simpleInterestComparison = P * r * totalYears;

    return {
      error: null,
      P,
      PMT,
      finalBalance: balance,
      totalContributions: cumulativeContributions,
      totalInterest: cumulativeInterest,
      apy,
      simpleInterestComparison,
      schedule,
    };
  }, [principal, monthlyContribution, rate, years, frequency]);

  const handleReset = () => {
    setPrincipal('10000');
    setMonthlyContribution('200');
    setRate('8');
    setYears('10');
    setFrequency('12');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          type="number"
          min="0"
          step="500"
          label="Initial Deposit"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="50"
          label="Monthly Contribution"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          label="Annual Rate (%)"
          suffixAddon="%"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <Input
          type="number"
          min="1"
          max="60"
          step="1"
          label="Years to Grow"
          suffixAddon="yrs"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <Select
          label="Compounding"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          options={[
            { value: '365', label: 'Daily (365/yr)' },
            { value: '12', label: 'Monthly (12/yr)' },
            { value: '4', label: 'Quarterly (4/yr)' },
            { value: '2', label: 'Semi-Annually (2/yr)' },
            { value: '1', label: 'Annually (1/yr)' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={handleReset} size="sm" />
        {!calc.error && (
          <CopyButton
            text={`Future Balance: ${formatCurrency(calc.finalBalance ?? 0)} | Total Contributions: ${formatCurrency(calc.totalContributions ?? 0)} | Total Compound Interest: ${formatCurrency(calc.totalInterest ?? 0)}`}
            label="Copy Growth Summary"
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
              label="Future Maturity Value"
              value={formatCurrency(calc.finalBalance ?? 0)}
              sublabel={`After ${years} years of compounding`}
              copyText={formatCurrency(calc.finalBalance ?? 0)}
            />
            <ResultBox
              highlight
              label="Total Compound Interest"
              value={formatCurrency(calc.totalInterest ?? 0)}
              sublabel="Pure investment return"
              copyText={formatCurrency(calc.totalInterest ?? 0)}
            />
            <ResultBox
              label="Total Contributions"
              value={formatCurrency(calc.totalContributions ?? 0)}
              sublabel={`Initial + ${years} yrs of monthly deposits`}
              copyText={formatCurrency(calc.totalContributions ?? 0)}
            />
            <ResultBox
              label="Effective Annual Yield (APY)"
              value={`${formatNumber(calc.apy ?? 0, 3)}%`}
              sublabel="True annualized compound yield"
              copyText={`${formatNumber(calc.apy ?? 0, 3)}%`}
            />
          </div>

          {/* Year-by-Year Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-96">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Year</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total Principal</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Year Interest</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Cumulative Interest</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {calc.schedule?.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="py-2 px-4 font-sans font-medium">Year {row.year}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(row.totalContributions)}</td>
                    <td className="py-2 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(row.yearlyInterest)}
                    </td>
                    <td className="py-2 px-4 text-right text-blue-600 dark:text-blue-400">
                      {formatCurrency(row.totalInterest)}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold">
                      {formatCurrency(row.endingBalance)}
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

export default CompoundInterestCalculator;
