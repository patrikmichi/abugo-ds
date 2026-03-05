import type React from 'react';

export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertSize = 'small' | 'large';

export interface AlertAction {
  /** Button label */
  label: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Button variant (default: secondary) */
  variant?: 'primary' | 'secondary' | 'danger' | 'upgrade';
  /** Button appearance (default: filled) */
  appearance?: 'filled' | 'plain' | 'outline';
}

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
