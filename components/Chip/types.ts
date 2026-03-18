import type React from 'react';

export type ChipSize = 'small' | 'medium' | 'large';

export interface IProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  /** An element to display as an avatar within the chip (leading adornment) */
  avatar?: React.ReactElement;
  /** If true, the chip will appear clickable and raise when pressed, even if onClick is not defined */
  clickable?: boolean;
  /** The component used for the root node. Either a string to use a HTML element or a component */
  component?: React.ElementType;
  /** Override the default delete icon element */
  deleteIcon?: React.ReactElement;
  /** If true, the component is disabled */
  disabled?: boolean;
  /** Icon element (leading adornment) */
  icon?: React.ReactElement;
  /** The content of the component */
  label?: React.ReactNode;
  /** Callback fired when the delete icon is clicked. If set, the delete icon will be shown */
  onDelete?: (event: React.MouseEvent<HTMLElement>) => void;
  /** If true, shows expand icon for dropdown menu functionality */
  expandable?: boolean;
  /** Callback fired when expand icon is clicked */
  onExpand?: (event: React.MouseEvent<HTMLElement>) => void;
  /** The size of the component */
  size?: ChipSize;
  /** If true, the chip is in selected state */
  selected?: boolean;
  /** Children - used as label if label prop is not provided */
  children?: React.ReactNode;
}
