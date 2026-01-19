/**
 * Compare Tokens Module
 *
 * Compares Figma variables with code token files to find
 * matches, mismatches, and missing tokens.
 */

// =============================================================================
// Types
// =============================================================================

export interface TokenValue {
  $type?: string;
  $value?: string | number | boolean;
  $collectionName?: string;
  $scopes?: string[];
  [key: string]: any;
}

export interface CodeTokens {
  [key: string]: TokenValue | CodeTokens;
}

export interface ComparisonResult {
  matches: TokenMatch[];
  mismatches: TokenMismatch[];
  onlyInFigma: FigmaOnlyToken[];
  onlyInCode: CodeOnlyToken[];
  stats: {
    total: number;
    matches: number;
    mismatches: number;
    onlyInFigma: number;
    onlyInCode: number;
  };
}

export interface TokenMatch {
  path: string;
  codeRef: string;
  figmaRef: string;
  type: string;
}

export interface TokenMismatch {
  path: string;
  codeRef: string;
  figmaRef: string;
  type: string;
  issue: string;
}

export interface FigmaOnlyToken {
  path: string;
  figmaRef: string | null;
  type: string;
}

export interface CodeOnlyToken {
  path: string;
  codeRef: string;
  type: string;
}

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
 * Convert token reference to normalized format
 * e.g., "{background.active.neutral.default}" -> "background/active/neutral/default"
 */
function normalizeRef(ref: string | number | boolean | null | undefined): string | null {
  if (ref === null || ref === undefined) return null;
  if (typeof ref !== 'string') return String(ref);
  if (!ref.startsWith('{')) return ref;

  const cleaned = ref.replace(/^\{|\}$/g, '');
  return cleaned.replace(/[-_.]/g, '/').toLowerCase();
}

/**
 * Extract all tokens from nested object structure
 */
function extractTokens(
  obj: CodeTokens,
  path: string[] = []
): Array<{ path: string; token: TokenValue }> {
  const results: Array<{ path: string; token: TokenValue }> = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const newPath = [...path, key];

    if (value && typeof value === 'object') {
      if ('$type' in value || '$value' in value) {
        results.push({
          path: newPath.join('/'),
          token: value as TokenValue,
        });
      } else {
        results.push(...extractTokens(value as CodeTokens, newPath));
      }
    }
  }

  return results;
}

// =============================================================================
// Main Comparison Function
// =============================================================================

/**
 * Compare code tokens with Figma variables
 */
export async function compareTokensWithFigma(
  codeTokens: CodeTokens
): Promise<ComparisonResult> {
  // Get all Figma variables
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVariables = await figma.variables.getLocalVariablesAsync();

  // Find componentTokens collection
  const componentCollection = collections.find(
    c => c.name.toLowerCase() === 'componenttokens'
  );

  if (!componentCollection) {
    console.warn('componentTokens collection not found in Figma');
  }

  // Build Figma variable lookup map
  const figmaLookup = new Map<string, {
    variable: Variable;
    aliasName: string | null;
    aliasCollection: string | null;
  }>();

  // Build ID to name map for alias resolution
  const idToInfo = new Map<string, { name: string; collectionName: string }>();
  for (const variable of allVariables) {
    const collection = collections.find(c => c.id === variable.variableCollectionId);
    idToInfo.set(variable.id, {
      name: variable.name,
      collectionName: collection?.name || 'Unknown',
    });
  }

  // Process component tokens from Figma
  const componentVariables = componentCollection
    ? allVariables.filter(v => v.variableCollectionId === componentCollection.id)
    : allVariables;

  for (const variable of componentVariables) {
    const collection = collections.find(c => c.id === variable.variableCollectionId);
    const modeId = collection?.modes[0]?.modeId;

    if (!modeId) continue;

    const value = variable.valuesByMode[modeId];
    let aliasName: string | null = null;
    let aliasCollection: string | null = null;

    // Check if it's an alias
    if (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as any).type === 'VARIABLE_ALIAS'
    ) {
      const aliasValue = value as { type: 'VARIABLE_ALIAS'; id: string };
      const targetInfo = idToInfo.get(aliasValue.id);
      if (targetInfo) {
        aliasName = targetInfo.name;
        aliasCollection = targetInfo.collectionName;
      }
    }

    const normalizedPath = normalizePath(variable.name);
    figmaLookup.set(normalizedPath, {
      variable,
      aliasName,
      aliasCollection,
    });
  }

  // Extract code tokens
  const codeTokenList = extractTokens(codeTokens);

  // Compare
  const matches: TokenMatch[] = [];
  const mismatches: TokenMismatch[] = [];
  const onlyInCode: CodeOnlyToken[] = [];
  const processedFigmaPaths = new Set<string>();

  for (const { path, token } of codeTokenList) {
    const normalizedPath = normalizePath(path);
    const codeRef = normalizeRef(token.$value);
    const tokenType = token.$type || 'unknown';

    const figmaEntry = figmaLookup.get(normalizedPath);

    if (!figmaEntry) {
      // Token exists in code but not in Figma
      if (codeRef) {
        onlyInCode.push({
          path,
          codeRef: String(token.$value),
          type: tokenType,
        });
      }
      continue;
    }

    processedFigmaPaths.add(normalizedPath);

    const figmaRef = figmaEntry.aliasName
      ? normalizePath(figmaEntry.aliasName)
      : null;

    // Skip if code token is not a reference (raw value)
    if (!codeRef || !String(token.$value).startsWith('{')) {
      // It's a raw value, check if Figma also has raw value
      if (!figmaEntry.aliasName) {
        matches.push({
          path,
          codeRef: String(token.$value),
          figmaRef: 'raw value',
          type: tokenType,
        });
      }
      continue;
    }

    if (!figmaRef) {
      // Figma has raw value but code has reference
      mismatches.push({
        path,
        codeRef: String(token.$value),
        figmaRef: 'raw value (no alias)',
        type: tokenType,
        issue: 'Code references a token but Figma has a raw value',
      });
      continue;
    }

    // Compare references
    if (codeRef === figmaRef) {
      matches.push({
        path,
        codeRef: String(token.$value),
        figmaRef: figmaEntry.aliasName || '',
        type: tokenType,
      });
    } else {
      mismatches.push({
        path,
        codeRef: String(token.$value),
        figmaRef: figmaEntry.aliasName || '',
        type: tokenType,
        issue: `Reference mismatch: code "${codeRef}" vs figma "${figmaRef}"`,
      });
    }
  }

  // Find tokens only in Figma
  const onlyInFigma: FigmaOnlyToken[] = [];
  for (const [normalizedPath, entry] of figmaLookup) {
    if (!processedFigmaPaths.has(normalizedPath)) {
      onlyInFigma.push({
        path: entry.variable.name,
        figmaRef: entry.aliasName,
        type: entry.variable.resolvedType,
      });
    }
  }

  return {
    matches,
    mismatches,
    onlyInFigma,
    onlyInCode,
    stats: {
      total: codeTokenList.length + onlyInFigma.length,
      matches: matches.length,
      mismatches: mismatches.length,
      onlyInFigma: onlyInFigma.length,
      onlyInCode: onlyInCode.length,
    },
  };
}
