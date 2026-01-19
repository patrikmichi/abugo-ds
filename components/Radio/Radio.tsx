import React, { useState, useCallback, useContext, useRef, useEffect } from 'react';
import styles from './Radio.module.css';
import { cn } from '@/lib/utils';

export type RadioSize = 'small' | 'middle' | 'large';
export type RadioButtonStyle = 'outline' | 'solid';

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
  /** Auto focus */
  autoFocus?: boolean;
  /** Callback when radio state changes */
  onChange?: (e: RadioChangeEvent) => void;
  /** Size of radio */
  size?: RadioSize;
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
  size?: RadioSize;
  buttonStyle?: RadioButtonStyle;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null);

/**
 * Radio Component
 * 
 * Radio button component for single selection within a group.
 * Supports single selection within a group.
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
 * 
 * // Radio buttons (button style)
 * <Radio.Group buttonStyle="outline" defaultValue="a">
 *   <Radio.Button value="a">Hangzhou</Radio.Button>
 *   <Radio.Button value="b">Shanghai</Radio.Button>
 * </Radio.Group>
 * ```
 */
export function Radio({
  checked: controlledChecked,
  defaultChecked = false,
  value,
  disabled: propDisabled,
  autoFocus = false,
  onChange,
  size: propSize,
  className,
  style,
  children,
  name: propName,
  ...props
}: RadioProps) {
  const groupContext = useContext(RadioGroupContext);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled
    ? controlledChecked
    : groupContext?.value !== undefined
      ? groupContext.value === value
      : internalChecked;

  const disabled = propDisabled ?? groupContext?.disabled ?? false;
  const size = propSize ?? groupContext?.size ?? 'middle';
  const name = propName ?? groupContext?.name;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

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
        styles[size],
        className
      )}
      style={style}
    >
      <input
        ref={inputRef}
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
  /** Size of radio buttons */
  size?: RadioSize;
  /** Button style */
  buttonStyle?: RadioButtonStyle;
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
  size = 'middle',
  buttonStyle,
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
    size,
    buttonStyle,
  };

  if (options) {
    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          className={cn(
            styles.radioGroup,
            buttonStyle && styles[buttonStyle],
            styles[size],
            className
          )}
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
                size={size}
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

export interface RadioButtonProps extends RadioProps {
  /** Button style */
  buttonStyle?: RadioButtonStyle;
}

/**
 * Radio Button Component
 * 
 * Radio styled as a button. Used within Radio.Group with buttonStyle prop.
 * Supports 'outline' and 'solid' styles.
 * 
 * @example
 * ```tsx
 * <Radio.Group buttonStyle="outline" defaultValue="a">
 *   <Radio.Button value="a">Hangzhou</Radio.Button>
 *   <Radio.Button value="b">Shanghai</Radio.Button>
 *   <Radio.Button value="c">Beijing</Radio.Button>
 * </Radio.Group>
 * ```
 */
export function RadioButton({
  buttonStyle = 'outline',
  className,
  ...props
}: RadioButtonProps) {
  const groupContext = useContext(RadioGroupContext);
  const finalButtonStyle = buttonStyle || groupContext?.buttonStyle || 'outline';

  return (
    <Radio
      {...props}
      className={cn(styles.radioButton, styles[finalButtonStyle], className)}
    />
  );
}

// Attach sub-components
(Radio as any).Group = RadioGroup;
(Radio as any).Button = RadioButton;
