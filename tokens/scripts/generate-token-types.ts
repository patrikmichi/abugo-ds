import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from './load-tokens.js';
import type { Primitives, SemanticTokens, ComponentTokens, TokenValue } from '@tokens/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert a token key to a TypeScript-safe identifier
 */
function toTypeScriptKey(key: string): string {
  // Convert kebab-case to camelCase and make it valid TypeScript identifier
  return key
    .split(/[-.]/)
    .map((part, index) => {
      if (index === 0) {
        return part.replace(/^[^a-zA-Z_$]/, '');
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('')
    .replace(/[^a-zA-Z0-9_$]/g, '');
}

/**
 * Get all CSS variable names from tokens
 */
function getAllCssVariables(
  primitives: Primitives,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens
): {
  primitives: Map<string, { key: string; cssVar: string; deprecated: boolean; replacedBy: string | null }>;
  semantic: Map<string, { key: string; cssVar: string; deprecated: boolean; replacedBy: string | null }>;
  component: Map<string, { key: string; cssVar: string; deprecated: boolean; replacedBy: string | null }>;
} {
  const primitiveVars = new Map<string, { key: string; cssVar: string; deprecated: boolean; replacedBy: string | null }>();
  const semanticVars = new Map<string, { key: string; cssVar: string; deprecated: boolean; replacedBy: string | null }>();
  const componentVars = new Map<string, { key: string; cssVar: string; deprecated: boolean; replacedBy: string | null }>();

  function processPrimitives(obj: Primitives, prefix: string = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;

      const fullKey = prefix ? `${prefix}-${key}` : key;
      const cssVar = `--token-primitive-${fullKey.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;

      if (value && typeof value === 'object' && '$value' in value) {
        primitiveVars.set(cssVar, {
          key: fullKey,
          cssVar,
          deprecated: false,
          replacedBy: null,
        });
      } else if (value && typeof value === 'object') {
        processPrimitives(value as Primitives, fullKey);
      }
    }
  }

  function processSemantic(obj: SemanticTokens | ComponentTokens, prefix: string = '', level: 'semantic' | 'component' = 'semantic'): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;

      const fullKey = prefix ? `${prefix}-${key}` : key;
      const cssVarPrefix = level === 'semantic' ? 'token-semantic' : 'token-component';
      const cssVar = `--${cssVarPrefix}-${fullKey.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenValue = value as TokenValue;
        const extensions = tokenValue.$extensions as { 'design-tokens'?: { deprecated?: boolean; replacedBy?: string | null } } | undefined;
        const designTokens = extensions?.['design-tokens'];
        
        const info = {
          key: fullKey,
          cssVar,
          deprecated: designTokens?.deprecated === true,
          replacedBy: designTokens?.replacedBy || null,
        };

        if (level === 'semantic') {
          semanticVars.set(cssVar, info);
        } else {
          componentVars.set(cssVar, info);
        }
      } else if (value && typeof value === 'object') {
        processSemantic(value as SemanticTokens | ComponentTokens, fullKey, level);
      }
    }
  }

  processPrimitives(primitives);
  processSemantic(semanticTokens, '', 'semantic');
  processSemantic(componentTokens, '', 'component');

  return { primitives: primitiveVars, semantic: semanticVars, component: componentVars };
}

/**
 * Generate TypeScript types for CSS variables
 */
export function generateTokenTypes(): void {
  const { primitives, semanticTokens, componentTokens } = loadTokens();
  const { primitives: primitiveVars, semantic: semanticVars, component: componentVars } = getAllCssVariables(
    primitives,
    semanticTokens,
    componentTokens
  );

  const typeDefinitions: string[] = [
    '/**',
    ' * Auto-generated TypeScript types for design token CSS variables',
    ' * DO NOT EDIT MANUALLY - Run: npm run build:token-types',
    ' */',
    '',
    'export type PrimitiveToken =',
  ];

  // Generate primitive token types
  const primitiveKeys = Array.from(primitiveVars.keys())
    .map((v) => `  | '${v}'`)
    .join('\n');
  typeDefinitions.push(primitiveKeys + ';');
  typeDefinitions.push('');

  typeDefinitions.push('export type SemanticToken =');
  const semanticKeys = Array.from(semanticVars.keys())
    .map((v) => `  | '${v}'`)
    .join('\n');
  typeDefinitions.push(semanticKeys + ';');
  typeDefinitions.push('');

  typeDefinitions.push('export type ComponentToken =');
  const componentKeys = Array.from(componentVars.keys())
    .map((v) => `  | '${v}'`)
    .join('\n');
  typeDefinitions.push(componentKeys + ';');
  typeDefinitions.push('');

  typeDefinitions.push('export type DesignToken = PrimitiveToken | SemanticToken | ComponentToken;');
  typeDefinitions.push('');

  // Generate helper type for deprecated tokens
  const deprecatedPrimitives = Array.from(primitiveVars.entries())
    .filter(([, info]) => info.deprecated)
    .map(([cssVar]) => cssVar);
  const deprecatedSemantic = Array.from(semanticVars.entries())
    .filter(([, info]) => info.deprecated)
    .map(([cssVar]) => cssVar);
  const deprecatedComponent = Array.from(componentVars.entries())
    .filter(([, info]) => info.deprecated)
    .map(([cssVar]) => cssVar);

  if (deprecatedPrimitives.length > 0 || deprecatedSemantic.length > 0 || deprecatedComponent.length > 0) {
    typeDefinitions.push('/**');
    typeDefinitions.push(' * @deprecated These tokens are deprecated and should not be used');
    typeDefinitions.push(' */');
    typeDefinitions.push('export type DeprecatedToken =');
    const allDeprecated = [...deprecatedPrimitives, ...deprecatedSemantic, ...deprecatedComponent]
      .map((v) => `  | '${v}'`)
      .join('\n');
    typeDefinitions.push(allDeprecated + ';');
    typeDefinitions.push('');
  }

  // Generate token map for lookups
  typeDefinitions.push('/**');
  typeDefinitions.push(' * Token information map');
  typeDefinitions.push(' */');
  typeDefinitions.push('export interface TokenInfo {');
  typeDefinitions.push("  key: string;");
  typeDefinitions.push("  cssVar: string;");
  typeDefinitions.push("  deprecated: boolean;");
  typeDefinitions.push("  replacedBy: string | null;");
  typeDefinitions.push('}');
  typeDefinitions.push('');

  const outputPath = path.join(__dirname, '../../styles/token-types.d.ts');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, typeDefinitions.join('\n'), 'utf8');
  console.log(`✅ Generated TypeScript types: ${outputPath}`);
  console.log(`   - Primitives: ${primitiveVars.size} tokens`);
  console.log(`   - Semantic: ${semanticVars.size} tokens`);
  console.log(`   - Component: ${componentVars.size} tokens`);
  console.log(`   - Deprecated: ${deprecatedPrimitives.length + deprecatedSemantic.length + deprecatedComponent.length} tokens`);
}

// Run if called directly
if (import.meta.url.includes('generate-token-types')) {
  generateTokenTypes();
}
