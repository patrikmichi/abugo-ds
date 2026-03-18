import type React from 'react';

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

export type BasePlacement = 'top' | 'bottom' | 'left' | 'right';

export interface IProps {
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
