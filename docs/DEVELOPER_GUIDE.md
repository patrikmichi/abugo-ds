# Developer Guide: Using Design Tokens with Panda CSS

> **For Developers**: This guide explains how to use design tokens in your codebase with Panda CSS. All tokens from Figma are automatically available as CSS utilities and JavaScript/TypeScript tokens.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Token Structure](#token-structure)
- [Using Tokens in Code](#using-tokens-in-code)
- [Color Tokens](#color-tokens)
- [Spacing Tokens](#spacing-tokens)
- [Typography Tokens](#typography-tokens)
- [Border Radius Tokens](#border-radius-tokens)
- [Shadow Tokens](#shadow-tokens)
- [Semantic Tokens](#semantic-tokens)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

Panda CSS is configured to automatically generate CSS utilities and TypeScript types from your design tokens. The generated system is available in the `styled-system/` directory.

### Prerequisites

- Node.js 18+ installed
- Dependencies installed (`npm install`)

---

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate CSS System

After making changes to tokens, regenerate the CSS system:

```bash
npx panda codegen
```

This command:
- Reads tokens from `tokens/primitives.json` and `tokens/semanticTokens.json`
- Generates TypeScript types in `styled-system/`
- Creates CSS utilities and patterns

### 3. Import CSS

In your application entry point (e.g., `src/index.tsx` or `src/main.tsx`):

```tsx
import '../styled-system/styles.css';
```

Or if using a bundler that supports CSS imports:

```tsx
import '@pandacss/dev/postcss';
```

---

## Token Structure

Tokens are organized into three layers:

1. **Primitives** - Base values (colors, spacing, typography)
2. **Semantic Tokens** - Meaning-based tokens (content colors, backgrounds)
3. **Component Tokens** - Component-specific tokens (for reference only)

Panda CSS uses **primitives** and **semantic tokens** directly.

---

## Using Tokens in Code

### Import Panda CSS Utilities

```tsx
import { css } from '../styled-system/css';
import { styled } from '../styled-system/jsx';
```

### Using the `css` Function

```tsx
const buttonStyles = css({
  backgroundColor: 'brand.700',
  padding: 'spacing-4',
  borderRadius: 'radius-2',
  color: 'grey.000',
});
```

### Using JSX Styled Components

```tsx
import { styled } from '../styled-system/jsx';

const Button = styled('button', {
  base: {
    backgroundColor: 'brand.700',
    padding: 'spacing-4',
    borderRadius: 'radius-2',
    color: 'grey.000',
  },
});
```

### Using Class Names

```tsx
<div className="bg-brand-700 p-spacing-4 rounded-radius-2 text-grey-000">
  Button
</div>
```

---

## Color Tokens

### Primitive Colors

Color families are available as nested tokens:

```tsx
// Yellow scale
css({ color: 'yellow.100' })  // Lightest
css({ color: 'yellow.800' })  // Darkest

// Grey scale
css({ color: 'grey.000' })    // White
css({ color: 'grey.800' })    // Darkest

// Brand colors
css({ backgroundColor: 'brand.500' })
css({ backgroundColor: 'brand.700' })

// Other color families
css({ color: 'negative.700' })   // Error red
css({ color: 'success.700' })    // Success green
css({ color: 'warning.700' })    // Warning yellow
css({ color: 'upgrade.700' })    // Upgrade blue
```

### Feature Colors

```tsx
// Passes feature colors
css({ color: 'passes.credits.strong' })
css({ backgroundColor: 'passes.credits.subtle' })
css({ color: 'passes.punch-cards.strong' })  // Note: spaces converted to hyphens
css({ backgroundColor: 'passes.punch-cards.subtle' })
css({ color: 'passes.memberships.strong' })
css({ backgroundColor: 'passes.memberships.subtle' })

// AI features
css({ color: 'ai-features.strong' })
css({ backgroundColor: 'ai-features.subtle' })
```

### Semantic Colors

Semantic colors provide meaning-based naming:

```tsx
// Content colors (text)
css({ color: 'content-passive-neutral-default' })
css({ color: 'content-passive-neutral-strong' })
css({ color: 'content-active-accent-default' })

// Background colors
css({ backgroundColor: 'background-passive-neutral-default' })
css({ backgroundColor: 'background-active-accent-default' })
css({ backgroundColor: 'background-passive-danger-subtle' })

// Border colors
css({ borderColor: 'border.active.accent.default' })
css({ borderColor: 'border.active.neutral.control.field.focused' })
```

---

## Spacing Tokens

Spacing tokens use the `spacing-{number}` format:

```tsx
// Padding
css({ padding: 'spacing-4' })        // 16px
css({ padding: 'spacing-8' })        // 32px
css({ paddingX: 'spacing-4' })       // Horizontal padding
css({ paddingY: 'spacing-2' })      // Vertical padding

// Margin
css({ margin: 'spacing-4' })
css({ marginTop: 'spacing-8' })
css({ marginX: 'spacing-6' })

// Gap (for flexbox/grid)
css({ gap: 'spacing-4' })
```

### Semantic Spacing

Semantic spacing tokens are also available:

```tsx
css({ gap: 'gap.m' })              // Medium gap
css({ padding: 'padding.s' })      // Small padding
css({ borderRadius: 'radius.sm' }) // Small radius
```

---

## Typography Tokens

### Font Sizes

```tsx
css({ fontSize: 'typography-fontSize-1' })  // 12px (0.75rem)
css({ fontSize: 'typography-fontSize-3' })  // 16px (1rem)
css({ fontSize: 'typography-fontSize-9' })  // 48px (3rem)
```

### Line Heights

```tsx
css({ lineHeight: 'typography-lineHeight-base' })
```

### Font Weights

```tsx
css({ fontWeight: 'typography-fontWeight-regular' })  // 400
css({ fontWeight: 'typography-fontWeight-medium' })  // 500
css({ fontWeight: 'typography-fontWeight-bold' })    // 700
```

### Font Family

```tsx
css({ fontFamily: 'typography-fontFamily-base' })  // Venn
```

### Semantic Typography

```tsx
// Headline sizes
css({ fontSize: 'typography.headline-size.h1' })
css({ fontSize: 'typography.headline-size.h2' })

// Body sizes
css({ fontSize: 'typography.body-size.md' })
css({ fontSize: 'typography.body-size.sm' })

// Line heights
css({ lineHeight: 'typography.headline-line.h1' })
css({ lineHeight: 'typography.body-line.md' })

// Font weights
css({ fontWeight: 'typography.body-weight.normal' })
css({ fontWeight: 'typography.body-weight.bold' })
```

---

## Border Radius Tokens

```tsx
// Primitive radius
css({ borderRadius: 'radius-0' })   // 0px
css({ borderRadius: 'radius-2' })   // 8px
css({ borderRadius: 'radius-4' })   // 16px
css({ borderRadius: 'radius-round' }) // 999px (pill shape)

// Semantic radius
css({ borderRadius: 'radius.none' })
css({ borderRadius: 'radius.sm' })
css({ borderRadius: 'radius.md' })
css({ borderRadius: 'radius.full' })
```

---

## Shadow Tokens

```tsx
// Primitive shadows
css({ boxShadow: 'shadow-xs' })
css({ boxShadow: 'shadow-sm' })
css({ boxShadow: 'shadow-md' })
css({ boxShadow: 'shadow-lg' })
css({ boxShadow: 'shadow-xl' })
css({ boxShadow: 'shadow-2xl' })
css({ boxShadow: 'shadow-inner' })

// Semantic shadows
css({ boxShadow: 'shadow.xs' })
css({ boxShadow: 'shadow.md' })
```

---

## Semantic Tokens

Semantic tokens provide meaning-based naming that adapts to your design system. Always prefer semantic tokens over primitives when available.

### Content Colors

```tsx
// Text colors
css({ color: 'content-passive-neutral-default' })  // Default text
css({ color: 'content-passive-neutral-strong' })   // Headings
css({ color: 'content-passive-neutral-subtle' })    // Secondary text
css({ color: 'content-passive-neutral-muted' })     // Muted/disabled text

// Interactive text
css({ color: 'content-active-accent-default' })     // Links
css({ color: 'content-active-accent-hover' })       // Link hover
css({ color: 'content-active-accent-pressed' })     // Link pressed
css({ color: 'content-active-accent-disabled' })    // Link disabled

// Text on colored backgrounds
css({ color: 'content-passive-on-accent' })         // Text on accent
css({ color: 'content-passive-on-danger' })         // Text on error
css({ color: 'content-passive-on-success' })        // Text on success
```

### Background Colors

```tsx
// Neutral backgrounds
css({ backgroundColor: 'background-passive-neutral-default' })
css({ backgroundColor: 'background-passive-neutral-elevated' })  // Cards
css({ backgroundColor: 'background-passive-neutral-subtle' })

// Interactive backgrounds
css({ backgroundColor: 'background-active-accent-default' })     // Primary button
css({ backgroundColor: 'background-active-accent-hover' })
css({ backgroundColor: 'background-active-accent-pressed' })
css({ backgroundColor: 'background-active-accent-disabled' })

// Intent-based backgrounds
css({ backgroundColor: 'background-passive-danger-subtle' })      // Error background
css({ backgroundColor: 'background-passive-success-subtle' })    // Success background
css({ backgroundColor: 'background-passive-warning-subtle' })     // Warning background
css({ backgroundColor: 'background-passive-info-subtle' })        // Info background
```

### Border Colors

```tsx
// Primary borders
css({ borderColor: 'border.active.accent.default' })
css({ borderColor: 'border.active.accent.hover' })

// Input field borders
css({ borderColor: 'border.active.neutral.control.field.default' })
css({ borderColor: 'border.active.neutral.control.field.focused' })
css({ borderColor: 'border.active.neutral.control.field.disabled' })

// Error borders
css({ borderColor: 'border.active.danger.default' })

// Passive borders (dividers)
css({ borderColor: 'border.passive.neutral.default' })
```

---

## Examples

### Button Component

```tsx
import { css } from '../styled-system/css';

const buttonBase = css({
  paddingX: 'spacing-5',
  paddingY: 'spacing-3',
  borderRadius: 'radius-2',
  fontWeight: 'typography-fontWeight-bold',
  fontSize: 'typography-fontSize-3',
  transition: 'all 0.2s',
});

const buttonPrimary = css({
  backgroundColor: 'background-active-accent-default',
  color: 'content-passive-on-accent',
  '&:hover': {
    backgroundColor: 'background-active-accent-hover',
  },
  '&:active': {
    backgroundColor: 'background-active-accent-pressed',
  },
  '&:disabled': {
    backgroundColor: 'background-active-accent-disabled',
    color: 'content-active-accent-disabled',
  },
});

const buttonSecondary = css({
  backgroundColor: 'background-passive-neutral-elevated',
  color: 'content-active-accent-default',
  border: '1px solid',
  borderColor: 'border.active.accent.default',
  '&:hover': {
    backgroundColor: 'background-active-neutral-hover',
  },
});
```

### Card Component

```tsx
import { css } from '../styled-system/css';

const card = css({
  backgroundColor: 'background-passive-neutral-elevated',
  borderRadius: 'radius.sm',
  padding: 'padding.m',
  boxShadow: 'shadow-sm',
  border: '1px solid',
  borderColor: 'border.passive.neutral.default',
});

const cardTitle = css({
  color: 'content-passive-neutral-strong',
  fontSize: 'typography.headline-size.h3',
  marginBottom: 'spacing-2',
});

const cardBody = css({
  color: 'content-passive-neutral-default',
  fontSize: 'typography.body-size.md',
  lineHeight: 'typography.body-line.md',
});
```

### Input Field

```tsx
import { css } from '../styled-system/css';

const input = css({
  width: '100%',
  paddingX: 'padding.s',
  paddingY: 'padding.xs',
  borderRadius: 'radius.sm',
  border: '1px solid',
  borderColor: 'border.active.neutral.control.field.default',
  backgroundColor: 'background-passive-neutral-elevated',
  color: 'content-passive-neutral-default',
  fontSize: 'typography.body-size.md',
  '&:hover': {
    borderColor: 'border.active.neutral.control.field.hover',
  },
  '&:focus': {
    outline: 'none',
    borderColor: 'border.active.neutral.control.field.focused',
    boxShadow: 'shadow-xs',
  },
  '&:disabled': {
    backgroundColor: 'background-active-neutral-disabled',
    borderColor: 'border.active.neutral.control.field.disabled',
    color: 'content-passive-neutral-muted',
  },
});
```

### Alert Component

```tsx
import { css } from '../styled-system/css';

const alert = css({
  padding: 'padding.m',
  borderRadius: 'radius.md',
  display: 'flex',
  gap: 'gap.s',
  alignItems: 'flex-start',
});

const alertDanger = css({
  backgroundColor: 'background-passive-danger-subtle',
  border: '1px solid',
  borderColor: 'border.active.danger.default',
});

const alertContent = css({
  color: 'content-passive-on-danger',
  fontSize: 'typography.body-size.md',
});
```

---

## Best Practices

### ✅ Do

1. **Use semantic tokens** for colors, spacing, and typography
2. **Prefer semantic tokens over primitives** when available
3. **Use consistent spacing** from the spacing scale
4. **Regenerate CSS** after token changes (`npx panda codegen`)
5. **Use TypeScript** for type safety with tokens
6. **Group related styles** using the `css` function
7. **Use responsive variants** when needed

### ❌ Don't

1. **Don't use hardcoded values** - always use tokens
2. **Don't use primitives directly** - prefer semantic tokens
3. **Don't skip regeneration** - always run `panda codegen` after token changes
4. **Don't mix token systems** - stick to Panda CSS tokens
5. **Don't create custom values** - use the design system tokens

---

## TypeScript Support

Panda CSS generates TypeScript types automatically. Import types from the styled-system:

```tsx
import type { SystemStyleObject } from '../styled-system/types';
```

Type-safe token usage:

```tsx
const styles: SystemStyleObject = {
  color: 'content-passive-neutral-default', // ✅ Type-safe
  backgroundColor: 'brand.700',              // ✅ Type-safe
  padding: 'spacing-4',                      // ✅ Type-safe
};
```

---

## Responsive Design

Panda CSS supports responsive breakpoints:

```tsx
css({
  padding: 'spacing-4',
  md: {
    padding: 'spacing-6',
  },
  lg: {
    padding: 'spacing-8',
  },
});
```

---

## Dark Mode / Theming

The design system supports multiple themes (Reservio/Survio). Theme switching is handled at the application level using data attributes:

```tsx
// In your app root
<html data-theme="reservio">
  {/* or */}
<html data-theme="survio">
```

Panda CSS will automatically apply theme-specific tokens when configured.

---

## Troubleshooting

### "Token not found" Error

1. **Regenerate CSS**: Run `npx panda codegen`
2. **Check token name**: Verify the token exists in `tokens/primitives.json` or `tokens/semanticTokens.json`
3. **Check syntax**: Use dot notation for nested tokens (e.g., `brand.700`)

### TypeScript Errors

1. **Regenerate types**: Run `npx panda codegen`
2. **Restart TypeScript server**: In VS Code, restart the TS server
3. **Check imports**: Ensure you're importing from the correct path

### Styles Not Applying

1. **Import CSS**: Make sure you've imported the generated CSS file
2. **Check class names**: Verify class names are being applied correctly
3. **Check specificity**: Ensure styles aren't being overridden

### Token Values Not Updating

1. **Regenerate CSS**: Always run `npx panda codegen` after token changes
2. **Clear cache**: Clear your build cache and restart dev server
3. **Check token file**: Verify changes were saved to token files

---

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "panda:codegen": "panda codegen",
    "panda:watch": "panda codegen --watch",
    "dev": "panda codegen && vite dev",
    "build": "panda codegen && vite build"
  }
}
```

---

## Resources

- [Panda CSS Documentation](https://panda-css.com/)
- [Token Reference](./TOKENS.md)
- [Designer Guide](./DESIGNER_GUIDE.md)

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
