import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './DurationPicker.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';

export interface DurationPickerProps {
  /** Hours value (controlled) */
  hours?: number;
  /** Minutes value (controlled) */
  minutes?: number;
  /** Default hours (uncontrolled) */
  defaultHours?: number;
  /** Default minutes (uncontrolled) */
  defaultMinutes?: number;
  /** Change handler */
  onChange?: (hours: number, minutes: number) => void;
  /** Mode: 'hours-minutes' shows 2 columns, 'minutes' shows 1 column */
  mode?: 'hours-minutes' | 'minutes';
  /** Maximum hours in the picker (default: 24) */
  maxHours?: number;
  /** Hour step (default: 1) */
  hourStep?: number;
  /** Minute step (default: 15) */
  minuteStep?: number;
  /** Maximum minutes in minutes-only mode (default: 120) */
  maxMinutes?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow clearing the value */
  allowClear?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Suffix icon override */
  suffixIcon?: React.ReactNode;
  /** Open state (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
  /** ARIA label */
  'aria-label'?: string;
}

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

/**
 * DurationPicker Component
 *
 * Select-with-dropdown for picking a duration. Uses a drum-roller panel
 * with "h" and "min" suffixed values.
 *
 * @example
 * ```tsx
 * <DurationPicker
 *   hours={1}
 *   minutes={30}
 *   onChange={(h, m) => console.log(`${h}h ${m}min`)}
 * />
 * ```
 */
