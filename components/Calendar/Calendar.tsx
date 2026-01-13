import React from 'react';
import styles from './Calendar.module.css';
import { cn } from '@/lib/utils';

export interface CalendarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'day' | 'content' | 'background';
  children?: React.ReactNode;
}

export function Calendar({
  variant?,
  className,
  children,
  ...props
}: CalendarProps) {
  return (
    <div
      className={cn(
        styles.calendar,
        variant && styles.day,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
