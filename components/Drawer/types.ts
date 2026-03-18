import type React from 'react';

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerProps {
  /** Whether drawer is open */
  open?: boolean;
  /** Callback when drawer closes */
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Callback when OK/Save button is clicked */
  onOk?: (e: React.MouseEvent) => void;
  /** Callback when back button is clicked. Shows back arrow in header when provided */
  onBack?: (e: React.MouseEvent) => void;
  /** Placement of drawer */
  placement?: DrawerPlacement;
  /** Width of drawer (for left/right placement) */
  width?: string | number;
  /** Height of drawer (for top/bottom placement) */
  height?: string | number;
  /** Whether to show close button */
  closable?: boolean;
  /** Whether clicking mask closes drawer */
  maskClosable?: boolean;
  /** Title of drawer */
  title?: React.ReactNode;
  /** Title alignment */
  titleAlign?: 'left' | 'center';
  /** Whether to show footer with Save/Cancel buttons */
  footer?: boolean;
  /** Save button text */
  okText?: React.ReactNode;
  /** Cancel button text */
  cancelText?: React.ReactNode;
  /** Custom class name for drawer */
  className?: string;
  /** Children - drawer content */
  children?: React.ReactNode;
}
