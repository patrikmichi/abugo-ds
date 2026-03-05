import type React from 'react';

export type PopoverPlacement =
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

export type PopoverTrigger = 'hover' | 'click' | 'focus';

export interface IProps {
  /** Title content shown in header */
  title?: React.ReactNode;
  /** Main content of the popover */
  content?: React.ReactNode;
  /** Placement of popover relative to trigger */
  placement?: PopoverPlacement;
  /** How to trigger the popover */
  trigger?: PopoverTrigger | PopoverTrigger[];
  /** Whether to show arrow */
  arrow?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom class for popover container */
  overlayClassName?: string;
  /** Custom style for popover container */
  overlayStyle?: React.CSSProperties;
  /** Get container for popover portal */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Trigger element */
  children: React.ReactElement;
}

export type BasePlacement = 'top' | 'bottom' | 'left' | 'right';
