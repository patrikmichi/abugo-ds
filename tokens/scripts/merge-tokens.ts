import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Primitives, SemanticTokens, ComponentTokens } from '@tokens/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensDir = path.join(__dirname, '..');

console.log('🔨 Merging token files...');

// ============================================
// MERGE PRIMITIVES
// ============================================
const primitivesDir = path.join(tokensDir, 'system', 'primitives');
const primitivesFiles = fs
  .readdirSync(primitivesDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

const mergedPrimitives: Primitives = {};

primitivesFiles.forEach((file) => {
  const filePath = path.join(primitivesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<
    string,
    unknown
  >;

  // Merge content directly without filename wrapper
  Object.keys(content).forEach((key) => {
    if (!key.startsWith('$')) {
      mergedPrimitives[key] = content[key] as Primitives[string];
    } else if (!mergedPrimitives[key]) {
      mergedPrimitives[key] = content[key] as Primitives[string];
    }
  });
});

const outputDir = path.join(tokensDir, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'primitives.json'),
  JSON.stringify(mergedPrimitives, null, 2)
);
console.log(`✅ Merged ${primitivesFiles.length} primitive files → output/primitives.json`);

// ============================================
// MERGE SEMANTIC TOKENS
// ============================================
const semanticDir = path.join(tokensDir, 'system', 'semanticTokens');
const mergedSemantic: SemanticTokens = { $name: 'Semantic Tokens' };

function mergeSemanticDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) return;

  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      mergeSemanticDirectory(itemPath);
    } else if (item.endsWith('.json')) {
      const content = JSON.parse(
        fs.readFileSync(itemPath, 'utf8')
      ) as Record<string, unknown>;
      // Merge content directly without filename/directory wrapper
      Object.keys(content).forEach((key) => {
        if (!key.startsWith('$')) {
          mergedSemantic[key] = content[key] as SemanticTokens[string];
        } else if (!mergedSemantic[key]) {
          mergedSemantic[key] = content[key] as SemanticTokens[string];
        }
      });
    }
  });
}

mergeSemanticDirectory(semanticDir);

const semanticFiles = fs
  .readdirSync(semanticDir, { recursive: true })
  .filter((f) => typeof f === 'string' && f.endsWith('.json'));

fs.writeFileSync(
  path.join(outputDir, 'semanticTokens.json'),
  JSON.stringify(mergedSemantic, null, 2)
);
console.log(`✅ Merged ${semanticFiles.length} semantic files → output/semanticTokens.json`);

// ============================================
// MERGE COMPONENT TOKENS
// ============================================
const componentDir = path.join(tokensDir, 'system', 'componentTokens');
const componentSharedDir = path.join(componentDir, 'shared');
const componentComponentsDir = path.join(componentDir, 'components');
const mergedComponents: ComponentTokens = {
  $name: 'Component Tokens',
};

/**
 * Deep merge two objects
 */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  Object.keys(source).forEach((key) => {
    if (key.startsWith('$')) {
      // Metadata keys - only set if not exists
      if (!target[key]) {
        target[key] = source[key];
      }
    } else if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      !(source[key] as Record<string, unknown>).$type
    ) {
      // Nested object - merge recursively
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      // Primitive or token value - overwrite
      target[key] = source[key];
    }
  });
}

// Load shared property files (category-first)
// Structure: { "button": { "sm": {...} } } → { "radius": { "button": { "sm": {...} } } }
if (fs.existsSync(componentSharedDir)) {
  const sharedFiles = fs
    .readdirSync(componentSharedDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  sharedFiles.forEach((file) => {
    const content = JSON.parse(
      fs.readFileSync(path.join(componentSharedDir, file), 'utf8')
    ) as Record<string, unknown>;
    const propertyName = file.replace('.json', '');

    // Create category-first structure: { propertyName: { componentName: value } }
    // Example: { "radius": { "button": { "sm": {...} } } }
    if (!mergedComponents[propertyName]) {
      mergedComponents[propertyName] = {} as ComponentTokens[string];
    }
    const propertyObj = mergedComponents[propertyName] as Record<string, unknown>;

    Object.keys(content).forEach((key) => {
      if (!key.startsWith('$')) {
        const componentName = key;
        propertyObj[componentName] = content[key];
      }
    });
  });
  console.log(
    `✅ Merged ${sharedFiles.length} shared property files (category-first: radius.button.sm)`
  );
}

// Load component files (component-first)
// Structure: { "primary": { "boxed": { "background": {...} } } } → { "button": { "primary": {...} } }
if (fs.existsSync(componentComponentsDir)) {
  const componentFiles = fs
    .readdirSync(componentComponentsDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  componentFiles.forEach((file) => {
    const content = JSON.parse(
      fs.readFileSync(path.join(componentComponentsDir, file), 'utf8')
    ) as Record<string, unknown>;
    const componentName = file.replace('.json', '');

    // Merge component content directly (component-first structure)
    if (!mergedComponents[componentName]) {
      mergedComponents[componentName] = {} as ComponentTokens[string];
    }
    Object.keys(content).forEach((key) => {
      if (!key.startsWith('$')) {
        // Deep merge to handle nested structures
        const existing = mergedComponents[componentName] as Record<string, unknown>;
        if (
          typeof content[key] === 'object' &&
          content[key] !== null &&
          !Array.isArray(content[key])
        ) {
          deepMerge(existing, { [key]: content[key] } as Record<string, unknown>);
        } else {
          existing[key] = content[key];
        }
      }
    });
  });
  console.log(
    `✅ Merged ${componentFiles.length} component files (component-first: button.primary.background)`
  );
}

fs.writeFileSync(
  path.join(outputDir, 'componentTokens.json'),
  JSON.stringify(mergedComponents, null, 2)
);
console.log(`✅ Merged component tokens → output/componentTokens.json`);
