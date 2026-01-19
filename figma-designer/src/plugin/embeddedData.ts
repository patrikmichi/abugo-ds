/**
 * Embedded Button JSON Data
 *
 * This file contains the pre-generated button component JSONs.
 * Token names match the actual Figma variable names from tokens/system/componentTokens/
 */

import type { DesignJson } from '../schemas/design-json';

// =============================================================================
// Token Mappings - Based on tokens/system/componentTokens/components/button.json
// =============================================================================

/**
 * Color token mappings using Figma variable names (dot notation)
 * These match variables in Figma from Tokens Studio
 */
const COLOR_TOKENS = {
  primary: {
    filled: {
      background: {
        default: 'background.active.accent.default',
        hover: 'background.active.accent.hover',
        pressed: 'background.active.accent.pressed',
        disabled: 'background.active.accent.disabled',
        loading: 'background.active.accent.default',
      },
      content: {
        default: 'content.passive.on.accent',
        hover: 'content.passive.on.accent',
        pressed: 'content.passive.on.accent',
        disabled: 'content.passive.on.accent',
        loading: 'content.passive.on.accent',
      },
    },
    plain: {
      background: {
        default: 'universal.transparent',
        hover: 'background.active.accent.subtle.hover',
        pressed: 'background.active.accent.subtle.pressed',
        disabled: 'universal.transparent',
        loading: 'universal.transparent',
      },
      content: {
        default: 'content.active.accent.default',
        hover: 'content.active.accent.hover',
        pressed: 'content.active.accent.pressed',
        disabled: 'content.active.accent.disabled',
        loading: 'content.active.accent.default',
      },
    },
  },
  secondary: {
    outline: {
      background: {
        default: 'universal.transparent',
        hover: 'background.active.accent.subtle.hover',
        pressed: 'universal.transparent',
        disabled: 'universal.transparent',
        loading: 'universal.transparent',
      },
      border: {
        default: 'border.active.accent.default',
        hover: 'border.active.accent.hover',
        pressed: 'border.active.accent.pressed',
        disabled: 'border.active.accent.disabled',
        loading: 'border.active.accent.default',
      },
      content: {
        default: 'content.active.accent.default',
        hover: 'content.active.accent.hover',
        pressed: 'content.active.accent.pressed',
        disabled: 'content.active.accent.disabled',
        loading: 'content.active.accent.default',
      },
    },
    plain: {
      background: {
        default: 'universal.transparent',
        hover: 'background.active.neutral.subtle.hover',
        pressed: 'background.active.neutral.subtle.pressed',
        disabled: 'universal.transparent',
        loading: 'universal.transparent',
      },
      content: {
        default: 'content.active.neutral.default',
        hover: 'content.active.neutral.hover',
        pressed: 'content.active.neutral.pressed',
        disabled: 'content.active.neutral.disabled',
        loading: 'content.active.neutral.default',
      },
    },
  },
  tertiary: {
    outline: {
      background: {
        default: 'universal.transparent',
        hover: 'background.active.neutral.hover',
        pressed: 'universal.transparent',
        disabled: 'universal.transparent',
        loading: 'universal.transparent',
      },
      border: {
        default: 'border.active.neutral.action.default',
        hover: 'border.active.neutral.action.hover',
        pressed: 'border.active.neutral.action.pressed',
        disabled: 'border.active.neutral.action.disabled',
        loading: 'border.active.neutral.action.default',
      },
      content: {
        default: 'content.active.neutral.default',
        hover: 'content.active.neutral.hover',
        pressed: 'content.active.neutral.pressed',
        disabled: 'content.active.neutral.disabled',
        loading: 'content.active.neutral.default',
      },
    },
    plain: {
      background: {
        default: 'universal.transparent',
        hover: 'background.active.neutral.subtle.hover',
        pressed: 'background.active.neutral.subtle.pressed',
        disabled: 'universal.transparent',
        loading: 'universal.transparent',
      },
      content: {
        default: 'content.active.neutral.default',
        hover: 'content.active.neutral.hover',
        pressed: 'content.active.neutral.pressed',
        disabled: 'content.active.neutral.disabled',
        loading: 'content.active.neutral.default',
      },
    },
  },
  danger: {
    filled: {
      background: {
        default: 'background.active.danger.default',
        hover: 'background.active.danger.hover',
        pressed: 'background.active.danger.pressed',
        disabled: 'background.active.danger.disabled',
        loading: 'background.active.danger.default',
      },
      content: {
        default: 'content.passive.on.danger',
        hover: 'content.passive.on.danger',
        pressed: 'content.passive.on.danger',
        disabled: 'content.passive.on.danger',
        loading: 'content.passive.on.danger',
      },
    },
    plain: {
      background: {
        default: 'universal.transparent',
        hover: 'background.active.danger.subtle',
        pressed: 'universal.transparent',
        disabled: 'universal.transparent',
        loading: 'universal.transparent',
      },
      content: {
        default: 'content.active.danger.default',
        hover: 'content.active.danger.hover',
        pressed: 'content.active.danger.pressed',
        disabled: 'content.active.danger.disabled',
        loading: 'content.active.danger.default',
      },
    },
  },
  upgrade: {
    filled: {
      background: {
        default: 'background.active.upgrade.default',
        hover: 'background.active.upgrade.hover',
        pressed: 'background.active.upgrade.pressed',
        disabled: 'background.active.upgrade.disabled',
        loading: 'background.active.upgrade.default',
      },
      content: {
        default: 'content.passive.on.upgrade',
        hover: 'content.passive.on.upgrade',
        pressed: 'content.passive.on.upgrade',
        disabled: 'content.passive.on.upgrade',
        loading: 'content.passive.on.upgrade',
      },
    },
    plain: {
      background: {
        default: 'universal.transparent',
        hover: 'background.active.upgrade.subtle',
        pressed: 'universal.transparent',
        disabled: 'universal.transparent',
        loading: 'universal.transparent',
      },
      content: {
        default: 'content.active.upgrade.default',
        hover: 'content.active.upgrade.hover',
        pressed: 'content.active.upgrade.pressed',
        disabled: 'content.active.upgrade.disabled',
        loading: 'content.active.upgrade.default',
      },
    },
  },
};

