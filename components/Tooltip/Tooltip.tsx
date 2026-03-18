import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import domAlign from 'dom-align';

import { cn } from '@/lib/utils';

import styles from './Tooltip.module.css';
import type { IProps, TooltipPlacement, BasePlacement } from './types';

const PLACEMENT_POINTS: Record<TooltipPlacement, [string, string]> = {
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
  top: [0, -8],
  bottom: [0, 8],
  left: [-8, 0],
  right: [8, 0],
};

const getBasePlacement = (placement: TooltipPlacement): BasePlacement =>
  placement.replace(/Left|Right|Top|Bottom/g, '') as BasePlacement;

const getAlign = (placement: TooltipPlacement): string => {
  if (placement.includes('Left')) return 'left';
  if (placement.includes('Right')) return 'right';
  if (placement.includes('Top')) return 'top';
  if (placement.includes('Bottom')) return 'bottom';
  return 'center';
};

const Tooltip = ({
  title,
  content,
  placement = 'top',
  trigger = 'hover',
  arrowPointAtCenter = false,
  autoAdjustOverflow = true,
  overlayClassName,
  overlayStyle,
  getPopupContainer,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  children,
}: IProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const displayTitle = title || content;
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
    }, mouseEnterDelay * 1000);
  }, [isControlled, onOpenChange, mouseEnterDelay, clearTimers]);

  const handleClose = useCallback(() => {
    clearTimers();
    leaveTimerRef.current = setTimeout(() => {
      if (!isControlled) setInternalOpen(false);
      onOpenChange?.(false);
    }, mouseLeaveDelay * 1000);
  }, [isControlled, onOpenChange, mouseLeaveDelay, clearTimers]);

  const handleToggle = useCallback(() => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [open, handleOpen, handleClose]);

  // Position tooltip using dom-align (viewport collision detection requires JS)
  useEffect(() => {
    if (!open || !triggerRef.current || !tooltipRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const triggerEl = triggerRef.current;
      const tooltipEl = tooltipRef.current;
      if (!triggerEl || !tooltipEl) return;

      tooltipEl.style.visibility = 'hidden';
      tooltipEl.style.display = 'block';
      // Ensure natural width before dom-align measures
      tooltipEl.style.width = 'auto';
      tooltipEl.style.height = 'auto';

      const [sourcePoint, targetPoint] = PLACEMENT_POINTS[placement];
      const basePlacement = getBasePlacement(placement);

      domAlign(tooltipEl, triggerEl, {
        points: [sourcePoint, targetPoint],
        offset: BASE_OFFSETS[basePlacement],
        overflow: {
          adjustX: autoAdjustOverflow,
          adjustY: autoAdjustOverflow,
          alwaysByViewport: false,
        },
        useCssTransform: false,
        useCssRight: false,
        useCssBottom: false,
      });

      // Force clear any width/height constraints that dom-align might have set
      tooltipEl.style.width = '';
      tooltipEl.style.height = '';
      tooltipEl.style.minWidth = '';
      tooltipEl.style.maxWidth = '';

      const computed = window.getComputedStyle(tooltipEl);
      setPosition({
        top: parseFloat(computed.top) || 0,
        left: parseFloat(computed.left) || 0,
      });
      tooltipEl.style.visibility = 'visible';
    };

    const timer = setTimeout(updatePosition, 0);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const tooltipEl = tooltipRef.current;
    if (tooltipEl && triggers.includes('hover')) {
      tooltipEl.addEventListener('mouseenter', handleOpen);
      tooltipEl.addEventListener('mouseleave', handleClose);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      if (tooltipEl && triggers.includes('hover')) {
        tooltipEl.removeEventListener('mouseenter', handleOpen);
        tooltipEl.removeEventListener('mouseleave', handleClose);
      }
    };
  }, [open, placement, autoAdjustOverflow, triggers, handleOpen, handleClose]);

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
    if (triggers.includes('contextMenu')) {
      handlers.contextmenu = (e) => {
        e.preventDefault();
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

  if (!displayTitle) {
    return <>{children}</>;
  }

  const basePlacement = getBasePlacement(placement);
  const align = getAlign(placement);
  const alignClass = align !== 'center' ? `${basePlacement}${align.charAt(0).toUpperCase()}${align.slice(1)}` : null;

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={cn(
        styles.tooltip,
        styles[basePlacement],
        alignClass && styles[alignClass],
        overlayClassName
      )}
      style={{
        ...(position ? { position: 'fixed', top: position.top, left: position.left } : { display: 'none' }),
        ...overlayStyle,
      }}
      data-hover-enabled={triggers.includes('hover') ? 'true' : 'false'}
      role="tooltip"
    >
      <div className={styles.content}>{displayTitle}</div>
      <div
        className={cn(
          styles.arrow,
          styles[`arrow${basePlacement.charAt(0).toUpperCase()}${basePlacement.slice(1)}`],
          arrowPointAtCenter && styles.arrowPointAtCenter
        )}
      />
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
      {open && createPortal(tooltipContent, container)}
    </>
  );
};

export default Tooltip;
