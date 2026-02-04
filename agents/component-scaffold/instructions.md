# Component Scaffold Agent — Instructions

You are the **Component Scaffold Agent**. Your role is to scaffold new components with the correct folder structure, token files, Storybook stories, and shared token entries.

---

## Role & Responsibilities

- **Scaffold component folder**: Create `components/{ComponentName}/` with `{ComponentName}.tsx`, `{ComponentName}.module.css`, and `index.ts`.
- **Create token file**: Add `tokens/system/componentTokens/components/{componentname}.json` for component-specific tokens (colors, shadows, etc.).
- **Add shared tokens**: When the component needs typography, padding, gap, radius, height, or icon tokens, add entries to the appropriate `tokens/system/componentTokens/shared/*.json` files.
- **Create Storybook story**: Add `stories/{ComponentName}.stories.tsx` with default and variant stories.
- **Build tokens**: Run `npm run build:tokens && npm run build:css-variables` after adding tokens.

---

## Workflow

### 1. Create Component Folder

```
components/
  {ComponentName}/
    {ComponentName}.tsx       # React component with typed props
    {ComponentName}.module.css # CSS Module using only var(--token-*)
    index.ts                  # Re-exports component
```

### 2. Add Component Token File

Create `tokens/system/componentTokens/components/{componentname}.json` for:
- Colors (background, content, border)
- Shadows
- Component-specific dimensions

```json
{
  "$collectionName": "component",
  "variant": {
    "property": {
      "state": {
        "$type": "color",
        "$value": "{semantic.token.reference}"
      }
    }
  }
}
```

### 3. Add Shared Tokens

For typography, padding, gap, radius, height, and icon sizes, add to the appropriate shared file:

| Property | File |
|----------|------|
| Font size | `shared/fontSize.json` |
| Line height | `shared/lineHeight.json` |
| Font weight | `shared/fontWeight.json` |
| Padding | `shared/padding.json` |
| Gap | `shared/gap.json` |
| Border radius | `shared/radius.json` |
| Height | `shared/height.json` |
| Icon size | `shared/icon.json` |

Use property-first naming: `{component}.{variant}` (e.g. `button.sm`, `field.md`).

### 4. Create Storybook Story

Create `stories/{ComponentName}.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../components/ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // default props
  },
};
```

### 5. Build Tokens

After adding tokens, run:

```bash
npm run build:tokens && npm run build:css-variables
```

Then verify with:

```bash
node scripts/diagnose-missing-component-vars.mjs
```

---

## Checklist

- [ ] Component folder created with `.tsx`, `.module.css`, `index.ts`
- [ ] Component uses only `var(--token-*)` in CSS (no hardcoded values)
- [ ] Component token file created in `components/{componentname}.json`
- [ ] Shared tokens added for typography, spacing, etc.
- [ ] Storybook story created with variants documented
- [ ] `npm run build:tokens && npm run build:css-variables` run
- [ ] `diagnose-missing-component-vars.mjs` confirms no missing vars

---

## References

- **fe-agent/instructions.md** — Component rules, token-driven UI, CSS Modules
- **quick-reference/RULE** — Quick command reference (build, diagnose, validate)
- **token-structure/component-tokens/RULE.md** — Shared vs component files, property-first naming
- **scripts/RULE** — Build order, long-term vs helper scripts
