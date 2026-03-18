import type React from 'react';

export type AccordionSize = 'small' | 'middle' | 'large';
export type AccordionExpandIconPosition = 'start' | 'end';
export type AccordionCollapsible = 'header' | 'icon' | 'disabled';

export interface AccordionPanelProps {
  /** Unique key for the panel */
  key?: string;
  /** Panel header */
  header?: React.ReactNode;
  /** Panel content */
  children?: React.ReactNode;
  /** Whether the panel is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Default active panel key(s) */
  defaultActiveKey?: string | string[];
  /** Callback when active panel changes */
  onChange?: (key: string | string[]) => void;
  /** Accordion mode - only one panel can be expanded at a time */
  accordion?: boolean;
  /** Panel variant - bordered style */
  panel?: boolean;
  /** Size of accordion */
  size?: AccordionSize;
  /** Position of expand icon */
  expandIconPosition?: AccordionExpandIconPosition;
  /** Collapsible behavior - where clicking triggers collapse */
  collapsible?: AccordionCollapsible;
  /** Whether to destroy inactive panel content */
  destroyInactivePanel?: boolean;
  /** Children (Accordion.Panel components) */
  children?: React.ReactNode;
}

export interface ParsedPanel {
  key: string;
  header: React.ReactNode;
  children: React.ReactNode;
  disabled: boolean;
  className?: string;
  style?: React.CSSProperties;
}
