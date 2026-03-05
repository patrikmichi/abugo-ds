---
name: refactor
description: Refactor components to follow project conventions. Fixes structure, imports, i18n, and cleans up deprecated files.
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git *), Bash(pnpm *), Bash(rm *), Bash(mv *)
---

# Refactor

Scan and fix components to ensure they follow project conventions. This skill actively modifies code.

## Usage

- `/refactor` — refactor all uncommitted changes
- `/refactor <path>` — refactor specific file or folder
- `/refactor --cleanup` — find and remove deprecated/migrated files

## Core Principles

1. **Lightweight Code** — Minimal JS, no over-engineering. Delete unused code completely.
2. **CSS-First Positioning** — No `getBoundingClientRect()`, no scroll listeners, no JS calculations. Use CSS placement classes.
3. **Clean Syntax** — Arrow functions, proper destructuring, early returns.
4. **Standardized Props** — Always use `IProps` interface in `types.ts`.
5. **Unified Patterns** — Consistent structure across all components.
6. **Small Components** — Max ~150 lines. Split large components.

## Process

1. **Find Targets**: Use `git diff --name-only` or a provided path.
2. **Read Reference Skills**:
   - **frontend-expert** — Component structure, React patterns, imports.
   - **css-positioning** — CSS-first positioning, no DOM manipulations.
   - **component-tokens** — Property-first paths, CSS Modules.
   - **text-optical-alignment** — Padding compensation patterns.

3. **Refactoring Checklist**:

### Structure
- [ ] Folder contains: `index.tsx`, `types.ts`, `styles.module.css`
- [ ] Optional in folder: `const.ts`, `hooks.ts` (component-specific)
- [ ] Use absolute imports (`@components/`, `@hooks/`, etc.)
- [ ] Default export: `export default ComponentName`
- [ ] Only move to `@hooks/` or `@utils/` if **shared across multiple components**

### Props (Standardized)
- [ ] Define `IProps` interface in `types.ts`
- [ ] Destructure props in function signature
- [ ] No inline prop types in component files

### CSS-First Positioning
- [ ] **Remove** `getBoundingClientRect()` — use CSS `position: absolute`
- [ ] **Remove** scroll/resize listeners for positioning — use CSS placement classes
- [ ] **Remove** `requestAnimationFrame` for position updates
- [ ] **Remove** refs used only for measuring elements
- [ ] Use CSS classes for placement: `.bottomLeft`, `.topRight`, etc.

### Lightweight Code
- [ ] Delete unused variables, imports, dead code
- [ ] No backwards-compatibility hacks (no `_unused` vars, no `// removed` comments)
- [ ] Extract complex conditions into descriptive booleans
- [ ] No nested ternaries — use early returns
- [ ] `useMemo` only for expensive computations

### Component Size Limits
- [ ] **Max ~150-200 lines** per component file — split if larger
- [ ] Extract sub-components into separate files within the folder
- [ ] Keep `hooks.ts`, `types.ts`, `const.ts` in component folder
- [ ] Only move to `@hooks/` or `@utils/` if shared across multiple components
- [ ] One responsibility per component — if it does too much, split it

### Event Handling (Allowed JS)
- [ ] Click outside detection (mousedown listener)
- [ ] Escape key handling (keydown listener)
- [ ] Focus management (for a11y)

### i18n & Error Handling
- [ ] All strings via `formatMessage` with `defaultMessage` + kebab-case `id`
- [ ] Use `useToast` for user feedback

4. **Verify**: `pnpm run type-check && pnpm run lint`

## CSS Placement Pattern

Replace JS positioning with CSS classes:

```css
.panel { position: absolute; z-index: 1050; }
.bottomLeft { top: calc(100% + 4px); left: 0; }
.bottomRight { top: calc(100% + 4px); right: 0; }
.topLeft { bottom: calc(100% + 4px); left: 0; }
.bottomCenter { top: calc(100% + 4px); left: 50%; transform: translateX(-50%); }
```

```typescript
<div className={cx(styles.panel, styles[placement])} />
```

## Cleanup (`/refactor --cleanup`)

Find and remove deprecated files (`styles.ts`, unused hooks, dead code). Verify no imports remain before deleting.
