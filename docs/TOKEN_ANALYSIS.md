# Component Token Analysis Report

> **Generated**: 2026-01-12  
> **Purpose**: Comprehensive analysis of all components to identify missing tokens, hardcoded values, deprecated tokens, and token usage issues

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Components Without Token Definitions](#components-without-token-definitions)
- [Hardcoded Values in CSS](#hardcoded-values-in-css)
- [Hardcoded Values in TypeScript/TSX](#hardcoded-values-in-typescripttsx)
- [Missing Token Fallbacks](#missing-token-fallbacks)
- [Deprecated Token Usage](#deprecated-token-usage)
- [Token Usage Issues](#token-usage-issues)
- [Component-by-Component Breakdown](#component-by-component-breakdown)
- [Recommendations](#recommendations)

---

## Executive Summary

### Statistics
- **Total Components Analyzed**: 53
- **Components with Token Definitions**: 33
- **Components Missing Token Definitions**: 20
- **Hardcoded Color Values Found**: 500+ instances
- **Hardcoded Spacing/Size Values Found**: 100+ instances
- **Missing Token Fallbacks**: 1,159+ instances
- **Components Using Primitive Tokens Directly**: 1 (Spinner)
- **Components with Inline Styles**: 37

### Critical Issues
1. **20 components** are missing token definitions entirely
2. **Extensive hardcoded values** in both CSS and TSX files
3. **1,159+ fallback values** in `var()` declarations that should be proper tokens
4. **Inconsistent token usage** across components
5. **Direct primitive token usage** violates token architecture
6. **37 components** have inline styles that should be moved to CSS modules

---

## Components Without Token Definitions

The following components are **missing token definitions** in `tokens/system/componentTokens/components/`:

### High Priority (Frequently Used Components)

1. **Anchor** (`anchor.json`) - ❌ Missing
   - **Issues**: 
     - Uses many hardcoded fallback values (#fff, rgba values)
     - Hardcoded colors: `#fff`, `rgba(0, 0, 0, 0.45)`, `#538bff`, `#f0f0f0`
     - Hardcoded spacing: `8px`, `16px`, `4px`, `-16px`, `2px`, `1px`
     - Hardcoded shadow: `0 2px 8px rgba(0, 0, 0, 0.15)`
   - **Needs**: colors, spacing, typography, z-index, shadow, radius tokens
   - **Files**: `components/Anchor/Anchor.module.css`, `components/Anchor/Anchor.tsx`

2. **AutoComplete** (`autocomplete.json`) - ❌ Missing
   - **Issues**:
     - Extensive hardcoded colors: `#fff`, `#d9d9d9`, multiple rgba values
     - Hardcoded spacing: `4px`, `6px`, `3px`, `8px`, `12px`, `256px`
     - Hardcoded shadows and borders
   - **Needs**: panel, option, scrollbar, input tokens
   - **Files**: `components/AutoComplete/AutoComplete.module.css`, `components/AutoComplete/AutoComplete.tsx`

3. **ColorPicker** (`colorpicker.json`) - ❌ Missing
   - **Issues**:
     - Extensive hardcoded values throughout
     - Hardcoded colors: `#fff`, `#d9d9d9`, `#000`, `#1890ff`, `#f0f0f0`, multiple rgba values
     - Hardcoded spacing: `4px`, `8px`, `12px`, `2px`, `14px`, `20px`, `28px`, `180px`, `280px`
     - Inline styles in TSX: `width: '100px'`, `border: 'none'`, `border: '1px solid ...'`
   - **Needs**: trigger, panel, picker, preset, color swatch tokens
   - **Files**: `components/ColorPicker/ColorPicker.module.css`, `components/ColorPicker/ColorPicker.tsx`

4. **Dropdown** (`dropdown.json`) - ❌ Missing
   - **Issues**:
     - Minimal but should have token definitions
     - Hardcoded fallback values
   - **Needs**: panel, margin, shadow tokens
   - **Files**: `components/Dropdown/Dropdown.module.css`, `components/Dropdown/Dropdown.tsx`

5. **Image** (`image.json`) - ❌ Missing
   - **Issues**:
     - Many hardcoded rgba values
     - Inline styles in TSX: `fontSize: '24px'`, `fontSize: '32px'`, `fontSize: '48px'`, `color: '#1890ff'`, `color: '#fff'`, `opacity: 0.3`
     - Hardcoded spacing: `16px`, `8px`, `40px`, `60px`, `50px`, `100px`, `90vw`, `90vh`, `80px`
   - **Needs**: background, preview, toolbar, mask tokens
   - **Files**: `components/Image/Image.module.css`, `components/Image/Image.tsx`

6. **Menu** (`menu.json`) - ❌ Missing
   - **Issues**:
     - Extensive hardcoded colors: `#fff`, `#001529`, multiple rgba values
     - Hardcoded spacing: `4px`, `5px`, `12px`, `8px`, `16px`, `120px`
     - Hardcoded shadows and borders
   - **Needs**: background, item, icon, submenu tokens
   - **Files**: `components/Menu/Menu.module.css`, `components/Menu/Menu.tsx`

7. **Notification** (`notification.json`) - ❌ Missing
   - **Issues**:
     - Uses hardcoded colors and shadows
     - Inline styles in TSX: `gap: '16px'`, `maxWidth: '384px'`, `right: '24px'`, `left: '24px'`
     - Hardcoded spacing: `16px`, `24px`, `384px`, `32px`
   - **Needs**: background, shadow, close button, container tokens
   - **Files**: `components/Notification/Notification.module.css`, `components/Notification/Notification.tsx`

8. **Segmented** (`segmented.json`) - ❌ Missing
   - **Issues**:
     - Hardcoded rgba values
     - Hardcoded colors: `rgba(0, 0, 0, 0.06)`, `#fff`, `rgba(0, 0, 0, 0.15)`, `rgba(0, 0, 0, 0.85)`, `#1890ff`, `rgba(0, 0, 0, 0.25)`
   - **Needs**: background, indicator, text, selected tokens
   - **Files**: `components/Segmented/Segmented.module.css`, `components/Segmented/Segmented.tsx`

9. **Spinner** (`spinner.json`) - ❌ Missing
   - **Issues**:
     - Uses hardcoded rgba values: `rgba(255, 255, 255, 0.8)`
     - **Uses primitive tokens directly** (violates architecture): `--token-primitive-icon-size-icon-size-1` through `icon-size-5`
     - Inline styles in TSX: `fontSize` based on size prop
   - **Needs**: color, label, size tokens (should use semantic/component tokens, not primitives)
   - **Files**: `components/Spinner/Spinner.module.css`, `components/Spinner/Spinner.tsx`

10. **Upload** (`upload.json`) - ❌ Missing
    - **Issues**:
      - Extensive inline styles in TSX: `fontSize: '16px'`, `fontSize: '48px'`, `fontSize: '32px'`, `fontSize: '24px'`, `color: '#538bff'`, `color: '#ff4d4f'`, `marginRight: '4px'`, `marginRight: '8px'`, `marginBottom: '16px'`, `opacity: 0.5`, `margin: '0 8px'`
      - Hardcoded values in CSS fallbacks
    - **Needs**: background, border, icon, drag area, file list tokens
    - **Files**: `components/Upload/Upload.module.css`, `components/Upload/Upload.tsx`

### Layout Components

11. **Flex** (`flex.json`) - ❌ Missing
    - **Issues**: Layout component with minimal styling, but should have token definitions for consistency
    - **Needs**: gap, padding tokens (if used)
    - **Files**: `components/Flex/Flex.tsx`

12. **Grid** (`grid.json`) - ❌ Missing
    - **Issues**: Layout component with minimal styling, but should have token definitions for consistency
    - **Needs**: gap, padding tokens (if used)
    - **Files**: `components/Grid/Grid.tsx`

### Form Components

13. **InputNumber** (`inputnumber.json`) - ❌ Missing
    - **Issues**: Should share tokens with Input/Field but may need specific tokens for stepper buttons
    - **Needs**: stepper button tokens
    - **Files**: `components/InputNumber/InputNumber.module.css`, `components/InputNumber/InputNumber.tsx`

14. **PhoneNumberField** (`phonenumberfield.json`) - ❌ Missing
    - **Issues**: Should share tokens with Field but may need specific tokens for country selector
    - **Needs**: country selector tokens
    - **Files**: `components/PhoneNumberField/PhoneNumberField.module.css`, `components/PhoneNumberField/PhoneNumberField.tsx`

15. **DurationPicker** (`durationpicker.json`) - ❌ Missing
    - **Issues**: Should share tokens with Timepicker/Datepicker but may need specific tokens
    - **Needs**: duration-specific tokens
    - **Files**: `components/DurationPicker/DurationPicker.module.css`, `components/DurationPicker/DurationPicker.tsx`

### Deleted Component

16. **File** (`file.json`) - ❌ Missing (Component deleted but token file may still exist)
    - **Status**: Component files deleted (`components/File/` removed)
    - **Action**: Remove token file if it exists

---

## Hardcoded Values in CSS

### Color Values (Hex and RGBA)

#### Components with Extensive Hardcoded Colors:

**Accordion** (Has tokens but many fallbacks)
- `#fafafa`, `#d9d9d9`, `#fff`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.45)`, `rgba(0, 0, 0, 0.04)`, `rgba(0, 0, 0, 0.06)`
- **Issue**: All fallback values should be proper tokens

**Alert** (Has tokens but Ant Design colors hardcoded)
- `#f6ffed`, `#b7eb8f`, `#52c41a`, `#e6f7ff`, `#91d5ff`, `#1890ff`, `#fffbe6`, `#ffe58f`, `#faad14`, `#fff2f0`, `#ffccc7`, `#ff4d4f`
- **Issue**: Ant Design color values hardcoded instead of using semantic tokens

**Anchor** (Missing tokens)
- `#fff`, `rgba(0, 0, 0, 0.45)`, `#538bff`, `#f0f0f0`
- **Issue**: Missing component token definitions

**AutoComplete** (Missing tokens)
- `#fff`, `#d9d9d9`, `rgba(0, 0, 0, 0.08)`, `rgba(0, 0, 0, 0.12)`, `rgba(0, 0, 0, 0.05)`, `rgba(0, 0, 0, 0.2)`, `rgba(0, 0, 0, 0.3)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.06)`, `rgba(24, 144, 255, 0.1)`, `rgba(24, 144, 255, 0.15)`, `rgba(0, 0, 0, 0.25)`
- **Issue**: All values should use semantic or component tokens

**Avatar** (Has tokens but fallbacks hardcoded)
- `#f0f0f0`, `#666`, `#1890ff`, `#fff`, `#e0e0e0`
- **Issue**: Some values have tokens, but fallbacks are hardcoded

**Badge** (Has tokens but status colors hardcoded)
- `#fff`, `#ff4d4f`, `rgba(0, 0, 0, 0.1)`, `#52c41a`, `#1890ff`, `#d9d9d9`, `#faad14`
- **Issue**: Status colors should use semantic tokens

**Breadcrumbs** (Has tokens but fallbacks hardcoded)
- `rgba(0, 0, 0, 0.45)`, `rgba(0, 0, 0, 0.85)`
- **Issue**: Should use semantic content tokens

**Checkbox** (Has tokens but Ant Design colors hardcoded)
- `#fff`, `#d9d9d9`, `#40a9ff`, `#1890ff`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.25)`, `#f5f5f5`
- **Issue**: Ant Design colors hardcoded

**ColorPicker** (Missing tokens)
- `#fff`, `#d9d9d9`, `rgba(0, 0, 0, 0.08)`, `rgba(0, 0, 0, 0.12)`, `rgba(0, 0, 0, 0.05)`, `#000`, `rgba(0, 0, 0, 0.1)`, `#1890ff`, `rgba(24, 144, 255, 0.2)`, `#f0f0f0`
- **Issue**: Missing component token definitions

**Datepicker** (Has tokens but many fallbacks)
- `#fff`, `#d9d9d9`, `rgba(0, 0, 0, 0.08)`, `rgba(0, 0, 0, 0.12)`, `rgba(0, 0, 0, 0.05)`, `rgba(0, 0, 0, 0.45)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.06)`, `#1890ff`, `#40a9ff`, `rgba(0, 0, 0, 0.25)`, `#f0f0f0`, `rgba(24, 144, 255, 0.06)`
- **Issue**: Should use calendar tokens (calendar.json exists)

**Divider** (Has tokens but fallbacks hardcoded)
- `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.45)`
- **Issue**: Should use semantic border/content tokens

**Image** (Missing tokens)
- `#f5f5f5`, `rgba(0, 0, 0, 0.25)`, `rgba(0, 0, 0, 0.5)`, `rgba(0, 0, 0, 0.75)`, `#fff`, `rgba(255, 255, 255, 0.1)`
- **Issue**: Missing component token definitions

**Menu** (Missing tokens)
- `#fff`, `#001529`, `rgba(255, 255, 255, 0.65)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.06)`, `rgba(24, 144, 255, 0.1)`, `#1890ff`, `rgba(0, 0, 0, 0.25)`, `#ff4d4f`, `rgba(255, 77, 79, 0.1)`, `rgba(255, 255, 255, 0.08)`, `rgba(24, 144, 255, 0.2)`, `rgba(255, 255, 255, 0.25)`
- **Issue**: Missing component token definitions

**Notification** (Missing tokens)
- `#fff`, `rgba(0, 0, 0, 0.08)`, `rgba(0, 0, 0, 0.12)`, `rgba(0, 0, 0, 0.05)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.65)`, `rgba(0, 0, 0, 0.45)`, `rgba(0, 0, 0, 0.06)`
- **Issue**: Missing component token definitions

**Segmented** (Missing tokens)
- `rgba(0, 0, 0, 0.06)`, `#fff`, `rgba(0, 0, 0, 0.15)`, `rgba(0, 0, 0, 0.85)`, `#1890ff`, `rgba(0, 0, 0, 0.25)`
- **Issue**: Missing component token definitions

**Slider** (Has tokens but many fallbacks)
- `#f5f5f5`, `#1890ff`, `rgba(0, 0, 0, 0.25)`, `#fff`, `#40a9ff`, `#096dd9`, `rgba(0, 0, 0, 0.12)`, `rgba(0, 0, 0, 0.15)`, `rgba(0, 0, 0, 0.45)`, `rgba(0, 0, 0, 0.25)`
- **Issue**: Should use slider tokens (slider.json exists)

**Spinner** (Missing tokens, uses primitives directly)
- `rgba(255, 255, 255, 0.8)`
- **Issue**: Missing component token definitions, uses `--token-primitive-icon-size-*` directly

**Tabs** (Has tokens but many fallbacks)
- `#f0f0f0`, `rgba(0, 0, 0, 0.85)`, `#1890ff`, `rgba(0, 0, 0, 0.25)`, `#fafafa`, `#d9d9d9`, `#fff`
- **Issue**: Should use tabs tokens (tabs.json exists)

**Timepicker** (Has tokens but many fallbacks)
- `#fff`, `#d9d9d9`, `rgba(0, 0, 0, 0.08)`, `rgba(0, 0, 0, 0.12)`, `rgba(0, 0, 0, 0.05)`, `rgba(0, 0, 0, 0.45)`, `rgba(0, 0, 0, 0.2)`, `rgba(0, 0, 0, 0.3)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.06)`, `#1890ff`, `#40a9ff`
- **Issue**: Should use timepicker tokens (timepicker.json exists)

**Toast** (Has tokens but many fallbacks)
- `#fff`, `rgba(0, 0, 0, 0.15)`, `#f6ffed`, `rgba(0, 0, 0, 0.85)`, `#b7eb8f`, `#52c41a`, `#fff2f0`, `#ffccc7`, `#ff4d4f`, `#fffbe6`, `#ffe58f`, `#faad14`, `#e6f7ff`
- **Issue**: Should use toast tokens (toast.json exists)

**Tooltip** (Has tokens but fallbacks hardcoded)
- `rgba(0, 0, 0, 0.75)`, `#fff`, `rgba(0, 0, 0, 0.15)`
- **Issue**: Should use tooltip tokens (tooltip.json exists)

### Spacing/Size Values (px, rem, em)

#### Hardcoded Pixel Values Found Across Components:

Common hardcoded values: `2px`, `3px`, `4px`, `6px`, `8px`, `10px`, `12px`, `14px`, `16px`, `20px`, `24px`, `28px`, `32px`, `40px`, `48px`, `50px`, `60px`, `70px`, `100px`, `120px`, `180px`, `200px`, `256px`, `280px`, `384px`, `2000px`

**Components with Most Hardcoded Spacing:**
- **Accordion**: `2000px` (max-height), `12px`, `16px`, `8px`, `12px`, `20px`
- **Alert**: `2px` (outline), `8px`, `15px`, `20px`, `12px`
- **Anchor**: `8px`, `16px`, `4px`, `-16px`, `2px`, `1px`
- **AutoComplete**: `4px`, `6px`, `3px`, `8px`, `12px`, `256px`
- **Badge**: `2px`, `6px`, `8px`, `3px`
- **ColorPicker**: `4px`, `8px`, `12px`, `2px`, `14px`, `20px`, `28px`, `180px`, `280px`
- **Image**: `16px`, `8px`, `40px`, `60px`, `50px`, `100px`, `90vw`, `90vh`, `80px`
- **Menu**: `4px`, `5px`, `12px`, `8px`, `16px`, `120px`
- **Notification**: `16px`, `24px`, `384px`, `32px`
- **Spinner**: `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`
- **Upload**: Many hardcoded values in TSX (see TSX section)

### Border Radius Values

Hardcoded radius values found: `2px`, `3px`, `4px`, `8px`
- **Issue**: Should use semantic or component radius tokens

### Shadow Values

Multiple hardcoded shadow values:
- `0 2px 8px rgba(0, 0, 0, 0.15)`
- `0 6px 16px 0 rgba(0, 0, 0, 0.08)`
- `0 4px 12px rgba(0, 0, 0, 0.15)`
- And many more variations
- **Issue**: Should use semantic shadow tokens

### Opacity Values

Hardcoded opacity values: `0.3`, `0.5`, `0.6`, `0.8`
- **Issue**: Should use semantic opacity tokens

---

## Hardcoded Values in TypeScript/TSX

### Icon Font Sizes (Inline Styles)

Found in **37 components** with inline styles. Common patterns:

- `fontSize: '14px'` - Select, Tabs
- `fontSize: '16px'` - Select, Timepicker, Datepicker, Field, ColorPicker, AutoComplete, Toast, Upload, Button
- `fontSize: '20px'` - Drawer
- `fontSize: '24px'` - Notification, Image, Modal
- `fontSize: '32px'` - Upload, Image
- `fontSize: '48px'` - Upload, Image

**Issue**: Should use icon size tokens or component-specific icon tokens

**Components with Icon Font Size Issues:**
- Upload: 12 instances
- Image: 11 instances
- Datepicker: 10 instances
- Notification: 6 instances
- ColorPicker: 4 instances
- Select/SelectDropdown: 4 instances
- Toast: 4 instances
- Field: 4 instances
- Modal: 3 instances
- And many more...

### Colors (Inline Styles)

- `color: '#1890ff'` - Upload, Image, Modal
- `color: '#538bff'` - Upload, Anchor (in CSS)
- `color: '#ff4d4f'` - Upload
- `color: '#fff'` - Image
- `color: '#52c41a'` - Modal (success)
- `color: '#faad14'` - Modal (warning)

**Issue**: Should use semantic or component tokens

### Spacing (Inline Styles)

- `marginRight: '4px'` - Upload, Timepicker, Datepicker
- `marginRight: '8px'` - Upload
- `gap: '16px'` - Notification, Toast, Modal
- `gap: '8px'` - Toast
- `margin: '0 8px'` - Upload
- `maxWidth: '384px'` - Notification
- `right: '24px'`, `left: '24px'` - Notification
- `top: '24px'` - Toast
- `width: '100px'` - ColorPicker
- `width: '100%'`, `height: '200px'` - Slider
- `marginBottom: '16px'` - Upload

**Issue**: Should use semantic spacing/gap tokens

### Other Hardcoded Values

- `opacity: 0.3` - Image
- `opacity: 0.5` - Image, Upload
- `border: 'none'` - ColorPicker
- `border: '1px solid ...'` - ColorPicker
- `display: 'flex'` - Modal (should use CSS classes)

---

## Missing Token Fallbacks

**1,159+ instances** of `var()` with hardcoded fallback values found across **43 CSS files**.

### Pattern:
```css
/* Bad: Hardcoded fallback */
background-color: var(--token-component-accordion-background, #fafafa);

/* Good: Should be */
background-color: var(--token-component-accordion-background);
/* Or reference semantic token */
background-color: var(--token-component-accordion-background, var(--token-semantic-background-passive-neutral-default));
```

### Components with Most Fallback Issues:

1. **Tabs** - 69 fallback values
2. **Stepper** - 80 fallback values
3. **Radio** - 81 fallback values
4. **Card** - 47 fallback values
5. **Skeleton** - 45 fallback values
6. **Alert** - 37 fallback values
7. **Toast** - 37 fallback values
8. **Drawer** - 27 fallback values
9. **Badge** - 28 fallback values
10. **Avatar** - 33 fallback values
11. **Accordion** - 33 fallback values
12. **Datepicker** - 51 fallback values
13. **Timepicker** - 26 fallback values
14. **Slider** - 29 fallback values
15. **ColorPicker** - 54 fallback values
16. **Menu** - 29 fallback values
17. **AutoComplete** - 17 fallback values
18. **Segmented** - 53 fallback values
19. **Notification** - 30 fallback values
20. **Anchor** - 25 fallback values

---

## Deprecated Token Usage

### How to Check for Deprecated Tokens

Deprecated tokens are marked in token files with:
```json
{
  "$extensions": {
    "design-tokens": {
      "deprecated": true,
      "replacedBy": "--token-semantic-new-token"
    }
  }
}
```

### Validation

Run the validation script to check for deprecated tokens:
```bash
npm run validate:tokens
```

This will:
- Check all CSS module files for deprecated token usage
- Provide warnings with replacement suggestions
- List all deprecated tokens in use

### Current Status

**Note**: A full audit of deprecated tokens requires running the validation script. The script checks:
- All `var(--token-*)` references in CSS module files
- Token existence in generated CSS variables
- Deprecated token usage
- Provides suggestions for replacements

---

## Token Usage Issues

### 1. Direct Primitive Token Usage

**Found in:**
- **Spinner**: Uses `--token-primitive-icon-size-icon-size-1` through `icon-size-5`

**Issue**: Components should NOT use primitive tokens directly. According to token architecture:
- Component tokens → Semantic tokens → Primitives
- Components should use semantic or component tokens, never primitives directly

**Fix**: Create spinner component tokens that reference semantic icon tokens

### 2. Inconsistent Token Naming

Some components use:
- `--token-component-{component}-{property}`
- Others use: `--token-component-{component}-{variant}-{property}`

**Issue**: Should follow consistent naming pattern as defined in token structure docs

### 3. Missing Semantic Token References

Many components should reference semantic tokens but use component tokens or hardcoded values instead:

**Examples:**
- Colors should use semantic tokens like `--token-semantic-content-passive-neutral-default`
- Spacing should use semantic tokens like `--token-semantic-gap-xs`
- Shadows should use semantic tokens like `--token-semantic-shadow-md`

### 4. Components Using Wrong Token Type

According to the DESIGNER_GUIDE.md, only base components should use component tokens. New components should use semantic tokens, but some components that aren't in the base list are using component tokens.

---

## Component-by-Component Breakdown

### Accordion
- **Status**: ✅ Has token definition
- **Issues**: 
  - 33 hardcoded fallback values
  - Some hardcoded colors (rgba values)
  - Hardcoded max-height (2000px)
- **Action**: Replace fallbacks, use semantic tokens for colors

### Alert
- **Status**: ✅ Has token definition
- **Issues**:
  - 37 hardcoded fallback values
  - Ant Design colors hardcoded as fallbacks
  - Should use semantic tokens for variant colors
- **Action**: Update to use semantic tokens

### Anchor
- **Status**: ❌ Missing token definition
- **Issues**:
  - 25 hardcoded fallback values
  - All values are hardcoded or use fallbacks
  - Missing component token file
- **Action**: Create anchor.json, replace all hardcoded values

### AutoComplete
- **Status**: ❌ Missing token definition
- **Issues**:
  - 17 hardcoded fallback values
  - Extensive hardcoded colors and spacing
  - Missing component token file
- **Action**: Create autocomplete.json, replace all hardcoded values

### Avatar
- **Status**: ✅ Has token definition
- **Issues**:
  - 33 hardcoded fallback values
  - Some hardcoded fallback values
  - Hardcoded border width (2px)
- **Action**: Replace fallbacks, use border width tokens

### Badge
- **Status**: ✅ Has token definition
- **Issues**:
  - 28 hardcoded fallback values
  - Hardcoded border width (2px)
  - Status colors should use semantic tokens
- **Action**: Use semantic tokens for status colors

### Breadcrumbs
- **Status**: ✅ Has token definition
- **Issues**:
  - 10 hardcoded fallback values
  - Hardcoded rgba color fallbacks
- **Action**: Replace with semantic content tokens

### Button
- **Status**: ✅ Has token definition
- **Issues**: 
  - 1 hardcoded fallback value
  - Minor inline styles
- **Action**: Minor cleanup needed

### Card
- **Status**: ✅ Has token definition
- **Issues**: 
  - 47 hardcoded fallback values
  - Minor - mostly correct token usage
- **Action**: Replace fallbacks

### Checkbox
- **Status**: ✅ Has token definition
- **Issues**:
  - 40 hardcoded fallback values
  - Ant Design colors hardcoded as fallbacks
- **Action**: Update to use semantic tokens

### Chip
- **Status**: ✅ Has token definition
- **Issues**: 
  - 2 hardcoded fallback values
  - Mostly correct, references badge tokens appropriately
- **Action**: Minor cleanup

### ColorPicker
- **Status**: ❌ Missing token definition
- **Issues**:
  - 54 hardcoded fallback values
  - Extensive hardcoded values throughout
  - Inline styles in TSX
  - Missing component token file
- **Action**: Create colorpicker.json (high priority - complex component)

### Combobox
- **Status**: ✅ Has token definition
- **Issues**: Mostly correct token usage

### Datepicker
- **Status**: ✅ Has token definition (calendar.json)
- **Issues**:
  - 51 hardcoded fallback values
  - Many hardcoded fallback values
  - Inline styles in TSX
  - Should reference calendar tokens more consistently
- **Action**: Update to use calendar tokens properly, move inline styles to CSS

### Divider
- **Status**: ✅ Has token definition
- **Issues**:
  - 18 hardcoded fallback values
  - Hardcoded rgba fallbacks
- **Action**: Use semantic border/content tokens

### Dropdown
- **Status**: ❌ Missing token definition
- **Issues**:
  - 2 hardcoded fallback values
  - Minimal but should have tokens
- **Action**: Create dropdown.json

### Drawer
- **Status**: ✅ Has token definition
- **Issues**: 
  - 27 hardcoded fallback values
  - Minor inline styles
  - Mostly correct
- **Action**: Replace fallbacks, move inline styles to CSS

### DurationPicker
- **Status**: ❌ Missing token definition
- **Issues**: Should share tokens with Timepicker/Datepicker
- **Action**: Create durationpicker.json or document shared token usage

### Field
- **Status**: ✅ Has token definition
- **Issues**: 
  - 11 hardcoded fallback values
  - Minor inline styles
  - Mostly correct token usage
- **Action**: Replace fallbacks, move inline styles to CSS

### Flex
- **Status**: ❌ Missing token definition
- **Issues**: Layout component, may need minimal tokens
- **Action**: Create flex.json if tokens are needed

### Grid
- **Status**: ❌ Missing token definition
- **Issues**: Layout component, may need minimal tokens
- **Action**: Create grid.json if tokens are needed

### Image
- **Status**: ❌ Missing token definition
- **Issues**:
  - 6 hardcoded fallback values
  - Many hardcoded rgba values
  - 13 inline styles in TSX
  - Missing component token file
- **Action**: Create image.json, move inline styles to CSS

### Input
- **Status**: ✅ Has token definition (via field.json)
- **Issues**: 
  - 15 hardcoded fallback values
  - Mostly correct
- **Action**: Replace fallbacks

### InputGroup
- **Status**: ✅ Has token definition
- **Issues**: Mostly correct token usage

### InputNumber
- **Status**: ❌ Missing token definition
- **Issues**: Should share tokens with Input/Field
- **Action**: Create inputnumber.json or document shared token usage

### InputPair
- **Status**: ✅ Has token definition
- **Issues**: Mostly correct token usage

### Link
- **Status**: ✅ Has token definition
- **Issues**: 
  - 1 hardcoded fallback value
  - Mostly correct
- **Action**: Minor cleanup

### Loading
- **Status**: ✅ Has token definition
- **Issues**: Mostly correct

### Menu
- **Status**: ❌ Missing token definition
- **Issues**:
  - 29 hardcoded fallback values
  - Extensive hardcoded colors
  - Missing component token file
- **Action**: Create menu.json

### Modal
- **Status**: ✅ Has token definition
- **Issues**:
  - 32 hardcoded fallback values
  - 4 inline styles in TSX
- **Action**: Move inline styles to CSS, replace fallbacks

### Notification
- **Status**: ❌ Missing token definition
- **Issues**:
  - 30 hardcoded fallback values
  - Hardcoded colors and spacing
  - 6 inline styles in TSX
  - Missing component token file
- **Action**: Create notification.json, move inline styles to CSS

### Pagination
- **Status**: ✅ Has token definition
- **Issues**: 
  - 61 hardcoded fallback values
  - 7 inline styles in TSX
- **Action**: Replace fallbacks, move inline styles to CSS

### PhoneNumberField
- **Status**: ❌ Missing token definition
- **Issues**: Should share tokens with Field
- **Action**: Create phonenumberfield.json or document shared token usage

### Popover
- **Status**: ✅ Has token definition
- **Issues**: Mostly correct

### Progress
- **Status**: ✅ Has token definition
- **Issues**: 
  - 1 inline style in TSX
  - Mostly correct
- **Action**: Move inline style to CSS

### Radio
- **Status**: ✅ Has token definition
- **Issues**: 
  - 81 hardcoded fallback values
  - Mostly correct
- **Action**: Replace fallbacks

### Rating
- **Status**: ✅ Has token definition
- **Issues**: 
  - 10 hardcoded fallback values
  - 1 inline style in TSX
- **Action**: Replace fallbacks, move inline style to CSS

### Select
- **Status**: ✅ Has token definition
- **Issues**:
  - 1 hardcoded fallback value
  - 2 inline styles in TSX (fontSize)
- **Action**: Move to CSS with tokens

### Segmented
- **Status**: ❌ Missing token definition
- **Issues**:
  - 53 hardcoded fallback values
  - Hardcoded rgba values
  - Missing component token file
- **Action**: Create segmented.json

### Skeleton
- **Status**: ✅ Has token definition
- **Issues**: 
  - 45 hardcoded fallback values
  - 3 inline styles in TSX
- **Action**: Replace fallbacks, move inline styles to CSS

### Slider
- **Status**: ✅ Has token definition
- **Issues**:
  - 29 hardcoded fallback values
  - 8 inline styles in TSX (width/height)
- **Action**: Update fallbacks, move inline styles to CSS

### Spinner
- **Status**: ❌ Missing token definition
- **Issues**:
  - 15 hardcoded fallback values
  - Hardcoded rgba values
  - **Uses primitive tokens directly** (violates architecture)
  - 2 inline styles in TSX
  - Missing component token file
- **Action**: Create spinner.json, use semantic tokens (not primitives), move inline styles to CSS

### Stepper
- **Status**: ✅ Has token definition
- **Issues**: 
  - 80 hardcoded fallback values
  - 2 inline styles in TSX
- **Action**: Replace fallbacks, move inline styles to CSS

### Tabs
- **Status**: ✅ Has token definition
- **Issues**:
  - 69 hardcoded fallback values
  - 2 inline styles in TSX
- **Action**: Update fallbacks, move inline styles to CSS

### Textarea
- **Status**: ✅ Has token definition (via field.json)
- **Issues**: Mostly correct

### Timepicker
- **Status**: ✅ Has token definition
- **Issues**:
  - 26 hardcoded fallback values
  - 2 inline styles in TSX
- **Action**: Update fallbacks, move inline styles to CSS

### Toast
- **Status**: ✅ Has token definition
- **Issues**:
  - 37 hardcoded fallback values
  - 4 inline styles in TSX
- **Action**: Update fallbacks, move inline styles to CSS

### Toggle
- **Status**: ✅ Has token definition
- **Issues**: 
  - 3 hardcoded fallback values
  - 1 inline style in TSX
- **Action**: Replace fallbacks, move inline style to CSS

### Tooltip
- **Status**: ✅ Has token definition
- **Issues**:
  - 13 hardcoded fallback values
  - 1 inline style in TSX
  - Hardcoded rgba fallbacks
- **Action**: Use semantic tokens, move inline style to CSS

### Upload
- **Status**: ❌ Missing token definition
- **Issues**:
  - 53 hardcoded fallback values
  - 12 inline styles in TSX (extensive)
  - Hardcoded colors, spacing, sizes
  - Missing component token file
- **Action**: Create upload.json, move all inline styles to CSS

---

## Recommendations

### Priority 1: Create Missing Token Definitions

Create token definition files for all missing components:

1. **anchor.json** - Define all anchor-specific tokens
2. **autocomplete.json** - Define autocomplete panel, option, scrollbar tokens
3. **colorpicker.json** - Define color picker tokens (extensive)
4. **dropdown.json** - Define dropdown panel tokens
5. **image.json** - Define image, preview, toolbar tokens
6. **menu.json** - Define menu, item, icon tokens
7. **notification.json** - Define notification tokens
8. **segmented.json** - Define segmented control tokens
9. **spinner.json** - Define spinner color and label tokens (use semantic tokens, not primitives)
10. **upload.json** - Define upload area tokens

**Layout Components:**
11. **flex.json** - Define flex layout tokens (if needed)
12. **grid.json** - Define grid layout tokens (if needed)

**Form Components:**
13. **inputnumber.json** - Define input number stepper tokens
14. **phonenumberfield.json** - Define phone number field tokens
15. **durationpicker.json** - Define duration picker tokens

### Priority 2: Replace Hardcoded Values

1. **Replace all hardcoded colors** with semantic or component tokens
2. **Replace all hardcoded spacing** with semantic spacing/gap tokens
3. **Replace all hardcoded sizes** with semantic sizing tokens
4. **Replace all hardcoded shadows** with semantic shadow tokens
5. **Replace all hardcoded opacity** with semantic opacity tokens
6. **Replace all hardcoded border radius** with semantic/component radius tokens

### Priority 3: Remove Fallback Values

1. Once proper tokens are defined, **remove hardcoded fallbacks** from `var()` declarations
2. If fallbacks are needed, **reference other tokens** instead of hardcoded values
3. **Target components with most fallbacks first**: Stepper (80), Radio (81), Tabs (69), Datepicker (51), ColorPicker (54), Segmented (53), Upload (53), Card (47), Skeleton (45)

### Priority 4: Fix Inline Styles

1. **Move all inline styles** from TSX files to CSS modules
2. **Use CSS classes** with token references instead of inline styles
3. **Create utility classes** for common patterns (icon sizes, spacing, etc.)
4. **Target components with most inline styles first**: Upload (12), Image (13), Datepicker (10), Pagination (7), ColorPicker (7), Slider (8)

### Priority 5: Fix Token Architecture Violations

1. **Spinner component**: Replace direct primitive token usage with semantic/component tokens
2. **Audit all components** to ensure they follow token architecture:
   - Base components → Component tokens
   - New components → Semantic tokens
3. **Remove direct primitive token usage** from all components

### Priority 6: Standardize Token Usage

1. **Standardize naming conventions** across all components
2. **Ensure consistent token reference patterns**
3. **Document token usage patterns** for consistency

### Priority 7: Create Token Migration Plan

1. **Document migration path** for each component
2. **Create migration scripts** to help automate token replacement
3. **Set up linting rules** to prevent hardcoded values
4. **Add pre-commit hooks** to validate token usage

---

## Next Steps

1. **Create missing token definition files** (Priority 1)
2. **Systematically replace hardcoded values** component by component
3. **Move inline styles to CSS modules** with token references
4. **Update fallback values** to reference other tokens or remove them
5. **Fix Spinner component** to use semantic tokens instead of primitives
6. **Set up linting** to prevent future hardcoded values
7. **Document token usage patterns** for consistency
8. **Run validation script** regularly: `npm run validate:tokens`

---

## Appendix: Token Reference

### Available Semantic Tokens
- Colors: `--token-semantic-content-*`, `--token-semantic-background-*`, `--token-semantic-border-*`
- Spacing: `--token-semantic-gap-*`, `--token-semantic-padding-*`
- Shadows: `--token-semantic-shadow-*`
- Opacity: `--token-semantic-opacity-*`
- Typography: `--token-semantic-typography-*`
- Z-Index: `--token-semantic-z-index-*`

### Available Component Token Patterns
- Shared: `--token-component-{property}-{component}-{size}`
- Component-specific: `--token-component-{component}-{variant}-{property}-{state}`

### Token Architecture Rules
1. **Components should NOT use primitive tokens directly**
2. **Component tokens MUST reference semantic tokens** (except `universal.transparent`)
3. **Semantic tokens MUST reference primitives**
4. **Never create circular references**

---

**End of Report**
