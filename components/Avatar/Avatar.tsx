import React, { useState, useCallback } from 'react';
import styles from './Avatar.module.css';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type AvatarShape = 'circle' | 'rounded';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /** Image source URL */
  src?: string;
  /** List of image sources for different screen resolutions */
  srcSet?: string;
  /** Alternative text for the image */
  alt?: string;
  /** Custom icon for icon avatar */
  icon?: React.ReactNode;
  /** Shape of avatar */
  shape?: AvatarShape;
  /** Size of avatar */
  size?: AvatarSize;
  /** Show border with background color */
  border?: boolean;
  /** Show accent color ring */
  ring?: boolean;
  /** Unit distance between left and right sides for letter-type avatars */
  gap?: number;
  /** Whether the image is draggable */
  draggable?: boolean | 'true' | 'false';
  /** CORS settings attributes */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /** Callback when image fails to load. Return false to prevent default fallback. */
  onError?: () => boolean | void;
  /** Children - text content for letter avatar */
  children?: React.ReactNode;
}

/**
 * Avatar component - Display user profile picture, icon, or initials
 * 
 * Avatar component with support for:
 * - Images (with error handling)
 * - Icons
 * - Text/letters
 * - Multiple sizes and shapes
 * - Grouped avatars
 * 
 * @example
 * ```tsx
 * // Image avatar
 * <Avatar src="https://example.com/avatar.jpg" alt="User" />
 * 
 * // Icon avatar
 * <Avatar icon={<UserIcon />} />
 * 
 * // Letter avatar
 * <Avatar>JD</Avatar>
 * 
 * // Custom size
 * <Avatar size={64}>AB</Avatar>
 * 
 * // Rounded shape
 * <Avatar shape="rounded">CD</Avatar>
 * 
 * // With border and ring
 * <Avatar src="avatar.jpg" border ring />
 * ```
 */
export function Avatar({
  src,
  srcSet,
  alt,
  icon,
  shape = 'circle',
  size = 'md',
  gap = 4,
  draggable,
  crossOrigin,
  onError,
  className,
  children,
  style,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  // Handle image load error
  const handleError = useCallback(() => {
    const shouldPreventDefault = onError?.();
    if (shouldPreventDefault === false) {
      return; // Don't show fallback if onError returns false
    }
    setImgError(true);
    setImgSrc(undefined);
  }, [onError]);

  // Update imgSrc when src prop changes
  React.useEffect(() => {
    setImgSrc(src);
    setImgError(false);
  }, [src]);

  // Calculate size value
  const sizeValue = typeof size === 'number' ? size : undefined;
  const sizeClass = typeof size === 'string' ? size : 'custom';

  // Determine content type
  const hasImage = imgSrc && !imgError;
  const hasIcon = !!icon;
  const hasText = !!children && !hasImage && !hasIcon;

  // Calculate size styles
  const sizeStyle: React.CSSProperties = sizeValue
    ? {
        width: `${sizeValue}px`,
        height: `${sizeValue}px`,
        fontSize: `${sizeValue * 0.4}px`,
        lineHeight: `${sizeValue}px`,
      }
    : {};

  // Calculate gap for letter avatars
  const gapStyle: React.CSSProperties = hasText && gap
    ? {
        paddingLeft: `${gap}px`,
        paddingRight: `${gap}px`,
      }
    : {};

  // Calculate border radius for rounded shape (0.4 * height)
  // Only needed for custom numeric sizes, token sizes use CSS
  const roundedBorderRadius = shape === 'rounded' && sizeValue
    ? `${sizeValue * 0.4}px`
    : undefined;

  const roundedStyle: React.CSSProperties = roundedBorderRadius
    ? { borderRadius: roundedBorderRadius }
    : {};

  return (
    <span
      className={cn(
        styles.avatar,
        styles[shape],
        styles[sizeClass],
        hasImage && styles.hasImage,
        hasIcon && styles.hasIcon,
        hasText && styles.hasText,
        border && styles.border,
        ring && styles.ring,
        className
      )}
      style={{
        ...sizeStyle,
        ...gapStyle,
        ...roundedStyle,
        ...style,
      }}
      role="img"
      aria-label={alt || (typeof children === 'string' ? children : 'Avatar')}
      {...props}
    >
      {hasImage && (
        <img
          src={imgSrc}
          srcSet={srcSet}
          alt={alt}
          draggable={draggable}
          crossOrigin={crossOrigin}
          onError={handleError}
          className={styles.image}
        />
      )}
      {!hasImage && hasIcon && (
        <span className={styles.icon}>{icon}</span>
      )}
      {!hasImage && !hasIcon && hasText && (
        <span className={styles.text}>{children}</span>
      )}
    </span>
  );
}

// Avatar.Group component
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to display */
  maxCount?: number;
  /** Placement of popover for excess avatars */
  maxPopoverPlacement?: 'top' | 'bottom';
  /** Trigger for excess avatar popover */
  maxPopoverTrigger?: 'hover' | 'focus' | 'click';
  /** Custom style for excess avatar indicator */
  maxStyle?: React.CSSProperties;
  /** Size for all avatars in the group */
  size?: AvatarSize;
  /** Shape for all avatars in the group */
  shape?: AvatarShape;
  /** Children - Avatar components */
  children?: React.ReactNode;
}

/**
 * Avatar.Group component - Group multiple avatars together
 * 
 * @example
 * ```tsx
 * <Avatar.Group maxCount={3}>
 *   <Avatar src="avatar1.jpg" />
 *   <Avatar src="avatar2.jpg" />
 *   <Avatar src="avatar3.jpg" />
 *   <Avatar src="avatar4.jpg" />
 * </Avatar.Group>
 * ```
 */
export function AvatarGroup({
  maxCount,
  maxPopoverPlacement = 'top',
  maxPopoverTrigger = 'hover',
  maxStyle,
  size,
  shape,
  border,
  ring,
  className,
  children,
  style,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Avatar
  ) as React.ReactElement<AvatarProps>[];

  const visibleAvatars = maxCount ? avatars.slice(0, maxCount) : avatars;
  const excessCount = maxCount ? avatars.length - maxCount : 0;
  const excessAvatars = maxCount ? avatars.slice(maxCount) : [];

  // Clone avatars to inject size and shape
  const enhancedAvatars = visibleAvatars.map((avatar, index) => {
    if (React.isValidElement(avatar)) {
      return React.cloneElement(avatar, {
        key: avatar.key || index,
        size: size || avatar.props.size,
        shape: shape || avatar.props.shape,
        border: border !== undefined ? border : avatar.props.border,
        ring: ring !== undefined ? ring : avatar.props.ring,
        className: cn(styles.groupAvatar, avatar.props.className),
      });
    }
    return avatar;
  });

  return (
    <div
      className={cn(styles.group, className)}
      style={style}
      {...props}
    >
      {enhancedAvatars}
      {excessCount > 0 && (
        <span
          className={cn(styles.excess, styles[`excess-${maxPopoverTrigger}`])}
          style={maxStyle}
          title={`+${excessCount} more`}
        >
          +{excessCount}
        </span>
      )}
    </div>
  );
}

// Attach Group to Avatar for convenience (Avatar.Group)
(Avatar as any).Group = AvatarGroup;
