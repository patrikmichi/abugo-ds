import type React from 'react';

export type IconContainerSize = 'xxsm' | 'xsm' | 'sm' | 'md' | 'lg';
export type IconContainerShape = 'circle' | 'rounded' | 'square';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The icon element to display inside the container */
  icon?: React.ReactNode;
  /** Shape of the container */
  shape?: IconContainerShape;
  /** Size of the container */
  size?: IconContainerSize;
}
