# Design Tokens Documentation

> **Source**: This documentation is auto-generated from the token files in `/tokens/`  
> **Last Updated**: Generated from current token structure  
> **Link to Figma**: [Figma Tokens Studio](https://www.figma.com/)  
> **Link to Storybook**: [Storybook Design Tokens](https://storybook.js.org/)

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
  - [Button](#button)
  - [Field](#field)
  - [Icon](#icon)
  - [Other Components](#other-components)

---

## Primitives

Primitives are the foundational design tokens that contain raw values. All other tokens reference these primitives.

**File**: `tokens/primitives.json`  
**Collection Name**: `primitives`

### Colors

Color families are organized by color name and scale value (100-800, with 000 for white).

#### Color Families

| Family | Scales | Description |
|--------|--------|-------------|
| `yellow` | 100-800 | Yellow color palette |
| `grey` | 000, 100-800 | Grey color palette (000 = white) |
| `brand` | 100-800 | Brand primary color palette |
| `upgrade` | 100-800 | Upgrade/premium color palette |
| `negative` | 100-800 | Error/danger color palette |
| `success` | 100-800 | Success color palette |
| `warning` | 100-800 | Warning color palette |
| `aqua` | 100-800 | Aqua color palette |
| `purple` | 100-800 | Purple color palette |
| `brown` | 100-800 | Brown color palette |

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{brand.500}"
}
```

**Available Tokens:**
- `yellow.100` through `yellow.800`
- `grey.000`, `grey.100` through `grey.800`
- `brand.100` through `brand.800`
- `upgrade.100` through `upgrade.800`
- `negative.100` through `negative.800`
- `success.100` through `success.800`
- `warning.100` through `warning.800`
- `aqua.100` through `aqua.800`
- `purple.100` through `purple.800`
- `brown.100` through `brown.800`

### Feature Colors

Feature-specific color palettes for product features.

**Structure:**
- `passes.credits.{strong, subtle}`
- `passes.punch cards.{strong, subtle}`
- `passes.memberships.{strong, subtle}`
- `ai-features.{strong, subtle}`

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{passes.credits.strong}"
}
```

### Spacing

Spacing scale tokens for consistent spacing throughout the design system.

**Available Tokens:**
- `spacing-0-5` (2px)
- `spacing-1` (4px)
- `spacing-1-5` (6px)
- `spacing-2` (8px)
- `spacing-2-5` (10px)
- `spacing-3` (12px)
- `spacing-4` (16px)
- `spacing-5` (20px)
- `spacing-6` (24px)
- `spacing-7` (28px)
- `spacing-8` (32px)
- `spacing-9` (36px)
- `spacing-10` (40px)
- `spacing-12` (48px)
- `spacing-14` (56px)
- `spacing-16` (64px)
- `spacing-18` (72px)
- `spacing-20` (80px)
- `spacing-22` (88px)
- `spacing-24` (96px)
- `spacing-26` (104px)
- `spacing-28` (112px)
- `spacing-30` (120px)

**Usage Example:**
```json
{
  "$type": "spacing",
  "$collectionName": "primitives",
  "$value": "{spacing-4}"
}
```

### Border Width

Border width values for consistent border styling.

**Available Tokens:**
- `border-width-0` (0px)
- `border-width-1` (1px)
- `border-width-2` (2px)
- `border-width-3` (4px)

**Usage Example:**
```json
{
  "$type": "borderWidth",
  "$collectionName": "primitives",
  "$value": "{border-width-1}"
}
```

### Border Radius

Border radius values for rounded corners.

**Available Tokens:**
- `radius-0` (0px)
- `radius-1` (4px)
- `radius-2` (8px)
- `radius-3` (12px)
- `radius-4` (16px)
- `radius-5` (20px)
- `radius-6` (24px)
- `radius-round` (999px)

**Usage Example:**
```json
{
  "$type": "borderRadius",
  "$collectionName": "primitives",
  "$value": "{radius-2}"
}
```

### Icon Size

Icon size scale for consistent icon sizing.

**Available Tokens:**
- `icon-size.icon-size-1` (16px)
- `icon-size.icon-size-2` (20px)
- `icon-size.icon-size-3` (24px)
- `icon-size.icon-size-4` (32px)
- `icon-size.icon-size-5` (40px)
- `icon-size.icon-size-6` (48px)
- `icon-size.icon-size-7` (56px)
- `icon-size.icon-size-8` (64px)

**Usage Example:**
```json
{
  "$type": "dimension",
  "$collectionName": "primitives",
  "$value": "{icon-size.icon-size-3}"
}
```

### Sizing

Size scale for controls and components.

**Available Tokens:**
- `size-1` (16px)
- `size-2` (24px)
- `size-3` (32px)
- `size-4` (40px)
- `size-5` (48px)
- `size-6` (56px)

**Usage Example:**
```json
{
  "$type": "sizing",
  "$collectionName": "primitives",
  "$value": "{size-4}"
}
```

### Typography

Typography tokens include font sizes, line heights, font weights, and font family.

#### Font Sizes

**Available Tokens:**
- `typography-fontSize-1` (0.75rem / 12px)
- `typography-fontSize-2` (0.875rem / 14px)
- `typography-fontSize-3` (1rem / 16px)
- `typography-fontSize-4` (1.125rem / 18px)
- `typography-fontSize-5` (1.25rem / 20px)
- `typography-fontSize-6` (1.5rem / 24px)
- `typography-fontSize-7` (1.75rem / 28px)
- `typography-fontSize-8` (2rem / 32px)
- `typography-fontSize-9` (2.5rem / 40px)

#### Line Heights

**Available Tokens:**
- `typography-lineHeight-12` (1.25rem)
- `typography-lineHeight-14` (1.25rem)
- `typography-lineHeight-16` (1.5rem)
- `typography-lineHeight-18` (1.5rem)
- `typography-lineHeight-20` (1.75rem)
- `typography-lineHeight-24` (2rem)
- `typography-lineHeight-28` (2.25rem)
- `typography-lineHeight-32` (2.5rem)
- `typography-lineHeight-40` (3rem)
- `typography-lineHeight-tight` (1.1)
- `typography-lineHeight-base` (1.3)
- `typography-lineHeight-relaxed` (1.5)
- `typography-lineHeight-loose` (1.7)
- `typography-lineHeight-20-large` (2rem)

#### Font Weights

**Available Tokens:**
- `typography-fontWeight-regular` (400)
- `typography-fontWeight-medium` (500)
- `typography-fontWeight-bold` (700)

#### Font Family

**Available Tokens:**
- `typography-fontFamily-sans` ("Venn, sans-serif")

#### Typography Composites

Pre-composed typography tokens for common text styles:

- `typography-composite.typography-h1` through `typography-composite.typography-h6`
- `typography-composite.typography-body`
- `typography-composite.typography-body-large`
- `typography-composite.typography-body-default`
- `typography-composite.typography-body-small`
- `typography-composite.typography-body-xsmall`
- `typography-composite.typography-button`
- `typography-composite.typography-button-large`

**Usage Example:**
```json
{
  "$type": "fontSizes",
  "$collectionName": "primitives",
  "$value": "{typography-fontSize-3}"
}
```

### Shadows

Box shadow values for elevation and depth.

**Available Tokens:**
- `shadow-xs` - Extra small shadow
- `shadow-sm` - Small shadow
- `shadow-md` - Medium shadow
- `shadow-lg` - Large shadow
- `shadow-xl` - Extra large shadow
- `shadow-2xl` - Extra extra large shadow
- `shadow-inner` - Inner shadow
- `shadow-1-down` through `shadow-5-down` - Downward shadows
- `shadow-1-up` through `shadow-5-up` - Upward shadows

**Usage Example:**
```json
{
  "$type": "boxShadow",
  "$collectionName": "primitives",
  "$value": "{shadow-md}"
}
```

### Opacity

Opacity values from 0% to 100%.

**Available Tokens:**
- `opacity-0` (0%)
- `opacity-5` (5%)
- `opacity-10` (10%)
- `opacity-20` (20%)
- `opacity-25` (25%)
- `opacity-30` (30%)
- `opacity-40` (40%)
- `opacity-50` (50%)
- `opacity-60` (60%)
- `opacity-70` (70%)
- `opacity-75` (75%)
- `opacity-80` (80%)
- `opacity-90` (90%)
- `opacity-95` (95%)
- `opacity-100` (100%)

**Usage Example:**
```json
{
  "$type": "opacity",
  "$collectionName": "primitives",
  "$value": "{opacity-75}"
}
```

### Z-Index

Z-index layering values for proper stacking context.

**Available Tokens:**
- `z-index.z-base` (0)
- `z-index.z-dropdown` (1000)
- `z-index.z-sticky` (1020)
- `z-index.z-fixed` (1030)
- `z-index.z-modal-backdrop` (1040)
- `z-index.z-modal` (1050)
- `z-index.z-popover` (1060)
- `z-index.z-tooltip` (1070)

**Usage Example:**
```json
{
  "$type": "number",
  "$collectionName": "primitives",
  "$value": "{z-index.z-modal}"
}
```

### Animation

Animation duration and easing values.

#### Duration

**Available Tokens:**
- `duration-instant` (0ms)
- `duration-fast` (100ms)
- `duration-base` (200ms)
- `animation-duration-slow` (300ms)
- `animation-duration-slower` (500ms)
- `animation-duration-slowest` (700ms)

#### Easing

**Available Tokens:**
- `animation-easing-linear` ("linear")
- `animation-easing-ease-in` ("cubic-bezier(0.4, 0, 1, 1)")
- `easing-ease-out` ("cubic-bezier(0, 0, 0.2, 1)")
- `easing-ease-in-out` ("cubic-bezier(0.4, 0, 0.2, 1)")

**Usage Example:**
```json
{
  "$type": "number",
  "$collectionName": "primitives",
  "$value": "{duration-fast}"
}
```

### Universal

Universal tokens for common values.

**Available Tokens:**
- `universal.transparent` - Transparent color (rgba(255, 255, 255, 0))

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{universal.transparent}"
}
```

---

## Semantic Tokens

Semantic tokens provide meaning-based naming and reference primitives. They follow the `[property]-[participation]-[intent]` structure.

**File**: `tokens/semanticTokens.json`  
**Collection Name**: `semanticTokens`

### Content Colors

Text and content colors organized by participation (passive/active) and intent (neutral/accent/danger/success/warning/info/upgrade).

#### Passive Content Colors

**Structure**: `content-passive-{intent}-{variant}`

**Available Tokens:**
- `content-passive-neutral-strong`
- `content-passive-neutral-default`
- `content-passive-neutral-subtle`
- `content-passive-neutral-muted`
- `content-passive-on-neutral-strong`
- `content-passive-on-neutral-default`
- `content-passive-on-neutral-subtle`
- `content-passive-on-accent`
- `content-passive-on-accent-inverse`
- `content-passive-on-success`
- `content-passive-on-danger`
- `content-passive-on-warning`
- `content-passive-on-info`
- `content-passive-on-upgrade`
- `content-passive-info`
- `content-passive-upgrade`
- `content-passive-success`
- `content-passive-danger`
- `content-passive-warning`

#### Active Content Colors

**Structure**: `content-active-{intent}-{state}`

**Available Tokens:**
- `content-active-neutral-default`
- `content-active-neutral-hover`
- `content-active-neutral-pressed`
- `content-active-neutral-disabled`
- `content-active-accent-default`
- `content-active-accent-hover`
- `content-active-accent-pressed`
- `content-active-accent-disabled`
- `content-active-accent-inverse-default`
- `content-active-accent-inverse-hover`
- `content-active-accent-inverse-pressed`
- `content-active-accent-inverse-disabled`
- `content-active-upgrade-default`
- `content-active-upgrade-hover`
- `content-active-upgrade-pressed`
- `content-active-danger-default`
- `content-active-danger-hover`
- `content-active-danger-pressed`

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{content-passive-neutral-default}"
}
```

### Background Colors

Background colors organized by participation and intent.

#### Passive Background Colors

**Structure**: `background-passive-{intent}-{variant}`

**Available Tokens:**
- `background-passive-neutral-default`
- `background-passive-neutral-subtle`
- `background-passive-neutral-elevated`
- `background-passive-neutral-strong`
- `background-passive-danger-default`
- `background-passive-danger-subtle`
- `background-passive-success-default`
- `background-passive-success-subtle`
- `background-passive-warning-default`
- `background-passive-warning-subtle`
- `background-passive-info-default`
- `background-passive-info-subtle`
- `background-passive-upgrade-default`
- `background-passive-upgrade-subtle`
- `background-passive-upgrade-strong`

#### Active Background Colors

**Structure**: `background-active-{intent}-{state}`

**Available Tokens:**
- `background-active-neutral-default`
- `background-active-neutral-hover`
- `background-active-neutral-pressed`
- `background-active-neutral-disabled`
- `background-active-accent-default`
- `background-active-accent-subtle`
- `background-active-accent-hover`
- `background-active-accent-selected`
- `background-active-accent-pressed`
- `background-active-accent-disabled`
- `background-active-accent-inverse-default`
- `background-active-accent-inverse-subtle`
- `background-active-accent-inverse-hover`
- `background-active-accent-inverse-pressed`
- `background-active-accent-inverse-disabled`
- `background-active-danger-default`
- `background-active-danger-subtle`
- `background-active-danger-hover`
- `background-active-danger-pressed`
- `background-active-success-default`
- `background-active-success-hover`
- `background-active-success-pressed`
- `background-active-success-disabled`
- `background-active-warning-default`
- `background-active-warning-hover`
- `background-active-warning-pressed`
- `background-active-upgrade-default`
- `background-active-upgrade-subtle`
- `background-active-upgrade-hover`
- `background-active-upgrade-pressed`

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{background-active-accent-default}"
}
```

### Border Tokens

Border color tokens organized by state and intent.

**Structure**: `border.{state}.{intent}.{context}.{variant}`

#### Active Border Colors

- `border.active.accent.{default, hover, pressed, disabled, selected}`
- `border.active.neutral.action.{default, hover, pressed, disabled}`
- `border.active.neutral.control.field.{default, hover, focused, selected, disabled}`
- `border.active.neutral.control.toggle.{default, hover, disabled}`
- `border.active.danger.default`

#### Passive Border Colors

- `border.passive.neutral.default`

#### Border Width

- `border-width-thin` (references `{border-width-1}`)
- `border-width-thicker` (references `{border-width-2}`)
- `border-width-thick` (references `{border-width-3}`)

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{border.active.accent.default}"
}
```

### Typography

Typography semantic tokens organized by type and size.

**Structure**: `typography.{type}-{property}.{size}`

#### Headline Sizes

- `typography.headline-size.{h1, h2, h3, h4, h5, h6}`

#### Headline Line Heights

- `typography.headline-line.{h1, h2, h3, h4, h5, h6}`

#### Body Sizes

- `typography.body-size.{xs, sm, md, lg}`

#### Body Line Heights

- `typography.body-line.{xs, sm, md, lg}`

#### Body Weights

- `typography.body-weight.{light, normal, md, semibold, bold}`

**Usage Example:**
```json
{
  "$type": "fontSizes",
  "$collectionName": "semanticTokens",
  "$value": "{typography.body-size.md}"
}
```

### Spacing Tokens

Semantic spacing tokens organized by category and size.

#### Radius

- `radius.{none, xs, sm, md, lg, xl, xxl, full}`

#### Icon Sizes

- `icon.{xxs, xs, sm, md, lg, xl, xxl, huge}`

#### Gap Spacing

- `gap.{xxs, xs, s, m, l, xl, xxl}`

#### Padding

- `padding.{xxxs, xxs, xs, s, m, l, xl, xxl, xxxl, xxxxl}`

#### Control Heights

- `control.height.{xxxs, xxs, xs, sm, md, lg}`

**Usage Example:**
```json
{
  "$type": "borderRadius",
  "$collectionName": "semanticTokens",
  "$value": "{radius.sm}"
}
```

### Other Semantic Tokens

#### Shadows

- `shadow.{xs, sm, md, lg, xl, 2xl, inner}`

#### Z-Index

- `z-index.{base, dropdown, sticky, fixed, modal-backdrop, modal, popover, tooltip}`

#### Opacity

- `opacity.overlay` (75%)

#### Animation

- `animation.duration.{fast, base}`
- `animation.easing.{ease-out, ease-in-out}`

#### Sizing

- `sizing.tooltip-arrow`

#### Custom Tokens

- `custom-notes-content-filled`
- `custom-notes-content-placeholder`
- `custom-notes-background`
- `custom-rating`

**Usage Example:**
```json
{
  "$type": "boxShadow",
  "$collectionName": "semanticTokens",
  "$value": "{shadow.md}"
}
```

---

## Component Tokens

Component tokens are specific to UI components and reference semantic tokens.

**File**: `tokens/componentTokens.json`  
**Collection Name**: `componentTokens` or `semanticTokens` (depending on reference)

### Button

Button component tokens organized by variant, style, property, and state.

**Structure**: `button.{variant}.{style}.{property}.{state}`

#### Variants

- `primary` - Primary button variant
- `secondary` - Secondary button variant
- `danger` - Danger/destructive button variant
- `tertiary` - Tertiary button variant
- `upgrade` - Upgrade/premium button variant

#### Styles

- `boxed` - Boxed button style
- `plain` - Plain button style

#### Properties

- `background.{default, hover, pressed, disabled}`
- `content.{default, hover, pressed, disabled}`
- `border.{default, hover, pressed, disabled}`
- `radius.{sm, md, lg}`
- `fontSize.{sm, md, lg}`
- `lineHeight.{sm, md, lg}`
- `padding.x.{sm, md, lg}`
- `padding.y.{sm, md, lg}`
- `gap.icon.{sm, md, lg}`
- `icon.only.padding.x.{sm, md, lg}`
- `icon.only.padding.y.{sm, md, lg}`
- `outline.padding.x.{sm, md, lg}`
- `outline.padding.y.{sm, md, lg}`
- `plain.padding.x.{sm, md, lg}`
- `plain.padding.y.{sm, md, lg}`

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{background-active-accent-default}"
}
```

### Field

Form field component tokens.

**Structure**: `field.{property}.{size|state}`

#### Properties

- `height.{sm, md, lg}`
- `fontSize.{sm, lg}`
- `lineHeight.value`
- `lineHeight.label`
- `padding.x.{sm, md, lg}`
- `padding.y.{sm, md, lg}`
- `padding.right.{sm, md, lg}`
- `radius.{sm, md, lg}`
- `status.enabled.{border, background, content}`
- `status.error.{border, background, content}`
- `status.disabled.{border, background, content}`
- `shadow.default`
- `control.border.{default, hover, focused, active}`
- `control.background.{default, hover, focused}`
- `content.value.default`
- `content.placeholder`
- `content.required`
- `width.default`
- `borderWidth.default`
- `gap.label`
- `gap.helper.text`
- `gap.leading.icon.{sm, md, lg}`
- `gap.leading.group.{sm, md, lg}`
- `gap.error.message`
- `gap.trailing.icon.{sm, md, lg}`
- `gap.trailing.group.{sm, md, lg}`
- `animation.duration`
- `animation.easing`
- `icon.{sm, lg}`

**Usage Example:**
```json
{
  "$type": "sizing",
  "$collectionName": "semanticTokens",
  "$value": "{control.height.sm}"
}
```

### Icon

Icon size tokens grouped by component.

**Structure**: `icon.{component}.{size}`

#### Components

- `icon.button.{sm, md, lg}`
- `icon.field.{sm, lg}`
- `icon.checkbox.default`
- `icon.chip.{sm, md, lg}`

**Usage Example:**
```json
{
  "$type": "dimension",
  "$collectionName": "semanticTokens",
  "$value": "{icon.button.sm}"
}
```

### Other Components

#### Toggle

- `toggle.radius.default`
- `toggle.gap.label`
- `toggle.background.off.{default, disabled}`
- `toggle.background.on.{default, disabled}`
- `toggle.content.off.{default, disabled}`
- `toggle.content.on.{default, disabled}`

#### Checkbox

- `checkbox.background.unchecked.default`
- `checkbox.background.checked.{default, hover, disabled}`
- `checkbox.fontSize.default`
- `checkbox.lineHeight.default`
- `checkbox.radius.default`
- `checkbox.icon.default`
- `checkbox.borderWidth.default`
- `checkbox.border.unchecked.{default, hover, disabled}`
- `checkbox.gap.label`
- `checkbox.content.default`

#### Radio Button

- `radio.button.background.unselected.default`
- `radio.button.background.selected.{default, hover, disabled}`
- `radio.button.border.unselected.{default, hover, disabled}`
- `radio.button.border.selected.{default, hover, disabled}`
- `radio.borderWidth.default`
- `radio.fontSize.default`
- `radio.lineHeight.default`
- `radio.radius.default`
- `radio.gap.label`

#### Chip

- `chip.background.unselected.{default, hover, pressed, disabled}`
- `chip.background.selected.{default, hover, pressed, disabled}`
- `chip.content.selected`
- `chip.content.unselected.{default, hover, pressed, dissabled}`
- `chip.border.unselected.{default, hover, pressed, disabled}`
- `chip.borderWidth.default`
- `chip.radius.default`
- `chip.gap.icon`
- `chip.padding.x.{sm, md, lg}`
- `chip.padding.y.{sm, md, lg}`
- `chip.padding.left.{sm, md, lg}`
- `chip.padding.right.{sm, md, lg}`
- `chip.fontSize.{sm, md, lg}`
- `chip.lineHeight.{sm, md, lg}`
- `chip.icon.{sm, md, lg}`
- `chip.outline.padding.x.{sm, md, lg}`
- `chip.outline.padding.y.{sm, md, lg}`
- `chip.outline.left.{sm, md, lg}`
- `chip.outline.right.{sm, md, lg}`

#### Alert

- `alert.success.content.{background, content}`
- `alert.icon.default`
- `alert.fontSize.default`
- `alert.lineHeight.default`
- `alert.danger.content.{background, content, icon}`
- `alert.gap.icon`
- `alert.gap.actions`
- `alert.warning.content.{background, content}`
- `alert.info.content.{background, content}`
- `alert.radius.{lg, sm}`
- `alert.padding.x.{sm, lg}`
- `alert.padding.y.{sm, lg}`
- `alert.shadow.default`

#### Toast

- `toast.fontSize.default`
- `toast.lineHeight.default`
- `toast.icon.default`
- `toast.gap.icon`
- `toast.gap.actions`
- `toast.radius.{sm, lg}`
- `toast.info.content.{background, content}`
- `toast.danger.content.{background, content, icon}`
- `toast.padding.x.{sm, lg}`
- `toast.padding.y.{sm, lg}`
- `toast.shadow.default`
- `toast.zIndex.default`

#### Card

- `card.radius.default`
- `card.gap.title.{sm, md, lg}`
- `card.gap.actions.{sm, md, lg}`
- `card.background.default`
- `card.content.{strong, default}`
- `card.border.{default, hover, selected}`
- `card.padding.x.{sm, md, lg}`
- `card.padding.y.{sm, md, lg}`
- `card.shadow.default`

#### Popover

- `popover.background.default`
- `popover.radius.default`
- `popover.border.default`
- `popover.borderWidth.default`
- `popover.shadow.default`
- `popover.zIndex.default`

#### Tooltip

- `tooltip.radius.default`
- `tooltip.padding.x`
- `tooltip.padding.y`
- `tooltip.container.{background, content}`
- `tooltip.arrow.background`
- `tooltip.width.default`
- `tooltip.shadow.default`
- `tooltip.zIndex.default`

#### Modal

- `modal.default.{background, overlay, border, content}`
- `modal.zIndex.default`
- `modal.opacity.default`
- `modal.shadow.default`

#### Drawer

- `drawer.default.{background, border, content}`
- `drawer.shadow.default`
- `drawer.zIndex.default`

#### Accordion

- `accordion.default.background.{default, hover, expanded}`
- `accordion.default.border.default`
- `accordion.default.content.default`
- `accordion.animation.duration`
- `accordion.animation.easing`

#### Tabs

- `tabs.default.background.{default, hover, active}`
- `tabs.default.border.{default, active}`
- `tabs.default.content.{default, active}`
- `tabs.default.indicator.default`
- `tabs.animation.duration`
- `tabs.animation.easing`

#### Slider

- `slider.default.track.default`
- `slider.default.fill.{default, hover}`
- `slider.default.thumb.{default, hover, active}`
- `slider.animation.duration`
- `slider.animation.easing`

#### Stepper

- `stepper.default.background.{default, active, completed, error}`
- `stepper.default.border.{default, active}`
- `stepper.default.content.{default, active, completed}`

#### File Upload

- `file.upload.default.background.{default, hover, drag.over, error}`
- `file.upload.default.border.{default, hover, drag.over, error}`
- `file.upload.default.content.default`
- `file.animation.duration`
- `file.animation.easing`

#### Rating

- `rating.default.background.{default, filled, hover}`

#### Pagination

- `pagination.height.{s, l}`
- `pagination.padding.x.{s, l}`
- `pagination.item.background.{default, selected}`
- `pagination.item.content.{default, hover, selected, disabled}`
- `pagination.radius.default`
- `pagination.gap.default`

#### Calendar

- `calendar.day.content.{default, today, selected, in.range, range.start, range.end, disabled}`
- `calendar.day.background.{default, hover, today, selected, in.range, range.start, range.end}`

#### Breadcrumbs

- `breadcrumbs.{default, hover, pressed, disabled}.default`

#### Link

- `link.default.content.{default, hover, active, visited, disabled}`

#### Badge

- `badge.default.{background, content, border}.default`
- `badge.success.{background, content}.default`
- `badge.warning.{background, content}.default`
- `badge.danger.{background, content}.default`
- `badge.info.{background, content}.default`

#### Avatar

- `avatar.default.{background, content, border}.default`

#### Divider

- `divider.horizontal.border.default`
- `divider.vertical.border.default`

#### Progress

- `progress.linear.background.default`
- `progress.linear.fill.{default, success, error}`
- `progress.linear.content.default`
- `progress.circular.background.default`
- `progress.circular.fill.default`

#### Skeleton

- `skeleton.text.background.default`
- `skeleton.circular.background.default`
- `skeleton.rectangular.background.default`

#### Loading

- `loading.spinner.default.content.default`

**Usage Example:**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{background-active-accent-default}"
}
```

---

## Token Reference Guide

### How to Reference Tokens

#### From Semantic Tokens

```json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{brand.500}"
}
```

#### From Component Tokens

```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{background-active-accent-default}"
}
```

#### Nested Token References

```json
{
  "$type": "borderRadius",
  "$collectionName": "semanticTokens",
  "$value": "{radius.sm}"
}
```

```json
{
  "$type": "dimension",
  "$collectionName": "semanticTokens",
  "$value": "{icon.button.sm}"
}
```

### Token Naming Patterns

1. **Primitives**: Flat structure, direct values
   - Colors: `{colorFamily.scale}` (e.g., `{brand.500}`)
   - Spacing: `{spacing-{value}}` (e.g., `{spacing-4}`)
   - Typography: `{typography-{property}-{value}}` (e.g., `{typography-fontSize-3}`)

2. **Semantic Tokens**: Meaning-based naming
   - Colors: `{property}-{participation}-{intent}-{variant}` (e.g., `{content-passive-neutral-default}`)
   - Nested: `{category}.{subcategory}.{size}` (e.g., `{radius.sm}`)

3. **Component Tokens**: Component-specific
   - Nested: `{component}.{variant}.{property}.{state}` (e.g., `{button.primary.boxed.background.default}`)
   - Icon: `{icon.{component}.{size}}` (e.g., `{icon.button.sm}`)

---

## Integration with Figma

### Linking to Figma Tokens Studio

1. Open Figma Tokens Studio plugin
2. Sync tokens from this repository
3. Use token names directly in Figma components
4. Reference tokens using the `{token.path}` syntax

### Figma Variable Mapping

Tokens are automatically mapped to Figma Variables when synced:
- Color tokens → Color Variables
- Spacing tokens → Number Variables
- Typography tokens → Typography Variables
- Shadow tokens → Shadow Variables

---

## Integration with Storybook

### Using Tokens in Storybook

```javascript
import tokens from './tokens/primitives.json';
import semanticTokens from './tokens/semanticTokens.json';
import componentTokens from './tokens/componentTokens.json';

// Use in stories
export const Primary = {
  args: {
    backgroundColor: semanticTokens['background-active-accent-default'].$value,
    borderRadius: semanticTokens.radius.sm.$value,
  },
};
```

### Storybook Addon Integration

Install `@storybook/addon-designs` or similar to link Figma designs with Storybook stories using these tokens.

---

## Quick Reference

### Most Used Tokens

#### Colors
- Primary: `{brand.500}`, `{background-active-accent-default}`
- Neutral: `{grey.500}`, `{content-passive-neutral-default}`
- Success: `{success.700}`, `{background-passive-success-default}`
- Danger: `{negative.700}`, `{background-passive-danger-default}`

#### Spacing
- Small: `{spacing-2}` (8px), `{padding.xs}` (12px)
- Medium: `{spacing-4}` (16px), `{padding.s}` (16px)
- Large: `{spacing-6}` (24px), `{padding.m}` (20px)

#### Typography
- Body: `{typography.body-size.md}`, `{typography.body-line.md}`
- Headline: `{typography.headline-size.h1}`, `{typography.headline-line.h1}`

#### Border Radius
- Small: `{radius.xs}` (4px)
- Medium: `{radius.sm}` (8px)
- Large: `{radius.md}` (12px)

---

## Support

For questions or issues with tokens:
- Check the [README.md](../README.md) for setup instructions
- Review token files in `/tokens/` directory
- Contact the design system team

---

**Generated from**: `/tokens/primitives.json`, `/tokens/semanticTokens.json`, `/tokens/componentTokens.json`
