import { useState, useCallback } from 'react';

import { cn } from '@/lib/utils';

import Radio from './Radio';
import { RadioGroupContext } from './RadioGroupContext';
import styles from './Radio.module.css';
import type { RadioGroupProps, RadioChangeEvent, RadioGroupContextType } from './types';

const RadioGroup = ({
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  disabled = false,
  name,
  className,
  children,
  ...props
}: RadioGroupProps) => {
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

  const renderOptions = () =>
    options?.map((option, index) => {
      const optionValue = typeof option === 'string' ? option : option.value;
      const optionLabel = typeof option === 'string' ? option : option.label;
      const optionDisabled = typeof option === 'object' ? option.disabled : false;

      return (
        <Radio
          key={optionValue || index}
          value={optionValue}
          disabled={optionDisabled || disabled}
        >
          {optionLabel}
        </Radio>
      );
    });

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={cn(styles.radioGroup, className)}
        role="radiogroup"
        {...props}
      >
        {options ? renderOptions() : children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
