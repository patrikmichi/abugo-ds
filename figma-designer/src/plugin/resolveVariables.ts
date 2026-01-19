/**
 * Variable Resolution Module
 *
 * Handles resolving Figma variables:
 * - Use existing variables if they match by figmaName
 * - Create new variables if not found
 * - Organize into collections following Sato-UI style
 */

import type { DesignJson, DesignVariable, Rgba, VariableType } from '../schemas/design-json';

// =============================================================================
// Types
// =============================================================================

export type ResolvedVariables = Map<string, string>; // figmaName -> variableId

interface CollectionInfo {
  collection: VariableCollection;
  modeId: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Check if a value is an Rgba color
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
 * Convert Rgba to Figma RGB format
 */
function rgbaToFigmaRgb(rgba: Rgba): RGB {
  return {
    r: Math.max(0, Math.min(1, rgba.r)),
    g: Math.max(0, Math.min(1, rgba.g)),
    b: Math.max(0, Math.min(1, rgba.b)),
  };
}

/**
 * Get scopes for a variable type
 */
function getScopesForType(type: VariableType): VariableScope[] {
  switch (type) {
    case 'COLOR':
      return ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'];
    case 'FLOAT':
      return ['ALL_SCOPES'];
    default:
      return ['ALL_SCOPES'];
  }
}

/**
 * Normalize variable name for matching
 */
function normalizeVariableName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\/\\]/g, '/')
    .replace(/[-_]/g, '/')
    .replace(/\/+/g, '/');
}

/**
 * Generate alternative search names for a variable
 * e.g., "button/primary/filled/background/default" could also be
 * - "background-active-accent-default" (semantic token)
 * - "brand.700" (primitive)
 */
