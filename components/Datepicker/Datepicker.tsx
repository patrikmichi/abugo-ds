import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './Datepicker.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';

export type DatePickerPicker = 'date' | 'week' | 'month' | 'quarter' | 'year';
export type DatePickerValue = Date | null;
export type DatePickerRangeValue = [Date | null, Date | null] | null;

// Date utility functions
const formatDate = (date: Date | null, format: string): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

const parseDate = (dateString: string, format: string): Date | null => {
  if (!dateString) return null;
  
  // Simple parser - can be enhanced
  const parts = dateString.split(/[-/]/);
  if (parts.length >= 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return null;
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  return new Date(result.setDate(diff));
};

const endOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() + (6 - day);
  return new Date(result.setDate(diff));
};

export interface DatePickerShowTime {
  format?: string;
  defaultValue?: Date;
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  hideDisabledOptions?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour?: number) => number[];
  disabledSeconds?: (selectedHour?: number, selectedMinute?: number) => number[];
}

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size'> {
  /** Current value (controlled) */
  value?: DatePickerValue;
  /** Default value (uncontrolled) */
  defaultValue?: DatePickerValue;
  /** Callback when value changes */
  onChange?: (date: DatePickerValue, dateString: string | string[]) => void;
  /** Picker type */
  picker?: DatePickerPicker;
  /** Date format */
  format?: string | string[];
  /** Show time picker */
  showTime?: boolean | DatePickerShowTime;
  /** Disable dates */
  disabledDate?: (current: Date) => boolean;
  /** Render extra footer */
  renderExtraFooter?: (mode: DatePickerPicker) => React.ReactNode;
  /** Placeholder */
  placeholder?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Suffix icon */
  suffixIcon?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Get calendar container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Open state (controlled) */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Allow clear */
  allowClear?: boolean;
  /** Show today button */
  showToday?: boolean;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
}

/**
 * DatePicker Component
 * 
 * Date picker component. 
 * 
 * @example
 * ```tsx
 * <DatePicker
 *   value={date}
 *   onChange={(date, dateString) => console.log(date, dateString)}
 *   format="YYYY-MM-DD"
 * />
 * ```
 */
