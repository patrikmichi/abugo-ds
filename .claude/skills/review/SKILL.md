---
name: review
description: Review code changes against project conventions and quality standards. Reports issues without auto-fixing.
user-invocable: true
allowed-tools: Bash(git *)
---

# Code Review

Review recent code changes against project conventions and quality standards.

## Review Checklist

1. **Source of Truth**: Read the **frontend-expert** skill for all current React, TypeScript, and styling conventions.
2. **Package Manager**: Ensure NO `npm` or `yarn` commands are used in workflows; strictly **pnpm**.
3. **Styling**: Ensure strict usage of **CSS Modules** and theme tokens. Refer to **token-structure** (architecture) and **component-tokens** (naming rules). No inline styles or hardcoded values.
4. **Calendar Components**: Ensure all calendar-related logic is within `components/pages/calendar/CalendarPage/`.
5. **Quality**: No `any`, no unused imports, strict i18n via `react-intl`, and keyboard a11y.

## Process

1. Identify scope via `git diff` (staged + unstaged).
2. Read files and compare against **frontend-expert**.
3. Report issues grouped by file with line numbers.
