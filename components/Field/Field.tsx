import React from 'react';
import styles from './Field.module.css';
import { cn } from '@/lib/utils';

export type ValidateStatus = 'error' | 'warning' | 'success' | 'validating';

export interface ColProps {
  span?: number;
  offset?: number;
  flex?: string | number;
}

export interface ValidationRule {
  /** Whether the field is required */
  required?: boolean;
  /** Error message. Will auto generate if not provided */
  message?: string;
  /** Validation pattern */
  pattern?: RegExp;
  /** Minimum length */
  min?: number;
  /** Maximum length */
  max?: number;
  /** Minimum value (for numbers) */
  minValue?: number;
  /** Maximum value (for numbers) */
  maxValue?: number;
  /** Custom validation function */
  validator?: (rule: ValidationRule, value: any) => Promise<void> | void;
  /** Validation trigger timing */
  trigger?: string | string[];
  /** Transform value before validation */
  transform?: (value: any) => any;
  /** Validation type */
  type?: 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email';
  /** Whether to stop validation on first rule failure */
  validateFirst?: boolean;
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field name - used to identify the field in form data */
  name?: string | string[];
  /** Field label text */
  label?: React.ReactNode;
  /** Whether the field is required */
  required?: boolean;
  /** Validation rules array */
  rules?: ValidationRule[];
  /** Fields that this field depends on. When dependencies change, this field will revalidate */
  dependencies?: string[];
  /** Whether the field should update when form values change. Can be boolean or function */
  shouldUpdate?: boolean | ((prevValues: any, curValues: any) => boolean);
  /** Initial value for the field */
  initialValue?: any;
  /** Error message to display. When provided, automatically passes error state to child controls. */
  error?: string;
  /** Helper/hint text to display (alias for help) */
  helperText?: string;
  /** Help text to display (alias for helperText) */
  help?: string;
  /** Additional prompt message below the field */
  extra?: React.ReactNode;
  /** Field size - automatically passed to child controls if they support it */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field is disabled. Automatically passes disabled state to child controls. */
  disabled?: boolean;
  /** Maximum width of the field (e.g., '400px', '50%', '600px'). Fields remain responsive with width: 100% up to this max. */
  maxWidth?: string | number;
  /** HTML id for the field (auto-generated if not provided) */
  id?: string;
  /** HTML for attribute for the label */
  htmlFor?: string;
  /** Whether to display a colon after the label */
  colon?: boolean;
  /** Layout of label, similar to Col component */
  labelCol?: ColProps | number;
  /** Layout of input controls, similar to Col component */
  wrapperCol?: ColProps | number;
  /** Tooltip for the label */
  tooltip?: React.ReactNode;
  /** Validation status */
  validateStatus?: ValidateStatus;
  /** Whether to show feedback icon */
  hasFeedback?: boolean;
  /** Whether to hide the field */
  hidden?: boolean;
  /** Whether the field should have no styles (noStyle mode) */
  noStyle?: boolean;
  /** Transform value before passing to form component */
  normalize?: (value: any, prevValue: any, allValues: any) => any;
  /** Extract value from event or other onChange arguments */
  getValueFromEvent?: (...args: any[]) => any;
  /** Provide additional props for the child component */
  getValueProps?: (value: any) => Record<string, any>;
  /** Prop name of the child component that holds the value */
  valuePropName?: string;
  /** Event that triggers validation */
  trigger?: string;
  /** Whether to stop validation on first rule failure */
  validateFirst?: boolean;
  /** Children - typically an Input, Select, Textarea, or other control */
  children?: React.ReactNode;
}

/**
 * Field component - Wrapper for form controls with label, error message, and validation
 * 
 * Field is the recommended way to use form controls. It manages validation state, ARIA attributes,
 * labels, and error messages. Controls (Input, Select, Textarea) can also be used standalone.
 * 
 * Features:
 * - Layout control (labelCol, wrapperCol)
 * - Label alignment and colon support
 * - Tooltip support
 * - Validation status (error, warning, success, validating)
 * - Feedback icons
 * - Value normalization and extraction
 * - Extra information display
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Field label="Email" required error="Email is required" size="md">
 *   <Input type="email" />
 * </Field>
 * 
 * // With layout control
 * <Field label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
 *   <Input type="email" />
 * </Field>
 * 
 * // With validation status
 * <Field label="Email" validateStatus="success" hasFeedback>
 *   <Input type="email" />
 * </Field>
 * ```
 */
