---
name: token-structure
description: Design token architecture, naming, and reference rules. Three-layer architecture (primitives, semantic, component).
user-invocable: false
---

# Design Token Architecture

**Related skills:**
- **component-tokens** — property-first paths and shared vs component-only rules
- **icon-tokens** — icon-specific naming patterns

## Three-Layer System
1. **Primitives**: Raw hex/spacing values. `tokens/system/primitives/**`.
2. **Semantic Tokens**: Contextual meaning. `tokens/system/semanticTokens/**`.
3. **Component Tokens**: Component-specific values. `tokens/system/componentTokens/**`.

## Layering & Reference Rules
- **References**: Use `{token.path}` syntax.
- **Hierarchy**: Component -> Semantic -> Primitive. (Component tokens should never reference primitives directly, except for `universal.transparent`).
- **Collection Name**: Use `$collectionName` ("primitives" or "semanticTokens") to indicate the source of the reference.

## CSS Generation (pnpm)
- `pnpm build:tokens` — Merges all source files into unified JSON outputs in `tokens/output/`.
- `pnpm build:css-variables` — Generates `styles/tokens.css` with tiered variables:
  - `--token-primitive-*`
  - `--token-semantic-*` -> references primitive variable.
  - `--token-component-*` -> references semantic variable.

## File Organization
- `tokens/system/primitives/**` - Source primitives.
- `tokens/system/semanticTokens/**` - Source semantic tokens.
- `tokens/system/componentTokens/shared/**` - Shared component properties (property-first paths).
- `tokens/system/componentTokens/components/**` - Component-specific tokens.

## Rules
- All design tokens must be in **kebab-case** (except typography properties which use **camelCase** for W3C compliance).
- Every user-facing CSS selection must use a token; no hardcoded values in `*.module.css` files.
