/**
 * Validate componentTokens.json against Figma variable export
 *
 * Usage:
 * 1. Export variables from Figma plugin (EXPORT_VARIABLES)
 * 2. Save the export JSON to tokens/output/figma-variables.json
 * 3. Run: npx tsx tokens/scripts/validateFigmaTokens.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Types
// =============================================================================

interface FigmaVariable {
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
}

interface FigmaExport {
  collections: Array<{
    name: string;
    id: string;
    variables: FigmaVariable[];
  }>;
  variableMap: Record<string, FigmaVariable>;
  stats: {
    totalVariables: number;
    colorVariables: number;
    floatVariables: number;
    aliasVariables: number;
    collectionCount: number;
  };
}

interface TokenValue {
  $type: string;
  $value: string | number | boolean;
  $collectionName?: string;
  $scopes?: string[];
  [key: string]: any;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Convert Figma path (slashes) to token path (dots)
 */
function figmaPathToTokenPath(figmaPath: string): string {
  return figmaPath.replace(/\//g, '.');
}

/**
 * Convert token reference to Figma path
 * e.g., "{background-passive-neutral-default}" -> "background/passive/neutral/default"
 */
function tokenRefToFigmaPath(ref: string): string {
  const cleaned = ref.replace(/^\{|\}$/g, '');
  return cleaned.replace(/[-_.]/g, '/');
}

/**
 * Check if value is a token reference
 */
function isTokenReference(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

/**
 * Recursively extract all token values with their paths
 */
function extractTokens(
  obj: Record<string, any>,
  currentPath: string[] = []
): Array<{ path: string; token: TokenValue }> {
  const results: Array<{ path: string; token: TokenValue }> = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue; // Skip meta properties

    const newPath = [...currentPath, key];

    if (value && typeof value === 'object') {
      if ('$type' in value && '$value' in value) {
        // This is a token leaf
        results.push({
          path: newPath.join('.'),
          token: value as TokenValue,
        });
      } else {
        // Recurse into nested object
        results.push(...extractTokens(value, newPath));
      }
    }
  }

  return results;
}

// =============================================================================
// Validation
// =============================================================================

interface ValidationIssue {
  tokenPath: string;
  tokenRef: string;
  figmaPath: string | null;
  figmaAlias: string | null;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

function validateTokens(
  componentTokens: Record<string, any>,
  figmaExport: FigmaExport
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const tokens = extractTokens(componentTokens);

  // Build Figma variable lookup map (normalize paths)
  const figmaLookup = new Map<string, FigmaVariable>();
  for (const [figmaPath, variable] of Object.entries(figmaExport.variableMap)) {
    const normalizedPath = figmaPath.toLowerCase();
    figmaLookup.set(normalizedPath, variable);
    // Also add with dots
    figmaLookup.set(figmaPath.replace(/\//g, '.').toLowerCase(), variable);
  }

  for (const { path, token } of tokens) {
    const tokenValue = token.$value;

    // Skip non-reference values (raw numbers, etc.)
    if (!isTokenReference(tokenValue)) {
      continue;
    }

    const tokenRef = tokenValue;
    const expectedFigmaRef = tokenRefToFigmaPath(tokenRef);

    // Try to find the component variable in Figma
    const figmaPath = path.replace(/\./g, '/');
    const normalizedFigmaPath = figmaPath.toLowerCase();

    const figmaVariable = figmaLookup.get(normalizedFigmaPath);

    if (!figmaVariable) {
      issues.push({
        tokenPath: path,
        tokenRef,
        figmaPath: null,
        figmaAlias: null,
        severity: 'warning',
        message: `Token "${path}" not found in Figma variables`,
      });
      continue;
    }

    // Check if it's an alias and matches
    if (figmaVariable.alias) {
      const figmaAliasNormalized = figmaVariable.alias.targetName
        .toLowerCase()
        .replace(/\//g, '/');
      const expectedNormalized = expectedFigmaRef.toLowerCase();

      if (figmaAliasNormalized !== expectedNormalized) {
        issues.push({
          tokenPath: path,
          tokenRef,
          figmaPath: figmaVariable.figmaPath,
          figmaAlias: figmaVariable.alias.targetName,
          severity: 'error',
          message: `Alias mismatch: token references "${expectedFigmaRef}" but Figma aliases "${figmaVariable.alias.targetName}"`,
        });
      } else {
        issues.push({
          tokenPath: path,
          tokenRef,
          figmaPath: figmaVariable.figmaPath,
          figmaAlias: figmaVariable.alias.targetName,
          severity: 'info',
          message: `Match: "${path}" -> "${figmaVariable.alias.targetName}"`,
        });
      }
    } else {
      issues.push({
        tokenPath: path,
        tokenRef,
        figmaPath: figmaVariable.figmaPath,
        figmaAlias: null,
        severity: 'warning',
        message: `Figma variable is not an alias (has resolved value) but token references "${tokenRef}"`,
      });
    }
  }

  return issues;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const tokensDir = path.join(__dirname, '..');
  const componentTokensPath = path.join(tokensDir, 'componentTokens.json');
  const figmaExportPath = path.join(tokensDir, 'output', 'figma-variables.json');

  // Check if files exist
  if (!fs.existsSync(componentTokensPath)) {
    console.error(`Component tokens file not found: ${componentTokensPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(figmaExportPath)) {
    console.error(`Figma export file not found: ${figmaExportPath}`);
    console.log('\nTo generate this file:');
    console.log('1. Open the Figma Designer plugin in Figma');
    console.log('2. Send EXPORT_VARIABLES message from the UI');
    console.log('3. Save the response to tokens/output/figma-variables.json');
    process.exit(1);
  }

  // Load files
  const componentTokens = JSON.parse(fs.readFileSync(componentTokensPath, 'utf-8'));
  const figmaExport: FigmaExport = JSON.parse(fs.readFileSync(figmaExportPath, 'utf-8'));

  console.log('='.repeat(60));
  console.log('Figma Variables Export Stats');
  console.log('='.repeat(60));
  console.log(`Total variables: ${figmaExport.stats.totalVariables}`);
  console.log(`Color variables: ${figmaExport.stats.colorVariables}`);
  console.log(`Float variables: ${figmaExport.stats.floatVariables}`);
  console.log(`Alias variables: ${figmaExport.stats.aliasVariables}`);
  console.log(`Collections: ${figmaExport.stats.collectionCount}`);
  console.log();

  // Validate
  const issues = validateTokens(componentTokens, figmaExport);

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const matches = issues.filter(i => i.severity === 'info');

  console.log('='.repeat(60));
  console.log('Validation Results');
  console.log('='.repeat(60));
  console.log(`Matches: ${matches.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log();

  if (errors.length > 0) {
    console.log('ERRORS:');
    console.log('-'.repeat(60));
    for (const error of errors) {
      console.log(`  ${error.tokenPath}`);
      console.log(`    Token ref: ${error.tokenRef}`);
      console.log(`    Figma alias: ${error.figmaAlias}`);
      console.log(`    ${error.message}`);
      console.log();
    }
  }

  if (warnings.length > 0) {
    console.log('WARNINGS:');
    console.log('-'.repeat(60));
    for (const warning of warnings.slice(0, 20)) {
      console.log(`  ${warning.tokenPath}: ${warning.message}`);
    }
    if (warnings.length > 20) {
      console.log(`  ... and ${warnings.length - 20} more warnings`);
    }
    console.log();
  }

  // Write detailed report
  const reportPath = path.join(tokensDir, 'output', 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ errors, warnings, matches }, null, 2));
  console.log(`Detailed report saved to: ${reportPath}`);
}

main().catch(console.error);
