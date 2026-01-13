import React from 'react';
import styles from './Combobox.module.css';
import { cn } from '@/lib/utils';

export interface ComboboxProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'value' | 'placeholder';
  children?: React.ReactNode;
}

export function Combobox({
  variant,
  className,
  children,
  ...props
}: ComboboxProps) {
  return (
    <div className={styles.comboboxWrapper}>
      <div
        className={cn(
          styles.combobox,
          variant && styles.value,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
