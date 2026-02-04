---
name: build-tokens
description: Rebuild all tokens and CSS variables
disable-model-invocation: true
allowed-tools: Bash(npm run build:tokens), Bash(npm run build:css-variables), Bash(node scripts/diagnose-missing-component-vars.mjs)
---

Run the token build pipeline:

1. Run `npm run build:tokens` to merge tokens from `tokens/system/` into `tokens/output/`
2. Run `npm run build:css-variables` to generate `styles/tokens.css`
3. Run `node scripts/diagnose-missing-component-vars.mjs` to verify no missing `--token-component-*` vars

Report success or any errors found.