export function DurationPicker({
  hours: controlledHours,
  minutes: controlledMinutes,
  defaultHours = 0,
  defaultMinutes = 0,
  onChange,
  mode = 'hours-minutes',
  maxHours = 24,
  hourStep = 1,
  minuteStep = 15,
  maxMinutes = 120,
  placeholder,
  size = 'md',
  error = false,
  disabled = false,
  allowClear = true,
  className,
  style,
  suffixIcon,
  open: controlledOpen,
  onOpenChange,
  getPopupContainer,
  popupClassName,
  popupStyle,
  ...props
}: DurationPickerProps) {
  const [internalHours, setInternalHours] = useState(defaultHours);
  const [internalMinutes, setInternalMinutes] = useState(defaultMinutes);
  const [internalOpen, setInternalOpen] = useState(false);
  const [hasValue, setHasValue] = useState(
    controlledHours !== undefined || controlledMinutes !== undefined
  );
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isHoursControlled = controlledHours !== undefined;
  const isMinutesControlled = controlledMinutes !== undefined;
  const hours = isHoursControlled ? controlledHours : internalHours;
  const minutes = isMinutesControlled ? controlledMinutes : internalMinutes;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  // Generate option lists
  const hourOptions = useMemo(() => {
    const options: number[] = [];
    for (let i = 0; i <= maxHours; i += hourStep) {
      options.push(i);
    }
    return options;
  }, [maxHours, hourStep]);

  const minuteOptions = useMemo(() => {
    if (mode === 'minutes') {
      const options: number[] = [];
      for (let i = 0; i <= maxMinutes; i += minuteStep) {
        options.push(i);
      }
      return options;
    }
    const options: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) {
      options.push(i);
    }
    return options;
  }, [mode, minuteStep, maxMinutes]);

  // Display value
  const displayValue = useMemo(() => {
    if (!hasValue && !isHoursControlled && !isMinutesControlled) return '';
    if (mode === 'minutes') {
      return `${minutes} min`;
    }
    return `${hours} h ${minutes} min`;
  }, [hours, minutes, mode, hasValue, isHoursControlled, isMinutesControlled]);

  const defaultPlaceholder = mode === 'minutes' ? 'Select duration' : 'Select duration';

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
    (newHours: number, newMinutes: number) => {
      if (!isHoursControlled) {
        setInternalHours(newHours);
      }
      if (!isMinutesControlled) {
        setInternalMinutes(newMinutes);
      }
      setHasValue(true);
      onChange?.(newHours, newMinutes);
    },
    [isHoursControlled, isMinutesControlled, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isHoursControlled) setInternalHours(0);
      if (!isMinutesControlled) setInternalMinutes(0);
      setHasValue(false);
      onChange?.(0, 0);
    },
    [isHoursControlled, isMinutesControlled, onChange]
  );

  const handleHourSelect = useCallback(
    (hour: number) => {
      handleChange(hour, minutes);
    },
    [handleChange, minutes]
  );

  const handleMinuteSelect = useCallback(
    (minute: number) => {
      if (mode === 'minutes') {
        handleChange(0, minute);
      } else {
        handleChange(hours, minute);
      }
    },
    [handleChange, hours, mode]
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

    const selectedHourIdx = hourOptions.indexOf(hours);
    const selectedMinuteIdx = minuteOptions.indexOf(minutes);

    const hourVisible = getVisibleItems(hourOptions, selectedHourIdx >= 0 ? selectedHourIdx : 0);
    const minuteVisible = getVisibleItems(minuteOptions, selectedMinuteIdx >= 0 ? selectedMinuteIdx : 0);

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
            {mode === 'hours-minutes' && (
              <button type="button" className={styles.arrowCell} onClick={() => stepHour(-1)} aria-label="Decrease hours">
                <span className="material-symbols-outlined">keyboard_arrow_up</span>
              </button>
            )}
            <button type="button" className={styles.arrowCell} onClick={() => stepMinute(-1)} aria-label="Decrease minutes">
              <span className="material-symbols-outlined">keyboard_arrow_up</span>
            </button>
          </div>

          {/* 5 value rows */}
          {[0, 1, 2, 3, 4].map((rowIdx) => {
            const isCenter = rowIdx === 2;
            const isSubtle = rowIdx === 0 || rowIdx === 4;

            return (
              <div key={rowIdx} className={styles.row}>
                {/* Hour cell */}
                {mode === 'hours-minutes' && (
                  hourVisible[rowIdx] != null ? (
                    <div
                      className={cn(
                        styles.cell,
                        isCenter && styles.cellSelected,
                        isSubtle && !isCenter && styles.cellSubtle,
                      )}
                      onClick={() => handleHourSelect(hourVisible[rowIdx] as number)}
                    >
                      {hourVisible[rowIdx]} h
                    </div>
                  ) : (
                    <div className={styles.cell} style={{ visibility: 'hidden' }} />
                  )
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
                    {minuteVisible[rowIdx]} min
                  </div>
                ) : (
                  <div className={styles.cell} style={{ visibility: 'hidden' }} />
                )}
              </div>
            );
          })}

          {/* Down arrows */}
          <div className={styles.arrowRow}>
            {mode === 'hours-minutes' && (
              <button type="button" className={styles.arrowCell} onClick={() => stepHour(1)} aria-label="Increase hours">
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
              </button>
            )}
            <button type="button" className={styles.arrowCell} onClick={() => stepMinute(1)} aria-label="Increase minutes">
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </button>
          </div>
        </div>
      </div>,
      getContainerElement()
    );
  };

  const iconSize = size === 'sm' ? 'var(--token-component-icon-field-sm, 20px)' : 'var(--token-component-icon-field-md, 24px)';

  return (
    <div ref={containerRef} className={cn(styles.durationPickerWrapper, className)} style={style} {...props}>
      <Input
        value={displayValue}
        placeholder={placeholder || defaultPlaceholder}
        size={size}
        error={error}
        disabled={disabled}
        readOnly
        onClick={handleOpen}
        prefix={
          suffixIcon || (
            <span className="material-symbols-outlined" style={{ fontSize: iconSize }}>
              timer
            </span>
          )
        }
        suffix={
          allowClear && hasValue && !disabled ? (
            <span
              className={cn('material-symbols-outlined', styles.clearIcon)}
              style={{ fontSize: iconSize }}
              onClick={handleClear}
            >
              cancel
            </span>
          ) : undefined
        }
      />
      {renderPanel()}
    </div>
  );
}
