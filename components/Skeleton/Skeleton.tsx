import React from 'react';
import styles from './Skeleton.module.css';
import { cn } from '@/lib/utils';

export type SkeletonAvatarShape = 'circle' | 'square';
export type SkeletonAvatarSize = 'large' | 'small' | 'default' | number;
export type SkeletonButtonShape = 'circle' | 'round' | 'square' | 'default';
export type SkeletonButtonSize = 'large' | 'small' | 'default';

export interface SkeletonAvatarProps {
  /** Enable animation effect */
  active?: boolean;
  /** Shape of avatar */
  shape?: SkeletonAvatarShape;
  /** Size of avatar */
  size?: SkeletonAvatarSize;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface SkeletonTitleProps {
  /** Width of title */
  width?: number | string;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface SkeletonParagraphProps {
  /** Number of rows */
  rows?: number;
  /** Width of paragraph. If array, sets width for each row; otherwise sets width of last row */
  width?: number | string | Array<number | string>;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface SkeletonButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable animation effect */
  active?: boolean;
  /** Make button fit parent width */
  block?: boolean;
  /** Shape of button */
  shape?: SkeletonButtonShape;
  /** Size of button */
  size?: SkeletonButtonSize;
}

export interface SkeletonImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable animation effect */
  active?: boolean;
}

export interface SkeletonInputProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable animation effect */
  active?: boolean;
  /** Size of input */
  size?: 'large' | 'small' | 'default';
  /** Make input fit parent width */
  block?: boolean;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable animation effect */
  active?: boolean;
  /** Display avatar placeholder */
  avatar?: boolean | SkeletonAvatarProps;
  /** Show skeleton when true */
  loading?: boolean;
  /** Display paragraph placeholder */
  paragraph?: boolean | SkeletonParagraphProps;
  /** Apply border-radius to paragraph and title */
  round?: boolean;
  /** Display title placeholder */
  title?: boolean | SkeletonTitleProps;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Children (rendered when loading is false) */
  children?: React.ReactNode;
}

/**
 * Skeleton Avatar Component
 */
function SkeletonAvatar({
  active = false,
  shape = 'circle',
  size = 'default',
  className,
  style,
}: SkeletonAvatarProps) {
  const getSizeStyle = (): React.CSSProperties => {
    if (typeof size === 'number') {
      return { width: `${size}px`, height: `${size}px` };
    }
    return {};
  };

  return (
    <span
      className={cn(
        styles.avatar,
        styles[`avatar${shape.charAt(0).toUpperCase() + shape.slice(1)}`],
        size !== 'default' && typeof size !== 'number' && styles[`avatar${size.charAt(0).toUpperCase() + size.slice(1)}`],
        active && styles.active,
        className
      )}
      style={{ ...getSizeStyle(), ...style }}
    />
  );
}

/**
 * Skeleton Title Component
 */
function SkeletonTitle({ width, className, style }: SkeletonTitleProps) {
  return (
    <div
      className={cn(styles.title, className)}
      style={{ width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined, ...style }}
    />
  );
}

/**
 * Skeleton Paragraph Component
 */
function SkeletonParagraph({ rows = 3, width, className, style }: SkeletonParagraphProps) {
  const widths = Array.isArray(width) ? width : width ? [undefined, undefined, width] : undefined;

  return (
    <ul className={cn(styles.paragraph, className)} style={style}>
      {Array.from({ length: rows }).map((_, index) => (
        <li
          key={index}
          style={{
            width: widths?.[index] ? (typeof widths[index] === 'number' ? `${widths[index]}px` : widths[index]) : undefined,
          }}
        />
      ))}
    </ul>
  );
}

/**
 * Skeleton Button Component
 */
function SkeletonButton({
  active = false,
  block = false,
  shape = 'default',
  size = 'default',
  className,
  style,
  ...props
}: SkeletonButtonProps) {
  return (
    <div
      className={cn(
        styles.button,
        active && styles.active,
        block && styles.buttonBlock,
        shape !== 'default' && styles[`button${shape.charAt(0).toUpperCase() + shape.slice(1)}`],
        size !== 'default' && styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
        className
      )}
      style={style}
      {...props}
    />
  );
}

/**
 * Skeleton Image Component
 */
function SkeletonImage({ active = false, className, style, ...props }: SkeletonImageProps) {
  return (
    <div
      className={cn(styles.image, active && styles.active, className)}
      style={style}
      {...props}
    />
  );
}

/**
 * Skeleton Input Component
 */
function SkeletonInput({
  active = false,
  size = 'default',
  block = false,
  className,
  style,
  ...props
}: SkeletonInputProps) {
  return (
    <div
      className={cn(
        styles.input,
        active && styles.active,
        block && styles.inputBlock,
        size !== 'default' && styles[`input${size.charAt(0).toUpperCase() + size.slice(1)}`],
        className
      )}
      style={style}
      {...props}
    />
  );
}

/**
 * Skeleton Component
 * 
 * Placeholder for loading content, matching 
 * 
 * @example
 * ```tsx
 * <Skeleton active avatar paragraph={{ rows: 4 }} />
 * <Skeleton.Button active block />
 * <Skeleton.Image active />
 * <Skeleton.Input active block />
 * ```
 */
export function Skeleton({
  active = false,
  avatar = false,
  loading = true,
  paragraph = true,
  round = false,
  title = true,
  className,
  style,
  children,
  ...props
}: SkeletonProps) {
  if (!loading && children) {
    return <>{children}</>;
  }

  const avatarProps = typeof avatar === 'object' ? avatar : avatar ? {} : null;
  const titleProps = typeof title === 'object' ? title : title ? {} : null;
  const paragraphProps = typeof paragraph === 'object' ? paragraph : paragraph ? {} : null;

  return (
    <div
      className={cn(
        styles.skeleton,
        active && styles.active,
        round && styles.round,
        className
      )}
      style={style}
      {...props}
    >
      {avatarProps && <SkeletonAvatar {...avatarProps} active={active || avatarProps.active} />}
      <div className={styles.content}>
        {titleProps && <SkeletonTitle {...titleProps} />}
        {paragraphProps && <SkeletonParagraph {...paragraphProps} />}
      </div>
    </div>
  );
}

// Attach sub-components
(Skeleton as any).Avatar = SkeletonAvatar;
(Skeleton as any).Button = SkeletonButton;
(Skeleton as any).Image = SkeletonImage;
(Skeleton as any).Input = SkeletonInput;
