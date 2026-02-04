---
name: token-references
description: Rules for token references, collection names, and value resolution. How tokens reference each other across primitives, semantic, and component layers.
user-invocable: false
---

# Token References and Value Resolution

## Reference Syntax

Tokens reference other tokens using the `{token.path}` syntax:

```json
{ "$value": "{yellow.100}" }
```

## Collection Names

The `$collectionName` property indicates where to resolve the reference:

- **Primitives**: `"$collectionName": "primitives"` - e.g. `{yellow.100}`, `{spacing-1}`
- **Semantic Tokens**: `"$collectionName": "semanticTokens"` - e.g. `{content-passive-neutral-default}`, `{radius.sm}`
- **Direct Values**: `"$collectionName": ""` - no reference, raw value

## Reference Rules

### Component Token Rules

1. Component tokens **MUST** reference semantic tokens (except `universal.transparent`)
2. **Never** reference primitives directly from component tokens
3. Use semantic token paths for all component token values

### Semantic Token Rules

1. Semantic tokens **MUST** reference primitives
2. Use **flattened** primitive paths (e.g., `{spacing-1}`, not `{spacing.1}`)
3. Use **nested** semantic paths when referencing other semantic tokens (e.g., `{radius.sm}`)

### Path Format

- **Primitives**: Flattened (`{spacing-1}`, `{border-width-1}`, `{duration-fast}`)
- **Semantic tokens**: Nested (`{radius.sm}`, `{gap.xs}`, `{icon.sm}`, `{padding.s}`)
- **Color semantic tokens**: Flat (`{content-passive-neutral-default}`, `{background-active-accent-hover}`)

### Exception: Universal Transparent

The only exception where component tokens can reference primitives directly:

```json
{ "$type": "color", "$collectionName": "primitives", "$value": "{universal.transparent}" }
```

## Opacity Value Handling

- **Primitives**: Decimal values (0-1), e.g., `0.75`
- **Semantic tokens**: Percentage values (0-100) for Figma compatibility, e.g., `75`
- Semantic opacity tokens use empty `$collectionName` because they calculate values

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

## Common Mistakes

- Component token referencing primitive -> Should reference semantic token
- Using `{spacing.1}` -> Should be `{spacing-1}` (flattened)
- Using `{radius-sm}` -> Should be `{radius.sm}` (nested)
- Hardcoded hex color in component token -> Should be `var(--token-semantic-*)`
- Hardcoded px value in component token -> Should be `var(--token-semantic-*)`
- Unresolved `{...}` reference in CSS -> Build failure, must resolve to `var()`

## Reference Validation

When adding or modifying tokens:
1. Verify reference exists in the target collection
2. Check `$collectionName` matches the collection containing the referenced token
3. Use correct path format (flattened for primitives, nested for semantic tokens)
4. Test resolution to ensure references resolve correctly
5. In CSS output: component tokens must use `var(--token-semantic-*)`, semantic tokens must use `var(--token-primitive-*)`
6. In `.module.css` files: always use `var(--token-component-*, <fallback>)` with the resolved primitive value as fallback
7. Never hardcode hex colors, px values, or rem values in component or semantic token CSS variables
