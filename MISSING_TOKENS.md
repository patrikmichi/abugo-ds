# Missing Tokens Analysis

Based on the Button component implementation and Figma designs, here are the tokens that are missing or could be improved:

## 🔴 Critical Missing Tokens

### 1. Button Loading Spinner Colors
**Current:** Only one generic loading spinner color token exists
- `--token-component-loading-spinner-content: #5690f5`

**Missing:** Loading spinner colors per button variant/type/state
- `button.{variant}.{type}.loading.spinner.color` - Spinner color for each variant
  - Primary filled: white spinner
  - Primary plain/outline: blue spinner  
  - Secondary outline: blue spinner
  - Danger filled: white spinner
  - Danger plain/outline: red spinner
  - Tertiary outline: gray spinner
  - Upgrade filled: white spinner

**Suggested structure:**
```json
{
  "button": {
    "primary": {
      "filled": {
        "loading": {
          "spinner": {
            "$value": "{content.passive.on.accent}"
          }
        }
      },
      "plain": {
        "loading": {
          "spinner": {
            "$value": "{content.active.accent.default}"
          }
        }
      }
    }
  }
}
```

### 2. Button Icon Colors
**Current:** Icons inherit content color (works but not explicit)

**Missing:** Explicit icon color tokens per variant/type/state
- `button.{variant}.{type}.icon.{state}` - Icon color tokens
  - Would allow different icon colors if needed
  - Better semantic meaning

**Suggested structure:**
```json
{
  "button": {
    "primary": {
      "filled": {
        "icon": {
          "default": {
            "$value": "{content.passive.on.accent}"
          },
          "hover": {
            "$value": "{content.passive.on.accent}"
          },
          "disabled": {
            "$value": "{content.passive.on.accent}"
          }
        }
      }
    }
  }
}
```

### 3. Danger Button Disabled States
**Current:** Missing disabled state for `danger.filled`
- `button.danger.filled.background.disabled` - ❌ Missing
- `button.danger.filled.content.disabled` - ❌ Missing (currently uses generic disabled)

**Suggested:**
```json
{
  "danger": {
    "filled": {
      "background": {
        "disabled": {
          "$value": "{background.active.danger.disabled}"
        }
      },
      "content": {
        "disabled": {
          "$value": "{content.passive.on.danger}"
        }
      }
    }
  }
}
```

### 4. Icon-Only Button Specific Tokens
**Current:** Icon-only buttons use same padding/height as text buttons

**Missing:** Specific tokens for icon-only buttons
- `button.iconOnly.padding.{size}` - Padding for icon-only buttons (typically 0 or minimal)
- `button.iconOnly.minWidth.{size}` - Minimum width for icon-only buttons (should equal height)

**Note:** Currently handled in CSS with `padding: 0` and `width: height`, but could be tokenized for consistency.

## 🟡 Nice-to-Have Missing Tokens

### 5. Button Animation Tokens
**Current:** Uses generic `animation.field.duration` and `animation.field.easing`

**Missing:** Button-specific animation tokens
- `button.animation.duration` - Button-specific animation duration
- `button.animation.easing` - Button-specific animation easing

**Note:** Current implementation works fine, but button-specific tokens would be more semantic.

### 6. Button Focus States
**Current:** No explicit focus state tokens (relies on browser default or hover state)

**Missing:** Focus ring/outline tokens
- `button.{variant}.{type}.focus.outline` - Focus outline color
- `button.{variant}.{type}.focus.outlineWidth` - Focus outline width
- `button.{variant}.{type}.focus.outlineOffset` - Focus outline offset

### 7. Button Shadow Tokens
**Current:** No shadow tokens for buttons

**Missing:** Shadow tokens for elevated buttons (if needed)
- `button.{variant}.{type}.shadow.{state}` - Shadow for buttons
- Could be useful for floating action buttons or elevated states

## ✅ Tokens That Are Present (Good!)

All these tokens exist and are being used correctly:

### Typography
- ✅ `typography.font-family-sans`
- ✅ `typography.font-size-button.{sm,md,lg}`
- ✅ `typography.line-height-button.{sm,md,lg}`
- ✅ `typography.text-case-uppercase`
- ✅ `typography.letter-spacing-button`
- ✅ `typography.letter-spacing-button-large`

### Spacing & Sizing
- ✅ `button.padding-x.{sm,md,lg}`
- ✅ `button.height.{sm,md,lg}`
- ✅ `button.gap.icon.{sm,md,lg}`
- ✅ `button.radius.{sm,md,lg}`

### Icon Sizing
- ✅ `icon.button.{sm,md,lg}`

### Colors (Most Variants)
- ✅ All primary variant colors (filled, plain)
- ✅ All secondary variant colors (outline, plain)
- ✅ All tertiary variant colors (outline, plain)
- ✅ All upgrade variant colors (filled, plain)
- ✅ Most danger variant colors (missing disabled for filled)

### Animation
- ✅ `animation.field.duration`
- ✅ `animation.field.easing`

## 📋 Summary

**Critical (Should Add):**
1. Loading spinner colors per variant/type
2. Danger filled disabled states
3. Icon color tokens (optional but recommended)

**Nice-to-Have:**
4. Icon-only button specific tokens
5. Button-specific animation tokens
6. Focus state tokens
7. Shadow tokens (if needed)

## 🔧 Implementation Notes

- Most missing tokens can reference existing semantic tokens
- Loading spinner colors should match content colors for each variant
- Icon colors can initially inherit from content colors (current approach works)
- Focus states might be handled via CSS focus-visible pseudo-class
