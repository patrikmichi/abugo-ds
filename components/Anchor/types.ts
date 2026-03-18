import type { HTMLAttributes, ReactNode } from 'react';

export interface AnchorLinkItem {
  key: string;
  href: string;
  title: ReactNode;
}

export interface IProps extends HTMLAttributes<HTMLDivElement> {
  /** Get scroll container */
  getContainer?: () => HTMLElement | Window;
  /** Offset from top when calculating scroll position */
  offsetTop?: number;
  /** Anchor items */
  items?: AnchorLinkItem[];
}
