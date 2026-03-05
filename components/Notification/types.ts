import type React from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface NotificationAction {
  /** Button label */
  label: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'upgrade';
  /** Button appearance */
  appearance?: 'filled' | 'plain' | 'outline';
}

export interface NotificationOpenConfig {
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
  /** Action buttons */
  actions?: NotificationAction | NotificationAction[];
  /** @deprecated Use actions instead */
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

export interface NotificationProps extends Omit<NotificationOpenConfig, 'key'> {
  /** Type of notification */
  type?: NotificationType;
  /** Unique key for notification */
  key?: string;
}

export interface NotificationConfig {
  top?: number;
  bottom?: number;
  duration?: number;
  placement?: NotificationPlacement;
  rtl?: boolean;
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
}

export interface NotificationInstance extends Omit<NotificationOpenConfig, 'key'> {
  key: string;
  type: NotificationType;
}

/** Static methods attached to Notification component */
export interface NotificationStaticMethods {
  open: (config: NotificationOpenConfig) => string;
  success: (config: NotificationOpenConfig) => string;
  error: (config: NotificationOpenConfig) => string;
  info: (config: NotificationOpenConfig) => string;
  warning: (config: NotificationOpenConfig) => string;
  close: (key: string) => void;
  destroy: () => void;
  config: (options: NotificationConfig) => void;
}

/** Notification component type with static methods */
export type NotificationComponent = React.FC<NotificationProps> & NotificationStaticMethods;
