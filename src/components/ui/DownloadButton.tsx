import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';

export interface DownloadButtonProps {
  content: string | Blob;
  filename: string;
  mimeType?: string;
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'outline' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  mimeType = 'text/plain;charset=utf-8',
  label = 'Download',
  size = 'sm',
  variant = 'outline',
  className = '',
  disabled = false,
}) => {
  const handleDownload = () => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={disabled}
      className={className}
    >
      <Download className="w-3.5 h-3.5" />
      <span>{label}</span>
    </Button>
  );
};
