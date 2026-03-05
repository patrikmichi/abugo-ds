---
name: validate-tokens
description: Validate token structure, references, and lint for issues
disable-model-invocation: true
allowed-tools: Bash(pnpm validate:tokens), Bash(pnpm run lint:unresolved-tokens)
---

Run token validation checks:

1. Run `pnpm validate:tokens` to check token structure and types
2. Run `pnpm run lint:unresolved-tokens` to find broken references

Report:
- Invalid token structures or missing `$type`/`$value`
- Unresolved references (tokens pointing to non-existent tokens)
- Component tokens incorrectly referencing primitives (should use semantic)
- Missing `$description` on tokens (warning)

Suggest fixes for any issues found.
