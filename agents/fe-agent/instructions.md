---
description: "Front-end agent: React, Next.js, scalable design system. Tokens, components, variable–token pairing, structure, a11y."
alwaysApply: true
globs:
  - "components/**/*.{ts,tsx,css}"
  - "app/**/*.{ts,tsx,css}"
  - "styles/**/*.css"
  - "stories/**/*.tsx"
  - "tokens/system/**/*.json"
---

# FE Agent: React, Next.js & Scalable Design System

Complete instructions for front-end development using **React**, **Next.js**, and a **token-driven, scalable design system**. Follow this when implementing or changing UI, components, or design values.

---

## 1. Stack and tooling

- **React** – latest stable. Prefer function components, hooks, and explicit prop types.
- **Next.js** – latest stable. Use App Router (`app/`) for routes; keep pages minimal and delegate to components.
- **TypeScript** – strict. Type all component props, avoid `any`.
- **Storybook** – for developing and documenting components in isolation. One `*.stories.tsx` per component.
- **CSS Modules** – `ComponentName.module.css` next to `ComponentName.tsx`. No global design values; use tokens.

See **tech-stack/RULE** for version and upgrade rules.

---

## 2. Design system principles

### 2.1 Token-driven UI

All **design-relevant values** (colors, spacing, typography, radius, shadow, etc.) come from **design tokens**, not from hardcoded literals in CSS or JS.

- **Three layers:** Primitives → Semantic → Component.  
  Component tokens must reference semantic (or `universal.transparent`); semantic must reference primitives.  
  See **token-structure** and **token-structure/component-tokens**.

### 2.2 Variable–token pairing (mandatory)

**If you add or change a CSS variable or any design value, you must add or update the matching design token.**

- **New `var(--token-*)`**  
  The `--token-*` must exist in our pipeline. Define it in:
  - `tokens/system/primitives/**` (raw scales),
  - `tokens/system/semanticTokens/**` (semantic aliases), or
  - `tokens/system/componentTokens/shared/**` or `tokens/system/componentTokens/components/**` (component tokens).

- **New design value** (e.g. `#fff`, `16px`, `8px`, `0.5rem`)  
  1. Add the token in the correct layer (see table below).  
  2. Run `npm run build:tokens` and `npm run build:css-variables`.  
  3. Use `var(--token-...)` in CSS/TSX.

- **No long-term hardcoded design values**  
  Avoid `#hex`, `rgba(...)`, `16px`, `0.5rem`, `4px`, etc. Exceptions: `0`, `100%`, `50%` for layout, `1` for line-height when appropriate.

**Where to add the token:**

| Kind of value                       | Layer            | Location |
|------------------------------------|------------------|----------|
| Raw scale (spacing, radius, hex)   | Primitive        | `tokens/system/primitives/**` |
| Semantic alias (e.g. `gap.sm`)     | Semantic         | `tokens/system/semanticTokens/**` |
| Component typography, spacing, gap, radius, height | Component shared | `tokens/system/componentTokens/shared/{fontSize,lineHeight,fontWeight,padding,gap,radius,height}.json` |
| Component colors, shadows, custom spacing | Component        | `tokens/system/componentTokens/components/{component}.json` |

Use **token-structure** and **token-structure/component-tokens** for `$type`, `$collectionName`, `$value`, `$description`, and property-first naming.

### 2.3 Token build and CSS

- **Order:** `npm run build:tokens` → `npm run build:css-variables`.
- **Output:** `styles/tokens.css` defines `--token-primitive-*`, `--token-semantic-*`, `--token-component-*`.
- **In code:** Use only `var(--token-...)`. Fallbacks are only for migration.
- **After new `--token-component-*`:** Run `node scripts/diagnose-missing-component-vars.mjs` to ensure it appears in `tokens.css`.

---

## 3. Component architecture

### 3.1 Structure

- **One component per folder:** `components/ComponentName/ComponentName.tsx`, `ComponentName.module.css`, `index.ts`.
- **Barrel:** `index.ts` re-exports the public API. Internal helpers stay in the folder or in `util.ts`.
- **Composition over configuration:** Prefer children and slots over huge prop maps. Use clear, minimal props for variants.

### 3.2 Props and variants

- **Props:** Typed with an interface. Use `size?: 'sm'|'md'|'lg'`, `variant`, `disabled`, etc. when they affect layout or tokens.
- **Variants:** Map to token paths (e.g. `--token-component-{component}-{variant}-{prop}`). Avoid one-off magic values.
- **Spreading:** Be careful with `...rest` on the root; pass only to the right DOM node. Reserve `className` for overrides.

### 3.3 Styling

