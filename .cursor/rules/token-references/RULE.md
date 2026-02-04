---
description: "Rules for token references, collection names, and value resolution"
alwaysApply: false
globs:
  - "tokens/**/*.json"
---

# Token References and Value Resolution

This rule defines how tokens reference each other and how values are resolved.

## Reference Syntax

Tokens reference other tokens using the `{token.path}` syntax:

```json
{
  "$value": "{yellow.100}"
}
```

## Collection Names

The `$collectionName` property indicates where to resolve the reference:

### Primitives References

When referencing primitives:

```json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{yellow.100}"
}
```

### Semantic Token References

When referencing semantic tokens:

```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{content-passive-neutral-default}"
}
```

### Direct Values

When using direct values (no reference):

```json
{
  "$type": "number",
  "$collectionName": "",
  "$value": 75
}
```

## Reference Patterns

### Primitive References

**From semantic tokens:**
```json
{
  "content-passive-neutral-default": {
    "$type": "color",
    "$collectionName": "primitives",
    "$value": "{grey.700}"
  }
}
```

**From component tokens:**
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
    }
  }
}
```

### Nested Semantic Token References

When referencing nested semantic tokens:

```json
{
  "$type": "borderRadius",
  "$collectionName": "semanticTokens",
  "$value": "{radius.sm}"
}
```

```json
{
  "$type": "spacing",
  "$collectionName": "semanticTokens",
  "$value": "{gap.xs}"
}
```

```json
{
  "$type": "dimension",
  "$collectionName": "semanticTokens",
  "$value": "{icon.sm}"
}
```

### Icon Token References

**Icon sizes (top-level):**
```json
{
  "$type": "dimension",
  "$collectionName": "semanticTokens",
  "$value": "{icon.button.sm}"
}
```

**Icon gaps (component-level):**
```json
{
  "$type": "spacing",
  "$collectionName": "semanticTokens",
  "$value": "{gap.xs}"
}
```

**Icon colors (component-level):**
```json
{
  "$type": "color",
  "$collectionName": "semanticTokens",
  "$value": "{content-passive-info}"
}
```

## Reference Rules

### Component Token Rules

1. **Component tokens MUST reference semantic tokens** (except `universal.transparent`)
2. **Never reference primitives directly** from component tokens
3. **Use semantic token paths** for all component token values

### Semantic Token Rules

1. **Semantic tokens MUST reference primitives**
2. **Use flattened primitive paths** (e.g., `{spacing-1}`, not `{spacing.1}`)
3. **Use nested semantic paths** when referencing other semantic tokens (e.g., `{radius.sm}`)

### Exception: Universal Transparent

The only exception where component tokens can reference primitives directly:

```json
{
  "$type": "color",
  "$collectionName": "primitives",
  "$value": "{universal.transparent}"
}
```

## Opacity Value Handling

### Primitives

Opacity values in primitives use decimal format (0-1):

```json
{
  "opacity-75": {
    "$type": "number",
    "$value": 0.75
  }
}
```

### Semantic Tokens

Opacity values in semantic tokens use percentage format (0-100) for Figma compatibility:

```json
{
  "opacity": {
    "overlay": {
      "$type": "number",
      "$collectionName": "",
      "$value": 75
    }
  }
}
```

**Note**: Semantic opacity tokens use empty `$collectionName` because they calculate values (primitive * 100) rather than directly referencing primitives.

## Animation References

Animation tokens reference flattened primitives:

```json
{
  "animation": {
    "duration": {
      "fast": {
        "$type": "number",
        "$collectionName": "primitives",
        "$value": "{duration-fast}"
      }
    },
    "easing": {
      "ease-out": {
        "$type": "string",
        "$collectionName": "",
        "$value": "{easing-ease-out}"
      }
    }
  }
}
```

**Note**: Easing tokens use empty `$collectionName` because they directly reference flattened primitive easing tokens.

## CSS Output Hierarchy (`tokens.css`)

The generated CSS output must maintain the same reference chain using `var()`:

### Layer Rules

| Layer | CSS Variable Prefix | Value Format |
|-------|-------------------|--------------|
| Primitive | `--token-primitive-*` | Hardcoded values (`1rem`, `#5690f5`, `24px`) |
| Semantic | `--token-semantic-*` | `var(--token-primitive-*)` |
| Component | `--token-component-*` | `var(--token-semantic-*)` |

