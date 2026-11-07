import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { DownloadButton } from '../ui/DownloadButton';
import { getQueryParam, syncQueryParams, formatCurrency, formatNumber } from '../../lib/querySync';

interface YearlyRow {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  closingBalance: number;
}

export const EmiCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(() => getQueryParam('p', '50000'));
  const [rate, setRate] = useState(() => getQueryParam('r', '8.5'));
  const [tenure, setTenure] = useState(() => getQueryParam('t', '5'));
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>(() =>
    getQueryParam('unit', 'years') === 'months' ? 'months' : 'years'
  );
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    syncQueryParams({ p: principal, r: rate, t: tenure, unit: tenureUnit });
  }, [principal, rate, tenure, tenureUnit]);

  const calc = useMemo(() => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const rawTenure = parseFloat(tenure);

    if (!Number.isFinite(P) || P <= 0) {
      return { error: 'Please enter a valid positive loan principal amount.' };
    }
    if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) {
      return { error: 'Please enter a valid annual interest rate between 0% and 100%.' };
    }
    if (!Number.isFinite(rawTenure) || rawTenure <= 0) {
      return { error: 'Please enter a valid loan tenure greater than zero.' };
    }

    const totalMonths = Math.min(
      600,
      Math.max(1, Math.round(tenureUnit === 'years' ? rawTenure * 12 : rawTenure))
    );
    const monthlyRate = annualRate / 12 / 100;

    let emi = 0;
    if (monthlyRate === 0) {
      emi = P / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      emi = (P * monthlyRate * factor) / (factor - 1);
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = Math.max(0, totalPayment - P);
    const principalSharePct = totalPayment > 0 ? (P / totalPayment) * 100 : 100;
    const interestSharePct = 100 - principalSharePct;

    // Build yearly amortization schedule
    const yearlySchedule: YearlyRow[] = [];
    let balance = P;
    let currentYear = 1;
    let yearOpening = balance;
    let yearPrincipal = 0;
    let yearInterest = 0;

    const csvLines = ['Month,Opening Balance,EMI,Principal Paid,Interest Paid,Closing Balance'];

    for (let m = 1; m <= totalMonths; m++) {
      const monthOpen = balance;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(balance, emi - interestForMonth);
      balance = Math.max(0, balance - principalForMonth);

      csvLines.push(
        `${m},${monthOpen.toFixed(2)},${emi.toFixed(2)},${principalForMonth.toFixed(2)},${interestForMonth.toFixed(2)},${balance.toFixed(2)}`
      );

      yearPrincipal += principalForMonth;
      yearInterest += interestForMonth;

      if (m % 12 === 0 || m === totalMonths) {
        yearlySchedule.push({
          year: currentYear,
          openingBalance: yearOpening,
          principalPaid: yearPrincipal,
          interestPaid: yearInterest,
          totalPayment: yearPrincipal + yearInterest,
          closingBalance: balance,
        });
        currentYear += 1;
        yearOpening = balance;
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }

    return {
      error: null,
      P,
      emi,
      totalPayment,
      totalInterest,
      totalMonths,
      principalSharePct,
      interestSharePct,
      yearlySchedule,
      csvContent: csvLines.join('\n'),
    };
  }, [principal, rate, tenure, tenureUnit]);

  const handleReset = () => {
    setPrincipal('50000');
    setRate('8.5');
    setTenure('5');
    setTenureUnit('years');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="number"
          min="1"
          step="100"
          label="Loan Principal Amount"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          label="Annual Interest Rate (%)"
          suffixAddon="%"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Loan Tenure
            </label>
            <div className="inline-flex rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setTenureUnit('years')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  tenureUnit === 'years'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Years
              </button>
              <button
                type="button"
                onClick={() => setTenureUnit('months')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  tenureUnit === 'months'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Months
              </button>
            </div>
          </div>
          <Input
            type="number"
            min="1"
            max={tenureUnit === 'years' ? '50' : '600'}
            step="1"
            suffixAddon={tenureUnit === 'years' ? 'yrs' : 'mos'}
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResetButton onReset={handleReset} size="sm" />
        {!calc.error && (
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              text={`Monthly EMI: ${formatCurrency(calc.emi ?? 0)} | Total Interest: ${formatCurrency(calc.totalInterest ?? 0)} | Total Payment: ${formatCurrency(calc.totalPayment ?? 0)}`}
              label="Copy EMI Summary"
              size="sm"
            />
            <DownloadButton
              content={calc.csvContent ?? ''}
              filename="usekit-emi-amortization-schedule.csv"
              mimeType="text/csv;charset=utf-8"
              label="Download CSV Schedule"
              size="sm"
            />
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox
              highlight
              label="Equated Monthly Installment (EMI)"
              value={formatCurrency(calc.emi ?? 0)}
              sublabel={`For ${calc.totalMonths} monthly payments`}
              copyText={formatCurrency(calc.emi ?? 0)}
            />
            <ResultBox
              label="Total Interest Payable"
              value={formatCurrency(calc.totalInterest ?? 0)}
              sublabel={`${formatNumber(calc.interestSharePct ?? 0, 1)}% of total repayment`}
              copyText={formatCurrency(calc.totalInterest ?? 0)}
            />
            <ResultBox
              label="Total Repayment (Principal + Interest)"
              value={formatCurrency(calc.totalPayment ?? 0)}
              sublabel={`Principal: ${formatNumber(calc.principalSharePct ?? 0, 1)}%`}
              copyText={formatCurrency(calc.totalPayment ?? 0)}
            />
          </div>

          {/* Visual Principal vs Interest Bar */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
              <span>Principal ({formatNumber(calc.principalSharePct ?? 0, 1)}%)</span>
              <span>Interest ({formatNumber(calc.interestSharePct ?? 0, 1)}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
              <div
                style={{ width: `${calc.principalSharePct}%` }}
                className="bg-blue-600 h-full"
                title="Principal Share"
              />
              <div
                style={{ width: `${calc.interestSharePct}%` }}
                className="bg-amber-500 h-full"
                title="Interest Share"
              />
            </div>
          </div>

          {/* Yearly Amortization Table Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowSchedule((prev) => !prev)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {showSchedule
                ? 'Hide Yearly Amortization Schedule'
                : `View Yearly Amortization Schedule (${calc.yearlySchedule?.length ?? 0} Years)`}
            </button>

            {showSchedule && calc.yearlySchedule && (
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Year</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Opening Balance</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Principal Paid</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Interest Paid</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {calc.yearlySchedule.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                        <td className="py-2 px-4 font-sans font-medium">Year {row.year}</td>
                        <td className="py-2 px-4 text-right">{formatCurrency(row.openingBalance)}</td>
                        <td className="py-2 px-4 text-right text-blue-600 dark:text-blue-400">
                          {formatCurrency(row.principalPaid)}
                        </td>
                        <td className="py-2 px-4 text-right text-amber-600 dark:text-amber-400">
                          {formatCurrency(row.interestPaid)}
                        </td>
                        <td className="py-2 px-4 text-right font-semibold">
                          {formatCurrency(row.closingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmiCalculator;