- **CSS Modules only** for component styles. Import: `import styles from './ComponentName.module.css'`.
- **Class names:** kebab-case. Use `styles.root`, `styles.header`, `styles.itemActive`, etc.
- **Values:** Always `var(--token-*)`. No raw `px`, `rem`, `%` (except layout exceptions above), no raw colors.
- **Optical alignment:** For text + icons, use the **text-optical-alignment/RULE** (padding compensation, `align-self: center`, `translateY(-50%)` where needed).

---

## 4. File and folder layout

```
components/
  ComponentName/
    ComponentName.tsx
    ComponentName.module.css
    index.ts
    [util.ts, types.ts, etc. if needed]
stories/
  ComponentName.stories.tsx
app/
  layout.tsx
  page.tsx
  globals.css
styles/
  tokens.css          # generated; do not edit by hand
tokens/
  system/
    primitives/
    semanticTokens/
    componentTokens/
      shared/
      components/
  output/             # generated by build:tokens
  scripts/            # merge, generate-css-variables, load-tokens, etc.
scripts/              # analyze, diagnose, move-to-shared, apply-token-var-map
```

- **`app/`:** Routes and layout. No design literals; use components and tokens.
- **`components/`:** All reusable UI. Each has a Storybook story.
- **`stories/`:** One `*.stories.tsx` per component. Document props and variants.

---

## 5. Naming

- **Components:** PascalCase (`Button`, `DatePicker`).
- **Files:** Match component (`Button.tsx`, `Button.module.css`) or `index.ts`.
- **Tokens:** kebab-case paths; typography in camelCase in JSON where the spec requires.  
  CSS vars: `--token-{collection}-{kebab-path}` (e.g. `--token-component-gap-accordion-header`).

---

## 6. Accessibility

- Use semantic HTML (`button`, `input`, `nav`, `main`, etc.). Avoid generic `div`/`span` when a semantic element fits.
- Ensure focus order and focus visibility (e.g. `:focus-visible`).
- Labels: associate `label` with `input`/`select`/`textarea` (by `id`/`htmlFor` or `aria-labelledby`). Don’t rely only on placeholders.
- **ARIA:** Use when HTML alone is not enough (`aria-expanded`, `aria-controls`, `aria-live`, etc.). Prefer native semantics first.
- Color: don’t convey meaning by color alone. Support reduced motion if you add motion (e.g. `prefers-reduced-motion`).

---

## 7. Workflows

### Adding a new design value

1. Add the token in `tokens/system/` (correct layer and file).
2. Run `npm run build:tokens` and `npm run build:css-variables`.
3. Use `var(--token-...)` in the component or `globals.css`.
4. If it’s a new `--token-component-*`, run `node scripts/diagnose-missing-component-vars.mjs`.

### Adding a new component

1. Create `components/NewComponent/` with `NewComponent.tsx`, `NewComponent.module.css`, `index.ts`.
2. Add tokens under `tokens/system/componentTokens/components/newcomponent.json` (and shared files for typography, padding, gap, radius, height). Follow **token-structure/component-tokens**.
3. Run `build:tokens` and `build:css-variables`.
4. Implement using only `var(--token-*)`.
5. Add `stories/NewComponent.stories.tsx` and document variants.

### Moving tokens to shared (e.g. typography, padding, gap, radius)

1. Run `node scripts/move-to-shared-tokens.js` (creates `token-component-var-map.json`).
2. Run `node scripts/apply-token-var-map.js` to update `components/` and `styles/`.
3. Run `npm run build:tokens` and `npm run build:css-variables`.
4. Run `node scripts/diagnose-missing-component-vars.mjs` to confirm.

See **quick-reference/RULE** (or **scripts/RULE** Quick Command Reference) for the full list.

---

## 8. Checklist (new or changed UI)

- [ ] New or changed design value? → Token added/updated in `tokens/system/` and `build:tokens` + `build:css-variables` run.
- [ ] Code uses `var(--token-...)` only (no hardcoded design literals, except allowed exceptions).
- [ ] Component has a Storybook story and typed props.
- [ ] Styling via CSS Modules and tokens; optical alignment rule followed where text and icons align.
- [ ] Accessible: semantic HTML, focus, labels, ARIA only when needed.
- [ ] If component tokens were moved/renamed: `apply-token-var-map.js` run when `token-component-var-map.json` exists.

---

## 9. Related rules

- **token-structure/RULE** – token architecture, naming, file layout.
- **token-structure/component-tokens** – shared vs component, property-first, no hardcoded CSS.
- **token-references/RULE** – references, `$collectionName`, resolution.
- **scripts/RULE** – `build:tokens`, `build:css-variables`, `analyze-component-tokens`, `diagnose-missing-component-vars`, `move-to-shared-tokens`, `apply-token-var-map`.
- **quick-reference/RULE** – quick command reference (build, diagnose, move-to-shared, validate).
- **tech-stack/RULE** – React, Next.js, Storybook, versions.
- **text-optical-alignment/RULE** – text/icon alignment and padding compensation.
- **icon-tokens/RULE** – icon token layout and usage.
