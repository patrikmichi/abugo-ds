import React from 'react';
import styles from './Avatar.module.css';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'background' | 'content' | 'border';
  children?: React.ReactNode;
}

export function Avatar({
  variant,
  className,
  children,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        styles.avatar,
        variant && styles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
