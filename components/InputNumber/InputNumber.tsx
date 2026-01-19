import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import styles from './InputNumber.module.css';
import { cn } from '@/lib/utils';

export interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size' | 'prefix'> {
  /** The size of the input box */
  size?: 'small' | 'middle' | 'large';
  /** Set validation status. When used with Field wrapper, Field manages this automatically. */
  error?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is readonly */
  readOnly?: boolean;
  /** The minimum value */
  min?: number;
  /** The maximum value */
  max?: number;
  /** The number to which the current value is increased or decreased */
  step?: number | string;
  /** The precision of input value */
  precision?: number;
  /** Set value as string to support high precision decimals */
  stringMode?: boolean;
  /** Specifies the format of the value presented */
  formatter?: (value: number | string, info?: { userTyping: boolean; input: string }) => string;
  /** Specifies the value extracted from formatter */
  parser?: (string: string) => number | string;
  /** Whether to show +- controls */
  controls?: boolean | { upIcon?: React.ReactNode; downIcon?: React.ReactNode };
  /** Character to use as decimal separator */
  decimalSeparator?: string;
  /** Trigger onChange when blur */
  changeOnBlur?: boolean;
  /** Allows control with mouse wheel */
  changeOnWheel?: boolean;
  /** If keyboard behavior is enabled */
  keyboard?: boolean;
  /** Auto focus */
  autoFocus?: boolean;
  /** The prefix icon for the Input */
  prefix?: React.ReactNode;
  /** The suffix icon for the Input */
  suffix?: React.ReactNode;
  /** The current value */
  value?: number | string | null;
  /** The initial value */
  defaultValue?: number | string | null;
  /** The callback triggered when the value is changed */
  onChange?: (value: number | string | null) => void;
  /** The callback function that is triggered when Enter key is pressed */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** The callback function that is triggered when click up or down buttons */
  onStep?: (value: number, info: { offset: number; type: 'up' | 'down'; emitter: 'handler' | 'keydown' | 'wheel' }) => void;
}

export interface InputNumberRef {
  focus: () => void;
  blur: () => void;
}

/**
 * InputNumber Component
 * 
 * Enter a number within certain range with the mouse or keyboard.
 * Number input component with increment/decrement controls.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <InputNumber min={0} max={100} step={1} />
 * 
 * // With formatter
 * <InputNumber formatter={value => `$ ${value}`} parser={value => value.replace('$ ', '')} />
 * 
 * // With step controls
 * <InputNumber controls step={0.1} precision={2} />
 * ```
 */
