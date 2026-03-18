import type React from 'react';

export type ActionMenuPlacement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight';

export interface ActionMenuItem {
  /** Unique key */
  key: string;
  /** Item label */
  label: React.ReactNode;
  /** Item icon */
  icon?: React.ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Whether item is a danger action */
  danger?: boolean;
  /** Whether this is a divider (overrides other props) */
  divider?: boolean;
}

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Menu items */
  items: ActionMenuItem[];
  /** Placement of the menu panel */
  placement?: ActionMenuPlacement;
  /** Callback when an item is clicked */
  onItemClick?: (key: string) => void;
  /** Whether the menu is disabled */
  disabled?: boolean;
  /** Children (trigger element, typically a Button) */
  children: React.ReactNode;
}
