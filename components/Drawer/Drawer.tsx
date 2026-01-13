import React from 'react';
import styles from './Drawer.module.css';
import { cn } from '@/lib/utils';

export interface DrawerProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'background' | 'border' | 'content';
  children?: React.ReactNode;
}

export function Drawer({
  variant,
  className,
  children,
  ...props
}: DrawerProps) {
  return (
    <div
      className={cn(
        styles.drawer,
        variant && styles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
