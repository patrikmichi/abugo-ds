/**
 * Component Set Insertion Module
 *
 * Creates Figma component sets from Design JSON,
 * applying styles and binding variables.
 */

import type {
  DesignJson,
  VariantDefinition,
  LayoutDefinition,
  LayoutChild,
  FillStyle,
  StrokeStyle,
  Rgba,
} from '../schemas/design-json';
import { type ResolvedVariables, bindFillVariable, bindStrokeVariable, bindDimensionVariable } from './resolveVariables';

// =============================================================================
// Extended Variant Definition (with dimensions)
// =============================================================================

interface DimensionValue {
  variable?: string;
  fallback: number;
}

interface VariantDimensions {
  height?: DimensionValue;
  paddingLeft?: DimensionValue;
  paddingRight?: DimensionValue;
  gap?: DimensionValue;
  cornerRadius?: DimensionValue;
  iconSize?: DimensionValue;
  width?: DimensionValue;
}

interface ExtendedVariantDefinition extends VariantDefinition {
  dimensions?: VariantDimensions;
}

// =============================================================================
// Types
// =============================================================================

interface SizeConfig {
  height: number;
  paddingLeft: number;
  paddingRight: number;
  gap: number;
  fontSize: number;
  iconSize: number;
  radius: number;
}

// =============================================================================
// Size Configurations
// =============================================================================

const SIZE_CONFIGS: Record<string, SizeConfig> = {
  sm: {
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    gap: 6,
    fontSize: 13,
    iconSize: 20,
    radius: 6,
  },
  md: {
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
    fontSize: 14,
    iconSize: 24,
    radius: 8,
  },
  lg: {
    height: 48,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 10,
    fontSize: 16,
    iconSize: 24,
    radius: 10,
  },
};

const PLAIN_HEIGHT_CONFIGS: Record<string, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Check if value is Rgba
 */
function isRgba(value: unknown): value is Rgba {
  return (
    typeof value === 'object' &&
    value !== null &&
    'r' in value &&
    'g' in value &&
    'b' in value &&
    'a' in value
  );
}

/**
 * Convert Rgba to Figma paint
 */
function rgbaToFigmaPaint(rgba: Rgba): SolidPaint {
  return {
    type: 'SOLID',
    color: {
      r: Math.max(0, Math.min(1, rgba.r)),
      g: Math.max(0, Math.min(1, rgba.g)),
      b: Math.max(0, Math.min(1, rgba.b)),
    },
    opacity: rgba.a,
  };
}

/**
 * Get size config from variant
 */
function getSizeConfig(variant: Record<string, string>): SizeConfig {
  const size = variant['Size'] || 'md';
  return SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
}

/**
 * Check if variant is a plain appearance
 */
function isPlainVariant(variant: Record<string, string>): boolean {
  return variant['Appearance'] === 'plain';
}

/**
 * Get height for variant
 */
function getVariantHeight(variant: Record<string, string>): number {
  const size = variant['Size'] || 'md';
  const sizeConfig = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  if (isPlainVariant(variant)) {
    return PLAIN_HEIGHT_CONFIGS[size] || PLAIN_HEIGHT_CONFIGS.md;
  }

  return sizeConfig.height;
}

// =============================================================================
// Frame Creation
// =============================================================================

/**
 * Create the base frame for a variant
 */
