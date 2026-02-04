import React from 'react';
import styles from './Breadcrumbs.module.css';
import { cn } from '@/lib/utils';
import { Link } from '@/components/Link';
import { ActionMenu, type ActionMenuItem } from '@/components/ActionMenu';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Custom separator */
  separator?: React.ReactNode;
  /** Whether to show home as icon instead of link */
  homeIcon?: boolean;
  /** Custom class name */
  className?: string;
  /** Children (Breadcrumb.Item components) */
  children?: React.ReactNode;
}

/**
 * Breadcrumbs Component
 * 
 * Breadcrumb component. 
 * 
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Current</Breadcrumbs.Item>
 * </Breadcrumbs>
 * ```
 */
export function Breadcrumbs({
  separator = '/',
  homeIcon = false,
  className,
  children,
  ...props
}: BreadcrumbsProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <nav className={cn(styles.breadcrumbs, className)} aria-label="Breadcrumb" {...props}>
      <ol className={styles.list}>
        {childrenArray.map((child, index) => {
          const isFirst = index === 0;
          // If homeIcon is true and this is the first child, render icon instead
          if (isFirst && homeIcon && React.isValidElement(child)) {
            const childProps = child.props as BreadcrumbItemProps;
            return (
              <React.Fragment key={index}>
                <li className={cn(styles.breadcrumbItem, childProps.className)}>
                  <Link href={childProps.href || '#'} variant="secondary" onClick={childProps.onClick}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--token-component-breadcrumbs-link-icon-color, #464646)' }}>
                      home
                    </span>
                  </Link>
                </li>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.separator}>{separator}</span>}
              {child}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
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
  /** Custom class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Breadcrumbs.Item Component
 * 
 * Individual breadcrumb item.
 */
export function BreadcrumbItem({
  href,
  onClick,
  menuItems,
  onMenuItemClick,
  className,
  children,
  ...props
}: BreadcrumbItemProps) {
  const content = href ? (
    <Link href={href} variant="secondary" onClick={onClick}>
      {children}
    </Link>
  ) : (
    <span className={styles.item} onClick={onClick}>
      {children}
    </span>
  );

  if (menuItems && menuItems.length > 0) {
    return (
      <li className={cn(styles.breadcrumbItem, className)} {...props}>
        <ActionMenu items={menuItems} placement="bottomLeft" onItemClick={onMenuItemClick}>
          <span className={styles.itemWithDropdown}>
            {content}
            <span className="material-symbols-outlined" style={{ fontSize: '20px', marginLeft: '4px' }}>
              expand_more
            </span>
          </span>
        </ActionMenu>
      </li>
    );
  }

  return (
    <li className={cn(styles.breadcrumbItem, className)} {...props}>
      {content}
    </li>
  );
}

// Attach Item to Breadcrumbs
(Breadcrumbs as any).Item = BreadcrumbItem;
