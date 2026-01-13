import React from 'react';
import styles from './Divider.module.css';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'horizontal' | 'border' | 'vertical';
  children?: React.ReactNode;
}

export function Divider({
  variant,
  className,
  children,
  ...props
}: DividerProps) {
  return (
    <div
      className={cn(
        styles.divider,
        variant && styles.horizontal,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
