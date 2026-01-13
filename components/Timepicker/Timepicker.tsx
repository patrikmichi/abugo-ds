import React, { useState } from 'react';
import styles from './TimePicker.module.css';
import { cn } from '@/lib/utils';

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field has a validation error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Hours value (0-23) */
  hours?: number;
  /** Minutes value (0-59) */
  minutes?: number;
  /** Change handler */
  onChange?: (hours: number, minutes: number) => void;
  /** ARIA label */
  'aria-label'?: string;
  /** Whether the picker is expanded/open */
  expanded?: boolean;
  /** Toggle expanded state */
  onToggleExpanded?: (expanded: boolean) => void;
}

/**
 * TimePicker component - Input for time in hours and minutes (24-hour format)
 * 
 * @example
 * ```tsx
 * <TimePicker
 *   hours={14}
 *   minutes={30}
 *   onChange={(h, m) => console.log(`${h}:${m}`)}
 * />
 * ```
 */
export function TimePicker({
  size = 'md',
  error = false,
  disabled = false,
  hours: initialHours = 0,
  minutes: initialMinutes = 0,
  onChange,
  'aria-label': ariaLabel = 'Time',
  expanded: controlledExpanded,
  onToggleExpanded,
  className,
  id,
  ...props
}: TimePickerProps) {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [isFocused, setIsFocused] = useState(false);
  const [focusedSegment, setFocusedSegment] = useState<'hours' | 'minutes' | null>(null);
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  
  const fieldId = React.useId();
  const finalId = id || fieldId;
  const hoursId = `${finalId}-hours`;
  const minutesId = `${finalId}-minutes`;
  
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(23, parseInt(e.target.value) || 0));
    setHours(value);
    onChange?.(value, minutes);
  };
  
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setMinutes(value);
    onChange?.(hours, value);
  };
  
  const handleToggleExpanded = () => {
    const newExpanded = !expanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onToggleExpanded?.(newExpanded);
  };
  
  return (
    <div
      className={cn(
        styles.timePickerWrapper,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg
      )}
    >
      <div
        className={cn(
          styles.timePicker,
          size === 'sm' && styles.sm,
          size === 'lg' && styles.lg,
          error && styles.error,
          disabled && styles.disabled,
          isFocused && styles.focused,
          expanded && styles.expanded,
          className
        )}
        role="group"
        aria-label={ariaLabel}
        {...props}
      >
      <div className={styles.inputs}>
        <input
          id={hoursId}
          type="number"
          min="0"
          max="23"
          value={hours.toString().padStart(2, '0')}
          onChange={handleHoursChange}
          onFocus={() => {
            setIsFocused(true);
            setFocusedSegment('hours');
          }}
          onBlur={() => {
            setIsFocused(false);
            setFocusedSegment(null);
          }}
          disabled={disabled}
          className={cn(styles.hoursInput, focusedSegment === 'hours' && styles.focusedSegment)}
          aria-label="Hours"
          aria-valuemin={0}
          aria-valuemax={23}
          aria-valuenow={hours}
        />
        <span className={styles.separator} aria-hidden="true">:</span>
        
        <input
          id={minutesId}
          type="number"
          min="0"
          max="59"
          value={minutes.toString().padStart(2, '0')}
          onChange={handleMinutesChange}
          onFocus={() => {
            setIsFocused(true);
            setFocusedSegment('minutes');
          }}
          onBlur={() => {
            setIsFocused(false);
            setFocusedSegment(null);
          }}
          disabled={disabled}
          className={cn(styles.minutesInput, focusedSegment === 'minutes' && styles.focusedSegment)}
          aria-label="Minutes"
          aria-valuemin={0}
          aria-valuemax={59}
          aria-valuenow={minutes}
        />
      </div>
      
      <button
        type="button"
        className={styles.expandButton}
        onClick={handleToggleExpanded}
        disabled={disabled}
        aria-label={expanded ? 'Collapse time picker' : 'Expand time picker'}
        aria-expanded={expanded}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(styles.chevron, expanded && styles.chevronExpanded)}
        >
          <path d="M6 9L1 4h10z" fill="currentColor" />
        </svg>
      </button>
      </div>
    </div>
  );
}
