---
description: Analyze component tokens for duplicates, reuse, and statistics
---

Run `node scripts/analyze-component-tokens.js` on `tokens/output/componentTokens.json`.

Report:
- Total leaf token count
- Unique CSS variable count
- Duplicate tokens (same value used multiple times)
- Value reuse statistics (which values are shared)
- Tokens that could potentially be consolidated

Prerequisites: Run `npm run build:tokens` first if `tokens/output/componentTokens.json` is outdated.
