# Token Validation Guide

This guide explains the automated validation system that connects Tokens Studio JSON files with CSS modules, preventing linting errors, deprecated tokens, and missing references.

---

## Overview

The validation system ensures:
- ✅ **No missing tokens** - All CSS variables reference existing tokens
- ✅ **No deprecated tokens** - Warnings for deprecated token usage
- ✅ **Type safety** - TypeScript types for all CSS variables
- ✅ **Automated checks** - Pre-commit hooks validate tokens automatically

---

## Validation Scripts

### 1. Token Validation

Validates all CSS module files to ensure tokens exist and aren't deprecated:

```bash
npm run validate:tokens
```

**What it checks:**
- All `var(--token-*)` references in CSS module files
- Token existence in generated CSS variables
- Deprecated token usage
- Provides suggestions for replacements

**Output:**
```
🔍 Validating tokens in 3 CSS module files...

📊 Validation Results:

✅ All tokens are valid!
```

Or if errors found:
```
❌ Found 5 error(s):

  components/Button/Button.module.css:12
    MISSING: Token "--token-component-invalid-token" does not exist
    💡 Run `npm run build:css-variables` to regenerate CSS variables

⚠️  Found 2 warning(s):

  components/Card/Card.module.css:8
    DEPRECATED: Token "--token-semantic-old-token" is deprecated
    💡 Use "--token-semantic-new-token" instead
```

---

### 2. Generate TypeScript Types

Generates TypeScript types for all CSS variables:

```bash
npm run build:token-types
```

**Output:**
- `styles/token-types.d.ts` - Type definitions for all tokens
- Types include: `PrimitiveToken`, `SemanticToken`, `ComponentToken`, `DesignToken`
- Deprecated tokens are marked with `@deprecated` JSDoc

**Usage:**
```typescript
import type { DesignToken } from '@/styles/token-types';

const token: DesignToken = '--token-semantic-background-active-accent-default';
```

---

### 3. CSS Variables Generation

Generates CSS variables with deprecation warnings:

```bash
npm run build:css-variables
```

**Features:**
- Resolves all token references
- Lists deprecated tokens in CSS comments
- Shows replacement suggestions

**Example output in CSS:**
```css
/* 
 * Design Tokens CSS Variables
 * Auto-generated from token files
 * ⚠️  DEPRECATED TOKENS (2):
 *    - --token-semantic-old-token → Use --token-semantic-new-token
 *    - --token-component-deprecated → Use --token-component-new
 */
```

---

## Pre-commit Hooks

### Setup

Install and configure git hooks:

```bash
chmod +x scripts/setup-hooks.sh
./scripts/setup-hooks.sh
```

Or manually:
```bash
npm install --save-dev husky
npx husky install
chmod +x .husky/pre-commit
```

### What Happens on Commit

1. **Validates tokens** - Runs `npm run validate:tokens`
2. **Regenerates CSS** - If token files changed, regenerates CSS variables
3. **Regenerates types** - Updates TypeScript types
4. **Stages generated files** - Adds `styles/tokens.css` and `styles/token-types.d.ts`

**If validation fails:**
- Commit is blocked
- Fix errors and try again

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Validate Tokens

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:tokens
      - run: npm run build:css-variables
      - run: npm run build:token-types
      - run: npm run validate:tokens
```

---

## ESLint Integration

### Basic Setup

The validation system includes an ESLint plugin structure (can be enhanced):

```json
{
  "plugins": ["tokens"],
  "rules": {
    "tokens/valid-token": "error"
  }
}
```

**Note:** Full ESLint integration requires additional setup for CSS file parsing.

---

## Workflow

### Daily Development

1. **Edit tokens** in `tokens/system/`
2. **Regenerate** (automatic on commit, or manually):
   ```bash
   npm run build:tokens
   npm run build:css-variables
   npm run build:token-types
   ```
3. **Use tokens** in CSS modules:
   ```css
   .button {
     background-color: var(--token-semantic-background-active-accent-default);
   }
   ```
4. **Validate** before committing:
   ```bash
   npm run validate:tokens
   ```

### When Tokens Are Deprecated

1. **Mark as deprecated** in token file:
   ```json
   {
     "$extensions": {
       "design-tokens": {
         "deprecated": true,
         "replacedBy": "--token-semantic-new-token"
       }
     }
   }
   ```

2. **Regenerate CSS variables** - Deprecation warnings appear in CSS comments

3. **Validation will warn** when deprecated tokens are used

4. **Update code** to use replacement tokens

---

## Troubleshooting

### "Token does not exist" Error

**Problem:** Validation reports missing token

**Solutions:**
1. Run `npm run build:css-variables` to regenerate
2. Check token name matches exactly (case-sensitive)
3. Verify token exists in `tokens/system/` files
4. Check token structure matches expected format

### "Deprecated token" Warning

**Problem:** Using deprecated token

**Solutions:**
1. Check CSS file comments for replacement suggestion
2. Update code to use replacement token
3. Remove deprecated token usage

### TypeScript Errors

**Problem:** TypeScript doesn't recognize token types

**Solutions:**
1. Run `npm run build:token-types`
2. Ensure `styles/token-types.d.ts` is included in `tsconfig.json`
3. Restart TypeScript server

---

## Best Practices

### 1. Always Validate Before Committing

```bash
npm run validate:tokens
```

### 2. Use Semantic Tokens

Prefer semantic tokens over primitives:
```css
/* ✅ Good */
background-color: var(--token-semantic-background-active-accent-default);

/* ❌ Avoid */
background-color: var(--token-primitive-brand-700);
```

### 3. Handle Deprecations Promptly

When you see deprecation warnings:
1. Find replacement token
2. Update all usages
3. Remove deprecated token references

### 4. Keep Generated Files in Sync

Always regenerate after token changes:
```bash
npm run build:tokens && npm run build:css-variables && npm run build:token-types
```

---

## Related Documentation

- [CSS Modules Guide](CSS_MODULES_GUIDE.md) - Using tokens in CSS modules
- [Token Structure](TOKEN_STRUCTURE.md) - How tokens are organized
- [Component Token Rules](COMPONENT_TOKEN_RULES.md) - Component token guidelines

---

## Quick Reference

### Commands

```bash
# Validate tokens
npm run validate:tokens

# Generate CSS variables
npm run build:css-variables

# Generate TypeScript types
npm run build:token-types

# Full rebuild
npm run build:tokens && npm run build:css-variables && npm run build:token-types
```

### File Locations

- Validation script: `tokens/scripts/validate-tokens.ts`
- Type generator: `tokens/scripts/generate-token-types.ts`
- Generated CSS: `styles/tokens.css`
- Generated types: `styles/token-types.d.ts`
- Pre-commit hook: `.husky/pre-commit`
