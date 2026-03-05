import type React from 'react';

export type SkeletonAvatarShape = 'circle' | 'square';
export type SkeletonAvatarSize = 'large' | 'small' | 'default' | number;
export type SkeletonButtonShape = 'circle' | 'round' | 'square' | 'default';
export type SkeletonButtonSize = 'large' | 'small' | 'default';
export type SkeletonInputSize = 'large' | 'small' | 'default';

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
  size?: SkeletonInputSize;
  /** Make input fit parent width */
  block?: boolean;
}

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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

export interface SkeletonComponent extends React.FC<SkeletonProps> {
  Avatar: React.FC<SkeletonAvatarProps>;
  Button: React.FC<SkeletonButtonProps>;
  Image: React.FC<SkeletonImageProps>;
  Input: React.FC<SkeletonInputProps>;
}
