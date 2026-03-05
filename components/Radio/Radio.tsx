import { useState, useCallback, useContext } from 'react';

import { cn } from '@/lib/utils';

import RadioGroup from './RadioGroup';
import { RadioGroupContext } from './RadioGroupContext';
import styles from './Radio.module.css';
import type { RadioProps, RadioChangeEvent } from './types';

const Radio = ({
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
}: RadioProps) => {
  const groupContext = useContext(RadioGroupContext);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const isInGroup = groupContext?.value !== undefined;

  const checked = isControlled
    ? controlledChecked
    : isInGroup
      ? groupContext.value === value
      : internalChecked;

  const disabled = propDisabled ?? groupContext?.disabled ?? false;
  const name = propName ?? groupContext?.name;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const event: RadioChangeEvent = {
        target: {
          value: value ?? '',
          checked: e.target.checked,
        },
        stopPropagation: () => e.stopPropagation(),
        preventDefault: () => e.preventDefault(),
        nativeEvent: e.nativeEvent,
      };

      if (!isControlled && !isInGroup) {
        setInternalChecked(e.target.checked);
      }

      if (groupContext?.onChange) {
        groupContext.onChange(event);
      } else {
        onChange?.(event);
      }
    },
    [disabled, value, isControlled, isInGroup, groupContext, onChange]
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
};

// Attach RadioGroup as sub-component for Radio.Group pattern
Radio.Group = RadioGroup;

export default Radio;
