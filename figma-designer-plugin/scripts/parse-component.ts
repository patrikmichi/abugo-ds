#!/usr/bin/env tsx
/**
 * Parse React Component + CSS to Design JSON
 *
 * Generates SEPARATE component sets per button type:
 * - Button/Primary (filled, plain)
 * - Button/Secondary (filled, plain)
 * - Button/Tertiary (plain only)
 * - Button/Upgrade (filled, plain)
 * - Button/Danger (filled, plain)
 *
 * Usage:
 *   npm run parse -- ../components/Button
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import type {
  DesignJson,
  DesignVariable,
  VariableCollections,
  VariantProperty,
  Overridable,
  VariantDefinition,
  LayoutDefinition,
  LayoutVariants,
  Rgba,
  VariableType,
} from '../src/schemas/design-json';

// =============================================================================
// Button Type Configuration
// =============================================================================

interface ButtonTypeConfig {
  name: string;
  appearances: string[];
  colorScheme: string; // accent, neutral, danger, upgrade
}

const BUTTON_TYPES: ButtonTypeConfig[] = [
  { name: 'Primary', appearances: ['filled', 'plain'], colorScheme: 'accent' },
  { name: 'Secondary', appearances: ['filled', 'plain'], colorScheme: 'neutral' },
  { name: 'Tertiary', appearances: ['plain'], colorScheme: 'neutral' },
  { name: 'Upgrade', appearances: ['filled', 'plain'], colorScheme: 'upgrade' },
  { name: 'Danger', appearances: ['filled', 'plain'], colorScheme: 'danger' },
];

const STATES = ['default', 'hover', 'disabled', 'pressed', 'loading'];
const ICONS = ['none', 'left', 'right', 'only'];
const SIZES = ['sm', 'md', 'lg'];

// =============================================================================
// Color Fallbacks
// =============================================================================

const COLOR_SCHEMES: Record<string, Record<string, Record<string, Rgba>>> = {
  accent: {
    filled: {
      'background-default': { r: 0.29, g: 0.35, b: 0.93, a: 1 },
      'background-hover': { r: 0.24, g: 0.30, b: 0.88, a: 1 },
      'background-pressed': { r: 0.20, g: 0.25, b: 0.78, a: 1 },
      'background-disabled': { r: 0.29, g: 0.35, b: 0.93, a: 0.4 },
      'background-loading': { r: 0.29, g: 0.35, b: 0.93, a: 1 },
      'content': { r: 1, g: 1, b: 1, a: 1 },
      'content-disabled': { r: 1, g: 1, b: 1, a: 0.6 },
    },
    plain: {
      'background-default': { r: 0, g: 0, b: 0, a: 0 },
      'background-hover': { r: 0.29, g: 0.35, b: 0.93, a: 0.08 },
      'background-pressed': { r: 0.29, g: 0.35, b: 0.93, a: 0.12 },
      'background-disabled': { r: 0, g: 0, b: 0, a: 0 },
      'background-loading': { r: 0, g: 0, b: 0, a: 0 },
      'content-default': { r: 0.29, g: 0.35, b: 0.93, a: 1 },
      'content-hover': { r: 0.24, g: 0.30, b: 0.88, a: 1 },
      'content-pressed': { r: 0.20, g: 0.25, b: 0.78, a: 1 },
      'content-disabled': { r: 0.29, g: 0.35, b: 0.93, a: 0.4 },
      'content-loading': { r: 0.29, g: 0.35, b: 0.93, a: 1 },
    },
  },
  neutral: {
    filled: {
      'background-default': { r: 0.1, g: 0.1, b: 0.12, a: 1 },
      'background-hover': { r: 0.15, g: 0.15, b: 0.18, a: 1 },
      'background-pressed': { r: 0.08, g: 0.08, b: 0.1, a: 1 },
      'background-disabled': { r: 0.1, g: 0.1, b: 0.12, a: 0.4 },
      'background-loading': { r: 0.1, g: 0.1, b: 0.12, a: 1 },
      'content': { r: 1, g: 1, b: 1, a: 1 },
      'content-disabled': { r: 1, g: 1, b: 1, a: 0.6 },
    },
    plain: {
      'background-default': { r: 0, g: 0, b: 0, a: 0 },
      'background-hover': { r: 0.1, g: 0.1, b: 0.12, a: 0.08 },
      'background-pressed': { r: 0.1, g: 0.1, b: 0.12, a: 0.12 },
      'background-disabled': { r: 0, g: 0, b: 0, a: 0 },
      'background-loading': { r: 0, g: 0, b: 0, a: 0 },
      'content-default': { r: 0.1, g: 0.1, b: 0.12, a: 1 },
      'content-hover': { r: 0.05, g: 0.05, b: 0.08, a: 1 },
      'content-pressed': { r: 0, g: 0, b: 0.02, a: 1 },
      'content-disabled': { r: 0.1, g: 0.1, b: 0.12, a: 0.4 },
      'content-loading': { r: 0.1, g: 0.1, b: 0.12, a: 1 },
    },
  },
  danger: {
    filled: {
      'background-default': { r: 0.86, g: 0.15, b: 0.15, a: 1 },
      'background-hover': { r: 0.76, g: 0.1, b: 0.1, a: 1 },
      'background-pressed': { r: 0.66, g: 0.05, b: 0.05, a: 1 },
      'background-disabled': { r: 0.86, g: 0.15, b: 0.15, a: 0.4 },
      'background-loading': { r: 0.86, g: 0.15, b: 0.15, a: 1 },
      'content': { r: 1, g: 1, b: 1, a: 1 },
      'content-disabled': { r: 1, g: 1, b: 1, a: 0.6 },
    },
    plain: {
      'background-default': { r: 0, g: 0, b: 0, a: 0 },
      'background-hover': { r: 0.86, g: 0.15, b: 0.15, a: 0.08 },
      'background-pressed': { r: 0.86, g: 0.15, b: 0.15, a: 0.12 },
      'background-disabled': { r: 0, g: 0, b: 0, a: 0 },
      'background-loading': { r: 0, g: 0, b: 0, a: 0 },
      'content-default': { r: 0.86, g: 0.15, b: 0.15, a: 1 },
      'content-hover': { r: 0.76, g: 0.1, b: 0.1, a: 1 },
      'content-pressed': { r: 0.66, g: 0.05, b: 0.05, a: 1 },
      'content-disabled': { r: 0.86, g: 0.15, b: 0.15, a: 0.4 },
      'content-loading': { r: 0.86, g: 0.15, b: 0.15, a: 1 },
    },
  },
  upgrade: {
    filled: {
      'background-default': { r: 0.93, g: 0.63, b: 0.13, a: 1 },
      'background-hover': { r: 0.88, g: 0.58, b: 0.08, a: 1 },
      'background-pressed': { r: 0.78, g: 0.48, b: 0.03, a: 1 },
      'background-disabled': { r: 0.93, g: 0.63, b: 0.13, a: 0.4 },
      'background-loading': { r: 0.93, g: 0.63, b: 0.13, a: 1 },
      'content': { r: 1, g: 1, b: 1, a: 1 },
      'content-disabled': { r: 1, g: 1, b: 1, a: 0.6 },
    },
    plain: {
      'background-default': { r: 0, g: 0, b: 0, a: 0 },
      'background-hover': { r: 0.93, g: 0.63, b: 0.13, a: 0.08 },
      'background-pressed': { r: 0.93, g: 0.63, b: 0.13, a: 0.12 },
      'background-disabled': { r: 0, g: 0, b: 0, a: 0 },
      'background-loading': { r: 0, g: 0, b: 0, a: 0 },
      'content-default': { r: 0.93, g: 0.63, b: 0.13, a: 1 },
      'content-hover': { r: 0.88, g: 0.58, b: 0.08, a: 1 },
      'content-pressed': { r: 0.78, g: 0.48, b: 0.03, a: 1 },
      'content-disabled': { r: 0.93, g: 0.63, b: 0.13, a: 0.4 },
      'content-loading': { r: 0.93, g: 0.63, b: 0.13, a: 1 },
    },
  },
};

const SIZE_TOKENS: Record<string, Record<string, number>> = {
  sm: { height: 32, paddingX: 12, gap: 6, fontSize: 13, iconSize: 16, radius: 6 },
  md: { height: 40, paddingX: 16, gap: 8, fontSize: 14, iconSize: 20, radius: 8 },
  lg: { height: 48, paddingX: 20, gap: 10, fontSize: 16, iconSize: 24, radius: 10 },
};

// =============================================================================
// Helper Functions
// =============================================================================

function getColor(colorScheme: string, appearance: string, key: string): Rgba {
  return COLOR_SCHEMES[colorScheme]?.[appearance]?.[key] || { r: 0.5, g: 0.5, b: 0.5, a: 1 };
}

function getContentColor(colorScheme: string, appearance: string, state: string): Rgba {
  const scheme = COLOR_SCHEMES[colorScheme]?.[appearance];
  if (!scheme) return { r: 0.5, g: 0.5, b: 0.5, a: 1 };

  // For filled buttons, content color is constant except disabled
  if (appearance === 'filled') {
    return state === 'disabled' ? scheme['content-disabled'] : scheme['content'];
  }

  // For plain buttons, content color varies by state
  return scheme[`content-${state}`] || scheme['content-default'];
}

function getBackgroundColor(colorScheme: string, appearance: string, state: string): Rgba {
  const scheme = COLOR_SCHEMES[colorScheme]?.[appearance];
  if (!scheme) return { r: 0, g: 0, b: 0, a: 0 };
  return scheme[`background-${state}`] || scheme['background-default'];
}

// =============================================================================
// Build Functions
// =============================================================================

function buildVariantProperties(buttonType: ButtonTypeConfig): VariantProperty[] {
  const props: VariantProperty[] = [];

  // Appearance (only if more than 1 appearance)
  if (buttonType.appearances.length > 1) {
    props.push({
      name: 'Appearance',
      values: buttonType.appearances,
      type: 'VARIANT',
      defaultValue: buttonType.appearances[0],
    });
  }

  // State
  props.push({
    name: 'State',
    values: STATES,
    type: 'VARIANT',
    defaultValue: 'default',
  });

  // Icon
  props.push({
    name: 'Icon',
    values: ICONS,
    type: 'VARIANT',
    defaultValue: 'none',
  });

  // Size
  props.push({
    name: 'Size',
    values: SIZES,
    type: 'VARIANT',
    defaultValue: 'md',
  });

  return props;
}

function buildVariantStyle(
  buttonType: ButtonTypeConfig,
  appearance: string,
  state: string
): VariantDefinition['style'] {
  const { colorScheme } = buttonType;

  return {
    fill: {
      variable: `button/${buttonType.name.toLowerCase()}/${appearance}/background/${state}`,
      fallback: getBackgroundColor(colorScheme, appearance, state),
    },
    contentColor: {
      variable: `button/${buttonType.name.toLowerCase()}/${appearance}/content/${state}`,
      fallback: getContentColor(colorScheme, appearance, state),
    },
  };
}

function buildVariantDefinitions(buttonType: ButtonTypeConfig): VariantDefinition[] {
  const variants: VariantDefinition[] = [];

  for (const appearance of buttonType.appearances) {
    for (const state of STATES) {
      for (const icon of ICONS) {
        for (const size of SIZES) {
          const variantProps: Record<string, string> = {
            State: state,
            Icon: icon,
            Size: size,
          };

          // Only add Appearance if there are multiple
          if (buttonType.appearances.length > 1) {
            variantProps.Appearance = appearance;
          }

          const variant: VariantDefinition = {
            variant: variantProps,
            style: buildVariantStyle(buttonType, appearance, state),
          };

          // Set layout key based on icon
          if (icon === 'only') {
            variant.layoutKey = 'iconOnly';
          } else if (icon === 'left') {
            variant.layoutKey = 'iconStart';
          } else if (icon === 'right') {
            variant.layoutKey = 'iconEnd';
          }

          // Loading state layout
          if (state === 'loading') {
            variant.layoutKey = 'loading';
          }

          variants.push(variant);
        }
      }
    }
  }

  return variants;
}

function buildOverridables(): Overridable[] {
  return [
    {
      name: 'Text',
      type: 'TEXT',
      target: 'Label',
      defaultValue: 'Button',
    },
    {
      name: 'Icon',
      type: 'INSTANCE_SWAP',
      target: 'Icon',
    },
  ];
}

function buildLayout(): LayoutDefinition {
  return {
    mode: 'HORIZONTAL',
    primaryAxisAlignItems: 'CENTER',
    counterAxisAlignItems: 'CENTER',
    itemSpacing: 'gap/button/icon/md',
    padding: {
      top: 0,
      right: 'padding/button/md',
      bottom: 0,
      left: 'padding/button/md',
    },
    children: [
      { role: 'startIcon', name: 'Icon', order: 'start', type: 'FRAME', visible: false },
      { role: 'label', name: 'Label', order: 'center', type: 'TEXT', visible: true },
      { role: 'endIcon', name: 'Icon', order: 'end', type: 'FRAME', visible: false },
      { role: 'loading', name: 'Spinner', order: 'center', type: 'FRAME', visible: false },
    ],
    sizing: {
      width: 'HUG',
      height: 'FIXED',
    },
  };
}

function buildLayoutVariants(): LayoutVariants {
  return {
    iconOnly: {
      children: [
        { role: 'icon', name: 'Icon', order: 'center', type: 'FRAME', visible: true },
      ],
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
      children: [
        { role: 'loading', name: 'Spinner', order: 'center', type: 'ELLIPSE', visible: true },
      ],
    },
  };
}

function buildVariables(buttonType: ButtonTypeConfig): VariableCollections {
  const collections: VariableCollections = {};
  const collectionName = `Components/Button/${buttonType.name}`;
  const variables: DesignVariable[] = [];

  for (const appearance of buttonType.appearances) {
    for (const state of STATES) {
      // Background variable
      const bgColor = getBackgroundColor(buttonType.colorScheme, appearance, state);
      variables.push({
        cssVar: `--button-${buttonType.name.toLowerCase()}-${appearance}-bg-${state}`,
        figmaName: `button/${buttonType.name.toLowerCase()}/${appearance}/background/${state}`,
        type: 'COLOR',
        value: bgColor,
        collection: collectionName,
      });

      // Content variable
      const contentColor = getContentColor(buttonType.colorScheme, appearance, state);
      variables.push({
        cssVar: `--button-${buttonType.name.toLowerCase()}-${appearance}-content-${state}`,
        figmaName: `button/${buttonType.name.toLowerCase()}/${appearance}/content/${state}`,
        type: 'COLOR',
        value: contentColor,
        collection: collectionName,
      });
    }
  }

  // Size tokens
  for (const [size, tokens] of Object.entries(SIZE_TOKENS)) {
    variables.push({
      cssVar: `--button-height-${size}`,
      figmaName: `button/height/${size}`,
      type: 'FLOAT',
      value: tokens.height,
      collection: 'Components/Button',
    });
    variables.push({
      cssVar: `--button-padding-${size}`,
      figmaName: `button/padding/${size}`,
      type: 'FLOAT',
      value: tokens.paddingX,
      collection: 'Components/Button',
    });
    variables.push({
      cssVar: `--button-gap-${size}`,
      figmaName: `button/gap/${size}`,
      type: 'FLOAT',
      value: tokens.gap,
      collection: 'Components/Button',
    });
    variables.push({
      cssVar: `--button-radius-${size}`,
      figmaName: `button/radius/${size}`,
      type: 'FLOAT',
      value: tokens.radius,
      collection: 'Components/Button',
    });
  }

  collections[collectionName] = {
    modes: [{ id: 'default', name: 'Default' }],
    variables,
  };

  return collections;
}

// =============================================================================
// Main Generate Function
// =============================================================================

function generateButtonComponentSet(buttonType: ButtonTypeConfig): DesignJson {
  const variants = buildVariantDefinitions(buttonType);

  return {
    meta: {
      name: `Button/${buttonType.name}`,
      reactComponent: 'Button.tsx',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
    },
    variables: buildVariables(buttonType),
    componentSet: {
      name: `Button/${buttonType.name}`,
      variantProperties: buildVariantProperties(buttonType),
      overridables: buildOverridables(),
      validCombinations: {
        [buttonType.name.toLowerCase()]: buttonType.appearances,
      },
      variants,
    },
    layout: buildLayout(),
    layoutVariants: buildLayoutVariants(),
  };
}

// =============================================================================
// CLI Entry Point
// =============================================================================

const args = process.argv.slice(2);
const componentPath = args[0] || '../components/Button';
const outputDir = args[1] || path.join(__dirname, '../examples');

try {
  console.log(`\nGenerating Button component sets...\n`);
  fs.mkdirSync(outputDir, { recursive: true });

  let totalVariants = 0;
  let totalVariables = 0;

  for (const buttonType of BUTTON_TYPES) {
    const designJson = generateButtonComponentSet(buttonType);
    const outputPath = path.join(outputDir, `button-${buttonType.name.toLowerCase()}.design.json`);

    fs.writeFileSync(outputPath, JSON.stringify(designJson, null, 2));

    const variantCount = designJson.componentSet.variants.length;
    let varCount = 0;
    for (const coll of Object.values(designJson.variables)) {
      varCount += coll.variables.length;
    }

    totalVariants += variantCount;
    totalVariables += varCount;

    console.log(`  Button/${buttonType.name}:`);
    console.log(`    - Appearances: ${buttonType.appearances.join(', ')}`);
    console.log(`    - Variants: ${variantCount}`);
    console.log(`    - Variables: ${varCount}`);
    console.log(`    - Output: ${outputPath}\n`);
  }

  console.log(`\n========================================`);
  console.log(`Summary:`);
  console.log(`  - Component sets: ${BUTTON_TYPES.length}`);
  console.log(`  - Total variants: ${totalVariants}`);
  console.log(`  - Total variables: ${totalVariables}`);
  console.log(`========================================\n`);
} catch (error) {
  console.error('Error generating component sets:', error);
  process.exit(1);
}
