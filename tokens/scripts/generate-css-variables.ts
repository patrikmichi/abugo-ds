import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from './load-tokens.js';
import type { Primitives, SemanticTokens, ComponentTokens, TokenValue } from '@tokens/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve a token reference path (e.g., "yellow.100" or "spacing-1")
 */
function resolveReferencePath(
  refPath: string,
  collection: Primitives | SemanticTokens | ComponentTokens
): unknown {
  // Try dot notation first (e.g., "yellow.100")
  let segments = refPath.split('.');
  let value: unknown = collection;

  for (const segment of segments) {
    if (value && typeof value === 'object' && segment in value) {
      value = (value as Record<string, unknown>)[segment];
    } else {
      // Try hyphen notation (e.g., "spacing-1")
      segments = refPath.split('-');
      value = collection;
      for (const segment of segments) {
        if (value && typeof value === 'object' && segment in value) {
          value = (value as Record<string, unknown>)[segment];
        } else {
          return null;
        }
      }
      break;
    }
  }

  return value;
}

/**
 * Resolve a token value, handling references recursively
 */
function resolveTokenValue(
  value: string | number | object,
  primitives: Primitives,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens,
  collectionName?: string,
  depth = 0
): string | number {
  // Prevent infinite recursion
  if (depth > 10) {
    console.warn(`⚠️  Max recursion depth reached for value: ${value}`);
    return String(value);
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    // Check if it's a reference
    if (value.startsWith('{') && value.endsWith('}')) {
      const refPath = value.slice(1, -1);
      let resolved: unknown = null;

      // Determine which collection to resolve from based on collectionName
      if (collectionName === 'primitives') {
        resolved = resolveReferencePath(refPath, primitives);
      } else if (collectionName === 'semanticTokens') {
        // Try semantic first
        resolved = resolveReferencePath(refPath, semanticTokens);
        // If not found, try primitives (semantic tokens can reference primitives)
        if (resolved === null) {
          resolved = resolveReferencePath(refPath, primitives);
        }
      } else {
        // Default: try semantic, then primitives
        resolved = resolveReferencePath(refPath, semanticTokens);
        if (resolved === null) {
          resolved = resolveReferencePath(refPath, primitives);
        }
      }

      if (resolved !== null) {
        // If resolved value is a token object, extract $value
        if (resolved && typeof resolved === 'object' && '$value' in resolved) {
          const tokenValue = resolved as TokenValue;
          const nextCollectionName = (tokenValue as { $collectionName?: string }).$collectionName || collectionName;
          return resolveTokenValue(
            tokenValue.$value,
            primitives,
            semanticTokens,
            componentTokens,
            nextCollectionName,
            depth + 1
          );
        }
        // If resolved value is still a reference, resolve recursively
        if (typeof resolved === 'string' && resolved.startsWith('{') && resolved.endsWith('}')) {
          return resolveTokenValue(
            resolved,
            primitives,
            semanticTokens,
            componentTokens,
            collectionName,
            depth + 1
          );
        }
        return resolveTokenValue(
          resolved as string | number,
          primitives,
          semanticTokens,
          componentTokens,
          collectionName,
          depth + 1
        );
      }
    }
    return value;
  }

  return String(value);
}

/**
 * Convert a token key to a CSS variable name
 */
function toCssVariable(key: string, prefix: string): string {
  // Convert kebab-case or camelCase to kebab-case
  const kebab = key
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toLowerCase();

  return `--${prefix}-${kebab}`;
}

/**
 * Format a value for CSS
 */
function formatCssValue(value: string | number | object, type?: string): string {
  // Handle objects (shouldn't happen after resolution, but just in case)
  if (typeof value === 'object' && value !== null) {
    console.warn(`⚠️  Object value found for type ${type}, skipping`);
    return '';
  }

  if (typeof value === 'number') {
    // Handle different types
    if (type === 'spacing' || type === 'dimension' || type === 'sizing') {
      return `${value}px`;
    }
    if (type === 'opacity') {
      // Opacity can be 0-1 or 0-100, normalize to 0-1
      if (value > 1) {
        return String(value / 100);
      }
      return String(value);
    }
    if (type === 'fontWeight') {
      return String(value);
    }
    if (type === 'duration') {
      return `${value}ms`;
    }
    return String(value);
  }
  return String(value);
}

/**
 * Generate CSS variables from primitives
 */
function generatePrimitiveVariables(primitives: Primitives): string {
  const variables: string[] = [];
  const processed = new Set<string>();

  function processObject(obj: Primitives, prefix: string = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue; // Skip metadata

      const fullKey = prefix ? `${prefix}-${key}` : key;
      const cssVar = toCssVariable(fullKey, 'token-primitive');

      if (processed.has(cssVar)) continue;
      processed.add(cssVar);

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenValue = value as TokenValue;
        const resolved = resolveTokenValue(
          tokenValue.$value,
          primitives,
          {} as SemanticTokens,
          {} as ComponentTokens,
          'primitives'
        );
        const formatted = formatCssValue(resolved, tokenValue.$type);
        if (formatted) {
          variables.push(`  ${cssVar}: ${formatted};`);
        }
      } else if (value && typeof value === 'object' && !('$value' in value)) {
        // Nested object (e.g., yellow.100) - process recursively
        processObject(value as Primitives, fullKey);
      }
    }
  }

  processObject(primitives);

  return variables.join('\n');
}

/**
 * Generate CSS variables from semantic tokens
 */
