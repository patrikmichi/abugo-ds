import React, { useState } from 'react';
import styles from './Alert.module.css';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/Button';

export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertSize = 'small' | 'large';

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
  /** Button variant for close button */
  closeButtonVariant?: ButtonProps['variant'];
  /** Button appearance for close button */
  closeButtonAppearance?: ButtonProps['appearance'];
  /** Callback when alert is closed */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback after close animation finishes */
  afterClose?: () => void;
  /** Whether to show icon */
  showIcon?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom action button */
  action?: React.ReactNode;
  /** Button variant for action button */
  actionButtonVariant?: ButtonProps['variant'];
  /** Button appearance for action button */
  actionButtonAppearance?: ButtonProps['appearance'];
  /** Action button label */
  actionLabel?: string;
  /** Action button onClick handler */
  onAction?: () => void;
  /** Children - alternative to message/description */
  children?: React.ReactNode;
}

/**
 * Alert component - Display important messages or notifications
 * 
 * Alert component with support for:
 * - Multiple types (success, info, warning, error)
 * - Two sizes (small: 48px, large: 64px min-height)
 * - Message with optional description
 * - Closable alerts with Button component
 * - Action buttons with configurable variant
 * - Material Symbols icons (show/hide with showIcon prop)
 * 
 * @example
 * ```tsx
 * // Basic alert
 * <Alert message="Success message" type="success" />
 * 
 * // With description and action
 * <Alert
 *   message="Alert title"
 *   description
 *   type="warning"
 *   size="large"
 *   actionLabel="Action"
 *   onAction={() => console.log('Action clicked')}
 *   closable
 * />
 * ```
 */
export function Alert({
  type = 'info',
  size = 'small',
  message,
  description,
  closable = false,
  closeButtonVariant = 'secondary',
  closeButtonAppearance = 'plain',
  onClose,
  afterClose,
  showIcon = true,
  icon,
  action,
  actionButtonVariant = 'secondary',
  actionButtonAppearance = 'plain',
  actionLabel,
  onAction,
  className,
  children,
  ...props
}: AlertProps) {
  const [closed, setClosed] = useState(false);
  const [closing, setClosing] = useState(false);

  // Get default icon based on type
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

  const handleClose = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setClosing(true);
    onClose?.(e as React.MouseEvent<HTMLButtonElement>);

    // Trigger afterClose after animation
    setTimeout(() => {
      setClosed(true);
      afterClose?.();
    }, 300);
  };

  // Early return check must come AFTER all hooks
  if (closed) {
    return null;
  }

  return (
    <div
      className={cn(
        styles.alert,
        styles[type],
        styles[size],
        closing && styles.closing,
        !!(description && typeof description !== 'boolean') && styles.hasDescription,
        className
      )}
      role="alert"
      {...props}
    >
      <div className={styles.iconAndContent}>
        {showIcon && (
          <span className={styles.icon}>
            {getDefaultIcon()}
          </span>
        )}

        <div className={styles.content}>
          <div className={styles.message}>
            {message}
          </div>
          {description && typeof description !== 'boolean' && (
            <div className={styles.description}>
              {description}
            </div>
          )}
        </div>
      </div>

      {(action || (actionLabel && onAction)) && (
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

      {closable && (
        <Button
          variant={closeButtonVariant}
          appearance={closeButtonAppearance}
          size={size === 'large' ? 'lg' : 'sm'}
          onClick={handleClose}
          aria-label="Close"
          iconOnly
          className={styles.close}
        >
          <span className="material-symbols-outlined">close</span>
        </Button>
      )}
    </div>
  );
}
