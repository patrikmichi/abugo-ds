import React from 'react';
import styles from './Breadcrumbs.module.css';
import { cn } from '@/lib/utils';
import { Link } from '@/components/Link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumbs({
  items,
  className,
  separator = ' / ',
}: BreadcrumbsProps) {
  return (
    <nav className={cn(styles.breadcrumbs, className)} aria-label="Breadcrumb">
      <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && <span className={styles.separator}>{separator}</span>}
            {item.href ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
