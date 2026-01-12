#!/usr/bin/env node

/**
 * Generate comprehensive token documentation
 * Updates docs/TOKENS.md with current token structure
 */

const fs = require('fs');
const path = require('path');

const tokensDir = path.join(__dirname, 'tokens');
const docsDir = path.join(__dirname, 'docs');

// Read token files
const primitives = JSON.parse(fs.readFileSync(path.join(tokensDir, 'primitives.json'), 'utf8'));
const semantic = JSON.parse(fs.readFileSync(path.join(tokensDir, 'semanticTokens.json'), 'utf8'));
const components = JSON.parse(fs.readFileSync(path.join(tokensDir, 'componentTokens.json'), 'utf8'));

// Extract icon token structure
const iconSizes = components.icon ? Object.keys(components.icon).map(comp => ({
  component: comp,
  sizes: Object.keys(components.icon[comp])
})) : [];

const iconGaps = [];
const iconColors = [];
const iconPadding = [];

function findIconTokens(obj, path = '') {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const currentPath = path ? `${path}.${key}` : key;
    
    if (key === 'gap' && value?.icon) {
      iconGaps.push(currentPath + '.icon');
    }
    
    if (key === 'icon' && value && typeof value === 'object') {
      if (value.$type === 'color' || (value.default && value.default.$type === 'color')) {
        iconColors.push(currentPath);
      }
      if (value.only && value.only.padding) {
        iconPadding.push(currentPath + '.only.padding');
      }
    }
    
    if (value && typeof value === 'object' && !value.$type) {
      findIconTokens(value, currentPath);
    }
  }
}

findIconTokens(components);

