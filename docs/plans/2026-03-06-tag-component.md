# Tag Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a Tag component for categorization labels with semantic color variants, custom color support, and 3 sizes (24/32/40px).

**Architecture:** Display-only span element with forwardRef, CSS Modules for styling, token-driven colors via CSS custom properties. Custom color uses inline CSS variables to override token values.

**Tech Stack:** React, TypeScript, CSS Modules, design tokens (JSON → CSS variables)

---

### Task 1: Add Tag entries to shared token files

**Files:**
- Modify: `tokens/system/componentTokens/shared/radius.json`
- Modify: `tokens/system/componentTokens/shared/padding.json`
- Modify: `tokens/system/componentTokens/shared/gap.json`
- Modify: `tokens/system/componentTokens/shared/fontSize.json`
- Modify: `tokens/system/componentTokens/shared/lineHeight.json`
- Modify: `tokens/system/componentTokens/shared/height.json`
- Modify: `tokens/system/componentTokens/shared/icon.json`

**Step 1: Add tag entry to radius.json**

Add after the last component entry (follow existing pattern like chip):

```json
"tag": {
  "$scopes": ["ALL_SCOPES"],
  "$type": "borderRadius",
  "$libraryName": "",
  "$collectionName": "semanticTokens",
  "$value": "{radius.full}"
}
```

**Step 2: Add tag entries to height.json**

Heights: sm=24px (`{control.height.xxs}`), md=32px (`{control.height.xs}`), lg=40px (`{control.height.sm}`):

```json
"tag": {
  "sm": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "sizing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{control.height.xxs}",
    "$description": "Tag small height (24px)"
  },
  "md": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "sizing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{control.height.xs}",
    "$description": "Tag medium height (32px)"
  },
  "lg": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "sizing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{control.height.sm}",
    "$description": "Tag large height (40px)"
  }
}
```

**Step 3: Add tag entries to padding.json**

Add to the `x` section (follow chip pattern):

```json
"tag": {
  "sm": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "spacing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{padding.xs}",
    "$description": "Tag small horizontal padding (8px)"
  },
  "md": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "spacing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{padding.s}",
    "$description": "Tag medium horizontal padding (12px)"
  },
  "lg": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "spacing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{padding.m}",
    "$description": "Tag large horizontal padding (16px)"
  }
}
```

**Step 4: Add tag entries to gap.json**

```json
"tag": {
  "sm": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "spacing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{gap.xxs}",
    "$description": "Tag small gap between icon and text"
  },
  "md": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "spacing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{gap.xxs}",
    "$description": "Tag medium gap between icon and text"
  },
  "lg": {
    "$scopes": ["ALL_SCOPES"],
    "$type": "spacing",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{gap.xs}",
    "$description": "Tag large gap between icon and text"
  }
}
```

**Step 5: Add tag entries to fontSize.json**

```json
"tag": {
  "sm": {
    "$type": "fontSizes",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{typography.body-size.sm}",
    "$description": "Tag small font size"
  },
  "md": {
    "$type": "fontSizes",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{typography.body-size.md}",
    "$description": "Tag medium font size"
  },
  "lg": {
    "$type": "fontSizes",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{typography.body-size.md}",
    "$description": "Tag large font size"
  }
}
```

**Step 6: Add tag entries to lineHeight.json**

```json
"tag": {
  "sm": {
    "$type": "lineHeights",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{typography.body-line.sm}",
    "$description": "Tag small line height"
  },
  "md": {
    "$type": "lineHeights",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{typography.body-line.md}",
    "$description": "Tag medium line height"
  },
  "lg": {
    "$type": "lineHeights",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{typography.body-line.md}",
    "$description": "Tag large line height"
  }
}
```

**Step 7: Add tag entries to icon.json**

```json
"tag": {
  "sm": {
    "$type": "dimension",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{icon.xxs}",
    "$description": "Tag small icon size (16px)"
  },
  "md": {
    "$type": "dimension",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{icon.xs}",
    "$description": "Tag medium icon size (20px)"
  },
  "lg": {
    "$type": "dimension",
    "$libraryName": "",
    "$collectionName": "semanticTokens",
    "$value": "{icon.xs}",
    "$description": "Tag large icon size (20px)"
  }
}
```

**Step 8: Build tokens and CSS variables**

Run: `pnpm run build:tokens && pnpm run build:css-variables`
Expected: Success, tokens merged to output/ and CSS variables generated.

**Step 9: Commit**

```bash
git add tokens/system/componentTokens/shared/radius.json tokens/system/componentTokens/shared/padding.json tokens/system/componentTokens/shared/gap.json tokens/system/componentTokens/shared/fontSize.json tokens/system/componentTokens/shared/lineHeight.json tokens/system/componentTokens/shared/height.json tokens/system/componentTokens/shared/icon.json
git commit -m "feat(tokens): add shared tokens for Tag component"
```

