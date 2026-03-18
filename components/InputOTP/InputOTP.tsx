import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import styles from './InputOTP.module.css';
import type { InputOTPProps } from './types';

export function InputOTP({
  length = 6,
  size = 'md',
  value: controlledValue,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = false,
  className,
  ...props
}: InputOTPProps) {
  const [internalValue, setInternalValue] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const updateValue = useCallback(
    (newValue: string) => {
      const clamped = newValue.slice(0, length);
      if (!isControlled) setInternalValue(clamped);
      onChange?.(clamped);
      if (clamped.length === length) onComplete?.(clamped);
    },
    [isControlled, length, onChange, onComplete]
  );

  const focusCell = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputRefs.current[clamped]?.focus();
  };

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Only allow digits
    const cleaned = digit.replace(/\D/g, '');
    if (!cleaned) return;

    const chars = value.split('');
    chars[index] = cleaned[0];

    // Fill any gaps with empty strings
    for (let i = 0; i < length; i++) {
      if (chars[i] === undefined) chars[i] = '';
    }

    const newValue = chars.join('');
    updateValue(newValue);

    // Move to next cell
    if (index < length - 1) {
      focusCell(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (value[index]) {
          // Clear current cell
          const chars = value.split('');
          chars[index] = '';
          updateValue(chars.join(''));
        } else if (index > 0) {
          // Move to previous cell and clear it
          const chars = value.split('');
          chars[index - 1] = '';
          updateValue(chars.join(''));
          focusCell(index - 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) focusCell(index - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < length - 1) focusCell(index + 1);
        break;
      case 'Home':
        e.preventDefault();
        focusCell(0);
        break;
      case 'End':
        e.preventDefault();
        focusCell(length - 1);
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      updateValue(pasted);
      focusCell(Math.min(pasted.length, length - 1));
    }
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  useEffect(() => {
    if (autoFocus) focusCell(0);
  }, [autoFocus]);

  return (
    <div
      className={cn(styles.root, styles[size], className)}
      role="group"
      aria-label="One-time password"
      {...props}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          className={cn(
            styles.cell,
            error && styles.error,
            disabled && styles.disabled,
            value[index] && styles.filled
          )}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
