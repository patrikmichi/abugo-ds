---
name: scripts
description: Rules for creating and managing token and build scripts. Covers long-term scripts, helper scripts, build order, and script organization.
user-invocable: false
---

# Script Management Rules

## Long-Term Scripts

### tokens/scripts/ (build and tokens)

- `merge-tokens.ts` - Merges `tokens/system/*` into `tokens/output/*.json`. Run first (`npm run build:tokens`) before `build:css-variables`.
- `generate-css-variables.ts` - Generates `styles/tokens.css`. Prefers `tokens/output/*.json` when present; otherwise uses `load-tokens.ts`. Run `npm run build:css-variables`.
- `load-tokens.ts` - Loads tokens from `tokens/system/` for programmatic use (e.g. generator fallback, tooling).
- `split-tokens.js` - Splits main JSON files into organized subfolders.
- `generate-docs.js` - Generates documentation from token files.
- `validate-tokens.ts`, `validateFigmaTokens.ts` - Token validation.
- `generate-components.ts`, `generate-token-types.ts` - Codegen for components and types.

**Never delete these** unless replaced by improved versions.

### scripts/ (repo root, analysis and migrations)

- `analyze-component-tokens.js` - Counts leaf tokens, unique CSS vars, duplicates, value reuse. Run on `tokens/output/componentTokens.json`. `node scripts/analyze-component-tokens.js`
- `diagnose-missing-component-vars.mjs` - Diffs `tokens/output/componentTokens.json` vs `styles/tokens.css` to find missing or duplicate `--token-component-*`. `node scripts/diagnose-missing-component-vars.mjs`. Prereq: `build:tokens` and `build:css-variables`.
- `move-to-shared-tokens.js` - Moves typography, padding, gap, radius, height from `tokens/system/componentTokens/components/*.json` into `tokens/system/componentTokens/shared/*.json` and writes `token-component-var-map.json` (old -> new `--token-component-*`). `node scripts/move-to-shared-tokens.js`
- `apply-token-var-map.js` - Applies renames from `token-component-var-map.json` to `components/**` and `styles/**` (.css, .ts, .tsx). Run after `move-to-shared-tokens.js`. `node scripts/apply-token-var-map.js`

**Build order:** `npm run build:tokens` -> `npm run build:css-variables`. The generator uses `tokens/output/` when it exists so counts stay in sync with `merge-tokens` and `analyze-component-tokens`.

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