export function Field({
  name,
  label,
  required = false,
  rules,
  dependencies,
  shouldUpdate,
  initialValue,
  error,
  helperText,
  help,
  extra,
  size = 'md',
  disabled = false,
  maxWidth,
  id,
  htmlFor,
  colon = true,
  labelCol,
  wrapperCol,
  tooltip,
  validateStatus,
  hasFeedback = false,
  hidden = false,
  noStyle = false,
  normalize,
  getValueFromEvent,
  getValueProps,
  valuePropName = 'value',
  trigger = 'onChange',
  validateFirst = false,
  className,
  children,
  style,
  ...props
}: FieldProps) {
  // Generate unique ID if not provided
  const fieldId = React.useId();
  const finalId = id || fieldId;
  const labelId = `${finalId}-label`;
  const errorId = `${finalId}-error`;
  const helperId = `${finalId}-helper`;
  const extraId = `${finalId}-extra`;
  
  // Apply initial value if provided
  React.useEffect(() => {
    if (initialValue !== undefined && React.isValidElement(children)) {
      // Note: In a full Form context, this would be handled by Form's initialValues
      // This is a basic implementation for standalone Field usage
    }
  }, [initialValue, children]);

  // Determine validation status
  const finalValidateStatus: ValidateStatus | undefined = 
    validateStatus || (error ? 'error' : undefined);
  
  const hasError = !!error || finalValidateStatus === 'error';
  const displayHelp = help || helperText;
  
  // Extract required from rules if not explicitly set
  const isRequired = required || rules?.some(rule => rule.required === true);
  
  // Clone children to inject props (id, aria attributes, error, disabled, size)
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as any;
      // Determine if child should be disabled (Field's disabled prop takes precedence)
      const childDisabled = disabled || childProps.disabled;
      
      // Determine if child should show error (Field's error takes precedence)
      const childError = hasError || childProps.error;
      
      const clonedProps: any = {
        id: htmlFor || finalId,
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
        displayHelp && !error ? helperId : undefined,
        extra ? extraId : undefined,
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
      if (childProps.size === undefined) {
        clonedProps.size = size;
      }
      
      // Apply value extraction and normalization if provided
      if (getValueFromEvent && childProps[trigger]) {
        const originalHandler = childProps[trigger];
        clonedProps[trigger] = (...args: any[]) => {
          const extractedValue = getValueFromEvent(...args);
          const normalizedValue = normalize 
            ? normalize(extractedValue, childProps[valuePropName], {})
            : extractedValue;
          if (originalHandler) {
            originalHandler(normalizedValue);
          }
        };
      } else if (normalize && childProps[trigger]) {
        // Apply normalization even without getValueFromEvent
        const originalHandler = childProps[trigger];
        clonedProps[trigger] = (...args: any[]) => {
          const value = args[0];
          const normalizedValue = normalize(value, childProps[valuePropName], {});
          if (originalHandler) {
            originalHandler(normalizedValue);
          }
        };
      }
      
      // Apply value props if provided
      if (getValueProps && childProps[valuePropName] !== undefined) {
        const valueProps = getValueProps(childProps[valuePropName]);
        Object.assign(clonedProps, valueProps);
      }
      
      return React.cloneElement(child, clonedProps);
    }
    return child;
  });

  // Convert maxWidth to CSS value (handle both string and number)
  const maxWidthValue = maxWidth 
    ? typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
    : undefined;

  // Calculate layout styles
  const layoutStyle: React.CSSProperties = {};
  if (labelCol || wrapperCol) {
    const labelColValue = typeof labelCol === 'number' ? labelCol : labelCol?.span || 6;
    const wrapperColValue = typeof wrapperCol === 'number' ? wrapperCol : wrapperCol?.span || 18;
    const total = labelColValue + wrapperColValue;
    layoutStyle.gridTemplateColumns = `${labelColValue}fr ${wrapperColValue}fr`;
  }

  // Get feedback icon based on status
  const getFeedbackIcon = () => {
    if (!hasFeedback || !finalValidateStatus) return null;
    
    const iconName = 
      finalValidateStatus === 'error' ? 'error' :
      finalValidateStatus === 'warning' ? 'warning' :
      finalValidateStatus === 'success' ? 'check_circle' :
      finalValidateStatus === 'validating' ? 'progress_activity' :
      null;
    
    if (!iconName) return null;
    
    return (
      <span 
        className={cn(styles.feedbackIcon, styles[finalValidateStatus])}
        aria-hidden="true"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          {iconName}
        </span>
      </span>
    );
  };

  // Early return checks must come AFTER all hooks
  // NoStyle mode - just return children with minimal wrapper
  if (noStyle) {
    return <>{enhancedChildren}</>;
  }

  // Hidden mode
  if (hidden) {
    return null;
  }

  return (
    <div
      className={cn(
        styles.field,
        size && styles[size],
        hasError && styles.error,
        disabled && styles.disabled,
        finalValidateStatus ? styles[finalValidateStatus] : undefined,
        (labelCol !== undefined && labelCol !== null) ? styles.hasLabelCol : undefined,
        (wrapperCol !== undefined && wrapperCol !== null) ? styles.hasWrapperCol : undefined,
        className
      )}
      style={{
        ...style,
        ...(maxWidthValue && { maxWidth: maxWidthValue, width: '100%' }),
        ...layoutStyle,
      }}
      {...(name && { 'data-field-name': Array.isArray(name) ? name.join('.') : name })}
      {...props}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={htmlFor || finalId}
          className={cn(
            styles.label,
            isRequired && styles.required
          )}
        >
          <span className={styles.labelContent}>
            {label}
            {isRequired && (
              <span className={styles.requiredAsterisk} aria-label="required">
                *
              </span>
            )}
            {colon && <span className={styles.colon}>:</span>}
          </span>
          {tooltip && (
            <span className={styles.tooltip} title={typeof tooltip === 'string' ? tooltip : undefined}>
              <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
                info
              </span>
            </span>
          )}
        </label>
      )}
      
      <div className={styles.controlWrapper}>
        <div className={styles.control}>
          {enhancedChildren}
          {hasFeedback && getFeedbackIcon()}
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
        
        {displayHelp && !error && (
          <div
            id={helperId}
            className={styles.helperText}
          >
            {displayHelp}
          </div>
        )}
        
        {extra && (
          <div
            id={extraId}
            className={styles.extra}
          >
            {extra}
          </div>
        )}
      </div>
    </div>
  );
}
