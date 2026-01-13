import React, { useState } from 'react';
import styles from './PhoneNumberField.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

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

export interface PhoneNumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Field status */
  status?: 'enabled' | 'disabled' | 'error';
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error state (deprecated - use status prop) */
  error?: boolean;
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
  'aria-label'?: string;
  /** ARIA label for the country code selector */
  countryCodeAriaLabel?: string;
}

/**
 * PhoneNumberField component - Compound input with country code selector and phone number input
 * 
 * Follows best practices:
 * - Proper ARIA labels for both parts
 * - Keyboard navigation support
 * - Focus states for entire compound field
 * - Validation support
 * 
 * @example
 * ```tsx
 * <PhoneNumberField
 *   value={phoneNumber}
 *   countryCode="+420"
 *   onChange={(value, code) => setPhoneNumber(value)}
 * />
 * ```
 */
export function PhoneNumberField({
  size = 'md',
  status,
  disabled = false,
  error = false,
  value = '',
  onChange,
  countryCode: initialCountryCode = '+420',
  countries = DEFAULT_COUNTRIES,
  phonePlaceholder = 'Placeholder',
  'aria-label': ariaLabel,
  countryCodeAriaLabel = 'Country code',
  className,
  id,
  ...props
}: PhoneNumberFieldProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  
  const fieldId = React.useId();
  const finalId = id || fieldId;
  const countryCodeId = `${finalId}-country-code`;
  const phoneInputId = `${finalId}-phone`;
  
  // Determine status: priority is status prop > disabled > error prop
  // If status is provided, use it; otherwise determine from disabled/error props
  const finalStatus: 'enabled' | 'disabled' | 'error' = 
    status || 
    (disabled ? 'disabled' : (error ? 'error' : 'enabled'));
  const isDisabled = finalStatus === 'disabled' || disabled;
  const hasError = finalStatus === 'error' || error;
  
  const selectedCountry = countries.find(c => c.code === selectedCountryCode) || countries[0];
  
  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCountryCode(newCode);
    onChange?.(phoneNumber, newCode);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    onChange?.(newValue, selectedCountryCode);
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div
      className={cn(
        styles.phoneNumberField,
        size && styles[size],
        hasError && styles.error,
        isDisabled && styles.disabled,
        isFocused && styles.focused,
        className
      )}
      role="group"
      aria-labelledby={ariaLabel ? `${finalId}-label` : undefined}
    >
      <div className={styles.countryCodeWrapper}>
        {selectedCountry.flag && (
          <span className={styles.flag} aria-hidden="true">
            {selectedCountry.flag}
          </span>
        )}
        <Select
          id={countryCodeId}
          value={selectedCountryCode}
          onChange={handleCountryCodeChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          size={size}
          status={finalStatus}
          className={styles.countryCodeSelect}
          aria-label={countryCodeAriaLabel}
          aria-describedby={props['aria-describedby']}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.code}
            </option>
          ))}
        </Select>
        <span className={styles.chevron} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L1 4h10z" fill="currentColor" />
          </svg>
        </span>
      </div>
      
      <div className={styles.separator} />
      
      <Input
        id={phoneInputId}
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={phonePlaceholder}
        disabled={isDisabled}
        size={size}
        status={finalStatus}
        className={styles.phoneInput}
        aria-label={ariaLabel || 'Phone number'}
        aria-describedby={props['aria-describedby']}
        {...props}
      />
    </div>
  );
}

// Default country codes (can be expanded)
const DEFAULT_COUNTRIES: CountryCode[] = [
  { code: '+420', name: 'Czech Republic', flag: '🇨🇿', iso: 'CZ' },
  { code: '+1', name: 'United States', flag: '🇺🇸', iso: 'US' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+33', name: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', iso: 'NL' },
];
