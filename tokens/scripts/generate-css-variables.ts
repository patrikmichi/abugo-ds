import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from './load-tokens.js';
import type { Primitives, SemanticTokens, ComponentTokens, TokenValue } from '@tokens/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Alias map for shorthand references that don't exist in source token files.
 * Maps {shorthand} → {canonical} before resolution.
 * This handles naming mismatches between component token references and
 * the actual semantic/primitive token names.
 */
const REFERENCE_ALIASES: Record<string, string> = {
  // spacing.* → gap.* (no "spacing" semantic scale; use gap)
  'spacing.xxs': 'gap.xxs',
  'spacing.xs': 'gap.xs',
  'spacing.sm': 'gap.sm',
  'spacing.md': 'gap.md',
  'spacing.lg': 'gap.xl',

  // padding.sm → padding.s (scale uses single-letter names)
  'padding.sm': 'padding.s',

  // Missing gap/radius/sizing at extremes
  'gap.xxxl': 'gap.xxl',
  // radius.xxs is now a real token (2px)

  // fontSize shorthand → typography.fontSize
  'fontSize.-1': 'typography.fontSize.1',
  'fontSize.0': 'typography.fontSize.1',
  'fontSize.1': 'typography.fontSize.2',
  'typography.fontSize.xs': 'typography.fontSize.1',
  'typography.fontSize.sm': 'typography.fontSize.2',
  'typography.fontSize.md': 'typography.fontSize.3',

  // fontWeight shorthand → typography.fontWeight
  'fontWeight.medium': 'typography.fontWeight.medium',
  'fontWeight.semibold': 'typography.fontWeight.semibold',

  // lineHeight shorthand → typography.lineHeight / body.line
  'lineHeight.normal': 'typography.lineHeight.16',
  'lineHeight.tight': 'typography.lineHeight.12',
  'typography.lineHeight.6': 'typography.lineHeight.24',
  'typography.lineHeight.md': 'typography.lineHeight.16',

  // zIndex shorthand → z.index
  'zIndex.dropdown': 'z.index.dropdown',
  'zIndex.modal': 'z.index.modal',

  // borderWidth → primitive
  'borderWidth.1': 'border-width-1',

  // space.* → primitive spacing
  'space.1': 'spacing-1',
  'space.1-5': 'spacing-1p5',
  'space.2': 'spacing-2',
  'space.5': 'spacing-5',

  // sizing → control.height (closest semantic equivalent)
  'sizing.xxs': 'control.height.xxs',
  'sizing.md': 'control.height.md',
  'sizing.xl': 'control.height.lg',
  'sizing.xxxxl': 'control.height.lg',

  // content aliases
  'content.passive.neutral.secondary': 'content.passive.neutral.subtle',
  'content.passive.neutral.tertiary': 'content.passive.neutral.muted',
  'content.passive.on.default': 'content.passive.on.neutral.default',

  // background aliases
  'background.active.neutral.subtle': 'background.active.neutral.default',
  'background.passive.neutral.inverse': 'background.passive.neutral.strong',
  'background.passive.neutral.overlay': 'background.passive.neutral.elevated',

  // icon.field → icon sizes (sm/md/lg → xs/sm/md)
  'icon.field.sm': 'icon.xs',
  'icon.field.md': 'icon.sm',
  'icon.field.lg': 'icon.md',
};

/**
 * Resolve a token reference path (e.g., "yellow.100" or "spacing-1")
 */
