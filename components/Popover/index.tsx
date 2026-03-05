import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import domAlign from 'dom-align';

import { cn } from '@/lib/utils';

import styles from './styles.module.css';
import type { IProps, PopoverPlacement, BasePlacement } from './types';

export type { IProps as PopoverProps, PopoverPlacement, PopoverTrigger } from './types';

const PLACEMENT_POINTS: Record<PopoverPlacement, [string, string]> = {
  top: ['bc', 'tc'],
  topLeft: ['bl', 'tl'],
  topRight: ['br', 'tr'],
  bottom: ['tc', 'bc'],
  bottomLeft: ['tl', 'bl'],
  bottomRight: ['tr', 'br'],
  left: ['cr', 'cl'],
  leftTop: ['tr', 'tl'],
  leftBottom: ['br', 'bl'],
  right: ['cl', 'cr'],
  rightTop: ['tl', 'tr'],
  rightBottom: ['bl', 'br'],
};

const BASE_OFFSETS: Record<BasePlacement, [number, number]> = {
  top: [0, -12],
  bottom: [0, 12],
  left: [-12, 0],
  right: [12, 0],
};

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
  getPopupContainer,
  children,
}: IProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Handle click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
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

  // Position popover using dom-align
  useEffect(() => {
    if (!open) {
      // Delay hiding for exit animation
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }

    setVisible(true);

    if (!triggerRef.current || !popoverRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const triggerEl = triggerRef.current;
      const popoverEl = popoverRef.current;
      if (!triggerEl || !popoverEl) return;

      popoverEl.style.visibility = 'hidden';
      popoverEl.style.display = 'block';

      const [sourcePoint, targetPoint] = PLACEMENT_POINTS[placement];
      const basePlacement = getBasePlacement(placement);

      domAlign(popoverEl, triggerEl, {
        points: [sourcePoint, targetPoint],
        offset: BASE_OFFSETS[basePlacement],
        overflow: {
          adjustX: true,
          adjustY: true,
          alwaysByViewport: true,
        },
        useCssTransform: false,
        useCssRight: false,
        useCssBottom: false,
      });

      const computed = window.getComputedStyle(popoverEl);
      setPosition({
        top: parseFloat(computed.top) || 0,
        left: parseFloat(computed.left) || 0,
      });
      popoverEl.style.visibility = 'visible';
    };

    const timer = setTimeout(updatePosition, 0);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, placement]);

  // Setup trigger event handlers
  useEffect(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const handlers: Record<string, EventListener> = {};

    if (triggers.includes('hover')) {
      handlers.mouseenter = handleOpen;
      handlers.mouseleave = handleClose;
    }
    if (triggers.includes('focus')) {
      handlers.focusin = handleOpen;
      handlers.focusout = handleClose;
    }
    if (triggers.includes('click')) {
      handlers.click = (e) => {
        e.stopPropagation();
        handleToggle();
      };
    }

    Object.entries(handlers).forEach(([event, handler]) => {
      triggerEl.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        triggerEl.removeEventListener(event, handler);
      });
      clearTimers();
    };
  }, [triggers, handleOpen, handleClose, handleToggle, clearTimers]);

  // Hover on popover keeps it open
  useEffect(() => {
    const popoverEl = popoverRef.current;
    if (!popoverEl || !triggers.includes('hover')) return;

    const handleEnter = () => {
      clearTimers();
      if (!isControlled) setInternalOpen(true);
    };

    popoverEl.addEventListener('mouseenter', handleEnter);
    popoverEl.addEventListener('mouseleave', handleClose);

    return () => {
      popoverEl.removeEventListener('mouseenter', handleEnter);
      popoverEl.removeEventListener('mouseleave', handleClose);
    };
  }, [triggers, handleClose, clearTimers, isControlled]);

  if (!title && !content) {
    return <>{children}</>;
  }

  const basePlacement = getBasePlacement(placement);

  const popoverContent = (
    <div
      ref={popoverRef}
      className={cn(
        styles.popover,
        styles[basePlacement],
        open && styles.open,
        overlayClassName
      )}
      style={{
        ...(position ? { position: 'fixed', top: position.top, left: position.left } : { display: 'none' }),
        ...overlayStyle,
      }}
      role="dialog"
    >
      <div className={styles.inner}>
        {title && <div className={styles.title}>{title}</div>}
        {content && <div className={styles.content}>{content}</div>}
      </div>
      {arrow && (
        <div
          className={cn(
            styles.arrow,
            styles[`arrow${basePlacement.charAt(0).toUpperCase()}${basePlacement.slice(1)}`]
          )}
        />
      )}
    </div>
  );

  const container = triggerRef.current && getPopupContainer
    ? getPopupContainer(triggerRef.current)
    : document.body;

  const childRef = (node: HTMLElement | null) => {
    triggerRef.current = node;
    const originalRef = (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
    if (typeof originalRef === 'function') {
      originalRef(node);
    } else if (originalRef && typeof originalRef === 'object') {
      (originalRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return (
    <>
      {React.cloneElement(children, { ref: childRef } as React.Attributes)}
      {visible && createPortal(popoverContent, container)}
    </>
  );
};

export default Popover;
export { Popover };
