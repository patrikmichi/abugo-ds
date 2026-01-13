import React from 'react';
import styles from './Field.module.css';
import { cn } from '@/lib/utils';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label text */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Helper/hint text to display */
  helperText?: string;
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field is disabled */
  disabled?: boolean;
  /** HTML id for the field (auto-generated if not provided) */
  id?: string;
  /** Children - typically an Input, Select, Textarea, or other control */
  children?: React.ReactNode;
}

/**
 * Field component - Wrapper for form controls with label, error message, and validation
 * 
 * Follows best practices from Material UI, Chakra UI, and Ant Design:
 * - Proper ARIA labels and relationships
 * - Validation error display
 * - Required field indicators
 * - Helper text support
 * 
 * @example
 * ```tsx
 * <Field label="Email" required error="Email is required">
 *   <Input type="email" />
 * </Field>
 * ```
 */
export function Field({
  label,
  required = false,
  error,
  helperText,
  size = 'md',
  disabled = false,
  id,
  className,
  children,
  ...props
}: FieldProps) {
  // Generate unique ID if not provided
  const fieldId = React.useId();
  const finalId = id || fieldId;
  const labelId = `${finalId}-label`;
  const errorId = `${finalId}-error`;
  const helperId = `${finalId}-helper`;
  
  // Determine field status: enabled, disabled, or error
  const hasError = !!error;
  const isDisabled = disabled;
  
  // Determine status for child components
  // Priority: disabled > error > enabled
  const fieldStatus: 'enabled' | 'disabled' | 'error' = 
    isDisabled ? 'disabled' : 
    hasError ? 'error' : 
    'enabled';
  
  // Clone children to inject props (id, aria attributes, status, size)
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Determine child's status
      // Priority: Field's validation state (disabled > error) > child's explicit status > enabled
      // This ensures Field's validation always takes precedence, but allows child to override in special cases
      const childStatus = child.props.status;
      const finalStatus: 'enabled' | 'disabled' | 'error' = 
        isDisabled ? 'disabled' : // Field disabled always wins
        hasError ? 'error' :      // Field error wins (unless disabled)
        childStatus ||            // Use child's status if provided
        'enabled';                // Default to enabled
      
      // Determine if child should be disabled
      const childDisabled = isDisabled || child.props.disabled;
      
      return React.cloneElement(child, {
        id: finalId,
        'aria-labelledby': label ? labelId : undefined,
        'aria-describedby': [
          error ? errorId : undefined,
          helperText && !error ? helperId : undefined,
        ].filter(Boolean).join(' ') || undefined,
        'aria-invalid': hasError ? true : undefined,
        'aria-required': required ? true : undefined,
        disabled: childDisabled,
        // Always pass status to child components that support it
        // Field's validation state takes priority over child's status
        status: finalStatus,
        // Pass size to child if it supports it and doesn't have its own
        ...(child.props.size === undefined && { size }),
        // Also pass error prop for backward compatibility
        ...(child.props.error !== undefined && { error: hasError }),
      } as any);
    }
    return child;
  });

  return (
    <div
      className={cn(
        styles.field,
        size && styles[size],
        hasError && styles.error,
        disabled && styles.disabled,
        className
      )}
      {...props}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={finalId}
          className={cn(styles.label, required && styles.required)}
        >
          {label}
          {required && (
            <span className={styles.requiredAsterisk} aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <div className={styles.control}>
        {enhancedChildren}
      </div>
      
      {error && (
        <div
          id={errorId}
          className={styles.errorMessage}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div
          id={helperId}
          className={styles.helperText}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
