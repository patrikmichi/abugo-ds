import React from 'react';
import styles from './Rating.module.css';
import { cn } from '@/lib/utils';

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rating value (0-5) */
  value: number;
  /** Maximum rating value */
  max?: number;
  /** Number of reviews */
  count?: number;
  /** Display mode: 'multi' shows all stars, 'single' shows one star */
  mode?: 'multi' | 'single';
  /** Custom class name */
  className?: string;
}

/**
 * Rating Component
 * 
 * Static rating display component showing stars and rating text.
 * 
 * @example
 * ```tsx
 * <Rating value={4.4} count={123} />
 * <Rating value={4.4} count={123} mode="single" />
 * ```
 */
export function Rating({
  value,
  max = 5,
  count,
  mode = 'multi',
  className,
  ...props
}: RatingProps) {
  // Clamp value between 0 and max
  const clampedValue = Math.max(0, Math.min(max, value));
  const fullStars = Math.floor(clampedValue);
  const hasPartialStar = clampedValue % 1 >= 0.1; // Show partial if >= 0.1
  const partialPercentage = hasPartialStar ? (clampedValue % 1) * 100 : 0;
  const emptyStars = max - fullStars - (hasPartialStar ? 1 : 0);

  const renderStars = () => {
    if (mode === 'single') {
      // Single star mode - show one filled star
      return (
        <span className={styles.star} aria-hidden="true">
          <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
            star
          </span>
        </span>
      );
    }

    // Multi-star mode
    return (
      <>
        {Array.from({ length: fullStars }).map((_, index) => (
          <span key={`full-${index}`} className={cn(styles.star, styles.filled)} aria-hidden="true">
            <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
              star
            </span>
          </span>
        ))}
        {hasPartialStar && (
          <span className={cn(styles.star, styles.partial)} aria-hidden="true">
            <span className={styles.starContainer}>
              <span className={styles.starFilled} style={{ width: `${partialPercentage}%` }}>
                <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
                  star
                </span>
              </span>
              <span className={styles.starEmpty}>
                <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
                  star
                </span>
              </span>
            </span>
          </span>
        )}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <span key={`empty-${index}`} className={cn(styles.star, styles.empty)} aria-hidden="true">
            <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
              star
            </span>
          </span>
        ))}
      </>
    );
  };

  return (
    <div
      className={cn(styles.rating, className)}
      role="img"
      aria-label={`Rating: ${clampedValue.toFixed(1)} out of ${max}${count ? ` (${count} reviews)` : ''}`}
      {...props}
    >
      <div className={styles.stars}>{renderStars()}</div>
      <span className={styles.text}>
        {clampedValue.toFixed(1)} / {max}
        {count !== undefined && <span className={styles.count}> ({count})</span>}
      </span>
    </div>
  );
}
