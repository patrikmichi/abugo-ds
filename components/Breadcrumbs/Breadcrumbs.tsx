import { Children, isValidElement, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/components/Link';
import BreadcrumbItem from './BreadcrumbItem';
import styles from './Breadcrumbs.module.css';
import type { BreadcrumbsProps, BreadcrumbItemProps, BreadcrumbsComponent } from './types';

const Breadcrumbs = ({
  separator = '/',
  homeIcon = false,
  className,
  children,
  ...props
}: BreadcrumbsProps) => {
  const childrenArray = Children.toArray(children);

  return (
    <nav className={cn(styles.breadcrumbs, className)} aria-label="Breadcrumb" {...props}>
      <ol className={styles.list}>
        {childrenArray.map((child, index) => {
          const isFirst = index === 0;

          // If homeIcon is true and this is the first child, render icon instead
          if (isFirst && homeIcon && isValidElement(child)) {
            const childProps = child.props as BreadcrumbItemProps;
            return (
              <Fragment key={index}>
                <li className={cn(styles.breadcrumbItem, childProps.className)}>
                  <Link href={childProps.href || '#'} variant="secondary" onClick={childProps.onClick}>
                    <span className={cn('material-symbols-outlined', styles.homeIcon)}>
                      home
                    </span>
                  </Link>
                </li>
              </Fragment>
            );
          }

          return (
            <Fragment key={index}>
              {index > 0 && <span className={styles.separator}>{separator}</span>}
              {child}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.Item = BreadcrumbItem;

export default Breadcrumbs as BreadcrumbsComponent;
