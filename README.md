# Design Tokens Repository

> Production-ready design tokens exported from Figma Tokens Studio, with TypeScript support and Next.js documentation.

This repository contains the complete design token system for the design system, including primitives, semantic tokens, and component tokens. All tokens are synced with Figma and ready for use in code.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
# Start Next.js documentation site
npm run dev

# Run Storybook
npm run storybook

# Type check
npm run type-check

# Build tokens
npm run build:tokens
```

---

## 📁 Repository Structure

```
figma tokens/
├── app/                    # Next.js app (documentation site)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── tokens/                 # Tokens root
│   ├── output/             # Generated files (for Tokens Studio)
│   │   ├── primitives.json
│   │   ├── semanticTokens.json
│   │   ├── componentTokens.json
│   │   ├── $metadata.json
│   │   └── $themes.json
│   ├── system/             # Source files (organized for maintainability)
│   │   ├── primitives/
│   │   ├── semanticTokens/
│   │   └── componentTokens/
│   ├── types/              # TypeScript type definitions
│   │   └── index.d.ts
│   ├── scripts/            # Build scripts (TypeScript)
│   │   ├── merge-tokens.ts
│   │   ├── split-tokens.ts
│   │   └── load-tokens.ts
│   └── docs/               # Documentation
├── storybook/              # Storybook documentation
│   ├── stories/
│   └── .storybook/
└── package.json
```

---

## 🛠️ Technology Stack

- **TypeScript** - Type-safe development
- **Next.js 15** - Documentation site
- **Storybook** - Component and token documentation
- **ESLint + Prettier** - Code quality and formatting

---

## 📖 Documentation

- **[Complete Token Reference](tokens/docs/TOKENS.md)** - All tokens documented
- **[CSS Modules Guide](tokens/docs/CSS_MODULES_GUIDE.md)** - Using tokens in CSS Modules
- **[Validation Guide](tokens/docs/VALIDATION_GUIDE.md)** - Automated token validation and linting
- **[Designer Guide](tokens/docs/DESIGNER_GUIDE.md)** - Using tokens in Figma
- **[Token Structure](tokens/docs/TOKEN_STRUCTURE.md)** - How tokens are organized

---

## 🎯 Token Architecture

Tokens follow a three-layer architecture:

1. **Primitives** → Raw values (colors, spacing, typography)
2. **Semantic Tokens** → Meaning-based tokens (content colors, backgrounds)
3. **Component Tokens** → Component-specific tokens using hybrid approach:
   - **Category-first** for shared properties (radius, gap, padding, shadow, etc.)
   - **Component-first** for unique properties (colors, heights, widths, etc.)

---

## 💻 Using in Code

### React Components

All components are generated from your design tokens:

```tsx
import { Button, Input, Alert, Card } from '@/components';

function MyComponent() {
  return (
    <>
      <Button variant="primary" size="md">Click me</Button>
      <Input size="md" status="enabled" />
      <Alert variant="success">Success message</Alert>
      <Card>Card content</Card>
    </>
  );
}
```

**Generate components:**
```bash
npm run build:components
```

See [Components README](components/README.md) for complete documentation.

### CSS Modules (Recommended)

All tokens are available as CSS custom properties (CSS variables) in CSS Modules:

```css
/* Button.module.css */
.button {
  padding: var(--token-component-button-padding-sm);
  background-color: var(--token-semantic-background-active-accent-default);
  color: var(--token-semantic-content-passive-on-accent);
}
```

**Generate CSS variables:**
```bash
npm run build:css-variables
```

See [CSS Modules Guide](tokens/docs/CSS_MODULES_GUIDE.md) for complete documentation.

### TypeScript

```typescript
import { loadTokens } from '@tokens/scripts/load-tokens';

const { primitives, semanticTokens, componentTokens } = loadTokens();
```


---

## 🔄 Syncing with Figma

1. Open Figma and launch the **Tokens Studio** plugin
2. Go to **Sync** settings
3. Enter your Personal Access Token (stored in `.env`)
4. The plugin will automatically sync tokens between Figma and this repository

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run storybook        # Start Storybook
npm run type-check       # TypeScript type checking

# Build
npm run build            # Build Next.js app
npm run build:tokens     # Merge token files
npm run build:css-variables  # Generate CSS variables from tokens
npm run build:token-types    # Generate TypeScript types for tokens
npm run build:components     # Generate React components from tokens

# Validation
npm run validate:tokens  # Validate token usage in CSS modules

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
```

---

## 🎨 Path Aliases

All paths use `@tokens/` aliases for consistency:

- `@tokens/scripts/*` - Build scripts
- `@tokens/docs/*` - Documentation
- `@tokens/output/*` - Generated token files
- `@tokens/system/*` - Source token files

Configured in:
- `tsconfig.json` - TypeScript
- `next.config.ts` - Next.js
- `storybook/.storybook/main.ts` - Storybook

---

## 🤝 Contributing

1. **Update token files** in `tokens/system/`
2. **Regenerate tokens**: `npm run build:tokens`
3. **Regenerate CSS variables**: `npm run build:css-variables`
4. **Regenerate TypeScript types**: `npm run build:token-types`
5. **Validate tokens**: `npm run validate:tokens`
6. **Type check**: `npm run type-check`
7. **Test**: `npm run dev` and `npm run storybook`
8. **Sync with Figma**: Use Tokens Studio plugin

### Automated Validation

The repository includes automated validation that:
- ✅ Checks for missing tokens in CSS modules
- ✅ Warns about deprecated tokens
- ✅ Generates TypeScript types
- ✅ Runs automatically on commit (via pre-commit hooks)

See [Validation Guide](tokens/docs/VALIDATION_GUIDE.md) for details.

---

## 📄 License

[Add your license here]
