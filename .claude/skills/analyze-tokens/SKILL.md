---
name: analyze-tokens
description: Analyze component tokens for duplicates, reuse, and statistics
disable-model-invocation: true
allowed-tools: Bash(pnpm build:tokens), Bash(node scripts/analyze-component-tokens.js), Bash(pnpm run analyze)
---

Analyze component tokens by running the analysis script.

1. Ensure tokens are up to date: run `pnpm build:tokens` if `tokens/output/componentTokens.json` may be outdated
2. Run `pnpm run analyze` (or `node scripts/analyze-component-tokens.js`) on `tokens/output/componentTokens.json`

Report:
- Total leaf token count
- Unique CSS variable count
- Duplicate tokens (same value used multiple times)
- Value reuse statistics (which values are shared)
- Tokens that could potentially be consolidated
