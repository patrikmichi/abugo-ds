# Storybook Integration Guide

This guide explains how to use design tokens in Storybook.

## Installation

### Install Storybook Design Tokens Addon

```bash
npm install --save-dev @storybook/addon-designs
```

Or use your preferred token integration method.

## Loading Tokens

### Method 1: Direct Import

```javascript
// .storybook/preview.js
import primitives from '../tokens/primitives.json';
import semanticTokens from '../tokens/semanticTokens.json';
import componentTokens from '../tokens/componentTokens.json';

export const parameters = {
  designToken: {
    primitives,
    semanticTokens,
    componentTokens,
  },
};
```

### Method 2: Token Resolver

```javascript
// .storybook/tokenResolver.js
import primitives from '../tokens/primitives.json';
import semanticTokens from '../tokens/semanticTokens.json';

export function resolveToken(path) {
  const parts = path.replace(/^\{|\}$/g, '').split('.');
  
  // Try semantic tokens first
  let current = semanticTokens;
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      // Try primitives
      current = primitives;
      for (const part of parts) {
        if (current && current[part]) {
          current = current[part];
        } else {
          return null;
        }
      }
      break;
    }
  }
  
  return current?.$value || current;
}
```

## Using Tokens in Stories

### Basic Usage

```javascript
// Button.stories.js
import { resolveToken } from '../.storybook/tokenResolver';

export const Primary = {
  args: {
    backgroundColor: resolveToken('{background-active-accent-default}'),
    color: resolveToken('{content-passive-on-accent}'),
    borderRadius: resolveToken('{radius.sm}'),
    padding: resolveToken('{padding.s}'),
  },
};
```

### Component Token Usage

```javascript
// Button.stories.js
import componentTokens from '../tokens/componentTokens.json';

export const Primary = {
  args: {
    backgroundColor: componentTokens.button.primary.boxed.background.default.$value,
    color: componentTokens.button.primary.boxed.content.default.$value,
    borderRadius: componentTokens.button.radius.sm.$value,
    padding: `${componentTokens.button.padding.y.md.$value} ${componentTokens.button.padding.x.md.$value}`,
  },
};
```

### Typography Tokens

```javascript
// Typography.stories.js
import semanticTokens from '../tokens/semanticTokens.json';

export const Headline = {
  args: {
    fontSize: semanticTokens.typography.headlineSize.h1.$value,
    lineHeight: semanticTokens.typography.headlineLine.h1.$value,
    fontWeight: semanticTokens.typography.bodyWeight.bold.$value,
  },
};
```

## Creating Token Utilities

### Token Helper Functions

```javascript
// utils/tokens.js
import primitives from '../tokens/primitives.json';
import semanticTokens from '../tokens/semanticTokens.json';
import componentTokens from '../tokens/componentTokens.json';

export function getToken(path) {
  const cleanPath = path.replace(/^\{|\}$/g, '');
  const parts = cleanPath.split('.');
  
  // Try component tokens first
  let current = componentTokens;
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      break;
    }
  }
  if (current?.$value !== undefined) {
    return current.$value;
  }
  
  // Try semantic tokens
  current = semanticTokens;
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      break;
    }
  }
  if (current?.$value !== undefined) {
    return current.$value;
  }
  
  // Try primitives
  current = primitives;
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return current?.$value || null;
}

export const tokens = {
  color: {
    primary: getToken('{background-active-accent-default}'),
    secondary: getToken('{background-active-neutral-default}'),
    success: getToken('{background-passive-success-default}'),
    danger: getToken('{background-passive-danger-default}'),
  },
  spacing: {
    xs: getToken('{spacing-1}'),
    sm: getToken('{spacing-2}'),
    md: getToken('{spacing-4}'),
    lg: getToken('{spacing-6}'),
    xl: getToken('{spacing-8}'),
  },
  radius: {
    none: getToken('{radius-0}'),
    sm: getToken('{radius.sm}'),
    md: getToken('{radius.md}'),
    lg: getToken('{radius.lg}'),
  },
};
```

## Storybook Addon Configuration

### Design Tokens Addon

```javascript
// .storybook/main.js
export default {
  addons: [
    '@storybook/addon-designs',
    // ... other addons
  ],
};
```

### Custom Token Panel

```javascript
// .storybook/addons.js
import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    // Use tokens for theme colors
    colorPrimary: getToken('{brand.500}'),
    colorSecondary: getToken('{brand.700}'),
  }),
});
```

## CSS Custom Properties

### Generate CSS Variables

```javascript
// .storybook/preview-head.html
<script>
  // Inject CSS custom properties from tokens
  const tokens = {
    '--color-primary': getToken('{background-active-accent-default}'),
    '--spacing-md': getToken('{spacing-4}'),
    '--radius-sm': getToken('{radius.sm}'),
    // ... more tokens
  };
  
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
</script>
```

## TypeScript Support

### Token Types

```typescript
// types/tokens.ts
export interface Token {
  $type: string;
  $value: string | number;
  $description?: string;
  $scopes?: string[];
}

export interface TokenCollection {
  [key: string]: Token | TokenCollection;
}

export type Primitives = typeof import('../tokens/primitives.json');
export type SemanticTokens = typeof import('../tokens/semanticTokens.json');
export type ComponentTokens = typeof import('../tokens/componentTokens.json');
```

## Examples

### Button Story with Tokens

```javascript
// Button.stories.js
import { tokens } from '../utils/tokens';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = {
  args: {
    backgroundColor: tokens.color.primary,
    color: getToken('{content-passive-on-accent}'),
    borderRadius: tokens.radius.sm,
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
  },
};
```

### Theme Switcher

```javascript
// .storybook/preview.js
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme',
    defaultValue: 'Reservio',
    toolbar: {
      icon: 'paintbrush',
      items: ['Reservio', 'Survio'],
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme;
    // Apply theme-specific tokens
    return Story();
  },
];
```

## Links

- [Storybook Documentation](https://storybook.js.org/docs)
- [Token Documentation](./TOKENS.md)
- [Figma Integration](./FIGMA_INTEGRATION.md)
