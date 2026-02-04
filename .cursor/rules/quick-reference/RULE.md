---
description: "Quick reference for token build, diagnose, move-to-shared, validate, analyze."
alwaysApply: false
globs:
  - "package.json"
  - "tokens/**/*.json"
  - "scripts/**/*.{js,ts,mjs}"
---

# Quick Reference

| Goal | Command |
|------|---------|
| Rebuild tokens + CSS | `npm run build:tokens && npm run build:css-variables` |
| Rebuild + check component vars | `npm run build:tokens && npm run build:css-variables && node scripts/diagnose-missing-component-vars.mjs` |
| Move to shared | `node scripts/move-to-shared-tokens.js` then `node scripts/apply-token-var-map.js` |
| Validate tokens | `npm run validate:tokens` |
| Lint unresolved refs | `npm run lint:unresolved-tokens` |
| Analyze component tokens | `node scripts/analyze-component-tokens.js` (after `build:tokens`) |

Also in **scripts/RULE** (long-term vs helper scripts, build order).
