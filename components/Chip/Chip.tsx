import React from 'react';
import styles from './Chip.module.css';
import { cn } from '@/lib/utils';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

export function Chip({
  selected = false,
  className,
  children,
  disabled,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        styles.chip,
        selected ? styles.selected : styles.unselected,
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      aria-pressed={selected}
      {...props}
    >
      {children}
    </button>
  );
}
