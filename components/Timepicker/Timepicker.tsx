import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './Timepicker.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';

export type TimePickerValue = Date | null;

// Time utility functions
const formatTime = (date: Date | null, format: string, use12Hours: boolean): string => {
  if (!date) return '';

  let hours = date.getHours();
  const minutes = date.getMinutes();
  let ampm = '';

  if (use12Hours) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const h = String(hours);

  return format
    .replace('HH', hh)
    .replace('H', h)
    .replace('hh', String(hours).padStart(2, '0'))
    .replace('h', String(hours))
    .replace('mm', mm)
    .replace('m', String(minutes))
    .replace('A', ampm)
    .replace('a', ampm.toLowerCase());
};

/** Get 5 visible items centered on selectedIdx with circular wrapping */
function getVisibleItems<T>(options: T[], selectedIdx: number): (T | null)[] {
  const len = options.length;
  if (len === 0) return [null, null, null, null, null];
  const safeIdx = ((selectedIdx % len) + len) % len;
  return [-2, -1, 0, 1, 2].map(offset => {
    const idx = ((safeIdx + offset) % len + len) % len;
    return options[idx];
  });
}

/** Get AM/PM visible items (only 2 values, centered without circular wrapping) */
function getAmPmVisibleItems(selected: 'AM' | 'PM'): (string | null)[] {
  if (selected === 'AM') return [null, null, 'AM', 'PM', null];
  return [null, 'AM', 'PM', null, null];
}

export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size'> {
  /** Current value (controlled) */
  value?: TimePickerValue;
  /** Default value (uncontrolled) */
  defaultValue?: TimePickerValue;
  /** Callback when value changes */
  onChange?: (time: TimePickerValue, timeString: string) => void;
  /** Time format */
  format?: string;
  /** Use 12-hour format */
  use12Hours?: boolean;
  /** Hour step */
  hourStep?: number;
  /** Minute step */
  minuteStep?: number;
  /** Function to disable specific hours */
  disabledHours?: () => number[];
  /** Function to disable specific minutes */
  disabledMinutes?: (selectedHour?: number) => number[];
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
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Open state (controlled) */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Allow clear */
  allowClear?: boolean;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
}

/**
 * TimePicker Component
 *
 * Drum-roller style time picker with 5 visible rows and arrow navigation.
 *
 * @example
 * ```tsx
 * <TimePicker
 *   value={time}
 *   onChange={(time, timeString) => console.log(time, timeString)}
 *   format="HH:mm"
 * />
 * ```
 */
