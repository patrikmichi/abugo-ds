import React, { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

import styles from './Drawer.module.css';
import type { DrawerProps } from './types';

export type { DrawerProps, DrawerPlacement } from './types';

export function Drawer({
  open = false,
  onClose,
  onOk,
  onBack,
  placement = 'right',
  width = 378,
  height = 378,
  closable = true,
  maskClosable = true,
  title,
  footer = false,
  okText = 'Save',
  cancelText = 'Cancel',
  className,
  children,
}: DrawerProps) {
  const maskRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle visibility - show immediately when open, hide after animation ends
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  // Handle animation - trigger after component is visible and rendered
  useEffect(() => {
    if (isVisible && open) {
      // Use setTimeout to ensure the DOM has rendered with initial off-screen position
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else if (!open) {
      setIsAnimating(false);
    }
  }, [isVisible, open]);

  // Handle transition end to remove from DOM after close animation
  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.target === drawerRef.current && !open) {
      setIsVisible(false);
    }
  }, [open]);

  const handleClose = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      onClose?.(e);
    },
    [onClose]
  );

  const handleMaskClick = (e: React.MouseEvent) => {
    if (maskClosable && e.target === maskRef.current) {
      handleClose(e);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose(e as unknown as React.KeyboardEvent);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isHorizontal = placement === 'left' || placement === 'right';
  const sizeStyle: React.CSSProperties = isHorizontal
    ? { width: typeof width === 'number' ? `${width}px` : width }
    : { height: typeof height === 'number' ? `${height}px` : height };

  const renderHeader = () => {
    if (!title && !closable) return null;

    if (!title && closable) {
      return (
        <button type="button" className={styles.closeAbsolute} onClick={handleClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
      );
    }

    return (
      <div className={styles.header}>
        {onBack && (
          <button type="button" className={styles.back} onClick={onBack} aria-label="Back">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <div className={styles.titleWrap}>
          <div id="drawer-title" className={styles.title}>{title}</div>
        </div>
        {closable && (
          <button type="button" className={styles.close} onClick={handleClose} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    );
  };

  if (!isVisible) return null;

  const drawerContent = (
    <>
      <div
        ref={maskRef}
        className={cn(styles.mask, isAnimating && styles.maskOpen)}
        onClick={handleMaskClick}
      />
      <div
        ref={drawerRef}
        className={cn(styles.drawer, styles[placement], isAnimating && styles.open, className)}
        style={sizeStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        onTransitionEnd={handleTransitionEnd}
      >
        {renderHeader()}
        <div className={styles.body}>{children}</div>
        {footer && (
          <div className={styles.footer}>
            <Button variant="primary" appearance="filled" size="sm" onClick={onOk}>{okText}</Button>
            <Button variant="secondary" appearance="outline" size="sm" onClick={handleClose}>{cancelText}</Button>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(drawerContent, document.body);
}
