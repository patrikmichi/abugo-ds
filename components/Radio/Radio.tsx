import React, { useState, useCallback, useContext } from 'react';
import styles from './Radio.module.css';
import { cn } from '@/lib/utils';

export interface RadioChangeEvent {
  target: {
    value: any;
    checked: boolean;
  };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Whether radio is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Value of radio */
  value?: any;
  /** Whether radio is disabled */
  disabled?: boolean;
  /** Callback when radio state changes */
  onChange?: (e: RadioChangeEvent) => void;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Children (label content) */
  children?: React.ReactNode;
}

// Radio Group Context
interface RadioGroupContextType {
  value?: any;
  onChange?: (e: RadioChangeEvent) => void;
  disabled?: boolean;
  name?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null);

/**
 * Radio Component
 *
 * Radio button component for single selection within a group.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Radio value="option1">Option 1</Radio>
 * <Radio value="option2">Option 2</Radio>
 *
 * // With Radio.Group
 * <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
 *   <Radio value="apple">Apple</Radio>
 *   <Radio value="orange">Orange</Radio>
 * </Radio.Group>
 * ```
 */
export function Radio({
  checked: controlledChecked,
  defaultChecked = false,
  value,
  disabled: propDisabled,
  onChange,
  className,
  style,
  children,
  name: propName,
  ...props
}: RadioProps) {
  const groupContext = useContext(RadioGroupContext);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled
    ? controlledChecked
    : groupContext?.value !== undefined
      ? groupContext.value === value
      : internalChecked;

  const disabled = propDisabled ?? groupContext?.disabled ?? false;
  const name = propName ?? groupContext?.name;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const event: RadioChangeEvent = {
        target: {
          value,
          checked: e.target.checked,
        },
        stopPropagation: () => e.stopPropagation(),
        preventDefault: () => e.preventDefault(),
        nativeEvent: e.nativeEvent,
      };

      if (!isControlled && groupContext?.value === undefined) {
        setInternalChecked(e.target.checked);
      }

      if (groupContext?.onChange) {
        groupContext.onChange(event);
      } else {
        onChange?.(event);
      }
    },
    [disabled, value, isControlled, groupContext, onChange]
  );

  return (
    <label
      className={cn(
        styles.radioWrapper,
        checked && styles.checked,
        disabled && styles.disabled,
        className
      )}
      style={style}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={styles.radio}
        {...props}
      />
      <span className={styles.radioInner} />
      {children && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export interface RadioOption {
  label: React.ReactNode;
  value: any;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value (controlled) */
  value?: any;
  /** Default value (uncontrolled) */
  defaultValue?: any;
  /** Callback when value changes */
  onChange?: (e: RadioChangeEvent) => void;
  /** Options array */
  options?: (string | RadioOption)[];
  /** Disable all radios */
  disabled?: boolean;
  /** Name attribute */
  name?: string;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Children (Radio components) */
  children?: React.ReactNode;
}

/**
 * Radio Group Component
 *
 * Group of radio buttons. Only one radio can be selected at a time.
 * Supports both children and options prop.
 *
 * @example
 * ```tsx
 * // Using children
 * <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
 *   <Radio value="option1">Option 1</Radio>
 *   <Radio value="option2">Option 2</Radio>
 * </Radio.Group>
 *
 * // Using options prop
 * <Radio.Group
 *   options={[
 *     { label: 'Apple', value: 'apple' },
 *     { label: 'Orange', value: 'orange' },
 *   ]}
 *   defaultValue="apple"
 * />
 * ```
 */
export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  disabled = false,
  name,
  className,
  style,
  children,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: RadioChangeEvent) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    },
    [isControlled, onChange]
  );

  const contextValue: RadioGroupContextType = {
    value,
    onChange: handleChange,
    disabled,
    name,
  };

  if (options) {
    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          className={cn(styles.radioGroup, className)}
          style={style}
          role="radiogroup"
          {...props}
        >
          {options.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            const optionDisabled = typeof option === 'object' ? option.disabled : false;

            return (
              <Radio
                key={typeof optionValue === 'string' || typeof optionValue === 'number' ? optionValue : index}
                value={optionValue}
                disabled={optionDisabled || disabled}
              >
                {optionLabel}
              </Radio>
            );
          })}
        </div>
      </RadioGroupContext.Provider>
    );
  }

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={cn(styles.radioGroup, className)}
        style={style}
        role="radiogroup"
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// Attach sub-components
Radio.Group = RadioGroup;

export namespace Radio {
  export type Group = typeof RadioGroup;
}
