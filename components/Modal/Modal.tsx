import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import type { ModalProps } from './types';

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
  onBack,
  title,
  titleAlign = 'left',
  children,
  closable = true,
  closeIcon,
  mask = true,
  maskClosable = true,
  keyboard = true,
  footer,
  footerAlign = 'right',
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

  // Focus management — return focus to trigger element after close
  useEffect(() => {
    if (!open && focusTriggerAfterClose && triggerRef.current) {
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
      <Button variant="secondary" appearance="plain" onClick={handleCancel} {...cancelButtonProps}>
        {cancelText}
      </Button>
      <Button
        variant={okType === 'primary' ? 'primary' : 'secondary'}
        appearance="boxed"
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
        {title ? (
          <div className={cn(styles.header, titleAlign === 'center' && styles.titleCenter)}>
            {onBack ? (
              <button
                type="button"
                className={styles.back}
                onClick={onBack}
                aria-label="Back"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
                  arrow_back
                </span>
              </button>
            ) : titleAlign === 'center' && closable ? (
              <div className={styles.spacer} aria-hidden="true" />
            ) : null}
            <div className={styles.titleWrap}>
              <div id="modal-title" className={styles.title}>
                {title}
              </div>
            </div>
            {closable && (
              <button
                type="button"
                className={styles.close}
                onClick={handleCancel}
                aria-label="Close"
              >
                {closeIcon || (
                  <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
                    close
                  </span>
                )}
              </button>
            )}
          </div>
        ) : closable ? (
          <button
            type="button"
            className={styles.closeAbsolute}
            onClick={handleCancel}
            aria-label="Close"
          >
            {closeIcon || (
              <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
                close
              </span>
            )}
          </button>
        ) : null}
        <div className={cn(styles.body, bodyClassName)} style={bodyStyle}>
          {shouldShow || !destroyOnClose ? children : null}
        </div>
        {footer !== null && (
          <div className={cn(styles.footer, footerAlign === 'right' && styles.footerRight)}>
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
