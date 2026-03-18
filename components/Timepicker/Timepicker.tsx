import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import styles from './Timepicker.module.css';
import TimepickerPanel from './TimepickerPanel';
import { formatTime } from './utils';
import type { TimePickerProps, TimePickerValue } from './types';

const TimePicker = ({
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
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  allowClear = true,
  popupClassName,
  popupStyle,
  ...props
}: TimePickerProps) => {
  const [internalValue, setInternalValue] = useState<TimePickerValue>(defaultValue || null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!isOpenControlled) setInternalOpen(true);
    onOpenChange?.(true);
  }, [disabled, isOpenControlled, onOpenChange]);

  const handleClose = useCallback(() => {
    if (!isOpenControlled) setInternalOpen(false);
    onOpenChange?.(false);
  }, [isOpenControlled, onOpenChange]);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      if (!isControlled) setInternalValue(newValue);
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

  const hourOptions = useMemo(() => {
    const maxHour = use12Hours ? 13 : 24;
    const hours: number[] = [];
    for (let i = use12Hours ? 1 : 0; i < maxHour; i += hourStep) {
      hours.push(i);
    }
    const disabledList = disabledHours?.() || [];
    return hours.filter((h) => !disabledList.includes(h));
  }, [use12Hours, hourStep, disabledHours]);

  const minuteOptions = useMemo(() => {
    const minutes: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) {
      minutes.push(i);
    }
    const currentHour = value?.getHours() || 0;
    const disabledList = disabledMinutes?.(currentHour) || [];
    return minutes.filter((m) => !disabledList.includes(m));
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

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClose]);

  const iconSize = size === 'sm' ? 'var(--token-component-icon-field-sm, 20px)' : 'var(--token-component-icon-field-md, 24px)';

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
                className="material-symbols-outlined"
                style={{ fontSize: iconSize, cursor: 'pointer' }}
                onClick={handleClear}
              >
                cancel
              </span>
            )}
            {suffixIcon || (
              <span className="material-symbols-outlined" style={{ fontSize: iconSize }}>
                schedule
              </span>
            )}
          </>
        }
        {...props}
      />
      {open && (
        <TimepickerPanel
          value={value}
          use12Hours={use12Hours}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          onHourSelect={handleHourSelect}
          onMinuteSelect={handleMinuteSelect}
          onAmPmChange={handleChange}
          popupClassName={popupClassName}
          popupStyle={popupStyle}
        />
      )}
    </div>
  );
};

export default TimePicker;
