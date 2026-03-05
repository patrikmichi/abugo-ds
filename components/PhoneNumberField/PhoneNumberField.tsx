import React, { useState, useId } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

import { DEFAULT_COUNTRIES } from './const';
import styles from './PhoneNumberField.module.css';
import type { IProps } from './types';

const PhoneNumberField = ({
  size = 'md',
  error = false,
  disabled = false,
  value = '',
  onChange,
  countryCode: initialCountryCode = '+420',
  countries = DEFAULT_COUNTRIES,
  phonePlaceholder = 'Placeholder',
  phoneAriaLabel,
  countryCodeAriaLabel = 'Country code',
  className,
  id,
  ...props
}: IProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const generatedId = useId();
  const finalId = id || generatedId;
  const countryCodeId = `${finalId}-country-code`;
  const phoneInputId = `${finalId}-phone`;

  const selectedCountry = countries.find((c) => c.code === selectedCountryCode) || countries[0];

  const countryOptions = countries.map((country) => ({
    value: country.code,
    label: country.code,
  }));

  const handleCountryCodeChange = (newValue: string | string[]) => {
    const newCode = Array.isArray(newValue) ? newValue[0] : newValue;
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
        styles[size],
        error && styles.error,
        disabled && styles.disabled,
        isFocused && styles.focused,
        className
      )}
      role="group"
      {...props}
    >
      <div className={styles.countryCodeWrapper}>
        {selectedCountry?.flag && (
          <span className={styles.flag} aria-hidden="true">
            {selectedCountry.flag}
          </span>
        )}
        <Select
          id={countryCodeId}
          value={selectedCountryCode}
          options={countryOptions}
          onChange={handleCountryCodeChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          size={size}
          error={error}
          className={styles.countryCodeSelect}
          aria-label={countryCodeAriaLabel}
        />
        <span className={styles.chevron} aria-hidden="true">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 'var(--token-primitive-icon-size-icon-size-1)',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            expand_more
          </span>
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
        disabled={disabled}
        size={size}
        error={error}
        className={styles.phoneInput}
        aria-label={phoneAriaLabel || 'Phone number'}
      />
    </div>
  );
};

export default PhoneNumberField;