export function TimePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  format = 'HH:mm',
  use12Hours = false,
  hourStep = 1,
  minuteStep = 1,
  disabledHours,
  disabledMinutes,
  placeholder = 'Select time',
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
  popupClassName,
  popupStyle,
  ...props
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState<TimePickerValue>(defaultValue || null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const displayValue = useMemo(() => {
    if (!value) return '';
    return formatTime(value, format, use12Hours);
  }, [value, format, use12Hours]);

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
      const timeString = newValue ? formatTime(newValue, format, use12Hours) : '';
      onChange?.(newValue, timeString);
    },
    [isControlled, onChange, format, use12Hours]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange(null);
    },
    [handleChange]
  );

  // Generate time options with disabled filtering
  const hourOptions = useMemo(() => {
    const maxHour = use12Hours ? 13 : 24;
    const hours: number[] = [];
    for (let i = use12Hours ? 1 : 0; i < maxHour; i += hourStep) {
      hours.push(i);
    }
    const disabled = disabledHours?.() || [];
    return hours.filter((h) => !disabled.includes(h));
  }, [use12Hours, hourStep, disabledHours]);

  const minuteOptions = useMemo(() => {
    const minutes: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) {
      minutes.push(i);
    }
    const currentHour = value?.getHours() || 0;
    const disabled = disabledMinutes?.(currentHour) || [];
    return minutes.filter((m) => !disabled.includes(m));
  }, [minuteStep, disabledMinutes, value]);

  const handleHourSelect = useCallback(
    (hour: number) => {
      const now = value || new Date();
      const newDate = new Date(now);
      if (use12Hours) {
        const isPM = now.getHours() >= 12;
        let h24 = hour % 12;
        if (isPM) h24 += 12;
        newDate.setHours(h24);
      } else {
        newDate.setHours(hour);
      }
      handleChange(newDate);
    },
    [value, use12Hours, handleChange]
  );

  const handleMinuteSelect = useCallback(
    (minute: number) => {
      const now = value || new Date();
      const newDate = new Date(now);
      newDate.setMinutes(minute);
      handleChange(newDate);
    },
    [value, handleChange]
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

      const top = rect.bottom - containerRect.top + 4;
      const left = rect.left - containerRect.left;

      setPosition({ top, left });
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

  const getContainerElement = (): HTMLElement => {
    if (getPopupContainer && containerRef.current) {
      return getPopupContainer(containerRef.current);
    }
    return document.body;
  };

  const renderPanel = () => {
    if (!open || !containerRef.current) return null;

    const currentHour = value?.getHours() || 0;
    const currentMinute = value?.getMinutes() || 0;

    const displayHour = use12Hours
      ? currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour
      : currentHour;

    const selectedHourIdx = hourOptions.indexOf(displayHour);
    const selectedMinuteIdx = minuteOptions.indexOf(currentMinute);

    const hourVisible = getVisibleItems(hourOptions, selectedHourIdx >= 0 ? selectedHourIdx : 0);
    const minuteVisible = getVisibleItems(minuteOptions, selectedMinuteIdx >= 0 ? selectedMinuteIdx : 0);

    const amPmSelected: 'AM' | 'PM' = currentHour >= 12 ? 'PM' : 'AM';
    const amPmVisible = use12Hours ? getAmPmVisibleItems(amPmSelected) : null;

    const stepHour = (direction: 1 | -1) => {
      const idx = selectedHourIdx >= 0 ? selectedHourIdx : 0;
      const newIdx = ((idx + direction) % hourOptions.length + hourOptions.length) % hourOptions.length;
      handleHourSelect(hourOptions[newIdx]);
    };

    const stepMinute = (direction: 1 | -1) => {
      const idx = selectedMinuteIdx >= 0 ? selectedMinuteIdx : 0;
      const newIdx = ((idx + direction) % minuteOptions.length + minuteOptions.length) % minuteOptions.length;
      handleMinuteSelect(minuteOptions[newIdx]);
    };

    const toggleAmPm = () => {
      const now = value || new Date();
      const newDate = new Date(now);
      if (currentHour >= 12) {
        newDate.setHours(newDate.getHours() - 12);
      } else {
        newDate.setHours(newDate.getHours() + 12);
      }
      handleChange(newDate);
    };

    const handleAmPmClick = (clicked: string) => {
      if (clicked === 'AM' && currentHour >= 12) {
        const newDate = new Date(value || new Date());
        newDate.setHours(newDate.getHours() - 12);
        handleChange(newDate);
      } else if (clicked === 'PM' && currentHour < 12) {
        const newDate = new Date(value || new Date());
        newDate.setHours(newDate.getHours() + 12);
        handleChange(newDate);
      }
    };

    const isPositioned = position !== null;

    return createPortal(
      <div
        ref={panelRef}
        className={cn(styles.panel, isPositioned && styles.positioned, popupClassName)}
        style={{
          ...popupStyle,
          ...(isPositioned
            ? {
                position: 'fixed' as const,
                top: `${position.top}px`,
                left: `${position.left}px`,
              }
            : {}),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          {/* Up arrows */}
          <div className={styles.arrowRow}>
            <button type="button" className={styles.arrowCell} onClick={() => stepHour(-1)} aria-label="Previous hour">
              <span className="material-symbols-outlined">keyboard_arrow_up</span>
            </button>
            <button type="button" className={styles.arrowCell} onClick={() => stepMinute(-1)} aria-label="Previous minute">
              <span className="material-symbols-outlined">keyboard_arrow_up</span>
            </button>
            {use12Hours && (
              <button type="button" className={styles.arrowCell} onClick={toggleAmPm} aria-label="Toggle AM/PM">
                <span className="material-symbols-outlined">keyboard_arrow_up</span>
              </button>
            )}
          </div>

          {/* 5 value rows */}
          {[0, 1, 2, 3, 4].map((rowIdx) => {
            const isCenter = rowIdx === 2;
            const isSubtle = rowIdx === 0 || rowIdx === 4;

            return (
              <div key={rowIdx} className={styles.row}>
                {/* Hour cell */}
                {hourVisible[rowIdx] != null ? (
                  <div
                    className={cn(
                      styles.cell,
                      isCenter && styles.cellSelected,
                      isSubtle && !isCenter && styles.cellSubtle,
                    )}
                    onClick={() => handleHourSelect(hourVisible[rowIdx] as number)}
                  >
                    {String(hourVisible[rowIdx]).padStart(2, '0')}
                  </div>
                ) : (
                  <div className={styles.cell} style={{ visibility: 'hidden' }} />
                )}

                {/* Minute cell */}
                {minuteVisible[rowIdx] != null ? (
                  <div
                    className={cn(
                      styles.cell,
                      isCenter && styles.cellSelected,
                      isSubtle && !isCenter && styles.cellSubtle,
                    )}
                    onClick={() => handleMinuteSelect(minuteVisible[rowIdx] as number)}
                  >
                    {String(minuteVisible[rowIdx]).padStart(2, '0')}
                  </div>
                ) : (
                  <div className={styles.cell} style={{ visibility: 'hidden' }} />
                )}

                {/* AM/PM cell */}
                {use12Hours && (
                  amPmVisible![rowIdx] != null ? (
                    <div
                      className={cn(
                        styles.cell,
                        amPmVisible![rowIdx] === amPmSelected && isCenter && styles.cellSelected,
                        isSubtle && styles.cellSubtle,
                      )}
                      onClick={() => handleAmPmClick(amPmVisible![rowIdx]!)}
                    >
                      {amPmVisible![rowIdx]}
                    </div>
                  ) : (
                    <div className={styles.cell} style={{ visibility: 'hidden' }} />
                  )
                )}
              </div>
            );
          })}

          {/* Down arrows */}
          <div className={styles.arrowRow}>
            <button type="button" className={styles.arrowCell} onClick={() => stepHour(1)} aria-label="Next hour">
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </button>
            <button type="button" className={styles.arrowCell} onClick={() => stepMinute(1)} aria-label="Next minute">
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </button>
            {use12Hours && (
              <button type="button" className={styles.arrowCell} onClick={toggleAmPm} aria-label="Toggle AM/PM">
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
              </button>
            )}
          </div>
        </div>
      </div>,
      getContainerElement()
    );
  };

  return (
    <div ref={containerRef} className={cn(styles.timepickerWrapper, className)} style={style}>
      <Input
        value={displayValue}
        placeholder={placeholder}
        size={size}
        error={error}
        disabled={disabled}
        readOnly
        onClick={handleOpen}
        suffix={
          <>
            {allowClear && value && !disabled && (
              <span
                className={cn('material-symbols-outlined', styles.clearIcon)}
                onClick={handleClear}
              >
                cancel
              </span>
            )}
            {suffixIcon || (
              <span className={cn('material-symbols-outlined', styles.suffixIcon)}>
                schedule
              </span>
            )}
          </>
        }
        {...props}
      />
      {renderPanel()}
    </div>
  );
}
