import React from 'react';

export type MenuMode = 'vertical' | 'horizontal' | 'inline';
export type MenuTheme = 'light' | 'dark';

export interface MenuContextValue {
  selectedKeys?: string[];
  onSelect?: (key: string) => void;
  mode?: MenuMode;
  theme?: MenuTheme;
}

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** Selected keys */
  selectedKeys?: string[];
  /** Default selected keys */
  defaultSelectedKeys?: string[];
  /** Callback when item is selected */
  onSelect?: (key: string) => void;
  /** Menu mode */
  mode?: MenuMode;
  /** Menu theme */
  theme?: MenuTheme;
  /** Custom class name */
  className?: string;
  /** Children (Menu.Item components) */
  children?: React.ReactNode;
}

export interface MenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Unique key */
  key?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Danger state */
  danger?: boolean;
  /** Icon */
  icon?: React.ReactNode;
  /** Children */
  children?: React.ReactNode;
}
