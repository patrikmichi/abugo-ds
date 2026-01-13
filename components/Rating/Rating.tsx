import React from 'react';
import styles from './Rating.module.css';
import { cn } from '@/lib/utils';

export interface RatingProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'background';
  children?: React.ReactNode;
}

export function Rating({
  variant?,
  className,
  children,
  ...props
}: RatingProps) {
  return (
    <div
      className={cn(
        styles.rating,
        variant && styles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
