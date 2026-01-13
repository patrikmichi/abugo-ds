# Component Library

Complete component library generated from design tokens. All components use CSS Modules and are fully typed with TypeScript.

## 📦 Components

### Form Components
- ✅ **Input** - Text input with sizes and states
- ✅ **Textarea** - Multi-line text input
- ✅ **Select** - Dropdown select
- ✅ **Checkbox** - Checkbox input with label
- ✅ **Radio** - Radio button input
- ✅ **Toggle** - Toggle switch
- ✅ **Field** - Form field wrapper

### Button & Actions
- ✅ **Button** - Button with variants (primary, secondary, danger, etc.) and types (filled, plain, outline)
- ✅ **Link** - Link component with states
- ✅ **Chip** - Chip/tag component with selection

### Feedback
- ✅ **Alert** - Alert messages with variants (success, danger, warning, info)
- ✅ **Toast** - Toast notifications
- ✅ **Modal** - Modal dialog with overlay
- ✅ **Popover** - Popover component
- ✅ **Tooltip** - Tooltip component
- ✅ **Progress** - Progress bar with variants
- ✅ **Skeleton** - Loading skeleton
- ✅ **Loading** - Loading spinner

### Layout
- ✅ **Card** - Card component with hover and selected states
- ✅ **Divider** - Divider/separator

### Navigation
- ✅ **Tabs** - Tab navigation with state management
- ✅ **Breadcrumbs** - Breadcrumb navigation
- ✅ **Pagination** - Pagination controls
- ✅ **Stepper** - Step indicator

### Data Display
- ✅ **Badge** - Badge component with variants
- ✅ **Avatar** - Avatar component
- ✅ **Rating** - Rating component
- ✅ **Slider** - Range slider
- ✅ **Calendar** - Calendar component
- ✅ **Accordion** - Accordion/collapsible

### Other
- ✅ **Combobox** - Autocomplete input
- ✅ **Datepicker** - Date selection
- ✅ **Timepicker** - Time selection
- ✅ **File** - File upload input
- ✅ **Drawer** - Side drawer

## 🎨 Design Token Integration

All components use design tokens from your token system:

- **Component tokens** - Component-specific styling
- **Semantic tokens** - Meaning-based tokens
- **Primitive tokens** - Base design values

### Example Usage

```tsx
import { Button, Input, Alert, Card } from '@/components';

function MyComponent() {
  return (
    <>
      <Button variant="primary" type="filled" size="md">
        Click me
      </Button>
      <Input size="md" status="enabled" placeholder="Enter text..." />
      <Alert variant="success">Success message</Alert>
      <Card variant="default">Card content</Card>
    </>
  );
}
```

## 📚 Storybook

View all components in Storybook:

```bash
npm run storybook
```

Stories are organized by category:
- **Components/Button** - Button variants and states
- **Components/Input** - Input sizes and states
- **Components/Alert** - Alert variants
- **Components/Card** - Card variants
- **Components/Form** - All form controls
- **Components/Navigation** - Navigation components
- **Components/Feedback** - Feedback components
- **Components/Data Display** - Data display components
- **Components/All Components** - Complete showcase

## 🔧 Regenerating Components

To regenerate all components from tokens:

```bash
npm run build:components
```

## ✅ Validation

Validate that all components use correct tokens:

```bash
npm run validate:tokens
```

## 📝 Component Structure

Each component follows this structure:

```
ComponentName/
  ├── ComponentName.tsx       # React component with TypeScript
  ├── ComponentName.module.css # CSS module with design tokens
  └── index.ts                # Export file
```

## 🎯 Features

- ✅ **Token-based styling** - All styles use design tokens
- ✅ **Type safety** - Full TypeScript support
- ✅ **CSS Modules** - Scoped styles
- ✅ **Variants and sizes** - Component-specific props
- ✅ **Validation ready** - Works with token validation system
- ✅ **Storybook integration** - All components documented

## 📖 Related Documentation

- [CSS Modules Guide](tokens/docs/CSS_MODULES_GUIDE.md) - Using tokens in CSS modules
- [Validation Guide](tokens/docs/VALIDATION_GUIDE.md) - Token validation
- [Token Structure](tokens/docs/TOKEN_STRUCTURE.md) - Token organization