function resolveReferencePath(
  refPath: string,
  collection: Primitives | SemanticTokens | ComponentTokens
): unknown {
  // Token keys can be stored in multiple formats:
  //   - Nested objects: typography → fontSize → 3
  //   - Dotted top-level keys: "shadow.xs", "body.size", "z.index"
  //   - Hyphenated top-level keys: "shadow-xs", "spacing-1", "typography-fontSize-1"
  //
  // References use dot notation: "{shadow.xs}", "{typography.body.size.md}"
  // We try multiple strategies to find the value.

  const obj = collection as Record<string, unknown>;

  // Strategy 1: Exact top-level key (dotted keys like "shadow.xs", "background.passive.neutral.overlay")
  if (refPath in obj) return obj[refPath];

  // Strategy 2: Hyphenated top-level key ("shadow.xs" → "shadow-xs")
  const hyphenated = refPath.replace(/\./g, '-');
  if (hyphenated in obj) return obj[hyphenated];

  // Strategy 3: Greedy dot-segment walk (handles nested objects AND dotted keys)
  const segments = refPath.split('.');
  const result = greedyResolve(segments, 0, obj);
  if (result !== null) return result;

  // Strategy 4: Hyphen-segment walk ("spacing-1" split by "-")
  const hyphenSegments = refPath.split('-');
  if (hyphenSegments.length > 1) {
    let value: unknown = collection;
    for (const seg of hyphenSegments) {
      if (value && typeof value === 'object' && seg in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[seg];
      } else {
        return null;
      }
    }
    return value;
  }

  return null;
}

function tryChild(
  child: unknown,
  segments: string[],
  end: number
): unknown {
  if (end === segments.length) return child;
  if (child && typeof child === 'object') {
    return greedyResolve(segments, end, child as Record<string, unknown>);
  }
  return null;
}

function greedyResolve(
  segments: string[],
  start: number,
  obj: Record<string, unknown>
): unknown {
  if (start >= segments.length) return obj;

  // Try longest key first (greedy), then shorter
  for (let end = segments.length; end > start; end--) {
    const slice = segments.slice(start, end);

    // Try dot-joined key: "body.size"
    const dotKey = slice.join('.');
    if (dotKey in obj) {
      const result = tryChild(obj[dotKey], segments, end);
      if (result !== null) return result;
    }

    // Try hyphen-joined key: "body-size"
    const hyphenKey = slice.join('-');
    if (hyphenKey !== dotKey && hyphenKey in obj) {
      const result = tryChild(obj[hyphenKey], segments, end);
      if (result !== null) return result;
    }

    // Try dot-variant of a hyphenated segment: segment "body-size" → key "body.size"
    if (slice.length === 1 && slice[0].includes('-')) {
      const dotVariant = slice[0].replace(/-/g, '.');
      if (dotVariant in obj) {
        const result = tryChild(obj[dotVariant], segments, end);
        if (result !== null) return result;
      }
    }
  }

  return null;
}

/**
 * Resolve a single {reference} across all collections.
 * Cascade: component → semantic → primitives.
 * Source data often has incorrect $collectionName, so always try all.
 */
function resolveReference(
  refPath: string,
  primitives: Primitives,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens
): unknown {
  const collections: Array<Primitives | SemanticTokens | ComponentTokens> =
    [componentTokens, semanticTokens, primitives];

  // Try original path first
  for (const coll of collections) {
    const result = resolveReferencePath(refPath, coll);
    // Skip non-leaf container objects (no $value) — they're component namespaces, not tokens
    if (result !== null && !(typeof result === 'object' && result !== null && !('$value' in result))) {
      return result;
    }
  }

  // Try alias if original failed
  const alias = REFERENCE_ALIASES[refPath];
  if (alias) {
    for (const coll of collections) {
      const result = resolveReferencePath(alias, coll);
      if (result !== null && !(typeof result === 'object' && result !== null && !('$value' in result))) {
        return result;
      }
    }
  }

  return null;
}

/**
 * Extract the final resolved value from a token, unwrapping $value wrappers
 * and following reference chains until we reach a concrete value.
 */
