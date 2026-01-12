# Color Scale Standardization Decision

> **Decision**: Our design system uses a **50-900 color scale**, aligned with Material Design, Chakra UI, and Tailwind CSS standards.

---

## Current Scale

Our color scale uses the following values:

- `50` - Lightest (white/very light)
- `100` - Very light
- `200` - Light
- `300` - Lighter
- `400` - Medium-light
- `500` - Medium (base color)
- `600` - Medium-dark
- `700` - Dark
- `800` - Darker
- `900` - Darkest

**Total: 11 steps** (50, 100-900)

---

## Industry Standard Scale

Many design systems use a 50-900 scale:

- `50` - Lightest
- `100` - Very light
- `200` - Light
- `300` - Lighter
- `400` - Medium-light
- `500` - Medium (base color)
- `600` - Medium-dark
- `700` - Dark
- `800` - Darker
- `900` - Darkest

**Total: 11 steps** (50, 100-900)

---

## Why We Use 50-900

### 1. **Industry Alignment**
Our design system now aligns with major design systems:
- Material Design uses 50-900
- Chakra UI uses 50-900
- Tailwind CSS uses 50-900
- Better compatibility with design tools and libraries

### 2. **Enhanced Granularity**
11 steps (50, 100-900) provide better granularity:
- `50` provides the lightest tint (useful for subtle backgrounds)
- `900` provides the darkest shade (useful for high-contrast text)
- More flexibility for design variations
- Better support for dark mode implementations

### 3. **Tool Compatibility**
The 50-900 scale works excellently with:
- Figma Tokens Studio
- Panda CSS
- Storybook
- Material Design tools
- All modern design system tooling

### 4. **Future-Proofing**
Using the industry standard ensures:
- Easier migration of components from other systems
- Better community support and examples
- Alignment with emerging design standards
- Reduced learning curve for new team members

---

## Comparison with Industry Standards

| System | Scale | Steps | Notes |
|--------|-------|-------|-------|
| **Our System** | 50-900 | 11 | ✅ Aligned with industry standards |
| Material Design | 50-900 | 11 | ✅ Same scale |
| Chakra UI | 50-900 | 11 | ✅ Same scale |
| Tailwind CSS | 50-900 | 11 | ✅ Same scale |
| Ant Design | 1-10 | 10 | Different approach |

---

## Migration Completed ✅

We have successfully migrated from 000-800 to 50-900:

### Migration Steps Completed
1. ✅ **Updated Primitive Tokens**: Converted all color families to 50-900 scale
2. ✅ **Calculated Missing Values**: 
   - `50` values calculated for all color families (interpolated from 100 or converted from 000)
   - `900` values calculated for all color families (darker than 800)
3. ✅ **Updated References**: All semantic and component token references updated
4. ✅ **Updated Documentation**: This document and related guides updated

### Migration Details

**Color Value Calculations:**
- `50` values: Interpolated between white (#ffffff) and `100` values (50% blend)
- `900` values: Interpolated between `800` values and black (#000000) with 30% blend to maintain color saturation
- `grey.000` → `grey.50`: Direct conversion (both are white #ffffff)

**Reference Updates:**
- All `{grey.000}` references updated to `{grey.50}`
- All other color references remain valid (100-800 map directly)

---

## Recommendation

**✅ Migration Complete**: We now use the 50-900 scale, aligned with industry standards:

1. ✅ **Industry Alignment**: Matches Material Design, Chakra UI, Tailwind CSS
2. ✅ **Enhanced Granularity**: 11 steps provide better design flexibility
3. ✅ **Tool Compatibility**: Better support across design tools
4. ✅ **Future-Proofing**: Aligns with emerging design standards
5. ✅ **Team Benefits**: Easier onboarding and community support

---

## Documentation

When documenting colors:

- Always reference the scale as **50-900**
- Explain that `50` represents the lightest value (often white or very light tint)
- Note that `500` is typically the base/brand color
- Note that `900` represents the darkest value (often used for high-contrast text)
- This aligns with Material Design, Chakra UI, and Tailwind CSS standards

---

## Future Considerations

The 50-900 scale provides excellent flexibility. If we need even more granularity in the future:

1. **Add Intermediate Steps**: Could add `25`, `75`, `150`, `250`, etc. if needed
2. **Extend Range**: Could add `950` if even darker values are needed
3. **Custom Scales**: Could create custom scales for specific color families if needed

---

## Related Documentation

- [Token Structure](TOKEN_STRUCTURE.md) - Overall token organization
- [Designer Guide](DESIGNER_GUIDE.md) - How to use tokens in Figma
- [Developer Guide](DEVELOPER_GUIDE.md) - How to use tokens in code