async function createVariantFrame(
  variant: ExtendedVariantDefinition,
  layout: LayoutDefinition,
  resolvedVars: ResolvedVariables
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const sizeConfig = getSizeConfig(variant.variant);
  const iconLayout = variant.variant['Icon'] || 'None';

  // Get dimensions from variant or use fallbacks from sizeConfig
  const dims = variant.dimensions;
  const height = dims?.height?.fallback ?? getVariantHeight(variant.variant);
  const paddingLeft = dims?.paddingLeft?.fallback ?? sizeConfig.paddingLeft;
  const paddingRight = dims?.paddingRight?.fallback ?? sizeConfig.paddingRight;
  const gap = dims?.gap?.fallback ?? sizeConfig.gap;
  const cornerRadius = dims?.cornerRadius?.fallback ?? sizeConfig.radius;

  // Set auto-layout
  frame.layoutMode = layout.mode;
  frame.primaryAxisAlignItems = layout.primaryAxisAlignItems || 'CENTER';
  frame.counterAxisAlignItems = layout.counterAxisAlignItems || 'CENTER';
  frame.itemSpacing = gap;

  // Set sizing
  if (iconLayout === 'Only') {
    // Icon-only: square - use width dimension or height as fallback
    const iconOnlySize = dims?.width?.fallback ?? height;
    frame.layoutSizingHorizontal = 'FIXED';
    frame.layoutSizingVertical = 'FIXED';
    frame.resize(iconOnlySize, iconOnlySize);

    // Bind width variable for icon-only
    if (dims?.width?.variable) {
      await bindDimensionVariable(frame, 'width', dims.width.variable, resolvedVars);
      await bindDimensionVariable(frame, 'height', dims.width.variable, resolvedVars);
    }
  } else {
    // Normal: hug content horizontally, fixed height
    frame.layoutSizingHorizontal = 'HUG';
    frame.layoutSizingVertical = 'FIXED';
    frame.resize(100, height);

    // Bind height variable
    if (dims?.height?.variable) {
      await bindDimensionVariable(frame, 'height', dims.height.variable, resolvedVars);
    }
  }

  // Set padding (skip for icon-only)
  if (iconLayout !== 'Only') {
    // Optical adjustment for icons
    const hasStartIcon = iconLayout === 'Leading';
    const hasEndIcon = iconLayout === 'Trailing';
    const opticalAdjust = 4;

    frame.paddingLeft = hasStartIcon ? paddingLeft - opticalAdjust : paddingLeft;
    frame.paddingRight = hasEndIcon ? paddingRight - opticalAdjust : paddingRight;
    frame.paddingTop = 0;
    frame.paddingBottom = 0;

    // Bind padding variables
    if (dims?.paddingLeft?.variable) {
      await bindDimensionVariable(frame, 'paddingLeft', dims.paddingLeft.variable, resolvedVars);
    }
    if (dims?.paddingRight?.variable) {
      await bindDimensionVariable(frame, 'paddingRight', dims.paddingRight.variable, resolvedVars);
    }
  }

  // Bind gap variable
  if (dims?.gap?.variable) {
    await bindDimensionVariable(frame, 'itemSpacing', dims.gap.variable, resolvedVars);
  }

  // Set corner radius
  frame.cornerRadius = cornerRadius;

  // Bind corner radius variable (Figma uses topLeftRadius, etc. for individual corners)
  if (dims?.cornerRadius?.variable) {
    await bindDimensionVariable(frame, 'topLeftRadius', dims.cornerRadius.variable, resolvedVars);
    await bindDimensionVariable(frame, 'topRightRadius', dims.cornerRadius.variable, resolvedVars);
    await bindDimensionVariable(frame, 'bottomLeftRadius', dims.cornerRadius.variable, resolvedVars);
    await bindDimensionVariable(frame, 'bottomRightRadius', dims.cornerRadius.variable, resolvedVars);
  }

  // Apply fill style
  if (variant.style.fill?.fallback) {
    frame.fills = [rgbaToFigmaPaint(variant.style.fill.fallback)];

    // Try to bind variable using new API
    if (variant.style.fill.variable) {
      await bindFillVariable(frame, variant.style.fill.variable, resolvedVars);
    }
  } else if (variant.variant['Appearance'] === 'outline') {
    // Transparent background for outline
    frame.fills = [];
  }

  // Apply stroke style for outline variants
  if (variant.style.stroke?.fallback) {
    frame.strokes = [rgbaToFigmaPaint(variant.style.stroke.fallback)];
    frame.strokeWeight = variant.style.stroke.weight || 1;
    frame.strokeAlign = variant.style.stroke.align || 'INSIDE';

    // Try to bind variable using new API
    if (variant.style.stroke.variable) {
      await bindStrokeVariable(frame, variant.style.stroke.variable, resolvedVars);
    }
  }

  // Apply opacity for disabled state
  if (variant.style.opacity !== undefined) {
    frame.opacity = variant.style.opacity;
  }

  return frame;
}

