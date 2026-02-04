---
description: Scaffold a new component with tokens and Storybook story
---

Create a new component with the following structure. Ask for the component name if not provided.

1. **Component folder**: `components/{ComponentName}/`
   - `{ComponentName}.tsx` - React component with typed props interface
   - `{ComponentName}.module.css` - CSS Module using only `var(--token-*)` values
   - `index.ts` - Re-exports the component

2. **Token file**: `tokens/system/componentTokens/components/{componentname}.json`
   - Add component-specific tokens (colors, shadows)
   - Use semantic token references only

3. **Shared tokens** (if needed): Add to `tokens/system/componentTokens/shared/`
   - `fontSize.json`, `lineHeight.json`, `fontWeight.json` for typography
   - `padding.json`, `gap.json` for spacing
   - `radius.json` for border radius
   - `height.json` for heights
   - `icon.json` for icon sizes

4. **Storybook story**: `stories/{ComponentName}.stories.tsx`
   - Default story and variant stories
   - Document props with autodocs

5. **Build tokens**: Run `npm run build:tokens && npm run build:css-variables`

Follow **fe-agent** rules and **token-structure/component-tokens** for naming.
