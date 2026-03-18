import React, { useState, useRef, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

import styles from './Popover.module.css';
import type { IProps, PopoverPlacement, BasePlacement } from './types';

const getBasePlacement = (placement: PopoverPlacement): BasePlacement =>
  placement.replace(/Left|Right|Top|Bottom/g, '') as BasePlacement;

const Popover = ({
  title,
  content,
  placement = 'top',
  trigger = 'click',
  arrow = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  overlayClassName,
  overlayStyle,
  children,
}: IProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [animating, setAnimating] = useState(defaultOpen);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  const clearTimers = useCallback(() => {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  }, []);

  const handleOpen = useCallback(() => {
    clearTimers();
    enterTimerRef.current = setTimeout(() => {
      if (!isControlled) setInternalOpen(true);
      onOpenChange?.(true);
    }, 100);
  }, [isControlled, onOpenChange, clearTimers]);

  const handleClose = useCallback(() => {
    clearTimers();
    leaveTimerRef.current = setTimeout(() => {
      if (!isControlled) setInternalOpen(false);
      onOpenChange?.(false);
    }, 100);
  }, [isControlled, onOpenChange, clearTimers]);

  const handleToggle = useCallback(() => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [open, handleOpen, handleClose]);

  // Keep animating state in sync so the panel stays mounted during exit animation
  useEffect(() => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    if (open) {
      setAnimating(true);
    } else {
      animationTimerRef.current = setTimeout(() => setAnimating(false), 200);
    }
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, isControlled, onOpenChange]);

  if (!title && !content) {
    return <>{children}</>;
  }

  const basePlacement = getBasePlacement(placement);

  const triggerProps: React.HTMLAttributes<HTMLSpanElement> = {};

  if (triggers.includes('hover')) {
    triggerProps.onMouseEnter = handleOpen;
    triggerProps.onMouseLeave = handleClose;
  }
  if (triggers.includes('focus')) {
    triggerProps.onFocus = handleOpen;
    triggerProps.onBlur = handleClose;
  }
  if (triggers.includes('click')) {
    triggerProps.onClick = (e) => {
      e.stopPropagation();
      handleToggle();
    };
  }

  return (
    <span className={styles.wrapper} ref={wrapperRef} {...triggerProps}>
      {children}
      {(open || animating) && (
        <div
          className={cn(
            styles.popover,
            styles[placement],
            open && styles.open,
            overlayClassName
          )}
          style={overlayStyle}
          role="dialog"
        >
          <div className={styles.inner}>
            {title && <div className={styles.title}>{title}</div>}
            {content && <div className={styles.content}>{content}</div>}
          </div>
          {arrow && (
            <div className={cn(styles.arrow, styles[`arrow_${basePlacement}`])} />
          )}
        </div>
      )}
    </span>
  );
};

export default Popover;
