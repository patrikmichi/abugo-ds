import React, { useEffect, useState, useCallback } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

import styles from './Toast.module.css';
import type { IProps, ToastType } from './types';

const ICON_MAP: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  loading: 'progress_activity',
  info: 'info',
};

const Toast = ({
  type = 'info',
  size = 'small',
  message,
  description,
  content,
  duration = 3,
  onClose,
  showIcon = true,
  icon,
  action,
  actionButtonVariant = 'secondary',
  actionButtonAppearance = 'plain',
  actionLabel,
  onAction,
  closeButtonVariant = 'secondary',
  closeButtonAppearance = 'plain',
  className,
  style,
}: IProps) => {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const displayIcon = icon || (
    <span className="material-symbols-outlined">{ICON_MAP[type]}</span>
  );

  const hasInteractiveElements = !!(action || (actionLabel && onAction));
  const displayMessage = message || content;
  const hasDescription = !!(description && typeof description !== 'boolean');

  return (
    <div
      className={cn(
        styles.toast,
        styles[type],
        styles[size],
        closing && styles.closing,
        hasDescription && styles.hasDescription,
        hasInteractiveElements && styles.hasInteractiveElements,
        className
      )}
      style={style}
      role="alert"
    >
      <div className={styles.iconAndContent}>
        {showIcon && <span className={styles.icon}>{displayIcon}</span>}

        <div className={styles.content}>
          <div className={styles.message}>{displayMessage}</div>
          {hasDescription && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
      </div>

      {hasInteractiveElements && (
        <div className={styles.action}>
          {action || (
            <Button
              variant={actionButtonVariant}
              appearance={actionButtonAppearance}
              size={size === 'large' ? 'md' : 'sm'}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}

      <Button
        variant={closeButtonVariant}
        appearance={closeButtonAppearance}
        size={size === 'large' ? 'lg' : 'sm'}
        onClick={handleClose}
        aria-label="Close"
        iconOnly
        inverted
        className={styles.close}
      >
        <span className="material-symbols-outlined">close</span>
      </Button>
    </div>
  );
};

export default Toast;
