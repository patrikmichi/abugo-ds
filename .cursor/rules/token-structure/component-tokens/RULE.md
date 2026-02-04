---
description: "Component tokens: shared vs component files, property-first naming, no hardcoded CSS, migration."
alwaysApply: false
globs:
  - "tokens/system/componentTokens/**/*.json"
  - "components/**/*.css"
---

# Component Token Structure Rules

## Overview
This document defines the rules for organizing component-level design tokens. All component tokens must follow these patterns to ensure consistency and maintainability.

## Core Principles

### 1. Property-First Paths (Shared Files)

In **shared** files, paths put the property first: `{property}.{component}.{variant}`. The CSS var is `--token-component-{kebab-path}` (e.g. `fontSize.alert.message` → `--token-component-font-size-alert-message`). There is no literal `component-` segment in the token path; the `--token-component-` prefix comes from the collection name.

**Examples:**
- `fontSize.alert.message` → `--token-component-font-size-alert-message`
- `lineHeight.toast.small` → `--token-component-line-height-toast-small`
- `icon.button.sm` → `--token-component-icon-button-sm`
- `padding.x.field.md` → `--token-component-padding-x-field-md`
- `gap.alert.icon` → `--token-component-gap-alert-icon`

### 2. Shared Files for Common Properties
Properties that are shared across multiple components should be grouped in shared files:

**Shared Files:**
- `tokens/system/componentTokens/shared/fontSize.json` - All font-size tokens
- `tokens/system/componentTokens/shared/lineHeight.json` - All line-height tokens
- `tokens/system/componentTokens/shared/icon.json` - All icon size tokens
- `tokens/system/componentTokens/shared/fontWeight.json` - All font-weight tokens
- `tokens/system/componentTokens/shared/padding.json` - All padding tokens
- `tokens/system/componentTokens/shared/gap.json` - All gap tokens
- `tokens/system/componentTokens/shared/radius.json` - All border-radius tokens
- `tokens/system/componentTokens/shared/height.json` - All height tokens

**Structure in Shared Files:**
```json
{
  "componentName": {
    "variant": {
      "$type": "propertyType",
      "$value": "{reference}"
    }
  }
}
```

**Example:**
```json
{
  "alert": {
    "message": {
      "$type": "fontSizes",
      "$value": "{typography.fontSize.3}"
    },
    "description": {
      "$type": "fontSizes",
      "$value": "{typography.fontSize.2}"
    }
  },
  "toast": {
    "small": {
      "$type": "fontSizes",
      "$value": "{typography.fontSize.2}"
    },
    "large": {
      "$type": "fontSizes",
      "$value": "{typography.fontSize.3}"
    }
  }
}
```

### 3. Component-Specific Files
Component files (`tokens/system/componentTokens/components/{component}.json`) should only contain:
- Colors (background, content, border)
- Component-specific spacing that doesn't fit shared patterns
- Component-specific dimensions
- Component-specific shadows
- Other component-unique properties

**DO NOT include in component files:**
- ❌ Font sizes (use `shared/fontSize.json`)
- ❌ Line heights (use `shared/lineHeight.json`)
- ❌ Icon sizes (use `shared/icon.json`)
- ❌ Font weights (use `shared/fontWeight.json`)
- ❌ Padding (use `shared/padding.json`)
- ❌ Gaps (use `shared/gap.json`)
- ❌ Border radius (use `shared/radius.json`)
- ❌ Heights (use `shared/height.json`)

### 4. No Hardcoded Values in CSS
**All CSS values must use tokens.** No hardcoded:
- ❌ Pixel values (`24px`, `16px`, etc.)
- ❌ Rem/Em values (`1rem`, `0.5em`, etc.)
- ❌ Percentages (`50%`, `100%`, etc.)
- ❌ Colors (`#ffffff`, `rgba(0,0,0,0.5)`, etc.)
- ❌ Durations (`0.3s`, `200ms`, etc.)
- ❌ Transforms (`translateY(-10px)`, etc.)

**Exceptions:**
- ✅ `0` (zero values are acceptable)
- ✅ `100%` for full width/height when semantically correct
- ✅ `50%` for border-radius when creating circles
- ✅ `1` for line-height when explicitly needed
- ✅ `999px` for "pill" border-radius (should be tokenized as `radius-full`)
- ✅ `1px` in `calc(var(--token-...) ± 1px)` for text optical alignment only (see **text-optical-alignment** rule)

