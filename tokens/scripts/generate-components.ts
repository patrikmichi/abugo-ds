import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from './load-tokens.js';
import type { ComponentTokens } from '@tokens/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Convert to camelCase
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Get CSS variable name from token path
 */
function getCssVarName(path: string[]): string {
  const key = path.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `--token-component-${key}`;
}

/**
 * Analyze component tokens to extract structure
 */
function analyzeComponent(componentName: string, tokens: ComponentTokens): {
  variants: string[];
  sizes: string[];
  states: string[];
  properties: string[];
} {
  const componentTokens = tokens[componentName] as ComponentTokens[string] | undefined;
  if (!componentTokens || typeof componentTokens !== 'object') {
    return { variants: [], sizes: [], states: [], properties: [] };
  }

  const variants = new Set<string>();
  const sizes = new Set<string>();
  const states = new Set<string>();
  const properties = new Set<string>();

  function traverse(obj: unknown, depth = 0): void {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;

      if (depth === 0) {
        // Top level - could be variant or property
        if (['background', 'content', 'border', 'icon', 'indicator'].includes(key)) {
          properties.add(key);
        } else {
          variants.add(key);
        }
      } else if (depth === 1) {
        // Second level
        if (['sm', 'md', 'lg', 'xs', 'xl', 'xxs'].includes(key)) {
          sizes.add(key);
        } else if (['default', 'hover', 'active', 'pressed', 'disabled', 'focused', 'selected'].includes(key)) {
          states.add(key);
        } else if (!properties.has(key)) {
          variants.add(key);
        }
      }

      if (typeof value === 'object' && value !== null) {
        traverse(value, depth + 1);
      }
    }
  }

  traverse(componentTokens);

  return {
    variants: Array.from(variants),
    sizes: Array.from(sizes),
    states: Array.from(states),
    properties: Array.from(properties),
  };
}

/**
 * Generate component files
 */
export function generateComponent(
  componentName: string,
  tokens: ComponentTokens,
  outputDir: string
): void {
  const analysis = analyzeComponent(componentName, tokens);
  const ComponentName = toPascalCase(componentName);
  const componentDir = path.join(outputDir, ComponentName);

  // Create directory
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  // Generate CSS module
  generateCssModule(componentName, ComponentName, tokens, analysis, componentDir);

  // Generate TypeScript component
  generateTsxComponent(componentName, ComponentName, tokens, analysis, componentDir);

  // Generate index file
  generateIndexFile(ComponentName, componentDir);

  console.log(`✅ Generated ${ComponentName} component`);
}

/**
 * Generate CSS module
 */
function generateCssModule(
  componentName: string,
  ComponentName: string,
  tokens: ComponentTokens,
  analysis: ReturnType<typeof analyzeComponent>,
  outputDir: string
): void {
  const cssLines: string[] = [
    `/* ${ComponentName} component styles using design tokens */`,
    '',
    `.${toCamelCase(componentName)} {`,
  ];

  // Add base styles using component tokens
  const componentTokens = tokens[componentName] as ComponentTokens[string] | undefined;
  if (componentTokens && typeof componentTokens === 'object') {
    // Try to find default background
    if ('background' in componentTokens) {
      const bg = (componentTokens as { background?: unknown }).background;
      if (bg && typeof bg === 'object' && 'default' in bg) {
        cssLines.push(`  background-color: var(--token-component-${componentName}-background-default);`);
      } else if (bg && typeof bg === 'object' && '$value' in bg) {
        cssLines.push(`  background-color: var(--token-component-${componentName}-background);`);
      }
    }

    // Try to find default content/color
    if ('content' in componentTokens) {
      const content = (componentTokens as { content?: unknown }).content;
      if (content && typeof content === 'object' && 'default' in content) {
        cssLines.push(`  color: var(--token-component-${componentName}-content-default);`);
      } else if (content && typeof content === 'object' && '$value' in content) {
        cssLines.push(`  color: var(--token-component-${componentName}-content);`);
      }
    }

    // Try to find border
    if ('border' in componentTokens) {
      const border = (componentTokens as { border?: unknown }).border;
      if (border && typeof border === 'object' && 'default' in border) {
        cssLines.push(`  border: var(--token-semantic-border-width-thin) solid var(--token-component-${componentName}-border-default);`);
      }
    }
  }

  // Add shared tokens (padding, radius, etc.)
  if (analysis.sizes.length > 0) {
    // Check if padding token exists for this component
    const paddingToken = `--token-component-padding-x-${componentName}-md`;
    cssLines.push(`  padding: var(${paddingToken});`);
    cssLines.push(`  border-radius: var(--token-component-radius-${componentName}-md);`);
  } else {
    // Use semantic tokens or component-specific if available
    cssLines.push(`  padding: var(--token-semantic-padding-m);`);
    cssLines.push(`  border-radius: var(--token-semantic-radius-md);`);
  }

  cssLines.push('}');
  cssLines.push('');

  // Generate variant styles
  if (analysis.variants.length > 0) {
    for (const variant of analysis.variants) {
      const variantKey = toCamelCase(variant);
      cssLines.push(`.${variantKey} {`);
      
      // Add variant-specific tokens
      if (componentTokens && typeof componentTokens === 'object' && variant in componentTokens) {
        const variantTokens = (componentTokens as Record<string, unknown>)[variant];
        if (variantTokens && typeof variantTokens === 'object') {
          if ('background' in variantTokens) {
            const bg = (variantTokens as { background?: unknown }).background;
            if (bg && typeof bg === 'object' && 'default' in bg) {
              cssLines.push(`  background-color: var(--token-component-${componentName}-${variant}-background-default);`);
            }
          }
          if ('content' in variantTokens) {
            const content = (variantTokens as { content?: unknown }).content;
            if (content && typeof content === 'object' && 'default' in content) {
              cssLines.push(`  color: var(--token-component-${componentName}-${variant}-content-default);`);
            } else if (content && typeof content === 'object' && '$value' in content) {
              cssLines.push(`  color: var(--token-component-${componentName}-${variant}-content);`);
            }
          }
        }
      }
      
      cssLines.push('}');
      cssLines.push('');
    }
  }

  // Generate size styles
  if (analysis.sizes.length > 0) {
    for (const size of analysis.sizes) {
      const sizeKey = toCamelCase(size);
      cssLines.push(`.${sizeKey} {`);
      // Check if component has specific padding/radius tokens
      const hasPadding = `--token-component-padding-x-${componentName}-${size}`;
      const hasRadius = `--token-component-radius-${componentName}-${size}`;
      cssLines.push(`  padding: var(${hasPadding});`);
      cssLines.push(`  border-radius: var(${hasRadius});`);
      cssLines.push('}');
      cssLines.push('');
    }
  }

  // Generate state styles
  if (analysis.states.length > 0) {
    for (const state of analysis.states) {
      if (state === 'default') continue;
      
      const stateKey = toCamelCase(state);
      cssLines.push(`.${toCamelCase(componentName)}:${state === 'hover' ? 'hover' : state === 'active' ? 'active' : state === 'focused' ? 'focus' : state} {`);
      
      // Add state-specific tokens
      if (componentTokens && typeof componentTokens === 'object') {
        // Try to find state tokens in nested structure
        function findStateToken(obj: unknown, stateName: string): string | null {
          if (!obj || typeof obj !== 'object') return null;
          
          for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith('$')) continue;
            
            if (key === stateName && value && typeof value === 'object' && '$value' in value) {
              return `--token-component-${componentName}-${key}`;
            }
            
            if (typeof value === 'object') {
              const found = findStateToken(value, stateName);
              if (found) return found;
            }
          }
          
          return null;
        }
        
        const tokenVar = findStateToken(componentTokens, state);
        if (tokenVar) {
          cssLines.push(`  background-color: var(${tokenVar});`);
        }
      }
      
      cssLines.push('}');
      cssLines.push('');
    }
  }

  const cssContent = cssLines.join('\n');
  const cssPath = path.join(outputDir, `${ComponentName}.module.css`);
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}

