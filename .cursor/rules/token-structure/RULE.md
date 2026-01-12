---
description: "Design token structure, naming conventions, and architecture guidelines for Figma Tokens Studio"
alwaysApply: true
globs:
  - "tokens/**/*.json"
  - "docs/**/*.md"
---

# Design Token Structure and Naming Conventions

This rule defines the structure, naming conventions, and best practices for design tokens in this repository.

## Token Architecture

Design tokens follow a three-layer architecture:

1. **Primitives** (`tokens/primitives.json`) - Raw values (colors, sizes, spacing, etc.)
2. **Semantic Tokens** (`tokens/semanticTokens.json`) - Primitives paired with semantic meaning
3. **Component Tokens** (`tokens/componentTokens.json`) - Semantic tokens applied to specific components

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

Standardize to these abbreviations:
- `xs` - Extra small
- `sm` - Small
- `md` - Medium
- `lg` - Large
- `xl` - Extra large
- `xxl` - Extra extra large

### Semantic Token Pattern

Semantic tokens follow: `[property]-[participation]-[intent]-[state]`

- **Property**: `content`, `background`, `border`
- **Participation**: `passive`, `active`
- **Intent**: `neutral`, `accent`, `danger`, `success`, `warning`, `info`, `upgrade`
- **State**: `default`, `hover`, `pressed`, `disabled`, `selected`, etc.

Example: `content-active-accent-hover`

## Primitives Structure

### Flattened Categories

All primitive categories are **flattened** (no category wrappers) to allow Tokens Studio to auto-categorize based on `$type`:

- Colors: `yellow.100`, `grey.000`, `brand.500` (not `colors.yellow.100`)
- Spacing: `spacing-1`, `spacing-2` (not `spacing.1`)
- Border Radius: `radius-0`, `radius-1` (not `border-radius.radius-0`)
- Border Width: `border-width-0`, `border-width-1` (not `border-width.border-0`)
- Shadows: `shadow-xs`, `shadow-sm` (not `box-shadow.shadow-xs`)
- Animation: `duration-fast`, `easing-ease-out` (not `animation.duration.fast`)
- Sizing: `size-1`, `size-2` (not `sizing.size-1`)

### Color Families

Color families are top-level objects:
- `yellow.{100-800}`
- `grey.{000, 100-800}`
- `brand.{100-800}`
- `upgrade.{100-800}`
- `negative.{100-800}`
- `success.{100-800}`
- `warning.{100-800}`
- `aqua.{100-800}`
- `purple.{100-800}`
- `brown.{100-800}`

### Feature Colors

Feature colors are organized by feature:
- `passes.credits.{strong, subtle}`
- `passes.punch-cards.{strong, subtle}`
- `passes.memberships.{strong, subtle}`
- `ai-features.{strong, subtle}`

## Semantic Tokens Structure

### Nested Categories

Semantic tokens use **nested structures** for proper categorization in Tokens Studio:

- `radius.{none, xs, sm, md, lg, xl, xxl, full}`
- `icon.{xxs, xs, sm, md, lg, xl, xxl, huge}`
- `gap.{xxs, xs, s, m, l, xl, xxl}`
- `padding.{xxxs, xxs, xs, s, m, l, xl, xxl, xxxl, xxxxl}`
- `control.height.{xxxs, xxs, xs, sm, md, lg}`
- `typography.headline-size.{h1-h6}`
- `typography.body-size.{xs, sm, md, lg}`
- `z-index.{base, dropdown, sticky, fixed, modal-backdrop, modal, popover, tooltip}`
- `opacity.overlay`
- `animation.duration.{fast, base}`
- `animation.easing.{ease-out, ease-in-out}`
- `sizing.tooltip-arrow`

### Color Tokens

Color tokens use flat structure (no nesting):
- `content-passive-neutral-default`
- `background-active-accent-hover`
- `border-active-neutral-control-field-focused`

### Border Tokens

