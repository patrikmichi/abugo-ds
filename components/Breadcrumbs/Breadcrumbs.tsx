import React, { useMemo } from 'react';
import styles from './Breadcrumbs.module.css';
import { cn } from '@/lib/utils';
import { Link } from '@/components/Link';
import { Dropdown } from '@/components/Dropdown';
import { Menu } from '@/components/Menu';

export interface BreadcrumbRoute {
  path: string;
  breadcrumbName: string;
  children?: BreadcrumbRoute[];
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Custom separator */
  separator?: React.ReactNode;
  /** Routes array */
  routes?: BreadcrumbRoute[];
  /** Custom item renderer */
  itemRender?: (
    route: BreadcrumbRoute,
    params: any,
    routes: BreadcrumbRoute[],
    paths: string[]
  ) => React.ReactNode;
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
  routes,
  itemRender,
  homeIcon = false,
  className,
  children,
  ...props
}: BreadcrumbsProps) {
  // Render from routes if provided
  const renderFromRoutes = useMemo(() => {
    if (!routes || routes.length === 0) return null;

    const paths: string[] = [];
    const params: any = {};

    return routes.map((route, index) => {
      paths.push(route.path);
      const isLast = index === routes.length - 1;
      const isFirst = index === 0;

      let content: React.ReactNode;
      if (itemRender) {
        content = itemRender(route, params, routes, paths);
      } else if (isFirst && homeIcon) {
        content = (
          <Link href={paths.join('/')} className={styles.link}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              home
            </span>
          </Link>
        );
      } else {
        content = isLast ? (
          <span className={styles.item}>{route.breadcrumbName}</span>
        ) : (
          <Link href={paths.join('/')} className={styles.link}>
            {route.breadcrumbName}
          </Link>
        );
      }

      return (
        <React.Fragment key={route.path || index}>
          {index > 0 && <span className={styles.separator}>{separator}</span>}
          {content}
        </React.Fragment>
      );
    });
  }, [routes, itemRender, separator]);

  // Render from children if provided
  if (children) {
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
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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

  // Render from routes
  return (
    <nav className={cn(styles.breadcrumbs, className)} aria-label="Breadcrumb" {...props}>
      <ol className={styles.list}>{renderFromRoutes}</ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Dropdown menu */
  menu?: React.ReactNode;
  /** Dropdown props */
  dropdownProps?: any;
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
  menu,
  dropdownProps,
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

  if (menu) {
    return (
      <li className={cn(styles.breadcrumbItem, className)} {...props}>
        <Dropdown
          overlay={menu}
          trigger="click"
          {...dropdownProps}
        >
          <span className={styles.itemWithDropdown}>
            {content}
            <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)', marginLeft: 'var(--token-primitive-spacing-1)' }}>
              expand_more
            </span>
          </span>
        </Dropdown>
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
