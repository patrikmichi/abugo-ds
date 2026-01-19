import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import domAlign from 'dom-align';
import styles from './Tooltip.module.css';
import { cn } from '@/lib/utils';

export type TooltipPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

export interface TooltipProps {
  /** Tooltip content */
  title?: React.ReactNode;
  /** Alias for title */
  content?: React.ReactNode;
  /** Placement of tooltip */
  placement?: TooltipPlacement;
  /** Trigger mode */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** Whether arrow points to center */
  arrowPointAtCenter?: boolean;
  /** Auto adjust placement when overflow */
  autoAdjustOverflow?: boolean;
  /** Custom class name for tooltip */
  overlayClassName?: string;
  /** Custom style for tooltip */
  overlayStyle?: React.CSSProperties;
  /** Get container for tooltip */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Mouse enter delay (ms) */
  mouseEnterDelay?: number;
  /** Mouse leave delay (ms) */
  mouseLeaveDelay?: number;
  /** Children - element to attach tooltip to */
  children: React.ReactElement;
}

/**
 * Tooltip Component
 * 
 * Simple text popup tip. Displays additional information on hover, focus, or click.
 * 
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip title="Tooltip content">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * 
 * // With click trigger
 * <Tooltip title="Click to see" trigger="click">
 *   <Button>Click me</Button>
 * </Tooltip>
 * 
 * // With custom placement
 * <Tooltip title="Content" placement="bottomRight">
 *   <Button>Hover</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
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
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const displayTitle = title || content;
  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  // Calculate placement points for dom-align
  const getPlacementPoints = (placement: TooltipPlacement): [string, string] => {
    const basePlacement = placement.replace(/Left|Right|Top|Bottom/g, '') as 'top' | 'bottom' | 'left' | 'right';
    
    if (basePlacement === 'top') {
      if (placement.includes('Left')) return ['tl', 'bl'];
      if (placement.includes('Right')) return ['tr', 'br'];
      return ['tc', 'bc'];
    }
    if (basePlacement === 'bottom') {
      if (placement.includes('Left')) return ['bl', 'tl'];
      if (placement.includes('Right')) return ['br', 'tr'];
      return ['bc', 'tc'];
    }
    if (basePlacement === 'left') {
      if (placement.includes('Top')) return ['tl', 'tr'];
      if (placement.includes('Bottom')) return ['bl', 'br'];
      return ['cl', 'cr'];
    }
    // right
    if (placement.includes('Top')) return ['tr', 'tl'];
    if (placement.includes('Bottom')) return ['br', 'bl'];
    return ['cr', 'cl'];
  };

  // Update position when tooltip opens
  useEffect(() => {
    if (!open || !triggerRef.current || !tooltipRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;

      // Ensure tooltip is visible for measurement
      tooltip.style.visibility = 'hidden';
      tooltip.style.display = 'block';

      const [sourcePoint, targetPoint] = getPlacementPoints(placement);
      const gap = 8;

      const alignConfig = {
        points: [sourcePoint, targetPoint],
        offset: [0, gap],
        overflow: {
          adjustX: autoAdjustOverflow,
          adjustY: autoAdjustOverflow,
          alwaysByViewport: true,
        },
        useCssTransform: false,
        useCssRight: false,
        useCssBottom: false,
      };

      // Perform alignment
      domAlign(tooltip, trigger, alignConfig);

      // Get final position
      const computedStyle = window.getComputedStyle(tooltip);
      const top = parseFloat(computedStyle.top) || 0;
      const left = parseFloat(computedStyle.left) || 0;

      setPosition({ top, left });
      tooltip.style.visibility = 'visible';
    };

    // Small delay to ensure tooltip is rendered
    const timer = setTimeout(updatePosition, 0);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // Handle hover on tooltip itself when hover trigger is used
    if (tooltip && triggers.includes('hover')) {
      tooltip.addEventListener('mouseenter', handleOpen);
      tooltip.addEventListener('mouseleave', handleClose);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      if (tooltip && triggers.includes('hover')) {
        tooltip.removeEventListener('mouseenter', handleOpen);
        tooltip.removeEventListener('mouseleave', handleClose);
      }
    };
  }, [open, placement, autoAdjustOverflow, triggers, handleOpen, handleClose]);

  const handleOpen = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
    }

    enterTimerRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(true);
      }
      onOpenChange?.(true);
    }, mouseEnterDelay * 1000);
  }, [isControlled, onOpenChange, mouseEnterDelay]);

  const handleClose = useCallback(() => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }

    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }

    leaveTimerRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    }, mouseLeaveDelay * 1000);
  }, [isControlled, onOpenChange, mouseLeaveDelay]);

  // Setup event handlers
  useEffect(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger) return;

    const handlers: { [key: string]: (e?: Event) => void } = {};

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
        e?.stopPropagation();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      };
    }
    if (triggers.includes('contextMenu')) {
      handlers.contextmenu = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      };
    }

    Object.entries(handlers).forEach(([event, handler]) => {
      trigger.addEventListener(event, handler as any);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        trigger.removeEventListener(event, handler as any);
      });
      if (tooltip && triggers.includes('hover')) {
        tooltip.removeEventListener('mouseenter', handleOpen);
        tooltip.removeEventListener('mouseleave', handleClose);
      }
      if (enterTimerRef.current) {
        clearTimeout(enterTimerRef.current);
      }
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, [triggers, handleOpen, handleClose, open]);

  // Early return check must come AFTER all hooks
  if (!displayTitle) {
    return <>{children}</>;
  }

  const basePlacement = placement.replace(/Left|Right|Top|Bottom/g, '') as 'top' | 'bottom' | 'left' | 'right';
  const align = placement.includes('Left') 
    ? 'left' 
    : placement.includes('Right') 
    ? 'right' 
    : placement.includes('Top') 
    ? 'top' 
    : placement.includes('Bottom') 
    ? 'bottom' 
    : 'center';

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={cn(
        styles.tooltip,
        styles[basePlacement],
        align !== 'center' && styles[`${basePlacement}${align.charAt(0).toUpperCase() + align.slice(1)}`],
        overlayClassName
      )}
      style={{
        ...(position ? { position: 'fixed', top: `${position.top}px`, left: `${position.left}px` } : { display: 'none' }),
        ...overlayStyle,
      }}
      data-hover-enabled={triggers.includes('hover') ? 'true' : 'false'}
      role="tooltip"
    >
      <div className={styles.content}>{displayTitle}</div>
      <div
        className={cn(
          styles.arrow,
          styles[`arrow${basePlacement.charAt(0).toUpperCase() + basePlacement.slice(1)}`],
          arrowPointAtCenter && styles.arrowPointAtCenter
        )}
      />
    </div>
  );

  const container = triggerRef.current && getPopupContainer ? getPopupContainer(triggerRef.current) : document.body;

  const childProps: any = {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      // Handle original ref if it exists
      const originalRef = (children as any).ref;
      if (typeof originalRef === 'function') {
        originalRef(node);
      } else if (originalRef && typeof originalRef === 'object') {
        originalRef.current = node;
      }
    },
  };

  return (
    <>
      {React.cloneElement(children, childProps)}
      {open && createPortal(tooltipContent, container)}
    </>
  );
}