/**
 * Generate TypeScript component
 */
function generateTsxComponent(
  componentName: string,
  ComponentName: string,
  tokens: ComponentTokens,
  analysis: ReturnType<typeof analyzeComponent>,
  outputDir: string
): void {
  const props: string[] = [];
  const classNameLogic: string[] = [];

  // Add variant prop
  if (analysis.variants.length > 0) {
    const variantType = analysis.variants.map(v => `'${v}'`).join(' | ');
    props.push(`  variant?: ${variantType};`);
    classNameLogic.push(`variant && styles.${toCamelCase(analysis.variants[0])}`);
  }

  // Add size prop
  if (analysis.sizes.length > 0) {
    const sizeType = analysis.sizes.map(s => `'${s}'`).join(' | ');
    props.push(`  size?: ${sizeType};`);
    classNameLogic.push(`size && styles.${toCamelCase(analysis.sizes[0])}`);
  }

  const tsxContent = `import React from 'react';
import styles from './${ComponentName}.module.css';
import { cn } from '@/lib/utils';

export interface ${ComponentName}Props extends React.HTMLAttributes<HTMLElement> {
${props.length > 0 ? props.join('\n') : '  // No variant props defined'}
  children?: React.ReactNode;
}

export function ${ComponentName}({
${props.length > 0 ? props.map(p => `  ${p.split(':')[0].trim()},`).join('\n') : ''}
  className,
  children,
  ...props
}: ${ComponentName}Props) {
  return (
    <div
      className={cn(
        styles.${toCamelCase(componentName)},
${classNameLogic.length > 0 ? classNameLogic.map(c => `        ${c},`).join('\n') : '        // No variant classes'}
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
`;

  const tsxPath = path.join(outputDir, `${ComponentName}.tsx`);
  fs.writeFileSync(tsxPath, tsxContent, 'utf8');
}

/**
 * Generate index file
 */
function generateIndexFile(ComponentName: string, outputDir: string): void {
  const indexContent = `export { ${ComponentName}, type ${ComponentName}Props } from './${ComponentName}';
`;

  const indexPath = path.join(outputDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent, 'utf8');
}

/**
 * Main function to generate all components
 */
export function generateAllComponents(): void {
  const { componentTokens } = loadTokens();
  const projectRoot = path.join(__dirname, '../..');
  const componentsDir = path.join(projectRoot, 'components');

  // Get all component names from tokens
  const componentNames = Object.keys(componentTokens).filter(
    (key) => !key.startsWith('$') && key !== 'animation' && key !== 'radius' && key !== 'padding' && key !== 'gap' && key !== 'height' && key !== 'fontSize' && key !== 'lineHeight' && key !== 'borderWidth' && key !== 'shadow' && key !== 'icon' && key !== 'zIndex'
  );

  console.log(`🔨 Generating ${componentNames.length} components...\n`);

  for (const componentName of componentNames) {
    try {
      generateComponent(componentName, componentTokens, componentsDir);
    } catch (error) {
      console.error(`❌ Error generating ${componentName}:`, error);
    }
  }

  console.log(`\n✅ Generated ${componentNames.length} components in ${componentsDir}`);
}

// Run if called directly
if (import.meta.url.includes('generate-components')) {
  generateAllComponents();
}
