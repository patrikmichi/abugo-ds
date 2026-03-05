---
name: css-positioning
description: Prefer CSS for positioning over JavaScript DOM manipulations. No getBoundingClientRect, no scroll listeners, no calculations. Use CSS placement classes for dropdowns, tooltips, popovers.
user-invocable: false
allowed-tools: Read, Write, Edit
---

# CSS-First Positioning

**Always prefer CSS for positioning over JavaScript DOM manipulations and calculations.**

This is critical for performance — CSS positioning is handled by the browser's layout engine, which is highly optimized. JavaScript positioning requires:
- `getBoundingClientRect()` calls (forces layout recalc)
- Event listeners for scroll/resize
- `requestAnimationFrame` for smooth updates
- State updates triggering re-renders

## The Rule

**Before writing any positioning JavaScript, ask: Can CSS do this?**

| Use Case | ❌ Avoid | ✅ Prefer |
|----------|----------|-----------|
| Dropdown below trigger | JS: `getBoundingClientRect()` + state | CSS: `position: absolute; top: 100%` |
| Center element | JS: Calculate parent width | CSS: `left: 50%; transform: translateX(-50%)` |
| Tooltip placement | JS: Measure + position | CSS: Placement classes with `top/bottom/left/right` |
| Sticky elements | JS: Scroll listener + position | CSS: `position: sticky` |
| Element at viewport edge | JS: Window dimensions | CSS: `position: fixed` with `inset` |

## CSS Placement Pattern

For dropdowns, tooltips, popovers — use CSS classes for each placement variant:

```css
.root {
    position: relative;
}

.panel {
    position: absolute;
    z-index: 1050;
}

/* Placement variants — no JS needed */
.bottomLeft {
    top: calc(100% + 4px);
    left: 0;
}

.bottomRight {
    top: calc(100% + 4px);
    right: 0;
}

.topLeft {
    bottom: calc(100% + 4px);
    left: 0;
}

.topRight {
    bottom: calc(100% + 4px);
    right: 0;
}

/* Center alignments */
.bottomCenter {
    top: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
}

.topCenter {
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
}
```

**In component — just apply the class:**

```typescript
<div className={cx(styles.panel, styles[placement])} role="menu">
```

No calculations. No refs for measuring. No state for position.

## What JavaScript IS Needed

Some behaviors still require minimal JS:

```typescript
// Click outside — necessary for UX
useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            onClose();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, [visible, onClose]);

// Escape key — necessary for a11y
useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}, [visible, onClose]);
```

These are **event handlers**, not positioning logic.

## Handling Overflow Clipping

When parent elements have `overflow: hidden`, override it:

```css
/* Allow positioned children to overflow */
.parent :global(.clipping-ancestor *) {
    overflow: visible !important;
}
```

For FullCalendar specifically:

```css
/* Day view headers */
.calendarDayView :global(.fc-scrollgrid-section-header *) {
    overflow: visible !important;
}

/* Timeline resource cells */
.calendarTimelineView :global(.fc-datagrid-cell *) {
    overflow: visible !important;
}
```

## When JavaScript Positioning IS Justified

Only use JS positioning when CSS genuinely cannot solve the problem:

1. **Viewport collision detection** — element must stay within viewport bounds
2. **Dynamic anchor** — positioned relative to an element that moves
3. **Portal required** — escaping deep stacking contexts that can't be CSS-fixed

Even then, keep it minimal:
- Calculate once on open, not continuously
- Only add scroll/resize listeners if actually needed
- Use CSS for the base positioning, JS only for adjustments

## Anti-Patterns to Avoid

```typescript
// ❌ AVOID: Calculating position with getBoundingClientRect
const updatePosition = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left });
};

useEffect(() => {
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    // ...
}, []);

// ❌ AVOID: Using refs just to measure elements
const panelRef = useRef<HTMLDivElement>(null);
const panelWidth = panelRef.current?.offsetWidth || 0;
const left = triggerRect.left + triggerRect.width / 2 - panelWidth / 2;

// ❌ AVOID: requestAnimationFrame for position updates
requestAnimationFrame(() => {
    panelRef.current.style.left = `${calculatedLeft}px`;
});
```

## Reference Implementation

See `components/pages/calendar/CalendarPage/ActionMenu/` for a dropdown using pure CSS positioning.

## Checklist

Before adding positioning JavaScript:

- [ ] Can `position: absolute` with `top/bottom/left/right` solve this?
- [ ] Can `transform: translate()` handle centering?
- [ ] Can `position: sticky` replace scroll listeners?
- [ ] Can overflow be fixed with CSS overrides?
- [ ] Is the complexity of JS positioning actually necessary?

**If CSS can do it, CSS should do it.**
