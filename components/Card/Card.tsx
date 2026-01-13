import React from 'react';
import styles from './Card.module.css';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong';
  selected?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  selected = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        variant === 'strong' && styles.strong,
        selected && styles.selected,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
