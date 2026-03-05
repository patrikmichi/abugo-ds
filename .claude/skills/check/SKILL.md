---
name: check
description: Run linter, type checker, and build to find errors
disable-model-invocation: true
allowed-tools: Bash(pnpm *)
---

# Check for Errors

**Related skills:**
- **frontend-expert** — verify code patterns (JSX, hooks, state) alongside automated checks

Run code quality checks and report any issues found.

## Quick Checks (after every change)

Run these after every change you make:

### 1. TypeScript type check

```bash
pnpm run type-check
```

Report any type errors. Group them by file.

### 2. ESLint with auto-fix

```bash
pnpm run lint
```

Report any linting errors or warnings that couldn't be auto-fixed. Group them by file.

## Full Checks (after bigger changes)

Run these after bigger changes or before committing:

### 3. Run tests

```bash
pnpm test
```

Report any test failures.

### 4. Regenerate GraphQL types

```bash
pnpm run codegen
```

Run this after modifying GraphQL queries, mutations, or fragments to regenerate types.

### 5. Build

```bash
pnpm build
```

Report any build errors.

## Check Levels

When invoked, determine which level of checks to run:

- `/check` or `/check quick` — Run quick checks only (type-check, lint)
- `/check full` — Run all checks (type-check, lint, test, codegen, build)
- `/check build` — Run quick checks + build

## After checks

- Summarize the total number of errors and warnings from each check.
- If there are errors, list them grouped by file with the specific error message and line number.
- If everything passes, confirm all checks are clean.
- Do NOT auto-fix anything beyond what `pnpm run lint` handles unless the user explicitly asks.

## Manual Checks

These aren't automated but should be verified when relevant:

### Clean React Patterns

If the changes include React components, verify:
- DOM manipulation is encapsulated in custom hooks (not inline in component)
- Pure utility functions are extracted outside the component
- Complex conditionals use boolean variables instead of nested ternaries
- See **clean-react** skill for patterns

### FullCalendar CSS Overrides

If the changes include FullCalendar styling (`.fc-*` classes), verify:
- Every override has a documentation comment explaining what default is being changed and why
- Theme tokens are used instead of hardcoded values
- See **full-calendar-overrides** skill for required comment format
