import React, { useState, useRef, useEffect, useCallback, useContext, createContext, useMemo } from 'react';
import styles from './Checkbox.module.css';
import { cn } from '@/lib/utils';

export type CheckboxSize = 'small' | 'middle' | 'large';

export interface CheckboxChangeEvent {
  target: {
    checked: boolean;
  };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: React.ChangeEvent<HTMLInputElement>['nativeEvent'];
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Whether the checkbox is checked by default (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Set indeterminate state */
  indeterminate?: boolean;
  /** Callback when state changes */
  onChange?: (e: CheckboxChangeEvent) => void;
  /** Size */
  size?: CheckboxSize;
  /** Auto focus */
  autoFocus?: boolean;
  /** Custom class name */
  className?: string;
  /** Children (label content) */
  children?: React.ReactNode;
}

interface CheckboxGroupContextValue {
  value?: string[];
  disabled?: boolean;
  name?: string;
  onChange?: (checkedValue: string[]) => void;
  registerValue: (value: string) => void;
  cancelValue: (value: string) => void;
  size?: CheckboxSize;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

/**
 * Checkbox Component
 * 
 * Checkbox component following standard patterns.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 * >
 *   Option
 * </Checkbox>
 * ```
 */
export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  disabled: propDisabled = false,
  indeterminate = false,
  onChange,
  size: propSize = 'middle',
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

  // Handle group context
  const inGroup = groupContext !== null;
  const groupDisabled = groupContext?.disabled || false;
  const disabled = propDisabled || groupDisabled;
  const size = propSize || groupContext?.size || 'middle';

  const groupChecked = useMemo(() => {
    if (!inGroup || !value) return false;
    return groupContext?.value?.includes(String(value)) || false;
  }, [inGroup, value, groupContext?.value]);

  const finalChecked = inGroup && value !== undefined ? groupChecked : checked;

  // Register with group
  useEffect(() => {
    if (inGroup && value !== undefined) {
      groupContext?.registerValue(String(value));
      return () => {
        groupContext?.cancelValue(String(value));
      };
    }
  }, [inGroup, value, groupContext]);

  // Set indeterminate state
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // Auto focus
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
          target: {
            checked: newChecked,
          },
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
        size === 'small' && styles.small,
        size === 'middle' && styles.middle,
        size === 'large' && styles.large,
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
            <span className={styles.indeterminateMark} />
          ) : finalChecked ? (
            <span className={styles.checkmark} />
          ) : null}
        </span>
      </span>
      {children && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export interface CheckboxOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current selected values (controlled) */
  value?: string[];
  /** Default selected values (uncontrolled) */
  defaultValue?: string[];
  /** Callback when selected values change */
  onChange?: (checkedValue: string[]) => void;
  /** Disable all checkboxes */
  disabled?: boolean;
  /** Name attribute for all checkboxes */
  name?: string;
  /** Options */
  options?: string[] | CheckboxOption[];
  /** Size */
  size?: CheckboxSize;
  /** Custom class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Checkbox.Group Component
 * 
 * Group of checkboxes. Group API.
 * 
 * @example
 * ```tsx
 * <Checkbox.Group
 *   value={selected}
 *   onChange={(values) => setSelected(values)}
 *   options={['Option 1', 'Option 2', 'Option 3']}
 * />
 * ```
 */
export function CheckboxGroup({
  value: controlledValue,
  defaultValue = [],
  onChange,
  disabled = false,
  name,
  options,
  size = 'middle',
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
    size,
  };

  const renderOptions = () => {
    if (!options) return null;

    return options.map((option, index) => {
      if (typeof option === 'string') {
        return (
          <Checkbox key={index} value={option} size={size}>
            {option}
          </Checkbox>
        );
      } else {
        return (
          <Checkbox key={option.value} value={option.value} disabled={option.disabled} size={size}>
            {option.label}
          </Checkbox>
        );
      }
    });
  };

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div className={cn(styles.group, className)} style={style} {...props}>
        {options ? renderOptions() : children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}

// Attach Group to Checkbox
(Checkbox as any).Group = CheckboxGroup;
