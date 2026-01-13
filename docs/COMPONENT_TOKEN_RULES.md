# Component Token Rules

> **Hybrid Approach**: Component tokens use a hybrid structure that combines category-first organization for shared properties and component-first organization for unique properties.

---

## Overview

Component tokens follow a **hybrid approach** that optimizes for both maintainability and discoverability:

- **Category-First** for properties shared across multiple components (e.g., `radius`, `padding`, `gap`)
- **Component-First** for properties unique to specific components (e.g., colors, heights, widths)

---

## Rules

### 1. Category-First Properties (Shared)

These properties are organized **category-first** because they're used across multiple components:

| Property | Pattern | Example |
|----------|---------|---------|
| `radius` | `radius.{component}.{size}` | `radius.button.sm`, `radius.field.md` |
| `gap` | `gap.{component}.{size}` | `gap.button.sm`, `gap.chip.xs` |
| `padding` | `padding.{component}.{size}` | `padding.button.sm`, `padding.alert.lg` |
| `shadow` | `shadow.{component}` | `shadow.card`, `shadow.modal` |
| `fontSize` | `fontSize.{component}.{size}` | `fontSize.button.sm`, `fontSize.field.md` |
| `lineHeight` | `lineHeight.{component}.{size}` | `lineHeight.button.sm`, `lineHeight.field.md` |
| `animation` | `animation.{component}.{property}` | `animation.field.duration`, `animation.accordion.easing` |
| `borderWidth` | `borderWidth.{component}` | `borderWidth.input`, `borderWidth.card` |
| `zIndex` | `zIndex.{component}` | `zIndex.modal`, `zIndex.tooltip` |
| `icon` | `icon.{component}.{size}` | `icon.button.sm`, `icon.field.sm` |

**Criteria for Category-First:**
- Used by **3+ components**
- Represents a **shared design pattern**
- Benefits from **cross-component consistency**

**Benefits:**
- Easy to find all radius values across components
- Consistent sizing patterns visible at a glance
- Changes to shared properties affect all components automatically

**File Location:** `tokens/componentTokens/shared/{property}.json`

---

### 2. Component-First Properties (Unique)

These properties are organized **component-first** because they're unique to specific components:

| Property | Pattern | Example |
|----------|---------|---------|
| Colors | `{component}.{variant}.{property}.{state}` | `button.primary.background.default` |
| Height | `{component}.height.{size}` | `field.height.sm`, `field.height.md` |
| Width | `{component}.width.{value}` | `field.width.full`, `field.width.auto` |
| Opacity | `{component}.opacity.{state}` | `loading.opacity.default` |

**Criteria for Component-First:**
- Used by **1-2 components** only
- Represents **component-specific design decisions**
- Benefits from **component encapsulation**

**Benefits:**
- Component-specific properties grouped together
- Colors and unique states easy to find per component
- Better encapsulation of component-specific design decisions

**File Location:** `tokens/componentTokens/components/{component}.json`

---

## Decision Tree

Use this decision tree to determine where a new component token should go:

```
Is the property used by 3+ components?
├─ YES → Category-First (shared/{property}.json)
│   └─ Examples: radius, gap, padding, shadow, fontSize, lineHeight
│
└─ NO → Component-First (components/{component}.json)
    └─ Examples: colors, height, width, opacity
```

---

## Examples

### Category-First Example

```json
// tokens/componentTokens/shared/radius.json
{
  "$name": "Component Tokens",
  "button": {
    "sm": {
      "$type": "borderRadius",
      "$value": "{radius.xs}"
    },
    "md": {
      "$type": "borderRadius",
      "$value": "{radius.sm}"
    }
  },
  "field": {
    "sm": {
      "$type": "borderRadius",
      "$value": "{radius.sm}"
    },
    "md": {
      "$type": "borderRadius",
      "$value": "{radius.md}"
    }
  }
}
```

**Usage:** `radius.button.sm`, `radius.field.md`

---

### Component-First Example

```json
// tokens/componentTokens/components/button.json
{
  "$name": "Component Tokens",
  "primary": {
    "boxed": {
      "background": {
        "default": {
          "$type": "color",
          "$value": "{background-active-accent-default}"
        },
        "hover": {
          "$type": "color",
          "$value": "{background-active-accent-hover}"
        }
      }
    }
  }
}
```

**Usage:** `button.primary.boxed.background.default`

---

## Reference Rules

### ✅ DO

- **Reference semantic tokens** from component tokens (except `universal.transparent`)
- Use **category-first** for properties shared across 3+ components
- Use **component-first** for unique component properties
- Keep **consistent naming** within each category
- **Document** any exceptions to these rules

### ❌ DON'T

- **Don't reference primitives directly** from component tokens
- **Don't mix** category-first and component-first for the same property
- **Don't create** component tokens for properties that should be semantic
- **Don't duplicate** tokens across shared and component files

---

## Migration Guide

If you need to move a token from component-first to category-first (or vice versa):

1. **Identify** the property usage across components
2. **Update** the appropriate file (`shared/{property}.json` or `components/{component}.json`)
3. **Update references** in all consuming components
4. **Run** `npm run build:tokens` to regenerate merged files
5. **Test** in Tokens Studio and Storybook

---

## File Structure

```
tokens/componentTokens/
├── shared/              # Category-first properties
│   ├── radius.json
│   ├── gap.json
│   ├── padding.json
│   ├── shadow.json
│   ├── fontSize.json
│   ├── lineHeight.json
│   ├── animation.json
│   ├── borderWidth.json
│   ├── zIndex.json
│   └── icon.json
└── components/          # Component-first properties
    ├── button.json
    ├── field.json
    ├── alert.json
    └── ... (one file per component)
```

---

## Best Practices

1. **Consistency**: Use the same size scale (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) across all category-first properties
2. **Semantic References**: Always reference semantic tokens, never primitives directly
3. **Documentation**: Add `$description` to explain the token's purpose and usage
4. **Metadata**: Use `$extensions` to add metadata for tooling support
5. **Testing**: Verify tokens work in both Tokens Studio and Storybook after changes

---

## Related Documentation

- [Token Structure](TOKEN_STRUCTURE.md) - Overall token organization
- [Designer Guide](DESIGNER_GUIDE.md) - How to use tokens in Figma
- [Developer Guide](DEVELOPER_GUIDE.md) - How to use tokens in code
