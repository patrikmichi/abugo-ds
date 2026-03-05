import { cn } from '@/lib/utils';

import styles from './Rating.module.css';
import type { IProps } from './types';

const ICON_STYLE = { fontSize: 'var(--token-primitive-icon-size-icon-size-2)' };

const StarIcon = () => (
  <span className="material-symbols-outlined" style={ICON_STYLE}>
    star
  </span>
);

const Rating = ({
  value,
  max = 5,
  count,
  mode = 'multi',
  className,
  ...props
}: IProps) => {
  const clampedValue = Math.max(0, Math.min(max, value));
  const fullStars = Math.floor(clampedValue);
  const hasPartialStar = clampedValue % 1 >= 0.1;
  const partialPercentage = hasPartialStar ? (clampedValue % 1) * 100 : 0;
  const emptyStars = max - fullStars - (hasPartialStar ? 1 : 0);

  const renderStars = () => {
    if (mode === 'single') {
      return (
        <span className={styles.star} aria-hidden="true">
          <StarIcon />
        </span>
      );
    }

    return (
      <>
        {Array.from({ length: fullStars }).map((_, index) => (
          <span key={`full-${index}`} className={cn(styles.star, styles.filled)} aria-hidden="true">
            <StarIcon />
          </span>
        ))}
        {hasPartialStar && (
          <span className={cn(styles.star, styles.partial)} aria-hidden="true">
            <span className={styles.starContainer}>
              <span className={styles.starFilled} style={{ width: `${partialPercentage}%` }}>
                <StarIcon />
              </span>
              <span className={styles.starEmpty}>
                <StarIcon />
              </span>
            </span>
          </span>
        )}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <span key={`empty-${index}`} className={cn(styles.star, styles.empty)} aria-hidden="true">
            <StarIcon />
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
};

export default Rating;
