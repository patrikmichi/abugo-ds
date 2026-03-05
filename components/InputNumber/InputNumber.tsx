import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

import { cn } from '@/lib/utils';

import styles from './InputNumber.module.css';
import { formatValue, parseValue, clampValue } from './utils';
import type { InputNumberProps, InputNumberRef } from './types';

export const InputNumber = forwardRef<InputNumberRef, InputNumberProps>(({
  size = 'md',
  error = false,
  disabled = false,
  readOnly = false,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  formatter,
  parser,
  controls = false,
  prefix,
  suffix,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  placeholder,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState<number | null>(
    controlledValue !== undefined ? controlledValue : defaultValue ?? null
  );
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (!focused) {
      setInputValue(formatValue(currentValue, precision, formatter));
    }
  }, [currentValue, focused, precision, formatter]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }), []);

  const updateValue = useCallback((newValue: number | null) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseValue(inputValue, parser);
    const clamped = clampValue(parsed, min, max, precision);
    setInputValue(formatValue(clamped, precision, formatter));
    updateValue(clamped);
  }, [inputValue, parser, min, max, precision, formatter, updateValue]);

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (currentValue !== null) {
      setInputValue(currentValue.toString());
    }
  }, [currentValue]);

  const handleStep = useCallback((direction: 'up' | 'down') => {
    if (disabled || readOnly) return;

    const offset = direction === 'up' ? step : -step;
    const current = currentValue ?? (min !== -Infinity ? min : 0);
    const newValue = clampValue(current + offset, min, max, precision);

    updateValue(newValue);
    setInputValue(formatValue(newValue, precision, formatter));
    inputRef.current?.focus();
  }, [disabled, readOnly, step, currentValue, min, max, precision, formatter, updateValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep('down');
    } else if (e.key === 'Enter') {
      handleBlur();
    }
  }, [disabled, readOnly, handleStep, handleBlur]);

  return (
    <div
      className={cn(
        styles.wrapper,
        styles[size],
        !!prefix && styles.hasPrefix,
        !!suffix && styles.hasSuffix,
        controls && styles.hasControls,
        className
      )}
    >
      {prefix && <div className={styles.prefix}>{prefix}</div>}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        className={cn(
          styles.input,
          styles[size],
          error && styles.error,
          disabled && styles.disabled,
          readOnly && styles.readOnly
        )}
        value={focused ? inputValue : formatValue(currentValue, precision, formatter)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        {...props}
      />
      {suffix && <div className={styles.suffix}>{suffix}</div>}
      {controls && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlUp}
            onClick={() => handleStep('up')}
            disabled={disabled || readOnly}
            tabIndex={-1}
            aria-label="Increase"
          >
            <span className="material-symbols-outlined">arrow_drop_up</span>
          </button>
          <button
            type="button"
            className={styles.controlDown}
            onClick={() => handleStep('down')}
            disabled={disabled || readOnly}
            tabIndex={-1}
            aria-label="Decrease"
          >
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </button>
        </div>
      )}
    </div>
  );
});

InputNumber.displayName = 'InputNumber';
