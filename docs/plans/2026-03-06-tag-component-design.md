# Tag Component Design

## What

A categorization label component for displaying status, content type, or taxonomy. Display-only with semantic color variants, custom color support, and 3 sizes.

## API

```tsx
// Semantic variant
<Tag variant="success" size="md" icon={<CheckIcon />}>Published</Tag>

// Custom color
<Tag color="#7B61FF" size="sm">Custom</Tag>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'` | Semantic color variant |
| `color` | `string` | — | Custom color (hex/rgb). Overrides `variant`. Auto-generates background (15% alpha) and border (30% alpha) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tag size |
| `icon` | `ReactNode` | — | Optional leading icon |
| `children` | `ReactNode` | — | Label text |
| ...rest | `HTMLSpanElement` attributes | — | Spread to root element |

### Sizes

| Size | Height |
|------|--------|
| `sm` | 24px |
| `md` | 32px |
| `lg` | 40px |

## Visual Style

- Pill shape (full border-radius)
- Subtle background fill with matching text color per variant
- Optional leading icon that scales with size
- When `color` prop is set: text = color, background = color at 15% alpha, border = color at 30% alpha

## Token Structure

### Shared Tokens (category-first)

Added to existing files in `tokens/system/componentTokens/shared/`:

- `radius.tag` — border radius (999px for pill)
- `padding.x.tag.{sm|md|lg}` — horizontal padding
- `gap.tag.{sm|md|lg}` — gap between icon and text
- `fontSize.tag.{sm|md|lg}` — font size
- `lineHeight.tag.{sm|md|lg}` — line height
- `height.tag.{sm|md|lg}` — fixed height
- `icon.tag.{sm|md|lg}` — icon size

### Component Tokens (component-first)

New file `tokens/system/componentTokens/components/tag.json`:

- `tag.{variant}.background` — background per variant
- `tag.{variant}.foreground` — text/icon color per variant
- `tag.{variant}.border` — border color per variant

Variants: neutral, success, warning, error, info

## File Structure

```
components/Tag/
  ├── Tag.tsx          # Main component with forwardRef
  ├── Tag.module.css   # Styles using token CSS variables
  ├── types.ts         # TypeScript interfaces
  └── index.ts         # Exports
```

## Decisions

- **Not reusing Chip**: Chip is interactive (selected/unselected, delete). Tag is display-only with color semantics.
- **Not reusing Badge**: Badge is a status dot/count. Tag is an inline label.
- **Custom color via single prop**: Auto-generates bg/border from one color value, simpler API than separate bg/text props.
