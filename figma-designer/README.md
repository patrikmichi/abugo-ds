# Figma Designer

A Figma plugin for creating component sets from Design JSON files. This tool bridges the gap between React components with CSS design tokens and Figma components with variables.

## Features

- **Parse React Components**: Automatically extract variant combinations, props, and CSS variables from React components
- **Generate Design JSON**: Create a standardized JSON format that maps React/CSS to Figma
- **Variable Resolution**: Use existing Figma variables or create new ones automatically
- **Component Set Creation**: Build complete Figma component sets with all variants

## Folder Structure

```
figma-designer/
├── package.json           # Dependencies and scripts
├── manifest.json          # Figma plugin manifest
├── tsconfig.json          # TypeScript configuration
├── vite.plugin.config.ts  # Vite config for plugin code
├── vite.ui.config.ts      # Vite config for UI
├── scripts/
│   └── parse-component.ts # React + CSS → Design JSON parser
├── src/
│   ├── plugin/
│   │   ├── main.ts              # Plugin entry point
│   │   ├── insertFromJson.ts    # Component set creation
│   │   └── resolveVariables.ts  # Variable resolution
│   ├── ui/
│   │   ├── index.html           # UI HTML
│   │   ├── main.tsx             # UI entry
│   │   └── App.tsx              # UI React component
│   └── schemas/
│       └── design-json.ts       # TypeScript types
└── examples/
    └── button.design.json       # Example output
```

## Installation

```bash
cd figma-designer
npm install
```

## Usage

### 1. Parse a React Component

Generate a Design JSON file from a React component:

```bash
# Parse Button component
npm run parse -- ../components/Button

# Or specify output path
npm run parse -- ../components/Button ./examples/button.design.json
```

### 2. Build the Plugin

```bash
# Build both plugin and UI
npm run build

# Or build in watch mode for development
npm run dev
```

### 3. Load in Figma

1. Open Figma Desktop
2. Go to Plugins → Development → Import plugin from manifest...
3. Select the `manifest.json` file from this folder
4. Run the plugin from Plugins → Development → Figma Designer

### 4. Use the Plugin

1. Open the plugin UI
2. Paste your Design JSON or upload a `.design.json` file
3. Preview the component details
4. Click "Insert Component Set" to create the component in Figma

## Design JSON Schema

The Design JSON format maps React component structure to Figma:

```typescript
interface DesignJson {
  meta: {
    name: string;           // Component name
    reactComponent: string; // Source React file
    version?: string;
  };
  variables: {
    [collectionName: string]: {
      modes: Array<{ id: string; name: string }>;
      variables: DesignVariable[];
    };
  };
  componentSet: {
    name: string;
    variantProperties: VariantProperty[];
    overridables: Overridable[];
    validCombinations: Record<string, string[]>;
    variants: VariantDefinition[];
  };
  layout: LayoutDefinition;
  layoutVariants?: LayoutVariants;
}
```

## Mapping Reference

| React / CSS | Figma |
|-------------|-------|
| `variant` prop | `Variant` property |
| `appearance` prop | `Appearance` property |
| `size` prop | `Size` property |
| `disabled`, `loading` | `State` property |
| `icon`, `iconPosition`, `iconOnly` | `Icon` property |
| `fullWidth` | `Full width` property |
| `children` | Overridable "Label" |
| `--token-primitive-*` | Primitives collection |
| `--token-semantic-*` | Semantic collection |
| `--token-component-*` | Components/{Name} collection |

## Variable Resolution

When inserting a component set:

1. **Use Existing**: If a variable with the same `figmaName` exists, it's used (no duplicate created)
2. **Create New**: If not found, a new variable is created in the specified collection
3. **No Duplicates**: Each `figmaName` is processed only once

## Development

### Scripts

- `npm run build` - Build plugin and UI
- `npm run dev` - Watch mode
- `npm run parse` - Parse a component to Design JSON

### Adding New Components

1. Run the parser on your component:
   ```bash
   npm run parse -- ../components/YourComponent
   ```

2. Review and adjust the generated JSON in `examples/`

3. Load the JSON in the Figma plugin to create the component set

## Sato-UI Style

This plugin follows Sato-UI conventions:

- **Variable Collections**: Primitives → Semantic → Components
- **Component Sets**: One set per component with variant properties
- **Modes**: Support for theme modes (light/dark)
- **Variable Binding**: Fills, strokes, and sizing bound to variables