/**
 * Create text element for label
 */
async function createLabelText(
  variant: ExtendedVariantDefinition,
  resolvedVars: ResolvedVariables
): Promise<TextNode> {
  const text = figma.createText();
  const sizeConfig = getSizeConfig(variant.variant);

  // Load font
  text.fontName = { family: 'Inter', style: 'Medium' };
  text.characters = 'Button';
  text.fontSize = sizeConfig.fontSize;
  text.textCase = 'UPPER';
  text.letterSpacing = { value: 0.5, unit: 'PIXELS' };

  // Apply content color
  if (variant.style.contentColor?.fallback) {
    text.fills = [rgbaToFigmaPaint(variant.style.contentColor.fallback)];

    // Try to bind variable using new API
    if (variant.style.contentColor.variable) {
      await bindFillVariable(text, variant.style.contentColor.variable, resolvedVars);
    }
  }

  return text;
}

/**
 * Create icon placeholder frame
 */
async function createIconFrame(
  variant: ExtendedVariantDefinition,
  resolvedVars: ResolvedVariables
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const sizeConfig = getSizeConfig(variant.variant);

  // Get icon size from dimensions or use fallback
  const dims = variant.dimensions;
  const iconSize = dims?.iconSize?.fallback ?? sizeConfig.iconSize;

  // Set size
  frame.resize(iconSize, iconSize);
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisAlignItems = 'CENTER';
  frame.counterAxisAlignItems = 'CENTER';

  // Make it transparent
  frame.fills = [];

  // Bind icon size variables
  if (dims?.iconSize?.variable) {
    await bindDimensionVariable(frame, 'width', dims.iconSize.variable, resolvedVars);
    await bindDimensionVariable(frame, 'height', dims.iconSize.variable, resolvedVars);
  }

  // Create icon placeholder (rectangle)
  const iconPlaceholder = figma.createRectangle();
  iconPlaceholder.resize(iconSize * 0.75, iconSize * 0.75);
  iconPlaceholder.cornerRadius = 2;

  // Apply content color to icon
  if (variant.style.contentColor?.fallback) {
    iconPlaceholder.fills = [rgbaToFigmaPaint(variant.style.contentColor.fallback)];

    if (variant.style.contentColor.variable) {
      await bindFillVariable(iconPlaceholder, variant.style.contentColor.variable, resolvedVars);
    }
  }

  frame.appendChild(iconPlaceholder);
  frame.name = 'Icon';

  return frame;
}

/**
 * Create loading spinner
 */
async function createLoadingSpinner(
  variant: ExtendedVariantDefinition,
  resolvedVars: ResolvedVariables
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const sizeConfig = getSizeConfig(variant.variant);

  // Get icon size from dimensions or use fallback
  const dims = variant.dimensions;
  const iconSize = dims?.iconSize?.fallback ?? sizeConfig.iconSize;

  // Set size
  frame.resize(iconSize, iconSize);
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisAlignItems = 'CENTER';
  frame.counterAxisAlignItems = 'CENTER';
  frame.fills = [];

  // Bind icon size variables
  if (dims?.iconSize?.variable) {
    await bindDimensionVariable(frame, 'width', dims.iconSize.variable, resolvedVars);
    await bindDimensionVariable(frame, 'height', dims.iconSize.variable, resolvedVars);
  }

  // Create spinner (ellipse with stroke)
  const spinner = figma.createEllipse();
  spinner.resize(iconSize * 0.8, iconSize * 0.8);
  spinner.fills = [];

  // Apply stroke for spinner
  if (variant.style.contentColor?.fallback) {
    spinner.strokes = [rgbaToFigmaPaint(variant.style.contentColor.fallback)];
    spinner.strokeWeight = 2;

    if (variant.style.contentColor.variable) {
      await bindStrokeVariable(spinner, variant.style.contentColor.variable, resolvedVars);
    }
  }

  frame.appendChild(spinner);
  frame.name = 'Loading';

  return frame;
}

