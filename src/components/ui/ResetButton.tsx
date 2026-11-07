import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ResetButtonProps {
  onReset: () => void;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  label = 'Reset',
  size = 'md',
  className = '',
}) => {
  return (
    <Button variant="outline" size={size} onClick={onReset} className={className}>
      <RotateCcw className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
};
