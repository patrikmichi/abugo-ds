import { useState, useRef, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

import styles from './Toggle.module.css';
import type { IProps } from './types';

const Toggle = ({
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
}: IProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

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

        onChange?.(newChecked, e as unknown as React.MouseEvent<HTMLButtonElement>);
        onClick?.(newChecked, e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    },
    [disabled, loading, checked, isControlled, onChange, onClick]
  );

  const hasChildren = checkedChildren || unCheckedChildren;

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
      {hasChildren && (
        <span className={styles.inner}>
          {checked ? checkedChildren : unCheckedChildren}
        </span>
      )}
    </button>
  );
};

export default Toggle;
