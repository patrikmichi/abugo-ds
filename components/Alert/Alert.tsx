import React from 'react';
import styles from './Alert.module.css';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Alert({
  variant = 'info',
  icon,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        styles.alert,
        variant === 'success' && styles.success,
        variant === 'danger' && styles.danger,
        variant === 'warning' && styles.warning,
        variant === 'info' && styles.info,
        className
      )}
      role="alert"
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
