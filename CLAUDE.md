# CLAUDE.md — Abugo Design System

## What
Design token system and React component library synced with Figma Tokens Studio. Tokens drive 35+ production React components through CSS custom properties. See [AGENTS.md](./AGENTS.md) for agent reference.

## Tech Stack
- **Framework**: Next.js + Storybook
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Styling**: CSS Modules + CSS custom properties

## Commands
```bash
pnpm run dev                    # Next.js dev server
pnpm run storybook              # Component documentation
pnpm run build:tokens           # Merge system/ → output/
pnpm run build:css-variables    # Generate CSS variables
pnpm run validate:tokens        # Validate token usage
```

## Status: active
