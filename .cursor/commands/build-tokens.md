---
description: Rebuild all tokens and CSS variables
---

Run the token build pipeline:

1. Run `npm run build:tokens` to merge tokens from `tokens/system/` into `tokens/output/`
2. Run `npm run build:css-variables` to generate `styles/tokens.css`
3. Run `node scripts/diagnose-missing-component-vars.mjs` to verify no missing `--token-component-*` vars

Report success or any errors found.
