# Abugo Design System — Agent Reference

Design token system and React component library (35+ components) syncing with Figma Tokens Studio. See `CLAUDE.md` for commands and constraints.

## Project Structure

```
abugo-design-system/
├── tokens/
│   ├── system/           — Source tokens (edit here, not output/)
│   │   ├── primitives/   — Base values (colors, spacing, typography)
│   │   ├── semanticTokens/ — Meaning-based tokens
│   │   └── componentTokens/ — Component-specific tokens
│   │       ├── shared/   — Category-first (radius, gap, padding, shadow…)
│   │       └── components/ — Component-first (colors, height, width…)
│   └── output/           — Generated files for Figma sync (do not edit)
├── components/           — 35+ React components (CSS Modules + tokens)
├── styles/tokens.css     — Generated CSS variables
├── stories/              — Storybook stories
├── agents/               — Project-specific Claude Code agents
│   ├── component-scaffold/
│   ├── ds-architect/
│   └── fe-agent/
├── docs/                 — Token rules, structure docs, designer guide
└── figma-console-mcp/    — Figma Console MCP integration
```

## Conventions

**Token naming**: `--token-{layer}-{property}-{component}-{variant}-{state}`
- Example: `--token-component-button-primary-background-default`

**Three-layer system**: Primitives → Semantic → Component

**Component structure**: Each component in `components/{Name}/` must have:
- `{Name}.tsx` — Main component with `forwardRef`
- `{Name}.module.css` — Styles using token CSS variables only
- `types.ts` — TypeScript interfaces
- `index.ts` — Barrel exports

**Never** hardcode values in component CSS — always use `var(--token-*)`.

**Token placement**:
- Category-first (`shared/`): radius, gap, padding, shadow, fontSize, lineHeight, animation, borderWidth, zIndex, icon
- Component-first (`components/`): colors, height, width, opacity

**Token workflow**: Edit `tokens/system/` → `pnpm build:tokens` → `pnpm build:css-variables` → `pnpm validate:tokens`

## Key Commands

| Command | What it does |
|---------|--------------|
| `pnpm build:tokens` | Merge `tokens/system/` → `tokens/output/` |
| `pnpm build:css-variables` | Generate `styles/tokens.css` |
| `pnpm validate:tokens` | Validate token usage in CSS |
| `pnpm dev` | Next.js dev server |
| `pnpm storybook` | Component docs (port 6006) |
| `pnpm type-check` | TypeScript validation |

## Detailed References

| Topic | Where to look |
|-------|---------------|
| Token placement decisions | `docs/COMPONENT_TOKEN_RULES.md` |
| Token organization | `docs/TOKEN_STRUCTURE.md` |
| Figma integration workflow | `docs/DESIGNER_GUIDE.md` |
| Component conventions | `CLAUDE.md` |
| Available skills | `agents/` + `.claude/skills/` |
