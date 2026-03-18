import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

import styles from './Alert.module.css';
import type { IProps, AlertType } from './types';

const ICON_MAP: Record<AlertType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const Alert = ({
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
}: IProps) => {
  const [closed, setClosed] = useState(false);
  const [closing, setClosing] = useState(false);

  const hasDescription = !!(description && typeof description !== 'boolean');

  const getDefaultIcon = () => {
    if (icon) return icon;

    return <span className="material-symbols-outlined">{ICON_MAP[type]}</span>;
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

  const actionList = actions ? (Array.isArray(actions) ? actions : [actions]) : null;

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
          {showIcon && <span className={styles.icon}>{getDefaultIcon()}</span>}
          <div className={styles.message}>{message}</div>
        </div>
        {hasDescription && <div className={styles.description}>{description}</div>}
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
        {!actionList && action && <div className={styles.actions}>{action}</div>}
      </div>
      {closable && (
        <button type="button" className={styles.close} onClick={handleClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
