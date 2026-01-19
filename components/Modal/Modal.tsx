import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

export interface ModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Whether the modal is open by default */
  defaultOpen?: boolean;
  /** Callback when modal is closed */
  onCancel?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Callback when OK button is clicked */
  onOk?: (e: React.MouseEvent) => void;
  /** Modal title */
  title?: React.ReactNode;
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

/**
 * Modal Component
 * 
 * Modal dialog component matching 
 * 
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onCancel={() => setIsOpen(false)}
 *   onOk={() => handleOk()}
 *   title="Modal Title"
 *   footer={null}
 * >
 *   Content here
 * </Modal>
 * ```
 */
export function Modal({
  open: controlledOpen,
  defaultOpen = false,
  onCancel,
  onOk,
  title,
  children,
  closable = true,
  closeIcon,
  mask = true,
  maskClosable = true,
  keyboard = true,
  footer,
  okText = 'OK',
  cancelText = 'Cancel',
  okButtonProps,
  cancelButtonProps,
  okType = 'primary',
  confirmLoading = false,
  destroyOnClose = false,
  afterOpenChange,
  width = 520,
  centered = false,
  zIndex,
  getContainer,
  className,
  style,
  maskClassName,
  maskStyle,
  wrapClassName,
  bodyStyle,
  bodyClassName,
  forceRender = false,
  focusTriggerAfterClose = true,
  ...props
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [isClosing, setIsClosing] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Store trigger element for focus management
  useEffect(() => {
    if (open && focusTriggerAfterClose) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      triggerRef.current = previousActiveElementRef.current;
    }
  }, [open, focusTriggerAfterClose]);

  // Handle keyboard (Esc key)
  useEffect(() => {
    if (!open || !keyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel(e as any);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, keyboard]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // After open change callback
  useEffect(() => {
    if (afterOpenChange && !isClosing) {
      afterOpenChange(open);
    }
  }, [open, afterOpenChange, isClosing]);

  // Focus management
  useEffect(() => {
    if (open && modalRef.current) {
      // Focus first focusable element in modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else if (!open && focusTriggerAfterClose && triggerRef.current) {
      // Return focus to trigger element
      triggerRef.current.focus();
    }
  }, [open, focusTriggerAfterClose]);

  const handleCancel = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if (isClosing) return;

      setIsClosing(true);
      setTimeout(() => {
        if (!isControlled) {
          setInternalOpen(false);
        }
        setIsClosing(false);
        onCancel?.(e);
      }, 300); // Wait for animation
    },
    [isControlled, isClosing, onCancel]
  );

  const handleOk = useCallback(
    (e: React.MouseEvent) => {
      onOk?.(e);
    },
    [onOk]
  );

  const handleMaskClick = useCallback(
    (e: React.MouseEvent) => {
      if (maskClosable && e.target === e.currentTarget) {
        handleCancel(e);
      }
    },
    [maskClosable, handleCancel]
  );

  // Get container element
  const getContainerElement = (): HTMLElement => {
    if (getContainer === false) {
      return document.body;
    }
    if (typeof getContainer === 'function') {
      return getContainer();
    }
    if (typeof getContainer === 'string') {
      const element = document.querySelector(getContainer);
      if (element) return element as HTMLElement;
    }
    if (getContainer instanceof HTMLElement) {
      return getContainer;
    }
    return document.body;
  };

  // Default footer
  const defaultFooter = (
    <>
      <Button onClick={handleCancel} {...cancelButtonProps}>
        {cancelText}
      </Button>
      <Button
        variant={okType === 'primary' ? 'primary' : 'secondary'}
        onClick={handleOk}
        loading={confirmLoading}
        {...okButtonProps}
      >
        {okText}
      </Button>
    </>
  );

  const shouldRender = open || forceRender || (destroyOnClose ? false : true);
  const shouldShow = open && !isClosing;

  const modalContent = (
    <div
      className={cn(styles.wrap, wrapClassName, !shouldShow && styles.wrapHidden)}
      style={{ zIndex: zIndex }}
    >
      {mask && (
        <div
          className={cn(styles.mask, maskClassName, !shouldShow && styles.maskHidden)}
          style={maskStyle}
          onClick={handleMaskClick}
        />
      )}
      <div
        ref={modalRef}
        className={cn(
          styles.modal,
          centered && styles.centered,
          !shouldShow && styles.modalHidden,
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          ...style,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {closable && (
          <button
            type="button"
            className={styles.close}
            onClick={handleCancel}
            aria-label="Close"
          >
            {closeIcon || (
              <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
                close
              </span>
            )}
          </button>
        )}
        {title && (
          <div className={styles.header}>
            <div id="modal-title" className={styles.title}>
              {title}
            </div>
          </div>
        )}
        <div className={cn(styles.body, bodyClassName)} style={bodyStyle}>
          {shouldShow || !destroyOnClose ? children : null}
        </div>
        {footer !== null && (
          <div className={styles.footer}>
            {footer !== undefined ? footer : defaultFooter}
          </div>
        )}
      </div>
    </div>
  );

  // Early return check must come AFTER all hooks
  if (!shouldRender && !forceRender) {
    return null;
  }

  const container = getContainerElement();
  if (container === document.body) {
    return createPortal(modalContent, container);
  }
  return modalContent;
}

// Modal Manager for static methods
interface ModalConfig {
  rootPrefixCls?: string;
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
}

interface ConfirmOptions {
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

class ModalManager {
  private modals: Map<number, { destroy: () => void }> = new Map();
  private modalConfig: ModalConfig = {};

  config(options: ModalConfig) {
    this.modalConfig = { ...this.modalConfig, ...options };
  }

  private confirm(options: ConfirmOptions, type?: 'info' | 'success' | 'error' | 'warning'): number {
    const id = Date.now();
    const container = document.createElement('div');
    document.body.appendChild(container);

    const destroy = () => {
      const modal = this.modals.get(id);
      if (modal) {
        modal.destroy();
        this.modals.delete(id);
      }
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    const handleOk = async () => {
      if (options.onOk) {
        try {
          await options.onOk();
          destroy();
        } catch (e) {
          // Error handling - don't close on error
        }
      } else {
        destroy();
      }
    };

    const handleCancel = () => {
      if (options.onCancel) {
        options.onCancel();
      }
      destroy();
    };

    // Render modal using React
    const React = require('react');
    const { createRoot } = require('react-dom/client');
    const root = createRoot(container);

    const iconMap = {
      info: 'info',
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
    };

    const icon = options.icon || (type ? (
      <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-3)', color: type === 'info' ? 'var(--token-primitive-brand-500)' : type === 'success' ? 'var(--token-primitive-success-500)' : type === 'error' ? 'var(--token-primitive-negative-500)' : 'var(--token-primitive-warning-500)' }}>
        {iconMap[type]}
      </span>
    ) : null);

    root.render(
      React.createElement(Modal, {
        open: true,
        onCancel: handleCancel,
        onOk: handleOk,
        title: options.title,
        width: options.width || 416,
        zIndex: options.zIndex || 1000,
        centered: options.centered,
        maskClosable: options.maskClosable !== false,
        closable: options.closable !== false,
        keyboard: options.keyboard !== false,
        okText: options.okText || 'OK',
        cancelText: options.cancelText || 'Cancel',
        okType: options.okType || 'primary',
        okButtonProps: options.okButtonProps,
        cancelButtonProps: options.cancelButtonProps,
        getContainer: this.config.getContainer,
        children: React.createElement('div', { style: { display: 'flex', gap: '16px' } },
          icon && React.createElement('div', { style: { flexShrink: 0 } }, icon),
          React.createElement('div', { style: { flex: 1 } }, options.content)
        ),
      })
    );

    this.modals.set(id, { destroy });
    return id;
  }

  info(options: ConfirmOptions): number {
    return this.confirm(options, 'info');
  }

  success(options: ConfirmOptions): number {
    return this.confirm(options, 'success');
  }

  error(options: ConfirmOptions): number {
    return this.confirm(options, 'error');
  }

  warning(options: ConfirmOptions): number {
    return this.confirm(options, 'warning');
  }

  confirm(options: ConfirmOptions): number {
    return this.confirm(options);
  }

  destroyAll() {
    this.modals.forEach((modal) => modal.destroy());
    this.modals.clear();
  }
}

const modalManager = new ModalManager();

// Static methods
export const ModalStatic = {
  info: (options: ConfirmOptions) => modalManager.info(options),
  success: (options: ConfirmOptions) => modalManager.success(options),
  error: (options: ConfirmOptions) => modalManager.error(options),
  warning: (options: ConfirmOptions) => modalManager.warning(options),
  confirm: (options: ConfirmOptions) => modalManager.confirm(options),
  destroyAll: () => modalManager.destroyAll(),
  config: (options: ModalConfig) => modalManager.config(options),
};

// Attach static methods
(Modal as any).info = ModalStatic.info;
(Modal as any).success = ModalStatic.success;
(Modal as any).error = ModalStatic.error;
(Modal as any).warning = ModalStatic.warning;
(Modal as any).confirm = ModalStatic.confirm;
(Modal as any).destroyAll = ModalStatic.destroyAll;
(Modal as any).config = ModalStatic.config;
