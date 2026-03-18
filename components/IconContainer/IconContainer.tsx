import { cn } from '@/lib/utils';

import styles from './IconContainer.module.css';
import type { IProps } from './types';

const IconContainer = ({
  icon,
  shape = 'circle',
  size = 'md',
  className,
  children,
  ...rest
}: IProps) => (
  <div
    className={cn(
      styles.iconContainer,
      styles[size],
      styles[shape],
      className
    )}
    {...rest}
  >
    <span className={styles.icon}>{icon || children}</span>
  </div>
);

export default IconContainer;
