import React, { useRef, useState } from 'react';
import { UploadCloud, ShieldCheck, AlertCircle } from 'lucide-react';

export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  label?: string;
  description?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept,
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  label = 'Drop files here or click to browse',
  description = 'Supports local browser processing',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndPassFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const maxBytes = maxSizeMB * 1024 * 1024;
    const validFiles: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (f.size > maxBytes) {
        setError(`"${f.name}" exceeds the ${maxSizeMB} MB browser memory limit. Please select a smaller file.`);
        return;
      }
      validFiles.push(f);
    }

    onFilesSelected(multiple ? validFiles : [validFiles[0]]);
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndPassFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer text-center ${
          isDragging
            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <UploadCloud className="w-9 h-9 text-blue-600 dark:text-blue-400 mb-3" />
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {description} · Max {maxSizeMB} MB
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Your files never leave your device — 100% browser processing</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => validateAndPassFiles(e.target.files)}
          className="hidden"
        />
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
