import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { Button } from '../ui/Button';
import { ResetButton } from '../ui/ResetButton';
import { getQueryParam, syncQueryParams, formatNumber } from '../../lib/querySync';

type UnitDomain = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';

interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (base: number) => number;
}

const UNIT_DOMAINS: Record<UnitDomain, { label: string; units: UnitDef[] }> = {
  length: {
    label: 'Length',
    units: [
      { id: 'mm', label: 'Millimeter (mm)', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'cm', label: 'Centimeter (cm)', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01 },
      { id: 'm', label: 'Meter (m)', symbol: 'm', toBase: (v) => v, fromBase: (b) => b },
      { id: 'km', label: 'Kilometer (km)', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'in', label: 'Inch (in)', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254 },
      { id: 'ft', label: 'Foot (ft)', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
      { id: 'yd', label: 'Yard (yd)', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144 },
      { id: 'mi', label: 'Mile (mi)', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344 },
      { id: 'nmi', label: 'Nautical Mile (nmi)', symbol: 'nmi', toBase: (v) => v * 1852, fromBase: (b) => b / 1852 },
    ],
  },
  weight: {
    label: 'Weight & Mass',
    units: [
      { id: 'mg', label: 'Milligram (mg)', symbol: 'mg', toBase: (v) => v * 0.000001, fromBase: (b) => b / 0.000001 },
      { id: 'g', label: 'Gram (g)', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'kg', label: 'Kilogram (kg)', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b },
      { id: 't', label: 'Metric Ton (t)', symbol: 't', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'oz', label: 'Ounce (oz)', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (b) => b / 0.028349523125 },
      { id: 'lb', label: 'Pound (lb)', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237 },
      { id: 'st', label: 'Stone (st)', symbol: 'st', toBase: (v) => v * 6.35029318, fromBase: (b) => b / 6.35029318 },
    ],
  },
  temperature: {
    label: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius (°C)', symbol: '°C', toBase: (v) => v, fromBase: (b) => b },
      { id: 'f', label: 'Fahrenheit (°F)', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (b) => (b * 9) / 5 + 32 },
      { id: 'k', label: 'Kelvin (K)', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (b) => b + 273.15 },
    ],
  },
  area: {
    label: 'Area',
    units: [
      { id: 'sqm', label: 'Square Meter (m²)', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b },
      { id: 'sqkm', label: 'Square Kilometer (km²)', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (b) => b / 1000000 },
      { id: 'sqft', label: 'Square Foot (ft²)', symbol: 'ft²', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304 },
      { id: 'sqyd', label: 'Square Yard (yd²)', symbol: 'yd²', toBase: (v) => v * 0.83612736, fromBase: (b) => b / 0.83612736 },
      { id: 'acre', label: 'Acre (ac)', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224 },
      { id: 'ha', label: 'Hectare (ha)', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000 },
    ],
  },
  volume: {
    label: 'Volume',
    units: [
      { id: 'ml', label: 'Milliliter (mL)', symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'l', label: 'Liter (L)', symbol: 'L', toBase: (v) => v, fromBase: (b) => b },
      { id: 'm3', label: 'Cubic Meter (m³)', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'tsp', label: 'US Teaspoon (tsp)', symbol: 'tsp', toBase: (v) => v * 0.00492892159, fromBase: (b) => b / 0.00492892159 },
      { id: 'tbsp', label: 'US Tablespoon (tbsp)', symbol: 'tbsp', toBase: (v) => v * 0.0147867648, fromBase: (b) => b / 0.0147867648 },
      { id: 'floz', label: 'US Fluid Ounce (fl oz)', symbol: 'fl oz', toBase: (v) => v * 0.0295735296, fromBase: (b) => b / 0.0295735296 },
      { id: 'cup', label: 'US Cup', symbol: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (b) => b / 0.2365882365 },
      { id: 'pt', label: 'US Pint (pt)', symbol: 'pt', toBase: (v) => v * 0.473176473, fromBase: (b) => b / 0.473176473 },
      { id: 'qt', label: 'US Quart (qt)', symbol: 'qt', toBase: (v) => v * 0.946352946, fromBase: (b) => b / 0.946352946 },
      { id: 'gal', label: 'US Gallon (gal)', symbol: 'gal', toBase: (v) => v * 3.785411784, fromBase: (b) => b / 3.785411784 },
    ],
  },
  speed: {
    label: 'Speed',
    units: [
      { id: 'ms', label: 'Meters per second (m/s)', symbol: 'm/s', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kmh', label: 'Kilometers per hour (km/h)', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (b) => b * 3.6 },
      { id: 'mph', label: 'Miles per hour (mph)', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (b) => b / 0.44704 },
      { id: 'kn', label: 'Knot (kn)', symbol: 'kn', toBase: (v) => v * 0.514444444, fromBase: (b) => b / 0.514444444 },
    ],
  },
  data: {
    label: 'Digital Data',
    units: [
      { id: 'b', label: 'Byte (B)', symbol: 'B', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kb', label: 'Kilobyte (KB — 1,024 B)', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (b) => b / 1024 },
      { id: 'mb', label: 'Megabyte (MB — 1,024 KB)', symbol: 'MB', toBase: (v) => v * Math.pow(1024, 2), fromBase: (b) => b / Math.pow(1024, 2) },
      { id: 'gb', label: 'Gigabyte (GB — 1,024 MB)', symbol: 'GB', toBase: (v) => v * Math.pow(1024, 3), fromBase: (b) => b / Math.pow(1024, 3) },
      { id: 'tb', label: 'Terabyte (TB — 1,024 GB)', symbol: 'TB', toBase: (v) => v * Math.pow(1024, 4), fromBase: (b) => b / Math.pow(1024, 4) },
      { id: 'pb', label: 'Petabyte (PB — 1,024 TB)', symbol: 'PB', toBase: (v) => v * Math.pow(1024, 5), fromBase: (b) => b / Math.pow(1024, 5) },
    ],
  },
};

export const UnitConverter: React.FC = () => {
  const [domain, setDomain] = useState<UnitDomain>(() => {
    const d = getQueryParam('type', 'length') as UnitDomain;
    return d in UNIT_DOMAINS ? d : 'length';
  });
  const [inputValue, setInputValue] = useState(() => getQueryParam('val', '10'));
  const [fromUnit, setFromUnit] = useState(() => getQueryParam('from', 'm'));
  const [toUnit, setToUnit] = useState(() => getQueryParam('to', 'ft'));

  const activeUnits = UNIT_DOMAINS[domain].units;

  const handleDomainChange = (newDomain: UnitDomain) => {
    setDomain(newDomain);
    const units = UNIT_DOMAINS[newDomain].units;
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id || units[0].id);
  };

  useEffect(() => {
    syncQueryParams({ type: domain, val: inputValue, from: fromUnit, to: toUnit });
  }, [domain, inputValue, fromUnit, toUnit]);

  const calc = useMemo(() => {
    const num = parseFloat(inputValue);
    if (!Number.isFinite(num)) {
      return { error: 'Please enter a valid number to convert.' };
    }

    const fromDef = activeUnits.find((u) => u.id === fromUnit) || activeUnits[0];
    const toDef = activeUnits.find((u) => u.id === toUnit) || activeUnits[1] || activeUnits[0];

    const baseVal = fromDef.toBase(num);
    const converted = toDef.fromBase(baseVal);

    const allEquivalents = activeUnits.map((u) => ({
      id: u.id,
      label: u.label,
      symbol: u.symbol,
      value: u.fromBase(baseVal),
    }));

    return {
      error: null,
      num,
      fromDef,
      toDef,
      converted,
      allEquivalents,
    };
  }, [inputValue, fromUnit, toUnit, activeUnits]);

  const handleSwap = () => {
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
  };

  return (
    <div className="space-y-6">
      {/* Domain Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {(Object.keys(UNIT_DOMAINS) as UnitDomain[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handleDomainChange(d)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              domain === d
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {UNIT_DOMAINS[d].label}
          </button>
        ))}
      </div>

      {/* Converter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
        <div className="md:col-span-3">
          <Input
            type="number"
            step="any"
            label="Value to Convert"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            label="From Unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            options={activeUnits.map((u) => ({ value: u.id, label: u.label }))}
          />
        </div>
        <div className="md:col-span-1 flex justify-center">
          <Button
            variant="outline"
            size="md"
            onClick={handleSwap}
            aria-label="Swap units"
            title="Swap From and To units"
            className="w-full md:w-11"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="md:col-span-4">
          <Select
            label="To Unit"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            options={activeUnits.map((u) => ({ value: u.id, label: u.label }))}
          />
        </div>
      </div>

      <div className="flex justify-start">
        <ResetButton
          onReset={() => {
            setInputValue('10');
            handleDomainChange('length');
          }}
          size="sm"
        />
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
          <ResultBox
            highlight
            label={`${formatNumber(calc.num ?? 0, 6)} ${calc.fromDef?.symbol} equals`}
            value={`${formatNumber(calc.converted ?? 0, 6)} ${calc.toDef?.symbol}`}
            sublabel={`${calc.fromDef?.label} → ${calc.toDef?.label}`}
            copyText={formatNumber(calc.converted ?? 0, 6)}
          />

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">
                    All Equivalent {UNIT_DOMAINS[domain].label} Units
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-right">Converted Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {calc.allEquivalents?.map((eq) => (
                  <tr
                    key={eq.id}
                    className={
                      eq.id === toUnit ? 'bg-blue-50/50 dark:bg-blue-950/30 font-semibold' : ''
                    }
                  >
                    <td className="py-2 px-4 font-sans">{eq.label}</td>
                    <td className="py-2 px-4 text-right">
                      {formatNumber(eq.value, 6)} {eq.symbol}
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

export default UnitConverter;
