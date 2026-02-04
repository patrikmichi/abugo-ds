---
description: "Rules for creating and managing token and build scripts"
alwaysApply: true
globs:
  - "tokens/scripts/**/*.{js,ts,mjs}"
  - "scripts/**/*.{js,ts,mjs}"
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
- `move-to-shared-tokens.js` - Moves typography, padding, gap, radius, height from `tokens/system/componentTokens/components/*.json` into `tokens/system/componentTokens/shared/*.json` and writes `token-component-var-map.json` (old → new `--token-component-*`). `node scripts/move-to-shared-tokens.js`
- `apply-token-var-map.js` - Applies renames from `token-component-var-map.json` to `components/**` and `styles/**` (.css, .ts, .tsx). Run after `move-to-shared-tokens.js`. `node scripts/apply-token-var-map.js`

**Build order:** `npm run build:tokens` → `npm run build:css-variables`. The generator uses `tokens/output/` when it exists so counts stay in sync with `merge-tokens` and `analyze-component-tokens`.

## Helper Scripts

Helper scripts are temporary scripts created to:
- Fix broken references
- Migrate token structures
- Clean up token files
- Validate token integrity
- Perform one-time transformations

### Rules for Helper Scripts

1. **Always delete helper scripts after implementation**
   - Once the changes are committed and pushed, delete the helper script
   - Helper scripts are not part of the permanent workflow

2. **Naming convention for helper scripts**
   - Use descriptive names: `fix-{issue}.ts`, `migrate-{feature}.js`, `cleanup-{area}.ts`
   - Examples: `fix-border-references.ts`, `remove-default-wrappers.ts`, `validate-references.ts`

3. **When to create helper scripts**
   - For one-time fixes or migrations
   - For complex transformations that need testing
   - For validation before committing changes

4. **When NOT to create helper scripts**
   - If the task can be done with simple find/replace
   - If the task is part of the regular workflow (use long-term scripts instead)

5. **Before deleting a helper script**
   - Ensure all changes are committed
   - Verify the changes work correctly
   - Document what was done in the commit message

## One-Time Migration Scripts

Scripts used for one-time migrations (e.g., color scale migration) should be:
- Kept temporarily until migration is verified
- Deleted after the migration is complete and verified
- Documented in commit messages

## Script Organization

- **tokens/scripts/** – Token build, merge, load, validate, codegen.
- **scripts/** – Analysis, migrations, var-map; run from repo root.
- Use TypeScript (`.ts`) for new scripts when possible.
- Use JavaScript (`.js`) or `.mjs` when needed for Node/tooling.

## Best Practices

1. **Document script purpose** in comments at the top of the file
2. **Add error handling** for file operations
3. **Use descriptive console output** to show progress
4. **Test scripts** on a small subset before running on all files
5. **Delete temporary scripts** immediately after use

## Quick Command Reference

| Goal | Command |
|------|---------|
| Rebuild tokens + CSS | `npm run build:tokens && npm run build:css-variables` |
| Rebuild + check component vars | `npm run build:tokens && npm run build:css-variables && node scripts/diagnose-missing-component-vars.mjs` |
| Move to shared | `node scripts/move-to-shared-tokens.js` then `node scripts/apply-token-var-map.js` |
| Validate tokens | `npm run validate:tokens` |
| Lint unresolved refs | `npm run lint:unresolved-tokens` |
| Analyze component tokens | `node scripts/analyze-component-tokens.js` (after `build:tokens`) |
