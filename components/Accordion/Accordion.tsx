import React from 'react';
import styles from './Accordion.module.css';
import { cn } from '@/lib/utils';

export interface AccordionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'background' | 'border' | 'content';
  children?: React.ReactNode;
}

export function Accordion({
  variant?,
  className,
  children,
  ...props
}: AccordionProps) {
  return (
    <div
      className={cn(
        styles.accordion,
        variant && styles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
