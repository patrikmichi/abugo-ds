/**
 * Design JSON Schema for Figma Component Generation
 *
 * This schema maps React component props and CSS variables to Figma
 * component properties and variables, following Sato-UI style conventions.
 */

// =============================================================================
// RGBA Color Type
// =============================================================================

export interface Rgba {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
  a: number; // 0-1
}

// =============================================================================
// Design Variable Types
// =============================================================================

export type VariableType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

/**
 * Figma variable definition
 * Either reference existing by name or define for creation
 */
export interface DesignVariable {
  /** CSS variable name, e.g. --token-component-button-primary-filled-background-default */
  cssVar: string;
  /** Name used in Figma to resolve "use existing" (e.g. token path like "button/primary/filled/background/default") */
  figmaName: string;
  /** Variable type */
  type: VariableType;
  /** For create: value per mode. For use-existing: can be empty */
  value: Rgba | number | string | boolean;
  /** Collection to create in if missing; e.g. "Primitives", "Semantic", "Components/Button" */
  collection: string;
  /** Optional description for the variable */
  description?: string;
  /** Optional scopes for where this variable can be used */
  scopes?: string[];
}

/**
 * Variable collections grouped by name
 * Enables Sato-UI style layering (Primitives → Semantic → Component)
 */
export interface VariableCollections {
  [collectionName: string]: {
    modes: Array<{ id: string; name: string }>;
    variables: DesignVariable[];
  };
}

// =============================================================================
// Component Set Types
// =============================================================================

/**
 * Variant property for the component set
 */
export interface VariantProperty {
  /** Figma property name, e.g. "Variant", "Size", "State" */
  name: string;
  /** Possible values, e.g. ["primary", "secondary", "danger"] */
  values: string[];
  /** Property type */
  type: 'VARIANT';
  /** Default value */
  defaultValue?: string;
}

/**
 * Overridable element (text, icon, etc.)
 */
export interface Overridable {
  /** Element name, e.g. "Label", "Icon" */
  name: string;
  /** Type of override */
  type: 'TEXT' | 'INSTANCE_SWAP' | 'BOOLEAN';
  /** Target layer name in the component */
  target: string;
  /** Default value */
  defaultValue?: string | boolean;
}

// =============================================================================
// Style Definitions
// =============================================================================

/**
 * Fill style (background color)
 */
export interface FillStyle {
  /** Variable figmaName to reference */
  variable?: string;
  /** Fallback value if variable not found */
  fallback?: Rgba;
  /** Opacity (0-1) */
  opacity?: number;
}

/**
 * Stroke style (border)
 */
export interface StrokeStyle {
  /** Variable figmaName to reference */
  variable?: string;
  /** Fallback value if variable not found */
  fallback?: Rgba;
  /** Stroke weight */
  weight?: number;
  /** Stroke align */
  align?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
}

/**
 * Typography style
 */
export interface TypographyStyle {
  /** Font size (px) */
  size?: number;
  /** Font size variable */
  sizeVariable?: string;
  /** Font weight */
  weight?: number;
  /** Font weight variable */
  weightVariable?: string;
  /** Line height */
  lineHeight?: number;
  /** Letter spacing */
  letterSpacing?: number;
  /** Text transform */
  textTransform?: 'NONE' | 'UPPERCASE' | 'LOWERCASE' | 'CAPITALIZE';
}

/**
 * Spacing style
 */
export interface SpacingStyle {
  /** Padding values or variable refs */
  padding?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  /** Gap between items */
  gap?: number | string;
}

/**
 * Complete style definition for a variant
 */
export interface VariantStyle {
  fill?: FillStyle;
  stroke?: StrokeStyle;
  typography?: TypographyStyle;
  spacing?: SpacingStyle;
  /** Content/text color */
  contentColor?: FillStyle;
  /** Corner radius */
  cornerRadius?: number | string;
  /** Opacity for the entire variant */
  opacity?: number;
  /** Effects (shadows, etc.) */
  effects?: Array<{
    type: 'DROP_SHADOW' | 'INNER_SHADOW';
    color?: FillStyle;
    offset?: { x: number; y: number };
    radius?: number;
    spread?: number;
  }>;
}

