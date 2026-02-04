import React from 'react';

export interface ModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Whether the modal is open by default */
  defaultOpen?: boolean;
  /** Callback when modal is closed */
  onCancel?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Callback when OK button is clicked */
  onOk?: (e: React.MouseEvent) => void;
  /** Callback when back button is clicked. Shows back arrow in header when provided */
  onBack?: (e: React.MouseEvent) => void;
  /** Modal title */
  title?: React.ReactNode;
  /** Title alignment */
  titleAlign?: 'left' | 'center';
  /** Modal content */
  children?: React.ReactNode;
  /** Whether to show close button */
  closable?: boolean;
  /** Custom close icon */
  closeIcon?: React.ReactNode;
  /** Whether to show mask */
  mask?: boolean;
  /** Whether to close modal when mask is clicked */
  maskClosable?: boolean;
  /** Whether to close modal when Esc is pressed */
  keyboard?: boolean;
  /** Custom footer. Set to null to remove footer */
  footer?: React.ReactNode | null;
  /** Footer alignment */
  footerAlign?: 'left' | 'right';
  /** Text of OK button */
  okText?: React.ReactNode;
  /** Text of Cancel button */
  cancelText?: React.ReactNode;
  /** Props for OK button */
  okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  /** Props for Cancel button */
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  /** Type of OK button */
  okType?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  /** Whether OK button is loading */
  confirmLoading?: boolean;
  /** Whether to destroy child components when closed */
  destroyOnClose?: boolean;
  /** Callback after open/close animation completes */
  afterOpenChange?: (open: boolean) => void;
  /** Width of modal */
  width?: string | number;
  /** Whether to center modal vertically */
  centered?: boolean;
  /** Z-index of modal */
  zIndex?: number;
  /** Container to render modal in */
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom class name for mask */
  maskClassName?: string;
  /** Custom style for mask */
  maskStyle?: React.CSSProperties;
  /** Custom class name for wrapper */
  wrapClassName?: string;
  /** Custom style for body */
  bodyStyle?: React.CSSProperties;
  /** Custom class name for body */
  bodyClassName?: string;
  /** Force render even when closed */
  forceRender?: boolean;
  /** Focus trigger element after close */
  focusTriggerAfterClose?: boolean;
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
  okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
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
