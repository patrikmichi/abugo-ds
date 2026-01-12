# Figma Integration Guide

This guide explains how to link and use design tokens in Figma.

## Linking Tokens to Figma

### Step 1: Install Tokens Studio Plugin

1. Open Figma
2. Go to **Plugins** → **Browse plugins**
3. Search for "Tokens Studio"
4. Install the plugin

### Step 2: Connect Repository

1. Open **Tokens Studio** plugin
2. Go to **Sync** tab
3. Enter your Personal Access Token:
   ```
   pat_ebf8c29a_62db_449f_b55c_c60451a17d67
   ```
4. Select your repository: `patrikmichi/abugo-ds`
5. Click **Sync**

### Step 3: Map to Figma Variables

Tokens Studio will automatically create Figma Variables from your tokens:

- **Color tokens** → Figma Color Variables
- **Spacing tokens** → Figma Number Variables  
- **Typography tokens** → Figma Typography Variables
- **Shadow tokens** → Figma Shadow Variables

## Using Tokens in Figma

### Applying Color Tokens

1. Select a layer
2. Open **Design** panel
3. Click on fill/stroke color
4. Select **Variables** tab
5. Choose from available color tokens:
   - `primitives/brand/500`
   - `semanticTokens/background-active-accent-default`
   - `componentTokens/button/primary/boxed/background/default`

### Applying Spacing Tokens

1. Select a frame or component
2. Use **Auto Layout** or **Constraints**
3. Set padding/margin values
4. Click the **link icon** to use variables
5. Select spacing token:
   - `primitives/spacing-4`
   - `semanticTokens/padding/s`

### Applying Typography Tokens

1. Select text layer
2. Open **Text** panel
3. Click **Text styles** dropdown
4. Create or edit text style
5. Link to typography tokens:
   - `semanticTokens/typography/headline-size/h1`
   - `semanticTokens/typography/body-size/md`

### Applying Border Radius Tokens

1. Select a layer
2. Open **Design** panel
3. Set corner radius
4. Link to radius token:
   - `primitives/radius-2`
   - `semanticTokens/radius/sm`

## Token Naming in Figma

Tokens appear in Figma with the following structure:

```
Collection Name / Category / Token Name
```

**Examples:**
- `primitives / brand / 500`
- `semanticTokens / background-active-accent-default`
- `componentTokens / button / primary / boxed / background / default`

## Component Token Usage

When building components in Figma, use component tokens for consistency:

### Button Component

- Background: `componentTokens/button/primary/boxed/background/default`
- Text: `componentTokens/button/primary/boxed/content/default`
- Radius: `componentTokens/button/radius/sm`
- Padding: `componentTokens/button/padding/x/md`

### Field Component

- Height: `componentTokens/field/height/md`
- Border: `componentTokens/field/status/enabled/border`
- Background: `componentTokens/field/status/enabled/background`
- Text: `componentTokens/field/content/value/default`

## Best Practices

1. **Always use semantic tokens** in components (not primitives directly)
2. **Use component tokens** for component-specific styling
3. **Reference tokens** rather than hardcoding values
4. **Keep tokens synced** by running sync regularly
5. **Document token usage** in component descriptions

## Troubleshooting

### Tokens Not Appearing

- Check that sync completed successfully
- Verify Personal Access Token is correct
- Ensure token files are in correct format

### Token Values Not Updating

- Run sync again in Tokens Studio
- Check if token file was modified
- Verify token reference path is correct

### Missing Tokens

- Check token file structure
- Verify token name matches exactly
- Ensure token has correct `$type` property

## Links

- [Figma Tokens Studio Documentation](https://docs.tokens.studio/)
- [Token Documentation](./TOKENS.md)
- [Repository README](../README.md)
