import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '../ui/FileDropzone';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { Button } from '../ui/Button';
import { DownloadButton } from '../ui/DownloadButton';
import { ResetButton } from '../ui/ResetButton';
import { formatNumber } from '../../lib/querySync';

function loadImageElement(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image file.'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export failed.'));
      },
      mimeType,
      quality
    );
  });
}

// 1. Image Compressor & KB Size Converter
export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'target-kb' | 'manual'>('target-kb');
  const [targetKb, setTargetKb] = useState('50');
  const [quality, setQuality] = useState('75');
  const [maxWidth, setMaxWidth] = useState('1920');
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [calculatedQuality, setCalculatedQuality] = useState<number | null>(null);

  const KB_PRESETS = [20, 50, 100, 200, 500];

  const compressWithLibraryToTargetKb = async (
    inputFile: File,
    targetKbNum: number,
    fmt: 'image/jpeg' | 'image/webp',
    maxWNum: number
  ): Promise<{ blob: Blob; finalQuality: number }> => {
    const targetBytes = targetKbNum * 1024;
    const targetSizeMB = targetKbNum / 1024;

    try {
      // Step 1: Use browser-image-compression with maxSizeMB and maxWidthOrHeight
      const options = {
        maxSizeMB: targetSizeMB,
        maxWidthOrHeight: maxWNum,
        useWebWorker: true,
        fileType: fmt,
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(inputFile, options);

      // If the result fits right under target size, check if we can fine-tune quality closer to target
      if (compressedFile.size <= targetBytes && compressedFile.size >= targetBytes * 0.75) {
        return {
          blob: compressedFile,
          finalQuality: Math.round((compressedFile.size / targetBytes) * 100),
        };
      }

      // Step 2: Binary search on canvas quality using browser-image-compression to get as close as possible
      const img = await loadImageElement(compressedFile.size <= targetBytes ? compressedFile : inputFile);
      const maxW = Math.min(img.width, maxWNum);
      const scale = img.width > maxW ? maxW / img.width : 1;
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      let low = 0.05;
      let high = 0.98;
      let bestBlob: Blob = compressedFile;
      let bestQuality = 0.75;

      for (let i = 0; i < 6; i++) {
        const mid = (low + high) / 2;
        const candidate = await canvasToBlob(canvas, fmt, mid);
        if (candidate.size <= targetBytes) {
          bestBlob = candidate;
          bestQuality = mid;
          low = mid; // Try higher quality
        } else {
          high = mid; // Step down quality
        }
      }

      // If extreme low target (e.g. 20 KB) is still exceeded, downscale canvas dimensions proportionally
      if (bestBlob.size > targetBytes && canvas.width > 240) {
        const dimScale = Math.max(0.3, Math.min(0.85, Math.sqrt(targetBytes / bestBlob.size)));
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = Math.round(w * dimScale);
        finalCanvas.height = Math.round(h * dimScale);
        const fctx = finalCanvas.getContext('2d')!;
        fctx.fillStyle = '#FFFFFF';
        fctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        fctx.drawImage(img, 0, 0, finalCanvas.width, finalCanvas.height);
        bestBlob = await canvasToBlob(finalCanvas, fmt, 0.65);
        bestQuality = 0.65;
      }

      return { blob: bestBlob, finalQuality: Math.round(bestQuality * 100) };
    } catch {
      // Fallback to canvas iterative compression if worker fails in restricted sandboxes
      const img = await loadImageElement(inputFile);
      const scale = img.width > maxWNum ? maxWNum / img.width : 1;
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      let low = 0.05;
      let high = 0.98;
      let bestBlob = await canvasToBlob(canvas, fmt, 0.5);
      let bestQuality = 0.5;

      for (let i = 0; i < 6; i++) {
        const mid = (low + high) / 2;
        const candidate = await canvasToBlob(canvas, fmt, mid);
        if (candidate.size <= targetBytes) {
          bestBlob = candidate;
          bestQuality = mid;
          low = mid;
        } else {
          high = mid;
        }
      }
      return { blob: bestBlob, finalQuality: Math.round(bestQuality * 100) };
    }
  };

  const runCompression = async (
    targetFile: File,
    currentMode: 'target-kb' | 'manual',
    targetKbStr: string,
    qStr: string,
    maxWStr: string,
    fmt: 'image/jpeg' | 'image/webp'
  ) => {
    setBusy(true);
    try {
      const maxWNum = Math.max(100, parseInt(maxWStr, 10) || 1920);

      if (currentMode === 'target-kb') {
        const targetKbNum = Math.max(5, parseInt(targetKbStr, 10) || 50);
        const res = await compressWithLibraryToTargetKb(targetFile, targetKbNum, fmt, maxWNum);
        setOutputBlob(res.blob);
        setCalculatedQuality(res.finalQuality);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(res.blob));
      } else {
        const img = await loadImageElement(targetFile);
        const scale = img.width > maxWNum ? maxWNum / img.width : 1;
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const q = Math.min(0.98, Math.max(0.1, (parseInt(qStr, 10) || 75) / 100));
        const blob = await canvasToBlob(canvas, fmt, q);
        setOutputBlob(blob);
        setCalculatedQuality(Math.round(q * 100));
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(blob));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleFile = (files: File[]) => {
    const f = files[0];
    setFile(f);
    runCompression(f, mode, targetKb, quality, maxWidth, format);
  };

  const ext = format === 'image/webp' ? 'webp' : 'jpg';
  const savedPct =
    file && outputBlob ? ((file.size - outputBlob.size) / file.size) * 100 : 0;

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        onFilesSelected={handleFile}
        label="Drop an image (JPG, PNG, WebP) to convert to exact KB or compress"
      />

      {file && (
        <div className="space-y-5">
          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Compression Mode:
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-900 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('target-kb');
                  runCompression(file, 'target-kb', targetKb, quality, maxWidth, format);
                }}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  mode === 'target-kb'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Exact Target KB (e.g. 20KB, 50KB, 100KB)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('manual');
                  runCompression(file, 'manual', targetKb, quality, maxWidth, format);
                }}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  mode === 'manual'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Manual Quality Slider %
              </button>
            </div>
          </div>

          {/* Target KB Mode Controls */}
          {mode === 'target-kb' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  type="number"
                  min="5"
                  max="10000"
                  label="Enter Target Max Size (KB)"
                  suffixAddon="KB"
                  value={targetKb}
                  helperText="Common portal limits: 20KB, 50KB, 100KB, 200KB"
                  onChange={(e) => {
                    setTargetKb(e.target.value);
                    runCompression(file, 'target-kb', e.target.value, quality, maxWidth, format);
                  }}
                />
                <Input
                  type="number"
                  min="200"
                  max="8000"
                  label="Max Width Constraint"
                  suffixAddon="px"
                  value={maxWidth}
                  onChange={(e) => {
                    setMaxWidth(e.target.value);
                    runCompression(file, 'target-kb', targetKb, quality, e.target.value, format);
                  }}
                />
                <Select
                  label="Output Format"
                  value={format}
                  onChange={(e) => {
                    const nextFmt = e.target.value as 'image/jpeg' | 'image/webp';
                    setFormat(nextFmt);
                    runCompression(file, 'target-kb', targetKb, quality, maxWidth, nextFmt);
                  }}
                  options={[
                    { value: 'image/jpeg', label: 'JPEG (Standard for Gov/Job portals)' },
                    { value: 'image/webp', label: 'WebP (Smallest file size for web)' },
                  ]}
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">
                  Quick KB Presets:
                </span>
                {KB_PRESETS.map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => {
                      setTargetKb(String(kb));
                      runCompression(file, 'target-kb', String(kb), quality, maxWidth, format);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      targetKb === String(kb)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    Under {kb} KB
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                type="number"
                min="10"
                max="98"
                label="Compression Quality (10–98%)"
                suffixAddon="%"
                value={quality}
                onChange={(e) => {
                  setQuality(e.target.value);
                  runCompression(file, 'manual', targetKb, e.target.value, maxWidth, format);
                }}
              />
              <Input
                type="number"
                min="200"
                max="8000"
                label="Max Width Limit (px)"
                suffixAddon="px"
                value={maxWidth}
                onChange={(e) => {
                  setMaxWidth(e.target.value);
                  runCompression(file, 'manual', targetKb, quality, e.target.value, format);
                }}
              />
              <Select
                label="Output Format"
                value={format}
                onChange={(e) => {
                  const nextFmt = e.target.value as 'image/jpeg' | 'image/webp';
                  setFormat(nextFmt);
                  runCompression(file, 'manual', targetKb, quality, maxWidth, nextFmt);
                }}
                options={[
                  { value: 'image/jpeg', label: 'JPEG (Universal)' },
                  { value: 'image/webp', label: 'WebP (Smallest Size)' },
                ]}
              />
            </div>
          )}

          {/* Results Summary & Indicators */}
          {outputBlob && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <ResultBox
                  label="Original File Size"
                  value={`${formatNumber(file.size / 1024, 1)} KB`}
                />
                <ResultBox
                  highlight
                  label="Converted File Size"
                  value={`${formatNumber(outputBlob.size / 1024, 1)} KB`}
                  sublabel={
                    mode === 'target-kb' && outputBlob.size / 1024 <= Number(targetKb)
                      ? `✓ Fits under ${targetKb} KB limit`
                      : undefined
                  }
                />
                <ResultBox
                  label="Size Reduction"
                  value={`${savedPct > 0 ? '−' : '+'}${formatNumber(Math.abs(savedPct), 1)}%`}
                />
                <ResultBox
                  label="Optimized Quality"
                  value={`${calculatedQuality ?? quality}%`}
                  sublabel="Auto-tuned via binary search"
                />
              </div>

              {previewUrl && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <img
                    src={previewUrl}
                    alt="Compressed image preview"
                    referrerPolicy="no-referrer"
                    className="max-h-72 rounded-lg object-contain shadow-xs border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <ResetButton
                      onReset={() => {
                        setFile(null);
                        setOutputBlob(null);
                      }}
                      size="sm"
                    />
                    <DownloadButton
                      variant="primary"
                      size="md"
                      content={outputBlob}
                      filename={`${file.name.replace(/\.[^.]+$/, '')}-${Math.round(outputBlob.size / 1024)}kb.${ext}`}
                      label={busy ? 'Processing...' : `Download ${formatNumber(outputBlob.size / 1024, 1)} KB .${ext.toUpperCase()}`}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// 2. Image Resizer
export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [origDim, setOrigDim] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [lockAspect, setLockAspect] = useState(true);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);

  const resizeNow = async (f: File, targetW: number, targetH: number) => {
    const img = await loadImageElement(f);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(targetW));
    canvas.height = Math.max(1, Math.round(targetH));
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToBlob(canvas, 'image/png');
    setOutputBlob(blob);
  };

  const handleFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    const img = await loadImageElement(f);
    setOrigDim({ w: img.width, h: img.height });
    setWidth(String(img.width));
    setHeight(String(img.height));
    resizeNow(f, img.width, img.height);
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/*"
        onFilesSelected={handleFile}
        label="Select an image to resize to exact pixel dimensions"
      />

      {file && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              min="1"
              max="8000"
              label={`Target Width (Original: ${origDim.w}px)`}
              suffixAddon="px"
              value={width}
              onChange={(e) => {
                const w = parseInt(e.target.value, 10) || 1;
                setWidth(e.target.value);
                const h =
                  lockAspect && origDim.w > 0
                    ? Math.round((w * origDim.h) / origDim.w)
                    : parseInt(height, 10) || 1;
                if (lockAspect) setHeight(String(h));
                resizeNow(file, w, h);
              }}
            />
            <Input
              type="number"
              min="1"
              max="8000"
              label={`Target Height (Original: ${origDim.h}px)`}
              suffixAddon="px"
              value={height}
              onChange={(e) => {
                const h = parseInt(e.target.value, 10) || 1;
                setHeight(e.target.value);
                const w =
                  lockAspect && origDim.h > 0
                    ? Math.round((h * origDim.w) / origDim.h)
                    : parseInt(width, 10) || 1;
                if (lockAspect) setWidth(String(w));
                resizeNow(file, w, h);
              }}
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
            />
            <span>Lock Aspect Ratio</span>
          </label>

          {outputBlob && (
            <div className="flex items-center justify-between pt-2">
              <ResetButton onReset={() => setFile(null)} size="sm" />
              <DownloadButton
                variant="primary"
                size="md"
                content={outputBlob}
                filename={`resized-${width}x${height}-${file.name.replace(/\.[^.]+$/, '')}.png`}
                label={`Download Resized Image (${width}×${height})`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 3. Image Cropper
export const ImageCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [origDim, setOrigDim] = useState({ w: 0, h: 0 });
  const [cropX, setCropX] = useState('0');
  const [cropY, setCropY] = useState('0');
  const [cropW, setCropW] = useState('400');
  const [cropH, setCropH] = useState('400');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const performCrop = async (f: File, x: number, y: number, w: number, h: number) => {
    const img = await loadImageElement(f);
    const safeX = Math.max(0, Math.min(x, img.width - 1));
    const safeY = Math.max(0, Math.min(y, img.height - 1));
    const safeW = Math.max(1, Math.min(w, img.width - safeX));
    const safeH = Math.max(1, Math.min(h, img.height - safeY));

    const canvas = document.createElement('canvas');
    canvas.width = safeW;
    canvas.height = safeH;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, safeX, safeY, safeW, safeH, 0, 0, safeW, safeH);
    const blob = await canvasToBlob(canvas, 'image/png');
    setOutputBlob(blob);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const handleFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    const img = await loadImageElement(f);
    setOrigDim({ w: img.width, h: img.height });
    const size = Math.min(img.width, img.height);
    const startX = Math.floor((img.width - size) / 2);
    const startY = Math.floor((img.height - size) / 2);
    setCropX(String(startX));
    setCropY(String(startY));
    setCropW(String(size));
    setCropH(String(size));
    performCrop(f, startX, startY, size, size);
  };

  const applyPresetRatio = (ratioW: number, ratioH: number) => {
    if (!file || origDim.w === 0) return;
    let w = origDim.w;
    let h = Math.round((w * ratioH) / ratioW);
    if (h > origDim.h) {
      h = origDim.h;
      w = Math.round((h * ratioW) / ratioH);
    }
    const x = Math.floor((origDim.w - w) / 2);
    const y = Math.floor((origDim.h - h) / 2);
    setCropX(String(x));
    setCropY(String(y));
    setCropW(String(w));
    setCropH(String(h));
    performCrop(file, x, y, w, h);
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/*"
        onFilesSelected={handleFile}
        label="Select an image to crop locally"
      />

      {file && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => applyPresetRatio(1, 1)}>
              1:1 Square
            </Button>
            <Button variant="secondary" size="sm" onClick={() => applyPresetRatio(16, 9)}>
              16:9 Widescreen
            </Button>
            <Button variant="secondary" size="sm" onClick={() => applyPresetRatio(4, 3)}>
              4:3 Standard
            </Button>
            <Button variant="secondary" size="sm" onClick={() => applyPresetRatio(9, 16)}>
              9:16 Vertical
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              type="number"
              min="0"
              label="Offset X (px)"
              value={cropX}
              onChange={(e) => {
                setCropX(e.target.value);
                performCrop(file, Number(e.target.value), Number(cropY), Number(cropW), Number(cropH));
              }}
            />
            <Input
              type="number"
              min="0"
              label="Offset Y (px)"
              value={cropY}
              onChange={(e) => {
                setCropY(e.target.value);
                performCrop(file, Number(cropX), Number(e.target.value), Number(cropW), Number(cropH));
              }}
            />
            <Input
              type="number"
              min="1"
              label="Crop Width (px)"
              value={cropW}
              onChange={(e) => {
                setCropW(e.target.value);
                performCrop(file, Number(cropX), Number(cropY), Number(e.target.value), Number(cropH));
              }}
            />
            <Input
              type="number"
              min="1"
              label="Crop Height (px)"
              value={cropH}
              onChange={(e) => {
                setCropH(e.target.value);
                performCrop(file, Number(cropX), Number(cropY), Number(cropW), Number(e.target.value));
              }}
            />
          </div>

          {previewUrl && outputBlob && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
              <img
                src={previewUrl}
                alt="Cropped output preview"
                referrerPolicy="no-referrer"
                className="max-h-72 rounded-lg object-contain"
              />
              <DownloadButton
                variant="primary"
                size="md"
                content={outputBlob}
                filename={`cropped-${file.name.replace(/\.[^.]+$/, '')}.png`}
                label="Download Cropped Image"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Shared Format Converter Engine for JPG/PNG/WebP
const FormatConverterEngine: React.FC<{
  targetMime: 'image/png' | 'image/jpeg' | 'image/webp';
  targetExt: string;
  acceptHint: string;
}> = ({ targetMime, targetExt, acceptHint }) => {
  const [file, setFile] = useState<File | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    const img = await loadImageElement(f);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, targetMime, 0.92);
    setOutputBlob(blob);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/*"
        onFilesSelected={handleFile}
        label={`Drop your ${acceptHint} image to convert to ${targetExt.toUpperCase()} locally`}
      />

      {file && outputBlob && previewUrl && (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
          <img
            src={previewUrl}
            alt="Converted image preview"
            referrerPolicy="no-referrer"
            className="max-h-72 rounded-lg object-contain"
          />
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Converted Size: {formatNumber(outputBlob.size / 1024, 1)} KB
          </p>
          <div className="flex gap-3">
            <ResetButton onReset={() => setFile(null)} size="sm" />
            <DownloadButton
              variant="primary"
              size="md"
              content={outputBlob}
              filename={`${file.name.replace(/\.[^.]+$/, '')}.${targetExt}`}
              label={`Download .${targetExt.toUpperCase()}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const JpgToPng: React.FC = () => (
  <FormatConverterEngine targetMime="image/png" targetExt="png" acceptHint="JPG / JPEG" />
);

export const PngToJpg: React.FC = () => (
  <FormatConverterEngine targetMime="image/jpeg" targetExt="jpg" acceptHint="PNG" />
);

export const PngToWebp: React.FC = () => (
  <FormatConverterEngine targetMime="image/webp" targetExt="webp" acceptHint="PNG" />
);

export const WebpToJpg: React.FC = () => (
  <FormatConverterEngine targetMime="image/jpeg" targetExt="jpg" acceptHint="WebP" />
);

// 8. Image to PDF
export const ImageToPdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);

  const buildPdf = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    setBusy(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const f of selectedFiles) {
        const img = await loadImageElement(f);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpgBlob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
        const bytes = await jpgBlob.arrayBuffer();
        const embedded = await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: embedded.width,
          height: embedded.height,
        });
      }
      const pdfBytes = await pdfDoc.save();
      setPdfBlob(new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        multiple
        onFilesSelected={(selected) => {
          setFiles(selected);
          buildPdf(selected);
        }}
        label="Select one or more images (JPG, PNG, WebP) to combine into a PDF"
      />

      {files.length > 0 && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {files.length} image(s) queued for PDF generation.
          </p>
          {pdfBlob && (
            <div className="flex items-center justify-between">
              <ResetButton
                onReset={() => {
                  setFiles([]);
                  setPdfBlob(null);
                }}
                size="sm"
              />
              <DownloadButton
                variant="primary"
                size="md"
                content={pdfBlob}
                filename="usekit-images-to-pdf.pdf"
                mimeType="application/pdf"
                label={busy ? 'Generating PDF...' : 'Download Generated PDF'}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 9. Image Rotator
export const ImageRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const renderRotation = async (f: File, deg: number) => {
    const img = await loadImageElement(f);
    const rad = (deg * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const newW = Math.round(img.width * cos + img.height * sin);
    const newH = Math.round(img.width * sin + img.height * cos);

    const canvas = document.createElement('canvas');
    canvas.width = newW;
    canvas.height = newH;
    const ctx = canvas.getContext('2d')!;
    ctx.translate(newW / 2, newH / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    const blob = await canvasToBlob(canvas, 'image/png');
    setOutputBlob(blob);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/*"
        onFilesSelected={(files) => {
          setFile(files[0]);
          renderRotation(files[0], angle);
        }}
        label="Select an image to rotate by 90°, 180°, or 270°"
      />

      {file && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[90, 180, 270, 0].map((deg) => (
              <Button
                key={deg}
                variant={angle === deg ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setAngle(deg);
                  renderRotation(file, deg);
                }}
              >
                Rotate {deg}°
              </Button>
            ))}
          </div>

          {previewUrl && outputBlob && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
              <img
                src={previewUrl}
                alt="Rotated preview"
                referrerPolicy="no-referrer"
                className="max-h-72 rounded-lg object-contain"
              />
              <DownloadButton
                variant="primary"
                size="md"
                content={outputBlob}
                filename={`rotated-${angle}-${file.name.replace(/\.[^.]+$/, '')}.png`}
                label="Download Rotated Image"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 10. Image Flipper
export const ImageFlipper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [flipH, setFlipH] = useState(true);
  const [flipV, setFlipV] = useState(false);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const renderFlip = async (f: File, h: boolean, v: boolean) => {
    const img = await loadImageElement(f);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.translate(h ? canvas.width : 0, v ? canvas.height : 0);
    ctx.scale(h ? -1 : 1, v ? -1 : 1);
    ctx.drawImage(img, 0, 0);

    const blob = await canvasToBlob(canvas, 'image/png');
    setOutputBlob(blob);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/*"
        onFilesSelected={(files) => {
          setFile(files[0]);
          renderFlip(files[0], flipH, flipV);
        }}
        label="Select an image to mirror horizontally or vertically"
      />

      {file && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={flipH ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                const next = !flipH;
                setFlipH(next);
                renderFlip(file, next, flipV);
              }}
            >
              Flip Horizontally (Mirror)
            </Button>
            <Button
              variant={flipV ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                const next = !flipV;
                setFlipV(next);
                renderFlip(file, flipH, next);
              }}
            >
              Flip Vertically
            </Button>
          </div>

          {previewUrl && outputBlob && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
              <img
                src={previewUrl}
                alt="Flipped preview"
                referrerPolicy="no-referrer"
                className="max-h-72 rounded-lg object-contain"
              />
              <DownloadButton
                variant="primary"
                size="md"
                content={outputBlob}
                filename={`flipped-${file.name.replace(/\.[^.]+$/, '')}.png`}
                label="Download Flipped Image"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
