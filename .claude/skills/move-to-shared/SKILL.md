---
name: move-to-shared
description: Move component tokens to shared files and update CSS references
disable-model-invocation: true
allowed-tools: Bash(node scripts/move-to-shared-tokens.js), Bash(node scripts/apply-token-var-map.js), Bash(pnpm build:tokens), Bash(pnpm build:css-variables), Bash(node scripts/diagnose-missing-component-vars.mjs), Bash(pnpm run diagnose)
---

Move typography, padding, gap, radius, and height tokens from component files to shared files:

1. Run `node scripts/move-to-shared-tokens.js`
   - Moves tokens from `tokens/system/componentTokens/components/*.json` to `tokens/system/componentTokens/shared/*.json`
   - Creates `token-component-var-map.json` mapping old -> new `--token-component-*` names

2. Run `node scripts/apply-token-var-map.js`
   - Updates `components/**` and `styles/**` files with new token names

3. Run `pnpm build:tokens && pnpm build:css-variables`
   - Regenerate token output and CSS variables

4. Run `node scripts/diagnose-missing-component-vars.mjs`
   - Verify no missing or broken references

Report any tokens that were moved and any files that were updated.

**See also:**
- **component-tokens** — rules for property-first paths and shared vs component files
- **token-structure** — overall token architecture
