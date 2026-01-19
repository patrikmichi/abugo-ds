import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dropdown.module.css';
import { cn } from '@/lib/utils';

export type DropdownTrigger = 'click' | 'hover' | 'contextMenu';
export type DropdownPlacement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Trigger action */
  trigger?: DropdownTrigger | DropdownTrigger[];
  /** Placement */
  placement?: DropdownPlacement;
  /** Overlay content (Menu component) */
  overlay: React.ReactNode;
  /** Visible state (controlled) */
  visible?: boolean;
  /** Default visible state */
  defaultVisible?: boolean;
  /** Callback when visible changes */
  onVisibleChange?: (visible: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Children (trigger element) */
  children: React.ReactNode;
  /** Arrow point at center */
  arrow?: boolean;
  /** Auto adjust overflow */
  autoAdjustOverflow?: boolean;
}

/**
 * Dropdown Component
 * 
 * Dropdown component following standard patterns.
 * 
 * @example
 * ```tsx
 * <Dropdown
 *   overlay={
 *     <Menu>
 *       <Menu.Item key="1">Option 1</Menu.Item>
 *       <Menu.Item key="2">Option 2</Menu.Item>
 *     </Menu>
 *   }
 * >
 *   <Button>Open Dropdown</Button>
 * </Dropdown>
 * ```
 */