function getSearchVariants(figmaName: string): string[] {
  const variants = [normalizeVariableName(figmaName)];

  // Try with dashes instead of slashes
  variants.push(figmaName.toLowerCase().replace(/\//g, '-'));

  // Try the last part only (e.g., "default" from "button/primary/filled/background/default")
  const parts = figmaName.split('/');
  if (parts.length > 1) {
    variants.push(parts[parts.length - 1].toLowerCase());
    variants.push(parts.slice(-2).join('/').toLowerCase());
  }

  return [...new Set(variants)];
}

// =============================================================================
// Collection Management
// =============================================================================

/**
 * Find or create a variable collection
 */
async function findOrCreateCollection(name: string): Promise<CollectionInfo> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  // Try to find existing collection
  const existing = collections.find((c) => c.name === name);
  if (existing) {
    return {
      collection: existing,
      modeId: existing.modes[0].modeId,
    };
  }

  // Create new collection
  const collection = figma.variables.createVariableCollection(name);
  return {
    collection,
    modeId: collection.modes[0].modeId,
  };
}

/**
 * Find existing variable by name across all collections
 */
async function findExistingVariable(
  figmaName: string,
  collection: VariableCollection
): Promise<Variable | null> {
  const searchVariants = getSearchVariants(figmaName);
  const variables = await figma.variables.getLocalVariablesAsync();

  // Find in specific collection first
  for (const variable of variables) {
    if (variable.variableCollectionId === collection.id) {
      const varNameNormalized = normalizeVariableName(variable.name);
      for (const searchName of searchVariants) {
        if (varNameNormalized === searchName || varNameNormalized.endsWith('/' + searchName)) {
          console.log(`Found existing variable in target collection: ${variable.name}`);
          return variable;
        }
      }
    }
  }

  // Try to find in any collection (fallback)
  for (const variable of variables) {
    const varNameNormalized = normalizeVariableName(variable.name);
    for (const searchName of searchVariants) {
      if (varNameNormalized === searchName || varNameNormalized.endsWith('/' + searchName)) {
        console.log(`Found existing variable in other collection: ${variable.name}`);
        return variable;
      }
    }
  }

  return null;
}

/**
 * Search for a variable by semantic token name across all collections
 * This is useful for finding existing semantic tokens like "background-active-accent-default"
 */
async function findVariableBySemanticName(semanticName: string): Promise<Variable | null> {
  const variables = await figma.variables.getLocalVariablesAsync();
  const normalizedSearch = semanticName.toLowerCase().replace(/[-_]/g, '/');

  for (const variable of variables) {
    const normalizedVar = variable.name.toLowerCase().replace(/[-_]/g, '/');
    if (normalizedVar === normalizedSearch || normalizedVar.endsWith('/' + normalizedSearch)) {
      return variable;
    }
  }

  return null;
}

// =============================================================================
// Variable Creation
// =============================================================================

/**
 * Create a new variable
 */
function createVariable(
  designVar: DesignVariable,
  collectionInfo: CollectionInfo
): Variable {
  // Map VariableType to Figma VariableResolvedDataType
  const figmaType = designVar.type === 'COLOR' ? 'COLOR' : 'FLOAT';

  const variable = figma.variables.createVariable(
    designVar.figmaName,
    collectionInfo.collection,
    figmaType
  );

  // Set scopes
  variable.scopes = getScopesForType(designVar.type);

  // Set description if provided
  if (designVar.description) {
    variable.description = designVar.description;
  }

  // Set value based on type
  if (designVar.type === 'COLOR' && isRgba(designVar.value)) {
    const rgba = designVar.value;
    const rgb = rgbaToFigmaRgb(rgba);

    // Create RGBA value for Figma
    variable.setValueForMode(collectionInfo.modeId, {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: rgba.a,
    });
  } else if (designVar.type === 'FLOAT' && typeof designVar.value === 'number') {
    variable.setValueForMode(collectionInfo.modeId, designVar.value);
  } else if (designVar.type === 'STRING' && typeof designVar.value === 'string') {
    // Figma doesn't support string variables in the same way
    // We'll skip these or convert them
    console.warn(`String variable not supported: ${designVar.figmaName}`);
  } else if (designVar.type === 'BOOLEAN' && typeof designVar.value === 'boolean') {
    // Figma doesn't support boolean variables
    console.warn(`Boolean variable not supported: ${designVar.figmaName}`);
  }

  return variable;
}

// =============================================================================
// Main Resolution Function
// =============================================================================

/**
 * Resolve all variables from design JSON
 *
 * Rules:
 * 1. Use existing variable if found with same figmaName
 * 2. Create new variable if not found
 * 3. Create collection if needed
 * 4. No duplicates: first figmaName wins
 */
export async function resolveVariables(design: DesignJson): Promise<ResolvedVariables> {
  const resolved: ResolvedVariables = new Map();
  const processedNames = new Set<string>();

  // Process each collection
  for (const [collectionName, collectionData] of Object.entries(design.variables)) {
    // Find or create the collection
    const collectionInfo = await findOrCreateCollection(collectionName);

    // Process each variable in the collection
    for (const designVar of collectionData.variables) {
      // Skip if already processed (no duplicates)
      const normalizedName = normalizeVariableName(designVar.figmaName);
      if (processedNames.has(normalizedName)) {
        continue;
      }
      processedNames.add(normalizedName);

      // Try to find existing variable
      let variable = await findExistingVariable(designVar.figmaName, collectionInfo.collection);

      if (variable) {
        // Use existing variable
        console.log(`Using existing variable: ${variable.name}`);
      } else {
        // Create new variable
        try {
          variable = createVariable(designVar, collectionInfo);
          console.log(`Created variable: ${variable.name}`);
        } catch (error) {
          console.error(`Failed to create variable ${designVar.figmaName}:`, error);
          continue;
        }
      }

      // Store the mapping
      resolved.set(designVar.figmaName, variable.id);
    }
  }

  return resolved;
}

/**
 * Get a resolved variable by figmaName
 */
export async function getResolvedVariable(
  figmaName: string,
  resolved: ResolvedVariables
): Promise<Variable | null> {
  const variableId = resolved.get(figmaName);
  if (!variableId) return null;

  return figma.variables.getVariableByIdAsync(variableId);
}

/**
 * Bind a variable to a node's fill property
 * Uses setBoundVariableForPaint API for proper variable binding
 */
export async function bindFillVariable(
  node: GeometryMixin & MinimalFillsMixin,
  figmaName: string,
  resolved: ResolvedVariables
): Promise<boolean> {
  const variableId = resolved.get(figmaName);
  if (!variableId) {
    console.warn(`Variable not found in resolved map: ${figmaName}`);
    return false;
  }

  const variable = await figma.variables.getVariableByIdAsync(variableId);
  if (!variable) {
    console.warn(`Variable not found by ID: ${variableId}`);
    return false;
  }

  try {
    // Get current fills
    const fills = node.fills;
    if (!Array.isArray(fills) || fills.length === 0) {
      // Create a default solid paint if no fills exist
      const defaultPaint: SolidPaint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } };
      const boundPaint = figma.variables.setBoundVariableForPaint(defaultPaint, 'color', variable);
      node.fills = [boundPaint];
    } else {
      // Bind variable to the first fill
      const firstFill = fills[0];
      if (firstFill.type === 'SOLID') {
        const boundPaint = figma.variables.setBoundVariableForPaint(firstFill, 'color', variable);
        node.fills = [boundPaint, ...fills.slice(1)];
      }
    }
    return true;
  } catch (error) {
    console.warn(`Failed to bind fill variable ${figmaName}:`, error);
    return false;
  }
}

