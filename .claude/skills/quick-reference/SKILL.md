---
name: quick-reference
description: Quick reference for token build, diagnose, validate, analyze commands. Standardized on pnpm.
user-invocable: false
---

# Quick Reference

| Goal | Command |
|------|---------|
| Rebuild tokens + CSS | `pnpm build:tokens && pnpm build:css-variables` |
| Rebuild + diagnose | `pnpm build:tokens && pnpm build:css-variables && pnpm run diagnose` |
| Validate tokens | `pnpm validate:tokens` |
| Lint unresolved refs | `pnpm run lint:unresolved-tokens` |
| Analyze tokens | `pnpm run analyze` |
