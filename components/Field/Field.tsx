import React, { useId, useEffect, Children, isValidElement, cloneElement } from 'react';
import styles from './Field.module.css';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';
import type { FieldProps, ValidateStatus } from './types';

export function Field({
  name,
  label,
  required = false,
  rules,
  error,
  helperText,
  help,
  extra,
  size = 'md',
  disabled = false,
  maxWidth,
  id,
  htmlFor,
  colon = false,
  labelCol,
  wrapperCol,
  tooltip,
  validateStatus,
  hasFeedback = false,
  noStyle = false,
  normalize,
  getValueFromEvent,
  valuePropName = 'value',
  trigger = 'onChange',
  className,
  children,
  style,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const finalId = id || generatedId;
  const labelId = `${finalId}-label`;
  const errorId = `${finalId}-error`;
  const helperId = `${finalId}-helper`;
  const extraId = `${finalId}-extra`;

  const finalValidateStatus: ValidateStatus | undefined = validateStatus || (error ? 'error' : undefined);
  const hasError = !!error || finalValidateStatus === 'error';
  const displayHelp = help || helperText;
  const isRequired = required || rules?.some(rule => rule.required === true);

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const childProps = child.props as Record<string, unknown>;
    const clonedProps: Record<string, unknown> = {
      id: htmlFor || finalId,
      disabled: disabled || childProps.disabled,
      error: hasError || childProps.error,
    };

    if (label) clonedProps['aria-labelledby'] = labelId;

    const describedBy = [
      error ? errorId : undefined,
      displayHelp && !error ? helperId : undefined,
      extra ? extraId : undefined,
    ].filter(Boolean);
    if (describedBy.length > 0) clonedProps['aria-describedby'] = describedBy.join(' ');
    if (hasError) clonedProps['aria-invalid'] = true;
    if (required) clonedProps['aria-required'] = true;
    if (childProps.size === undefined) clonedProps.size = size;

    if (normalize && childProps[trigger]) {
      const originalHandler = childProps[trigger] as (...args: unknown[]) => void;
      clonedProps[trigger] = (...args: unknown[]) => {
        const value = getValueFromEvent ? getValueFromEvent(...args) : args[0];
        originalHandler?.(normalize(value, childProps[valuePropName], {}));
      };
    }

    return cloneElement(child, clonedProps);
  });

  const maxWidthValue = maxWidth
    ? typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
    : undefined;

  const layoutStyle: React.CSSProperties = {};
  if (labelCol || wrapperCol) {
    const labelColValue = typeof labelCol === 'number' ? labelCol : (labelCol?.span || 6);
    const wrapperColValue = typeof wrapperCol === 'number' ? wrapperCol : (wrapperCol?.span || 18);
    layoutStyle.gridTemplateColumns = `${labelColValue}fr ${wrapperColValue}fr`;
  }

  if (noStyle) return <>{enhancedChildren}</>;

  return (
    <div
      className={cn(
        styles.field,
        styles[size],
        hasError && styles.error,
        disabled && styles.disabled,
        finalValidateStatus && styles[finalValidateStatus],
        (labelCol !== undefined && labelCol !== null) && styles.hasLabelCol,
        (wrapperCol !== undefined && wrapperCol !== null) && styles.hasWrapperCol,
        className
      )}
      style={{ ...style, ...(maxWidthValue && { maxWidth: maxWidthValue, width: '100%' }), ...layoutStyle }}
      {...(name && { 'data-field-name': Array.isArray(name) ? name.join('.') : name })}
      {...props}
    >
      {label && (
        <label id={labelId} htmlFor={htmlFor || finalId} className={cn(styles.label, isRequired && styles.required)}>
          <span className={styles.labelContent}>
            {label}
            {isRequired && <span className={styles.requiredAsterisk} aria-label="required">*</span>}
            {colon && <span className={styles.colon}>:</span>}
          </span>
          {tooltip && (
            <Tooltip title={tooltip} placement="top">
              <span className={styles.tooltipIcon}>
                <span className="material-symbols-outlined">info</span>
              </span>
            </Tooltip>
          )}
        </label>
      )}

      <div className={styles.controlWrapper}>
        <div className={styles.control}>
          {enhancedChildren}
          {hasFeedback && finalValidateStatus && (
            <span className={cn(styles.feedbackIcon, styles[finalValidateStatus])} aria-hidden="true">
              <span className="material-symbols-outlined">
                {finalValidateStatus === 'error' ? 'error' : 'progress_activity'}
              </span>
            </span>
          )}
        </div>

        {error && (
          <div id={errorId} className={styles.errorMessage} role="alert" aria-live="polite">
            {error}
          </div>
        )}

        {displayHelp && !error && (
          <div id={helperId} className={styles.helperText}>{displayHelp}</div>
        )}

        {extra && (
          <div id={extraId} className={styles.extra}>{extra}</div>
        )}
      </div>
    </div>
  );
}
