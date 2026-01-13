# Syncing Tokens to Figma Variables

## Overview

Your design tokens can be synced to Figma's native **Variables** feature in two ways:

1. **Figma Tokens Studio Plugin** (Recommended) - Automatic sync
2. **Figma Variables API** - Programmatic sync

---

## Method 1: Figma Tokens Studio → Figma Variables

### How It Works

1. **Import tokens into Figma Tokens Studio**
   - Open Figma Tokens Studio plugin
   - Go to **Settings** → **Import tokens**
   - Import `tokens.json` or individual files

2. **Enable Variables Sync**
   - In Tokens Studio, go to **Settings** → **Sync to Variables**
   - Enable "Sync tokens to Figma Variables"
   - Choose which collections to sync

3. **Automatic Mapping**
   - Tokens Studio automatically creates Figma Variables from your tokens
   - **Collections** → Figma Variable Collections
   - **Modes** → Figma Variable Modes (themes)
   - **Token types** → Figma Variable types:
     - `color` → Color Variable
     - `float`/`number` → Number Variable
     - `string` → String Variable
     - `boxShadow` → String Variable (as CSS)

4. **Sync Process**
   - Click **"Sync to Variables"** button
   - Tokens Studio creates/updates Variables in your Figma file
   - Variables are organized by collection
   - Modes (Reservio, Survio) become Variable Modes

### Token → Variable Mapping

| Token Property | Figma Variable Property |
|---------------|------------------------|
| Collection name | Variable Collection |
| Mode name | Variable Mode (theme) |
| Token name | Variable name |
| `$type: "color"` | Color Variable |
| `$type: "float"` | Number Variable |
| `$type: "string"` | String Variable |
| `$value: "{token.path}"` | Variable reference |

### Example Mapping

**Your Token:**
```json
{
  "colors": {
    "modes": {
      "Reservio": {
        "yellow": {
          "100": {
            "$type": "color",
            "$value": "#FFF9E6"
          }
        }
      }
    }
  }
}
```

**Becomes Figma Variable:**
- **Collection:** `colors`
- **Mode:** `Reservio`
- **Variable Name:** `yellow.100`
- **Type:** Color
- **Value:** `#FFF9E6`

---

## Method 2: Figma Variables API (Advanced)

### Direct API Sync

You can use the Figma REST API to create Variables programmatically:

```javascript
// Example: Create a color variable
POST https://api.figma.com/v1/files/{file_key}/variables
{
  "variableCollectionId": "collection-id",
  "name": "yellow.100",
  "resolvedType": "COLOR",
  "valuesByMode": {
    "Reservio": "#FFF9E6"
  }
}
```

### Requirements

- Figma API access token
- Variable Collection ID (create via API or UI)
- Mode IDs (create via API or UI)

---

## Your Token Structure Compatibility

### ✅ Compatible Features

1. **Modes Support**
   - Your tokens have modes: `Reservio`, `Survio`, `Mode 1`
   - These map directly to Figma Variable Modes

2. **Collections**
   - 15 collections will become 15 Variable Collections
   - Collections: `border`, `colors`, `spacing`, etc.

3. **Token Types**
   - `color` → Color Variables ✅
   - `float`/`number` → Number Variables ✅
   - `string` → String Variables ✅
   - `boxShadow` → String Variables (CSS) ✅

4. **References**
   - Token references `{token.path}` work in Variables
   - Figma Variables support aliases (references)

### ⚠️ Considerations

1. **Nested Structure**
   - Your tokens are deeply nested (e.g., `colors.modes.Reservio.yellow.100`)
   - Figma Variables use dot notation: `yellow.100`
   - Tokens Studio handles this automatically

2. **Hidden Tokens**
   - Tokens with `$hiddenFromPublishing: true` won't sync to Variables
   - This is expected behavior

3. **Semantic Tokens**
   - Semantic tokens reference primitives: `{grey.800}`
   - These become Variable aliases in Figma
   - Works seamlessly

---

## Step-by-Step: First Time Setup

### 1. Import Tokens to Tokens Studio

```
1. Open Figma
2. Launch "Tokens Studio" plugin
3. Settings → Import tokens
4. Select tokens.json
5. Click "Import"
```

### 2. Configure Variables Sync

```
1. In Tokens Studio, go to Settings
2. Enable "Sync to Variables"
3. Select collections to sync (or sync all)
4. Choose sync mode:
   - One-way (tokens → variables)
   - Two-way (bidirectional)
```

### 3. Sync to Variables

```
1. Click "Sync to Variables" button
2. Tokens Studio creates Variables
3. Check Variables panel in Figma (right sidebar)
4. Variables organized by collection
```

### 4. Use Variables in Designs

```
1. Select a layer
2. Open Variables panel
3. Choose collection and mode
4. Apply variable to property
```

---

## Sync Workflow

### One-Way Sync (Tokens → Variables)

```
tokens.json → Tokens Studio → Figma Variables
```

- Changes in tokens.json → Update in Tokens Studio → Sync to Variables
- Variables are read-only (managed by tokens)

### Two-Way Sync

```
tokens.json ↔ Tokens Studio ↔ Figma Variables
```

- Changes can flow both ways
- Requires careful conflict resolution

---

## Best Practices

1. **Use One-Way Sync Initially**
   - Start with tokens as source of truth
   - Variables are derived from tokens

2. **Organize by Collection**
   - Each token collection = one Variable Collection
   - Keeps Variables organized

3. **Use Modes for Themes**
   - Reservio and Survio become separate modes
   - Switch between themes easily

4. **Reference Tokens**
   - Semantic tokens reference primitives
   - Creates Variable aliases automatically

5. **Regular Syncs**
   - Sync after token updates
   - Keep Variables in sync with tokens

---

## Troubleshooting

### Variables Not Appearing

- Check if tokens are imported in Tokens Studio
- Verify "Sync to Variables" is enabled
- Ensure collections are selected for sync

### Reference Errors

- Verify token paths are correct
- Check that referenced tokens exist
- Ensure tokens are in same collection

### Mode Mismatches

- Ensure mode names match between tokens and Variables
- Create missing modes in Figma Variables first

---

## Your Current Setup

### Token Files
- `tokens.json` - Combined file (ready for import)
- `tokens.primitives.json` - Base tokens
- `tokens.semantic.json` - Semantic tokens
- `tokens.components.json` - Component tokens

### Collections (15)
- Primitives: `border`, `icon-size`, `radius`, `size`, `spacing`, `type`, `universal`, `colors`, `feature-colors`, `shadow`, `opacity`, `z-index`, `animation`
- Semantic: `semantic-tokens`
- Components: `component-tokens`

### Modes
- `Reservio` - Baseline brand
- `Survio` - Extended brand
- `Mode 1` - Default mode for primitives

---

## Next Steps

1. ✅ Import `tokens.json` into Figma Tokens Studio
2. ✅ Enable "Sync to Variables"
3. ✅ Sync to create Variables
4. ✅ Use Variables in your designs
5. ✅ Set up regular sync workflow

Your tokens are fully compatible with Figma Variables! 🎉
