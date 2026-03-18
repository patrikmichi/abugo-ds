import React, { useState, useRef, useEffect, useCallback, useContext, useMemo } from 'react';
import styles from './Checkbox.module.css';
import { cn } from '@/lib/utils';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import type { CheckboxProps, CheckboxChangeEvent } from './types';

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  disabled: propDisabled = false,
  error = false,
  indeterminate = false,
  onChange,
  autoFocus = false,
  className,
  children,
  value,
  name,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const inputRef = useRef<HTMLInputElement>(null);
  const groupContext = useContext(CheckboxGroupContext);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const inGroup = groupContext !== null;
  const groupDisabled = groupContext?.disabled || false;
  const disabled = propDisabled || groupDisabled;

  const groupChecked = useMemo(() => {
    if (!inGroup || !value) return false;
    return groupContext?.value?.includes(String(value)) || false;
  }, [inGroup, value, groupContext?.value]);

  const finalChecked = inGroup && value !== undefined ? groupChecked : checked;

  useEffect(() => {
    if (inGroup && value !== undefined) {
      groupContext?.registerValue(String(value));
      return () => {
        groupContext?.cancelValue(String(value));
      };
    }
  }, [inGroup, value, groupContext]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;

      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      if (inGroup && value !== undefined && groupContext) {
        const currentValue = groupContext.value || [];
        let newValue: string[];
        if (newChecked) {
          newValue = [...currentValue, String(value)];
        } else {
          newValue = currentValue.filter((v) => v !== String(value));
        }
        groupContext.onChange?.(newValue);
      } else {
        const event: CheckboxChangeEvent = {
          target: { checked: newChecked },
          stopPropagation: () => e.stopPropagation(),
          preventDefault: () => e.preventDefault(),
          nativeEvent: e.nativeEvent,
        };
        onChange?.(event);
      }
    },
    [isControlled, inGroup, value, groupContext, onChange]
  );

  const finalName = inGroup && groupContext?.name ? groupContext.name : name;

  return (
    <label
      className={cn(
        styles.checkboxWrapper,
        disabled && styles.disabled,
        error && styles.error,
        finalChecked && styles.checked,
        indeterminate && styles.indeterminate,
        className
      )}
    >
      <span className={styles.checkbox}>
        <input
          ref={inputRef}
          type="checkbox"
          checked={finalChecked}
          disabled={disabled}
          onChange={handleChange}
          name={finalName}
          value={value}
          className={styles.input}
          {...props}
        />
        <span className={styles.checkboxInner}>
          {indeterminate ? (
            <span className={cn('material-symbols-outlined', styles.icon)}>remove</span>
          ) : finalChecked ? (
            <span className={cn('material-symbols-outlined', styles.icon)}>check_small</span>
          ) : null}
        </span>
      </span>
      {children && <span className={styles.label}>{children}</span>}
    </label>
  );
}
