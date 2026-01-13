import React from 'react';
import styles from './Link.module.css';
import { cn } from '@/lib/utils';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default';
  children: React.ReactNode;
}

export function Link({
  variant = 'default',
  className,
  children,
  href,
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      className={cn(
        styles.link,
        variant && styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
