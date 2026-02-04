---
description: Check for missing or duplicate component token CSS variables
---

Run `node scripts/diagnose-missing-component-vars.mjs` to compare `tokens/output/componentTokens.json` against `styles/tokens.css`.

Report:
- Missing `--token-component-*` variables (in tokens but not in CSS)
- Duplicate variables (if any)
- Total token count and CSS variable count

If there are missing vars, suggest running `npm run build:tokens && npm run build:css-variables` to regenerate.
