# Component Token Structure Rules

## Overview
This document defines the rules for organizing component-level design tokens. All component tokens must follow these patterns to ensure consistency and maintainability.

## Core Principles

### 1. Property-First Naming Pattern
Component tokens follow the pattern: `component-{property}-{component}-{variant}`

**Examples:**
- `component-font-size-alert-message`
- `component-line-height-toast-small`
- `component-icon-button-sm`
- `component-padding-x-field-md`
- `component-gap-alert-icon`

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

### 5. Token Reference Hierarchy
1. **Primitive Tokens** - Base values (colors, spacing, typography scales)
2. **Semantic Tokens** - Meaning-based tokens (background.active.accent.default)
3. **Component Tokens** - Component-specific tokens

**Always prefer:**
1. Semantic tokens when available
2. Primitive tokens when semantic tokens don't exist
3. Component tokens only for component-specific needs

## Migration Checklist

When adding or updating component tokens:

- [ ] Check if property belongs in a shared file
- [ ] Use property-first naming: `component-{property}-{component}-{variant}`
- [ ] Reference semantic tokens when possible
- [ ] Reference primitive tokens as fallback
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

The pattern is: `--token-{collection}-{property}-{component}-{variant}`

## Questions?

If you're unsure where a token should go:
1. Is it a typography property? → Shared typography file
2. Is it spacing (padding/gap)? → Shared spacing file
3. Is it a size (icon/height)? → Shared size file
4. Is it component-specific (color/background)? → Component file
