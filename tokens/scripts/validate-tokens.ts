import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from './load-tokens.js';
import type { Primitives, SemanticTokens, ComponentTokens, TokenValue } from '@tokens/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationError {
  type: 'missing' | 'deprecated' | 'invalid-reference' | 'type-mismatch';
  file: string;
  line?: number;
  token: string;
  message: string;
  suggestion?: string;
}

interface TokenInfo {
  key: string;
  cssVar: string;
  deprecated: boolean;
  replacedBy: string | null;
  type?: string;
  exists: boolean;
}

/**
 * Get all CSS variable names from tokens
 */
function getAllCssVariables(
  primitives: Primitives,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens
): Map<string, TokenInfo> {
  const variables = new Map<string, TokenInfo>();

  function processPrimitives(obj: Primitives, prefix: string = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;

      const fullKey = prefix ? `${prefix}-${key}` : key;
      const cssVar = `--token-primitive-${fullKey.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenValue = value as TokenValue;
        variables.set(cssVar, {
          key: fullKey,
          cssVar,
          deprecated: false,
          replacedBy: null,
          type: tokenValue.$type,
          exists: true,
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
        
        variables.set(cssVar, {
          key: fullKey,
          cssVar,
          deprecated: designTokens?.deprecated === true,
          replacedBy: designTokens?.replacedBy || null,
          type: tokenValue.$type,
          exists: true,
        });
      } else if (value && typeof value === 'object') {
        processSemantic(value as SemanticTokens | ComponentTokens, fullKey, level);
      }
    }
  }

  processPrimitives(primitives);
  processSemantic(semanticTokens, '', 'semantic');
  processSemantic(componentTokens, '', 'component');

  return variables;
}

/**
 * Find all CSS variable usages in a file
 */
function findCssVariablesInFile(filePath: string): Array<{ variable: string; line: number }> {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const variables: Array<{ variable: string; line: number }> = [];

  // Match var(--token-*) patterns
  const varRegex = /var\((--token-(?:primitive|semantic|component)-[a-z0-9-]+)/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = varRegex.exec(line)) !== null) {
      variables.push({
        variable: match[1],
        line: index + 1,
      });
    }
  });

  return variables;
}

/**
 * Find all CSS module files
 */
function findCssModuleFiles(rootDir: string): string[] {
  const files: string[] = [];

  function walkDir(dir: string): void {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!['node_modules', '.next', 'dist', 'build', 'storybook-static'].includes(item)) {
          walkDir(fullPath);
        }
      } else if (item.endsWith('.module.css') || item.endsWith('.module.scss') || item.endsWith('.module.sass')) {
        files.push(fullPath);
      }
    }
  }

  walkDir(rootDir);
  return files;
}

/**
 * Validate tokens in CSS files
 */
export function validateTokens(): { errors: ValidationError[]; warnings: ValidationError[] } {
  const { primitives, semanticTokens, componentTokens } = loadTokens();
  const allVariables = getAllCssVariables(primitives, semanticTokens, componentTokens);
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  const projectRoot = path.join(__dirname, '../..');
  const cssFiles = findCssModuleFiles(projectRoot);

  console.log(`🔍 Validating tokens in ${cssFiles.length} CSS module files...\n`);

  for (const cssFile of cssFiles) {
    const variables = findCssVariablesInFile(cssFile);
    const relativePath = path.relative(projectRoot, cssFile);

    for (const { variable, line } of variables) {
      const tokenInfo = allVariables.get(variable);

      if (!tokenInfo) {
        errors.push({
          type: 'missing',
          file: relativePath,
          line,
          token: variable,
          message: `Token "${variable}" does not exist`,
          suggestion: 'Run `npm run build:css-variables` to regenerate CSS variables, or check if the token was removed.',
        });
      } else if (tokenInfo.deprecated) {
        const suggestion = tokenInfo.replacedBy
          ? `Use "${tokenInfo.replacedBy}" instead`
          : 'This token is deprecated and should be replaced';
        
        warnings.push({
          type: 'deprecated',
          file: relativePath,
          line,
          token: variable,
          message: `Token "${variable}" is deprecated`,
          suggestion,
        });
      }
    }
  }

  return { errors, warnings };
}

/**
 * Main validation function
 */
export function runValidation(): boolean {
  const { errors, warnings } = validateTokens();

  console.log('📊 Validation Results:\n');

  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):\n`);
    errors.forEach((error) => {
      console.log(`  ${error.file}:${error.line || '?'}`);
      console.log(`    ${error.type.toUpperCase()}: ${error.message}`);
      if (error.suggestion) {
        console.log(`    💡 ${error.suggestion}`);
      }
      console.log();
    });
  }

  if (warnings.length > 0) {
    console.log(`⚠️  Found ${warnings.length} warning(s):\n`);
    warnings.forEach((warning) => {
      console.log(`  ${warning.file}:${warning.line || '?'}`);
      console.log(`    ${warning.type.toUpperCase()}: ${warning.message}`);
      if (warning.suggestion) {
        console.log(`    💡 ${warning.suggestion}`);
      }
      console.log();
    });
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All tokens are valid!\n');
    return true;
  }

  if (errors.length > 0) {
    console.log(`\n❌ Validation failed with ${errors.length} error(s)`);
    return false;
  }

  console.log(`\n⚠️  Validation passed with ${warnings.length} warning(s)`);
  return true;
}

// Run if called directly
if (import.meta.url.includes('validate-tokens')) {
  const success = runValidation();
  process.exit(success ? 0 : 1);
}
