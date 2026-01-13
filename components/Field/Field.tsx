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
  
  const hasError = !!error;
  
  // Clone children to inject props (id, aria attributes, error, disabled, size)
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Determine if child should be disabled (Field's disabled prop takes precedence)
      const childDisabled = disabled || child.props.disabled;
      
      // Determine if child should show error (Field's error takes precedence)
      const childError = hasError || child.props.error;
      
      const clonedProps: any = {
        id: finalId,
        disabled: childDisabled,
        // Field's validation state takes priority over child's error prop
        error: childError,
      };
      
      // Add aria attributes only if they have values
      if (label) {
        clonedProps['aria-labelledby'] = labelId;
      }
      
      const describedBy = [
        error ? errorId : undefined,
        helperText && !error ? helperId : undefined,
      ].filter(Boolean);
      if (describedBy.length > 0) {
        clonedProps['aria-describedby'] = describedBy.join(' ');
      }
      
      if (hasError) {
        clonedProps['aria-invalid'] = true;
      }
      
      if (required) {
        clonedProps['aria-required'] = true;
      }
      
      // Pass size to child if it supports it and doesn't have its own
      if (child.props.size === undefined) {
        clonedProps.size = size;
      }
      
      return React.cloneElement(child, clonedProps);
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
