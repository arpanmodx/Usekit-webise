import React, { useState, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { CopyButton } from '../ui/CopyButton';
import { ResetButton } from '../ui/ResetButton';

function parseHexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// 1. Color Picker
export const ColorPickerTool: React.FC = () => {
  const [hex, setHex] = useState('#2563EB');

  const colorInfo = useMemo(() => {
    const rgb = parseHexToRgb(hex) || { r: 37, g: 99, b: 235 };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      hex: hex.toUpperCase(),
      rgbStr: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hslStr: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }, [hex]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
            Select Color Swatch
          </label>
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="w-full h-20 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-1 bg-white dark:bg-slate-900"
          />
        </div>
        <Input
          label="HEX Color Code"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultBox highlight label="HEX Value" value={colorInfo.hex} copyText={colorInfo.hex} />
        <ResultBox label="RGB CSS Value" value={colorInfo.rgbStr} copyText={colorInfo.rgbStr} />
        <ResultBox label="HSL CSS Value" value={colorInfo.hslStr} copyText={colorInfo.hslStr} />
      </div>
    </div>
  );
};

// 2. HEX to RGB
export const HexToRgb: React.FC = () => {
  const [hex, setHex] = useState('#0F172A');

  const parsed = useMemo(() => {
    const rgb = parseHexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      ...rgb,
      rgbCss: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgbaCss: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hslCss: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }, [hex]);

  return (
    <div className="space-y-6">
      <Input
        label="Enter 3-Digit or 6-Digit HEX Code"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        placeholder="#2563EB"
      />

      {!parsed ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          Please enter a valid 3-character or 6-character hexadecimal color string (e.g. #2563EB).
        </div>
      ) : (
        <div className="space-y-4">
          <div
            style={{ backgroundColor: parsed.rgbCss }}
            className="w-full h-16 rounded-xl border border-slate-200 dark:border-slate-700"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox highlight label="RGB CSS" value={parsed.rgbCss} copyText={parsed.rgbCss} />
            <ResultBox label="RGBA CSS" value={parsed.rgbaCss} copyText={parsed.rgbaCss} />
            <ResultBox label="HSL CSS" value={parsed.hslCss} copyText={parsed.hslCss} />
          </div>
        </div>
      )}
    </div>
  );
};

// 3. RGB to HEX
export const RgbToHex: React.FC = () => {
  const [r, setR] = useState('37');
  const [g, setG] = useState('99');
  const [b, setB] = useState('235');

  const res = useMemo(() => {
    const clamp = (v: string) => Math.min(255, Math.max(0, parseInt(v, 10) || 0));
    const rv = clamp(r);
    const gv = clamp(g);
    const bv = clamp(b);
    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    const hex = `#${toHex(rv)}${toHex(gv)}${toHex(bv)}`;
    return { hex, rgbCss: `rgb(${rv}, ${gv}, ${bv})` };
  }, [r, g, b]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="number"
          min="0"
          max="255"
          label="Red (0–255)"
          value={r}
          onChange={(e) => setR(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="255"
          label="Green (0–255)"
          value={g}
          onChange={(e) => setG(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="255"
          label="Blue (0–255)"
          value={b}
          onChange={(e) => setB(e.target.value)}
        />
      </div>

      <div
        style={{ backgroundColor: res.hex }}
        className="w-full h-16 rounded-xl border border-slate-200 dark:border-slate-700"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultBox highlight label="HEX Color Code" value={res.hex} copyText={res.hex} />
        <ResultBox label="RGB Declaration" value={res.rgbCss} copyText={res.rgbCss} />
      </div>
    </div>
  );
};

// 4. Gradient Generator
export const GradientGenerator: React.FC = () => {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState('135');
  const [color1, setColor1] = useState('#2563EB');
  const [color2, setColor2] = useState('#0F172A');

  const cssValue =
    type === 'linear'
      ? `linear-gradient(${angle || 135}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const fullCss = `background: ${cssValue};`;

  return (
    <div className="space-y-6">
      <div
        style={{ background: cssValue }}
        className="w-full h-40 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Select
          label="Gradient Type"
          value={type}
          onChange={(e) => setType(e.target.value as 'linear' | 'radial')}
          options={[
            { value: 'linear', label: 'Linear Gradient' },
            { value: 'radial', label: 'Radial Gradient' },
          ]}
        />
        <Input
          type="number"
          min="0"
          max="360"
          label="Angle (deg)"
          disabled={type === 'radial'}
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
        />
        <Input
          type="color"
          label="Start Color"
          value={color1}
          onChange={(e) => setColor1(e.target.value)}
        />
        <Input
          type="color"
          label="End Color"
          value={color2}
          onChange={(e) => setColor2(e.target.value)}
        />
      </div>

      <ResultBox highlight label="CSS Gradient Rule" value={fullCss} copyText={fullCss} />
    </div>
  );
};

// 5. Box Shadow Generator
export const BoxShadowGenerator: React.FC = () => {
  const [offsetX, setOffsetX] = useState('0');
  const [offsetY, setOffsetY] = useState('12');
  const [blur, setBlur] = useState('24');
  const [spread, setSpread] = useState('-4');
  const [opacity, setOpacity] = useState('0.15');
  const [inset, setInset] = useState(false);

  const shadowValue = `${inset ? 'inset ' : ''}${offsetX || 0}px ${offsetY || 0}px ${blur || 0}px ${
    spread || 0
  }px rgba(15, 23, 42, ${opacity || 0.15})`;
  const cssCode = `box-shadow: ${shadowValue};`;

  return (
    <div className="space-y-6">
      <div className="p-10 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
        <div
          style={{ boxShadow: shadowValue }}
          className="w-56 h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          Live Shadow Preview
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Input
          type="number"
          label="Offset X (px)"
          value={offsetX}
          onChange={(e) => setOffsetX(e.target.value)}
        />
        <Input
          type="number"
          label="Offset Y (px)"
          value={offsetY}
          onChange={(e) => setOffsetY(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          label="Blur (px)"
          value={blur}
          onChange={(e) => setBlur(e.target.value)}
        />
        <Input
          type="number"
          label="Spread (px)"
          value={spread}
          onChange={(e) => setSpread(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          max="1"
          step="0.05"
          label="Opacity (0–1)"
          value={opacity}
          onChange={(e) => setOpacity(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inset}
            onChange={(e) => setInset(e.target.checked)}
          />
          <span>Inset Shadow</span>
        </label>
        <CopyButton text={cssCode} label="Copy CSS Rule" size="sm" />
      </div>

      <ResultBox highlight label="Generated CSS" value={cssCode} copyText={cssCode} />
    </div>
  );
};

// 6. CSS Border Radius Generator
export const BorderRadiusGenerator: React.FC = () => {
  const [tl, setTl] = useState('16');
  const [tr, setTr] = useState('16');
  const [br, setBr] = useState('16');
  const [bl, setBl] = useState('16');

  const radiusValue = `${tl || 0}px ${tr || 0}px ${br || 0}px ${bl || 0}px`;
  const cssCode = `border-radius: ${radiusValue};`;

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
        <div
          style={{ borderRadius: radiusValue }}
          className="w-56 h-32 bg-blue-600 text-white flex items-center justify-center text-xs font-medium shadow-sm"
        >
          {radiusValue}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input
          type="number"
          min="0"
          label="Top-Left (px)"
          value={tl}
          onChange={(e) => setTl(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          label="Top-Right (px)"
          value={tr}
          onChange={(e) => setTr(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          label="Bottom-Right (px)"
          value={br}
          onChange={(e) => setBr(e.target.value)}
        />
        <Input
          type="number"
          min="0"
          label="Bottom-Left (px)"
          value={bl}
          onChange={(e) => setBl(e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <ResetButton
          onReset={() => {
            setTl('16');
            setTr('16');
            setBr('16');
            setBl('16');
          }}
          size="sm"
        />
        <CopyButton text={cssCode} label="Copy CSS" size="sm" />
      </div>

      <ResultBox highlight label="Generated CSS" value={cssCode} copyText={cssCode} />
    </div>
  );
};
