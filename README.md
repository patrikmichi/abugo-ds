# Design Tokens Repository

> Production-ready design tokens exported from Figma Tokens Studio, with TypeScript support and Next.js documentation.

This repository contains the complete design token system for the design system, including primitives, semantic tokens, and component tokens. All tokens are synced with Figma and can be used in code via Panda CSS.

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

# Generate Panda CSS
npm run panda:codegen

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
├── panda/                  # Panda CSS
│   ├── panda.config.mjs
│   └── styled-system/
└── package.json
```

---

## 🛠️ Technology Stack

- **TypeScript** - Type-safe development
- **Next.js 15** - Documentation site
- **Storybook** - Component and token documentation
- **Panda CSS** - CSS-in-JS with design tokens
- **ESLint + Prettier** - Code quality and formatting

---

## 📖 Documentation

- **[Complete Token Reference](tokens/docs/TOKENS.md)** - All tokens documented
- **[Designer Guide](tokens/docs/DESIGNER_GUIDE.md)** - Using tokens in Figma
- **[Developer Guide](tokens/docs/DEVELOPER_GUIDE.md)** - Using tokens in code
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

### TypeScript

```typescript
import { loadTokens } from '@tokens/scripts/load-tokens';

const { primitives, semanticTokens, componentTokens } = loadTokens();
```

### Panda CSS

```tsx
import { css } from '../panda/styled-system/css';

const button = css({
  backgroundColor: 'brand.700',
  color: 'content-passive-on-accent',
  padding: 'spacing-4',
  borderRadius: 'radius-2',
});
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
npm run panda:codegen    # Generate Panda CSS

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
3. **Type check**: `npm run type-check`
4. **Test**: `npm run dev` and `npm run storybook`
5. **Sync with Figma**: Use Tokens Studio plugin

---

## 📄 License

[Add your license here]
