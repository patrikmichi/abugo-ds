import type React from 'react';

export interface ModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when modal is closed */
  onCancel?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Callback when OK button is clicked */
  onOk?: (e: React.MouseEvent) => void;
  /** Callback when back button is clicked. Shows back arrow in header when provided */
  onBack?: (e: React.MouseEvent) => void;
  /** Modal title */
  title?: React.ReactNode;
  /** Modal content */
  children?: React.ReactNode;
  /** Whether to show close button */
  closable?: boolean;
  /** Whether clicking mask closes modal */
  maskClosable?: boolean;
  /** Custom footer. Set to null to remove footer */
  footer?: React.ReactNode | null;
  /** Text of OK button */
  okText?: React.ReactNode;
  /** Text of Cancel button */
  cancelText?: React.ReactNode;
  /** Whether OK button is loading */
  loading?: boolean;
  /** Width of modal */
  width?: string | number;
  /** Whether to center modal vertically */
  centered?: boolean;
  /** Custom class name */
  className?: string;
}

export interface ModalConfig {
  rootPrefixCls?: string;
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
}

export interface ConfirmOptions {
  title?: React.ReactNode;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  okText?: React.ReactNode;
  okType?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  cancelText?: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  width?: string | number;
  zIndex?: number;
  centered?: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  autoFocusButton?: 'ok' | 'cancel' | null;
  keyboard?: boolean;
  okButtonProps?: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onKeyDown'>;
  cancelButtonProps?: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onKeyDown'>;
}

export type ModalComponent = React.FC<ModalProps> & {
  info: (options: ConfirmOptions) => number;
  success: (options: ConfirmOptions) => number;
  error: (options: ConfirmOptions) => number;
  warning: (options: ConfirmOptions) => number;
  confirm: (options: ConfirmOptions) => number;
  destroyAll: () => void;
  config: (options: ModalConfig) => void;
};
