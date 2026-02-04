import React from 'react';
import { cn } from '@/lib/utils';
import styles from './IconContainer.module.css';

export type IconContainerSize = 'xxsm' | 'xsm' | 'sm' | 'md' | 'lg';
export type IconContainerShape = 'circle' | 'rounded' | 'square';

export interface IconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The icon element to display inside the container */
  icon?: React.ReactNode;
  /** Shape of the container */
  shape?: IconContainerShape;
  /** Size of the container */
  size?: IconContainerSize;
}

/**
 * IconContainer - A decorative container for displaying icons
 *
 * Renders an icon centered within a shaped, colored container.
 * Supports circle, rounded, and square shapes with multiple size options.
 *
 * @example
 * ```tsx
 * <IconContainer icon={<MailIcon />} shape="circle" size="md" />
 * <IconContainer icon={<MailIcon />} shape="rounded" size="sm" />
 * <IconContainer icon={<MailIcon />} shape="square" size="lg" />
 * ```
 */
export function IconContainer({
  icon,
  shape = 'circle',
  size = 'md',
  className,
  children,
  ...rest
}: IconContainerProps) {
  return (
    <div
      className={cn(
        styles.iconContainer,
        styles[size],
        styles[shape],
        className
      )}
      {...rest}
    >
      <span className={styles.icon}>
        {icon || children}
      </span>
    </div>
  );
}
