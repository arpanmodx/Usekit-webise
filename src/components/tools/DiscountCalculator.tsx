import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatCurrency, formatNumber } from '../../lib/querySync';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState(() => getQueryParam('price', '120'));
  const [discountPct, setDiscountPct] = useState(() => getQueryParam('off', '25'));
  const [extraDiscountPct, setExtraDiscountPct] = useState(() => getQueryParam('extra', '10'));
  const [salesTaxPct, setSalesTaxPct] = useState(() => getQueryParam('tax', '0'));

  useEffect(() => {
    syncQueryParams({
      price: originalPrice,
      off: discountPct,
      extra: extraDiscountPct,
      tax: salesTaxPct,
    });
  }, [originalPrice, discountPct, extraDiscountPct, salesTaxPct]);

  const calc = useMemo(() => {
    const price = parseFloat(originalPrice);
    const d1 = parseFloat(discountPct) || 0;
    const d2 = parseFloat(extraDiscountPct) || 0;
    const tax = parseFloat(salesTaxPct) || 0;

    if (!Number.isFinite(price) || price < 0) {
      return { error: 'Please enter a valid non-negative original price.' };
    }
    if (d1 < 0 || d1 > 100 || d2 < 0 || d2 > 100) {
      return { error: 'Discount percentages must be between 0% and 100%.' };
    }
    if (tax < 0 || tax > 100) {
      return { error: 'Sales tax percentage must be between 0% and 100%.' };
    }

    const firstSavings = price * (d1 / 100);
    const afterFirstDiscount = price - firstSavings;
    const secondSavings = afterFirstDiscount * (d2 / 100);
    const netSalePrice = afterFirstDiscount - secondSavings;
    const totalSavings = price - netSalePrice;
    const effectiveDiscountRate = price > 0 ? (totalSavings / price) * 100 : 0;
    const taxAmount = netSalePrice * (tax / 100);
    const finalPayableWithTax = netSalePrice + taxAmount;

    return {
      error: null,
      price,
      firstSavings,
      afterFirstDiscount,
      secondSavings,
      netSalePrice,
      totalSavings,
      effectiveDiscountRate,
      taxAmount,
      finalPayableWithTax,
    };
  }, [originalPrice, discountPct, extraDiscountPct, salesTaxPct]);

  const handleReset = () => {
    setOriginalPrice('120');
    setDiscountPct('25');
    setExtraDiscountPct('10');
    setSalesTaxPct('0');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="number"
          min="0"
          step="0.01"
          label="Original Price"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.5"
          label="Primary Discount (%)"
          suffixAddon="%"
          value={discountPct}
          onChange={(e) => setDiscountPct(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.5"
          label="Extra Stacked Promo (%)"
          suffixAddon="%"
          helperText="Applied after 1st discount"
          value={extraDiscountPct}
          onChange={(e) => setExtraDiscountPct(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          label="Sales Tax (%)"
          suffixAddon="%"
          helperText="Optional checkout tax"
          value={salesTaxPct}
          onChange={(e) => setSalesTaxPct(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1">Quick Discount:</span>
          {[10, 15, 20, 25, 30, 50].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDiscountPct(String(preset))}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                Number(discountPct) === preset
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ResetButton onReset={handleReset} size="sm" />
          {!calc.error && (
            <CopyButton
              text={`Sale Price: ${formatCurrency(calc.finalPayableWithTax ?? 0)} | You Save: ${formatCurrency(calc.totalSavings ?? 0)} (${formatNumber(calc.effectiveDiscountRate ?? 0, 2)}% off)`}
              label="Copy Summary"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultBox
              highlight
              label="Final Payable Price"
              value={formatCurrency(calc.finalPayableWithTax ?? 0)}
              sublabel={
                (calc.taxAmount ?? 0) > 0
                  ? `Includes ${formatCurrency(calc.taxAmount ?? 0)} sales tax`
                  : 'Net discounted price'
              }
              copyText={formatCurrency(calc.finalPayableWithTax ?? 0)}
            />
            <ResultBox
              highlight
              label="Total You Save"
              value={formatCurrency(calc.totalSavings ?? 0)}
              sublabel={`Combined ${formatNumber(calc.effectiveDiscountRate ?? 0, 2)}% effective discount`}
              copyText={formatCurrency(calc.totalSavings ?? 0)}
            />
            <ResultBox
              label="After 1st Discount"
              value={formatCurrency(calc.afterFirstDiscount ?? 0)}
              sublabel={`−${formatCurrency(calc.firstSavings ?? 0)} (${discountPct || 0}% off)`}
              copyText={formatCurrency(calc.afterFirstDiscount ?? 0)}
            />
            <ResultBox
              label="Net Pre-Tax Subtotal"
              value={formatCurrency(calc.netSalePrice ?? 0)}
              sublabel={
                (calc.secondSavings ?? 0) > 0
                  ? `−${formatCurrency(calc.secondSavings ?? 0)} extra promo`
                  : 'No 2nd stacked discount'
              }
              copyText={formatCurrency(calc.netSalePrice ?? 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCalculator;
