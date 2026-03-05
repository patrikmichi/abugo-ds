import type React from 'react';
import type { ButtonProps } from '@/components/Button';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export type ToastVariant = 'filled' | 'outlined';

export type ToastSize = 'small' | 'large';

export interface IProps {
  /** Type of toast */
  type?: ToastType;
  /** Visual variant */
  variant?: ToastVariant;
  /** Size of toast */
  size?: ToastSize;
  /** Main message content */
  message?: React.ReactNode;
  /** Additional description content */
  description?: React.ReactNode;
  /** Toast content (alternative to message/description) */
  content?: React.ReactNode;
  /** Duration in seconds (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is closed */
  onClose?: () => void;
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
  /** Button variant for close button */
  closeButtonVariant?: ButtonProps['variant'];
  /** Button appearance for close button */
  closeButtonAppearance?: ButtonProps['appearance'];
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface ToastInstance extends Omit<IProps, 'className' | 'style'> {
  key: string;
  type: ToastType;
}

export interface ToastContainerProps {
  toasts: ToastInstance[];
  onRemove: (key: string) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}