export const InputNumber = forwardRef<InputNumberRef, InputNumberProps>(({
  size = 'middle',
  error = false,
  disabled = false,
  readOnly = false,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  stringMode = false,
  formatter,
  parser,
  controls = true,
  decimalSeparator,
  changeOnBlur = true,
  changeOnWheel = false,
  keyboard = true,
  autoFocus = false,
  prefix,
  suffix,
  value: controlledValue,
  defaultValue,
  onChange,
  onPressEnter,
  onStep,
  className,
  placeholder,
  onFocus,
  onBlur,
  onKeyDown,
  onWheel,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState<number | string | null>(
    controlledValue !== undefined ? controlledValue : defaultValue ?? null
  );
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledValue !== undefined;

  const currentValue = isControlled ? controlledValue : internalValue;

  // Map size to internal size format
  const sizeMap: Record<'small' | 'middle' | 'large', 'sm' | 'md' | 'lg'> = {
    small: 'sm',
    middle: 'md',
    large: 'lg',
  };
  const internalSize = sizeMap[size];

  // Convert step to number
  const stepNum = typeof step === 'string' ? parseFloat(step) : step;

  // Format value for display
  const formatValue = useCallback((val: number | string | null, userTyping = false, input = ''): string => {
    if (val === null || val === undefined || val === '') {
      return '';
    }

    let numValue: number;
    if (typeof val === 'string') {
      numValue = parseFloat(val);
      if (isNaN(numValue)) return '';
    } else {
      numValue = val;
    }

    // Apply precision
    if (precision !== undefined && !isNaN(numValue)) {
      numValue = parseFloat(numValue.toFixed(precision));
    }

    // Apply formatter
    if (formatter) {
      return formatter(numValue, { userTyping, input });
    }

    return numValue.toString();
  }, [formatter, precision]);

  // Parse input string to number
  const parseValue = useCallback((str: string): number | string | null => {
    if (!str || str.trim() === '') {
      return null;
    }

    // Use parser if provided
    if (parser) {
      const parsed = parser(str);
      return parsed;
    }

    // Handle decimal separator
    let cleaned = str;
    if (decimalSeparator) {
      cleaned = cleaned.replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
    }

    // Remove non-numeric characters except decimal point and minus
    cleaned = cleaned.replace(/[^\d.-]/g, '');
    if (!cleaned) return null;

    const num = parseFloat(cleaned);
    if (isNaN(num)) return null;

    // Apply precision
    if (precision !== undefined) {
      const fixed = parseFloat(num.toFixed(precision));
      return stringMode ? fixed.toString() : fixed;
    }

    return stringMode ? num.toString() : num;
  }, [parser, precision, stringMode, decimalSeparator]);

  // Clamp value to min/max
  const clampValue = useCallback((val: number | string | null): number | string | null => {
    if (val === null || val === undefined || val === '') {
      return null;
    }

    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return null;

    let clamped = num;
    if (min !== -Infinity && num < min) clamped = min;
    if (max !== Infinity && num > max) clamped = max;

    // Apply precision
    if (precision !== undefined) {
      clamped = parseFloat(clamped.toFixed(precision));
    }

    return stringMode ? clamped.toString() : clamped;
  }, [min, max, precision, stringMode]);

  // Initialize input value
  useEffect(() => {
    if (currentValue === null || currentValue === undefined || currentValue === '') {
      setInputValue('');
      return;
    }
    const formatted = formatValue(currentValue);
    setInputValue(formatted);
  }, []);

  // Update input value when controlled value changes (only when not focused)
  useEffect(() => {
    if (!focused) {
      const formatted = formatValue(currentValue);
      setInputValue(formatted);
    }
  }, [currentValue, formatValue, focused]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  // Expose focus and blur methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }), []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    // When user is typing, show raw input (no formatter applied)
    setInputValue(newInputValue);

    if (!changeOnBlur) {
      // Update immediately if not using changeOnBlur
      const parsed = parseValue(newInputValue);
      const clamped = clampValue(parsed);
      
      if (!isControlled) {
        setInternalValue(clamped);
      }
      onChange?.(clamped);
    }
    // If changeOnBlur is true, we just update inputValue to show what user is typing
    // The actual value update happens on blur
  }, [changeOnBlur, parseValue, clampValue, isControlled, onChange]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    
    if (changeOnBlur) {
      const parsed = parseValue(inputValue);
      const clamped = clampValue(parsed);
      const finalValue = clamped;
      
      setInputValue(formatValue(finalValue));
      
      if (!isControlled) {
        setInternalValue(finalValue);
      }
      onChange?.(finalValue);
    }
    
    onBlur?.(e);
  }, [changeOnBlur, inputValue, parseValue, clampValue, formatValue, isControlled, onChange, onBlur]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    // When focusing, show the raw value without formatter (if formatter is used)
    if (formatter && currentValue !== null && currentValue !== undefined && currentValue !== '') {
      let numValue: number;
      if (typeof currentValue === 'string') {
        numValue = parseFloat(currentValue);
        if (isNaN(numValue)) {
          setInputValue('');
          onFocus?.(e);
          return;
        }
      } else {
        numValue = currentValue;
      }
      if (precision !== undefined && !isNaN(numValue)) {
        numValue = parseFloat(numValue.toFixed(precision));
      }
      setInputValue(numValue.toString());
    } else {
      setInputValue(formatValue(currentValue));
    }
    onFocus?.(e);
  }, [focused, formatter, currentValue, precision, formatValue, onFocus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) {
      onKeyDown?.(e);
      return;
    }

    if (e.key === 'Enter') {
      onPressEnter?.(e);
      if (changeOnBlur) {
        const parsed = parseValue(inputValue);
        const clamped = clampValue(parsed);
        setInputValue(formatValue(clamped));
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onChange?.(clamped);
      }
    }

    if (keyboard && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const offset = e.key === 'ArrowUp' ? stepNum : -stepNum;
      const current = typeof currentValue === 'string' ? parseFloat(currentValue) : (currentValue ?? 0);
      const numCurrent = isNaN(current) ? (min !== -Infinity && min > 0 ? min : 0) : current;
      const newValue = clampValue(numCurrent + offset);
      
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      setInputValue(formatValue(newValue));
      onStep?.(typeof newValue === 'string' ? parseFloat(newValue) : (newValue ?? 0), {
        offset,
        type: e.key === 'ArrowUp' ? 'up' : 'down',
        emitter: 'keydown',
      });
    }

    onKeyDown?.(e);
  }, [disabled, readOnly, keyboard, stepNum, currentValue, min, clampValue, formatValue, isControlled, onChange, onStep, changeOnBlur, inputValue, parseValue, onPressEnter, onKeyDown]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLInputElement>) => {
    if (!changeOnWheel || disabled || readOnly || !focused) {
      onWheel?.(e);
      return;
    }

    e.preventDefault();
    const offset = e.deltaY < 0 ? stepNum : -stepNum;
    const current = typeof currentValue === 'string' ? parseFloat(currentValue) : (currentValue ?? 0);
    const numCurrent = isNaN(current) ? (min !== -Infinity && min > 0 ? min : 0) : current;
    const newValue = clampValue(numCurrent + offset);
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    setInputValue(formatValue(newValue));
    onStep?.(typeof newValue === 'string' ? parseFloat(newValue) : (newValue ?? 0), {
      offset,
      type: offset > 0 ? 'up' : 'down',
      emitter: 'wheel',
    });
  }, [changeOnWheel, disabled, readOnly, focused, stepNum, currentValue, min, clampValue, formatValue, isControlled, onChange, onStep, onWheel]);

  const handleStep = useCallback((type: 'up' | 'down') => {
    if (disabled || readOnly) return;

    const offset = type === 'up' ? stepNum : -stepNum;
    const current = typeof currentValue === 'string' ? parseFloat(currentValue) : (currentValue ?? 0);
    if (isNaN(current)) {
      // If current value is invalid, start from min or 0
      const startValue = min !== -Infinity && min > 0 ? min : 0;
      const newValue = clampValue(startValue);
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      setInputValue(formatValue(newValue));
      onStep?.(typeof newValue === 'string' ? parseFloat(newValue) : (newValue ?? 0), {
        offset: type === 'up' ? stepNum : -stepNum,
        type,
        emitter: 'handler',
      });
      return;
    }
    
    const newValue = clampValue(current + offset);
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    setInputValue(formatValue(newValue));
    onStep?.(typeof newValue === 'string' ? parseFloat(newValue) : (newValue ?? 0), {
      offset,
      type,
      emitter: 'handler',
    });

    // Focus input after step
    inputRef.current?.focus();
  }, [disabled, readOnly, stepNum, currentValue, min, clampValue, formatValue, isControlled, onChange, onStep]);

  const showControls = controls !== false;
  const upIcon = typeof controls === 'object' && controls.upIcon ? controls.upIcon : (
    <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>arrow_drop_up</span>
  );
  const downIcon = typeof controls === 'object' && controls.downIcon ? controls.downIcon : (
    <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>arrow_drop_down</span>
  );

  return (
    <div
      className={cn(
        styles.inputNumberWrapper,
        styles[internalSize],
        prefix ? styles.hasPrefix : undefined,
        suffix ? styles.hasSuffix : undefined,
        showControls && styles.hasControls,
        className
      )}
    >
      {prefix && (
        <div className={styles.prefix}>
          {prefix}
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        className={cn(
          styles.inputNumber,
          styles[internalSize],
          error && styles.error,
          disabled && styles.disabled,
          readOnly && styles.readOnly
        )}
        value={focused ? inputValue : (formatValue(currentValue) || '')}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        {...props}
      />
      {suffix && (
        <div className={styles.suffix}>
          {suffix}
        </div>
      )}
      {showControls && (
        <div className={styles.controls}>
          <button
            type="button"
            className={cn(styles.controlButton, styles.controlUp)}
            onClick={() => handleStep('up')}
            disabled={disabled || readOnly}
            tabIndex={-1}
            aria-label="Increase value"
          >
            {upIcon}
          </button>
          <button
            type="button"
            className={cn(styles.controlButton, styles.controlDown)}
            onClick={() => handleStep('down')}
            disabled={disabled || readOnly}
            tabIndex={-1}
            aria-label="Decrease value"
          >
            {downIcon}
          </button>
        </div>
      )}
    </div>
  );
});

InputNumber.displayName = 'InputNumber';
