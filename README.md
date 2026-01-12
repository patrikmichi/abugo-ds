# Figma Tokens Studio Configuration

## Personal Access Token (PAT)

Your Token Studio PAT is configured in `.env`:

```
TOKEN_STUDIO_PAT=pat_ebf8c29a_62db_449f_b55c_c60451a17d67
```

## Token Structure

This repository contains design tokens exported from Figma Tokens Studio. The tokens follow the **[property]-[participation]-[intent]** naming structure and are organized into separated files for better management.

### Primitives (Base Tokens)

These are the foundational design tokens that other tokens reference:

1. **colors** - Unified color collection with brand modes
   - **Reservio (baseline)**: Complete color system with 10 families
     - Yellow, Grey, Upgrade, Brand, Aqua, Purple, Negative, Success, Warning, Brown
     - All colors use standardized {scale} naming (100-800)
   - **Survio (extension)**: Brand-specific colors that extend from baseline
     - Brand, Active, Grey, Success, Upgrade, Negative, Warning

2. **feature-colors** - Feature-specific color palettes
   - **Reservio (baseline)**: Feature colors for specific product features
     - passes (credits, punch cards, memberships)
     - ai-features

3. **border** - Border width values
   - border-0, border-1, border-2, border-3

4. **icon-size** - Icon size scale
   - icon-size-1 through icon-size-8 (16px to 64px)

5. **radius** - Border radius values
   - radius-0 through radius-6, radius-round

6. **size** - Size scale for controls
   - size-1 through size-6 (16px to 56px)

7. **spacing** - Spacing scale
   - Values from 0.5 to 30 (2px to 120px)

8. **type** - Typography scale
   - Font sizes (font-size-1 through font-size-9)
   - Line height scales (tight, base, relaxed, loose)
   - Font weights (light, normal, medium, semibold, bold)

9. **universal** - Universal tokens
   - transparent, not assigned

10. **shadow** - Box shadow values
    - shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-inner

11. **opacity** - Opacity values
    - opacity-0 through opacity-100 (0% to 100% in increments)

12. **z-index** - Z-index layering values
    - z-base, z-dropdown, z-sticky, z-fixed, z-modal-backdrop, z-modal, z-popover, z-tooltip

13. **animation** - Animation tokens
    - Duration: instant, fast, base, slow, slower, slowest
    - Easing: linear, ease-in, ease-out, ease-in-out

### Semantic Tokens

Semantic tokens reference primitives and provide meaning-based naming following the [property]-[participation]-[intent] structure:

**Property Categories:**
- `content.*` - Text/content colors (property: content)
- `background.*` - Background colors (property: background)
- `border.*` - Border colors and widths (property: border)
- `padding.*` - Spacing tokens (property: spacing)
- `typography.*` - Typography tokens (property: typography)
- `radius.*` - Border radius tokens (property: radius)
- `icon.*` - Icon size tokens (property: icon)
- `gap.*` - Gap spacing tokens (property: gap)
- `control.*` - Control height tokens (property: control)
- `custom.*` - Feature-specific semantic tokens (property: custom)
  - `notes` - Notes feature colors (references primitives)
  - `rating` - Rating feature colors (references primitives)

### Component Tokens

Component-specific tokens that reference semantic tokens:
- `button.*` - Button styling tokens
- `field.*` - Form field tokens
- `toggle.*` - Toggle component tokens
- `checkbox.*` - Checkbox tokens
- `radio-button.*` - Radio button tokens
- `chip.*` - Chip component tokens
- `alert.*` - Alert component tokens
- `toast.*` - Toast notification tokens
- `card.*` - Card component tokens
- And more...

## How to Use

### Syncing with Figma Tokens Studio

1. Open Figma and launch the **Tokens Studio** plugin
2. Go to the **Sync** settings
3. When prompted for a Personal Access Token, enter:
   ```
   pat_ebf8c29a_62db_449f_b55c_c60451a17d67
   ```
4. The plugin will use this token to authenticate and sync your design tokens

### File Structure

```
figma tokens/
├── .env                    # Personal Access Token (gitignored)
├── tokens.primitives.json # Primitive/base tokens (13 collections)
├── tokens.semantic.json  # Semantic tokens (follows [property]-[participation]-[intent])
├── tokens.components.json # Component tokens
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

**Note:** To sync with Figma Tokens Studio, you'll need to combine the separated files into a single `tokens.json` file, or export directly from Figma.

## Security Note

The PAT is stored in `.env` which is already listed in `.gitignore` to prevent committing sensitive tokens to version control.