// Generate documentation
const doc = `# Design Tokens Documentation

> **Source**: This documentation is auto-generated from the token files in \`/tokens/\`  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}  
> **Link to Figma**: [Figma Tokens Studio](https://www.figma.com/)  
> **Link to Storybook**: Run \`npm run storybook\` to view interactive documentation

---

## Table of Contents

- [Primitives](#primitives)
  - [Colors](#colors)
  - [Feature Colors](#feature-colors)
  - [Spacing](#spacing)
  - [Border Width](#border-width)
  - [Border Radius](#border-radius)
  - [Icon Size](#icon-size)
  - [Sizing](#sizing)
  - [Typography](#typography)
  - [Shadows](#shadows)
  - [Opacity](#opacity)
  - [Z-Index](#z-index)
  - [Animation](#animation)
  - [Universal](#universal)
- [Semantic Tokens](#semantic-tokens)
  - [Content Colors](#content-colors)
  - [Background Colors](#background-colors)
  - [Border Tokens](#border-tokens)
  - [Typography](#typography-semantic)
  - [Spacing Tokens](#spacing-tokens)
  - [Other Semantic Tokens](#other-semantic-tokens)
- [Component Tokens](#component-tokens)
  - [Icon Tokens](#icon-tokens)
  - [Button](#button)
  - [Field](#field)
  - [Other Components](#other-components)

---

## Primitives

Primitives are the foundational design tokens that contain raw values. All other tokens reference these primitives.

**File**: \`tokens/primitives.json\`  
**Collection Name**: \`primitives\`

### Colors

Color families are organized by color name and scale value (100-800, with 000 for white).

#### Color Families

| Family | Scales | Description |
|--------|--------|-------------|
| \`yellow\` | 100-800 | Yellow color palette |
| \`grey\` | 000, 100-800 | Grey color palette (000 = white) |
| \`brand\` | 100-800 | Brand primary color palette |
| \`upgrade\` | 100-800 | Upgrade/premium color palette |
| \`negative\` | 100-800 | Error/danger color palette |
| \`success\` | 100-800 | Success color palette |
| \`warning\` | 100-800 | Warning color palette |
| \`aqua\` | 100-800 | Aqua color palette |
| \`purple\` | 100-800 | Purple color palette |
| \`brown\` | 100-800 | Brown color palette |

**Usage Example:**
\`\`\`json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{brand.500}"
}
\`\`\`

### Feature Colors

Feature-specific color palettes for product features.

**Structure:**
- \`passes.credits.{strong, subtle}\`
- \`passes.punch-cards.{strong, subtle}\`
- \`passes.memberships.{strong, subtle}\`
- \`ai-features.{strong, subtle}\`

### Spacing

Spacing scale from 4px to 120px in 4px increments.

**Tokens**: \`spacing-1\` through \`spacing-30\`

### Border Width

Border width values from 0px to 4px.

**Tokens**: \`border-width-0\` through \`border-width-3\`

### Border Radius

Border radius values from 0px to 24px, plus round (999px).

**Tokens**: \`radius-0\` through \`radius-6\`, \`radius-round\`

### Icon Size

Icon size scale from 16px to 64px.

**Structure**: \`icon-size.icon-size-1\` through \`icon-size.icon-size-8\`

### Sizing

Size scale for controls from 16px to 56px.

**Tokens**: \`size-1\` through \`size-6\`

### Typography

Typography tokens include font sizes, line heights, font weights, and font family.

**Font Sizes**: \`typography-fontSize-1\` through \`typography-fontSize-9\` (12px to 48px in rem)  
**Line Heights**: \`typography-lineHeight-*\`  
**Font Weights**: \`typography-fontWeight-regular\`, \`medium\`, \`bold\`  
**Font Family**: \`typography-fontFamily-base\` (Venn)

### Shadows

Box shadow values for elevation.

**Tokens**: \`shadow-xs\`, \`shadow-sm\`, \`shadow-md\`, \`shadow-lg\`, \`shadow-xl\`, \`shadow-2xl\`, \`shadow-inner\`

### Opacity

Opacity values from 0% to 100%.

**Tokens**: \`opacity-0\` through \`opacity-100\`

### Z-Index

Z-index layering values for stacking context.

**Structure**: \`z-index.z-base\`, \`z-index.z-dropdown\`, \`z-index.z-sticky\`, \`z-index.z-fixed\`, \`z-index.z-modal-backdrop\`, \`z-index.z-modal\`, \`z-index.z-popover\`, \`z-index.z-tooltip\`

### Animation

Animation duration and easing values.

**Duration**: \`duration-fast\` (100ms), \`duration-base\` (200ms)  
**Easing**: \`easing-ease-out\`, \`easing-ease-in-out\`

### Universal

Universal utility tokens.

**Tokens**: \`universal.transparent\` - Transparent color value

---

## Semantic Tokens

Semantic tokens reference primitives and provide meaning-based naming following the \`[property]-[participation]-[intent]\` structure.

**File**: \`tokens/semanticTokens.json\`  
**Collection Name**: \`semanticTokens\`

### Content Colors

Text/content colors organized by participation (passive/active) and intent.

**Pattern**: \`content-{participation}-{intent}-{state}\`

**Examples:**
- \`content-passive-neutral-default\`
- \`content-active-accent-hover\`
- \`content-passive-on-accent\`

### Background Colors

Background colors organized by participation and intent.

**Pattern**: \`background-{participation}-{intent}-{state}\`

**Examples:**
- \`background-passive-neutral-default\`
- \`background-active-accent-hover\`
- \`background-passive-danger-subtle\`

### Border Tokens

Border colors and widths organized by participation, intent, and control type.

**Structure:**
- \`border.active.accent.{default, hover, pressed, disabled, selected}\`
- \`border.active.neutral.action.{default, hover, pressed, disabled}\`
- \`border.active.neutral.control.field.{default, hover, focused, selected, disabled}\`
- \`border.active.neutral.control.toggle.{default, hover, disabled}\`
- \`border.active.danger.default\`
- \`border.passive.neutral.default\`
- \`border-width-thin\`, \`border-width-thicker\`, \`border-width-thick\`

### Typography

Typography tokens for headlines and body text.

**Headlines:**
- \`typography.headline-size.{h1-h6}\`
- \`typography.headline-line.{h1-h6}\`

**Body:**
- \`typography.body-size.{xs, sm, md, lg}\`
- \`typography.body-line.{xs, sm, md, lg}\`
- \`typography.body-weight.{light, normal, md, semibold, bold}\`

### Spacing Tokens

Spacing tokens organized by purpose.

**Border Radius**: \`radius.{none, xs, sm, md, lg, xl, xxl, full}\`  
**Icon Size**: \`icon.{xxs, xs, sm, md, lg, xl, xxl, huge}\`  
**Gap**: \`gap.{xxs, xs, s, m, l, xl, xxl}\`  
**Padding**: \`padding.{xxxs, xxs, xs, s, m, l, xl, xxl, xxxl, xxxxl}\`  
**Control Height**: \`control.height.{xxxs, xxs, xs, sm, md, lg}\`

### Other Semantic Tokens

**Shadows**: \`shadow.{xs, sm, md, lg, xl, 2xl, inner}\`  
**Z-Index**: \`z-index.{base, dropdown, sticky, fixed, modal-backdrop, modal, popover, tooltip}\`  
**Opacity**: \`opacity.overlay\` (75%)  
**Animation**: 
- \`animation.duration.{fast, base}\`
- \`animation.easing.{ease-out, ease-in-out}\`
**Sizing**: \`sizing.tooltip-arrow\`

### Custom Tokens

**Notes**: \`custom-notes-content-filled\`, \`custom-notes-content-placeholder\`, \`custom-notes-background\`  
**Rating**: \`custom-rating\`

---

## Component Tokens

Component-specific tokens that reference semantic tokens. All component tokens use nested structures organized by component, variant, property, and state/size.

**File**: \`tokens/componentTokens.json\`  
**Collection Name**: \`componentTokens\` (for references)

### Icon Tokens

Icon tokens follow a consistent structure across all components:

#### Icon Sizes (Top-Level)

Icon size tokens are grouped at the root level under \`icon.{component}.{size}\`:

${iconSizes.map(({ component, sizes }) => `- \`icon.${component}.{${sizes.join(', ')}}\` - ${component.charAt(0).toUpperCase() + component.slice(1)} icon sizes`).join('\n')}

