import React from 'react';
import styles from './Field.module.css';
import { cn } from '@/lib/utils';

export interface FieldProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'width' | 'status' | 'enabled' | 'error' | 'required';
  children?: React.ReactNode;
}

export function Field({
  variant?,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div
      className={cn(
        styles.field,
        variant && styles.width,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
