import type React from 'react';

export type CardSize = 'default' | 'small';
export type CardType = 'default' | 'inner';

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card title */
  title?: React.ReactNode;
  /** Content rendered in the top-right corner */
  extra?: React.ReactNode;
  /** Array of action elements displayed at the bottom */
  actions?: React.ReactNode[];
  /** Cover content (e.g., image) */
  cover?: React.ReactNode;
  /** Whether card is loading */
  loading?: boolean;
  /** Whether card lifts on hover */
  hoverable?: boolean;
  /** Whether to show border */
  bordered?: boolean;
  /** Size of card */
  size?: CardSize;
  /** Style type of card */
  type?: CardType;
  /** Custom styles for card header */
  headStyle?: React.CSSProperties;
  /** Custom styles for card body */
  bodyStyle?: React.CSSProperties;
  /** Children - card content */
  children?: React.ReactNode;
}

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether grid item lifts on hover */
  hoverable?: boolean;
  /** Children - grid content */
  children?: React.ReactNode;
}

export interface CardMetaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Avatar or icon */
  avatar?: React.ReactNode;
  /** Title */
  title?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
  /** Children - additional content */
  children?: React.ReactNode;
}
