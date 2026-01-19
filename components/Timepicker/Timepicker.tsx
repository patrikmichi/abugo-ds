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

const parseTime = (timeString: string, format: string, use12Hours: boolean): Date | null => {
  if (!timeString) return null;
  
  const now = new Date();
  let hours = 0;
  let minutes = 0;
  
  // Simple parser - can be enhanced
  const parts = timeString.split(/[: ]/);
  if (parts.length >= 2) {
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    
    // Handle 12-hour format
    if (use12Hours && parts.length > 2) {
      const ampm = parts[parts.length - 1].toUpperCase();
      if (ampm === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
    }
  }
  
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
  return date;
};

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
 * Time picker component. 
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
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [canScrollUp, setCanScrollUp] = useState<{ hour: boolean; minute: boolean }>({
    hour: false,
    minute: false,
  });
  const [canScrollDown, setCanScrollDown] = useState<{ hour: boolean; minute: boolean }>({
    hour: false,
    minute: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hourColumnRef = useRef<HTMLDivElement>(null);
  const minuteColumnRef = useRef<HTMLDivElement>(null);
  const hourOptionsRef = useRef<HTMLDivElement>(null);
  const minuteOptionsRef = useRef<HTMLDivElement>(null);

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
    const maxHour = use12Hours ? 12 : 24;
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
    const displayHour = use12Hours
      ? currentHour === 0
        ? 12
        : currentHour > 12
        ? currentHour - 12
        : currentHour
      : currentHour;
    const disabled = disabledMinutes?.(currentHour) || [];
    return minutes.filter((m) => !disabled.includes(m));
  }, [minuteStep, disabledMinutes, value, use12Hours]);

  const handleHourSelect = useCallback(
    (hour: number) => {
      const now = value || new Date();
      const newDate = new Date(now);
      newDate.setHours(use12Hours ? (hour === 12 ? 12 : hour % 12) : hour);
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

      const width = 280; // Fixed width from tokens
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

  // Scroll to selected values
  useEffect(() => {
    if (!open || !value) return;

    const scrollToValue = (optionsRef: React.RefObject<HTMLDivElement>, value: number) => {
      if (!optionsRef.current) return;
      const option = optionsRef.current.querySelector(`[data-value="${value}"]`) as HTMLElement;
      if (option) {
        option.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };

    const hour = value.getHours();
    const displayHour = use12Hours ? (hour === 0 ? 12 : hour > 12 ? hour - 12 : hour) : hour;
    scrollToValue(hourOptionsRef, displayHour);
    
    scrollToValue(minuteOptionsRef, value.getMinutes());
  }, [open, value, use12Hours]);

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

  const checkScrollability = useCallback((ref: React.RefObject<HTMLDivElement>, key: 'hour' | 'minute') => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    setCanScrollUp((prev) => ({ ...prev, [key]: scrollTop > 0 }));
    setCanScrollDown((prev) => ({ ...prev, [key]: scrollTop < scrollHeight - clientHeight - 1 }));
  }, []);

  useEffect(() => {
    if (!open) return;
    const checkAll = () => {
      checkScrollability(hourOptionsRef, 'hour');
      checkScrollability(minuteOptionsRef, 'minute');
    };
    checkAll();
    const interval = setInterval(checkAll, 100);
    return () => clearInterval(interval);
  }, [open, checkScrollability]);

  const renderPanel = () => {
    if (!open || !containerRef.current) return null;

    const currentHour = value?.getHours() || 0;
    const currentMinute = value?.getMinutes() || 0;
    
    const displayHour = use12Hours
      ? currentHour === 0
        ? 12
        : currentHour > 12
        ? currentHour - 12
        : currentHour
      : currentHour;

    const isDisabled = (option: number, disabledList: number[]) => disabledList.includes(option);

    const renderColumn = (
      options: number[],
      selected: number,
      onSelect: (value: number) => void,
      label: string,
      columnRef: React.RefObject<HTMLDivElement>,
      optionsRef: React.RefObject<HTMLDivElement>,
      scrollKey: 'hour' | 'minute',
      disabledList: number[] = []
    ) => {
      const handleScroll = () => {
        checkScrollability(optionsRef, scrollKey);
      };

      return (
        <div className={styles.column} ref={columnRef}>
          <div className={styles.columnLabel}>{label}</div>
          {canScrollUp[scrollKey] && (
            <div className={styles.scrollIndicatorTop}>
              <span className="material-symbols-outlined">expand_less</span>
            </div>
          )}
          <div 
            className={styles.options} 
            ref={optionsRef}
            onScroll={handleScroll}
          >
            {options.map((option) => {
              const disabled = isDisabled(option, disabledList);
              return (
                <div
                  key={option}
                  data-value={option}
                  className={cn(
                    styles.option,
                    selected === option && styles.selected,
                    disabled && styles.disabled
                  )}
                  onClick={() => !disabled && onSelect(option)}
                >
                  {String(option).padStart(2, '0')}
                </div>
              );
            })}
          </div>
          {canScrollDown[scrollKey] && (
            <div className={styles.scrollIndicatorBottom}>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          )}
        </div>
      );
    };

    const disabledHoursList = disabledHours?.() || [];
    const disabledMinutesList = disabledMinutes?.(currentHour) || [];

    const isPositioned = position !== null;

    return createPortal(
      <div
        ref={panelRef}
        className={cn(styles.panel, isPositioned && styles.positioned, popupClassName)}
        style={{
          ...popupStyle,
          ...(isPositioned
            ? {
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
              }
            : {}),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.columns}>
          {renderColumn(
            hourOptions,
            displayHour,
            handleHourSelect,
            'Hour',
            hourColumnRef,
            hourOptionsRef,
            'hour',
            disabledHoursList
          )}
          {renderColumn(
            minuteOptions,
            currentMinute,
            handleMinuteSelect,
            'Min',
            minuteColumnRef,
            minuteOptionsRef,
            'minute',
            disabledMinutesList
          )}
          {use12Hours && (
            <div className={styles.column}>
              <div className={styles.columnLabel}>AM/PM</div>
              <div className={styles.options}>
                <div
                  className={cn(
                    styles.option,
                    currentHour < 12 && styles.selected
                  )}
                  onClick={() => {
                    const now = value || new Date();
                    const newDate = new Date(now);
                    if (currentHour >= 12) {
                      newDate.setHours(newDate.getHours() - 12);
                    }
                    handleChange(newDate);
                  }}
                >
                  AM
                </div>
                <div
                  className={cn(
                    styles.option,
                    currentHour >= 12 && styles.selected
                  )}
                  onClick={() => {
                    const now = value || new Date();
                    const newDate = new Date(now);
                    if (currentHour < 12) {
                      newDate.setHours(newDate.getHours() + 12);
                    }
                    handleChange(newDate);
                  }}
                >
                  PM
                </div>
              </div>
            </div>
          )}
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
            {allowClear && value && (
              <span
                className={cn('material-symbols-outlined', styles.clearIcon)}
                onClick={handleClear}
              >
                close
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
