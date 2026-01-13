import React from 'react';
import styles from './Datepicker.module.css';
import { cn } from '@/lib/utils';

export interface DatepickerProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'value' | 'placeholder';
  children?: React.ReactNode;
}

export function Datepicker({
  variant,
  className,
  children,
  ...props
}: DatepickerProps) {
  return (
    <div className={styles.datepickerWrapper}>
      <div
        className={cn(
          styles.datepicker,
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
