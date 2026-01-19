---
description: "Rules for creating and managing helper scripts in the tokens/scripts folder"
alwaysApply: true
globs:
  - "tokens/scripts/**/*.{js,ts,mjs}"
---

# Script Management Rules

## Long-Term Scripts

These scripts are part of the permanent build and development workflow:

- `merge-tokens.ts` - Merges token subfolders into main JSON files for Tokens Studio
- `split-tokens.js` - Splits main JSON files into organized subfolders
- `generate-docs.js` - Generates documentation from token files
- `load-tokens.ts` - Loads tokens from subfolders for Storybook

**Never delete these scripts** unless they are replaced by improved versions.

## Helper Scripts

Helper scripts are temporary scripts created to:
- Fix broken references
- Migrate token structures
- Clean up token files
- Validate token integrity
- Perform one-time transformations

### Rules for Helper Scripts

1. **Always delete helper scripts after implementation**
   - Once the changes are committed and pushed, delete the helper script
   - Helper scripts are not part of the permanent workflow

2. **Naming convention for helper scripts**
   - Use descriptive names: `fix-{issue}.ts`, `migrate-{feature}.js`, `cleanup-{area}.ts`
   - Examples: `fix-border-references.ts`, `remove-default-wrappers.ts`, `validate-references.ts`

3. **When to create helper scripts**
   - For one-time fixes or migrations
   - For complex transformations that need testing
   - For validation before committing changes

4. **When NOT to create helper scripts**
   - If the task can be done with simple find/replace
   - If the task is part of the regular workflow (use long-term scripts instead)

5. **Before deleting a helper script**
   - Ensure all changes are committed
   - Verify the changes work correctly
   - Document what was done in the commit message

## One-Time Migration Scripts

Scripts used for one-time migrations (e.g., color scale migration) should be:
- Kept temporarily until migration is verified
- Deleted after the migration is complete and verified
- Documented in commit messages

## Script Organization

- All scripts should be in `tokens/scripts/`
- Use TypeScript (`.ts`) for new scripts when possible
- Use JavaScript (`.js`) for scripts that need to run in older Node.js environments
- Use ES modules (`.mjs`) when needed for compatibility with specific tools

## Best Practices

1. **Document script purpose** in comments at the top of the file
2. **Add error handling** for file operations
3. **Use descriptive console output** to show progress
4. **Test scripts** on a small subset before running on all files
5. **Delete temporary scripts** immediately after use
