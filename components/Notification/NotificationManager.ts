import type { NotificationType, NotificationOpenConfig, NotificationInstance, NotificationConfig } from './types';

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
    this.updateCallback?.();
  }

  private add(type: NotificationType, config: NotificationOpenConfig): string {
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
      actions: config.actions,
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

  open(config: NotificationOpenConfig): string {
    return this.add('info', config);
  }

  success(config: NotificationOpenConfig): string {
    return this.add('success', config);
  }

  error(config: NotificationOpenConfig): string {
    return this.add('error', config);
  }

  info(config: NotificationOpenConfig): string {
    return this.add('info', config);
  }

  warning(config: NotificationOpenConfig): string {
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

// Singleton instance
export const notificationManager = new NotificationManager();

// Static methods for external use
export const NotificationStatic = {
  open: (config: NotificationOpenConfig) => notificationManager.open(config),
  success: (config: NotificationOpenConfig) => notificationManager.success(config),
  error: (config: NotificationOpenConfig) => notificationManager.error(config),
  info: (config: NotificationOpenConfig) => notificationManager.info(config),
  warning: (config: NotificationOpenConfig) => notificationManager.warning(config),
  close: (key: string) => notificationManager.close(key),
  destroy: () => notificationManager.destroy(),
  config: (options: NotificationConfig) => notificationManager.config(options),
};
