import type React from 'react';

export interface TabItem {
  /** Unique key */
  key: string;
  /** Tab label */
  label: React.ReactNode;
  /** Tab content */
  children?: React.ReactNode;
  /** Disable this tab */
  disabled?: boolean;
  /** Icon before label */
  icon?: React.ReactNode;
}

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Active tab key (controlled) */
  activeKey?: string;
  /** Default active tab key */
  defaultActiveKey?: string;
  /** Tab change callback */
  onChange?: (activeKey: string) => void;
  /** Tab items array */
  items?: TabItem[];
  /** Tab style type */
  type?: 'line' | 'card';
  /** Center tabs */
  centered?: boolean;
  /** Children (TabPane) - legacy support */
  children?: React.ReactNode;
}

export interface TabPaneProps {
  /** Tab key */
  tabKey?: string;
  /** Tab label */
  label?: React.ReactNode;
  /** Disabled */
  disabled?: boolean;
  /** Icon */
  icon?: React.ReactNode;
  /** Content */
  children?: React.ReactNode;
}