/**
 * Dimension token mappings from shared componentTokens
 * These reference semantic tokens in Figma
 */
const DIMENSION_TOKENS = {
  height: {
    filled: {
      sm: 'height.button.sm', // → control.height.sm
      md: 'height.button.md', // → control.height.md
      lg: 'height.button.lg', // → control.height.lg
    },
    plain: {
      sm: 'height.button.plain.sm', // → control.height.xs
      md: 'height.button.plain.md', // → control.height.sm
      lg: 'height.button.plain.lg', // → control.height.md
    },
  },
  padding: {
    left: {
      sm: 'padding.left.button.sm', // → padding.xs
      md: 'padding.left.button.md', // → padding.s
      lg: 'padding.left.button.lg', // → padding.m
    },
    right: {
      sm: 'padding.right.button.sm', // → padding.xs
      md: 'padding.right.button.md', // → padding.s
      lg: 'padding.right.button.lg', // → padding.m
    },
    optical: 'padding.optical.button.icon', // → spacing-1
  },
  gap: {
    sm: 'gap.button.icon.sm', // → gap.xs
    md: 'gap.button.icon.md', // → gap.xs
    lg: 'gap.button.icon.lg', // → gap.s
  },
  icon: {
    sm: 'icon.button.sm', // 20px
    md: 'icon.button.md', // → icon.sm
    lg: 'icon.button.lg', // → icon.sm
  },
  radius: {
    sm: 'radius.button.sm', // → radius.xs
    md: 'radius.button.md', // → radius.sm
    lg: 'radius.button.lg', // → radius.md
  },
  iconOnly: {
    sm: 'iconOnly.width.sm', // → control.height.sm
    md: 'iconOnly.width.md', // → control.height.md
    lg: 'iconOnly.width.lg', // → control.height.lg
  },
};

// =============================================================================
// Fallback Values (when variables not found)
// =============================================================================

