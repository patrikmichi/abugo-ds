import type React from 'react';
import type { ActionMenuItem } from '@/components/ActionMenu';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Custom separator */
  separator?: React.ReactNode;
  /** Whether to show home as icon instead of link */
  homeIcon?: boolean;
  /** Children (Breadcrumb.Item components) */
  children?: React.ReactNode;
}

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Dropdown menu items */
  menuItems?: ActionMenuItem[];
  /** Callback when a menu item is clicked */
  onMenuItemClick?: (key: string) => void;
  /** Children */
  children?: React.ReactNode;
}

export interface BreadcrumbsComponent extends React.FC<BreadcrumbsProps> {
  Item: React.FC<BreadcrumbItemProps>;
}
