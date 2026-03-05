import type { PageItem, PaginationSize } from './types';

export const getPageNumbers = (
  current: number,
  totalPages: number,
  showLessItems: boolean
): PageItem[] => {
  const pages: PageItem[] = [];

  if (showLessItems) {
    if (current > 1) pages.push(1);
    if (current > 2) pages.push('jump-prev');
    if (current > 1 && current < totalPages) pages.push(current);
    if (current < totalPages - 1) pages.push('jump-next');
    if (current < totalPages) pages.push(totalPages);
    return pages;
  }

  const maxVisible = 7;
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  if (current <= 3) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('jump-next', totalPages);
  } else if (current >= totalPages - 2) {
    pages.push(1, 'jump-prev');
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 'jump-prev');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('jump-next', totalPages);
  }

  return pages;
};

export const getSizeConfig = (size: PaginationSize) => ({
  buttonSize: size === 'default' || size === 'lg' ? 'md' : 'sm',
  iconSize: size === 'sm' ? 20 : 24,
} as const);
