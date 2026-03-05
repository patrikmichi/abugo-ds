import { cn } from '@/lib/utils';

import styles from './Card.module.css';
import type { CardGridProps } from './types';

const CardGrid = ({
  hoverable = true,
  className,
  children,
  style,
  ...props
}: CardGridProps) => {
  return (
    <div
      className={cn(styles.grid, hoverable && styles.gridHoverable, className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardGrid;
