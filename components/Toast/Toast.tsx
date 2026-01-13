import React from 'react';
import styles from './Toast.module.css';
import { cn } from '@/lib/utils';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'danger';
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
}

export function Toast({
  variant = 'info',
  icon,
  className,
  children,
  onClose,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        styles.toast,
        variant === 'info' && styles.info,
        variant === 'danger' && styles.danger,
        className
      )}
      role="alert"
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.content}>{children}</div>
      {onClose && (
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}