const FALLBACK_COLORS = {
  accent: {
    background: {
      default: { r: 0.34, g: 0.56, b: 0.96, a: 1 },
      hover: { r: 0.27, g: 0.45, b: 0.77, a: 1 },
      pressed: { r: 0.19, g: 0.32, b: 0.54, a: 1 },
      disabled: { r: 0.34, g: 0.56, b: 0.96, a: 0.4 },
    },
    content: { r: 1, g: 1, b: 1, a: 1 },
    contentActive: {
      default: { r: 0.34, g: 0.56, b: 0.96, a: 1 },
      hover: { r: 0.27, g: 0.45, b: 0.77, a: 1 },
      pressed: { r: 0.19, g: 0.32, b: 0.54, a: 1 },
      disabled: { r: 0.34, g: 0.56, b: 0.96, a: 0.4 },
    },
  },
  neutral: {
    background: { hover: { r: 0.95, g: 0.95, b: 0.95, a: 1 } },
    content: {
      default: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
      hover: { r: 0.2, g: 0.2, b: 0.2, a: 1 },
      pressed: { r: 0.05, g: 0.05, b: 0.05, a: 1 },
      disabled: { r: 0.1, g: 0.1, b: 0.1, a: 0.4 },
    },
  },
  danger: {
    background: {
      default: { r: 0.86, g: 0.15, b: 0.15, a: 1 },
      hover: { r: 0.76, g: 0.1, b: 0.1, a: 1 },
      pressed: { r: 0.66, g: 0.05, b: 0.05, a: 1 },
      disabled: { r: 0.86, g: 0.15, b: 0.15, a: 0.4 },
    },
    content: { r: 1, g: 1, b: 1, a: 1 },
    contentActive: {
      default: { r: 0.86, g: 0.15, b: 0.15, a: 1 },
      hover: { r: 0.76, g: 0.1, b: 0.1, a: 1 },
      pressed: { r: 0.66, g: 0.05, b: 0.05, a: 1 },
      disabled: { r: 0.86, g: 0.15, b: 0.15, a: 0.4 },
    },
  },
  upgrade: {
    background: {
      default: { r: 0.95, g: 0.76, b: 0.1, a: 1 },
      hover: { r: 0.85, g: 0.66, b: 0.05, a: 1 },
      pressed: { r: 0.75, g: 0.56, b: 0.0, a: 1 },
      disabled: { r: 0.95, g: 0.76, b: 0.1, a: 0.4 },
    },
    content: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
    contentActive: {
      default: { r: 0.95, g: 0.76, b: 0.1, a: 1 },
      hover: { r: 0.85, g: 0.66, b: 0.05, a: 1 },
      pressed: { r: 0.75, g: 0.56, b: 0.0, a: 1 },
      disabled: { r: 0.95, g: 0.76, b: 0.1, a: 0.4 },
    },
  },
  transparent: { r: 0, g: 0, b: 0, a: 0 },
};

const FALLBACK_DIMENSIONS = {
  height: { sm: 32, md: 40, lg: 48 },
  heightPlain: { sm: 24, md: 32, lg: 40 },
  paddingLeft: { sm: 12, md: 16, lg: 20 },
  paddingRight: { sm: 12, md: 16, lg: 20 },
  paddingOptical: 4,
  gap: { sm: 8, md: 8, lg: 12 },
  icon: { sm: 20, md: 24, lg: 24 },
  radius: { sm: 6, md: 8, lg: 12 },
};

// =============================================================================
// Button JSON Generator
// =============================================================================

type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'upgrade';
type Appearance = 'filled' | 'outline' | 'plain';
type Size = 'sm' | 'md' | 'lg';
type State = 'default' | 'hover' | 'pressed' | 'disabled' | 'loading';

interface ButtonConfig {
  name: string;
  id: ButtonType;
  appearances: Appearance[];
  colorScheme: 'accent' | 'neutral' | 'danger' | 'upgrade';
}

