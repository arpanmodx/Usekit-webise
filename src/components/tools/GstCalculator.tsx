import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency, formatNumber } from '../../lib/querySync';

type GstMode = 'exclusive' | 'inclusive';

export const GstCalculator: React.FC = () => {
  const [mode, setMode] = useState<GstMode>(() =>
    getQueryParam('mode', 'exclusive') === 'inclusive' ? 'inclusive' : 'exclusive'
  );
  const [amount, setAmount] = useState(() => getQueryParam('amount', '1000'));
  const [rate, setRate] = useState(() => getQueryParam('rate', '18'));

  useEffect(() => {
    syncQueryParams({ mode, amount, rate });
  }, [mode, amount, rate]);

  const calc = useMemo(() => {
    const baseVal = parseFloat(amount);
    const gstRate = parseFloat(rate);

    if (!Number.isFinite(baseVal) || baseVal < 0) {
      return { error: 'Please enter a valid non-negative amount.' };
    }
    if (!Number.isFinite(gstRate) || gstRate < 0 || gstRate > 100) {
      return { error: 'Please enter a valid GST percentage rate between 0% and 100%.' };
    }

    let netAmount = 0;
    let gstAmount = 0;
    let grossAmount = 0;

    if (mode === 'exclusive') {
      netAmount = baseVal;
      gstAmount = baseVal * (gstRate / 100);
      grossAmount = netAmount + gstAmount;
    } else {
      grossAmount = baseVal;
      netAmount = baseVal / (1 + gstRate / 100);
      gstAmount = grossAmount - netAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const halfRate = gstRate / 2;

    return {
      error: null,
      netAmount,
      gstAmount,
      grossAmount,
      cgst,
      sgst,
      halfRate,
      gstRate,
    };
  }, [mode, amount, rate]);

  const handleReset = () => {
    setMode('exclusive');
    setAmount('1000');
    setRate('18');
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setMode('exclusive')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            mode === 'exclusive'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          GST Exclusive (Add GST)
        </button>
        <button
          type="button"
          onClick={() => setMode('inclusive')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            mode === 'inclusive'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          GST Inclusive (Remove GST)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="number"
          min="0"
          step="0.01"
          label={mode === 'exclusive' ? 'Net Amount (Excluding GST)' : 'Gross Amount (Including GST)'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          label="GST Rate (%)"
          suffixAddon="%"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1">Standard GST Slabs:</span>
          {[3, 5, 10, 12, 15, 18, 28].map((slab) => (
            <button
              key={slab}
              type="button"
              onClick={() => setRate(String(slab))}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                Number(rate) === slab
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {slab}%
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ResetButton onReset={handleReset} size="sm" />
          {!calc.error && (
            <CopyButton
              text={`Net Price: ${formatCurrency(calc.netAmount ?? 0)} | GST (${calc.gstRate}%): ${formatCurrency(calc.gstAmount ?? 0)} | Gross Total: ${formatCurrency(calc.grossAmount ?? 0)}`}
              label="Copy Invoice Breakdown"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox
              label="Net Pre-Tax Price"
              value={formatCurrency(calc.netAmount ?? 0)}
              sublabel="Base taxable value"
              copyText={formatCurrency(calc.netAmount ?? 0)}
            />
            <ResultBox
              highlight
              label={`Total GST (${formatNumber(calc.gstRate ?? 0, 2)}%)`}
              value={formatCurrency(calc.gstAmount ?? 0)}
              sublabel={`IGST @ ${formatNumber(calc.gstRate ?? 0, 2)}%`}
              copyText={formatCurrency(calc.gstAmount ?? 0)}
            />
            <ResultBox
              highlight
              label="Gross Invoice Total"
              value={formatCurrency(calc.grossAmount ?? 0)}
              sublabel="Net Price + Total GST"
              copyText={formatCurrency(calc.grossAmount ?? 0)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultBox
              label={`CGST (${formatNumber(calc.halfRate ?? 0, 2)}%)`}
              value={formatCurrency(calc.cgst ?? 0)}
              sublabel="50% Central GST share (Intra-State)"
              copyText={formatCurrency(calc.cgst ?? 0)}
            />
            <ResultBox
              label={`SGST (${formatNumber(calc.halfRate ?? 0, 2)}%)`}
              value={formatCurrency(calc.sgst ?? 0)}
              sublabel="50% State GST share (Intra-State)"
              copyText={formatCurrency(calc.sgst ?? 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GstCalculator;
