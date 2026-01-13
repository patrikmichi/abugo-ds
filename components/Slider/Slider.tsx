import React from 'react';
import styles from './Slider.module.css';
import { cn } from '@/lib/utils';

export interface SliderProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'track' | 'fill' | 'thumb';
  children?: React.ReactNode;
}

export function Slider({
  variant?,
  className,
  children,
  ...props
}: SliderProps) {
  return (
    <div
      className={cn(
        styles.slider,
        variant && styles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
