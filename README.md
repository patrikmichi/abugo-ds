# Design Tokens Repository

> Design tokens exported from Figma Tokens Studio, ready for use in code and design tools.

This repository contains the complete design token system for the design system, including primitives, semantic tokens, and component tokens. All tokens are synced with Figma and can be used in code via Panda CSS.

---

## 🚀 Quick Start

### For Designers

1. **Sync with Figma**: Use the Tokens Studio plugin to sync tokens
2. **Use Semantic Tokens**: For new components, use semantic tokens (see [Designer Guide](docs/DESIGNER_GUIDE.md))
3. **View in Storybook**: Run `npm run storybook` to see all tokens visually

### For Developers

1. **Install dependencies**: `npm install`
2. **Generate CSS**: `npm run panda:codegen` to generate CSS utilities
3. **Use tokens**: Import from `styled-system/` (see [Developer Guide](docs/DEVELOPER_GUIDE.md))

---

## 📁 Repository Structure

```
figma tokens/
├── tokens/              # Token files (JSON)
│   ├── primitives.json      # Base tokens
│   ├── semanticTokens.json  # Semantic tokens
│   └── componentTokens.json # Component tokens
├── docs/                # Documentation
│   ├── TOKENS.md           # Complete token reference
│   ├── DESIGNER_GUIDE.md   # Guide for designers
│   └── DEVELOPER_GUIDE.md  # Guide for developers
├── styled-system/       # Generated Panda CSS (auto-generated)
├── stories/             # Storybook stories
└── panda.config.mjs     # Panda CSS configuration
```

---

## 📚 Documentation

- **[Token Reference](docs/TOKENS.md)** - Complete reference of all tokens
- **[Designer Guide](docs/DESIGNER_GUIDE.md)** - How to use tokens in Figma for new components
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - How to use tokens in code with Panda CSS

---

## 🔄 Syncing with Figma

### Setup

1. Open Figma and launch the **Tokens Studio** plugin
2. Go to **Sync** settings
3. Enter your Personal Access Token (stored in `.env`)

The plugin will automatically:
- Create Figma Variables from tokens
- Sync changes between Figma and this repository
- Maintain token references and structure

### Token Structure

Tokens follow a three-layer architecture:
- **Primitives** → Raw values (colors, spacing, typography)
- **Semantic Tokens** → Meaning-based tokens (content colors, backgrounds)
- **Component Tokens** → Component-specific tokens (buttons, fields, etc.)

See [Token Reference](docs/TOKENS.md) for complete details.

---

## 💻 Using in Code

### Panda CSS

This repository includes Panda CSS configuration that generates CSS utilities from tokens.

**Generate CSS system:**
```bash
npm run panda:codegen
```

**Use in code:**
```tsx
import { css } from '../styled-system/css';

const button = css({
  backgroundColor: 'brand.700',
  color: 'content-passive-on-accent',
  padding: 'spacing-4',
  borderRadius: 'radius-2',
});
```

See [Developer Guide](docs/DEVELOPER_GUIDE.md) for complete examples.

---

## 📖 Viewing Tokens

### Storybook

View all tokens in an interactive Storybook:

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006)

---

## 🎨 Token Naming

- **Token names**: kebab-case (W3C DTCG compliance)
- **Typography properties**: camelCase (W3C DTCG standard)
- **Size abbreviations**: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

---

## 🎯 Themes

The design system supports two themes:
- **Reservio** - Baseline theme
- **Survio** - Extended theme

Both themes use the same token structure, with brand-specific values handled at the primitive level.

---

## 📝 Scripts

```bash
# Generate documentation
npm run generate-docs

# Generate Panda CSS system
npm run panda:codegen

# Watch mode for Panda CSS
npm run panda:watch

# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

---

## 🔐 Security

The Personal Access Token (PAT) is stored in `.env` (gitignored). Never commit tokens to version control.

---

## 🤝 Contributing

When adding or modifying tokens:

1. **Update token files** in `tokens/`
2. **Regenerate documentation**: `npm run generate-docs`
3. **Regenerate CSS**: `npm run panda:codegen`
4. **Test in Storybook**: `npm run storybook`
5. **Sync with Figma**: Use Tokens Studio plugin

---

## 📖 Learn More

- [Complete Token Reference](docs/TOKENS.md)
- [Designer Guide](docs/DESIGNER_GUIDE.md) - Using tokens in Figma
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Using tokens in code
- [Figma Tokens Studio Docs](https://docs.tokens.studio/)

---

## 📄 License

[Add your license here]