---

### Task 2: Create Tag component token file

**Files:**
- Create: `tokens/system/componentTokens/components/tag.json`

**Step 1: Create tag.json with all variant colors**

Semantic color mapping:
- neutral: bg=`{background.passive.neutral.subtle}`, fg=`{content.passive.neutral.default}`, border=`{border.passive.neutral.default}`
- success: bg=`{background.passive.success.subtle}`, fg=`{content.passive.success}`, border=`{background.passive.success.default}`
- warning: bg=`{background.passive.warning.subtle}`, fg=`{content.passive.warning}`, border=`{background.passive.warning.default}`
- error: bg=`{background.passive.danger.subtle}`, fg=`{content.passive.danger}`, border=`{background.passive.danger.default}`
- info: bg=`{background.passive.info.subtle}`, fg=`{content.passive.info}`, border=`{background.passive.info.default}`

```json
{
  "$name": "Component Tokens",
  "tag": {
    "neutral": {
      "background": {
        "$scopes": ["ALL_FILLS"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.neutral.subtle}",
        "$description": "Neutral tag background color"
      },
      "foreground": {
        "$scopes": ["TEXT_FILL", "SHAPE_FILL"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{content.passive.neutral.default}",
        "$description": "Neutral tag text and icon color"
      },
      "border": {
        "$scopes": ["STROKE_COLOR"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{border.passive.neutral.default}",
        "$description": "Neutral tag border color"
      }
    },
    "success": {
      "background": {
        "$scopes": ["ALL_FILLS"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.success.subtle}",
        "$description": "Success tag background color"
      },
      "foreground": {
        "$scopes": ["TEXT_FILL", "SHAPE_FILL"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{content.passive.success}",
        "$description": "Success tag text and icon color"
      },
      "border": {
        "$scopes": ["STROKE_COLOR"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.success.default}",
        "$description": "Success tag border color"
      }
    },
    "warning": {
      "background": {
        "$scopes": ["ALL_FILLS"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.warning.subtle}",
        "$description": "Warning tag background color"
      },
      "foreground": {
        "$scopes": ["TEXT_FILL", "SHAPE_FILL"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{content.passive.warning}",
        "$description": "Warning tag text and icon color"
      },
      "border": {
        "$scopes": ["STROKE_COLOR"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.warning.default}",
        "$description": "Warning tag border color"
      }
    },
    "error": {
      "background": {
        "$scopes": ["ALL_FILLS"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.danger.subtle}",
        "$description": "Error tag background color"
      },
      "foreground": {
        "$scopes": ["TEXT_FILL", "SHAPE_FILL"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{content.passive.danger}",
        "$description": "Error tag text and icon color"
      },
      "border": {
        "$scopes": ["STROKE_COLOR"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.danger.default}",
        "$description": "Error tag border color"
      }
    },
    "info": {
      "background": {
        "$scopes": ["ALL_FILLS"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.info.subtle}",
        "$description": "Info tag background color"
      },
      "foreground": {
        "$scopes": ["TEXT_FILL", "SHAPE_FILL"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{content.passive.info}",
        "$description": "Info tag text and icon color"
      },
      "border": {
        "$scopes": ["STROKE_COLOR"],
        "$type": "color",
        "$libraryName": "",
        "$collectionName": "semanticTokens",
        "$value": "{background.passive.info.default}",
        "$description": "Info tag border color"
      }
    }
  }
}
```

**Step 2: Build tokens**

Run: `pnpm run build:tokens && pnpm run build:css-variables`
Expected: Success

**Step 3: Commit**

```bash
git add tokens/system/componentTokens/components/tag.json
git commit -m "feat(tokens): add component color tokens for Tag"
```

---

### Task 3: Create Tag types

**Files:**
- Create: `components/Tag/types.ts`

**Step 1: Write types**

```typescript
import { type HTMLAttributes, type ReactNode } from 'react';

export type TagVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export type TagSize = 'sm' | 'md' | 'lg';

export interface IProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color variant */
  variant?: TagVariant;
  /** Custom color (hex/rgb). Overrides variant. Auto-generates background and border. */
  color?: string;
  /** Tag size */
  size?: TagSize;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Label content */
  children?: ReactNode;
}
```

**Step 2: Commit**

```bash
git add components/Tag/types.ts
git commit -m "feat(Tag): add TypeScript types"
```

---

### Task 4: Create Tag CSS Module

**Files:**
- Create: `components/Tag/Tag.module.css`

**Step 1: Write styles**

Uses CSS custom properties (CSS variables) set by the component via `--tag-bg`, `--tag-fg`, `--tag-border` for custom color support. Token-based variants set these via the variant class.

