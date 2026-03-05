import type { HTMLAttributes, ReactNode } from 'react';

export type ValidateStatus = 'error' | 'validating';

export interface ColProps {
  span?: number;
  offset?: number;
  flex?: string | number;
}

export interface ValidationRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minValue?: number;
  maxValue?: number;
  validator?: (rule: ValidationRule, value: unknown) => Promise<void> | void;
  trigger?: string | string[];
  transform?: (value: unknown) => unknown;
  type?: 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email';
  validateFirst?: boolean;
}

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  name?: string | string[];
  label?: ReactNode;
  required?: boolean;
  rules?: ValidationRule[];
  dependencies?: string[];
  shouldUpdate?: boolean | ((prevValues: unknown, curValues: unknown) => boolean);
  initialValue?: unknown;
  error?: string;
  helperText?: string;
  help?: string;
  extra?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  maxWidth?: string | number;
  htmlFor?: string;
  colon?: boolean;
  labelCol?: ColProps | number;
  wrapperCol?: ColProps | number;
  tooltip?: ReactNode;
  validateStatus?: ValidateStatus;
  hasFeedback?: boolean;
  noStyle?: boolean;
  normalize?: (value: unknown, prevValue: unknown, allValues: unknown) => unknown;
  getValueFromEvent?: (...args: unknown[]) => unknown;
  getValueProps?: (value: unknown) => Record<string, unknown>;
  valuePropName?: string;
  trigger?: string;
  validateFirst?: boolean;
  children?: ReactNode;
}
