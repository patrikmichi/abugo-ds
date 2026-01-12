# Figma Tokens Studio Configuration

## Personal Access Token (PAT)

Your Token Studio PAT is configured in `.env`:

```
TOKEN_STUDIO_PAT=pat_ebf8c29a_62db_449f_b55c_c60451a17d67
```

## Token Structure

This repository contains design tokens exported from Figma Tokens Studio. The tokens follow the **[property]-[participation]-[intent]** naming structure and are organized into three separate files for better management.

### File Structure

```
figma tokens/
├── .env                    # Personal Access Token (gitignored)
├── .storybook/             # Storybook configuration
├── docs/                   # Documentation files
│   ├── TOKENS.md          # Comprehensive token reference
│   └── tokens-structure.json # Token structure metadata
├── stories/                # Storybook stories
├── tokens/
│   ├── $metadata.json      # Token set order configuration
│   ├── $themes.json        # Theme configuration (Reservio, Survio)
│   ├── primitives.json     # Primitive/base tokens
│   ├── semanticTokens.json # Semantic tokens
│   └── componentTokens.json # Component tokens
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

### Primitives (Base Tokens)

These are the foundational design tokens that other tokens reference. All primitive tokens are flattened (no category wrappers) to allow Tokens Studio to auto-categorize based on `$type`.

**Color Families** (flattened structure):
- `yellow.100` through `yellow.800` - Yellow color scale
- `grey.000` through `grey.800` - Grey color scale
- `brand.100` through `brand.800` - Brand color scale
- `upgrade.100` through `upgrade.800` - Upgrade color scale
- `negative.100` through `negative.800` - Negative/danger color scale
- `success.100` through `success.800` - Success color scale
- `warning.100` through `warning.800` - Warning color scale
- `aqua.100` through `aqua.800` - Aqua color scale
- `purple.100` through `purple.800` - Purple color scale
- `brown.100` through `brown.800` - Brown color scale

**Feature Colors** (flattened structure):
- `passes.credits.*` - Passes feature colors
- `passes.punch-cards.*` - Punch cards feature colors
- `passes.memberships.*` - Memberships feature colors
- `ai-features.*` - AI features colors

**Spacing**:
- `spacing-1` through `spacing-30` - Spacing scale (4px to 120px)

**Border Width**:
- `border-width-0` through `border-width-3` - Border width values (0px to 4px)

**Border Radius**:
- `radius-0` through `radius-6`, `radius-round` - Border radius values (0px to 24px, 999px)

**Icon Size**:
- `icon-size.icon-size-1` through `icon-size.icon-size-8` - Icon size scale (16px to 64px)

**Sizing**:
- `size-1` through `size-6` - Size scale for controls (16px to 56px)

**Typography**:
- `typography-fontSize-1` through `typography-fontSize-9` - Font sizes (12px to 48px in rem)
- `typography-lineHeight-*` - Line height scales
- `typography-fontWeight-regular`, `medium`, `bold` - Font weights
- `typography-fontFamily-base` - Font family (Venn)

**Shadows**:
- `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-inner` - Box shadow values

**Opacity**:
- `opacity-0` through `opacity-100` - Opacity values (0% to 100%)

**Z-Index**:
- `z-index.z-base`, `z-index.z-dropdown`, `z-index.z-sticky`, `z-index.z-fixed`, `z-index.z-modal-backdrop`, `z-index.z-modal`, `z-index.z-popover`, `z-index.z-tooltip` - Z-index layering values

**Animation**:
- `duration-fast`, `duration-base` - Animation duration values
- `easing-ease-out`, `easing-ease-in-out` - Easing function values

**Universal**:
- `universal.transparent` - Transparent color value

### Semantic Tokens

Semantic tokens reference primitives and provide meaning-based naming following the `[property]-[participation]-[intent]` structure. All semantic tokens use nested structures for proper categorization in Tokens Studio.

**Color Tokens** (flat structure):
- `content-passive-*` - Text/content colors for passive states
- `content-active-*` - Text/content colors for active/interactive states
- `background-passive-*` - Background colors for passive states
- `background-active-*` - Background colors for active/interactive states

**Border Tokens** (nested structure):
- `border.active.accent.*` - Active border colors for accent intent
- `border.active.neutral.action.*` - Active border colors for neutral action intent
- `border.active.neutral.control.field.*` - Active border colors for form fields
- `border.active.neutral.control.toggle.*` - Active border colors for toggles/checkboxes
- `border.active.danger.*` - Active border colors for danger intent
- `border.passive.neutral.*` - Passive border colors for neutral intent
- `border-width-thin`, `border-width-thicker`, `border-width-thick` - Border width semantic tokens

**Typography Tokens** (nested structure):
- `typography.headline-size.{h1-h6}` - Headline font sizes
- `typography.headline-line.{h1-h6}` - Headline line heights
- `typography.body-size.{xs, sm, md, lg}` - Body font sizes
- `typography.body-line.{xs, sm, md, lg}` - Body line heights
- `typography.body-weight.{light, normal, md, semibold, bold}` - Body font weights

**Spacing Tokens** (nested structure):
- `radius.{none, xs, sm, md, lg, xl, xxl, full}` - Border radius tokens
- `icon.{xxs, xs, sm, md, lg, xl, xxl, huge}` - Icon size tokens
- `gap.{xxs, xs, s, m, l, xl, xxl}` - Gap spacing tokens
- `padding.{xxxs, xxs, xs, s, m, l, xl, xxl, xxxl, xxxxl}` - Padding spacing tokens
- `control.height.{xxxs, xxs, xs, sm, md, lg}` - Control height tokens

**Other Semantic Tokens** (nested structure):
- `shadow.{xs, sm, md, lg, xl, 2xl, inner}` - Shadow tokens
- `z-index.{base, dropdown, sticky, fixed, modal-backdrop, modal, popover, tooltip}` - Z-index tokens
- `opacity.overlay` - Opacity tokens
- `animation.duration.{fast, base}` - Animation duration tokens
- `animation.easing.{ease-out, ease-in-out}` - Animation easing tokens
- `sizing.tooltip-arrow` - Sizing tokens

**Custom Tokens**:
- `custom-notes-*` - Notes feature colors
- `custom-rating` - Rating feature colors

### Component Tokens

Component-specific tokens that reference semantic tokens. All component tokens use nested structures organized by component, variant, property, and state/size.

**Icon Tokens** (grouped at root level):
- `icon.button.{sm, md, lg}` - Button icon sizes
- `icon.field.{sm, lg}` - Field icon sizes
- `icon.checkbox.default` - Checkbox icon size
- `icon.chip.{sm, md, lg}` - Chip icon sizes

**Component Categories**:
- `button.*` - Button styling tokens (primary, secondary, danger, etc.)
- `field.*` - Form field tokens (height, fontSize, padding, radius, status, etc.)
- `toggle.*` - Toggle component tokens
- `checkbox.*` - Checkbox tokens
- `radio.button.*` - Radio button tokens
- `chip.*` - Chip component tokens
- `alert.*` - Alert component tokens
- `toast.*` - Toast notification tokens
- `card.*` - Card component tokens
- `popover.*` - Popover tokens
- `tooltip.*` - Tooltip tokens
- `modal.*` - Modal tokens
- `drawer.*` - Drawer tokens
- And more...

## Naming Conventions

### Size Naming
All size tokens use standardized abbreviations:
- `xs` - Extra small
- `sm` - Small
- `md` - Medium
- `lg` - Large
- `xl` - Extra large
- `xxl` - Extra extra large

### Token Naming
- Token names use **kebab-case** (W3C DTCG compliance)
- Typography properties use **camelCase** (W3C DTCG standard)
- Example: `content-passive-neutral-default`, `typography-fontSize-1`

## Themes

The design system supports two themes managed via `$themes.json`:
- **Reservio** - Baseline theme
- **Survio** - Extended theme

Both themes use the same token structure, with brand-specific values handled at the primitive level through color families.

## Documentation

### Live Storybook Documentation

View all tokens in an interactive Storybook:

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) in your browser.

The Storybook includes:
- **Primitives Colors** - All base color tokens organized by family
- **Semantic Colors** - Meaning-based color tokens
- **Spacing** - Spacing scale tokens
- **Typography** - Font sizes, line heights, and typography tokens
- **Border Radius** - Border radius values
- **Shadows** - Box shadow tokens
- **Component Tokens** - Overview of component-specific tokens

### Token Reference Documentation

See [`docs/TOKENS.md`](docs/TOKENS.md) for comprehensive token reference documentation.

## How to Use

### Syncing with Figma Tokens Studio

1. Open Figma and launch the **Tokens Studio** plugin
2. Go to the **Sync** settings
3. When prompted for a Personal Access Token, enter:
   ```
   pat_ebf8c29a_62db_449f_b55c_c60451a17d67
   ```
4. The plugin will use this token to authenticate and sync your design tokens

Tokens Studio will automatically create Figma Variables from your tokens:
- **Color tokens** → Figma Color Variables
- **Spacing tokens** → Figma Number Variables
- **Typography tokens** → Figma Typography Variables
- **Shadow tokens** → Figma Shadow Variables

### Referencing Tokens

Tokens can reference other tokens using the `{token.path}` syntax:

**Primitive References:**
```json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{yellow.100}"
}
```

**Semantic Token References:**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{content-passive-neutral-default}"
}
```

