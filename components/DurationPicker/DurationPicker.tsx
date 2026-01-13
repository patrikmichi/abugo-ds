import React, { useState } from 'react';
import styles from './DurationPicker.module.css';
import { cn } from '@/lib/utils';

export interface DurationPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Field status */
  status?: 'enabled' | 'disabled' | 'error';
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error state (deprecated - use status prop) */
  error?: boolean;
  /** Hours value (0-99) */
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
 * DurationPicker component - Input for duration in hours and minutes
 * 
 * @example
 * ```tsx
 * <DurationPicker
 *   hours={2}
 *   minutes={30}
 *   onChange={(h, m) => console.log(`${h}h ${m}min`)}
 * />
 * ```
 */
export function DurationPicker({
  size = 'md',
  status,
  disabled = false,
  error = false,
  hours: initialHours = 0,
  minutes: initialMinutes = 0,
  onChange,
  'aria-label': ariaLabel = 'Duration',
  expanded: controlledExpanded,
  onToggleExpanded,
  className,
  id,
  ...props
}: DurationPickerProps) {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [isFocused, setIsFocused] = useState(false);
  const [focusedSegment, setFocusedSegment] = useState<'hours' | 'minutes' | null>(null);
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  
  // Determine status: priority is status prop > disabled > error prop
  const finalStatus: 'enabled' | 'disabled' | 'error' = 
    status || 
    (disabled ? 'disabled' : (error ? 'error' : 'enabled'));
  const isDisabled = finalStatus === 'disabled' || disabled;
  const hasError = finalStatus === 'error' || error;
  
  const fieldId = React.useId();
  const finalId = id || fieldId;
  const hoursId = `${finalId}-hours`;
  const minutesId = `${finalId}-minutes`;
  
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
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
        styles.durationPicker,
        size && styles[size],
        hasError && styles.error,
        isDisabled && styles.disabled,
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
          max="99"
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
          disabled={isDisabled}
          className={cn(styles.hoursInput, focusedSegment === 'hours' && styles.focusedSegment)}
          aria-label="Hours"
          aria-valuemin={0}
          aria-valuemax={99}
          aria-valuenow={hours}
        />
        <span className={styles.label} aria-hidden="true">h</span>
        
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
          disabled={isDisabled}
          className={cn(styles.minutesInput, focusedSegment === 'minutes' && styles.focusedSegment)}
          aria-label="Minutes"
          aria-valuemin={0}
          aria-valuemax={59}
          aria-valuenow={minutes}
        />
        <span className={styles.label} aria-hidden="true">min</span>
      </div>
      
      <button
        type="button"
        className={styles.expandButton}
        onClick={handleToggleExpanded}
        disabled={isDisabled}
        aria-label={expanded ? 'Collapse duration picker' : 'Expand duration picker'}
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
  );
}
