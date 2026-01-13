import React from 'react';
import styles from './Skeleton.module.css';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'text' | 'background' | 'circular' | 'rectangular';
  children?: React.ReactNode;
}

export function Skeleton({
  variant,
  className,
  children,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        styles.skeleton,
        variant && styles.text,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
