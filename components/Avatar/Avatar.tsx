import React, { useState, useCallback, useEffect } from 'react';

import { cn } from '@/lib/utils';

import AvatarGroup, { setAvatarComponent } from './AvatarGroup';
import styles from './styles.module.css';
import type { IProps } from './types';

const Avatar = ({
  src,
  srcSet,
  alt,
  icon,
  shape = 'rounded',
  size = 'md',
  border = false,
  ring = false,
  gap = 4,
  draggable,
  crossOrigin,
  onError,
  className,
  children,
  style,
  ...props
}: IProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  const handleError = useCallback(() => {
    const shouldPreventDefault = onError?.();
    if (shouldPreventDefault === false) {
      return;
    }
    setImgError(true);
    setImgSrc(undefined);
  }, [onError]);

  useEffect(() => {
    setImgSrc(src);
    setImgError(false);
  }, [src]);

  const sizeValue = typeof size === 'number' ? size : undefined;
  const sizeClass = typeof size === 'string' ? size : 'custom';

  const hasImage = imgSrc && !imgError;
  const hasIcon = !!icon;
  const hasText = !!children && !hasImage && !hasIcon;

  const sizeStyle: React.CSSProperties = sizeValue
    ? {
        width: `${sizeValue}px`,
        height: `${sizeValue}px`,
        fontSize: `${sizeValue * 0.4}px`,
        lineHeight: `${sizeValue}px`,
      }
    : {};

  const gapStyle: React.CSSProperties =
    hasText && gap
      ? {
          paddingLeft: `${gap}px`,
          paddingRight: `${gap}px`,
        }
      : {};

  const roundedBorderRadius =
    shape === 'rounded' && sizeValue ? `${sizeValue * 0.4}px` : undefined;

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
      {!hasImage && hasIcon && <span className={styles.icon}>{icon}</span>}
      {!hasImage && !hasIcon && hasText && <span className={styles.text}>{children}</span>}
    </span>
  );
};

// Set Avatar component reference for AvatarGroup
setAvatarComponent(Avatar);

Avatar.Group = AvatarGroup;

export default Avatar;
