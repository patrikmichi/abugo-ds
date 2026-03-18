# Fonts

This directory contains the **Venn** font family for the Reservio project.

## Font Files

- `Venn_Rg.ttf` - Regular (400)
- `Venn_Md.ttf` - Medium (500)
- `Venn_Bd.ttf` - Bold (700)

## Usage

### Next.js App

Fonts are automatically loaded via `app/layout.tsx` using Next.js font optimization:

```tsx
import localFont from 'next/font/local';

const venn = localFont({
  src: [
    { path: '../public/fonts/Venn_Rg.ttf', weight: '400' },
    { path: '../public/fonts/Venn_Md.ttf', weight: '500' },
    { path: '../public/fonts/Venn_Bd.ttf', weight: '700' },
  ],
  variable: '--font-venn',
});
```

The font is available via CSS variable: `var(--font-venn)`

### CSS

The font is used in:
- `app/globals.css` - Global body font
- `styles/tokens.css` - Design token font family variable

### Storybook

Fonts are loaded via `fonts.css` in the Storybook preview configuration.

## Design Token Reference

The font family is referenced in design tokens as:
- Token: `typography-fontFamily-sans`
- Value: `var(--font-venn), Venn, sans-serif`
