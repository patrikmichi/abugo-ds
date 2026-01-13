import React from 'react';
import styles from './Loading.module.css';
import { cn } from '@/lib/utils';

export interface LoadingProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'spinner' | 'content';
  children?: React.ReactNode;
}

export function Loading({
  variant?,
  className,
  children,
  ...props
}: LoadingProps) {
  return (
    <div
      className={cn(
        styles.loading,
        variant && styles.spinner,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