### Correct Examples

```css
/* Primitives: hardcoded values */
--token-primitive-typography-font-size-3: 1rem;
--token-primitive-typography-line-height-3: 1.5rem;
--token-primitive-color-blue-500: #5690f5;

/* Semantics: reference primitives */
--token-semantic-typography-body-size-md: var(--token-primitive-typography-font-size-3);
--token-semantic-typography-body-line-md: var(--token-primitive-typography-line-height-3);
--token-semantic-background-active-accent-default: var(--token-primitive-color-blue-500);

/* Components: reference semantics */
--token-component-font-size-radio: var(--token-semantic-typography-body-size-md);
--token-component-line-height-radio: var(--token-semantic-typography-body-line-md);
--token-component-radio-border-unselected-default: var(--token-semantic-background-active-accent-default);
```

### Incorrect Examples

```css
/* ❌ Component token with hardcoded value */
--token-component-font-size-radio: 16px;
--token-component-radio-border-unselected-default: #5690f5;

/* ❌ Semantic token with hardcoded value */
--token-semantic-typography-body-size-md: 1rem;

/* ❌ Unresolved reference */
--token-component-font-size-button-sm: {typography.fontSize.2};
```

### Component CSS Files (`.module.css`)

Component styles reference component tokens with fallbacks:

```css
.radioWrapper {
  font-size: var(--token-component-font-size-radio, 16px);
  line-height: var(--token-component-line-height-radio, 24px);
}
```

The fallback value should match the final resolved primitive value, ensuring the component still renders correctly if the token variable is missing.

## Common Reference Mistakes

### ❌ Wrong: Component token referencing primitive

```json
{
  "button": {
    "primary": {
      "background": {
        "default": {
          "$value": "{brand.700}"  // ❌ Should reference semantic token
        }
      }
    }
  }
}
```

### ✅ Correct: Component token referencing semantic token

```json
{
  "button": {
    "primary": {
      "background": {
        "default": {
          "$value": "{background-active-accent-default}"  // ✅ References semantic token
        }
      }
    }
  }
}
```

### ❌ Wrong: Using old nested primitive path

```json
{
  "$value": "{spacing.1}"  // ❌ Old nested structure
}
```

### ✅ Correct: Using flattened primitive path

```json
{
  "$value": "{spacing-1}"  // ✅ Flattened structure
}
```

### ❌ Wrong: Using flat semantic path for nested token

```json
{
  "$value": "{radius-sm}"  // ❌ Should use nested path
}
```

### ✅ Correct: Using nested semantic path

```json
{
  "$value": "{radius.sm}"  // ✅ Nested structure
}
```

## Reference Validation

When adding or modifying tokens:

1. **Verify reference exists** in the target collection
2. **Check `$collectionName`** matches the collection containing the referenced token
3. **Use correct path format** (flattened for primitives, nested for semantic tokens)
4. **Test resolution** to ensure references resolve correctly
5. **Update all references** when renaming tokens

## Reference Resolution Order

1. Check `$collectionName` to determine source collection
2. Resolve path within that collection
3. If reference is to another token, recursively resolve
4. Return final resolved value

## Best Practices

1. **Always use semantic tokens** from component tokens
2. **Use flattened paths** for primitive references
3. **Use nested paths** for semantic token references
4. **Verify references exist** before committing
5. **Update all references** when renaming tokens
6. **Test resolution** in Tokens Studio
7. **Document complex references** in token descriptions
8. **In CSS output**: component tokens use `var(--token-semantic-*)`, semantic tokens use `var(--token-primitive-*)`
9. **In `.module.css` files**: always use `var(--token-component-*, <fallback>)` with the resolved primitive value as fallback
10. **Never hardcode** hex colors, px values, or rem values in component or semantic token CSS variables
