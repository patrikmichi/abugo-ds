---
name: figma-plugin
description: Figma designer plugin conventions. Design JSON, tokens/output, variable resolution, push/sync workflows.
user-invocable: false
---

# Figma Designer Plugin

- **Source of truth for tokens:** `tokens/output/` (`primitives.json`, `semanticTokens.json`, `componentTokens.json`). Regenerate with `pnpm build:tokens` before syncing.
- **Design JSON:** `examples/*.design.json` and `src/schemas/design-json.ts`. Maps React/CSS tokens to Figma. Generate via `pnpm run parse -- ../components/ComponentName` in `figma-designer-plugin/`.
- **Variable resolution:** `src/plugin/resolveVariables.ts`, `compareTokens.ts`, `pairVariables.ts`. Keep token names and structure compatible with `tokens/output/`.
- **Insert from JSON:** `insertFromJson.ts` builds Figma component sets from design JSON.
- **Bridge/push:** `bridge/push.ts`, `push-component.ts` for sync. After token renames or structural changes in `tokens/system/`, run `build:tokens` and refresh Figma sync.

**See also:**
- **token-structure** — architecture and reference syntax
- **component-tokens** — component token organisation
