# Field Component Architecture

## Overview

This document explains how form field components work together in our design system, following patterns from Material UI, Chakra UI, and Ant Design.

## Core Principle

**All form control components use base field tokens for styling, and the Field wrapper component manages validation state and passes status tokens to override base styling.**

## Architecture Pattern

### 1. Base Components (Input, Select, Textarea, etc.)

All form control components follow this pattern:

```css
/* Base styling - always uses field-control tokens */
.component {
  border: var(--token-component-border-width-field) solid var(--token-component-field-control-border-default);
  background-color: var(--token-component-field-control-background-default);
}

/* Interactive states - use field-control tokens */
.component:hover {
  border-color: var(--token-component-field-control-border-hover);
  background-color: var(--token-component-field-control-background-hover);
}

.component:focus {
  border-color: var(--token-component-field-control-border-focused);
  background-color: var(--token-component-field-control-background-focused);
}

/* Status overrides - use field-status tokens when status prop is set */
.component.error {
  border-color: var(--token-component-field-status-error-border);
  background-color: var(--token-component-field-status-error-background);
}

.component.disabled {
  border-color: var(--token-component-field-status-disabled-border);
  background-color: var(--token-component-field-status-disabled-background);
}
```

### 2. Field Wrapper Component

The `Field` component:
- Manages validation state (error, disabled)
- Determines status: `enabled` | `disabled` | `error`
- Passes `status` prop to child components
- Handles ARIA attributes
- Displays error messages and helper text

```tsx
<Field label="Email" required error="Email is required" disabled={false}>
  <Input type="email" />
</Field>
```

### 3. Status Propagation

**Priority order:**
1. `status` prop (from Field wrapper)
2. `disabled` prop
3. `error` prop (deprecated, use status)

```tsx
// Field determines status and passes it down
const fieldStatus = disabled ? 'disabled' : (error ? 'error' : 'enabled');

// Child receives status prop
<Input status={fieldStatus} />
```

## How Major Design Systems Handle This

### Material UI
- **TextField** (wrapper) manages validation state
- Passes `error` and `disabled` props to **Input** via context
- Input uses base styling, TextField overrides with error/disabled styles
- Validation logic handled at TextField level

### Chakra UI
- **FormControl** (wrapper) manages `isInvalid` and `isDisabled`
- Passes state to **Input** via context/props
- Input uses base styling, FormControl overrides with error/disabled styles
- Validation logic handled at FormControl level

### Ant Design
- **Form.Item** (wrapper) manages validation state
- Passes `status` prop to **Input**
- Input uses base styling, Form.Item overrides with error/disabled styles
- Validation logic handled at Form.Item level

## Token Structure

### Base Tokens (Always Used)
- `field-control-border-default/hover/focused/active`
- `field-control-background-default/hover/focused`

### Status Tokens (Override Base When Status Prop is Set)
- `field-status-error-border/background/content`
- `field-status-disabled-border/background/content`
- `field-status-enabled-border/background/content` (same as control tokens)

## Components That Follow This Pattern

### Simple Controls
- ✅ `Input` - Uses field-control tokens, accepts status prop
- ✅ `Select` - Uses field-control tokens, accepts status prop
- ✅ `Textarea` - Uses field-control tokens, accepts status prop

### Compound Controls
- ✅ `PhoneNumberField` - Uses field-control tokens, accepts status prop
- ✅ `InputGroup` - Uses field-control tokens, accepts status prop
- ✅ `InputPair` - Uses field-control tokens, accepts status prop
- ✅ `DurationPicker` - Uses field-control tokens, accepts status prop
- ✅ `TimePicker` - Uses field-control tokens, accepts status prop

## Usage Examples

### Basic Usage
```tsx
<Field label="Email" required>
  <Input type="email" />
</Field>
```

### With Validation
```tsx
<Field 
  label="Email" 
  required 
  error={errors.email}
  helperText="Enter your email address"
>
  <Input type="email" />
</Field>
```

### With Disabled State
```tsx
<Field label="Email" disabled>
  <Input type="email" />
</Field>
```

### Compound Fields
```tsx
<Field label="Phone Number" error={errors.phone}>
  <PhoneNumberField 
    value={phone}
    onChange={setPhone}
  />
</Field>
```

## Benefits

1. **Consistency**: All form controls use the same base tokens
2. **Flexibility**: Any component can be wrapped in Field
3. **Validation**: Centralized validation logic at Field level
4. **Accessibility**: Field handles all ARIA attributes
5. **Maintainability**: Status tokens override base tokens automatically

## Prop Architecture

### Field Component (Primary Interface)

Field manages all form-related concerns:
- ✅ `error` - Error message (string) - automatically passes `error={true}` to child
- ✅ `disabled` - Disabled state - automatically passes to child
- ✅ `size` - Size variant - automatically passes to child if not set
- ✅ `maxWidth` - Layout control
- ✅ `label`, `required`, `helperText` - Form concerns
- ✅ ARIA attributes - Automatically managed

### Control Components (Input, Select, Textarea)

Controls are first-class components that can be used standalone or within Field:
- ✅ Core input props: `value`, `onChange`, `placeholder`, `type`, etc.
- ✅ `size` - The size of the input box (`'sm' | 'md' | 'lg'`)
- ✅ `error` - Set validation status (boolean)
- ✅ `disabled` - Whether the input is disabled (boolean)
- ✅ Component-specific props (e.g., `leadingAdornment`, `trailingAdornment` for Input)

**Key Principle:** 
- **Field is the recommended interface** for form fields - provides labels, error messages, ARIA
- **Controls are first-class components** - can be used standalone (like Ant Design's Input)
- Field automatically passes `error` and `disabled` to child controls via `cloneElement`
- Controls accept these props directly for flexibility (standalone usage, compound components)

## Implementation Checklist

For any new form control component:

- [ ] Use `field-control-border-*` and `field-control-background-*` for base styling
- [ ] Support `error` and `disabled` props (boolean)
- [ ] Apply `field-status-error-*` tokens when `error === true`
- [ ] Apply `field-status-disabled-*` tokens when `disabled === true`
- [ ] Use `field-control-*` tokens for hover/focus states when enabled
- [ ] Work seamlessly with Field wrapper component
- [ ] Document that Field is the primary interface for form fields
