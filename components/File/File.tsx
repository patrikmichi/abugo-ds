import React from 'react';
import styles from './File.module.css';
import { cn } from '@/lib/utils';

export interface FileProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'upload' | 'background' | 'border' | 'content';
  children?: React.ReactNode;
}

export function File({
  variant,
  className,
  children,
  ...props
}: FileProps) {
  return (
    <div
      className={cn(
        styles.file,
        variant && styles.upload,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
