import type { HTMLAttributes, CSSProperties } from 'react';

export type PaginationSize = 'sm' | 'md' | 'lg' | 'default';
export type PaginationVariant = 'numbers' | 'input';
export type PageItem = number | 'jump-prev' | 'jump-next';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current page number */
  current?: number;
  /** Default current page number */
  defaultCurrent?: number;
  /** Number of data items per page */
  pageSize?: number;
  /** Default page size */
  defaultPageSize?: number;
  /** Total number of data items */
  total?: number;
  /** Callback when page or pageSize changes */
  onChange?: (page: number, pageSize: number) => void;
  /** Pagination variant */
  variant?: PaginationVariant;
  /** Disabled state */
  disabled?: boolean;
  /** Hide pagination when only one page */
  hideOnSinglePage?: boolean;
  /** Show fewer page numbers */
  showLessItems?: boolean;
  /** Size */
  size?: PaginationSize;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
}