**Nested Semantic Token References:**
```json
{
  "$type": "borderRadius",
  "$collectionName": "semanticTokens",
  "$value": "{radius.sm}"
}
```

**Component Token References:**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{background-active-accent-default}"
}
```

**Icon Token References:**
```json
{
  "$type": "dimension",
  "$collectionName": "semanticTokens",
  "$value": "{icon.button.sm}"
}
```

### Semantic Token Structure

Semantic tokens follow the `[property]-[participation]-[intent]` pattern:

- **Property**: What you're styling (content, background, border)
- **Participation**: Interactive state (passive, active)
- **Intent**: Semantic meaning (neutral, accent, danger, success, warning, info, upgrade)

**Example:**
```json
{
  "content-passive-neutral-default": {
    "$type": "color",
    "$collectionName": "primitives",
    "$value": "{grey.700}",
    "$description": "passive token for neutral intent"
  }
}
```

### Component Token Structure

Component tokens reference semantic tokens and are organized by component, variant, property, and state:

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
    },
    "radius": {
      "sm": {
        "$type": "borderRadius",
        "$collectionName": "semanticTokens",
        "$value": "{radius.xs}"
      }
    }
  }
}
```

## Token Architecture

### Layering

1. **Primitives** → Raw values (colors, sizes, spacing, etc.)
2. **Semantic Tokens** → Primitives paired with semantic meaning
3. **Component Tokens** → Semantic tokens applied to specific components

### Best Practices

- **Always reference semantic tokens** from component tokens (except `universal.transparent`)
- **Use nested structures** for proper categorization in Tokens Studio
- **Follow naming conventions** (kebab-case for tokens, camelCase for typography properties)
- **Use standardized size abbreviations** (xs, sm, md, lg, xl, xxl)
- **Group related tokens** (e.g., all icon sizes under `icon.*`)

## Security Note

The PAT is stored in `.env` which is already listed in `.gitignore` to prevent committing sensitive tokens to version control.