function generateSemanticVariables(
  semanticTokens: SemanticTokens,
  primitives: Primitives
): string {
  const variables: string[] = [];
  const processed = new Set<string>();

  function processObject(obj: SemanticTokens | ComponentTokens, prefix: string = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue; // Skip metadata

      const fullKey = prefix ? `${prefix}-${key}` : key;
      const cssVar = toCssVariable(fullKey, 'token-semantic');

      if (processed.has(cssVar)) continue;
      processed.add(cssVar);

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenValue = value as TokenValue;
        // Get collection name from $collectionName property (not extensions)
        const collectionName = (tokenValue as { $collectionName?: string }).$collectionName;
        const resolved = resolveTokenValue(
          tokenValue.$value,
          primitives,
          semanticTokens,
          {} as ComponentTokens,
          collectionName || 'semanticTokens'
        );
        const formatted = formatCssValue(resolved, tokenValue.$type);
        if (formatted) {
          variables.push(`  ${cssVar}: ${formatted};`);
        }
      } else if (value && typeof value === 'object' && !('$value' in value)) {
        // Nested object - process recursively
        processObject(value as SemanticTokens | ComponentTokens, fullKey);
      }
    }
  }

  processObject(semanticTokens);

  return variables.join('\n');
}

/**
 * Generate CSS variables from component tokens
 */
function generateComponentVariables(
  componentTokens: ComponentTokens,
  primitives: Primitives,
  semanticTokens: SemanticTokens
): string {
  const variables: string[] = [];
  const processed = new Set<string>();

  function processObject(obj: ComponentTokens, prefix: string = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue; // Skip metadata

      const fullKey = prefix ? `${prefix}-${key}` : key;
      const cssVar = toCssVariable(fullKey, 'token-component');

      if (processed.has(cssVar)) continue;
      processed.add(cssVar);

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenValue = value as TokenValue;
        // Get collection name from $collectionName property
        const collectionName = (tokenValue as { $collectionName?: string }).$collectionName;
        const resolved = resolveTokenValue(
          tokenValue.$value,
          primitives,
          semanticTokens,
          componentTokens,
          collectionName || 'componentTokens'
        );
        const formatted = formatCssValue(resolved, tokenValue.$type);
        if (formatted) {
          variables.push(`  ${cssVar}: ${formatted};`);
        }
      } else if (value && typeof value === 'object' && !('$value' in value)) {
        // Nested object - process recursively
        processObject(value as ComponentTokens, fullKey);
      }
    }
  }

  processObject(componentTokens);

  return variables.join('\n');
}

/**
 * Collect deprecated tokens
 */
function collectDeprecatedTokens(
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens
): Array<{ cssVar: string; replacedBy: string | null }> {
  const deprecated: Array<{ cssVar: string; replacedBy: string | null }> = [];

  function processObject(obj: SemanticTokens | ComponentTokens, prefix: string = '', level: 'semantic' | 'component' = 'semantic'): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;

      const fullKey = prefix ? `${prefix}-${key}` : key;
      const cssVarPrefix = level === 'semantic' ? 'token-semantic' : 'token-component';
      const cssVar = `--${cssVarPrefix}-${fullKey.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenValue = value as TokenValue;
        const extensions = tokenValue.$extensions as { 'design-tokens'?: { deprecated?: boolean; replacedBy?: string | null } } | undefined;
        const designTokens = extensions?.['design-tokens'];
        
        if (designTokens?.deprecated === true) {
          deprecated.push({
            cssVar,
            replacedBy: designTokens.replacedBy || null,
          });
        }
      } else if (value && typeof value === 'object') {
        processObject(value as SemanticTokens | ComponentTokens, fullKey, level);
      }
    }
  }

  processObject(semanticTokens, '', 'semantic');
  processObject(componentTokens, '', 'component');

  return deprecated;
}

/**
 * Main function to generate CSS variables file
 */
export function generateCssVariables(): void {
  const { primitives, semanticTokens, componentTokens } = loadTokens();

  const primitiveVars = generatePrimitiveVariables(primitives);
  const semanticVars = generateSemanticVariables(semanticTokens, primitives);
  const componentVars = generateComponentVariables(componentTokens, primitives, semanticTokens);

  // Collect deprecated tokens
  const deprecatedTokens = collectDeprecatedTokens(semanticTokens, componentTokens);
  const deprecatedComment = deprecatedTokens.length > 0
    ? `\n * ⚠️  DEPRECATED TOKENS (${deprecatedTokens.length}):\n${deprecatedTokens.map(t => ` *    - ${t.cssVar}${t.replacedBy ? ` → Use ${t.replacedBy}` : ''}`).join('\n')}\n *`
    : '';

  const cssContent = `/* 
 * Design Tokens CSS Variables
 * Auto-generated from token files
 * DO NOT EDIT MANUALLY - Run: npm run build:css-variables${deprecatedComment}
 */

:root {
  /* ============================================
     PRIMITIVE TOKENS
     Base design values (colors, spacing, etc.)
     ============================================ */
${primitiveVars}

  /* ============================================
     SEMANTIC TOKENS
     Meaning-based tokens that reference primitives
     ============================================ */
${semanticVars}

  /* ============================================
     COMPONENT TOKENS
     Component-specific design tokens
     ============================================ */
${componentVars}
}
`;

  const outputPath = path.join(__dirname, '../../styles/tokens.css');
  const outputDir = path.dirname(outputPath);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, cssContent, 'utf8');
  console.log(`✅ Generated CSS variables: ${outputPath}`);
  console.log(`   - Primitives: ${primitiveVars.split('\n').filter(l => l.trim()).length} variables`);
  console.log(`   - Semantic: ${semanticVars.split('\n').filter(l => l.trim()).length} variables`);
  console.log(`   - Component: ${componentVars.split('\n').filter(l => l.trim()).length} variables`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url.includes('generate-css-variables')) {
  generateCssVariables();
}