export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  picker = 'date',
  format = 'YYYY-MM-DD',
  showTime = false,
  disabledDate,
  renderExtraFooter,
  placeholder = 'Select date',
  size = 'md',
  error = false,
  disabled = false,
  suffixIcon,
  className,
  style,
  getPopupContainer,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  allowClear = true,
  showToday = true,
  popupClassName,
  popupStyle,
  ...props
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<DatePickerValue>(defaultValue || null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [viewDate, setViewDate] = useState<Date>(() => controlledValue || defaultValue || new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const displayFormat = Array.isArray(format) ? format[0] : format;

  const displayValue = useMemo(() => {
    if (!value) return '';
    return formatDate(value, displayFormat);
  }, [value, displayFormat]);

  // Get padding-right token based on size to match Select
  const getPaddingRight = useCallback(() => {
    switch (size) {
      case 'sm':
        return 'var(--token-component-padding-right-field-select-sm)';
      case 'lg':
        return 'var(--token-component-padding-right-field-select-lg)';
      case 'md':
      default:
        return 'var(--token-component-padding-right-field-select-md)';
    }
  }, [size]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (!isOpenControlled) {
      setInternalOpen(true);
    }
    onOpenChange?.(true);
  }, [disabled, isOpenControlled, onOpenChange]);

  const handleClose = useCallback(() => {
    if (!isOpenControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  }, [isOpenControlled, onOpenChange]);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      const dateString = newValue ? formatDate(newValue, displayFormat) : '';
      onChange?.(newValue, dateString);
    },
    [isControlled, onChange, displayFormat]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange(null);
    },
    [handleChange]
  );

  // Calendar navigation
  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => addMonths(prev, -1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => addMonths(prev, 1));
  }, []);

  const handlePrevYear = useCallback(() => {
    setViewDate((prev) => addYears(prev, -1));
  }, []);

  const handleNextYear = useCallback(() => {
    setViewDate((prev) => addYears(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    handleChange(today);
    setViewDate(today);
  }, [handleChange]);

  const handleDateClick = useCallback(
    (date: Date) => {
      if (disabledDate?.(date)) return;
      handleChange(date);
      if (!showTime) {
        handleClose();
      }
    },
    [disabledDate, handleChange, showTime, handleClose]
  );

  // Update position when dropdown opens
  useEffect(() => {
    if (!open || !containerRef.current) return;

    const updatePosition = () => {
      const trigger = containerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const container = getPopupContainer ? getPopupContainer(trigger) : document.body;
      const containerRect = container.getBoundingClientRect();

      const width = rect.width;
      const top = rect.bottom - containerRect.top + 4;
      const left = rect.left - containerRect.left;

      setPosition({ top, left, width });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, getPopupContainer]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClose]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const startDate = startOfWeek(start);
    const endDate = endOfWeek(end);
    const days: Date[] = [];

    let current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [viewDate]);

  const getContainerElement = (): HTMLElement => {
    if (getPopupContainer && containerRef.current) {
      return getPopupContainer(containerRef.current);
    }
    return document.body;
  };

  const renderCalendar = () => {
    if (!open || !containerRef.current) return null;

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return createPortal(
      <div
        ref={panelRef}
        className={cn(styles.panel, popupClassName)}
        style={popupStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <button type="button" className={styles.navButton} onClick={handlePrevMonth} aria-label="Previous Month">
            <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
              chevron_left
            </span>
          </button>
          <div className={styles.monthYear}>
            {monthNames[viewDate.getMonth()]}, {viewDate.getFullYear()}
          </div>
          <button type="button" className={styles.navButton} onClick={handleNextMonth} aria-label="Next Month">
            <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
              chevron_right
            </span>
          </button>
        </div>
        <div className={styles.weekDays}>
          {weekDays.map((day) => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.calendar}>
          {calendarDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, viewDate);
            const isTodayDate = isToday(date);
            const isSelected = value && isSameDay(date, value);
            const isDisabled = disabledDate?.(date);
            const isHovered = hoverDate && isSameDay(date, hoverDate);

            return (
              <div
                key={index}
                className={cn(
                  styles.day,
                  !isCurrentMonth && styles.otherMonth,
                  isTodayDate && styles.today,
                  isSelected && styles.selected,
                  isDisabled && styles.disabled,
                  isHovered && styles.hovered
                )}
                onClick={() => !isDisabled && handleDateClick(date)}
                onMouseEnter={() => !isDisabled && setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
        {showToday && (
          <div className={styles.footer}>
            <button type="button" className={styles.todayButton} onClick={handleToday}>
              Today
            </button>
          </div>
        )}
        {renderExtraFooter && (
          <div className={styles.extraFooter}>{renderExtraFooter(picker)}</div>
        )}
      </div>,
      getContainerElement()
    );
  };

  return (
    <div ref={containerRef} className={cn(styles.datepickerWrapper, className)} style={style}>
      <Input
        value={displayValue}
        placeholder={placeholder}
        size={size}
        error={error}
        disabled={disabled}
        readOnly
        onClick={handleOpen}
        className={cn(styles.datepickerInput)}
        style={{
          paddingInlineEnd: getPaddingRight(),
        }}
        suffix={
          <>
            {allowClear && value && (
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)', cursor: 'pointer', marginRight: 'var(--token-primitive-spacing-1)' }}
                onClick={handleClear}
              >
                close
              </span>
            )}
            {suffixIcon || (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                calendar_today
              </span>
            )}
          </>
        }
        {...props}
      />
      {renderCalendar()}
    </div>
  );
}

export interface RangePickerProps extends Omit<DatePickerProps, 'value' | 'defaultValue' | 'onChange'> {
  /** Current value (controlled) */
  value?: DatePickerRangeValue;
  /** Default value (uncontrolled) */
  defaultValue?: DatePickerRangeValue;
  /** Callback when value changes */
  onChange?: (dates: DatePickerRangeValue, dateStrings: [string, string]) => void;
  /** Separator between dates */
  separator?: string;
}

/**
 * RangePicker Component
 * 
 * Date range picker. 
 */
export function RangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  separator = ' ~ ',
  ...props
}: RangePickerProps) {
  const [internalValue, setInternalValue] = useState<DatePickerRangeValue>(defaultValue || null);
  const [open, setOpen] = useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const displayFormat = Array.isArray(props.format) ? props.format[0] : props.format || 'YYYY-MM-DD';

  const displayValue = useMemo(() => {
    if (!value || !value[0] || !value[1]) return '';
    return `${formatDate(value[0], displayFormat)}${separator}${formatDate(value[1], displayFormat)}`;
  }, [value, displayFormat, separator]);

  const handleChange = useCallback(
    (dates: DatePickerRangeValue) => {
      if (!isControlled) {
        setInternalValue(dates);
      }
      if (dates && dates[0] && dates[1]) {
        onChange?.(dates, [formatDate(dates[0], displayFormat), formatDate(dates[1], displayFormat)]);
      }
    },
    [isControlled, onChange, displayFormat]
  );

  // Simplified range picker implementation
  // Full implementation would require a more complex calendar with range selection
  return (
    <div className={styles.rangePickerWrapper}>
      <Input
        value={displayValue}
        placeholder={props.placeholder || 'Start date ~ End date'}
        size={props.size}
        error={props.error}
        disabled={props.disabled}
        readOnly
        onClick={() => setOpen(!open)}
        suffix={
          <>
            {props.allowClear && value && value[0] && value[1] && (
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)', cursor: 'pointer', marginRight: 'var(--token-primitive-spacing-1)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(null);
                }}
              >
                close
              </span>
            )}
            <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
              calendar_today
            </span>
          </>
        }
      />
      {/* Range picker calendar would go here */}
    </div>
  );
}

// Attach RangePicker to DatePicker
(DatePicker as any).RangePicker = RangePicker;
