---
name: scripts
description: Rules for managing token and build scripts. Standardized on pnpm.
user-invocable: false
---

# Script Management Rules

## Build Scripts

Use **pnpm** for all script execution.

- `pnpm build:tokens` - Merges tokens from `tokens/system/*` into `tokens/output/*.json`.
- `pnpm build:css-variables` - Generates CSS variables from merged outputs.

## Cleanup and Diagnostics

- `pnpm run diagnose` - Verify token consistency.
- `pnpm run cleanup` - Remove orphaned/deprecated files.

- `analyze-component-tokens.js` - Counts leaf tokens, unique CSS vars, duplicates, value reuse. Run on `tokens/output/componentTokens.json`. `node scripts/analyze-component-tokens.js`
- `diagnose-missing-component-vars.mjs` - Diffs `tokens/output/componentTokens.json` vs `styles/tokens.css` to find missing or duplicate `--token-component-*`. `node scripts/diagnose-missing-component-vars.mjs`. Prereq: `build:tokens` and `build:css-variables`.
- `move-to-shared-tokens.js` - Moves typography, padding, gap, radius, height from `tokens/system/componentTokens/components/*.json` into `tokens/system/componentTokens/shared/*.json` and writes `token-component-var-map.json` (old -> new `--token-component-*`). `node scripts/move-to-shared-tokens.js`
**Build order:** `pnpm build:tokens` -> `pnpm build:css-variables`. The generator uses `tokens/output/` when it exists so counts stay in sync with `merge-tokens` and `analyze-component-tokens`.

## Helper Scripts

Helper scripts are temporary scripts created to:
- Fix broken references
- Migrate token structures
- Clean up token files
- Validate token integrity
- Perform one-time transformations

### Rules for Helper Scripts

1. **Always delete helper scripts after implementation**
2. **Naming convention**: `fix-{issue}.ts`, `migrate-{feature}.js`, `cleanup-{area}.ts`
3. **When to create**: For one-time fixes, complex transformations, validation before committing
4. **When NOT to create**: If the task can be done with simple find/replace or is part of the regular workflow
5. **Before deleting**: Ensure all changes are committed and verified

## Script Organization

- **tokens/scripts/** - Token build, merge, load, validate, codegen.
- **scripts/** - Analysis, migrations, var-map; run from repo root.
- Use TypeScript (`.ts`) for new scripts when possible.
- Use JavaScript (`.js`) or `.mjs` when needed for Node/tooling.

## Best Practices

1. Document script purpose in comments at the top of the file
2. Add error handling for file operations
3. Use descriptive console output to show progress
4. Test scripts on a small subset before running on all files
5. Delete temporary scripts immediately after use
