import React from 'react';
import styles from './Pagination.module.css';
import { cn } from '@/lib/utils';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'item' | 'background' | 'content';
  children?: React.ReactNode;
}

export function Pagination({
  variant,
  className,
  children,
  ...props
}: PaginationProps) {
  return (
    <div
      className={cn(
        styles.pagination,
        variant && styles.item,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