Border tokens use nested structure:
- `border.active.accent.{default, hover, pressed, disabled, selected}`
- `border.active.neutral.action.{default, hover, pressed, disabled}`
- `border.active.neutral.control.field.{default, hover, focused, selected, disabled}`
- `border.active.neutral.control.toggle.{default, hover, disabled}`
- `border.active.danger.default`
- `border.passive.neutral.default`

## Component Tokens Structure

### Nested Component Structure

Component tokens use nested structures: `{component}.{variant}.{property}.{state}`

Example:
```json
{
  "button": {
    "primary": {
      "boxed": {
        "background": {
          "default": {
            "$type": "color",
            "$collectionName": "semanticTokens",
            "$value": "{background-active-accent-default}"
          }
        }
      }
    }
  }
}
```

### Icon Token Structure

Icon tokens follow a **consistent structure** across all components:

1. **Icon Sizes** (dimension type) - Top-level:
   - `icon.button.{sm, md, lg}`
   - `icon.field.{sm, lg}`
   - `icon.checkbox.default`
   - `icon.chip.{sm, md, lg}`

2. **Icon Gaps** (spacing type) - Component-level:
   - `button.gap.icon.{sm, md, lg}`
   - `chip.gap.icon.{sm, md, lg}`
   - `alert.gap.icon`
   - `toast.gap.icon`

3. **Icon Colors** (color type) - Component-level:
   - `alert.icon.default`
   - `alert.danger.icon.default`
   - `toast.icon.default`
   - `toast.danger.icon.default`

4. **Icon Padding** (spacing type) - Component-level:
   - `button.icon.only.padding.{x, y}.{sm, md, lg}`

**Rule**: Icon sizes are grouped at root level for discoverability, while gaps, colors, and padding remain component-specific.

## Token Properties

### Required Properties

All tokens must include:
- `$type` - Token type (color, dimension, spacing, etc.)
- `$collectionName` - Source collection ("primitives" or "semanticTokens")
- `$value` - Token value or reference
- `$description` - Clear description of token purpose

### Optional Properties

- `$scopes` - Figma scopes (e.g., ["ALL_SCOPES"])
- `$libraryName` - Library name (usually empty string)
- `$hiddenFromPublishing` - Hide from publishing (primitives only)

## $type Values

Use correct `$type` values for proper categorization:

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

## References

### Reference Syntax

Use `{token.path}` syntax for references:

```json
{
  "$value": "{yellow.100}"
}
```

### Collection Names

- References to primitives: `"$collectionName": "primitives"`
- References to semantic tokens: `"$collectionName": "semanticTokens"`
- Direct values (no reference): `"$collectionName": ""`

## Opacity Values

- Primitives: Decimal values (0-1), e.g., `0.75`
- Semantic tokens: Percentage values (0-100) for Figma compatibility, e.g., `75`

## Themes

Themes are managed via `$themes.json`:
- **Reservio** - Baseline theme
- **Survio** - Extended theme

Both themes use the same token structure, with brand-specific values handled at the primitive level.

## File Organization

- `tokens/$metadata.json` - Token set order
- `tokens/$themes.json` - Theme configuration
- `tokens/primitives.json` - Base tokens
- `tokens/semanticTokens.json` - Semantic tokens
- `tokens/componentTokens.json` - Component tokens

## Best Practices

1. **Always reference semantic tokens** from component tokens
2. **Use nested structures** for semantic and component tokens
3. **Flatten primitive categories** to prevent duplication
4. **Follow naming conventions** consistently
5. **Use standardized size abbreviations**
6. **Keep icon token structure consistent** across all components
7. **Provide clear descriptions** for all tokens
8. **Use correct `$type` values** for proper categorization
9. **Test references** to ensure they resolve correctly
10. **Document changes** in commit messages
11. **Delete helper scripts** after implementation (see Script Management Rules)

## Common Mistakes to Avoid

- ❌ Referencing primitives directly from component tokens
- ❌ Using category wrappers in primitives (causes duplication)
- ❌ Inconsistent size naming (e.g., `small` vs `sm`)
- ❌ Mixing flat and nested structures in the same category
- ❌ Incorrect `$type` values
- ❌ Missing `$description` fields
- ❌ Breaking icon token structure consistency