### 5. Token Reference Hierarchy
1. **Primitive Tokens** - Base values (colors, spacing, typography scales)
2. **Semantic Tokens** - Meaning-based tokens (background.active.accent.default)
3. **Component Tokens** - Component-specific tokens

**Always prefer:**
1. Semantic tokens for component and shared tokens.
2. Component tokens only for component-specific values.

Do **not** reference primitives from component or shared tokens (except e.g. `universal.transparent`).

## Build and Migration

**Build order:** `npm run build:tokens` (merge into `tokens/output/`) then `npm run build:css-variables` (generates `styles/tokens.css`). The generator prefers `tokens/output/` when it exists.

**When moving props to shared:** run `move-to-shared-tokens.js` → `apply-token-var-map.js` → `build:tokens` → `build:css-variables`. Use `diagnose-missing-component-vars.mjs` to confirm no missing/duplicate `--token-component-*`.

## Migration Checklist

When adding or updating component tokens:

- [ ] Check if property belongs in a shared file
- [ ] Use property-first naming: `component-{property}-{component}-{variant}`
- [ ] Reference semantic tokens when possible
- [ ] Reference **semantic** tokens only (primitives only where allowed, e.g. `universal.transparent`). If a semantic token is missing, add it first; do not reference primitives from component/shared.
- [ ] Update CSS to use new token names
- [ ] Remove hardcoded values from CSS
- [ ] Verify tokens build correctly
- [ ] Test component in Storybook

## Examples

### ✅ Correct: Font Size in Shared File
```json
// tokens/system/componentTokens/shared/fontSize.json
{
  "alert": {
    "message": {
      "$type": "fontSizes",
      "$value": "{typography.fontSize.3}"
    }
  }
}
```

```css
/* CSS Usage */
.message {
  font-size: var(--token-component-font-size-alert-message);
}
```

### ❌ Incorrect: Font Size in Component File
```json
// tokens/system/componentTokens/components/alert.json
{
  "message": {
    "fontSize": {
      "$value": "16px"  // ❌ Wrong location, hardcoded value
    }
  }
}
```

### ✅ Correct: Padding in Shared File
```json
// tokens/system/componentTokens/shared/padding.json
{
  "alert": {
    "sm": {
      "$type": "spacing",
      "$value": "{padding.s}"
    },
    "lg": {
      "$type": "spacing",
      "$value": "{padding.m}"
    }
  }
}
```

### ✅ Correct: Component-Specific Color
```json
// tokens/system/componentTokens/components/alert.json
{
  "success": {
    "content": {
      "background": {
        "$type": "color",
        "$value": "{background.passive.success.subtle}"
      }
    }
  }
}
```

## Token Naming Conventions

### Variants
- Size variants: `sm`, `md`, `lg`, `xs`, `xl`
- State variants: `default`, `hover`, `pressed`, `disabled`, `selected`
- Type variants: `message`, `description`, `icon`, `label`

### Properties
- `font-size` → `fontSize` (camelCase in JSON, kebab-case in CSS)
- `line-height` → `lineHeight`
- `font-weight` → `fontWeight`
- `padding-x` → `paddingX` or `padding.x`
- `padding-y` → `paddingY` or `padding.y`

## CSS Variable Naming

CSS variables are generated from token paths:
- JSON: `alert.message.fontSize` → CSS: `--token-component-font-size-alert-message`
- JSON: `toast.small.icon` → CSS: `--token-component-icon-toast-small`

The pattern is: `--token-{collection}-{kebab-path}`. Shared (property-first) paths become e.g. `--token-component-gap-accordion-header`, `--token-component-padding-block-accordion-header-lg`.

**Path consistency:** Use one structure per logical slot. For example, use `file-item` only; avoid both `file.item` and `file-item` under the same component, since both can produce the same path prefix and the generator may not traverse one of them, causing missing vars in `tokens.css`.

**After moving tokens to shared:** `move-to-shared-tokens.js` writes `token-component-var-map.json` (old → new `--token-component-*`). Run `apply-token-var-map.js` to update `components/**` and `styles/**` to the new names. Then `npm run build:tokens` and `npm run build:css-variables`.

## Questions?

If you're unsure where a token should go:
1. Is it a typography property? → Shared typography file
2. Is it spacing (padding/gap)? → Shared spacing file
3. Is it a size (icon/height)? → Shared size file
4. Is it component-specific (color/background)? → Component file