function unwrapToken(
  resolved: unknown,
  primitives: Primitives,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens,
  depth: number
): string | number {
  if (depth > 15) return '';

  // Token object with $value — unwrap
  if (resolved && typeof resolved === 'object' && '$value' in resolved) {
    const tokenValue = resolved as TokenValue;
    return unwrapToken(tokenValue.$value, primitives, semanticTokens, componentTokens, depth + 1);
  }

  // Number — done
  if (typeof resolved === 'number') return resolved;

  // Composite object — skip
  if (typeof resolved === 'object' && resolved !== null) return '';

  const str = String(resolved);

  // Pure reference — resolve recursively
  if (str.startsWith('{') && str.endsWith('}') && !str.includes('} ') && !str.includes(' {')) {
    const refPath = str.slice(1, -1);
    const next = resolveReference(refPath, primitives, semanticTokens, componentTokens);
    if (next !== null) {
      return unwrapToken(next, primitives, semanticTokens, componentTokens, depth + 1);
    }
    return str; // unresolved
  }

  // Compound value with embedded references: "{padding.xs} 0", "-{spacing.sm}"
  if (str.includes('{') && str.includes('}')) {
    return str.replace(/(-?)\{([^}]+)\}/g, (_match, neg: string, refPath: string) => {
      const next = resolveReference(refPath, primitives, semanticTokens, componentTokens);
      if (next !== null) {
        const val = unwrapToken(next, primitives, semanticTokens, componentTokens, depth + 1);
        return `${neg}${val}`;
      }
      return `${neg}{${refPath}}`;
    });
  }

  return str;
}

/**
 * Resolve a token value, handling references recursively.
 * Supports pure references ({ref}), compound values ({ref} 0), and negated refs (-{ref}).
 */
function resolveTokenValue(
  value: string | number | object,
  primitives: Primitives,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens,
  _collectionName?: string,
  depth = 0
): string | number {
  if (depth > 15) return String(value);
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value !== null) return '';

  if (typeof value === 'string') {
    // Pure reference
    if (value.startsWith('{') && value.endsWith('}') && !value.includes('} ') && !value.includes(' {')) {
      const refPath = value.slice(1, -1);
      const resolved = resolveReference(refPath, primitives, semanticTokens, componentTokens);
      if (resolved !== null) {
        return unwrapToken(resolved, primitives, semanticTokens, componentTokens, 0);
      }
      return value; // unresolved
    }

    // Compound value with embedded references
    if (value.includes('{') && value.includes('}')) {
      return value.replace(/(-?)\{([^}]+)\}/g, (_match, neg: string, refPath: string) => {
        const resolved = resolveReference(refPath, primitives, semanticTokens, componentTokens);
        if (resolved !== null) {
          const val = unwrapToken(resolved, primitives, semanticTokens, componentTokens, 0);
          return `${neg}${val}`;
        }
        return `${neg}{${refPath}}`;
      });
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
    if (type === 'spacing' || type === 'dimension' || type === 'sizing' || type === 'borderRadius') {
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
          {} as ComponentTokens
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
        const resolved = resolveTokenValue(
          tokenValue.$value,
          primitives,
          semanticTokens,
          {} as ComponentTokens
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
        const resolved = resolveTokenValue(
          tokenValue.$value,
          primitives,
          semanticTokens,
          componentTokens
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
 * Load from merge-tokens output when available so component counts match
 * merge-tokens and analyze. Fall back to loadTokens() otherwise.
 */
function loadTokenData(): {
  primitives: Primitives;
  semanticTokens: SemanticTokens;
  componentTokens: ComponentTokens;
} {
  const outputDir = path.join(__dirname, '../output');
  const outComp = path.join(outputDir, 'componentTokens.json');
  const outPrim = path.join(outputDir, 'primitives.json');
  const outSem = path.join(outputDir, 'semanticTokens.json');
  if (fs.existsSync(outComp) && fs.existsSync(outPrim) && fs.existsSync(outSem)) {
    return {
      primitives: JSON.parse(fs.readFileSync(outPrim, 'utf8')) as Primitives,
      semanticTokens: JSON.parse(fs.readFileSync(outSem, 'utf8')) as SemanticTokens,
      componentTokens: JSON.parse(fs.readFileSync(outComp, 'utf8')) as ComponentTokens,
    };
  }
  return loadTokens();
}

/**
 * Main function to generate CSS variables file
 */
export function generateCssVariables(): void {
  const { primitives, semanticTokens, componentTokens } = loadTokenData();

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
