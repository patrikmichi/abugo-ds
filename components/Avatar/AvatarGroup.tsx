import React from 'react';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';
import type { AvatarGroupProps, IProps } from './types';

// Forward declaration - will be set by index.tsx
let Avatar: React.ComponentType<IProps>;

export const setAvatarComponent = (component: React.ComponentType<IProps>) => {
  Avatar = component;
};

const AvatarGroup = ({
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
}: AvatarGroupProps) => {
  const avatars = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child)
  ) as React.ReactElement<IProps>[];

  const visibleAvatars = maxCount ? avatars.slice(0, maxCount) : avatars;
  const excessCount = maxCount ? avatars.length - maxCount : 0;

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
};

export default AvatarGroup;
