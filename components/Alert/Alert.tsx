import React, { useState } from 'react';
import styles from './Alert.module.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertSize = 'small' | 'large';

export interface AlertAction {
  /** Button label */
  label: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Button variant (default: secondary) */
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'upgrade';
  /** Button appearance (default: filled) */
  appearance?: 'filled' | 'plain' | 'outline';
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Type of alert */
  type?: AlertType;
  /** Size of alert */
  size?: AlertSize;
  /** Main message content */
  message?: React.ReactNode;
  /** Additional description content */
  description?: React.ReactNode;
  /** Whether to show close button */
  closable?: boolean;
  /** Callback when alert is closed */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback after close animation finishes */
  afterClose?: () => void;
  /** Whether to show icon */
  showIcon?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action buttons — rendered as Button size="sm" */
  actions?: AlertAction | AlertAction[];
  /** @deprecated Use actions instead */
  action?: React.ReactNode;
  /** Children - alternative to message/description */
  children?: React.ReactNode;
}

/**
 * Alert component — display important messages or notifications
 *
 * Layout matches Notification pattern:
 * - Header row: icon + message text
 * - Description below, indented to align with text
 * - Close button absolutely positioned
 *
 * Without description: message uses regular weight, close is vertically centered
 * With description: message becomes bold headline, close is top-aligned
 *
 * Size only affects padding (small: 12px, large: 20px)
 */
export function Alert({
  type = 'info',
  size = 'small',
  message,
  description,
  closable = false,
  onClose,
  afterClose,
  showIcon = true,
  icon,
  actions,
  action,
  className,
  children,
  ...props
}: AlertProps) {
  const [closed, setClosed] = useState(false);
  const [closing, setClosing] = useState(false);

  const hasDescription = !!(description && typeof description !== 'boolean');

  const getDefaultIcon = () => {
    if (icon) return icon;

    const iconName =
      type === 'success' ? 'check_circle' :
      type === 'error' ? 'error' :
      type === 'warning' ? 'warning' :
      'info';

    return (
      <span className="material-symbols-outlined">
        {iconName}
      </span>
    );
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setClosing(true);
    onClose?.(e);

    setTimeout(() => {
      setClosed(true);
      afterClose?.();
    }, 300);
  };

  if (closed) return null;

  const actionList = actions
    ? Array.isArray(actions) ? actions : [actions]
    : null;

  return (
    <div
      className={cn(
        styles.alert,
        styles[type],
        styles[size],
        closing && styles.closing,
        hasDescription && styles.hasDescription,
        closable && styles.closable,
        !showIcon && styles.noIcon,
        className
      )}
      role="alert"
      {...props}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          {showIcon && (
            <span className={styles.icon}>
              {getDefaultIcon()}
            </span>
          )}
          <div className={styles.message}>{message}</div>
        </div>
        {hasDescription && (
          <div className={styles.description}>{description}</div>
        )}
        {actionList && (
          <div className={styles.actions}>
            {actionList.map((a, i) => (
              <Button
                key={i}
                size="sm"
                variant={a.variant ?? 'secondary'}
                appearance={a.appearance}
                onClick={a.onClick}
              >
                {a.label}
              </Button>
            ))}
          </div>
        )}
        {!actionList && action && (
          <div className={styles.actions}>{action}</div>
        )}
      </div>
      {closable && (
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="material-symbols-outlined">
            close
          </span>
        </button>
      )}
    </div>
  );
}
