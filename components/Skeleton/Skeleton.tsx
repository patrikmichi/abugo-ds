import { cn } from '@/lib/utils';
import styles from './Skeleton.module.css';
import type {
  SkeletonProps,
  SkeletonAvatarProps,
  SkeletonTitleProps,
  SkeletonParagraphProps,
  SkeletonButtonProps,
  SkeletonImageProps,
  SkeletonInputProps,
  SkeletonComponent,
} from './types';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const formatWidth = (width: number | string | undefined) => {
  if (width === undefined) return undefined;
  return typeof width === 'number' ? `${width}px` : width;
};

const SkeletonAvatar = ({
  active = false,
  shape = 'circle',
  size = 'default',
  className,
  style,
}: SkeletonAvatarProps) => {
  const sizeStyle = typeof size === 'number'
    ? { width: `${size}px`, height: `${size}px` }
    : {};

  const sizeClass = typeof size === 'string' && size !== 'default'
    ? styles[`avatar${capitalize(size)}`]
    : undefined;

  return (
    <span
      className={cn(
        styles.avatar,
        styles[`avatar${capitalize(shape)}`],
        sizeClass,
        active && styles.active,
        className
      )}
      style={{ ...sizeStyle, ...style }}
    />
  );
};

const SkeletonTitle = ({ width, className, style }: SkeletonTitleProps) => (
  <div
    className={cn(styles.title, className)}
    style={{ width: formatWidth(width), ...style }}
  />
);

const SkeletonParagraph = ({ rows = 3, width, className, style }: SkeletonParagraphProps) => {
  const widths = Array.isArray(width) ? width : width ? [undefined, undefined, width] : undefined;

  return (
    <ul className={cn(styles.paragraph, className)} style={style}>
      {Array.from({ length: rows }).map((_, index) => (
        <li key={index} style={{ width: formatWidth(widths?.[index]) }} />
      ))}
    </ul>
  );
};

const SkeletonButton = ({
  active = false,
  block = false,
  shape = 'default',
  size = 'default',
  className,
  style,
  ...props
}: SkeletonButtonProps) => {
  const shapeClass = shape !== 'default' ? styles[`button${capitalize(shape)}`] : undefined;
  const sizeClass = size !== 'default' ? styles[`button${capitalize(size)}`] : undefined;

  return (
    <div
      className={cn(
        styles.button,
        active && styles.active,
        block && styles.buttonBlock,
        shapeClass,
        sizeClass,
        className
      )}
      style={style}
      {...props}
    />
  );
};

const SkeletonImage = ({ active = false, className, style, ...props }: SkeletonImageProps) => (
  <div
    className={cn(styles.image, active && styles.active, className)}
    style={style}
    {...props}
  />
);

const SkeletonInput = ({
  active = false,
  size = 'default',
  block = false,
  className,
  style,
  ...props
}: SkeletonInputProps) => {
  const sizeClass = size !== 'default' ? styles[`input${capitalize(size)}`] : undefined;

  return (
    <div
      className={cn(
        styles.input,
        active && styles.active,
        block && styles.inputBlock,
        sizeClass,
        className
      )}
      style={style}
      {...props}
    />
  );
};

const Skeleton = ({
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
}: SkeletonProps) => {
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
};

Skeleton.Avatar = SkeletonAvatar;
Skeleton.Button = SkeletonButton;
Skeleton.Image = SkeletonImage;
Skeleton.Input = SkeletonInput;

export default Skeleton as SkeletonComponent;
