---
name: component-tokens
description: Component token rules. Shared vs component files, property-first naming, no hardcoded CSS values, migration workflow.
user-invocable: false
---

# Component Token Structure Rules

## Core Principles

### 1. Property-First Paths (Shared Files)

In **shared** files, paths put the property first: `{property}.{component}.{variant}`. The CSS var is `--token-component-{kebab-path}`.

**Examples:**
- `fontSize.alert.message` -> `--token-component-font-size-alert-message`
- `lineHeight.toast.small` -> `--token-component-line-height-toast-small`
- `icon.button.sm` -> `--token-component-icon-button-sm`
- `padding.x.field.md` -> `--token-component-padding-x-field-md`
- `gap.alert.icon` -> `--token-component-gap-alert-icon`

### 2. Shared Files for Common Properties

**Shared Files:**
- `tokens/system/componentTokens/shared/fontSize.json`
- `tokens/system/componentTokens/shared/lineHeight.json`
- `tokens/system/componentTokens/shared/icon.json`
- `tokens/system/componentTokens/shared/fontWeight.json`
- `tokens/system/componentTokens/shared/padding.json`
- `tokens/system/componentTokens/shared/gap.json`
- `tokens/system/componentTokens/shared/radius.json`
- `tokens/system/componentTokens/shared/height.json`

### 3. Component-Specific Files

Component files (`tokens/system/componentTokens/components/{component}.json`) should only contain:
- Colors (background, content, border)
- Component-specific spacing that doesn't fit shared patterns
- Component-specific dimensions and shadows

**DO NOT include in component files:**
- Font sizes, line heights, font weights (use shared files)
- Padding, gaps, border radius, heights (use shared files)
- Icon sizes (use shared/icon.json)

### 4. No Hardcoded Values in CSS

**All CSS values must use tokens.** No hardcoded pixels, rems, percentages, colors, or durations.

**Exceptions:**
- `0` (zero values)
- `100%` for full width/height
- `50%` for border-radius circles
- `1px` in `calc(var(--token-...) +/- 1px)` for text optical alignment only

### 5. Token Reference Hierarchy

1. Component tokens -> Semantic tokens
2. Semantic tokens -> Primitives
3. Never reference primitives from component/shared tokens (except `universal.transparent`)

## Build and Migration

**Build order:** `npm run build:tokens` -> `npm run build:css-variables`

**When moving props to shared:** `move-to-shared-tokens.js` -> `apply-token-var-map.js` -> `build:tokens` -> `build:css-variables`. Use `diagnose-missing-component-vars.mjs` to confirm no missing/duplicate vars.

## Migration Checklist

When adding or updating component tokens:
- Check if property belongs in a shared file
- Use property-first naming for shared tokens
- Reference semantic tokens only
- Update CSS to use new token names
- Remove hardcoded values from CSS
- Verify tokens build correctly

## Where Does Each Property Go?

1. Typography property? -> Shared typography file
2. Spacing (padding/gap)? -> Shared spacing file
3. Size (icon/height)? -> Shared size file
4. Component-specific (color/background/shadow)? -> Component file
