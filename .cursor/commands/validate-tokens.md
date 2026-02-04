---
description: Validate token structure, references, and lint for issues
---

Run token validation checks:

1. Run `npm run validate:tokens` to check token structure and types
2. Run `npm run lint:unresolved-tokens` to find broken references

Report:
- Invalid token structures or missing `$type`/`$value`
- Unresolved references (tokens pointing to non-existent tokens)
- Component tokens incorrectly referencing primitives (should use semantic)
- Missing `$description` on tokens (warning)

Suggest fixes for any issues found.
