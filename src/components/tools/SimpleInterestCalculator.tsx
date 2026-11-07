import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency, formatNumber } from '../../lib/querySync';

type TimeUnit = 'years' | 'months' | 'days';

export const SimpleInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(() => getQueryParam('p', '10000'));
  const [rate, setRate] = useState(() => getQueryParam('r', '7.5'));
  const [timeVal, setTimeVal] = useState(() => getQueryParam('t', '3'));
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(() => {
    const u = getQueryParam('unit', 'years');
    return u === 'months' || u === 'days' ? u : 'years';
  });

  useEffect(() => {
    syncQueryParams({ p: principal, r: rate, t: timeVal, unit: timeUnit });
  }, [principal, rate, timeVal, timeUnit]);

  const calc = useMemo(() => {
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const rawT = parseFloat(timeVal);

    if (!Number.isFinite(P) || P < 0) {
      return { error: 'Please enter a valid non-negative principal amount.' };
    }
    if (!Number.isFinite(R) || R < 0) {
      return { error: 'Please enter a valid non-negative annual interest rate.' };
    }
    if (!Number.isFinite(rawT) || rawT <= 0) {
      return { error: 'Please enter a valid time period greater than zero.' };
    }

    const yearsT =
      timeUnit === 'years' ? rawT : timeUnit === 'months' ? rawT / 12 : rawT / 365;

    const simpleInterest = (P * R * yearsT) / 100;
    const totalMaturity = P + simpleInterest;
    const annualInterest = (P * R) / 100;
    const monthlyInterest = annualInterest / 12;
    const dailyInterest = annualInterest / 365;

    return {
      error: null,
      P,
      R,
      yearsT,
      simpleInterest,
      totalMaturity,
      annualInterest,
      monthlyInterest,
      dailyInterest,
    };
  }, [principal, rate, timeVal, timeUnit]);

  const handleReset = () => {
    setPrincipal('10000');
    setRate('7.5');
    setTimeVal('3');
    setTimeUnit('years');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="number"
          min="0"
          step="100"
          label="Principal Amount (P)"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="0.1"
          label="Annual Interest Rate (R)"
          suffixAddon="%"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <Input
          type="number"
          min="0.1"
          step="any"
          label="Time Period (T)"
          value={timeVal}
          onChange={(e) => setTimeVal(e.target.value)}
        />
        <Select
          label="Time Unit"
          value={timeUnit}
          onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
          options={[
            { value: 'years', label: 'Years' },
            { value: 'months', label: 'Months (T ÷ 12)' },
            { value: 'days', label: 'Days (T ÷ 365)' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={handleReset} size="sm" />
        {!calc.error && (
          <CopyButton
            text={`Principal: ${formatCurrency(calc.P ?? 0)} | Simple Interest: ${formatCurrency(calc.simpleInterest ?? 0)} | Total Maturity Value: ${formatCurrency(calc.totalMaturity ?? 0)}`}
            label="Copy Result"
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox
              highlight
              label="Total Simple Interest (SI)"
              value={formatCurrency(calc.simpleInterest ?? 0)}
              sublabel={`SI = (${formatNumber(calc.P ?? 0)} × ${calc.R}% × ${formatNumber(calc.yearsT ?? 0, 3)} yrs)`}
              copyText={formatCurrency(calc.simpleInterest ?? 0)}
            />
            <ResultBox
              highlight
              label="Total Maturity Value (P + SI)"
              value={formatCurrency(calc.totalMaturity ?? 0)}
              sublabel="Principal + Earned Interest"
              copyText={formatCurrency(calc.totalMaturity ?? 0)}
            />
            <ResultBox
              label="Principal Base (P)"
              value={formatCurrency(calc.P ?? 0)}
              sublabel="Starting capital"
              copyText={formatCurrency(calc.P ?? 0)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox
              label="Interest Per Year"
              value={formatCurrency(calc.annualInterest ?? 0)}
              copyText={formatCurrency(calc.annualInterest ?? 0)}
            />
            <ResultBox
              label="Interest Per Month"
              value={formatCurrency(calc.monthlyInterest ?? 0)}
              copyText={formatCurrency(calc.monthlyInterest ?? 0)}
            />
            <ResultBox
              label="Interest Per Day (365d)"
              value={formatCurrency(calc.dailyInterest ?? 0)}
              copyText={formatCurrency(calc.dailyInterest ?? 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleInterestCalculator;
