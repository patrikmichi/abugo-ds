import type React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type AvatarShape = 'circle' | 'rounded';

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
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
  /** Show border with background color */
  border?: boolean;
  /** Show accent color ring */
  ring?: boolean;
  /** Children - Avatar components */
  children?: React.ReactNode;
}
