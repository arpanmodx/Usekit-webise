import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency, formatNumber } from '../../lib/querySync';

export const ProfitAndLossCalculator: React.FC = () => {
  const [costPrice, setCostPrice] = useState(() => getQueryParam('cp', '60'));
  const [sellingPrice, setSellingPrice] = useState(() => getQueryParam('sp', '100'));
  const [quantity, setQuantity] = useState(() => getQueryParam('qty', '10'));
  const [expenses, setExpenses] = useState(() => getQueryParam('exp', '25'));

  useEffect(() => {
    syncQueryParams({ cp: costPrice, sp: sellingPrice, qty: quantity, exp: expenses });
  }, [costPrice, sellingPrice, quantity, expenses]);

  const calc = useMemo(() => {
    const cp = parseFloat(costPrice);
    const sp = parseFloat(sellingPrice);
    const qty = Math.max(1, parseFloat(quantity) || 1);
    const overhead = Math.max(0, parseFloat(expenses) || 0);

    if (!Number.isFinite(cp) || cp < 0 || !Number.isFinite(sp) || sp < 0) {
      return { error: 'Please enter valid non-negative Cost Price and Selling Price values.' };
    }

    const totalUnitCost = cp * qty;
    const totalCostWithExpenses = totalUnitCost + overhead;
    const totalRevenue = sp * qty;
    const netProfitOrLoss = totalRevenue - totalCostWithExpenses;
    const unitProfit = (totalRevenue - totalCostWithExpenses) / qty;

    const markupPct =
      totalCostWithExpenses > 0 ? (netProfitOrLoss / totalCostWithExpenses) * 100 : 0;
    const grossMarginPct = totalRevenue > 0 ? (netProfitOrLoss / totalRevenue) * 100 : 0;

    let status: 'Profit' | 'Loss' | 'Break-Even' = 'Break-Even';
    if (netProfitOrLoss > 0.0001) status = 'Profit';
    else if (netProfitOrLoss < -0.0001) status = 'Loss';

    const effectiveUnitCost = totalCostWithExpenses / qty;
    const targetMargins = [15, 20, 25, 30, 40, 50].map((m) => ({
      margin: m,
      requiredSp: effectiveUnitCost / (1 - m / 100),
      unitProfit: effectiveUnitCost / (1 - m / 100) - effectiveUnitCost,
    }));

    return {
      error: null,
      status,
      totalCostWithExpenses,
      totalRevenue,
      netProfitOrLoss,
      unitProfit,
      markupPct,
      grossMarginPct,
      effectiveUnitCost,
      targetMargins,
    };
  }, [costPrice, sellingPrice, quantity, expenses]);

  const handleReset = () => {
    setCostPrice('60');
    setSellingPrice('100');
    setQuantity('10');
    setExpenses('25');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="number"
          min="0"
          step="0.01"
          label="Cost Price per Unit (CP)"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="0.01"
          label="Selling Price per Unit (SP)"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />
        <Input
          type="number"
          min="1"
          step="1"
          label="Quantity (Units)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="0.01"
          label="Additional Expenses"
          helperText="Shipping, fees, overhead"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={handleReset} size="sm" />
        {!calc.error && (
          <CopyButton
            text={`Status: Net ${calc.status} of ${formatCurrency(Math.abs(calc.netProfitOrLoss ?? 0))} | Markup: ${formatNumber(calc.markupPct ?? 0, 2)}% | Gross Margin: ${formatNumber(calc.grossMarginPct ?? 0, 2)}%`}
            label="Copy Profit Report"
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
              label={`Net ${calc.status}`}
              value={`${(calc.netProfitOrLoss ?? 0) >= 0 ? '+' : '−'}${formatCurrency(Math.abs(calc.netProfitOrLoss ?? 0))}`}
              sublabel={`${formatCurrency(calc.unitProfit ?? 0)} per unit`}
              copyText={formatCurrency(calc.netProfitOrLoss ?? 0)}
            />
            <ResultBox
              highlight
              label="Profit / Loss % on Cost (Markup)"
              value={`${formatNumber(calc.markupPct ?? 0, 2)}%`}
              sublabel="(Net Profit ÷ Total Cost) × 100"
              copyText={`${formatNumber(calc.markupPct ?? 0, 2)}%`}
            />
            <ResultBox
              label="Gross Margin % on Revenue"
              value={`${formatNumber(calc.grossMarginPct ?? 0, 2)}%`}
              sublabel="(Net Profit ÷ Revenue) × 100"
              copyText={`${formatNumber(calc.grossMarginPct ?? 0, 2)}%`}
            />
            <ResultBox
              label="Total Revenue vs. Cost"
              value={formatCurrency(calc.totalRevenue ?? 0)}
              sublabel={`Total Cost: ${formatCurrency(calc.totalCostWithExpenses ?? 0)}`}
              copyText={formatCurrency(calc.totalRevenue ?? 0)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Target Gross Margin</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Required Selling Price / Unit</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Net Profit / Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {calc.targetMargins?.map((row) => (
                  <tr key={row.margin}>
                    <td className="py-2 px-4 font-sans font-medium">{row.margin}% Gross Margin</td>
                    <td className="py-2 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(row.requiredSp)}
                    </td>
                    <td className="py-2 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(row.unitProfit)}
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

export default ProfitAndLossCalculator;
