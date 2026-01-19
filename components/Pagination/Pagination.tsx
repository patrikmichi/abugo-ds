import React, { useState, useCallback, useMemo, useEffect } from 'react';
import styles from './Pagination.module.css';
import { cn } from '@/lib/utils';
import { Button, ButtonIcon } from '@/components/Button';
import { Input } from '@/components/Input';

export type PaginationSize = 'sm' | 'md' | 'lg' | 'default';
export type PaginationVariant = 'numbers' | 'input';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
  style?: React.CSSProperties;
}

/**
 * Pagination Component
 */
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

  const isCurrentControlled = controlledCurrent !== undefined;
  const current = isCurrentControlled ? controlledCurrent : internalCurrent;

  const pageSize = controlledPageSize !== undefined ? controlledPageSize : defaultPageSize;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  // Sync input value with current page
  useEffect(() => {
    setInputValue(String(current));
  }, [current]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (disabled || newPage < 1 || newPage > totalPages || newPage === current) return;

      if (!isCurrentControlled) {
        setInternalCurrent(newPage);
      }
      onChange?.(newPage, pageSize);
    },
    [disabled, totalPages, current, isCurrentControlled, onChange, pageSize]
  );

  const handleJumpPrev = useCallback(() => {
    if (disabled) return;
    const newPage = Math.max(1, current - 5);
    handlePageChange(newPage);
  }, [disabled, current, handlePageChange]);

  const handleJumpNext = useCallback(() => {
    if (disabled) return;
    const newPage = Math.min(totalPages, current + 5);
    handlePageChange(newPage);
  }, [disabled, current, totalPages, handlePageChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const newPage = parseInt(inputValue, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      handlePageChange(newPage);
    } else {
      setInputValue(String(current));
    }
  };

  const handleInputPressEnter = () => {
    handleInputBlur();
  };

  // Generate page numbers to display
  const getPageNumbers = useCallback(() => {
    const pages: (number | 'jump-prev' | 'jump-next')[] = [];

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
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('jump-next');
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push('jump-prev');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('jump-prev');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('jump-next');
        pages.push(totalPages);
      }
    }
    return pages;
  }, [current, totalPages, showLessItems]);

  // Hide if only one page and hideOnSinglePage is true
  if (hideOnSinglePage && totalPages <= 1) {
    return null;
  }

  const paginationSize = size === 'default' ? 'md' : size === 'lg' ? 'md' : 'sm';
  const itemSizeClass = size === 'sm' ? styles.sm : styles.lg;
  const iconSize = size === 'sm' ? 20 : 24;

  const renderPrevButton = () => (
    <Button
      variant="secondary"
      appearance="plain"
      size={paginationSize}
      iconOnly
      disabled={disabled || current === 1}
      onClick={() => handlePageChange(current - 1)}
      aria-label="Previous page"
      className={styles.navButton}
    >
      <ButtonIcon name="chevron_left" size={iconSize} />
    </Button>
  );

  const renderNextButton = () => (
    <Button
      variant="secondary"
      appearance="plain"
      size={paginationSize}
      iconOnly
      disabled={disabled || current === totalPages}
      onClick={() => handlePageChange(current + 1)}
      aria-label="Next page"
      className={styles.navButton}
    >
      <ButtonIcon name="chevron_right" size={iconSize} />
    </Button>
  );

  // Numbers Variant
  if (variant === 'numbers') {
    const pageNumbers = getPageNumbers();
    return (
      <nav
        className={cn(styles.pagination, itemSizeClass, className)}
        style={style}
        aria-label="Pagination"
        {...props}
      >
        <div className={styles.pages}>
          {renderPrevButton()}

          {pageNumbers.map((page, index) => {
            if (page === 'jump-prev') {
              return (
                <Button
                  key={`jump-prev-${index}`}
                  variant="secondary"
                  appearance="plain"
                  size={paginationSize}
                  iconOnly
                  disabled={disabled}
                  onClick={handleJumpPrev}
                  aria-label="Jump Backward"
                  className={styles.jumpButton}
                >
                  <ButtonIcon name="more_horiz" size={iconSize} />
                </Button>
              );
            }

            if (page === 'jump-next') {
              return (
                <Button
                  key={`jump-next-${index}`}
                  variant="secondary"
                  appearance="plain"
                  size={paginationSize}
                  iconOnly
                  disabled={disabled}
                  onClick={handleJumpNext}
                  aria-label="Jump Forward"
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
                size={paginationSize}
                disabled={disabled}
                onClick={() => handlePageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === current ? 'page' : undefined}
                className={cn(styles.pageButton, page === current && styles.active)}
              >
                {page}
              </Button>
            );
          })}

          {renderNextButton()}
        </div>
      </nav>
    );
  }

  // Input Variant
  return (
    <nav
      className={cn(styles.pagination, styles.inputVariant, itemSizeClass, className)}
      style={style}
      aria-label="Pagination"
      {...props}
    >
      <div className={styles.inputContainer}>
        {renderPrevButton()}
        <div className={styles.pageInputWrapper}>
          <Input
            size={paginationSize}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onPressEnter={handleInputPressEnter}
            disabled={disabled}
            className={styles.innerInputWrapper}
          />
        </div>
        <span className={styles.totalText}>
          of {totalPages}
        </span>
        {renderNextButton()}
      </div>
    </nav>
  );
}
