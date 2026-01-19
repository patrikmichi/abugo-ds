import React from 'react';
import styles from './Card.module.css';
import { cn } from '@/lib/utils';

export type CardSize = 'default' | 'small';
export type CardType = 'default' | 'inner';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card title */
  title?: React.ReactNode;
  /** Content rendered in the top-right corner */
  extra?: React.ReactNode;
  /** Array of action elements displayed at the bottom */
  actions?: React.ReactNode[];
  /** Cover content (e.g., image) */
  cover?: React.ReactNode;
  /** Whether card is loading */
  loading?: boolean;
  /** Whether card lifts on hover */
  hoverable?: boolean;
  /** Whether to show border */
  bordered?: boolean;
  /** Size of card */
  size?: CardSize;
  /** Style type of card */
  type?: CardType;
  /** Custom styles for card header */
  headStyle?: React.CSSProperties;
  /** Custom styles for card body */
  bodyStyle?: React.CSSProperties;
  /** Children - card content */
  children?: React.ReactNode;
}

/**
 * Card component - Display content related to a single subject
 * 
 * Card component with support for:
 * - Title and extra header content
 * - Actions at bottom
 * - Cover image
 * - Loading state
 * - Hoverable effect
 * - Size variants
 * - Grid and Meta sub-components
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card title="Card Title">
 *   <p>Card content</p>
 * </Card>
 * 
 * // With cover and actions
 * <Card
 *   title="Card Title"
 *   extra={<a href="#">More</a>}
 *   cover={<img src="cover.jpg" alt="Cover" />}
 *   actions={[<Button>Action 1</Button>, <Button>Action 2</Button>]}
 * >
 *   <p>Card content</p>
 * </Card>
 * 
 * // With Meta
 * <Card>
 *   <Card.Meta
 *     avatar={<Avatar src="avatar.jpg" />}
 *     title="Title"
 *     description="Description"
 *   />
 * </Card>
 * ```
 */
export function Card({
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
}: CardProps) {
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
          {title && (
            <div className={styles.title}>
              {title}
            </div>
          )}
          {extra && (
            <div className={styles.extra}>
              {extra}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.body} style={bodyStyle}>
        {loading ? (
          <div className={styles.loading}>
            <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-3)', animation: 'spin 1s linear infinite' }}>
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
}

// Card.Grid component
export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether grid item lifts on hover */
  hoverable?: boolean;
  /** Children - grid content */
  children?: React.ReactNode;
}

/**
 * Card.Grid component - Grid-style layout within a card
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Grid>Grid Item 1</Card.Grid>
 *   <Card.Grid>Grid Item 2</Card.Grid>
 *   <Card.Grid>Grid Item 3</Card.Grid>
 * </Card>
 * ```
 */
export function CardGrid({
  hoverable = true,
  className,
  children,
  style,
  ...props
}: CardGridProps) {
  return (
    <div
      className={cn(
        styles.grid,
        hoverable && styles.gridHoverable,
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

// Card.Meta component
export interface CardMetaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Avatar or icon */
  avatar?: React.ReactNode;
  /** Title */
  title?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
  /** Children - additional content */
  children?: React.ReactNode;
}

/**
 * Card.Meta component - Display metadata (avatar, title, description)
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Meta
 *     avatar={<Avatar src="avatar.jpg" />}
 *     title="Card Title"
 *     description="Card description"
 *   />
 * </Card>
 * ```
 */
export function CardMeta({
  avatar,
  title,
  description,
  className,
  children,
  style,
  ...props
}: CardMetaProps) {
  return (
    <div
      className={cn(styles.meta, className)}
      style={style}
      {...props}
    >
      {avatar && <div className={styles.metaAvatar}>{avatar}</div>}
      <div className={styles.metaContent}>
        {title && <div className={styles.metaTitle}>{title}</div>}
        {description && <div className={styles.metaDescription}>{description}</div>}
        {children}
      </div>
    </div>
  );
}

// Attach sub-components to Card
(Card as any).Grid = CardGrid;
(Card as any).Meta = CardMeta;