export function Dropdown({
  trigger = 'hover',
  placement = 'bottomLeft',
  overlay,
  visible: controlledVisible,
  defaultVisible = false,
  onVisibleChange,
  disabled = false,
  getPopupContainer,
  className,
  style,
  children,
  arrow = false,
  autoAdjustOverflow = true,
  ...props
}: DropdownProps) {
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledVisible !== undefined;
  const visible = isControlled ? controlledVisible : internalVisible;

  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  const handleVisibleChange = useCallback(
    (newVisible: boolean) => {
      if (!isControlled) {
        setInternalVisible(newVisible);
      }
      onVisibleChange?.(newVisible);
    },
    [isControlled, onVisibleChange]
  );

  const handleOpen = useCallback(() => {
    if (disabled) return;
    handleVisibleChange(true);
  }, [disabled, handleVisibleChange]);

  const handleClose = useCallback(() => {
    handleVisibleChange(false);
  }, [handleVisibleChange]);

  // Update position when dropdown opens
  useEffect(() => {
    if (!visible || !containerRef.current || !panelRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const triggerElement = containerRef.current;
      const panelElement = panelRef.current;
      if (!triggerElement || !panelElement) return;

      const triggerRect = triggerElement.getBoundingClientRect();
      const panelRect = panelElement.getBoundingClientRect();
      const containerElement = getContainerElement();
      const containerRect = containerElement === document.body
        ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
        : containerElement.getBoundingClientRect();

      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      let top = 0;
      let left = 0;
      const offset = 4; // Gap between trigger and panel

      // Normalize placement
      const normalizedPlacement = placement === 'top' ? 'topCenter' :
        placement === 'bottom' ? 'bottomCenter' :
        placement === 'left' ? 'left' :
        placement === 'right' ? 'right' :
        placement;

      switch (normalizedPlacement) {
        case 'bottomLeft':
          top = triggerRect.bottom + offset;
          left = triggerRect.left;
          break;
        case 'bottomCenter':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
          break;
        case 'bottomRight':
          top = triggerRect.bottom + offset;
          left = triggerRect.right - panelRect.width;
          break;
        case 'topLeft':
          top = triggerRect.top - panelRect.height - offset;
          left = triggerRect.left;
          break;
        case 'topCenter':
          top = triggerRect.top - panelRect.height - offset;
          left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
          break;
        case 'topRight':
          top = triggerRect.top - panelRect.height - offset;
          left = triggerRect.right - panelRect.width;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
          left = triggerRect.left - panelRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
          left = triggerRect.right + offset;
          break;
      }

      // Auto adjust overflow
      if (autoAdjustOverflow) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Horizontal adjustment
        if (left < 0) {
          left = offset;
        } else if (left + panelRect.width > viewportWidth) {
          left = viewportWidth - panelRect.width - offset;
        }

        // Vertical adjustment
        if (top < 0) {
          top = offset;
        } else if (top + panelRect.height > viewportHeight) {
          top = viewportHeight - panelRect.height - offset;
        }
      }

      // Adjust for container offset
      if (containerElement !== document.body) {
        // For non-body containers, use absolute positioning relative to container
        top = top - containerRect.top;
        left = left - containerRect.left;
      }
      // For fixed positioning (body container), use viewport coordinates directly

      setPosition({ top, left });
    };

    // Small delay to ensure panel is rendered
    const timer = setTimeout(updatePosition, 0);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [visible, placement, autoAdjustOverflow, getPopupContainer]);

  // Click trigger
  useEffect(() => {
    if (!triggers.includes('click') || disabled) return;

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        containerRef.current.contains(e.target as Node)
      ) {
        if (visible) {
          handleClose();
        } else {
          handleOpen();
        }
      } else if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    if (visible) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [triggers, disabled, visible, handleOpen, handleClose]);

  // Hover trigger
  const handleMouseEnter = useCallback(() => {
    if (disabled || !triggers.includes('hover')) return;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    handleOpen();
  }, [disabled, triggers, hoverTimeout, handleOpen]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || !triggers.includes('hover')) return;
    const timeout = setTimeout(() => {
      handleClose();
    }, 100);
    setHoverTimeout(timeout);
  }, [disabled, triggers, handleClose]);

  // Context menu trigger
  useEffect(() => {
    if (!triggers.includes('contextMenu') || disabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        e.preventDefault();
        handleOpen();
      }
    };

    const triggerElement = containerRef.current;
    if (triggerElement) {
      triggerElement.addEventListener('contextmenu', handleContextMenu);
      return () => triggerElement.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [triggers, disabled, handleOpen]);

  // Cleanup hover timeout
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const getContainerElement = (): HTMLElement => {
    if (getPopupContainer && containerRef.current) {
      return getPopupContainer(containerRef.current);
    }
    return document.body;
  };

  const normalizedPlacement = placement === 'top' ? 'topCenter' :
    placement === 'bottom' ? 'bottomCenter' :
    placement === 'left' ? 'left' :
    placement === 'right' ? 'right' :
    placement;

  const basePlacement = normalizedPlacement.startsWith('top') ? 'top' :
    normalizedPlacement.startsWith('bottom') ? 'bottom' :
    normalizedPlacement === 'left' ? 'left' :
    'right';

  const renderPanel = () => {
    if (!visible) return null;

    const containerElement = getContainerElement();
    const isFixed = containerElement === document.body;
    const panelStyle: React.CSSProperties = {
      position: isFixed ? 'fixed' : 'absolute',
      ...(position ? { top: `${position.top}px`, left: `${position.left}px` } : {}),
      ...(!position ? { visibility: 'hidden' } : {}),
    };

    return createPortal(
      <div
        ref={panelRef}
        className={cn(
          styles.panel,
          styles[basePlacement],
          normalizedPlacement !== basePlacement && styles[normalizedPlacement],
          arrow && styles.withArrow
        )}
        style={panelStyle}
        onMouseEnter={triggers.includes('hover') ? handleMouseEnter : undefined}
        onMouseLeave={triggers.includes('hover') ? handleMouseLeave : undefined}
        onClick={(e) => {
          if (triggers.includes('click')) {
            e.stopPropagation();
          }
        }}
      >
        {arrow && (
          <div
            className={cn(
              styles.arrow,
              basePlacement === 'top' && styles.arrowTop,
              basePlacement === 'bottom' && styles.arrowBottom,
              basePlacement === 'left' && styles.arrowLeft,
              basePlacement === 'right' && styles.arrowRight
            )}
          />
        )}
        {overlay}
      </div>,
      containerElement
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(styles.dropdown, className)}
      style={style}
      onMouseEnter={triggers.includes('hover') ? handleMouseEnter : undefined}
      onMouseLeave={triggers.includes('hover') ? handleMouseLeave : undefined}
      {...props}
    >
      {children}
      {renderPanel()}
    </div>
  );
}
