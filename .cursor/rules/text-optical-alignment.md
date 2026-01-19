# Text Optical Alignment Rule

## Overview
This rule defines the standard pattern for aligning text and icons in components to achieve proper optical centering, compensating for font descender spacing.

## Pattern

### Text Content Padding Compensation
For components with text content (Input, Select, Alert, Toast, etc.), apply padding compensation:

```css
/* Base padding with +1px top / -1px bottom compensation */
padding-top: calc(var(--token-component-padding-y-{size}) + 1px);
padding-bottom: calc(var(--token-component-padding-y-{size}) - 1px);
```

**Why:** This compensates for the visual space under text (descender area), making text appear optically centered within its container.

### Icon Alignment
For icons that need to align with text content in flex containers, use `align-self: center`:

```css
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
}
```

**Why:** In flex containers with `align-items: stretch`, using `align-self: center` vertically centers icons relative to the text content, which accounts for the padding compensation applied to text.

**Note:** For absolutely positioned icons (like in Input/Select), use `position: absolute; top: 50%; transform: translateY(-50%);` instead.

## Components Using This Pattern

- **Input**: Text padding compensation, prefix/suffix icons use `transform: translateY(-50%)`
- **Select**: Text padding compensation, chevron icon uses `transform: translateY(-50%)`
- **Alert**: Text padding compensation, icon uses `transform: translateY(-50%)`
- **Toast**: Text padding compensation, icon uses `transform: translateY(-50%)`

## Implementation Notes

1. **Container**: Use `align-items: stretch` on flex containers to allow proper vertical alignment
2. **Icons**: Always use `align-self: center` along with `transform: translateY(-50%)` for consistent alignment
3. **Padding**: The +1px/-1px compensation is a fixed value that works across all font sizes
4. **Consistency**: Apply this pattern to all components that display text alongside icons or controls

## Example

```css
/* Component container */
.component {
  display: flex;
  align-items: stretch;
  padding-top: calc(var(--token-component-padding-y-md) + 1px);
  padding-bottom: calc(var(--token-component-padding-y-md) - 1px);
}

/* Icon */
.component .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  align-self: center;
}
```
