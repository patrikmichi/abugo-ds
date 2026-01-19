import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.css';
import { cn } from '@/lib/utils';

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerProps {
  /** Whether drawer is open */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Callback after open/close animation finishes */
  afterOpenChange?: (open: boolean) => void;
  /** Placement of drawer */
  placement?: DrawerPlacement;
  /** Width of drawer (for left/right placement) */
  width?: string | number;
  /** Height of drawer (for top/bottom placement) */
  height?: string | number;
  /** Whether to show close button */
  closable?: boolean;
  /** Whether to show mask */
  mask?: boolean;
  /** Whether clicking mask closes drawer */
  maskClosable?: boolean;
  /** Whether pressing Esc closes drawer */
  keyboard?: boolean;
  /** Whether to destroy drawer content on close */
  destroyOnClose?: boolean;
  /** Get container for drawer */
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
  /** Title of drawer */
  title?: React.ReactNode;
  /** Footer of drawer */
  footer?: React.ReactNode;
  /** Custom class name for drawer */
  className?: string;
  /** Custom style for drawer */
  style?: React.CSSProperties;
  /** Custom class name for mask */
  maskClassName?: string;
  /** Custom style for mask */
  maskStyle?: React.CSSProperties;
  /** Custom class name for drawer body */
  bodyStyle?: React.CSSProperties;
  /** Children - drawer content */
  children?: React.ReactNode;
}

/**
 * Drawer component - Slide-in panel from edge of screen
 * 
 * Drawer component with support for:
 * - Multiple placements (top, right, bottom, left)
 * - Custom width/height
 * - Mask and mask closability
 * - Keyboard support (Esc key)
 * - Title and footer
 * - Portal rendering
 * 
 * @example
 * ```tsx
 * // Basic drawer
 * <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>Drawer content</p>
 * </Drawer>
 * 
 * // With title and footer
 * <Drawer
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Drawer Title"
 *   footer={<Button>Save</Button>}
 * >
 *   <p>Drawer content</p>
 * </Drawer>
 * 
 * // Left placement
 * <Drawer
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   placement="left"
 *   width={400}
 * >
 *   <p>Drawer from left</p>
 * </Drawer>
 * ```
 */
export function Drawer({
  open: controlledOpen,
  defaultOpen = false,
  onClose,
  afterOpenChange,
  placement = 'right',
  width = 378,
  height = 378,
  closable = true,
  mask = true,
  maskClosable = true,
  keyboard = true,
  getContainer,
  title,
  footer,
  className,
  style,
  maskClassName,
  maskStyle,
  bodyStyle,
  children,
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Handle open state changes
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      // Trigger afterOpenChange after animation
      setTimeout(() => {
        setIsAnimating(false);
        afterOpenChange?.(true);
      }, 300);
    } else {
      setIsAnimating(true);
      // Trigger afterOpenChange after animation
      setTimeout(() => {
        setIsAnimating(false);
        afterOpenChange?.(false);
      }, 300);
    }
  }, [open, afterOpenChange]);

  // Handle keyboard (Esc key)
  useEffect(() => {
    if (!open || !keyboard) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose(e as any);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, keyboard]);

  // Prevent body scroll when drawer is open
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

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!isControlled) {
      setInternalOpen(false);
    }
    onClose?.(e);
  };

  const handleMaskClick = (e: React.MouseEvent) => {
    if (maskClosable && e.target === maskRef.current) {
      handleClose(e);
    }
  };

  // Calculate size based on placement
  const sizeStyle: React.CSSProperties = {};
  if (placement === 'left' || placement === 'right') {
    sizeStyle.width = typeof width === 'number' ? `${width}px` : width;
  } else {
    sizeStyle.height = typeof height === 'number' ? `${height}px` : height;
  }

  // Get container
  const getContainerElement = (): HTMLElement => {
    if (getContainer === false) {
      return document.body;
    }
    if (typeof getContainer === 'string') {
      const element = document.querySelector(getContainer);
      return (element as HTMLElement) || document.body;
    }
    if (typeof getContainer === 'function') {
      return getContainer();
    }
    if (getContainer instanceof HTMLElement) {
      return getContainer;
    }
    return document.body;
  };

  const container = getContainerElement();

  const drawerContent = (
    <>
      {mask && (
        <div
          ref={maskRef}
          className={cn(
            styles.mask,
            open && styles.maskOpen,
            maskClassName
          )}
          style={maskStyle}
          onClick={handleMaskClick}
        />
      )}
      <div
        ref={drawerRef}
        className={cn(
          styles.drawer,
          styles[placement],
          open && styles.open,
          className
        )}
        style={{
          ...sizeStyle,
          ...style,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {closable && (
          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
              close
            </span>
          </button>
        )}
        
        {title && (
          <div className={styles.header}>
            <div id="drawer-title" className={styles.title}>
              {title}
            </div>
          </div>
        )}
        
        <div className={styles.body} style={bodyStyle}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </>
  );

  // Render in portal if getContainer is provided
  if (getContainer !== false) {
    return createPortal(drawerContent, container);
  }

  return drawerContent;
}