// =============================================================================
// Variant Definition
// =============================================================================

/**
 * Layout key for different component configurations
 */
export type LayoutKey = 'default' | 'iconOnly' | 'loading' | 'iconStart' | 'iconEnd';

/**
 * Single variant definition
 */
export interface VariantDefinition {
  /** Variant property values for this combination */
  variant: Record<string, string>;
  /** Styles to apply for this variant */
  style: VariantStyle;
  /** Optional: different layout for this variant */
  layoutKey?: LayoutKey;
}

// =============================================================================
// Layout Definition
// =============================================================================

/**
 * Child element in the layout
 */
export interface LayoutChild {
  /** Role of the child */
  role: 'label' | 'icon' | 'loading' | 'startIcon' | 'endIcon';
  /** Layer name in Figma */
  name: string;
  /** Position in the layout */
  order: 'start' | 'end' | 'center';
  /** Element type */
  type?: 'TEXT' | 'FRAME' | 'INSTANCE' | 'RECTANGLE' | 'ELLIPSE';
  /** Whether this child is visible by default */
  visible?: boolean;
}

/**
 * Layout definition for the component
 */
export interface LayoutDefinition {
  /** Auto-layout mode */
  mode: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  /** Main axis alignment */
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  /** Cross axis alignment */
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  /** Item spacing (gap) */
  itemSpacing?: number | string;
  /** Padding */
  padding?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  /** Child elements */
  children: LayoutChild[];
  /** Sizing mode */
  sizing?: {
    width?: 'FIXED' | 'HUG' | 'FILL';
    height?: 'FIXED' | 'HUG' | 'FILL';
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

/**
 * Layout variants for different configurations (iconOnly, loading, etc.)
 */
export interface LayoutVariants {
  [key: string]: Partial<LayoutDefinition>;
}

// =============================================================================
// Component Set Definition
// =============================================================================

/**
 * Component set configuration
 */
export interface ComponentSetConfig {
  /** Component set name in Figma */
  name: string;
  /** Variant properties */
  variantProperties: VariantProperty[];
  /** Overridable elements */
  overridables: Overridable[];
  /** Valid combinations (from React VALID_COMBINATIONS) */
  validCombinations: Record<string, string[]>;
  /** All variant definitions */
  variants: VariantDefinition[];
}

// =============================================================================
// Meta Information
// =============================================================================

/**
 * Metadata about the design JSON
 */
export interface DesignMeta {
  /** Component name */
  name: string;
  /** Source React component name */
  reactComponent: string;
  /** Version */
  version?: string;
  /** Description */
  description?: string;
  /** Author */
  author?: string;
  /** Date generated */
  generatedAt?: string;
}

// =============================================================================
// Main Design JSON Interface
// =============================================================================

/**
 * Complete Design JSON structure
 */
export interface DesignJson {
  /** Meta information */
  meta: DesignMeta;
  /** Variable collections */
  variables: VariableCollections;
  /** Component set configuration */
  componentSet: ComponentSetConfig;
  /** Base layout definition */
  layout: LayoutDefinition;
  /** Layout variants for different configurations */
  layoutVariants?: LayoutVariants;
}

// =============================================================================
// Mapping Types (React → Figma)
// =============================================================================

/**
 * Mapping from React props to Figma variant properties
 */
export interface PropToVariantMapping {
  /** React prop name */
  prop: string;
  /** Figma property name */
  figmaProp: string;
  /** Value transformations */
  valueMap?: Record<string, string>;
}

/**
 * Mapping from CSS variable to Figma variable
 */
export interface CssToFigmaMapping {
  /** CSS variable name (e.g., --token-component-button-*) */
  cssPattern: RegExp;
  /** Collection name in Figma */
  collection: string;
  /** Transform function for figmaName */
  nameTransform: (cssVar: string) => string;
}

// =============================================================================
// Message Types (Plugin ↔ UI Communication)
// =============================================================================

export type PluginMessage =
  | { type: 'INSERT_COMPONENT_SET'; payload: DesignJson }
  | { type: 'PREVIEW'; payload: DesignJson }
  | { type: 'GET_EXISTING_VARIABLES' }
  | { type: 'VALIDATE_JSON'; payload: DesignJson }
  | { type: 'GET_EMBEDDED_JSONS' }
  | { type: 'GET_COMPONENT_JSON'; componentId: string }
  | { type: 'EXPORT_VARIABLES' }
  | { type: 'EXPORT_COMPONENT_VARIABLES' }
  | { type: 'COMPARE_TOKENS'; tokens: Record<string, any> };

export type UIMessage =
  | { type: 'INSERT_DONE'; nodeId: string; name: string }
  | { type: 'ERROR'; error: string }
  | { type: 'EXISTING_VARIABLES'; variables: string[] }
  | { type: 'VALIDATION_RESULT'; valid: boolean; errors?: string[] }
  | { type: 'PREVIEW_RESULT'; variantCount: number; variableCount: number; collections: string[] }
  | { type: 'EMBEDDED_JSONS'; jsons: Record<string, DesignJson> }
  | { type: 'COMPONENT_JSON'; componentId: string; json: DesignJson }
  | { type: 'VARIABLES_EXPORT'; export: VariableExportData }
  | { type: 'COMPARISON_RESULT'; result: ComparisonResultData };

/** Token comparison result data */
export interface ComparisonResultData {
  matches: Array<{
    path: string;
    codeRef: string;
    figmaRef: string;
    type: string;
  }>;
  mismatches: Array<{
    path: string;
    codeRef: string;
    figmaRef: string;
    type: string;
    issue: string;
  }>;
  onlyInFigma: Array<{
    path: string;
    figmaRef: string | null;
    type: string;
  }>;
  onlyInCode: Array<{
    path: string;
    codeRef: string;
    type: string;
  }>;
  stats: {
    total: number;
    matches: number;
    mismatches: number;
    onlyInFigma: number;
    onlyInCode: number;
  };
}

/** Variable export data structure */
export interface VariableExportData {
  collections: Array<{
    name: string;
    id: string;
    modes: Array<{ id: string; name: string }>;
    variables: Array<{
      figmaPath: string;
      variableId: string;
      collectionName: string;
      type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
      alias?: {
        targetId: string;
        targetName: string;
        targetCollection: string;
      };
      resolvedValue?: {
        hex?: string;
        rgba?: { r: number; g: number; b: number; a: number };
        number?: number;
        string?: string;
        boolean?: boolean;
      };
      scopes: string[];
    }>;
  }>;
  variableMap: Record<string, any>;
  stats: {
    totalVariables: number;
    colorVariables: number;
    floatVariables: number;
    aliasVariables: number;
    collectionCount: number;
  };
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Type guard for checking if a value is an Rgba color
 */
export function isRgba(value: unknown): value is Rgba {
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
 * Parse CSS variable to collection prefix
 */
export function getCollectionFromCssVar(cssVar: string): string {
  if (cssVar.includes('primitive')) return 'Primitives';
  if (cssVar.includes('semantic')) return 'Semantic';
  if (cssVar.includes('component')) {
    // Extract component name: --token-component-button-* → Components/Button
    const match = cssVar.match(/--token-component-(\w+)/);
    if (match) {
      const component = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      return `Components/${component}`;
    }
    return 'Components';
  }
  return 'Tokens';
}

/**
 * Convert CSS variable name to Figma-style path
 */
export function cssVarToFigmaName(cssVar: string): string {
  // Remove --token- prefix and convert to path
  return cssVar
    .replace(/^--token-/, '')
    .replace(/-/g, '/');
}
