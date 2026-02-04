import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './Datepicker.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import {
  formatDate,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from './utils';
import type { DatePickerValue, DatePickerPreset, DatePickerProps } from './types';

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
  format = 'ddd, MMM D, YYYY',
  showTime = false,
  disabledDate,

  placeholder = 'Select date',
  size = 'md',
  error = false,
  disabled = false,
  suffixIcon,
  className,
  style,
  getPopupContainer,
  allowClear = true,
  popupClassName,
  popupStyle,
  presets,
  onCancel,
  onSave,
  cancelText = 'Cancel',
  saveText = 'Save',
  ...props
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<DatePickerValue>(defaultValue || null);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => controlledValue || defaultValue || new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [pendingValue, setPendingValue] = useState<DatePickerValue>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const hasPresets = presets && presets.length > 0;

  const displayFormat = Array.isArray(format) ? format[0] : format;

  const displayValue = useMemo(() => {
    if (!value) return '';
    return formatDate(value, displayFormat);
  }, [value, displayFormat]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

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

  const handleDateClick = useCallback(
    (date: Date) => {
      if (disabledDate?.(date)) return;
      if (hasPresets) {
        setPendingValue(date);
        setViewDate(date);
      } else {
        handleChange(date);
        if (!showTime) {
          handleClose();
        }
      }
    },
    [disabledDate, handleChange, showTime, handleClose, hasPresets]
  );

  const handlePresetClick = useCallback(
    (preset: DatePickerPreset) => {
      const date = typeof preset.value === 'function' ? preset.value() : preset.value;
      setPendingValue(date);
      setViewDate(date);
    },
    []
  );

  const handleSave = useCallback(() => {
    if (pendingValue) {
      handleChange(pendingValue);
      const dateString = formatDate(pendingValue, displayFormat);
      onSave?.(pendingValue, dateString);
    }
    setPendingValue(null);
    handleClose();
  }, [pendingValue, handleChange, displayFormat, onSave, handleClose]);

  const handleCancelClick = useCallback(() => {
    setPendingValue(null);
    onCancel?.();
    handleClose();
  }, [onCancel, handleClose]);

  // Update position when dropdown opens
  useEffect(() => {
    if (!open || !containerRef.current) {
      setPosition(null);
      return;
    }

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

  // Sync pendingValue when panel opens in presets mode
  useEffect(() => {
    if (open && hasPresets) {
      setPendingValue(value);
    }
  }, [open, hasPresets, value]);

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

  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

  // The selected date used for highlighting in the calendar grid
  const activeDate = hasPresets ? pendingValue : value;

  const renderCalendarContent = () => {
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <>
        <div className={styles.header}>
          <button type="button" className={styles.navButton} onClick={handlePrevMonth} aria-label="Previous Month">
            <span className={cn('material-symbols-outlined', styles.icon, styles.navIcon)}>
              chevron_left
            </span>
          </button>
          <div className={styles.monthYear}>
            {monthNames[viewDate.getMonth()]}, {viewDate.getFullYear()}
          </div>
          <button type="button" className={styles.navButton} onClick={handleNextMonth} aria-label="Next Month">
            <span className={cn('material-symbols-outlined', styles.icon, styles.navIcon)}>
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
            const isSelected = activeDate && isSameDay(date, activeDate);
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
      </>
    );
  };

  const renderCalendar = () => {
    if (!open || !containerRef.current) return null;

    const panelContent = hasPresets ? (
      <div
        ref={panelRef}
        className={cn(styles.panel, styles.panelWithPresets, sizeClass, popupClassName)}
        style={{
          ...popupStyle,
          position: 'absolute',
          top: position ? `${position.top}px` : undefined,
          left: position ? `${position.left}px` : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.panelBody}>
          <div className={styles.sidebar}>
            {presets!.map((preset, index) => {
              const presetDate = typeof preset.value === 'function' ? preset.value() : preset.value;
              const isActive = pendingValue && isSameDay(pendingValue, presetDate);
              return (
                <button
                  key={index}
                  type="button"
                  className={cn(styles.sidebarButton, isActive && styles.sidebarButtonActive)}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className={styles.calendarArea}>
            {renderCalendarContent()}
          </div>
        </div>
        <div className={styles.panelFooter}>
          <Button variant="secondary" appearance="plain" size="sm" onClick={handleCancelClick}>
            {cancelText}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            {saveText}
          </Button>
        </div>
      </div>
    ) : (
      <div
        ref={panelRef}
        className={cn(styles.panel, sizeClass, popupClassName)}
        style={{
          ...popupStyle,
          position: 'absolute',
          top: position ? `${position.top}px` : undefined,
          left: position ? `${position.left}px` : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderCalendarContent()}
      </div>
    );

    return createPortal(panelContent, getContainerElement());
  };

  const iconSize = size === 'sm' ? 'var(--token-component-icon-field-sm, 20px)' : 'var(--token-component-icon-field-md, 24px)';

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
        prefix={
          suffixIcon || (
            <span className="material-symbols-outlined" style={{ fontSize: iconSize }}>
              calendar_today
            </span>
          )
        }
        suffix={
          allowClear && value && !disabled ? (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: iconSize, cursor: 'pointer' }}
              onClick={handleClear}
            >
              cancel
            </span>
          ) : undefined
        }
        {...props}
      />
      {renderCalendar()}
    </div>
  );
}