```css
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
  border-style: solid;
  border-width: var(--token-semantic-border-width-thin);
  border-radius: var(--token-component-radius-tag);
  background-color: var(--tag-bg);
  color: var(--tag-fg);
  border-color: var(--tag-border);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Sizes */
.sm {
  height: var(--token-component-height-tag-sm);
  padding-left: var(--token-component-padding-x-tag-sm);
  padding-right: var(--token-component-padding-x-tag-sm);
  gap: var(--token-component-gap-tag-sm);
  font-size: var(--token-component-font-size-tag-sm);
  line-height: var(--token-component-line-height-tag-sm);
}

.md {
  height: var(--token-component-height-tag-md);
  padding-left: var(--token-component-padding-x-tag-md);
  padding-right: var(--token-component-padding-x-tag-md);
  gap: var(--token-component-gap-tag-md);
  font-size: var(--token-component-font-size-tag-md);
  line-height: var(--token-component-line-height-tag-md);
}

.lg {
  height: var(--token-component-height-tag-lg);
  padding-left: var(--token-component-padding-x-tag-lg);
  padding-right: var(--token-component-padding-x-tag-lg);
  gap: var(--token-component-gap-tag-lg);
  font-size: var(--token-component-font-size-tag-lg);
  line-height: var(--token-component-line-height-tag-lg);
}

/* Variant colors */
.neutral {
  --tag-bg: var(--token-component-tag-neutral-background);
  --tag-fg: var(--token-component-tag-neutral-foreground);
  --tag-border: var(--token-component-tag-neutral-border);
}

.success {
  --tag-bg: var(--token-component-tag-success-background);
  --tag-fg: var(--token-component-tag-success-foreground);
  --tag-border: var(--token-component-tag-success-border);
}

.warning {
  --tag-bg: var(--token-component-tag-warning-background);
  --tag-fg: var(--token-component-tag-warning-foreground);
  --tag-border: var(--token-component-tag-warning-border);
}

.error {
  --tag-bg: var(--token-component-tag-error-background);
  --tag-fg: var(--token-component-tag-error-foreground);
  --tag-border: var(--token-component-tag-error-border);
}

.info {
  --tag-bg: var(--token-component-tag-info-background);
  --tag-fg: var(--token-component-tag-info-foreground);
  --tag-border: var(--token-component-tag-info-border);
}

/* Icon */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
}

.sm .icon {
  width: var(--token-component-icon-tag-sm);
  height: var(--token-component-icon-tag-sm);
}

.md .icon {
  width: var(--token-component-icon-tag-md);
  height: var(--token-component-icon-tag-md);
}

.lg .icon {
  width: var(--token-component-icon-tag-lg);
  height: var(--token-component-icon-tag-lg);
}
```

**Step 2: Commit**

```bash
git add components/Tag/Tag.module.css
git commit -m "feat(Tag): add CSS Module styles"
```

---

### Task 5: Create Tag component

**Files:**
- Create: `components/Tag/Tag.tsx`

**Step 1: Write component**

```tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './Tag.module.css';
import type { IProps } from './types';

const sizeMap = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;

const variantMap = {
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
} as const;

const Tag = forwardRef<HTMLSpanElement, IProps>(
  function Tag(
    { variant = 'neutral', color, size = 'md', icon, children, className, style, ...props },
    ref
  ) {
    const customColorStyle = color
      ? {
          ...style,
          '--tag-bg': `color-mix(in srgb, ${color} 15%, transparent)`,
          '--tag-fg': color,
          '--tag-border': `color-mix(in srgb, ${color} 30%, transparent)`,
        } as React.CSSProperties
      : style;

    return (
      <span
        ref={ref}
        className={cn(
          styles.tag,
          sizeMap[size],
          !color && variantMap[variant],
          className
        )}
        style={customColorStyle}
        {...props}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </span>
    );
  }
);

export default Tag;
```

**Step 2: Commit**

```bash
git add components/Tag/Tag.tsx
git commit -m "feat(Tag): add main component with forwardRef"
```

---

### Task 6: Create Tag index and verify build

**Files:**
- Create: `components/Tag/index.ts`

**Step 1: Write index**

```typescript
export { default as Tag } from './Tag';
export type { IProps as TagProps, TagVariant, TagSize } from './types';
```

**Step 2: Run type check**

Run: `pnpm run type-check`
Expected: No errors related to Tag component.

**Step 3: Commit**

```bash
git add components/Tag/index.ts
git commit -m "feat(Tag): add exports"
```

---

### Task 7: Build tokens and validate

**Step 1: Build all tokens**

Run: `pnpm run build:tokens && pnpm run build:css-variables`
Expected: Success

**Step 2: Validate token usage**

Run: `pnpm run validate:tokens`
Expected: No errors for Tag token references.

**Step 3: Commit generated output if changed**

```bash
git add tokens/output/ styles/tokens.css
git commit -m "chore: regenerate token output for Tag component"
```
