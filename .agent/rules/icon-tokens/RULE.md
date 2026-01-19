---
description: "Icon token structure and patterns for consistent icon token organization"
alwaysApply: false
globs:
  - "tokens/componentTokens.json"
---

# Icon Token Structure

This rule defines the consistent structure for icon tokens across all components.

## Icon Token Patterns

Icon tokens follow a **consistent structure** to ensure discoverability and maintainability:

### 1. Icon Sizes (Top-Level)

Icon size tokens are **grouped at the root level** under `icon.{component}.{size}` for easy discovery:

```json
{
  "icon": {
    "button": {
      "sm": {
        "$type": "dimension",
        "$collectionName": "semanticTokens",
        "$value": "{icon.sm}"
      },
      "md": { ... },
      "lg": { ... }
    },
    "field": {
      "sm": { ... },
      "lg": { ... }
    },
    "checkbox": {
      "default": { ... }
    },
    "chip": {
      "sm": { ... },
      "md": { ... },
      "lg": { ... }
    }
  }
}
```

**Why top-level?** Icon sizes are dimension-type tokens that are frequently referenced across components. Grouping them at the root level makes them easy to find and reduces nesting.

### 2. Icon Gaps (Component-Level)

Icon gap tokens are **component-specific** under `{component}.gap.icon`:

```json
{
  "button": {
    "gap": {
      "icon": {
        "sm": {
          "$type": "spacing",
          "$collectionName": "semanticTokens",
          "$value": "{gap.xs}"
        },
        "md": { ... },
        "lg": { ... }
      }
    }
  },
  "chip": {
    "gap": {
      "icon": {
        "sm": { ... },
        "md": { ... },
        "lg": { ... }
      }
    }
  },
  "alert": {
    "gap": {
      "icon": {
        "$type": "spacing",
        "$collectionName": "semanticTokens",
        "$value": "{gap.xxs}"
      }
    }
  }
}
```

**Why component-level?** Icon gaps are spacing values specific to each component's layout needs.

### 3. Icon Colors (Component-Level)

Icon color tokens are **component-specific** under `{component}.icon` or `{component}.{variant}.icon`:

```json
{
  "alert": {
    "icon": {
      "default": {
        "$type": "color",
        "$collectionName": "semanticTokens",
        "$value": "{content-passive-info}"
      }
    },
    "danger": {
      "icon": {
        "default": {
          "$type": "color",
          "$collectionName": "semanticTokens",
          "$value": "{content-passive-danger}"
        }
      }
    }
  },
  "toast": {
    "icon": {
      "default": { ... },
      "danger": {
        "icon": {
          "default": { ... }
        }
      }
    }
  }
}
```

**Why component-level?** Icon colors are contextual to the component and its variants, so they belong with the component.

### 4. Icon Padding (Component-Level)

Icon padding tokens are **component-specific** under `{component}.icon.only.padding`:

```json
{
  "button": {
    "icon": {
      "only": {
        "padding": {
          "x": {
            "sm": {
              "$type": "spacing",
              "$collectionName": "semanticTokens",
              "$value": "{padding.xxxs}"
            },
            "md": { ... },
            "lg": { ... }
          },
          "y": {
            "sm": { ... },
            "md": { ... },
            "lg": { ... }
          }
        }
      }
    }
  }
}
```

**Why component-level?** Icon padding is specific to icon-only button variants and belongs with the button component.

## Structure Summary

| Token Type | Location | Pattern | Example |
|------------|----------|---------|---------|
| Icon Sizes | Top-level | `icon.{component}.{size}` | `icon.button.sm` |
| Icon Gaps | Component-level | `{component}.gap.icon` | `button.gap.icon.sm` |
| Icon Colors | Component-level | `{component}.icon` or `{component}.{variant}.icon` | `alert.icon.default` |
| Icon Padding | Component-level | `{component}.icon.only.padding` | `button.icon.only.padding.x.sm` |

## Rules

1. **Icon sizes MUST be at root level** under `icon.{component}.{size}`
2. **Icon gaps MUST be component-specific** under `{component}.gap.icon`
3. **Icon colors MUST be component-specific** under `{component}.icon` or `{component}.{variant}.icon`
4. **Icon padding MUST be component-specific** under `{component}.icon.only.padding`
5. **Never mix patterns** - keep the structure consistent across all components
6. **Always reference semantic tokens** - icon tokens should reference semantic tokens, not primitives directly

## When Adding New Icon Tokens

1. **Icon Size**: Add to `icon.{component}.{size}` at root level
2. **Icon Gap**: Add to `{component}.gap.icon` within the component
3. **Icon Color**: Add to `{component}.icon` or `{component}.{variant}.icon` within the component
4. **Icon Padding**: Add to `{component}.icon.only.padding` within the component

## Examples

### Adding Icon Size for New Component

```json
{
  "icon": {
    "button": { ... },
    "new-component": {
      "sm": {
        "$type": "dimension",
        "$collectionName": "semanticTokens",
        "$value": "{icon.sm}"
      }
    }
  }
}
```

### Adding Icon Color for Component Variant

```json
{
  "alert": {
    "icon": { ... },
    "new-variant": {
      "icon": {
        "default": {
          "$type": "color",
          "$collectionName": "semanticTokens",
          "$value": "{content-passive-info}"
        }
      }
    }
  }
}
```

## Benefits of This Structure

1. **Discoverability**: Icon sizes are easy to find at root level
2. **Consistency**: Same pattern across all components
3. **Maintainability**: Clear organization makes updates easier
4. **Categorization**: Proper `$type` values ensure correct grouping in Tokens Studio
5. **Context**: Component-specific properties stay with their components
