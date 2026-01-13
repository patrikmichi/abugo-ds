# CSS Modules Guide: Using Design Tokens

> **For Developers**: This guide explains how to use design tokens in CSS Modules. All tokens from Figma are automatically available as CSS custom properties (CSS variables).

---

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Token Levels](#token-levels)
- [Using Tokens in CSS Modules](#using-tokens-in-css-modules)
- [Token Naming Convention](#token-naming-convention)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The CSS Modules system converts all design tokens into CSS custom properties (CSS variables) organized by token level:

- **Primitive Tokens** → `--token-primitive-*`
- **Semantic Tokens** → `--token-semantic-*`
- **Component Tokens** → `--token-component-*`

These variables are automatically generated from your token files and available globally in your CSS.

---

## Setup

### 1. Generate CSS Variables

After making changes to tokens, regenerate the CSS variables:

```bash
npm run build:css-variables
```

This generates `styles/tokens.css` with all CSS custom properties.

### 2. Import Tokens in Your App

The tokens are automatically imported in `app/globals.css`:

```css
@import '../styles/tokens.css';
```

### 3. CSS Modules are Enabled by Default

Next.js supports CSS Modules out of the box. Just create a `.module.css` file:

```css
/* Button.module.css */
.button {
  padding: var(--token-component-button-padding-sm);
  background-color: var(--token-semantic-background-active-accent-default);
}
```

---

## Token Levels

### Primitive Tokens

Base design values (colors, spacing, typography, etc.)

**CSS Variable Format:** `--token-primitive-{key}`

**Examples:**
```css
/* Colors */
color: var(--token-primitive-yellow-100);
background-color: var(--token-primitive-grey-700);

/* Spacing */
padding: var(--token-primitive-spacing-1);
margin: var(--token-primitive-spacing-4);

/* Typography */
font-size: var(--token-primitive-typography-font-size-base);
font-weight: var(--token-primitive-typography-font-weight-medium);
```

### Semantic Tokens

Meaning-based tokens that reference primitives

**CSS Variable Format:** `--token-semantic-{key}`

**Examples:**
```css
/* Backgrounds */
background-color: var(--token-semantic-background-passive-neutral-default);
background-color: var(--token-semantic-background-active-accent-default);

/* Content/Text */
color: var(--token-semantic-content-passive-neutral-default);
color: var(--token-semantic-content-passive-on-accent);

/* Borders */
border-color: var(--token-semantic-border-active-accent-default);
border-width: var(--token-semantic-border-width-default);

/* Spacing */
gap: var(--token-semantic-gap-xs);
padding: var(--token-semantic-padding-sm);
```

### Component Tokens

Component-specific design tokens

**CSS Variable Format:** `--token-component-{component}-{property}-{variant}`

**Examples:**
```css
/* Button tokens */
padding: var(--token-component-button-padding-sm);
font-size: var(--token-component-font-size-button-sm);
border-radius: var(--token-component-radius-button-sm);

/* Field tokens */
height: var(--token-component-field-height-sm);
padding: var(--token-component-field-padding-md);
```

---

## Using Tokens in CSS Modules

### Basic Usage

```css
/* Button.module.css */
.button {
  /* Component tokens */
  padding: var(--token-component-button-padding-sm);
  border-radius: var(--token-component-radius-button-sm);
  
  /* Semantic tokens */
  background-color: var(--token-semantic-background-active-accent-default);
  color: var(--token-semantic-content-passive-on-accent);
  
  /* Transitions */
  transition: background-color var(--token-component-animation-button-duration) var(--token-component-animation-button-easing);
}

.button:hover {
  background-color: var(--token-semantic-background-active-accent-hover);
}
```

### With Fallbacks

You can provide fallback values:

```css
.button {
  padding: var(--token-component-button-padding-sm, 8px);
  color: var(--token-semantic-content-passive-neutral-default, #333);
}
```

### Using Utility Functions (TypeScript)

For type-safe token access in TypeScript/JavaScript:

```typescript
import { semanticToken, componentToken } from '@/styles/token-utils';

// In your component
const styles = {
  padding: semanticToken('padding-sm'),
  backgroundColor: semanticToken('background-active-accent-default'),
  buttonPadding: componentToken('button', 'padding', 'sm'),
};
```

---

## Token Naming Convention

### Primitive Tokens

- Flattened keys: `spacing-1`, `radius-2`, `yellow-100`
- Nested keys: `yellow.100` → `--token-primitive-yellow-100`

### Semantic Tokens

- Kebab-case: `content-passive-neutral-default` → `--token-semantic-content-passive-neutral-default`
- Nested: `radius.sm` → `--token-semantic-radius-sm`

### Component Tokens

- Path-based: `button.primary.background.default` → `--token-component-button-primary-background-default`
- Category-first: `radius.button.sm` → `--token-component-radius-button-sm`

---

## Examples

### Example 1: Button Component

```css
/* Button.module.css */
.button {
  /* Component-level tokens */
  padding: var(--token-component-button-padding-md);
  border-radius: var(--token-component-radius-button-md);
  font-size: var(--token-component-font-size-button-md);
  
  /* Semantic tokens */
  background-color: var(--token-semantic-background-active-accent-default);
  color: var(--token-semantic-content-passive-on-accent);
  border: var(--token-semantic-border-width-default) solid var(--token-semantic-border-active-accent-default);
  
  /* Animation */
  transition: all var(--token-component-animation-button-duration) var(--token-component-animation-button-easing);
}

.button:hover {
  background-color: var(--token-semantic-background-active-accent-hover);
}

.button:disabled {
  opacity: var(--token-semantic-opacity-disabled);
  cursor: not-allowed;
}
```

### Example 2: Card Component

```css
/* Card.module.css */
.card {
  /* Semantic tokens */
  background-color: var(--token-semantic-background-passive-neutral-default);
  border: var(--token-semantic-border-width-default) solid var(--token-semantic-border-passive-neutral-default);
  border-radius: var(--token-semantic-radius-md);
  padding: var(--token-semantic-padding-lg);
  box-shadow: var(--token-semantic-shadow-sm);
  
  /* Spacing */
  gap: var(--token-semantic-gap-md);
}

.cardTitle {
  color: var(--token-semantic-content-passive-neutral-strong);
  font-size: var(--token-semantic-typography-heading-md);
}
```

### Example 3: Form Field

```css
/* Field.module.css */
.field {
  /* Component tokens */
  height: var(--token-component-field-height-md);
  padding: var(--token-component-field-padding-md);
  border-radius: var(--token-component-radius-field-md);
  
  /* Semantic tokens */
  background-color: var(--token-semantic-background-passive-neutral-default);
  border: var(--token-semantic-border-width-default) solid var(--token-semantic-border-passive-neutral-default);
  color: var(--token-semantic-content-passive-neutral-default);
}

.field:focus {
  border-color: var(--token-semantic-border-active-accent-default);
  outline: none;
}
```

---

## Best Practices

### 1. Use the Right Token Level

- **Primitives**: Only when you need raw values (rare)
- **Semantic**: For most UI elements (backgrounds, text, borders)
- **Component**: For component-specific styling

### 2. Prefer Semantic Tokens

```css
/* ✅ Good - uses semantic token */
.button {
  background-color: var(--token-semantic-background-active-accent-default);
}

/* ❌ Avoid - uses primitive directly */
.button {
  background-color: var(--token-primitive-brand-700);
}
```

### 3. Use Component Tokens for Component-Specific Values

```css
/* ✅ Good - uses component token */
.button {
  padding: var(--token-component-button-padding-sm);
}

/* ❌ Avoid - uses generic semantic token */
.button {
  padding: var(--token-semantic-padding-sm);
}
```

### 4. Regenerate After Token Changes

Always run `npm run build:css-variables` after modifying tokens.

### 5. Use Fallbacks for Critical Styles

```css
.button {
  /* Fallback ensures button is still visible if token fails */
  background-color: var(--token-semantic-background-active-accent-default, #0066cc);
}
```

---

## Troubleshooting

### Token Not Found

**Problem:** CSS variable is undefined or not working.

**Solutions:**
1. Run `npm run build:css-variables` to regenerate
2. Check token name matches exactly (case-sensitive, kebab-case)
3. Verify token exists in token files

### Reference Not Resolved

**Problem:** Token value shows as `{reference}` instead of actual value.

**Solutions:**
1. Check that referenced token exists
2. Verify `$collectionName` is correct
3. Run `npm run build:tokens` first, then `npm run build:css-variables`

### TypeScript Errors

**Problem:** TypeScript doesn't recognize CSS module imports.

**Solution:** Ensure `styles/css-modules.d.ts` is included in your `tsconfig.json`.

---

## Related Documentation

- [Token Structure](TOKEN_STRUCTURE.md) - How tokens are organized
- [Component Token Rules](COMPONENT_TOKEN_RULES.md) - Component token guidelines
- [Designer Guide](DESIGNER_GUIDE.md) - Using tokens in Figma

---

## Quick Reference

### Generate CSS Variables
```bash
npm run build:css-variables
```

### Token Variable Prefixes
- Primitives: `--token-primitive-*`
- Semantic: `--token-semantic-*`
- Component: `--token-component-*`

### File Locations
- Generated CSS: `styles/tokens.css`
- TypeScript types: `styles/css-modules.d.ts`
- Utility functions: `styles/token-utils.ts`
