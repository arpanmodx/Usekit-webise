import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency } from '../../lib/querySync';

export const TipCalculator: React.FC = () => {
  const [billSubtotal, setBillSubtotal] = useState(() => getQueryParam('bill', '86.50'));
  const [tipPct, setTipPct] = useState(() => getQueryParam('tip', '18'));
  const [taxAmount, setTaxAmount] = useState(() => getQueryParam('tax', '7.25'));
  const [splitPeople, setSplitPeople] = useState(() => getQueryParam('split', '2'));

  useEffect(() => {
    syncQueryParams({ bill: billSubtotal, tip: tipPct, tax: taxAmount, split: splitPeople });
  }, [billSubtotal, tipPct, taxAmount, splitPeople]);

  const calc = useMemo(() => {
    const subtotal = parseFloat(billSubtotal);
    const tipRate = parseFloat(tipPct);
    const tax = Math.max(0, parseFloat(taxAmount) || 0);
    const people = Math.max(1, Math.round(parseFloat(splitPeople) || 1));

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return { error: 'Please enter a valid non-negative bill subtotal.' };
    }
    if (!Number.isFinite(tipRate) || tipRate < 0 || tipRate > 200) {
      return { error: 'Please enter a tip percentage between 0% and 200%.' };
    }

    const totalTip = subtotal * (tipRate / 100);
    const grandTotal = subtotal + tax + totalTip;
    const tipPerPerson = totalTip / people;
    const totalPerPerson = grandTotal / people;
    const roundedUpPerPerson = Math.ceil(totalPerPerson);

    const quickTable = [10, 15, 18, 20, 22, 25].map((pct) => {
      const t = subtotal * (pct / 100);
      const tot = subtotal + tax + t;
      return {
        pct,
        tipAmount: t,
        grandTotal: tot,
        perPerson: tot / people,
      };
    });

    return {
      error: null,
      subtotal,
      tax,
      people,
      totalTip,
      grandTotal,
      tipPerPerson,
      totalPerPerson,
      roundedUpPerPerson,
      quickTable,
    };
  }, [billSubtotal, tipPct, taxAmount, splitPeople]);

  const handleReset = () => {
    setBillSubtotal('86.50');
    setTipPct('18');
    setTaxAmount('7.25');
    setSplitPeople('2');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="number"
          min="0"
          step="0.5"
          label="Pre-Tax Bill Subtotal"
          value={billSubtotal}
          onChange={(e) => setBillSubtotal(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="200"
          step="1"
          label="Tip Percentage (%)"
          suffixAddon="%"
          value={tipPct}
          onChange={(e) => setTipPct(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="0.25"
          label="Sales Tax Amount (Optional)"
          helperText="Added after tip calculation"
          value={taxAmount}
          onChange={(e) => setTaxAmount(e.target.value)}
        />
        <Input
          type="number"
          min="1"
          max="100"
          step="1"
          label="Number of People"
          suffixAddon="guests"
          value={splitPeople}
          onChange={(e) => setSplitPeople(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1">Quick Tip Presets:</span>
          {[10, 15, 18, 20, 22, 25].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setTipPct(String(pct))}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                Number(tipPct) === pct
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ResetButton onReset={handleReset} size="sm" />
          {!calc.error && (
            <CopyButton
              text={`Total Tip: ${formatCurrency(calc.totalTip ?? 0)} | Grand Total: ${formatCurrency(calc.grandTotal ?? 0)} | Per Person (${calc.people}): ${formatCurrency(calc.totalPerPerson ?? 0)}`}
              label="Copy Split"
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
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultBox
              highlight
              label="Total Per Person"
              value={formatCurrency(calc.totalPerPerson ?? 0)}
              sublabel={`Rounded up: ${formatCurrency(calc.roundedUpPerPerson ?? 0, 0)} / guest`}
              copyText={formatCurrency(calc.totalPerPerson ?? 0)}
            />
            <ResultBox
              highlight
              label="Tip Per Person"
              value={formatCurrency(calc.tipPerPerson ?? 0)}
              sublabel={`Split across ${calc.people} ${calc.people === 1 ? 'person' : 'people'}`}
              copyText={formatCurrency(calc.tipPerPerson ?? 0)}
            />
            <ResultBox
              label="Total Tip Amount"
              value={formatCurrency(calc.totalTip ?? 0)}
              sublabel={`${tipPct}% of pre-tax subtotal`}
              copyText={formatCurrency(calc.totalTip ?? 0)}
            />
            <ResultBox
              label="Grand Total (Bill + Tax + Tip)"
              value={formatCurrency(calc.grandTotal ?? 0)}
              sublabel={`Includes ${formatCurrency(calc.tax ?? 0)} tax`}
              copyText={formatCurrency(calc.grandTotal ?? 0)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Tip %</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total Tip</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Grand Total</th>
                  <th className="py-2.5 px-4 font-semibold text-right">
                    Per Person ({calc.people})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {calc.quickTable?.map((row) => (
                  <tr
                    key={row.pct}
                    className={
                      Number(tipPct) === row.pct
                        ? 'bg-blue-50/50 dark:bg-blue-950/30 font-semibold'
                        : ''
                    }
                  >
                    <td className="py-2 px-4 font-sans">{row.pct}% Tip</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(row.tipAmount)}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(row.grandTotal)}</td>
                    <td className="py-2 px-4 text-right text-blue-600 dark:text-blue-400">
                      {formatCurrency(row.perPerson)}
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

export default TipCalculator;
