import React from 'react';

import { cn } from '@/lib/utils';

import styles from './Card.module.css';
import CardGrid from './CardGrid';
import CardMeta from './CardMeta';
import type { IProps } from './types';

const Card = ({
  title,
  extra,
  actions,
  cover,
  loading = false,
  hoverable = false,
  bordered = true,
  size = 'default',
  type = 'default',
  headStyle,
  bodyStyle,
  className,
  children,
  style,
  ...props
}: IProps) => {
  const hasHeader = !!title || !!extra;
  const hasActions = !!actions && actions.length > 0;

  return (
    <div
      className={cn(
        styles.card,
        size === 'small' && styles.small,
        type === 'inner' && styles.inner,
        hoverable && styles.hoverable,
        !bordered && styles.noBorder,
        className
      )}
      style={style}
      {...props}
    >
      {cover && <div className={styles.cover}>{cover}</div>}

      {hasHeader && (
        <div className={styles.head} style={headStyle}>
          {title && <div className={styles.title}>{title}</div>}
          {extra && <div className={styles.extra}>{extra}</div>}
        </div>
      )}

      <div className={styles.body} style={bodyStyle}>
        {loading ? (
          <div className={styles.loading}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 'var(--token-primitive-icon-size-icon-size-3)',
                animation: 'spin 1s linear infinite',
              }}
            >
              progress_activity
            </span>
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </div>

      {hasActions && (
        <ul className={styles.actions}>
          {actions.map((action, index) => (
            <li key={index} className={styles.action}>
              {action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Card.Grid = CardGrid;
Card.Meta = CardMeta;

export default Card;
