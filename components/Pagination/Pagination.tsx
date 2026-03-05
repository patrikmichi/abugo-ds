import React, { useState, useMemo, useEffect } from 'react';
import styles from './Pagination.module.css';
import { cn } from '@/lib/utils';
import { Button, ButtonIcon } from '@/components/Button';
import { Input } from '@/components/Input';
import { getPageNumbers, getSizeConfig } from './utils';
import type { PaginationProps, PageItem } from './types';

export function Pagination({
  current: controlledCurrent,
  defaultCurrent = 1,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  total = 0,
  onChange,
  variant = 'numbers',
  disabled = false,
  hideOnSinglePage = false,
  showLessItems = false,
  size = 'default',
  className,
  style,
  ...props
}: PaginationProps) {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const [inputValue, setInputValue] = useState(String(defaultCurrent));

  const isControlled = controlledCurrent !== undefined;
  const current = isControlled ? controlledCurrent : internalCurrent;
  const pageSize = controlledPageSize ?? defaultPageSize;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const { buttonSize, iconSize } = getSizeConfig(size);
  const sizeClass = size === 'sm' ? styles.sm : styles.lg;

  useEffect(() => {
    setInputValue(String(current));
  }, [current]);

  const handlePageChange = (newPage: number) => {
    if (disabled || newPage < 1 || newPage > totalPages || newPage === current) return;
    if (!isControlled) setInternalCurrent(newPage);
    onChange?.(newPage, pageSize);
  };

  const handleInputBlur = () => {
    const newPage = parseInt(inputValue, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      handlePageChange(newPage);
    } else {
      setInputValue(String(current));
    }
  };

  if (hideOnSinglePage && totalPages <= 1) return null;

  const NavButton = ({ direction }: { direction: 'prev' | 'next' }) => {
    const isPrev = direction === 'prev';
    return (
      <Button
        variant="secondary"
        appearance="plain"
        size={buttonSize}
        iconOnly
        disabled={disabled || current === (isPrev ? 1 : totalPages)}
        onClick={() => handlePageChange(current + (isPrev ? -1 : 1))}
        aria-label={isPrev ? 'Previous page' : 'Next page'}
        className={styles.navButton}
      >
        <ButtonIcon name={isPrev ? 'chevron_left' : 'chevron_right'} size={iconSize} />
      </Button>
    );
  };

  const renderPageItem = (page: PageItem, index: number) => {
    if (page === 'jump-prev' || page === 'jump-next') {
      return (
        <Button
          key={`${page}-${index}`}
          variant="secondary"
          appearance="plain"
          size={buttonSize}
          iconOnly
          disabled={disabled}
          onClick={() => handlePageChange(current + (page === 'jump-prev' ? -5 : 5))}
          aria-label={page === 'jump-prev' ? 'Jump Backward' : 'Jump Forward'}
          className={styles.jumpButton}
        >
          <ButtonIcon name="more_horiz" size={iconSize} />
        </Button>
      );
    }

    return (
      <Button
        key={page}
        variant="secondary"
        appearance={page === current ? 'filled' : 'plain'}
        size={buttonSize}
        disabled={disabled}
        onClick={() => handlePageChange(page)}
        aria-label={`Page ${page}`}
        aria-current={page === current ? 'page' : undefined}
        className={cn(styles.pageButton, page === current && styles.active)}
      >
        {page}
      </Button>
    );
  };

  if (variant === 'numbers') {
    const pages = getPageNumbers(current, totalPages, showLessItems);
    return (
      <nav className={cn(styles.pagination, sizeClass, className)} style={style} aria-label="Pagination" {...props}>
        <div className={styles.pages}>
          <NavButton direction="prev" />
          {pages.map(renderPageItem)}
          <NavButton direction="next" />
        </div>
      </nav>
    );
  }

  return (
    <nav className={cn(styles.pagination, styles.inputVariant, sizeClass, className)} style={style} aria-label="Pagination" {...props}>
      <div className={styles.inputContainer}>
        <NavButton direction="prev" />
        <div className={styles.pageInputWrapper}>
          <Input
            size={buttonSize}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputBlur}
            onPressEnter={handleInputBlur}
            disabled={disabled}
            className={styles.innerInputWrapper}
          />
        </div>
        <span className={styles.totalText}>of {totalPages}</span>
        <NavButton direction="next" />
      </div>
    </nav>
  );
}
