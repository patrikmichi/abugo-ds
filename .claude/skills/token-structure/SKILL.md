---
name: token-structure
description: Design token structure, naming conventions, and architecture guidelines. Three-layer architecture (primitives, semantic, component), naming patterns, file organization.
user-invocable: false
---

# Design Token Structure and Naming Conventions

## Token Architecture

Design tokens follow a three-layer architecture:

1. **Primitives** - Raw values. Source: `tokens/system/primitives/**`. Output: `tokens/output/primitives.json`.
2. **Semantic Tokens** - Primitives paired with semantic meaning. Source: `tokens/system/semanticTokens/**`. Output: `tokens/output/semanticTokens.json`.
3. **Component Tokens** - Semantic tokens applied to components. Source: `tokens/system/componentTokens/{shared,components}/**`. Output: `tokens/output/componentTokens.json`.

### Layering Rules

- Component tokens **MUST** reference semantic tokens (except `universal.transparent`)
- Semantic tokens **MUST** reference primitives
- Never reference primitives directly from component tokens
- Never create circular references

## Naming Conventions

### Token Names

- Use **kebab-case** for all token names (W3C DTCG compliance)
- Typography properties use **camelCase** (W3C DTCG standard)
- Examples: `content-passive-neutral-default`, `typography-fontSize-1`

### Size Abbreviations

- `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

### Semantic Token Pattern

`[property]-[participation]-[intent]-[state]`

- **Property**: `content`, `background`, `border`
- **Participation**: `passive`, `active`
- **Intent**: `neutral`, `accent`, `danger`, `success`, `warning`, `info`, `upgrade`
- **State**: `default`, `hover`, `pressed`, `disabled`, `selected`

## Primitives Structure

All primitive categories are **flattened** (no category wrappers):

- Colors: `yellow.100`, `grey.000`, `brand.500`
- Spacing: `spacing-1`, `spacing-2`
- Border Radius: `radius-0`, `radius-1`
- Border Width: `border-width-0`, `border-width-1`
- Shadows: `shadow-xs`, `shadow-sm`
- Animation: `duration-fast`, `easing-ease-out`
- Sizing: `size-1`, `size-2`

## Semantic Tokens Structure

Nested categories:
- `radius.{none, xs, sm, md, lg, xl, xxl, full}`
- `icon.{xxs, xs, sm, md, lg, xl, xxl, huge}`
- `gap.{xxs, xs, s, m, l, xl, xxl}`
- `padding.{xxxs, xxs, xs, s, m, l, xl, xxl, xxxl, xxxxl}`
- `control.height.{xxxs, xxs, xs, sm, md, lg}`
- `typography.headline-size.{h1-h6}`, `typography.body-size.{xs, sm, md, lg}`

Color tokens use flat structure: `content-passive-neutral-default`

## Component Tokens Structure

Component tokens use nested structures (`{component}.{variant}.{property}.{state}`). Typography, padding, gap, radius, icon sizes, and height live in **shared** files (property-first); colors, shadows, and component-only spacing live in **component** files.

**For detailed component token rules, see the component-tokens skill.**

## Token Properties

### Required Properties

- `$type` - Token type (color, dimension, spacing, etc.)
- `$collectionName` - Source collection ("primitives" or "semanticTokens")
- `$value` - Token value or reference
- `$description` - Clear description of token purpose

### $type Values

- Colors: `color`
- Spacing: `spacing`
- Border Radius: `borderRadius`
- Border Width: `borderWidth`
- Font Sizes: `fontSizes`
- Line Heights: `lineHeights`
- Shadows: `boxShadow`
- Dimensions: `dimension`
- Sizing: `sizing`
- Numbers: `number`
- Strings: `string`

## File Organization

- `tokens/system/primitives/**` - Source primitives
- `tokens/system/semanticTokens/**` - Source semantic tokens
- `tokens/system/componentTokens/shared/**` - Shared component props
- `tokens/system/componentTokens/components/**` - Component-specific tokens
- `tokens/output/*.json` - Merged output

**Build:** `npm run build:tokens` (merge) -> `npm run build:css-variables` (generates `styles/tokens.css`).

## CSS Variable Generation

- CSS var names: full path with segments joined by `-` and normalized to kebab-case
- Example: `upload.file-item.background.error` -> `--token-component-upload-file-item-background-error`
- Run `scripts/diagnose-missing-component-vars.mjs` after builds to verify

## Themes

- **Reservio** - Baseline theme
- **Survio** - Extended theme
- Both use the same token structure, brand-specific values handled at primitive level
