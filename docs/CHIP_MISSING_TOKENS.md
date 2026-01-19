# Missing Tokens for Chip Component

This document lists tokens that are referenced in the Chip component but may need to be created or verified in the token system.

## Status: ✅ All Required Tokens Exist

After comprehensive review, all tokens referenced in the Chip component are properly defined:

### ✅ Verified Tokens

1. **Size Tokens** - All sizes (sm, md, lg) are defined:
   - `--token-component-height-chip-{sm|md|lg}`
   - `--token-component-padding-x-chip-{sm|md|lg}`
   - `--token-component-font-size-chip-{sm|md|lg}`
   - `--token-component-line-height-chip-{sm|md|lg}`
   - `--token-component-icon-chip-{sm|md|lg}`

2. **Color Variant Tokens** - All variants are defined:
   - Default (unselected): `--token-component-chip-background-unselected-{default|hover|pressed|disabled}`
   - Primary (selected): `--token-component-chip-background-selected-{default|hover|pressed|disabled}`
   - Subtle: `--token-component-chip-subtle-background-{default|hover|pressed|disabled}`
   - Content tokens for all variants
   - Border tokens for outlined variants

3. **Delete Icon Tokens** - All states are defined:
   - `--token-component-chip-delete-icon-opacity-{default|hover|disabled}`
   - `--token-component-chip-delete-icon-background-hover-{default|colored}`
   - `--token-component-chip-delete-icon-background-active-{default|colored}`
   - `--token-component-chip-delete-icon-padding`

4. **Semantic Tokens** - All referenced semantic tokens exist:
   - `--token-semantic-background-active-{danger|success|warning|upgrade}-{hover|pressed}` (info uses upgrade tokens)
   - `--token-semantic-background-passive-{danger|info|success|warning}-subtle`
   - `--token-semantic-border-active-neutral-control-field-focused`

### ⚠️ Note on Delete Icon Background Tokens

The delete icon hover/active background tokens reference `background.active.neutral.subtle.{hover|pressed}` which are designed to be used with rgba/color-mix for opacity overlays. These tokens provide the base color (grey.700) and the opacity values (5% for hover, 8% for pressed) are applied via CSS.

For colored chips (primary, error, info, success, warning, subtle), the delete icon uses white overlays with higher opacity (20% hover, 30% active) which are also handled via the token system.

### Implementation Notes

- All hardcoded values have been removed from the CSS
- All color values use tokens
- All spacing values use tokens
- All opacity values use tokens
- Border radius uses tokens
- Border width uses tokens

The Chip component is now fully tokenized and matches the Figma design specification.
