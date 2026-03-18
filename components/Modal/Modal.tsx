import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

import styles from './Modal.module.css';
import type { ModalProps } from './types';

export function Modal({
  open = false,
  onCancel,
  onOk,
  onBack,
  title,
  children,
  closable = true,
  maskClosable = true,
  footer,
  okText = 'OK',
  cancelText = 'Cancel',
  loading = false,
  width = 520,
  centered = false,
  className,
}: ModalProps) {
  const handleCancel = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      onCancel?.(e);
    },
    [onCancel]
  );

  const handleOk = useCallback(
    (e: React.MouseEvent) => {
      onOk?.(e);
    },
    [onOk]
  );

  const handleMaskClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (maskClosable && e.target === e.currentTarget) {
        handleCancel(e);
      }
    },
    [maskClosable, handleCancel]
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel(e as unknown as React.KeyboardEvent);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleCancel]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!open) return null;

  const defaultFooter = (
    <>
      <Button variant="secondary" appearance="outline" size="sm" onClick={handleCancel}>
        {cancelText}
      </Button>
      <Button variant="primary" appearance="filled" size="sm" onClick={handleOk} loading={loading}>
        {okText}
      </Button>
    </>
  );

  const modalContent = (
    <div className={styles.wrap}>
      <div className={styles.mask} onClick={handleMaskClick} />
      <div
        className={cn(styles.modal, centered && styles.centered, className)}
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className={styles.header}>
            {onBack && (
              <button type="button" className={styles.back} onClick={onBack} aria-label="Back">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <div className={styles.titleWrap}>
              <div id="modal-title" className={styles.title}>{title}</div>
            </div>
            {closable && (
              <button type="button" className={styles.close} onClick={handleCancel} aria-label="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        ) : closable ? (
          <button type="button" className={styles.closeAbsolute} onClick={handleCancel} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        ) : null}
        <div className={styles.body}>{children}</div>
        {footer !== null && (
          <div className={styles.footer}>
            {footer !== undefined ? footer : defaultFooter}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
