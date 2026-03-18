import React, { useState, useRef, useCallback } from 'react';
import styles from './Checkbox.module.css';
import { cn } from '@/lib/utils';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { Checkbox } from './Checkbox';
import type { CheckboxGroupProps, CheckboxGroupContextValue } from './types';

export function CheckboxGroup({
  value: controlledValue,
  defaultValue = [],
  onChange,
  disabled = false,
  name,
  options,
  direction = 'vertical',
  className,
  children,
  style,
  ...props
}: CheckboxGroupProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const registeredValues = useRef<Set<string>>(new Set());

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (checkedValue: string[]) => {
      if (!isControlled) {
        setInternalValue(checkedValue);
      }
      onChange?.(checkedValue);
    },
    [isControlled, onChange]
  );

  const registerValue = useCallback((val: string) => {
    registeredValues.current.add(val);
  }, []);

  const cancelValue = useCallback((val: string) => {
    registeredValues.current.delete(val);
  }, []);

  const contextValue: CheckboxGroupContextValue = {
    value,
    disabled,
    name,
    onChange: handleChange,
    registerValue,
    cancelValue,
  };

  const renderOptions = () => {
    if (!options) return null;
    return options.map((option, index) => {
      if (typeof option === 'string') {
        return (
          <Checkbox key={index} value={option}>
            {option}
          </Checkbox>
        );
      } else {
        return (
          <Checkbox key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </Checkbox>
        );
      }
    });
  };

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div
        className={cn(styles.group, direction === 'horizontal' && styles.groupHorizontal, className)}
        style={style}
        {...props}
      >
        {options ? renderOptions() : children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}
