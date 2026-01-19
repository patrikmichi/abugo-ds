import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Toggle.module.css';
import { cn } from '@/lib/utils';

export type ToggleSize = 'default' | 'small';

export interface ToggleProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick' | 'size'> {
  /** Automatically focus the component when it mounts */
  autoFocus?: boolean;
  /** Whether the Switch is checked (controlled) */
  checked?: boolean;
  /** Content to be shown when checked */
  checkedChildren?: React.ReactNode;
  /** Initial checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Disable the Switch */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** The size of the Switch */
  size?: ToggleSize;
  /** Content to be shown when unchecked */
  unCheckedChildren?: React.ReactNode;
  /** Callback when checked state changes */
  onChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback when Switch is clicked */
  onClick?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Toggle (Switch) Component
 * 
 * Switch component for toggling between two states.
 * 
 * 
 * @example
 * ```tsx
 * <Toggle
 *   checked={checked}
 *   onChange={(checked, e) => setChecked(checked)}
 *   checkedChildren="ON"
 *   unCheckedChildren="OFF"
 * />
 * ```
 */
export function Toggle({
  autoFocus = false,
  checked: controlledChecked,
  checkedChildren,
  defaultChecked = false,
  disabled = false,
  loading = false,
  size = 'default',
  unCheckedChildren,
  onChange,
  onClick,
  className,
  style,
  ...props
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  // Auto focus
  useEffect(() => {
    if (autoFocus && buttonRef.current && !disabled) {
      buttonRef.current.focus();
    }
  }, [autoFocus, disabled]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      const newChecked = !checked;

      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      onChange?.(newChecked, e);
      onClick?.(newChecked, e);
    },
    [disabled, loading, checked, isControlled, onChange, onClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const newChecked = !checked;

        if (!isControlled) {
          setInternalChecked(newChecked);
        }

        onChange?.(newChecked, e as any);
        onClick?.(newChecked, e as any);
      }
    },
    [disabled, loading, checked, isControlled, onChange, onClick]
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || loading}
      className={cn(
        styles.toggle,
        size === 'small' && styles.small,
        checked && styles.checked,
        !checked && styles.unchecked,
        disabled && styles.disabled,
        loading && styles.loading,
        className
      )}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      {...props}
    >
      <span className={styles.handle}>
        {loading && (
          <span className={styles.loadingIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
              progress_activity
            </span>
          </span>
        )}
      </span>
      {(checkedChildren || unCheckedChildren) && (
        <span className={styles.inner}>
          {checked ? checkedChildren : unCheckedChildren}
        </span>
      )}
    </button>
  );
}
