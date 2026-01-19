/**
 * Export Variables Module
 *
 * Exports Figma variables with their alias relationships,
 * matching the structure of componentTokens.json
 */

// =============================================================================
// Types
// =============================================================================

export interface ExportedVariable {
  /** Variable path in Figma (e.g., "chip/background/unselected/default") */
  figmaPath: string;
  /** Variable ID */
  variableId: string;
  /** Collection name */
  collectionName: string;
  /** Variable type */
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  /** If this is an alias, the target variable info */
  alias?: {
    targetId: string;
    targetName: string;
    targetCollection: string;
  };
  /** Resolved value (for non-aliases or resolved aliases) */
  resolvedValue?: {
    hex?: string;
    rgba?: { r: number; g: number; b: number; a: number };
    number?: number;
    string?: string;
    boolean?: boolean;
  };
  /** Scopes where this variable can be used */
  scopes: string[];
}

export interface ExportedCollection {
  name: string;
  id: string;
  modes: Array<{ id: string; name: string }>;
  variables: ExportedVariable[];
}

export interface VariableExport {
  collections: ExportedCollection[];
  /** Flat map for easy lookup: figmaPath -> ExportedVariable */
  variableMap: Record<string, ExportedVariable>;
  /** Stats */
  stats: {
    totalVariables: number;
    colorVariables: number;
    floatVariables: number;
    aliasVariables: number;
    collectionCount: number;
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert Figma path (slashes) to token path (dots)
 * e.g., "chip/background/unselected/default" -> "chip.background.unselected.default"
 */
export function figmaPathToTokenPath(figmaPath: string): string {
  return figmaPath.replace(/\//g, '.');
}

/**
 * Convert token path (dots/dashes) to Figma path (slashes)
 * e.g., "background-active-neutral-default" -> "background/active/neutral/default"
 * e.g., "background.active.neutral.default" -> "background/active/neutral/default"
 */
export function tokenPathToFigmaPath(tokenPath: string): string {
  return tokenPath.replace(/[-_.]/g, '/');
}

/**
 * Normalize a token reference from componentTokens.json
 * e.g., "{background-passive-neutral-default}" -> "background/passive/neutral/default"
 * e.g., "{background.active.neutral.default}" -> "background/active/neutral/default"
 */
export function normalizeTokenReference(ref: string): string {
  // Remove curly braces
  const cleaned = ref.replace(/^\{|\}$/g, '');
  // Convert to slash notation
  return tokenPathToFigmaPath(cleaned);
}

// =============================================================================
// Main Export Function
// =============================================================================

/**
 * Export all local variables with their alias relationships
 */
export async function exportVariables(): Promise<VariableExport> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVariables = await figma.variables.getLocalVariablesAsync();

  const exportedCollections: ExportedCollection[] = [];
  const variableMap: Record<string, ExportedVariable> = {};

  let stats = {
    totalVariables: 0,
    colorVariables: 0,
    floatVariables: 0,
    aliasVariables: 0,
    collectionCount: collections.length,
  };

  // Build a map of variable IDs to names for alias resolution
  const idToName = new Map<string, { name: string; collectionName: string }>();
  for (const variable of allVariables) {
    const collection = collections.find(c => c.id === variable.variableCollectionId);
    idToName.set(variable.id, {
      name: variable.name,
      collectionName: collection?.name || 'Unknown',
    });
  }

  for (const collection of collections) {
    const collectionVars = allVariables.filter(
      v => v.variableCollectionId === collection.id
    );

    const exportedVars: ExportedVariable[] = [];

    for (const variable of collectionVars) {
      stats.totalVariables++;

      const modeId = collection.modes[0].modeId;
      const value = variable.valuesByMode[modeId];

      const exported: ExportedVariable = {
        figmaPath: variable.name,
        variableId: variable.id,
        collectionName: collection.name,
        type: variable.resolvedType as ExportedVariable['type'],
        scopes: variable.scopes as string[],
      };

      // Check if it's an alias
      if (
        typeof value === 'object' &&
        value !== null &&
        'type' in value &&
        (value as any).type === 'VARIABLE_ALIAS'
      ) {
        stats.aliasVariables++;
        const aliasValue = value as { type: 'VARIABLE_ALIAS'; id: string };
        const targetInfo = idToName.get(aliasValue.id);

        exported.alias = {
          targetId: aliasValue.id,
          targetName: targetInfo?.name || 'Unknown',
          targetCollection: targetInfo?.collectionName || 'Unknown',
        };
      } else {
        // Resolve the value
        if (variable.resolvedType === 'COLOR') {
          stats.colorVariables++;
          const colorValue = value as RGBA;
          exported.resolvedValue = {
            hex: rgbToHex(colorValue.r, colorValue.g, colorValue.b),
            rgba: {
              r: colorValue.r,
              g: colorValue.g,
              b: colorValue.b,
              a: colorValue.a,
            },
          };
        } else if (variable.resolvedType === 'FLOAT') {
          stats.floatVariables++;
          exported.resolvedValue = {
            number: value as number,
          };
        } else if (variable.resolvedType === 'STRING') {
          exported.resolvedValue = {
            string: value as string,
          };
        } else if (variable.resolvedType === 'BOOLEAN') {
          exported.resolvedValue = {
            boolean: value as boolean,
          };
        }
      }

      exportedVars.push(exported);
      variableMap[variable.name] = exported;
    }

    exportedCollections.push({
      name: collection.name,
      id: collection.id,
      modes: collection.modes.map(m => ({ id: m.modeId, name: m.name })),
      variables: exportedVars,
    });
  }

  return {
    collections: exportedCollections,
    variableMap,
    stats,
  };
}

/**
 * Export only component token variables (from componentTokens collection)
 */
export async function exportComponentVariables(): Promise<VariableExport> {
  const fullExport = await exportVariables();

  // Filter to only component-related collections
  const componentCollections = fullExport.collections.filter(
    c =>
      c.name.toLowerCase().includes('component') ||
      c.name.toLowerCase().includes('button') ||
      c.name.toLowerCase().includes('chip') ||
      c.name.toLowerCase().includes('input') ||
      c.name.toLowerCase().includes('toggle') ||
      c.name.toLowerCase().includes('checkbox')
  );

  const componentVariableMap: Record<string, ExportedVariable> = {};
  for (const collection of componentCollections) {
    for (const variable of collection.variables) {
      componentVariableMap[variable.figmaPath] = variable;
    }
  }

  return {
    collections: componentCollections,
    variableMap: componentVariableMap,
    stats: {
      totalVariables: Object.keys(componentVariableMap).length,
      colorVariables: componentCollections.reduce(
        (sum, c) => sum + c.variables.filter(v => v.type === 'COLOR').length,
        0
      ),
      floatVariables: componentCollections.reduce(
        (sum, c) => sum + c.variables.filter(v => v.type === 'FLOAT').length,
        0
      ),
      aliasVariables: componentCollections.reduce(
        (sum, c) => sum + c.variables.filter(v => v.alias).length,
        0
      ),
      collectionCount: componentCollections.length,
    },
  };
}

/**
 * Find a Figma variable that matches a token reference
 * Handles different naming conventions (dashes vs slashes vs dots)
 */
export async function findVariableByTokenRef(
  tokenRef: string,
  variableMap: Record<string, ExportedVariable>
): Promise<ExportedVariable | null> {
  const normalizedRef = normalizeTokenReference(tokenRef);

  // Try exact match first
  if (variableMap[normalizedRef]) {
    return variableMap[normalizedRef];
  }

  // Try with different separators
  const variations = [
    normalizedRef,
    normalizedRef.replace(/\//g, '-'),
    normalizedRef.replace(/\//g, '.'),
    tokenRef.replace(/^\{|\}$/g, ''), // Original without braces
  ];

  for (const [path, variable] of Object.entries(variableMap)) {
    const normalizedPath = path.toLowerCase();
    for (const variation of variations) {
      if (normalizedPath === variation.toLowerCase()) {
        return variable;
      }
      // Also try if the variable path ends with the reference
      if (normalizedPath.endsWith('/' + variation.toLowerCase())) {
        return variable;
      }
    }
  }

  return null;
}

/**
 * Validate that a component token matches its Figma counterpart
 */
export interface ValidationResult {
  tokenPath: string;
  figmaPath: string | null;
  tokenRef: string;
  figmaAlias: string | null;
  matches: boolean;
  issue?: string;
}

export async function validateTokenAgainstFigma(
  tokenPath: string,
  tokenRef: string,
  variableMap: Record<string, ExportedVariable>
): Promise<ValidationResult> {
  const normalizedTokenPath = tokenPathToFigmaPath(tokenPath);
  const normalizedRef = normalizeTokenReference(tokenRef);

  // Find the component variable
  const componentVar = variableMap[normalizedTokenPath];

  if (!componentVar) {
    return {
      tokenPath,
      figmaPath: null,
      tokenRef,
      figmaAlias: null,
      matches: false,
      issue: `Component variable not found in Figma: ${normalizedTokenPath}`,
    };
  }

  // Check if the alias matches
  if (componentVar.alias) {
    const normalizedAlias = componentVar.alias.targetName
      .toLowerCase()
      .replace(/\//g, '/');
    const matches =
      normalizedAlias === normalizedRef.toLowerCase() ||
      componentVar.alias.targetName === normalizedRef;

    return {
      tokenPath,
      figmaPath: componentVar.figmaPath,
      tokenRef,
      figmaAlias: componentVar.alias.targetName,
      matches,
      issue: matches
        ? undefined
        : `Alias mismatch: token references "${normalizedRef}" but Figma variable aliases "${componentVar.alias.targetName}"`,
    };
  }

  return {
    tokenPath,
    figmaPath: componentVar.figmaPath,
    tokenRef,
    figmaAlias: null,
    matches: false,
    issue: `Figma variable is not an alias but token references "${tokenRef}"`,
  };
}
