import React, { useEffect, useState, useCallback } from 'react';
import styles from './Notification.module.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import type { NotificationProps, NotificationType } from './types';

// Re-export types
export type {
  NotificationProps,
  NotificationType,
  NotificationPlacement,
  NotificationAction,
  NotificationOpenConfig,
  NotificationConfig,
  NotificationInstance,
} from './types';

const ICON_MAP: Record<NotificationType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const ICON_COLOR_MAP: Record<NotificationType, string> = {
  success: 'var(--token-component-notification-icon-color-success, #32c21a)',
  error: 'var(--token-component-notification-icon-color-error, #ff434e)',
  warning: 'var(--token-component-notification-icon-color-warning, #ed8400)',
  info: 'var(--token-component-notification-icon-color-info, #5690f5)',
};

export function Notification({
  type = 'info',
  message,
  description,
  duration = 4.5,
  onClose,
  onClick,
  icon,
  closeIcon,
  actions,
  btn,
  placement = 'topRight',
  className,
  style,
}: NotificationProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose?.(), 300);
  }, [onClose]);

  useEffect(() => {
    if (duration === null || duration <= 0) return;
    const timer = setTimeout(handleClose, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const renderIcon = () => {
    if (icon) return icon;
    return <span className="material-symbols-outlined">{ICON_MAP[type]}</span>;
  };

  const actionList = actions ? (Array.isArray(actions) ? actions : [actions]) : null;

  return (
    <div
      className={cn(
        styles.notification,
        styles[type],
        styles[placement],
        closing && styles.closing,
        onClick && styles.clickable,
        className
      )}
      style={style}
      role="alert"
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles.icon} style={{ color: ICON_COLOR_MAP[type] }}>
          {renderIcon()}
        </div>
        <div className={styles.message}>{message}</div>
      </div>
      {description && <div className={styles.description}>{description}</div>}
      {actionList && (
        <div className={styles.actions}>
          {actionList.map((action, i) => (
            <Button
              key={i}
              size="sm"
              variant={action.variant ?? 'secondary'}
              appearance={action.appearance}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
      {!actionList && btn && <div className={styles.actions}>{btn}</div>}
      <button
        type="button"
        className={styles.close}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="Close"
      >
        {closeIcon || <span className="material-symbols-outlined">close</span>}
      </button>
    </div>
  );
}
