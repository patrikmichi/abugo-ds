/**
 * Pair Variables Module
 *
 * Automatically matches Design JSON variables to existing Figma variables.
 * Extracts component properties structure for preview.
 */

import type { DesignJson, VariablePairingResult } from '../schemas/design-json';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Normalize path for comparison (lowercase, consistent separators)
 */
function normalizePath(path: string): string {
  return path.toLowerCase().replace(/[-_.]/g, '/');
}

/**
 * Convert CSS variable to Figma-style path
 * --token-component-button-primary-filled-background-default → button/primary/filled/background/default
 */
function cssVarToFigmaPath(cssVar: string): string {
  return cssVar
    .replace(/^--token-component-/, '')
    .replace(/^--token-/, '')
    .replace(/-/g, '/');
}

// =============================================================================
// Main Pairing Function
// =============================================================================

/**
 * Pair Design JSON variables with existing Figma variables
 * Also extracts component structure for preview
 */
export async function pairVariablesWithFigma(
  design: DesignJson
): Promise<VariablePairingResult> {
  // Get all Figma variables
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVariables = await figma.variables.getLocalVariablesAsync();

  // Build lookup map: normalized path → variable
  const figmaLookup = new Map<string, Variable>();
  for (const variable of allVariables) {
    const normalizedPath = normalizePath(variable.name);
    figmaLookup.set(normalizedPath, variable);
  }

  // Extract variant properties from componentSet
  const variantProperties: VariablePairingResult['variantProperties'] = [];

  if (design.componentSet?.variantProperties) {
    for (const prop of design.componentSet.variantProperties) {
      variantProperties.push({
        name: prop.name,
        type: prop.type === 'VARIANT' ? 'VARIANT' : 'VARIANT',
        values: prop.values,
        defaultValue: prop.defaultValue,
      });
    }
  }

  // Extract overridables as properties
  if (design.componentSet?.overridables) {
    for (const override of design.componentSet.overridables) {
      if (override.type === 'BOOLEAN') {
        variantProperties.push({
          name: override.name,
          type: 'BOOLEAN',
          values: ['true', 'false'],
          defaultValue: String(override.defaultValue ?? 'false'),
        });
      } else if (override.type === 'TEXT') {
        variantProperties.push({
          name: override.name,
          type: 'TEXT',
          values: [],
          defaultValue: String(override.defaultValue ?? ''),
        });
      } else if (override.type === 'INSTANCE_SWAP') {
        variantProperties.push({
          name: override.name,
          type: 'INSTANCE_SWAP',
          values: [],
          defaultValue: String(override.defaultValue ?? ''),
        });
      }
    }
  }

  // Collect all variables from Design JSON
  const designVariables: Array<{ cssVar: string; figmaName: string }> = [];

  if (design.variables) {
    for (const [collectionName, collection] of Object.entries(design.variables)) {
      for (const variable of collection.variables) {
        designVariables.push({
          cssVar: variable.cssVar,
          figmaName: variable.figmaName,
        });
      }
    }
  }

  // Pair variables
  const paired: VariablePairingResult['paired'] = [];
  const missing: VariablePairingResult['missing'] = [];

  for (const { cssVar, figmaName } of designVariables) {
    const normalizedFigmaName = normalizePath(figmaName);
    const normalizedCssPath = normalizePath(cssVarToFigmaPath(cssVar));

    // Try exact match first
    let figmaVar = figmaLookup.get(normalizedFigmaName);

    // Try CSS-derived path if no exact match
    if (!figmaVar) {
      figmaVar = figmaLookup.get(normalizedCssPath);
    }

    // Try partial match (component name prefix)
    if (!figmaVar) {
      // Look for variables that end with the same path
      const pathParts = normalizedFigmaName.split('/');
      if (pathParts.length >= 2) {
        const shortPath = pathParts.slice(-3).join('/'); // Last 3 parts
        for (const [path, variable] of figmaLookup) {
          if (path.endsWith(shortPath)) {
            figmaVar = variable;
            break;
          }
        }
      }
    }

    if (figmaVar) {
      // Check if it's an alias
      const collection = collections.find(c => c.id === figmaVar!.variableCollectionId);
      const modeId = collection?.modes[0]?.modeId;
      let aliasTarget: string | undefined;

      if (modeId) {
        const value = figmaVar.valuesByMode[modeId];
        if (
          typeof value === 'object' &&
          value !== null &&
          'type' in value &&
          (value as any).type === 'VARIABLE_ALIAS'
        ) {
          const aliasValue = value as { type: 'VARIABLE_ALIAS'; id: string };
          const targetVar = allVariables.find(v => v.id === aliasValue.id);
          if (targetVar) {
            aliasTarget = targetVar.name;
          }
        }
      }

      paired.push({
        cssVar,
        figmaName: figmaVar.name,
        figmaId: figmaVar.id,
        status: aliasTarget ? 'alias_matched' : 'found',
        aliasTarget,
      });
    } else {
      missing.push({
        cssVar,
        figmaName,
        reason: 'No matching Figma variable found',
      });
    }
  }

  return {
    componentName: design.meta.name,
    variantProperties,
    paired,
    missing,
    stats: {
      totalVariables: designVariables.length,
      paired: paired.length,
      missing: missing.length,
      variantProperties: variantProperties.length,
      totalVariants: design.componentSet?.variants?.length || 0,
    },
  };
}
