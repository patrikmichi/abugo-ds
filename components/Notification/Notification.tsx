import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Notification.module.css';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface NotificationProps {
  /** Type of notification */
  type?: NotificationType;
  /** Title of notification */
  message: React.ReactNode;
  /** Description/content of notification */
  description?: React.ReactNode;
  /** Duration in seconds (0 = no auto-dismiss) */
  duration?: number | null;
  /** Callback when notification is closed */
  onClose?: () => void;
  /** Callback when notification is clicked */
  onClick?: () => void;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom close icon */
  closeIcon?: React.ReactNode;
  /** Custom button */
  btn?: React.ReactNode;
  /** Unique key for notification */
  key?: string;
  /** Placement */
  placement?: NotificationPlacement;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Notification Component
 * 
 * Individual notification item. Used internally by NotificationManager.
 * Typically accessed via static methods:
 * - Notification.open()
 * - Notification.success()
 * - Notification.error()
 * - Notification.info()
 * - Notification.warning()
 */
export function Notification({
  type = 'info',
  message,
  description,
  duration = 4.5,
  onClose,
  onClick,
  icon,
  closeIcon,
  btn,
  placement = 'topRight',
  className,
  style,
}: NotificationProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (duration !== null && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation
  }, [onClose]);

  // Get default icon based on type
  const getDefaultIcon = () => {
    if (icon) return icon;
    
    const iconName = 
      type === 'success' ? 'check_circle' :
      type === 'error' ? 'error' :
      type === 'warning' ? 'warning' :
      'info';
    
    return (
      <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-3)' }}>
        {iconName}
      </span>
    );
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'var(--token-component-notification-icon-success, #52c41a)';
      case 'error':
        return 'var(--token-component-notification-icon-error, #ff4d4f)';
      case 'warning':
        return 'var(--token-component-notification-icon-warning, #faad14)';
      default:
        return 'var(--token-component-notification-icon-info, #538bff)';
    }
  };

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
      <div className={styles.icon} style={{ color: getIconColor() }}>
        {getDefaultIcon()}
      </div>
      <div className={styles.content}>
        <div className={styles.message}>{message}</div>
        {description && <div className={styles.description}>{description}</div>}
        {btn && <div className={styles.btn}>{btn}</div>}
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="Close"
      >
        {closeIcon || (
          <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
            close
          </span>
        )}
      </button>
    </div>
  );
}

// Notification Manager for global notifications
interface NotificationConfig {
  top?: number;
  bottom?: number;
  duration?: number;
  placement?: NotificationPlacement;
  rtl?: boolean;
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
}

interface NotificationInstance {
  key: string;
  type: NotificationType;
  message: React.ReactNode;
  description?: React.ReactNode;
  duration?: number | null;
  onClose?: () => void;
  onClick?: () => void;
  icon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  btn?: React.ReactNode;
  placement?: NotificationPlacement;
  className?: string;
  style?: React.CSSProperties;
}

// Notification Container Component
const NotificationContainer: React.FC<{
  notifications: NotificationInstance[];
  placement: NotificationPlacement;
  top?: number;
  bottom?: number;
  onRemove: (key: string) => void;
}> = ({ notifications, placement, top, bottom, onRemove }) => {
  const filteredNotifications = notifications.filter((n) => (n.placement || 'topRight') === placement);

  if (filteredNotifications.length === 0) return null;

  const isTop = placement.startsWith('top');
  const isRight = placement.endsWith('Right');

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1010,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '384px',
  };

  if (isTop) {
    containerStyle.top = `${top ?? 24}px`;
  } else {
    containerStyle.bottom = `${bottom ?? 24}px`;
  }

  if (isRight) {
    containerStyle.right = '24px';
  } else {
    containerStyle.left = '24px';
  }

  return createPortal(
    <div
      className={cn(styles.container, styles[placement])}
      style={containerStyle}
    >
      {filteredNotifications.map((notification) => (
        <Notification
          key={notification.key}
          type={notification.type}
          message={notification.message}
          description={notification.description}
          duration={notification.duration}
          icon={notification.icon}
          closeIcon={notification.closeIcon}
          btn={notification.btn}
          placement={notification.placement}
          className={notification.className}
          style={notification.style}
          onClick={notification.onClick}
          onClose={() => {
            onRemove(notification.key);
            notification.onClose?.();
          }}
        />
      ))}
    </div>,
    document.body
  );
};

class NotificationManager {
  private notifications: NotificationInstance[] = [];
  private notificationConfig: NotificationConfig = {
    top: 24,
    bottom: 24,
    duration: 4.5,
    placement: 'topRight',
    rtl: false,
  };
  private updateCallback: (() => void) | null = null;

  setUpdateCallback(callback: () => void) {
    this.updateCallback = callback;
  }

  private notify() {
    if (this.updateCallback) {
      this.updateCallback();
    }
  }

