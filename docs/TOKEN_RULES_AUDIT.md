# Token Rules Audit

Audit of `tokens/system` against `.cursor/rules/token-structure` (RULE.md and COMPONENT_TOKEN_RULES.md).

**Conclusion: No — not all tokens are created based on the rules.** There are several systematic violations.

---

## 1. Component tokens must not reference primitives

**Rule (RULE.md):**  
> - Component tokens **MUST** reference semantic tokens (except `universal.transparent`)
> - Never reference primitives directly from component tokens

**Findings:**

| Violation | Count | Examples |
|-----------|-------|----------|
| `$collectionName: "primitives"` in component tokens | **112** | field, button, accordion, modal, drawer, stepper, radio, notification, badge, timepicker, etc. |
| `$value` referencing primitives | **many** | `{typography.fontSize.3}`, `{typography.lineHeight.16}`, `{typography.fontWeight.medium}`, `{spacing-1}`, `{spacing-2}`, `{border-width-1}`, `{border-width-2}`, `{radius-1}`, `{size-1}`, `{size-2}` |

**Examples:**
- `{typography.fontSize.3}`, `{typography.lineHeight.16}` — primitive typography; should use semantic (e.g. `typography.body-size.md`, `typography.body-line.md`) where it exists.
- `{spacing-1}`, `{spacing-2}`, `{border-width-1}`, `{radius-1}`, `{size-1}` — raw primitives; should use semantic (`{padding.xxs}`, `{gap.xxs}`, semantic radius, `{icon.xxs}`, etc.).

**Note:** `{universal.transparent}` is allowed by the rules.

---

## 2. Typography, padding, gap, radius, height in component files

**Rule (COMPONENT_TOKEN_RULES.md):**  
> **DO NOT include in component files:**  
> - ❌ Font sizes (use `shared/fontSize.json`)  
> - ❌ Line heights (use `shared/lineHeight.json`)  
> - ❌ Padding (use `shared/padding.json`)  
> - ❌ Gaps (use `shared/gap.json`)  
> - ❌ Border radius (use `shared/radius.json`)  
> - ❌ Heights (use `shared/height.json`)

**Findings:** **273+** tokens in component files that match these properties, including:

- **fontSize / font-size / lineHeight / line-height** in: accordion, alert, avatar, card, colorpicker, divider, drawer, modal, notification, radio, rating, segmented, slider, skeleton, stepper, tabs, timepicker, autocomplete, spinner, badge, select, upload, etc.
- **padding**, **gap**, **radius** in many component files (e.g. upload, toast, tabs, stepper, slider, radio, notification, modal, menu, drawer, divider, colorpicker, card, anchor, accordion, image, chip, dropdown, autocomplete).

These should be moved to the matching `shared/*.json` files and wired from components via references.

---

## 3. Missing `$description`

**Rule (RULE.md):**  
> All tokens must include:  
> - `$type`, `$collectionName`, `$value`, **`$description`**

**Findings:**
- **409** tokens have `$description` across the repo.
- **1004** component tokens have `$type` in `components/` alone.
- Large share of component tokens have no `$description` (on the order of hundreds).

---

## 4. Shared tokens also referencing primitives

**Rule:** Component tokens (including shared) must reference semantic tokens.

**Findings:**
- `shared/fontSize.json`: `{typography.fontSize.1}`, `{typography.fontSize.2}`, `{typography.fontSize.3}`, `{typography.fontSize.sm}` — primitives.
- `shared/lineHeight.json`: `{typography.lineHeight.6}`, `{typography.lineHeight.12}`, `{typography.lineHeight.14}`, `{typography.lineHeight.16}` — primitives.
- `shared/padding.json`: `{spacing-1}`, `{spacing-2}`, `{spacing-3}`, `{spacing-4}` — primitives.
- `shared/gap.json`: `{spacing-1}`, `{spacing-1p5}`, `{spacing-2}`, `{spacing-2p5}` — primitives.

To comply, semantic typography (e.g. `typography.body-size.*`, `typography.body-line.*`), semantic spacing, and semantic gap tokens need to exist, and shared (and component) tokens should point to those instead of primitives.

---

## 5. Property-first and placement (COMPONENT_TOKEN_RULES)

**Rule:**  
> - Property-first: `component-{property}-{component}-{variant}`  
> - Shared files for: `fontSize`, `lineHeight`, `icon`, `fontWeight`, `padding`, `gap`, `radius`, `height`

**Findings:**
- Many typography/padding/gap/radius values live in component-specific files instead of `shared/`.
- Naming often follows `{component}.{variant}.{property}` rather than the property-first `{property}.{component}.{variant}` in shared, so the structure does not fully match the documented pattern.

---

## 6. What already matches the rules

- **Layering:** Many component tokens correctly use `$collectionName: "semanticTokens"` and `$value` like `{background.passive.neutral.default}`, `{content.passive.neutral.default}`, `{border.active.neutral.control.field.default}`, `{gap.xs}`, `{padding.s}`, `{radius.sm}`, `{icon.sm}`, etc.
- **Required fields:** Most tokens have `$type`, `$value`, `$collectionName`; `$description` is the main gap.
- **Semantic and primitives:** Semantic tokens generally reference primitives; primitive structure is mostly flattened as required.
- **Exceptions:** `universal.transparent` is used where the rules allow primitive use.

---

## Recommended next steps

1. **Introduce semantic typography (and similar) where missing**  
   - e.g. `typography.body-size.{xs,sm,md,lg}`, `typography.body-line.{sm,md,lg}` that reference primitives.  
   - Then replace `{typography.fontSize.3}`, `{typography.lineHeight.16}`, etc. in component and shared tokens with these semantic tokens.

2. **Replace primitive refs in component (and shared) tokens**  
   - `{spacing-*}` → semantic spacing/padding (e.g. `{padding.xxs}`, `{gap.xxs}`).  
   - `{border-width-*}`, `{radius-*}`, `{size-*}` → corresponding semantic tokens where they exist, or add them.

3. **Move typography, padding, gap, radius, height out of component files**  
   - Relocate to `shared/fontSize.json`, `shared/lineHeight.json`, `shared/padding.json`, `shared/gap.json`, `shared/radius.json`, `shared/height.json`.  
   - Keep in component files only: colors, component-specific spacing that does not fit shared patterns, and other component-unique props.

4. **Add `$description`**  
   - For every token that currently has `$type`/`$value`/`$collectionName` but no `$description`.

5. **Reserve `$collectionName: "primitives"` for the rare allowed cases**  
   - e.g. `universal.transparent`. For all other component (and shared) tokens, use `"semanticTokens"` and semantic `$value` refs.

If you want, I can propose concrete edits (file-by-file or token-by-token) for one layer (e.g. only component tokens, or only shared) or one category (e.g. typography, or spacing).
