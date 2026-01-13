import React from 'react';
import styles from './Timepicker.module.css';
import { cn } from '@/lib/utils';

export interface TimepickerProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'value' | 'placeholder';
  children?: React.ReactNode;
}

export function Timepicker({
  variant?,
  className,
  children,
  ...props
}: TimepickerProps) {
  return (
    <div
      className={cn(
        styles.timepicker,
        variant && styles.value,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
