import type React from 'react';

export interface ImagePreviewProps {
  /** Whether preview is visible */
  visible?: boolean;
  /** Callback when preview visibility changes */
  onVisibleChange?: (visible: boolean) => void;
  /** Container to render preview in */
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
  /** Preview image source */
  src?: string;
  /** Preview mask content */
  mask?: React.ReactNode;
  /** Preview mask class name */
  maskClassName?: string;
  /** Current image index (for preview group) */
  current?: number;
  /** Custom preview operations */
  toolbarRender?: (originalNode: React.ReactNode) => React.ReactNode;
}

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'> {
  /** Image source */
  src?: string;
  /** Alternative text */
  alt?: string;
  /** Image width */
  width?: number | string;
  /** Image height */
  height?: number | string;
  /** Whether to enable preview */
  preview?: boolean | ImagePreviewProps;
  /** Placeholder while loading */
  placeholder?: boolean | React.ReactNode;
  /** Fallback image source */
  fallback?: string;
  /** Whether to lazy load */
  loading?: 'lazy' | 'eager';
  /** Callback when image loads */
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Callback when image fails to load */
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Root class name */
  rootClassName?: string;
}

export interface ImagePreviewGroupProps {
  /** Preview configuration */
  preview?: boolean | ImagePreviewProps;
  /** Children images */
  children: React.ReactNode;
}
