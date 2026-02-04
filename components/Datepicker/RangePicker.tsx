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
  getCalendarDays,
  isDateInRange,
} from './utils';
import type { DatePickerRangeValue, RangePickerProps, DatePickerRangePreset } from './types';

/**
 * RangePicker Component
 *
 * Dual-calendar date range picker.
 */
export function RangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  separator = ' – ',
  size = 'md',
  format = 'ddd, MMM D, YYYY',
  placeholder,
  error = false,
  disabled = false,
  allowClear = true,
  disabledDate,
  className,
  style,
  suffixIcon,
  getPopupContainer,
  presets,
  onCancel,
  onSave,
  cancelText = 'Cancel',
  saveText = 'Save',
  ...props
}: RangePickerProps) {
  const [internalValue, setInternalValue] = useState<DatePickerRangeValue>(defaultValue || null);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => {
    const initial = controlledValue?.[0] || defaultValue?.[0] || new Date();
    return initial;
  });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  // Selection state: null = pick start, Date = start picked, picking end
  const [selectingStart, setSelectingStart] = useState<Date | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [pendingValue, setPendingValue] = useState<DatePickerRangeValue>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const hasPresets = presets && presets.length > 0;

  const displayFormat = Array.isArray(format) ? format[0] : format;

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
      } else if (!dates) {
        onChange?.(null, ['', '']);
      }
    },
    [isControlled, onChange, displayFormat]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectingStart(null);
    setHoverDate(null);
    setPendingValue(null);
  }, []);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (open) {
      handleClose();
      return;
    }
    setOpen(true);
    setSelectingStart(null);
    if (value?.[0]) {
      setViewDate(new Date(value[0]));
    } else {
      setViewDate(new Date());
    }
  }, [disabled, open, handleClose, value]);

  const handlePresetClick = useCallback(
    (preset: DatePickerRangePreset) => {
      const range = typeof preset.value === 'function' ? preset.value() : preset.value;
      setPendingValue(range);
      if (range && range[0]) {
        setViewDate(range[0]);
      }
    },
    []
  );

  const handleSave = useCallback(() => {
    if (pendingValue && pendingValue[0] && pendingValue[1]) {
      handleChange(pendingValue);
      onSave?.(pendingValue, [
        formatDate(pendingValue[0], displayFormat),
        formatDate(pendingValue[1], displayFormat),
      ]);
    }
    setPendingValue(null);
    handleClose();
  }, [pendingValue, handleChange, displayFormat, onSave, handleClose]);

  const handleCancelClick = useCallback(() => {
    setPendingValue(null);
    onCancel?.();
    handleClose();
  }, [onCancel, handleClose]);

  // Position panel
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // Click outside
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

  const handleDateClick = useCallback(
    (date: Date) => {
      if (disabledDate?.(date)) return;
      if (!selectingStart) {
        // First click: pick start date
        setSelectingStart(date);
      } else {
        // Second click: pick end date
        let start = selectingStart;
        let end = date;
        if (end < start) {
          [start, end] = [end, start];
        }
        if (hasPresets) {
          // In presets mode, update pending value and don't close
          setPendingValue([start, end]);
          setSelectingStart(null);
        } else {
          // Normal mode: apply immediately and close
          handleChange([start, end]);
          handleClose();
        }
      }
    },
    [selectingStart, handleChange, handleClose, disabledDate, hasPresets]
  );

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => addMonths(prev, -1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => addMonths(prev, 1));
  }, []);

  // Left calendar = viewDate, right calendar = viewDate + 1 month
  const rightViewDate = useMemo(() => addMonths(viewDate, 1), [viewDate]);
  const leftDays = useMemo(() => getCalendarDays(viewDate), [viewDate]);
  const rightDays = useMemo(() => getCalendarDays(rightViewDate), [rightViewDate]);

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Determine the effective range for highlighting
  // In presets mode, use pendingValue; otherwise use the actual value
  const activeValue = hasPresets ? pendingValue : value;
  const effectiveStart = selectingStart || activeValue?.[0] || null;
  const effectiveEnd = selectingStart
    ? hoverDate // While selecting, use hover for tentative range
    : activeValue?.[1] || null;
  // Normalize so start < end
  const rangeStart = effectiveStart && effectiveEnd && effectiveEnd < effectiveStart ? effectiveEnd : effectiveStart;
  const rangeEnd = effectiveStart && effectiveEnd && effectiveEnd < effectiveStart ? effectiveStart : effectiveEnd;

  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

  const renderCalendarGrid = (days: Date[], monthDate: Date) => (
    <>
      <div className={styles.weekDays}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
      </div>
      <div className={styles.calendar}>
        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, monthDate);

          // Hide other-month dates in range picker
          if (!isCurrentMonth) {
            return <div key={index} className={styles.emptyDay} />;
          }

          const isTodayDate = isToday(date);
          const isDisabled = disabledDate?.(date);
          const isStart = rangeStart && isSameDay(date, rangeStart);
          const isEnd = rangeEnd && isSameDay(date, rangeEnd);
          const isInRange = isDateInRange(date, rangeStart, rangeEnd);

          return (
            <div
              key={index}
              className={cn(
                styles.day,
                isTodayDate && styles.today,
                isStart && styles.rangeStart,
                isEnd && styles.rangeEnd,
                isInRange && styles.inRange,
                isDisabled && styles.disabled,
              )}
              onClick={() => !isDisabled && handleDateClick(date)}
              onMouseEnter={() => {
                if (!isDisabled && selectingStart) setHoverDate(date);
              }}
              onMouseLeave={() => setHoverDate(null)}
            >
              {(isStart || isEnd) ? (
                <span className={styles.dayCircle}>{date.getDate()}</span>
              ) : (
                date.getDate()
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  const getContainerElement = (): HTMLElement => {
    if (getPopupContainer && containerRef.current) {
      return getPopupContainer(containerRef.current);
    }
    return document.body;
  };

  const renderRangeCalendar = () => {
    if (!open || !containerRef.current) return null;

    const renderDualCalendar = () => (
      <>
        {/* Left calendar */}
        <div className={styles.rangeCalendarLeft}>
          <div className={styles.header}>
            <button type="button" className={styles.navButton} onClick={handlePrevMonth} aria-label="Previous Month">
              <span className={cn('material-symbols-outlined', styles.icon, styles.navIcon)}>
                chevron_left
              </span>
            </button>
            <div className={styles.monthYear}>
              {monthNames[viewDate.getMonth()]}, {viewDate.getFullYear()}
            </div>
            <div style={{ width: 28 }} />
          </div>
          {renderCalendarGrid(leftDays, viewDate)}
        </div>
        {/* Right calendar */}
        <div className={styles.rangeCalendarRight}>
          <div className={styles.header}>
            <div style={{ width: 28 }} />
            <div className={styles.monthYear}>
              {monthNames[rightViewDate.getMonth()]}, {rightViewDate.getFullYear()}
            </div>
            <button type="button" className={styles.navButton} onClick={handleNextMonth} aria-label="Next Month">
              <span className={cn('material-symbols-outlined', styles.icon, styles.navIcon)}>
                chevron_right
              </span>
            </button>
          </div>
          {renderCalendarGrid(rightDays, rightViewDate)}
        </div>
      </>
    );

    const panelContent = hasPresets ? (
      <div
        ref={panelRef}
        className={cn(styles.panel, styles.panelWithPresets, sizeClass)}
        style={{
          position: 'absolute',
          top: position ? `${position.top}px` : undefined,
          left: position ? `${position.left}px` : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.panelBody}>
          <div className={styles.sidebar}>
            {presets!.map((preset, index) => {
              const presetRange = typeof preset.value === 'function' ? preset.value() : preset.value;
              const isActive =
                pendingValue &&
                pendingValue[0] &&
                pendingValue[1] &&
                presetRange &&
                presetRange[0] &&
                presetRange[1] &&
                isSameDay(pendingValue[0], presetRange[0]) &&
                isSameDay(pendingValue[1], presetRange[1]);
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {renderDualCalendar()}
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
        className={cn(styles.rangePanel, sizeClass)}
        style={{
          position: 'absolute',
          top: position ? `${position.top}px` : undefined,
          left: position ? `${position.left}px` : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderDualCalendar()}
      </div>
    );

    return createPortal(panelContent, getContainerElement());
  };

  const iconSize = size === 'sm' ? 'var(--token-component-icon-field-sm, 20px)' : 'var(--token-component-icon-field-md, 24px)';

  return (
    <div ref={containerRef} className={cn(styles.rangePickerWrapper, className)} style={style}>
      <Input
        value={displayValue}
        placeholder={placeholder || 'Start date – End date'}
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
          allowClear && value && value[0] && value[1] && !disabled ? (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: iconSize, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                handleChange(null);
              }}
            >
              cancel
            </span>
          ) : undefined
        }
      />
      {renderRangeCalendar()}
    </div>
  );
}
