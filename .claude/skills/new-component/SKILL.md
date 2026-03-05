---
name: scaffold-component
description: Scaffold a new React component with the correct structure and pnpm workflows.
disable-model-invocation: true
argument-hint: [ComponentName]
allowed-tools: Write, Bash(ls *), Bash(pnpm *)
---

# Scaffold New Component

1. **Folder**: `components/{ComponentName}/`
2. **Files**:
   - `index.tsx` — Implementation
   - `types.ts` — `IProps` interface
   - `styles.module.css` — CSS Module
   - `index.ts` — Default export
3. **Tokens**: Define in `tokens/system/componentTokens/` before UI. Follow **token-structure**, **component-tokens**, and **icon-tokens** for naming conventions.
4. **Build**: Run `pnpm build:tokens && pnpm build:css-variables`.
