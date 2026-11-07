import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/Input';
import { ResultBox } from '../ui/ResultBox';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { getQueryParam, syncQueryParams, formatNumber } from '../../lib/querySync';

type UnitSystem = 'metric' | 'imperial';

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<UnitSystem>(() =>
    getQueryParam('unit', 'metric') === 'imperial' ? 'imperial' : 'metric'
  );
  const [weightKg, setWeightKg] = useState(() => getQueryParam('kg', '70'));
  const [heightCm, setHeightCm] = useState(() => getQueryParam('cm', '175'));
  const [weightLbs, setWeightLbs] = useState(() => getQueryParam('lbs', '154'));
  const [heightFt, setHeightFt] = useState(() => getQueryParam('ft', '5'));
  const [heightIn, setHeightIn] = useState(() => getQueryParam('in', '9'));

  useEffect(() => {
    if (unit === 'metric') {
      syncQueryParams({ unit, kg: weightKg, cm: heightCm });
    } else {
      syncQueryParams({ unit, lbs: weightLbs, ft: heightFt, in: heightIn });
    }
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const result = useMemo(() => {
    let kg = 0;
    let meters = 0;

    if (unit === 'metric') {
      kg = parseFloat(weightKg);
      const cm = parseFloat(heightCm);
      if (!Number.isFinite(kg) || !Number.isFinite(cm) || kg <= 0 || cm <= 30) {
        return { error: 'Please enter a valid positive weight (kg) and height (cm > 30).' };
      }
      meters = cm / 100;
    } else {
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inches;
      if (!Number.isFinite(lbs) || lbs <= 0 || totalInches <= 12) {
        return { error: 'Please enter a valid positive weight (lbs) and height (feet & inches).' };
      }
      kg = lbs * 0.45359237;
      meters = totalInches * 0.0254;
    }

    const bmi = kg / (meters * meters);
    const bmiPrime = bmi / 25.0;
    const ponderalIndex = kg / (meters * meters * meters);

    const minHealthyKg = 18.5 * meters * meters;
    const maxHealthyKg = 24.9 * meters * meters;

    let category = 'Normal Weight';
    let statusAdvice = 'Within the WHO healthy adult BMI range (18.5 – 24.9).';

    if (bmi < 16.0) {
      category = 'Severe Thinness (Underweight)';
    } else if (bmi < 17.0) {
      category = 'Moderate Thinness (Underweight)';
    } else if (bmi < 18.5) {
      category = 'Mild Thinness (Underweight)';
    } else if (bmi < 25.0) {
      category = 'Normal Weight';
    } else if (bmi < 30.0) {
      category = 'Overweight (Pre-Obese)';
    } else if (bmi < 35.0) {
      category = 'Obesity Class I';
    } else if (bmi < 40.0) {
      category = 'Obesity Class II';
    } else {
      category = 'Obesity Class III';
    }

    if (kg < minHealthyKg) {
      const diffKg = minHealthyKg - kg;
      const diffDisplay =
        unit === 'metric'
          ? `${formatNumber(diffKg, 1)} kg`
          : `${formatNumber(diffKg / 0.45359237, 1)} lbs`;
      statusAdvice = `Gain approx. ${diffDisplay} to reach a BMI of 18.5.`;
    } else if (kg > maxHealthyKg) {
      const diffKg = kg - maxHealthyKg;
      const diffDisplay =
        unit === 'metric'
          ? `${formatNumber(diffKg, 1)} kg`
          : `${formatNumber(diffKg / 0.45359237, 1)} lbs`;
      statusAdvice = `Lose approx. ${diffDisplay} to reach a BMI of 24.9.`;
    }

    const healthyRangeDisplay =
      unit === 'metric'
        ? `${formatNumber(minHealthyKg, 1)} kg – ${formatNumber(maxHealthyKg, 1)} kg`
        : `${formatNumber(minHealthyKg / 0.45359237, 1)} lbs – ${formatNumber(maxHealthyKg / 0.45359237, 1)} lbs`;

    return {
      error: null,
      bmi,
      category,
      statusAdvice,
      healthyRangeDisplay,
      bmiPrime,
      ponderalIndex,
    };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const handleReset = () => {
    setWeightKg('70');
    setHeightCm('175');
    setWeightLbs('154');
    setHeightFt('5');
    setHeightIn('9');
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setUnit('metric')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            unit === 'metric'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Metric (kg / cm)
        </button>
        <button
          type="button"
          onClick={() => setUnit('imperial')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            unit === 'imperial'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Imperial (lbs / ft / in)
        </button>
      </div>

      {unit === 'metric' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="number"
            min="1"
            step="0.1"
            label="Weight (Kilograms)"
            suffixAddon="kg"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          <Input
            type="number"
            min="30"
            step="0.5"
            label="Height (Centimeters)"
            suffixAddon="cm"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            type="number"
            min="1"
            step="0.5"
            label="Weight (Pounds)"
            suffixAddon="lbs"
            value={weightLbs}
            onChange={(e) => setWeightLbs(e.target.value)}
          />
          <Input
            type="number"
            min="1"
            step="1"
            label="Height (Feet)"
            suffixAddon="ft"
            value={heightFt}
            onChange={(e) => setHeightFt(e.target.value)}
          />
          <Input
            type="number"
            min="0"
            max="11.9"
            step="0.5"
            label="Height (Inches)"
            suffixAddon="in"
            value={heightIn}
            onChange={(e) => setHeightIn(e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <ResetButton onReset={handleReset} />
        {!result.error && (
          <CopyButton
            text={`BMI: ${formatNumber(result.bmi ?? 0, 1)} kg/m² (${result.category}) | Healthy Weight Range: ${result.healthyRangeDisplay}`}
            label="Copy Result"
            size="md"
          />
        )}
      </div>

      {result.error ? (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300"
        >
          {result.error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultBox
              highlight
              label="Your BMI Score"
              value={`${formatNumber(result.bmi ?? 0, 2)} kg/m²`}
              sublabel={result.statusAdvice}
              copyText={formatNumber(result.bmi ?? 0, 2)}
            />
            <ResultBox
              highlight
              label="WHO Classification"
              value={result.category ?? ''}
              sublabel={`Healthy BMI target: 18.5 – 24.9 kg/m²`}
              copyText={result.category}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox
              label="Healthy Weight Range"
              value={result.healthyRangeDisplay ?? ''}
              sublabel="For your exact height"
              copyText={result.healthyRangeDisplay}
            />
            <ResultBox
              label="BMI Prime"
              value={formatNumber(result.bmiPrime ?? 0, 2)}
              sublabel="Ratio to 25.0 upper normal limit"
              copyText={formatNumber(result.bmiPrime ?? 0, 2)}
            />
            <ResultBox
              label="Ponderal Index"
              value={`${formatNumber(result.ponderalIndex ?? 0, 2)} kg/m³`}
              sublabel="3D stature-adjusted index"
              copyText={formatNumber(result.ponderalIndex ?? 0, 2)}
            />
          </div>

          {/* WHO Reference Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">WHO BMI Category</th>
                  <th className="py-2.5 px-4 font-semibold text-right">BMI Range (kg/m²)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">BMI Prime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="py-2 px-4">Underweight</td>
                  <td className="py-2 px-4 text-right font-mono">&lt; 18.5</td>
                  <td className="py-2 px-4 text-right font-mono">&lt; 0.74</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-emerald-700 dark:text-emerald-400">Normal Weight</td>
                  <td className="py-2 px-4 text-right font-mono">18.5 – 24.9</td>
                  <td className="py-2 px-4 text-right font-mono">0.74 – 1.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Overweight</td>
                  <td className="py-2 px-4 text-right font-mono">25.0 – 29.9</td>
                  <td className="py-2 px-4 text-right font-mono">1.00 – 1.20</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Obesity Class I</td>
                  <td className="py-2 px-4 text-right font-mono">30.0 – 34.9</td>
                  <td className="py-2 px-4 text-right font-mono">1.20 – 1.40</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Obesity Class II / III</td>
                  <td className="py-2 px-4 text-right font-mono">≥ 35.0</td>
                  <td className="py-2 px-4 text-right font-mono">≥ 1.40</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;
