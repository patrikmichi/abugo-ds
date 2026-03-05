---
name: build-tokens
description: Rebuild all tokens and CSS variables
disable-model-invocation: true
allowed-tools: Bash(pnpm build:tokens), Bash(pnpm build:css-variables), Bash(node scripts/diagnose-missing-component-vars.mjs), Bash(pnpm run diagnose)
---

# Build Tokens

Run the token build pipeline:

1. Run `pnpm build:tokens` to merge tokens from `tokens/system/` into `tokens/output/`
2. Run `pnpm build:css-variables` to generate `styles/tokens.css`
3. Run `pnpm run diagnose` (or `node scripts/diagnose-missing-component-vars.mjs`) to verify no missing `--token-component-*` vars

Report success or any errors found.

**See also:**
- **validate-tokens** — verify reference integrity
- **analyze-tokens** — check for value reuse and statistics
