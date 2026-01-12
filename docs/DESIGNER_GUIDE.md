# Designer Guide: Using Design Tokens for New Components

> **For Designers**: This guide explains how to use design tokens when creating new components in Figma. Only base components from the repository use component tokens—all other components should use semantic tokens.

---

## Table of Contents

- [Understanding Token Types](#understanding-token-types)
- [When to Use Which Tokens](#when-to-use-which-tokens)
- [Base Components (Component Tokens)](#base-components-component-tokens)
- [New Components (Semantic Tokens)](#new-components-semantic-tokens)
- [Semantic Token Naming Structure](#semantic-token-naming-structure)
- [Color Token Patterns](#color-token-patterns)
- [Step-by-Step Guide](#step-by-step-guide)
- [Common Use Cases](#common-use-cases)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Understanding Token Types

Our design system has three layers of tokens:

1. **Primitives** - Raw values (colors, sizes, spacing)
   - Example: `yellow.100`, `spacing-1`, `radius-2`
   - ❌ **Never use directly** in components

2. **Semantic Tokens** - Meaning-based tokens that reference primitives
   - Example: `content-passive-neutral-default`, `background-active-accent-hover`
   - ✅ **Use for all new components**

3. **Component Tokens** - Component-specific tokens that reference semantic tokens
   - Example: `button.primary.boxed.background.default`
   - ✅ **Only for base components** (button, field, checkbox, etc.)

---

## When to Use Which Tokens

### ✅ Use Component Tokens For:

Only these **base components** from the repository:

- `button` - All button variants
- `field` - Form input fields
- `toggle` - Toggle switches
- `checkbox` - Checkboxes
- `radio.button` - Radio buttons
- `chip` - Chips/tags
- `alert` - Alert messages
- `toast` - Toast notifications
- `card` - Cards
- `popover` - Popovers
- `tooltip` - Tooltips
- `modal` - Modals
- `drawer` - Drawers
- `pagination` - Pagination components

### ✅ Use Semantic Tokens For:

**Everything else!** All new components, custom components, and variations should use semantic tokens.

Examples:
- Custom cards
- Feature-specific components
- Page-specific layouts
- New UI patterns
- Any component not in the base list above

---

## Base Components (Component Tokens)

If you're working with a base component (like `button` or `field`), you can use component tokens directly:

### Example: Button Component

```
button.primary.boxed.background.default
button.primary.boxed.content.default
button.primary.boxed.border.default
button.radius.sm
```

**In Figma:**
1. Select your button component
2. Open the Tokens Studio panel
3. Use tokens like `{button.primary.boxed.background.default}`

---

## New Components (Semantic Tokens)

For **all new components**, use semantic tokens. This ensures consistency and makes your designs maintainable.

### Why Semantic Tokens?

- ✅ Consistent across all components
- ✅ Easy to update globally
- ✅ Follows design system patterns
- ✅ Works with theming (Reservio/Survio)

---

## Semantic Token Naming Structure

Semantic tokens follow this pattern:

```
[property]-[participation]-[intent]-[state]
```

### Property
What you're styling:
- `content` - Text/content colors
- `background` - Background colors
- `border` - Border colors

### Participation
Interactive state:
- `passive` - Non-interactive elements (text, backgrounds)
- `active` - Interactive elements (buttons, links, inputs)

### Intent
Semantic meaning:
- `neutral` - Default/neutral content
- `accent` - Primary brand color
- `danger` - Error/destructive actions
- `success` - Success states
- `warning` - Warning states
- `info` - Informational content
- `upgrade` - Premium/upgrade features

### State
Interactive state (for active tokens):
- `default` - Default state
- `hover` - Hover state
- `pressed` - Pressed/active state
- `disabled` - Disabled state
- `selected` - Selected state
- `focused` - Focused state (for inputs)

---

## Color Token Patterns

### Content Colors (Text)

**Pattern**: `content-{participation}-{intent}-{state}`

#### Passive Content (Non-interactive text)

```
content-passive-neutral-strong      → Darkest text (headings)
content-passive-neutral-default      → Default text
content-passive-neutral-subtle       → Secondary text
content-passive-neutral-muted        → Muted/disabled text
```

#### Active Content (Interactive text)

```
content-active-neutral-default       → Default link color
content-active-neutral-hover         → Link hover
content-active-neutral-pressed       → Link pressed
content-active-neutral-disabled       → Disabled link
```

#### Intent-Based Content

```
content-passive-on-accent            → Text on accent background
content-passive-on-success           → Text on success background
content-passive-on-danger            → Text on danger background
content-passive-on-warning           → Text on warning background
content-passive-on-info              → Text on info background
content-passive-on-upgrade           → Text on upgrade background
```

### Background Colors

**Pattern**: `background-{participation}-{intent}-{state}`

#### Passive Backgrounds (Non-interactive)

```
background-passive-neutral-default   → Default background
background-passive-neutral-subtle    → Subtle background
background-passive-neutral-elevated  → Elevated/card background
background-passive-neutral-strong    → Strong background
```

#### Active Backgrounds (Interactive)

```
background-active-neutral-default    → Default button background
background-active-neutral-hover      → Button hover
background-active-neutral-pressed     → Button pressed
background-active-neutral-disabled    → Button disabled
```

#### Intent-Based Backgrounds

```
background-active-accent-default     → Primary button
background-active-accent-hover       → Primary button hover
background-active-accent-pressed     → Primary button pressed
background-active-accent-disabled    → Primary button disabled

background-passive-danger-subtle      → Error background (subtle)
background-passive-success-subtle     → Success background (subtle)
background-passive-warning-subtle     → Warning background (subtle)
background-passive-info-subtle        → Info background (subtle)
```

### Border Colors

**Pattern**: `border.{participation}.{intent}.{control-type}.{state}`

#### Active Borders (Interactive)

```
border.active.accent.default          → Primary border
border.active.accent.hover            → Primary border hover
border.active.accent.pressed          → Primary border pressed
border.active.accent.disabled         → Primary border disabled
border.active.accent.selected         → Primary border selected

border.active.neutral.action.default  → Neutral action border
border.active.neutral.action.hover    → Neutral action border hover
border.active.neutral.action.pressed  → Neutral action border pressed
border.active.neutral.action.disabled → Neutral action border disabled

border.active.neutral.control.field.default    → Input field border
border.active.neutral.control.field.hover       → Input field border hover
border.active.neutral.control.field.focused     → Input field border focused
border.active.neutral.control.field.selected    → Input field border selected
border.active.neutral.control.field.disabled    → Input field border disabled

border.active.danger.default          → Error border
```

#### Passive Borders (Non-interactive)

```
border.passive.neutral.default        → Divider/separator border
```

---

## Step-by-Step Guide

### Creating a New Component with Semantic Tokens

#### Step 1: Identify Your Component Type

Ask yourself:
- Is this a base component? → Use component tokens
- Is this a new/custom component? → Use semantic tokens ✅

#### Step 2: Choose Your Color Tokens

**For Text/Content:**
1. Is it interactive? → Use `content-active-*`
2. Is it non-interactive? → Use `content-passive-*`
3. What's the intent? → Choose: `neutral`, `accent`, `danger`, `success`, `warning`, `info`, `upgrade`
4. What's the state? → Choose: `default`, `hover`, `pressed`, `disabled`, etc.

**For Backgrounds:**
1. Is it interactive? → Use `background-active-*`
2. Is it non-interactive? → Use `background-passive-*`
3. What's the intent? → Choose appropriate intent
4. What's the state? → Choose appropriate state

**For Borders:**
1. Is it interactive? → Use `border.active.*`
2. Is it non-interactive? → Use `border.passive.*`
3. What type? → `accent`, `neutral.action`, `neutral.control.field`, `danger`, etc.

#### Step 3: Apply in Figma

1. Select your element (text, frame, or border)
2. Open the **Tokens Studio** panel
3. Click on the color property (fill, stroke, or text)
4. Search for your semantic token (e.g., `content-passive-neutral-default`)
5. Select the token

#### Step 4: Verify

- ✅ Token name follows the pattern
- ✅ Token is from `semanticTokens` collection
- ✅ Color matches the intended use case

---

## Common Use Cases

### Use Case 1: Custom Card Component

**Background:**
```
background-passive-neutral-elevated
```

**Title Text:**
```
content-passive-neutral-strong
```

**Body Text:**
```
content-passive-neutral-default
```

**Border (if needed):**
```
border.passive.neutral.default
```

### Use Case 2: Custom Button (Not Base Component)

**Background:**
```
background-active-accent-default    → Default
background-active-accent-hover      → Hover
background-active-accent-pressed     → Pressed
background-active-accent-disabled    → Disabled
```

**Text:**
```
content-passive-on-accent           → Text on accent background
```

**Border:**
```
border.active.accent.default        → Default
border.active.accent.hover          → Hover
```

### Use Case 3: Input Field (Not Base Component)

**Background:**
```
background-passive-neutral-elevated
```

**Text:**
```
content-passive-neutral-default
```

**Placeholder:**
```
content-passive-neutral-muted
```

**Border:**
```
border.active.neutral.control.field.default    → Default
border.active.neutral.control.field.hover      → Hover
border.active.neutral.control.field.focused     → Focused
border.active.neutral.control.field.disabled   → Disabled
```

### Use Case 4: Error Message

**Background:**
```
background-passive-danger-subtle
```

**Text:**
```
content-passive-on-danger
```

**Icon:**
```
content-passive-danger
```

**Border (optional):**
```
border.active.danger.default
```

### Use Case 5: Success Message

**Background:**
```
background-passive-success-subtle
```

**Text:**
```
content-passive-on-success
```

**Icon:**
```
content-passive-success
```

### Use Case 6: Warning Banner

**Background:**
```
background-passive-warning-subtle
```

**Text:**
```
content-passive-on-warning
```

**Icon:**
```
content-passive-warning
```

### Use Case 7: Info Banner

**Background:**
```
background-passive-info-subtle
```

**Text:**
```
content-passive-on-info
```

**Icon:**
```
content-passive-info
```

### Use Case 8: Link/Text Button

**Text:**
```
content-active-accent-default        → Default
content-active-accent-hover          → Hover
content-active-accent-pressed        → Pressed
content-active-accent-disabled       → Disabled
```

**Background (hover state):**
```
background-active-neutral-hover
```

---

## Best Practices

### ✅ Do

1. **Always use semantic tokens** for new components
2. **Follow the naming pattern** - it helps you find the right token
3. **Use intent-based tokens** - they adapt to themes automatically
4. **Check existing tokens first** - don't create new ones unless necessary
5. **Use passive tokens** for non-interactive elements
6. **Use active tokens** for interactive elements
7. **Test different states** - hover, pressed, disabled, etc.

### ❌ Don't

1. **Don't use primitives directly** - always use semantic tokens
2. **Don't create new component tokens** - use semantic tokens instead
3. **Don't mix component and semantic tokens** - pick one approach
4. **Don't use hardcoded colors** - always use tokens
5. **Don't skip states** - design for all interaction states

---

## Token Reference Quick Guide

### Text Colors

| Use Case | Token Pattern |
|----------|---------------|
| Heading | `content-passive-neutral-strong` |
| Body text | `content-passive-neutral-default` |
| Secondary text | `content-passive-neutral-subtle` |
| Muted text | `content-passive-neutral-muted` |
| Link (default) | `content-active-accent-default` |
| Link (hover) | `content-active-accent-hover` |
| Link (pressed) | `content-active-accent-pressed` |
| Link (disabled) | `content-active-accent-disabled` |
| Text on accent | `content-passive-on-accent` |
| Text on success | `content-passive-on-success` |
| Text on danger | `content-passive-on-danger` |
| Text on warning | `content-passive-on-warning` |
| Text on info | `content-passive-on-info` |

### Background Colors

| Use Case | Token Pattern |
|----------|---------------|
| Page background | `background-passive-neutral-default` |
| Card background | `background-passive-neutral-elevated` |
| Subtle background | `background-passive-neutral-subtle` |
| Primary button | `background-active-accent-default` |
| Primary button hover | `background-active-accent-hover` |
| Primary button pressed | `background-active-accent-pressed` |
| Primary button disabled | `background-active-accent-disabled` |
| Error background | `background-passive-danger-subtle` |
| Success background | `background-passive-success-subtle` |
| Warning background | `background-passive-warning-subtle` |
| Info background | `background-passive-info-subtle` |

### Border Colors

| Use Case | Token Pattern |
|----------|---------------|
| Divider | `border.passive.neutral.default` |
| Primary border | `border.active.accent.default` |
| Primary border hover | `border.active.accent.hover` |
| Input border | `border.active.neutral.control.field.default` |
| Input border hover | `border.active.neutral.control.field.hover` |
| Input border focused | `border.active.neutral.control.field.focused` |
| Input border disabled | `border.active.neutral.control.field.disabled` |
| Error border | `border.active.danger.default` |

---

## Troubleshooting

### "I can't find the right token"

1. **Check the pattern**: Use `[property]-[participation]-[intent]-[state]`
2. **Search in Tokens Studio**: Use the search function
3. **Check semantic tokens**: Make sure you're looking in `semanticTokens` collection
4. **Review this guide**: Check the common use cases above

### "The token doesn't exist"

1. **Check if you need a component token**: Only base components have component tokens
2. **Use semantic tokens instead**: For new components, use semantic tokens
3. **Check the naming**: Make sure you're using the correct pattern

### "I'm not sure which token to use"

1. **Identify the property**: content, background, or border?
2. **Identify participation**: passive (non-interactive) or active (interactive)?
3. **Identify intent**: neutral, accent, danger, success, warning, info, upgrade?
4. **Identify state**: default, hover, pressed, disabled, selected, focused?

### "Should I create a new token?"

**No!** For new components, use existing semantic tokens. Only create new tokens if:
- You're adding a new base component to the repository
- You need a new semantic meaning that doesn't exist
- You're working with the design system team

---

## Quick Reference Card

### For New Components:

```
✅ Use Semantic Tokens
❌ Don't Use Component Tokens
❌ Don't Use Primitives
```

### Token Pattern:

```
[property]-[participation]-[intent]-[state]

Examples:
content-passive-neutral-default
background-active-accent-hover
border.active.neutral.control.field.focused
```

### Base Components (Use Component Tokens):

```
button, field, toggle, checkbox, radio.button, chip,
alert, toast, card, popover, tooltip, modal, drawer, pagination
```

### Everything Else (Use Semantic Tokens):

```
✅ Custom components
✅ Feature-specific components
✅ Page layouts
✅ New UI patterns
✅ Any component not in base list
```

---

## Need Help?

- **Check Tokens Studio**: Browse available tokens in Figma
- **Review this guide**: Common use cases and patterns
- **Ask the design system team**: For new token requests or clarifications

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
