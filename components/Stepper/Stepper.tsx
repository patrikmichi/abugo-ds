import React from 'react';
import styles from './Stepper.module.css';
import { cn } from '@/lib/utils';

export interface StepperProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'background' | 'border' | 'content';
  children?: React.ReactNode;
}

export function Stepper({
  variant,
  className,
  children,
  ...props
}: StepperProps) {
  return (
    <div
      className={cn(
        styles.stepper,
        variant && styles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
