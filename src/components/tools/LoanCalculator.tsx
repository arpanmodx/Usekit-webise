import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency } from '../../lib/querySync';

type LoanMode = 'payment' | 'affordability';

export const LoanCalculator: React.FC = () => {
  const [mode, setMode] = useState<LoanMode>(() =>
    getQueryParam('mode', 'payment') === 'affordability' ? 'affordability' : 'payment'
  );
  const [loanAmount, setLoanAmount] = useState(() => getQueryParam('amount', '100000'));
  const [targetMonthlyPayment, setTargetMonthlyPayment] = useState(() =>
    getQueryParam('monthly', '1500')
  );
  const [interestRate, setInterestRate] = useState(() => getQueryParam('rate', '7.2'));
  const [years, setYears] = useState(() => getQueryParam('years', '10'));
  const [extraMonthly, setExtraMonthly] = useState(() => getQueryParam('extra', '200'));
  const [feePct, setFeePct] = useState(() => getQueryParam('fee', '1'));

  useEffect(() => {
    syncQueryParams({
      mode,
      amount: loanAmount,
      monthly: targetMonthlyPayment,
      rate: interestRate,
      years,
      extra: extraMonthly,
      fee: feePct,
    });
  }, [mode, loanAmount, targetMonthlyPayment, interestRate, years, extraMonthly, feePct]);

  const calc = useMemo(() => {
    const annualRate = parseFloat(interestRate);
    const termYears = parseFloat(years);
    const extra = Math.max(0, parseFloat(extraMonthly) || 0);
    const feeRate = Math.max(0, parseFloat(feePct) || 0);

    if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) {
      return { error: 'Please enter a valid annual interest rate (0% – 100%).' };
    }
    if (!Number.isFinite(termYears) || termYears <= 0 || termYears > 50) {
      return { error: 'Please enter a loan term between 0.5 and 50 years.' };
    }

    const n = Math.max(1, Math.round(termYears * 12));
    const r = annualRate / 12 / 100;

    let P = 0;
    let baseMonthlyPayment = 0;

    if (mode === 'payment') {
      P = parseFloat(loanAmount);
      if (!Number.isFinite(P) || P <= 0) {
        return { error: 'Please enter a valid loan amount greater than zero.' };
      }
      if (r === 0) {
        baseMonthlyPayment = P / n;
      } else {
        const factor = Math.pow(1 + r, n);
        baseMonthlyPayment = (P * r * factor) / (factor - 1);
      }
    } else {
      baseMonthlyPayment = parseFloat(targetMonthlyPayment);
      if (!Number.isFinite(baseMonthlyPayment) || baseMonthlyPayment <= 0) {
        return { error: 'Please enter a valid target monthly payment greater than zero.' };
      }
      if (r === 0) {
        P = baseMonthlyPayment * n;
      } else {
        const factor = Math.pow(1 + r, n);
        P = (baseMonthlyPayment * (factor - 1)) / (r * factor);
      }
    }

    const standardTotalPaid = baseMonthlyPayment * n;
    const standardTotalInterest = Math.max(0, standardTotalPaid - P);
    const originationFee = P * (feeRate / 100);
    const netDisbursed = P - originationFee;

    // Simulate accelerated payoff with extraMonthly payment
    let balance = P;
    let actualMonths = 0;
    let acceleratedInterest = 0;

    while (balance > 0.005 && actualMonths < n) {
      actualMonths += 1;
      const monthInterest = balance * r;
      acceleratedInterest += monthInterest;
      const principalPayment = Math.min(balance, baseMonthlyPayment - monthInterest + extra);
      balance = Math.max(0, balance - principalPayment);
    }

    const monthsSaved = Math.max(0, n - actualMonths);
    const interestSaved = Math.max(0, standardTotalInterest - acceleratedInterest);

    return {
      error: null,
      P,
      baseMonthlyPayment,
      standardTotalPaid,
      standardTotalInterest,
      originationFee,
      netDisbursed,
      n,
      actualMonths,
      monthsSaved,
      acceleratedInterest,
      interestSaved,
      extra,
    };
  }, [mode, loanAmount, targetMonthlyPayment, interestRate, years, extraMonthly, feePct]);

  const handleReset = () => {
    setMode('payment');
    setLoanAmount('100000');
    setTargetMonthlyPayment('1500');
    setInterestRate('7.2');
    setYears('10');
    setExtraMonthly('200');
    setFeePct('1');
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setMode('payment')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            mode === 'payment'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Calculate Monthly Payment & Payoff
        </button>
        <button
          type="button"
          onClick={() => setMode('affordability')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            mode === 'affordability'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Max Loan Affordability (Reverse Solve)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mode === 'payment' ? (
          <Input
            type="number"
            min="1"
            step="500"
            label="Loan Principal Amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        ) : (
          <Input
            type="number"
            min="1"
            step="50"
            label="Target Affordable Monthly Payment"
            value={targetMonthlyPayment}
            onChange={(e) => setTargetMonthlyPayment(e.target.value)}
          />
        )}
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          label="Annual Interest Rate (%)"
          suffixAddon="%"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <Input
          type="number"
          min="0.5"
          max="50"
          step="0.5"
          label="Loan Term (Years)"
          suffixAddon="yrs"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="25"
          label="Extra Monthly Principal Payment"
          helperText="Optional prepayment to pay off early"
          value={extraMonthly}
          onChange={(e) => setExtraMonthly(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="20"
          step="0.25"
          label="Origination / Processing Fee (%)"
          suffixAddon="%"
          helperText="Upfront lender fee"
          value={feePct}
          onChange={(e) => setFeePct(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={handleReset} size="sm" />
        {!calc.error && (
          <CopyButton
            text={`Loan Principal: ${formatCurrency(calc.P ?? 0)} | Monthly Payment: ${formatCurrency(calc.baseMonthlyPayment ?? 0)} | Interest Saved with Prepayment: ${formatCurrency(calc.interestSaved ?? 0)}`}
            label="Copy Loan Summary"
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
              label={mode === 'payment' ? 'Required Monthly Payment' : 'Max Affordable Loan Principal'}
              value={
                mode === 'payment'
                  ? formatCurrency(calc.baseMonthlyPayment ?? 0)
                  : formatCurrency(calc.P ?? 0)
              }
              sublabel={
                mode === 'payment'
                  ? `Principal: ${formatCurrency(calc.P ?? 0)}`
                  : `At ${formatCurrency(calc.baseMonthlyPayment ?? 0)} / month`
              }
              copyText={
                mode === 'payment'
                  ? formatCurrency(calc.baseMonthlyPayment ?? 0)
                  : formatCurrency(calc.P ?? 0)
              }
            />
            <ResultBox
              label="Standard Total Interest"
              value={formatCurrency(calc.standardTotalInterest ?? 0)}
              sublabel={`Over ${calc.n} scheduled months`}
              copyText={formatCurrency(calc.standardTotalInterest ?? 0)}
            />
            <ResultBox
              label="Standard Total Cost (P + I)"
              value={formatCurrency(calc.standardTotalPaid ?? 0)}
              sublabel={`Net Disbursed after Fee: ${formatCurrency(calc.netDisbursed ?? 0)}`}
              copyText={formatCurrency(calc.standardTotalPaid ?? 0)}
            />
          </div>

          {(calc.extra ?? 0) > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ResultBox
                highlight
                label="Interest Saved with Prepayment"
                value={formatCurrency(calc.interestSaved ?? 0)}
                sublabel={`With +${formatCurrency(calc.extra ?? 0)}/mo extra`}
                copyText={formatCurrency(calc.interestSaved ?? 0)}
              />
              <ResultBox
                highlight
                label="Time Shaved Off Loan"
                value={`${Math.floor((calc.monthsSaved ?? 0) / 12)} yrs, ${(calc.monthsSaved ?? 0) % 12} mos`}
                sublabel={`Paid off in ${calc.actualMonths} mos instead of ${calc.n} mos`}
                copyText={`${calc.monthsSaved} months saved`}
              />
              <ResultBox
                label="Accelerated Total Interest"
                value={formatCurrency(calc.acceleratedInterest ?? 0)}
                sublabel="Reduced cumulative interest"
                copyText={formatCurrency(calc.acceleratedInterest ?? 0)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