  private add(
    type: NotificationType,
    config: {
      message: React.ReactNode;
      description?: React.ReactNode;
      duration?: number | null;
      onClose?: () => void;
      onClick?: () => void;
      icon?: React.ReactNode;
      closeIcon?: React.ReactNode;
      btn?: React.ReactNode;
      key?: string;
      placement?: NotificationPlacement;
      className?: string;
      style?: React.CSSProperties;
    }
  ): string {
    const key = config.key || `notification-${Date.now()}-${Math.random()}`;
    const notification: NotificationInstance = {
      key,
      type,
      message: config.message,
      description: config.description,
      duration: config.duration ?? this.notificationConfig.duration,
      onClose: config.onClose,
      onClick: config.onClick,
      icon: config.icon,
      closeIcon: config.closeIcon,
      btn: config.btn,
      placement: config.placement ?? this.notificationConfig.placement,
      className: config.className,
      style: config.style,
    };

    this.notifications.push(notification);
    this.notify();
    return key;
  }

  private remove(key: string) {
    this.notifications = this.notifications.filter((n) => n.key !== key);
    this.notify();
  }

  getNotifications(): NotificationInstance[] {
    return this.notifications;
  }

  open(config: {
    message: React.ReactNode;
    description?: React.ReactNode;
    duration?: number | null;
    onClose?: () => void;
    onClick?: () => void;
    icon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    btn?: React.ReactNode;
    key?: string;
    placement?: NotificationPlacement;
    className?: string;
    style?: React.CSSProperties;
  }): string {
    return this.add('info', config);
  }

  success(config: {
    message: React.ReactNode;
    description?: React.ReactNode;
    duration?: number | null;
    onClose?: () => void;
    onClick?: () => void;
    icon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    btn?: React.ReactNode;
    key?: string;
    placement?: NotificationPlacement;
    className?: string;
    style?: React.CSSProperties;
  }): string {
    return this.add('success', config);
  }

  error(config: {
    message: React.ReactNode;
    description?: React.ReactNode;
    duration?: number | null;
    onClose?: () => void;
    onClick?: () => void;
    icon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    btn?: React.ReactNode;
    key?: string;
    placement?: NotificationPlacement;
    className?: string;
    style?: React.CSSProperties;
  }): string {
    return this.add('error', config);
  }

  info(config: {
    message: React.ReactNode;
    description?: React.ReactNode;
    duration?: number | null;
    onClose?: () => void;
    onClick?: () => void;
    icon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    btn?: React.ReactNode;
    key?: string;
    placement?: NotificationPlacement;
    className?: string;
    style?: React.CSSProperties;
  }): string {
    return this.add('info', config);
  }

  warning(config: {
    message: React.ReactNode;
    description?: React.ReactNode;
    duration?: number | null;
    onClose?: () => void;
    onClick?: () => void;
    icon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    btn?: React.ReactNode;
    key?: string;
    placement?: NotificationPlacement;
    className?: string;
    style?: React.CSSProperties;
  }): string {
    return this.add('warning', config);
  }

  close(key: string) {
    this.remove(key);
  }

  destroy() {
    this.notifications = [];
    this.notify();
  }

  config(options: NotificationConfig) {
    this.notificationConfig = { ...this.notificationConfig, ...options };
    this.notify();
  }

  getConfig(): NotificationConfig {
    return { ...this.notificationConfig };
  }
}

// Create singleton instance
const notificationManager = new NotificationManager();

// Notification Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationInstance[]>([]);
  const [config, setConfig] = useState<NotificationConfig>(notificationManager.getConfig());

  useEffect(() => {
    const update = () => {
      setNotifications([...notificationManager.getNotifications()]);
      setConfig(notificationManager.getConfig());
    };
    
    notificationManager.setUpdateCallback(update);
    
    // Initial render
    update();
    
    return () => {
      notificationManager.setUpdateCallback(() => {});
    };
  }, []);

  const placements: NotificationPlacement[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

  return (
    <>
      {children}
      {placements.map((placement) => (
        <NotificationContainer
          key={placement}
          notifications={notifications}
          placement={placement}
          top={config.top}
          bottom={config.bottom}
          onRemove={(key) => notificationManager.close(key)}
        />
      ))}
    </>
  );
};

// Export Notification component and static methods
export const NotificationStatic = {
  open: (config: Parameters<NotificationManager['open']>[0]) => notificationManager.open(config),
  success: (config: Parameters<NotificationManager['success']>[0]) => notificationManager.success(config),
  error: (config: Parameters<NotificationManager['error']>[0]) => notificationManager.error(config),
  info: (config: Parameters<NotificationManager['info']>[0]) => notificationManager.info(config),
  warning: (config: Parameters<NotificationManager['warning']>[0]) => notificationManager.warning(config),
  close: (key: string) => notificationManager.close(key),
  destroy: () => notificationManager.destroy(),
  config: (options: NotificationConfig) => notificationManager.config(options),
};

// Attach static methods to Notification component
(Notification as any).open = NotificationStatic.open;
(Notification as any).success = NotificationStatic.success;
(Notification as any).error = NotificationStatic.error;
(Notification as any).info = NotificationStatic.info;
(Notification as any).warning = NotificationStatic.warning;
(Notification as any).close = NotificationStatic.close;
(Notification as any).destroy = NotificationStatic.destroy;
(Notification as any).config = NotificationStatic.config;