**Usage:**
\`\`\`json
{
  "$type": "dimension",
  "$collectionName": "semanticTokens",
  "$value": "{icon.button.sm}"
}
\`\`\`

#### Icon Gaps (Component-Level)

Icon gap tokens are component-specific under \`{component}.gap.icon\`:

${iconGaps.map(gap => `- \`${gap}\` - Icon gap spacing`).join('\n')}

**Usage:**
\`\`\`json
{
  "$type": "spacing",
  "$collectionName": "semanticTokens",
  "$value": "{gap.xs}"
}
\`\`\`

#### Icon Colors (Component-Level)

Icon color tokens are component-specific under \`{component}.icon\` or \`{component}.{variant}.icon\`:

${iconColors.map(color => `- \`${color}\` - Icon color`).join('\n')}

**Usage:**
\`\`\`json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{content-passive-info}"
}
\`\`\`

#### Icon Padding (Component-Level)

Icon padding tokens are component-specific under \`{component}.icon.only.padding\`:

${iconPadding.map(padding => `- \`${padding}\` - Icon-only button padding`).join('\n')}

**Usage:**
\`\`\`json
{
  "$type": "spacing",
  "$collectionName": "semanticTokens",
  "$value": "{padding.xxxs}"
}
\`\`\`

### Button

Button tokens organized by variant, style, property, and state.

**Structure**: \`button.{variant}.{style}.{property}.{state}\`

**Variants**: \`primary\`, \`secondary\`, \`danger\`, \`outline\`, \`ghost\`, \`link\`  
**Styles**: \`boxed\`, \`icon-only\`  
**Properties**: \`background\`, \`content\`, \`border\`, \`radius\`, \`padding\`, \`gap\`, \`fontSize\`, \`lineHeight\`

### Field

Form field tokens organized by property and size.

**Structure**: \`field.{property}.{size}\`

**Properties**: \`height\`, \`fontSize\`, \`lineHeight\`, \`padding\`, \`radius\`, \`borderWidth\`, \`status\`

### Other Components

Additional component tokens include:
- \`toggle.*\` - Toggle component tokens
- \`checkbox.*\` - Checkbox tokens
- \`radio.button.*\` - Radio button tokens
- \`chip.*\` - Chip component tokens
- \`alert.*\` - Alert component tokens
- \`toast.*\` - Toast notification tokens
- \`card.*\` - Card component tokens
- \`popover.*\` - Popover tokens
- \`tooltip.*\` - Tooltip tokens
- \`modal.*\` - Modal tokens
- \`drawer.*\` - Drawer tokens
- And more...

---

## Icon Token Structure Summary

For consistency, icon tokens follow these patterns:

1. **Icon Sizes** (dimension type): Top-level \`icon.{component}.{size}\`
2. **Icon Gaps** (spacing type): Component-level \`{component}.gap.icon\`
3. **Icon Colors** (color type): Component-level \`{component}.icon\` or \`{component}.{variant}.icon\`
4. **Icon Padding** (spacing type): Component-level \`{component}.icon.only.padding\`

This structure ensures:
- Icon sizes are easily discoverable at the root level
- Component-specific icon properties remain with their components
- Consistent patterns across all components
- Proper categorization in Tokens Studio

---

## Naming Conventions

### Size Abbreviations

- \`xs\` - Extra small
- \`sm\` - Small
- \`md\` - Medium
- \`lg\` - Large
- \`xl\` - Extra large
- \`xxl\` - Extra extra large

### Token Naming

- Token names use **kebab-case** (W3C DTCG compliance)
- Typography properties use **camelCase** (W3C DTCG standard)
- Example: \`content-passive-neutral-default\`, \`typography-fontSize-1\`

---

## Token Architecture

### Layering

1. **Primitives** → Raw values (colors, sizes, spacing, etc.)
2. **Semantic Tokens** → Primitives paired with semantic meaning
3. **Component Tokens** → Semantic tokens applied to specific components

### Best Practices

- **Always reference semantic tokens** from component tokens (except \`universal.transparent\`)
- **Use nested structures** for proper categorization in Tokens Studio
- **Follow naming conventions** (kebab-case for tokens, camelCase for typography properties)
- **Use standardized size abbreviations** (xs, sm, md, lg, xl, xxl)
- **Group related tokens** (e.g., all icon sizes under \`icon.*\`)
- **Keep icon token structure consistent** across all components

---

*Documentation generated on ${new Date().toISOString()}*
`;

// Write documentation
fs.writeFileSync(path.join(docsDir, 'TOKENS.md'), doc);
console.log('✅ Documentation generated: docs/TOKENS.md');