/**
 * Bind a variable to a node's stroke property
 * Uses setBoundVariableForPaint API for proper variable binding
 */
export async function bindStrokeVariable(
  node: GeometryMixin & MinimalStrokesMixin,
  figmaName: string,
  resolved: ResolvedVariables
): Promise<boolean> {
  const variableId = resolved.get(figmaName);
  if (!variableId) {
    console.warn(`Variable not found in resolved map: ${figmaName}`);
    return false;
  }

  const variable = await figma.variables.getVariableByIdAsync(variableId);
  if (!variable) {
    console.warn(`Variable not found by ID: ${variableId}`);
    return false;
  }

  try {
    // Get current strokes
    const strokes = node.strokes;
    if (!Array.isArray(strokes) || strokes.length === 0) {
      // Create a default solid paint if no strokes exist
      const defaultPaint: SolidPaint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } };
      const boundPaint = figma.variables.setBoundVariableForPaint(defaultPaint, 'color', variable);
      node.strokes = [boundPaint];
    } else {
      // Bind variable to the first stroke
      const firstStroke = strokes[0];
      if (firstStroke.type === 'SOLID') {
        const boundPaint = figma.variables.setBoundVariableForPaint(firstStroke, 'color', variable);
        node.strokes = [boundPaint, ...strokes.slice(1)];
      }
    }
    return true;
  } catch (error) {
    console.warn(`Failed to bind stroke variable ${figmaName}:`, error);
    return false;
  }
}

/**
 * Bind a dimension variable (FLOAT) to a node property
 * Uses setBoundVariable API for properties like paddingLeft, height, cornerRadius, etc.
 */
export async function bindDimensionVariable(
  node: SceneNode,
  property: VariableBindableNodeField,
  figmaName: string,
  resolved: ResolvedVariables
): Promise<boolean> {
  const variableId = resolved.get(figmaName);
  if (!variableId) {
    console.warn(`Dimension variable not found in resolved map: ${figmaName}`);
    return false;
  }

  const variable = await figma.variables.getVariableByIdAsync(variableId);
  if (!variable) {
    console.warn(`Dimension variable not found by ID: ${variableId}`);
    return false;
  }

  try {
    node.setBoundVariable(property, variable);
    return true;
  } catch (error) {
    console.warn(`Failed to bind dimension variable ${figmaName} to ${property}:`, error);
    return false;
  }
}

/**
 * @deprecated Use bindFillVariable, bindStrokeVariable, or bindDimensionVariable instead
 * Legacy function for compatibility
 */
export async function bindVariableToNode(
  node: SceneNode,
  property: string,
  figmaName: string,
  resolved: ResolvedVariables
): Promise<boolean> {
  if (property === 'fills') {
    return bindFillVariable(node as any, figmaName, resolved);
  } else if (property === 'strokes') {
    return bindStrokeVariable(node as any, figmaName, resolved);
  }

  // For dimension properties, use bindDimensionVariable
  const dimensionProps = [
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    'itemSpacing', 'counterAxisSpacing',
    'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
  ];
  if (dimensionProps.includes(property)) {
    return bindDimensionVariable(node, property as VariableBindableNodeField, figmaName, resolved);
  }

  // For other properties, try the old approach
  const variableId = resolved.get(figmaName);
  if (!variableId) return false;

  const variable = await figma.variables.getVariableByIdAsync(variableId);
  if (!variable) return false;

  try {
    (node as any).setBoundVariable(property, variable);
    return true;
  } catch (error) {
    console.warn(`Failed to bind variable ${figmaName} to ${property}:`, error);
    return false;
  }
}
