import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency, formatNumber } from '../../lib/querySync';

function formatInrLakhCrore(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  if (abs >= 10000000) {
    return `₹${formatted} (${(amount / 10000000).toFixed(2)} Cr)`;
  }
  if (abs >= 100000) {
    return `₹${formatted} (${(amount / 100000).toFixed(2)} Lakh)`;
  }
  return `₹${formatted}`;
}

// 16. SIP Calculator
export const SipCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(() => getQueryParam('sip', '10000'));
  const [annualReturnRate, setAnnualReturnRate] = useState(() => getQueryParam('rate', '12'));
  const [years, setYears] = useState(() => getQueryParam('yrs', '10'));
  const [stepUpPct, setStepUpPct] = useState(() => getQueryParam('stepup', '0'));

  useEffect(() => {
    syncQueryParams({ sip: monthlyInvestment, rate: annualReturnRate, yrs: years, stepup: stepUpPct });
  }, [monthlyInvestment, annualReturnRate, years, stepUpPct]);

  const calc = useMemo(() => {
    const P = parseFloat(monthlyInvestment);
    const rAnnual = parseFloat(annualReturnRate);
    const tYears = parseInt(years, 10);
    const stepUp = Math.max(0, parseFloat(stepUpPct) || 0);

    if (!Number.isFinite(P) || P <= 0) {
      return { error: 'Please enter a valid positive monthly SIP investment amount.' };
    }
    if (!Number.isFinite(rAnnual) || rAnnual < 0 || rAnnual > 100) {
      return { error: 'Expected annual return rate must be between 0% and 100%.' };
    }
    if (!Number.isFinite(tYears) || tYears < 1 || tYears > 50) {
      return { error: 'Investment duration must be between 1 and 50 years.' };
    }

    const i = rAnnual / 12 / 100;
    let totalInvested = 0;
    let currentCorpus = 0;
    let currentMonthlySip = P;
    const yearlyBreakdown: {
      year: number;
      monthlySip: number;
      invested: number;
      wealthGained: number;
      totalValue: number;
    }[] = [];

    for (let y = 1; y <= tYears; y++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentMonthlySip;
        currentCorpus = (currentCorpus + currentMonthlySip) * (1 + i);
      }
      yearlyBreakdown.push({
        year: y,
        monthlySip: currentMonthlySip,
        invested: totalInvested,
        wealthGained: Math.max(0, currentCorpus - totalInvested),
        totalValue: currentCorpus,
      });
      currentMonthlySip = currentMonthlySip * (1 + stepUp / 100);
    }

    const estReturns = Math.max(0, currentCorpus - totalInvested);

    return {
      error: null,
      totalInvested,
      estReturns,
      totalValue: currentCorpus,
      yearlyBreakdown,
    };
  }, [monthlyInvestment, annualReturnRate, years, stepUpPct]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="number"
          min="100"
          step="500"
          label="Monthly SIP Amount"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.5"
          label="Expected Return Rate (p.a.)"
          suffixAddon="%"
          value={annualReturnRate}
          onChange={(e) => setAnnualReturnRate(e.target.value)}
        />
        <Input
          type="number"
          min="1"
          max="50"
          step="1"
          label="Time Period (Years)"
          suffixAddon="yrs"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="50"
          step="1"
          label="Annual Step-Up (%)"
          suffixAddon="%"
          helperText="Optional yearly SIP increase"
          value={stepUpPct}
          onChange={(e) => setStepUpPct(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton
          onReset={() => {
            setMonthlyInvestment('10000');
            setAnnualReturnRate('12');
            setYears('10');
            setStepUpPct('0');
          }}
          size="sm"
        />
        {!calc.error && (
          <CopyButton
            text={`SIP Maturity Value: ${formatInrLakhCrore(calc.totalValue ?? 0)} | Invested: ${formatInrLakhCrore(calc.totalInvested ?? 0)} | Est. Returns: ${formatInrLakhCrore(calc.estReturns ?? 0)}`}
            label="Copy SIP Summary"
            size="sm"
          />
        )}
      </div>

      {calc.error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {calc.error}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox
              label="Total Invested Amount"
              value={formatInrLakhCrore(calc.totalInvested ?? 0)}
              sublabel={`Over ${years} years`}
              copyText={formatCurrency(calc.totalInvested ?? 0, 0)}
            />
            <ResultBox
              highlight
              label="Estimated Wealth Gained"
              value={formatInrLakhCrore(calc.estReturns ?? 0)}
              sublabel={`At ${annualReturnRate}% p.a. compounded monthly`}
              copyText={formatCurrency(calc.estReturns ?? 0, 0)}
            />
            <ResultBox
              highlight
              label="Total Maturity Value"
              value={formatInrLakhCrore(calc.totalValue ?? 0)}
              sublabel="Invested Capital + Compounded Returns"
              copyText={formatCurrency(calc.totalValue ?? 0, 0)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-80">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Year</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Monthly SIP</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total Invested</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Est. Returns</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Maturity Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {calc.yearlyBreakdown?.map((row) => (
                  <tr key={row.year}>
                    <td className="py-2 px-4 font-sans font-medium">Year {row.year}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(row.monthlySip, 0)}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(row.invested, 0)}</td>
                    <td className="py-2 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(row.wealthGained, 0)}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold">
                      {formatCurrency(row.totalValue, 0)}
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

// 17. FD Calculator
export const FdCalculator: React.FC = () => {
  const [deposit, setDeposit] = useState(() => getQueryParam('fd', '100000'));
  const [rate, setRate] = useState(() => getQueryParam('rate', '7.1'));
  const [tenureMonths, setTenureMonths] = useState(() => getQueryParam('months', '36'));
  const [compounding, setCompounding] = useState(() => getQueryParam('comp', '4'));

  useEffect(() => {
    syncQueryParams({ fd: deposit, rate, months: tenureMonths, comp: compounding });
  }, [deposit, rate, tenureMonths, compounding]);

  const calc = useMemo(() => {
    const P = parseFloat(deposit);
    const r = parseFloat(rate);
    const months = parseFloat(tenureMonths);
    const n = parseInt(compounding, 10) || 4;

    if (!Number.isFinite(P) || P <= 0) {
      return { error: 'Please enter a valid positive Fixed Deposit amount.' };
    }
    if (!Number.isFinite(r) || r < 0 || r > 50) {
      return { error: 'Interest rate must be between 0% and 50%.' };
    }
    if (!Number.isFinite(months) || months <= 0 || months > 600) {
      return { error: 'Tenure in months must be between 1 and 600.' };
    }

    const years = months / 12;
    const maturityValue = P * Math.pow(1 + r / 100 / n, n * years);
    const interestEarned = maturityValue - P;
    const effectiveYield = (interestEarned / P / years) * 100;

    return {
      error: null,
      P,
      maturityValue,
      interestEarned,
      effectiveYield,
      years,
    };
  }, [deposit, rate, tenureMonths, compounding]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="number"
          min="500"
          step="1000"
          label="Total Deposit Amount"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="50"
          step="0.1"
          label="FD Interest Rate (% p.a.)"
          suffixAddon="%"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <Input
          type="number"
          min="1"
          max="600"
          step="1"
          label="Tenure (In Months)"
          suffixAddon="mos"
          value={tenureMonths}
          onChange={(e) => setTenureMonths(e.target.value)}
        />
        <Select
          label="Compounding Frequency"
          value={compounding}
          onChange={(e) => setCompounding(e.target.value)}
          options={[
            { value: '4', label: 'Quarterly (Standard Bank FD)' },
            { value: '12', label: 'Monthly' },
            { value: '2', label: 'Half-Yearly' },
            { value: '1', label: 'Annually' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton
          onReset={() => {
            setDeposit('100000');
            setRate('7.1');
            setTenureMonths('36');
            setCompounding('4');
          }}
          size="sm"
        />
        {!calc.error && (
          <CopyButton
            text={`FD Maturity: ${formatInrLakhCrore(calc.maturityValue ?? 0)} | Total Interest: ${formatInrLakhCrore(calc.interestEarned ?? 0)}`}
            label="Copy FD Result"
            size="sm"
          />
        )}
      </div>

      {calc.error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {calc.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultBox
            label="Principal Deposit"
            value={formatInrLakhCrore(calc.P ?? 0)}
            sublabel={`Locked for ${formatNumber(calc.years ?? 0, 2)} years`}
            copyText={formatCurrency(calc.P ?? 0, 2)}
          />
          <ResultBox
            highlight
            label="Total Interest Earned"
            value={formatInrLakhCrore(calc.interestEarned ?? 0)}
            sublabel={`Effective Annualized Yield: ${formatNumber(calc.effectiveYield ?? 0, 2)}%`}
            copyText={formatCurrency(calc.interestEarned ?? 0, 2)}
          />
          <ResultBox
            highlight
            label="Maturity Value"
            value={formatInrLakhCrore(calc.maturityValue ?? 0)}
            sublabel="Principal + Cumulative FD Interest"
            copyText={formatCurrency(calc.maturityValue ?? 0, 2)}
          />
        </div>
      )}
    </div>
  );
};

// 18. RD Calculator
export const RdCalculator: React.FC = () => {
  const [monthlyDeposit, setMonthlyDeposit] = useState(() => getQueryParam('rd', '5000'));
  const [rate, setRate] = useState(() => getQueryParam('rate', '7.0'));
  const [months, setMonths] = useState(() => getQueryParam('months', '36'));

  useEffect(() => {
    syncQueryParams({ rd: monthlyDeposit, rate, months });
  }, [monthlyDeposit, rate, months]);

  const calc = useMemo(() => {
    const P = parseFloat(monthlyDeposit);
    const r = parseFloat(rate);
    const nMonths = Math.round(parseFloat(months));

    if (!Number.isFinite(P) || P <= 0) {
      return { error: 'Please enter a valid positive monthly RD installment.' };
    }
    if (!Number.isFinite(r) || r < 0 || r > 50) {
      return { error: 'Interest rate must be between 0% and 50%.' };
    }
    if (!Number.isFinite(nMonths) || nMonths < 1 || nMonths > 600) {
      return { error: 'Tenure must be between 1 and 600 months.' };
    }

    // Standard Indian Bank RD quarterly compounding formula across each monthly deposit
    let maturityValue = 0;
    for (let m = 1; m <= nMonths; m++) {
      const remainingMonths = nMonths - m + 1;
      const quarters = remainingMonths / 3;
      maturityValue += P * Math.pow(1 + r / 400, quarters);
    }

    const totalDeposited = P * nMonths;
    const totalInterest = Math.max(0, maturityValue - totalDeposited);

    return {
      error: null,
      totalDeposited,
      totalInterest,
      maturityValue,
      nMonths,
    };
  }, [monthlyDeposit, rate, months]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="number"
          min="100"
          step="500"
          label="Monthly RD Installment"
          value={monthlyDeposit}
          onChange={(e) => setMonthlyDeposit(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="50"
          step="0.1"
          label="Annual Interest Rate (%)"
          suffixAddon="%"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <Input
          type="number"
          min="3"
          max="600"
          step="3"
          label="RD Tenure (Months)"
          suffixAddon="mos"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton
          onReset={() => {
            setMonthlyDeposit('5000');
            setRate('7.0');
            setMonths('36');
          }}
          size="sm"
        />
        {!calc.error && (
          <CopyButton
            text={`RD Maturity Value: ${formatInrLakhCrore(calc.maturityValue ?? 0)} | Deposited: ${formatInrLakhCrore(calc.totalDeposited ?? 0)} | Interest: ${formatInrLakhCrore(calc.totalInterest ?? 0)}`}
            label="Copy RD Summary"
            size="sm"
          />
        )}
      </div>

      {calc.error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {calc.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultBox
            label="Total Principal Deposited"
            value={formatInrLakhCrore(calc.totalDeposited ?? 0)}
            sublabel={`Across ${calc.nMonths} monthly installments`}
            copyText={formatCurrency(calc.totalDeposited ?? 0, 2)}
          />
          <ResultBox
            highlight
            label="Total RD Interest Earned"
            value={formatInrLakhCrore(calc.totalInterest ?? 0)}
            sublabel="Quarterly compounded bank standard"
            copyText={formatCurrency(calc.totalInterest ?? 0, 2)}
          />
          <ResultBox
            highlight
            label="RD Maturity Value"
            value={formatInrLakhCrore(calc.maturityValue ?? 0)}
            sublabel="Total payout at maturity"
            copyText={formatCurrency(calc.maturityValue ?? 0, 2)}
          />
        </div>
      )}
    </div>
  );
};

// 19. Income Tax Estimator (Estimate Only)
export const IncomeTaxEstimator: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState(() => getQueryParam('income', '1200000'));
  const [deductions80C, setDeductions80C] = useState(() => getQueryParam('ded', '150000'));
  const [hraExemption, setHraExemption] = useState(() => getQueryParam('hra', '100000'));
  const [isSalaried, setIsSalaried] = useState(() => getQueryParam('sal', 'true') !== 'false');

  useEffect(() => {
    syncQueryParams({ income: grossIncome, ded: deductions80C, hra: hraExemption, sal: isSalaried });
  }, [grossIncome, deductions80C, hraExemption, isSalaried]);

  const calc = useMemo(() => {
    const gross = parseFloat(grossIncome);
    const ded = Math.max(0, parseFloat(deductions80C) || 0);
    const hra = Math.max(0, parseFloat(hraExemption) || 0);

    if (!Number.isFinite(gross) || gross < 0) {
      return { error: 'Please enter a valid non-negative annual gross income.' };
    }

    // New Regime (Standard deduction ₹75,000 for salaried)
    const newStdDed = isSalaried ? 75000 : 0;
    const newTaxable = Math.max(0, gross - newStdDed);
    let newBaseTax = 0;

    if (newTaxable > 300000) {
      const s1 = Math.min(400000, newTaxable - 300000);
      newBaseTax += s1 * 0.05;
    }
    if (newTaxable > 700000) {
      const s2 = Math.min(300000, newTaxable - 700000);
      newBaseTax += s2 * 0.1;
    }
    if (newTaxable > 1000000) {
      const s3 = Math.min(200000, newTaxable - 1000000);
      newBaseTax += s3 * 0.15;
    }
    if (newTaxable > 1200000) {
      const s4 = Math.min(300000, newTaxable - 1200000);
      newBaseTax += s4 * 0.2;
    }
    if (newTaxable > 1500000) {
      newBaseTax += (newTaxable - 1500000) * 0.3;
    }
    // Section 87A rebate under New Regime up to ₹7,00,000 taxable income
    if (newTaxable <= 700000) {
      newBaseTax = 0;
    }
    const newCess = newBaseTax * 0.04;
    const newTotalTax = newBaseTax + newCess;

    // Old Regime (Standard deduction ₹50,000 + 80C/80D + HRA)
    const oldStdDed = isSalaried ? 50000 : 0;
    const oldTaxable = Math.max(0, gross - oldStdDed - ded - hra);
    let oldBaseTax = 0;

    if (oldTaxable > 250000) {
      const s1 = Math.min(250000, oldTaxable - 250000);
      oldBaseTax += s1 * 0.05;
    }
    if (oldTaxable > 500000) {
      const s2 = Math.min(500000, oldTaxable - 500000);
      oldBaseTax += s2 * 0.2;
    }
    if (oldTaxable > 1000000) {
      oldBaseTax += (oldTaxable - 1000000) * 0.3;
    }
    // Section 87A rebate under Old Regime up to ₹5,00,000 taxable income
    if (oldTaxable <= 500000) {
      oldBaseTax = 0;
    }
    const oldCess = oldBaseTax * 0.04;
    const oldTotalTax = oldBaseTax + oldCess;

    const recommended = newTotalTax <= oldTotalTax ? 'New Tax Regime' : 'Old Tax Regime';
    const taxSaved = Math.abs(newTotalTax - oldTotalTax);

    return {
      error: null,
      newTaxable,
      newTotalTax,
      oldTaxable,
      oldTotalTax,
      recommended,
      taxSaved,
    };
  }, [grossIncome, deductions80C, hraExemption, isSalaried]);

  return (
    <div className="space-y-6">
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-800 dark:text-amber-300">
        <strong>Informational Estimate Only:</strong> This calculator provides an educational comparison of New vs. Old Regime income tax slabs (including 4% Health & Education Cess). Consult a qualified tax professional or CA before filing your official tax return.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="number"
          min="0"
          step="10000"
          label="Annual Gross Income"
          value={grossIncome}
          onChange={(e) => setGrossIncome(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="5000"
          label="80C / 80D Deductions (Old Regime)"
          value={deductions80C}
          onChange={(e) => setDeductions80C(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="5000"
          label="HRA / Other Exemptions (Old Regime)"
          value={hraExemption}
          onChange={(e) => setHraExemption(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isSalaried}
            onChange={(e) => setIsSalaried(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span>Salaried Employee (Apply Standard Deduction)</span>
        </label>
        <ResetButton
          onReset={() => {
            setGrossIncome('1200000');
            setDeductions80C('150000');
            setHraExemption('100000');
            setIsSalaried(true);
          }}
          size="sm"
        />
      </div>

      {calc.error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {calc.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultBox
            highlight={calc.recommended === 'New Tax Regime'}
            label="Estimated Tax (New Regime)"
            value={formatInrLakhCrore(calc.newTotalTax ?? 0)}
            sublabel={`Taxable Income: ${formatInrLakhCrore(calc.newTaxable ?? 0)}`}
            copyText={formatCurrency(calc.newTotalTax ?? 0, 0)}
          />
          <ResultBox
            highlight={calc.recommended === 'Old Tax Regime'}
            label="Estimated Tax (Old Regime)"
            value={formatInrLakhCrore(calc.oldTotalTax ?? 0)}
            sublabel={`Taxable Income: ${formatInrLakhCrore(calc.oldTaxable ?? 0)}`}
            copyText={formatCurrency(calc.oldTotalTax ?? 0, 0)}
          />
          <ResultBox
            label="Regime Comparison"
            value={calc.recommended ?? ''}
            sublabel={`Saves approx. ${formatInrLakhCrore(calc.taxSaved ?? 0)}`}
            copyText={`${calc.recommended} saves ${formatCurrency(calc.taxSaved ?? 0, 0)}`}
          />
        </div>
      )}
    </div>
  );
};
