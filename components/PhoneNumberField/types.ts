import type React from 'react';

export type PhoneNumberFieldSize = 'sm' | 'md' | 'lg';

export interface CountryCode {
  /** Country code (e.g., "+420") */
  code: string;
  /** Country name (e.g., "Czech Republic") */
  name: string;
  /** Flag emoji or icon */
  flag?: string;
  /** ISO country code (e.g., "CZ") */
  iso?: string;
}

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Field size */
  size?: PhoneNumberFieldSize;
  /** Whether the field has a validation error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Phone number value */
  value?: string;
  /** Change handler - receives full phone number with country code */
  onChange?: (value: string, countryCode: string) => void;
  /** Selected country code */
  countryCode?: string;
  /** Available country codes */
  countries?: CountryCode[];
  /** Placeholder for phone number input */
  phonePlaceholder?: string;
  /** ARIA label for the phone number input */
  phoneAriaLabel?: string;
  /** ARIA label for the country code selector */
  countryCodeAriaLabel?: string;
}