function generateButtonJson(config: ButtonConfig): DesignJson {
  const { name, id, appearances, colorScheme } = config;
  const colorTokens = COLOR_TOKENS[id];

  const STATES: State[] = ['default', 'hover', 'disabled', 'pressed', 'loading'];
  const ICONS = ['none', 'left', 'right', 'only'];
  const SIZES: Size[] = ['sm', 'md', 'lg'];

  function getColorToken(appearance: Appearance, type: 'background' | 'content' | 'border', state: State): string | undefined {
    const tokens = (colorTokens as any)[appearance];
    if (!tokens) return undefined;
    const typeTokens = tokens[type];
    if (!typeTokens) return undefined;
    return typeof typeTokens === 'string' ? typeTokens : typeTokens[state];
  }

  function getBackgroundFallback(appearance: Appearance, state: State) {
    const token = getColorToken(appearance, 'background', state);
    if (token?.includes('transparent')) return FALLBACK_COLORS.transparent;
    const colors = FALLBACK_COLORS[colorScheme];
    if ('background' in colors) {
      return (colors.background as any)[state] || FALLBACK_COLORS.transparent;
    }
    return FALLBACK_COLORS.transparent;
  }

  function getContentFallback(appearance: Appearance, state: State) {
    const colors = FALLBACK_COLORS[colorScheme];
    if (appearance === 'plain' || appearance === 'outline') {
      if ('contentActive' in colors) {
        return (colors.contentActive as any)[state] || (colors.contentActive as any).default;
      }
    }
    if ('content' in colors) {
      const content = colors.content;
      return typeof content === 'object' && 'r' in content ? content : (content as any)[state] || (content as any).default;
    }
    return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
  }

  function getHeightToken(appearance: Appearance, size: Size): string {
    if (appearance === 'plain') {
      return DIMENSION_TOKENS.height.plain[size];
    }
    return DIMENSION_TOKENS.height.filled[size];
  }

  // Build variant properties
  const variantProperties: any[] = [];
  if (appearances.length > 1) {
    variantProperties.push({
      name: 'Appearance',
      values: appearances,
      type: 'VARIANT',
      defaultValue: appearances[0],
    });
  }
  variantProperties.push(
    { name: 'State', values: STATES, type: 'VARIANT', defaultValue: 'default' },
    { name: 'Icon', values: ICONS, type: 'VARIANT', defaultValue: 'none' },
    { name: 'Size', values: SIZES, type: 'VARIANT', defaultValue: 'md' }
  );

  // Build variants
  const variants: any[] = [];
  for (const appearance of appearances) {
    for (const state of STATES) {
      for (const icon of ICONS) {
        for (const size of SIZES) {
          const variantProps: Record<string, string> = { State: state, Icon: icon, Size: size };
          if (appearances.length > 1) variantProps.Appearance = appearance;

          let layoutKey: string | undefined;
          if (icon === 'only') layoutKey = 'iconOnly';
          else if (icon === 'left') layoutKey = 'iconStart';
          else if (icon === 'right') layoutKey = 'iconEnd';
          if (state === 'loading') layoutKey = 'loading';

          const bgToken = getColorToken(appearance, 'background', state);
          const contentToken = getColorToken(appearance, 'content', state);
          const borderToken = getColorToken(appearance, 'border', state);

          const variantDef: any = {
            variant: variantProps,
            style: {
              fill: {
                variable: bgToken,
                fallback: getBackgroundFallback(appearance, state),
              },
              contentColor: {
                variable: contentToken,
                fallback: getContentFallback(appearance, state),
              },
            },
            dimensions: {
              height: {
                variable: getHeightToken(appearance, size),
                fallback: appearance === 'plain' ? FALLBACK_DIMENSIONS.heightPlain[size] : FALLBACK_DIMENSIONS.height[size],
              },
              paddingLeft: {
                variable: DIMENSION_TOKENS.padding.left[size],
                fallback: FALLBACK_DIMENSIONS.paddingLeft[size],
              },
              paddingRight: {
                variable: DIMENSION_TOKENS.padding.right[size],
                fallback: FALLBACK_DIMENSIONS.paddingRight[size],
              },
              gap: {
                variable: DIMENSION_TOKENS.gap[size],
                fallback: FALLBACK_DIMENSIONS.gap[size],
              },
              cornerRadius: {
                variable: DIMENSION_TOKENS.radius[size],
                fallback: FALLBACK_DIMENSIONS.radius[size],
              },
              iconSize: {
                variable: DIMENSION_TOKENS.icon[size],
                fallback: FALLBACK_DIMENSIONS.icon[size],
              },
            },
          };

          // Add border for outline variants
          if (borderToken) {
            variantDef.style.stroke = {
              variable: borderToken,
              fallback: getContentFallback(appearance, state),
              weight: 1,
              align: 'INSIDE',
            };
          }

          if (layoutKey) {
            variantDef.layoutKey = layoutKey;
            // Icon-only uses square dimensions
            if (layoutKey === 'iconOnly') {
              variantDef.dimensions.width = {
                variable: DIMENSION_TOKENS.iconOnly[size],
                fallback: FALLBACK_DIMENSIONS.height[size],
              };
            }
          }

          variants.push(variantDef);
        }
      }
    }
  }

  // Collect all unique variables
  const collectionName = `Components/Button/${name}`;
  const variables: any[] = [];
  const addedVars = new Set<string>();

  for (const variant of variants) {
    const style = variant.style;
    const dims = variant.dimensions;

    // Color variables
    for (const key of ['fill', 'contentColor', 'stroke']) {
      const varRef = style[key]?.variable;
      if (varRef && !addedVars.has(varRef)) {
        addedVars.add(varRef);
        variables.push({
          cssVar: `--${varRef.replace(/\./g, '-')}`,
          figmaName: varRef,
          type: 'COLOR',
          value: style[key].fallback,
          collection: collectionName,
        });
      }
    }

    // Dimension variables
    for (const key of ['height', 'paddingLeft', 'paddingRight', 'gap', 'cornerRadius', 'iconSize', 'width']) {
      const varRef = dims[key]?.variable;
      if (varRef && !addedVars.has(varRef)) {
        addedVars.add(varRef);
        variables.push({
          cssVar: `--${varRef.replace(/\./g, '-')}`,
          figmaName: varRef,
          type: 'FLOAT',
          value: dims[key].fallback,
          collection: collectionName,
        });
      }
    }
  }

  return {
    meta: {
      name: `Button/${name}`,
      reactComponent: 'Button.tsx',
      version: '1.0.0',
    },
    variables: {
      [collectionName]: {
        modes: [{ id: 'default', name: 'Default' }],
        variables,
      },
    },
    componentSet: {
      name: `Button/${name}`,
      variantProperties,
      overridables: [
        { name: 'Text', type: 'TEXT', target: 'Label', defaultValue: 'Button' },
        { name: 'Icon', type: 'INSTANCE_SWAP', target: 'Icon' },
      ],
      validCombinations: { [id]: appearances },
      variants,
    },
    layout: {
      mode: 'HORIZONTAL',
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 8,
      padding: { top: 0, right: 16, bottom: 0, left: 16 },
      children: [
        { role: 'startIcon', name: 'Icon', order: 'start', type: 'FRAME', visible: false },
        { role: 'label', name: 'Label', order: 'center', type: 'TEXT', visible: true },
        { role: 'endIcon', name: 'Icon', order: 'end', type: 'FRAME', visible: false },
        { role: 'loading', name: 'Spinner', order: 'center', type: 'FRAME', visible: false },
      ],
      sizing: { width: 'HUG', height: 'FIXED' },
    },
    layoutVariants: {
      iconOnly: {
        children: [{ role: 'icon', name: 'Icon', order: 'center', type: 'FRAME', visible: true }],
        sizing: { width: 'FIXED', height: 'FIXED' },
      },
      iconStart: {
        children: [
          { role: 'startIcon', name: 'Icon', order: 'start', type: 'FRAME', visible: true },
          { role: 'label', name: 'Label', order: 'center', type: 'TEXT', visible: true },
        ],
      },
      iconEnd: {
        children: [
          { role: 'label', name: 'Label', order: 'center', type: 'TEXT', visible: true },
          { role: 'endIcon', name: 'Icon', order: 'end', type: 'FRAME', visible: true },
        ],
      },
      loading: {
        children: [{ role: 'loading', name: 'Spinner', order: 'center', type: 'ELLIPSE', visible: true }],
      },
    },
  };
}

// =============================================================================
// Embedded Button Component JSONs
// =============================================================================

export const EMBEDDED_BUTTON_JSONS: Record<string, DesignJson> = {
  primary: generateButtonJson({
    name: 'Primary',
    id: 'primary',
    appearances: ['filled', 'plain'],
    colorScheme: 'accent',
  }),
  secondary: generateButtonJson({
    name: 'Secondary',
    id: 'secondary',
    appearances: ['outline', 'plain'],
    colorScheme: 'accent',
  }),
  tertiary: generateButtonJson({
    name: 'Tertiary',
    id: 'tertiary',
    appearances: ['outline'],
    colorScheme: 'neutral',
  }),
  upgrade: generateButtonJson({
    name: 'Upgrade',
    id: 'upgrade',
    appearances: ['filled', 'plain'],
    colorScheme: 'upgrade',
  }),
  danger: generateButtonJson({
    name: 'Danger',
    id: 'danger',
    appearances: ['filled', 'plain'],
    colorScheme: 'danger',
  }),
};
