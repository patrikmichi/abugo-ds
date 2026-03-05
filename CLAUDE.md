# CLAUDE.md

## What This Is

A design token system and React component library that syncs with Figma Tokens Studio. The tokens drive 35+ production React components through CSS custom properties.

## Project Structure

```
tokens/system/           # Source tokens (edit here)
  ├── primitives/        # Base values (colors, spacing, typography)
  ├── semanticTokens/    # Meaning-based tokens
  └── componentTokens/   # Component-specific tokens
      ├── shared/        # Category-first (radius, gap, padding, shadow, etc.)
      └── components/    # Component-first (colors, heights, widths)

tokens/output/           # Generated files for Figma sync (don't edit directly)
components/              # React components using CSS Modules + tokens
styles/tokens.css        # Generated CSS variables
```

## Key Commands

```bash
pnpm run build:tokens           # Merge system/ → output/
pnpm run build:css-variables    # Generate CSS variables
pnpm run validate:tokens        # Validate token usage in CSS
pnpm run dev                    # Next.js dev server
pnpm run storybook              # Component documentation
pnpm run type-check             # TypeScript validation
```

## Token Architecture

Three-layer system: **Primitives → Semantic → Component**

Component tokens use a hybrid approach:
- **Category-first** (`shared/`): radius, gap, padding, shadow, fontSize, lineHeight, animation, borderWidth, zIndex, icon
- **Component-first** (`components/`): colors, height, width, opacity

Token naming: `--token-{layer}-{property}-{component}-{variant}-{state}`

Example: `--token-component-button-primary-background-default`

## Component Conventions

Each component lives in `components/{Name}/` with:
- `{Name}.tsx` - Main component with forwardRef
- `{Name}.module.css` - Styles using token CSS variables
- `types.ts` - TypeScript interfaces
- `index.ts` - Exports

All styling through CSS Modules. No hardcoded values—use tokens.

## Working With Tokens

1. Edit tokens in `tokens/system/` (not `tokens/output/`)
2. Run `pnpm run build:tokens` to merge
3. Run `pnpm run build:css-variables` to update CSS
4. Run `pnpm run validate:tokens` to check for issues

## Skills Available

Run `/skills` to see specialized commands for common tasks like building tokens, refactoring components, and validating token usage.

## Key Documentation

- `docs/COMPONENT_TOKEN_RULES.md` - Token placement decisions
- `docs/TOKEN_STRUCTURE.md` - Full token organization
- `docs/DESIGNER_GUIDE.md` - Figma integration workflow
