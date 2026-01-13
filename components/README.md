# Component Library

This directory contains all React components generated from design tokens. All components use CSS Modules and are fully typed with TypeScript.

## Generated Components

All 35 components have been generated from your design tokens:

### Form Components
- **Input** - Text input with size and status variants
- **Field** - Form field wrapper
- **Textarea** - Multi-line text input
- **Select** - Dropdown select
- **Checkbox** - Checkbox input
- **Radio** - Radio button input
- **Toggle** - Toggle switch
- **File** - File upload input
- **Combobox** - Autocomplete input
- **Datepicker** - Date selection
- **Timepicker** - Time selection

### Button & Actions
- **Button** - Button with variants (primary, secondary, danger, etc.) and sizes
- **Link** - Link component
- **Chip** - Chip/tag component

### Feedback
- **Alert** - Alert messages with variants (success, danger, warning, info)
- **Toast** - Toast notifications
- **Modal** - Modal dialog
- **Popover** - Popover component
- **Tooltip** - Tooltip component
- **Loading** - Loading spinner
- **Progress** - Progress bar
- **Skeleton** - Loading skeleton

### Layout
- **Card** - Card component with hover and selected states
- **Divider** - Divider/separator
- **Drawer** - Side drawer

### Navigation
- **Tabs** - Tab navigation
- **Breadcrumbs** - Breadcrumb navigation
- **Pagination** - Pagination controls
- **Stepper** - Step indicator

### Data Display
- **Badge** - Badge component
- **Avatar** - Avatar component
- **Rating** - Rating component
- **Slider** - Range slider
- **Calendar** - Calendar component
- **Accordion** - Accordion/collapsible

## Usage

### Import Components

```typescript
import { Button, Input, Alert, Card } from '@/components';
```

### Example: Button

```tsx
import { Button } from '@/components';

function MyComponent() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}
```

### Example: Input

```tsx
import { Input } from '@/components';

function MyForm() {
  return (
    <Input
      size="md"
      status="enabled"
      placeholder="Enter text..."
    />
  );
}
```

### Example: Alert

```tsx
import { Alert } from '@/components';

function MyAlert() {
  return (
    <Alert variant="success" icon={<CheckIcon />}>
      Operation completed successfully!
    </Alert>
  );
}
```

### Example: Card

```tsx
import { Card } from '@/components';

function MyCard() {
  return (
    <Card variant="default" selected={false}>
      <h3>Card Title</h3>
      <p>Card content</p>
    </Card>
  );
}
```

## Component Structure

Each component follows this structure:

```
ComponentName/
  ├── ComponentName.tsx       # React component
  ├── ComponentName.module.css # CSS module with design tokens
  └── index.ts                # Export file
```

## Design Tokens

All components use design tokens from your token system:

- **Component tokens** - Component-specific styling
- **Semantic tokens** - Meaning-based tokens
- **Primitive tokens** - Base design values

Tokens are accessed via CSS variables:
```css
background-color: var(--token-component-button-primary-filled-background-default);
padding: var(--token-component-padding-x-button-md);
border-radius: var(--token-component-radius-button-md);
```

## Regenerating Components

To regenerate all components from tokens:

```bash
npm run build:components
```

This will:
1. Analyze component tokens
2. Generate React components with TypeScript
3. Generate CSS modules with design tokens
4. Create index files for exports

## Validation

Validate that all components use correct tokens:

```bash
npm run validate:tokens
```

## Customization

Components are generated but can be customized:

1. **Enhance generated components** - Add functionality, props, or logic
2. **Update CSS modules** - Adjust styles while keeping token references
3. **Extend components** - Create wrapper components with additional features

## Best Practices

1. **Use semantic tokens** - Prefer semantic tokens over primitives
2. **Follow token structure** - Use component tokens for component-specific styling
3. **Validate tokens** - Run validation before committing
4. **Type safety** - All components are fully typed
5. **Accessibility** - Add ARIA attributes as needed

## Related Documentation

- [CSS Modules Guide](../tokens/docs/CSS_MODULES_GUIDE.md) - Using tokens in CSS modules
- [Validation Guide](../tokens/docs/VALIDATION_GUIDE.md) - Token validation
- [Token Structure](../tokens/docs/TOKEN_STRUCTURE.md) - Token organization
