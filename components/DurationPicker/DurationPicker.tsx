import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './DurationPicker.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { DurationPickerPanel } from './DurationPickerPanel';
import { generateHourOptions, generateMinuteOptions } from './utils';
import type { DurationPickerProps } from './types';

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
  placeholder = 'Select duration',
  size = 'md',
  error = false,
  disabled = false,
  allowClear = true,
  className,
  style,
  suffixIcon,
  open: controlledOpen,
  onOpenChange,
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
  const containerRef = useRef<HTMLDivElement>(null);

  const isHoursControlled = controlledHours !== undefined;
  const isMinutesControlled = controlledMinutes !== undefined;
  const hours = isHoursControlled ? controlledHours : internalHours;
  const minutes = isMinutesControlled ? controlledMinutes : internalMinutes;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const hourOptions = useMemo(() => generateHourOptions(maxHours, hourStep), [maxHours, hourStep]);
  const minuteOptions = useMemo(() => generateMinuteOptions(mode, minuteStep, maxMinutes), [mode, minuteStep, maxMinutes]);

  const displayValue = useMemo(() => {
    if (!hasValue && !isHoursControlled && !isMinutesControlled) return '';
    if (mode === 'minutes') return `${minutes} min`;
    return `${hours} h ${minutes} min`;
  }, [hours, minutes, mode, hasValue, isHoursControlled, isMinutesControlled]);

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
    (newHours: number, newMinutes: number) => {
      if (!isHoursControlled) setInternalHours(newHours);
      if (!isMinutesControlled) setInternalMinutes(newMinutes);
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
    (hour: number) => handleChange(hour, minutes),
    [handleChange, minutes]
  );

  const handleMinuteSelect = useCallback(
    (minute: number) => handleChange(mode === 'minutes' ? 0 : hours, minute),
    [handleChange, hours, mode]
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
    <div ref={containerRef} className={cn(styles.durationPickerWrapper, className)} style={style} {...props}>
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
              timer
            </span>
          )
        }
        suffix={
          allowClear && hasValue && !disabled ? (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: iconSize, cursor: 'pointer' }}
              onClick={handleClear}
            >
              cancel
            </span>
          ) : undefined
        }
      />
      {open && (
        <DurationPickerPanel
          mode={mode}
          hours={hours}
          minutes={minutes}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          onHourSelect={handleHourSelect}
          onMinuteSelect={handleMinuteSelect}
          popupClassName={popupClassName}
          popupStyle={popupStyle}
        />
      )}
    </div>
  );
}
