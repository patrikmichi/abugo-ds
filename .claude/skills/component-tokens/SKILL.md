---
name: component-tokens
description: Component token rules. Shared vs component files, property-first naming, no hardcoded CSS values, CSS Modules requirement.
user-invocable: false
---

# Component Token Structure Rules

**Related skills:**
- **token-structure** — architecture, three-layer system, and reference rules

## Core Principles

### 1. Mandatory CSS Modules
**Component tokens must be used within CSS Modules (`*.module.css`).**
- Use `var(--token-component-...)` for all non-zero values.
- Shared properties (font size, padding, etc.) use property-first paths.
- Component-specific properties (background, border) use component-first paths.

### 2. Property-First Paths (Shared Files)
In **shared** files, paths put the property first: `{property}.{component}.{variant}`.
CSS var: `--token-component-{kebab-path}`.

### 3. Component-Specific Files
Component files (`tokens/system/componentTokens/components/{component}.json`) only contain:
- Colors (background, content, border)
- Component-specific spacing/shadows.

### 4. No Hardcoded Values
**All CSS values must use tokens.** No hardcoded px, rem, or hex codes (except 0, 100%, 50%).

## Build and Migration
**Always use `pnpm` for token scripts.**
- `pnpm build:tokens` — Merge tokens.
- `pnpm build:css-variables` — Generate CSS variables.