// =============================================================================
// Variant Assembly
// =============================================================================

/**
 * Assemble a complete variant frame with children
 */
async function assembleVariantFrame(
  variant: ExtendedVariantDefinition,
  layout: LayoutDefinition,
  resolvedVars: ResolvedVariables
): Promise<FrameNode> {
  // Load fonts first
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });

  const frame = await createVariantFrame(variant, layout, resolvedVars);
  const iconLayout = variant.variant['Icon'] || 'None';
  const state = variant.variant['State'] || 'default';

  // Handle loading state
  if (state === 'loading') {
    const loading = await createLoadingSpinner(variant, resolvedVars);
    frame.appendChild(loading);
    frame.name = buildVariantName(variant);
    return frame;
  }

  // Handle icon-only
  if (iconLayout === 'Only') {
    const icon = await createIconFrame(variant, resolvedVars);
    frame.appendChild(icon);
    frame.name = buildVariantName(variant);
    return frame;
  }

  // Build children based on icon layout
  if (iconLayout === 'Leading') {
    const startIcon = await createIconFrame(variant, resolvedVars);
    startIcon.name = 'StartIcon';
    frame.appendChild(startIcon);
  }

  // Add label
  const label = await createLabelText(variant, resolvedVars);
  label.name = 'Label';
  frame.appendChild(label);

  if (iconLayout === 'Trailing') {
    const endIcon = await createIconFrame(variant, resolvedVars);
    endIcon.name = 'EndIcon';
    frame.appendChild(endIcon);
  }

  frame.name = buildVariantName(variant);
  return frame;
}

/**
 * Build variant name from properties
 */
function buildVariantName(variant: ExtendedVariantDefinition): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(variant.variant)) {
    parts.push(`${key}=${value}`);
  }
  return parts.join(', ');
}

// =============================================================================
// Grid Layout Configuration
// =============================================================================

interface GridConfig {
  cellWidth: number;
  cellHeight: number;
  columnGap: number;
  rowGap: number;
  columnsPerRow: number;
}

/**
 * Calculate grid position for a variant
 */
function getGridPosition(
  index: number,
  config: GridConfig
): { x: number; y: number } {
  const col = index % config.columnsPerRow;
  const row = Math.floor(index / config.columnsPerRow);
  return {
    x: col * (config.cellWidth + config.columnGap),
    y: row * (config.cellHeight + config.rowGap),
  };
}

/**
 * Sort variants for grid layout: group by State × Icon, then Appearance × Size
 * This creates rows like: [filled-sm, filled-md, filled-lg, plain-sm, plain-md, plain-lg]
 */
function sortVariantsForGrid(
  variants: ExtendedVariantDefinition[]
): ExtendedVariantDefinition[] {
  const stateOrder = ['default', 'hover', 'pressed', 'disabled', 'loading'];
  const iconOrder = ['none', 'left', 'right', 'only'];
  const appearanceOrder = ['filled', 'outline', 'plain'];
  const sizeOrder = ['sm', 'md', 'lg'];

  return [...variants].sort((a, b) => {
    // First sort by state
    const stateA = stateOrder.indexOf(a.variant['State']?.toLowerCase() || 'default');
    const stateB = stateOrder.indexOf(b.variant['State']?.toLowerCase() || 'default');
    if (stateA !== stateB) return stateA - stateB;

    // Then by icon
    const iconA = iconOrder.indexOf(a.variant['Icon']?.toLowerCase() || 'none');
    const iconB = iconOrder.indexOf(b.variant['Icon']?.toLowerCase() || 'none');
    if (iconA !== iconB) return iconA - iconB;

    // Then by appearance
    const appA = appearanceOrder.indexOf(a.variant['Appearance']?.toLowerCase() || 'filled');
    const appB = appearanceOrder.indexOf(b.variant['Appearance']?.toLowerCase() || 'filled');
    if (appA !== appB) return appA - appB;

    // Finally by size
    const sizeA = sizeOrder.indexOf(a.variant['Size']?.toLowerCase() || 'md');
    const sizeB = sizeOrder.indexOf(b.variant['Size']?.toLowerCase() || 'md');
    return sizeA - sizeB;
  });
}

