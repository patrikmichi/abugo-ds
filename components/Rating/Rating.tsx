import { cn } from '@/lib/utils';

import styles from './Rating.module.css';
import type { IProps } from './types';

const StarIcon = ({ name = 'star', filled }: { name?: string; filled?: boolean }) => (
  <span
    className="material-symbols-outlined"
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

const Rating = ({
  value,
  max = 5,
  count,
  mode = 'multi',
  size = 'sm',
  className,
  ...props
}: IProps) => {
  const clampedValue = Math.max(0, Math.min(max, value));
  const fullStars = Math.floor(clampedValue);
  const hasHalfStar = clampedValue % 1 >= 0.25;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    if (mode === 'single') {
      return (
        <span className={cn(styles.star, styles.filled)} aria-hidden="true">
          <StarIcon filled />
        </span>
      );
    }

    return (
      <>
        {Array.from({ length: fullStars }).map((_, index) => (
          <span key={`full-${index}`} className={cn(styles.star, styles.filled)} aria-hidden="true">
            <StarIcon filled />
          </span>
        ))}
        {hasHalfStar && (
          <span className={cn(styles.star, styles.half)} aria-hidden="true">
            <StarIcon name="star_half" filled />
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
      className={cn(styles.rating, styles[size], className)}
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