/**
 * Calculate the number of columns based on appearances and sizes
 */
function calculateColumnsPerRow(design: DesignJson): number {
  const appearances = design.componentSet.variantProperties.find(p => p.name === 'Appearance');
  const sizes = design.componentSet.variantProperties.find(p => p.name === 'Size');

  const numAppearances = appearances?.values.length || 1;
  const numSizes = sizes?.values.length || 3;

  // Columns = appearances × sizes (e.g., 2 appearances × 3 sizes = 6 columns)
  return numAppearances * numSizes;
}

// =============================================================================
// Main Export Function
// =============================================================================

/**
 * Insert a complete component set from Design JSON
 */
export async function insertComponentSet(
  design: DesignJson,
  resolvedVars: ResolvedVariables
): Promise<ComponentSetNode> {
  // Sort variants for grid layout
  const sortedVariants = sortVariantsForGrid(
    design.componentSet.variants as ExtendedVariantDefinition[]
  );

  // Calculate grid configuration
  const columnsPerRow = calculateColumnsPerRow(design);
  const gridConfig: GridConfig = {
    cellWidth: 120,   // Base cell width
    cellHeight: 60,   // Base cell height
    columnGap: 20,    // Gap between columns
    rowGap: 20,       // Gap between rows
    columnsPerRow,
  };

  // Create all variant frames and position them in grid
  const components: ComponentNode[] = [];

  for (let i = 0; i < sortedVariants.length; i++) {
    const variant = sortedVariants[i];

    // Create and assemble the frame
    const frame = await assembleVariantFrame(variant, design.layout, resolvedVars);

    // Convert to component
    const component = figma.createComponentFromNode(frame);

    // Position in grid
    const pos = getGridPosition(i, gridConfig);
    component.x = pos.x;
    component.y = pos.y;

    components.push(component);
  }

  // Combine into component set
  if (components.length === 0) {
    throw new Error('No variants created');
  }

  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = design.componentSet.name;

  // Add layout grid to component set for visual reference
  const numRows = Math.ceil(sortedVariants.length / columnsPerRow);
  componentSet.layoutGrids = [
    {
      pattern: 'GRID',
      sectionSize: gridConfig.cellWidth + gridConfig.columnGap,
      visible: true,
      color: { r: 0.5, g: 0.5, b: 1, a: 0.1 },
    },
    {
      pattern: 'COLUMNS',
      alignment: 'MIN',
      gutterSize: gridConfig.columnGap,
      count: columnsPerRow,
      sectionSize: gridConfig.cellWidth,
      offset: 0,
      visible: false,
      color: { r: 0.3, g: 0.6, b: 1, a: 0.1 },
    },
    {
      pattern: 'ROWS',
      alignment: 'MIN',
      gutterSize: gridConfig.rowGap,
      count: numRows,
      sectionSize: gridConfig.cellHeight,
      offset: 0,
      visible: false,
      color: { r: 1, g: 0.3, b: 0.3, a: 0.1 },
    },
  ];

  // Position in viewport
  const viewportCenter = figma.viewport.center;
  componentSet.x = viewportCenter.x - componentSet.width / 2;
  componentSet.y = viewportCenter.y - componentSet.height / 2;

  return componentSet;
}
