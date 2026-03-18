import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { LoadedTokens, Primitives, SemanticTokens, ComponentTokens } from '@tokens/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load and merge tokens from subfolders
 */
export function loadTokens(): LoadedTokens {
  const tokensDir = path.join(__dirname, '..');

  // Load primitives
  const primitivesDir = path.join(tokensDir, 'system', 'primitives');
  const primitives: Primitives = {};
  if (fs.existsSync(primitivesDir)) {
    const files = fs.readdirSync(primitivesDir).filter((f) => f.endsWith('.json'));
    files.forEach((file) => {
      const content = JSON.parse(
        fs.readFileSync(path.join(primitivesDir, file), 'utf8')
      ) as Record<string, unknown>;
      Object.keys(content).forEach((key) => {
        if (!key.startsWith('$')) {
          primitives[key] = content[key] as Primitives[string];
        } else if (!primitives[key]) {
          primitives[key] = content[key] as Primitives[string];
        }
      });
    });
  }

  // Load semantic tokens (handles nested directories)
  const semanticDir = path.join(tokensDir, 'system', 'semanticTokens');
  const semanticTokens: SemanticTokens = { $name: 'Semantic Tokens' };

  function loadSemanticDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);
    items.forEach((item) => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Recursively load subdirectories (e.g., background/, content/)
        loadSemanticDirectory(itemPath);
      } else if (item.endsWith('.json')) {
        // Load JSON files
        const content = JSON.parse(
          fs.readFileSync(itemPath, 'utf8')
        ) as Record<string, unknown>;
        Object.keys(content).forEach((key) => {
          if (!key.startsWith('$')) {
            semanticTokens[key] = content[key] as SemanticTokens[string];
          } else if (!semanticTokens[key]) {
            semanticTokens[key] = content[key] as SemanticTokens[string];
          }
        });
      }
    });
  }

  loadSemanticDirectory(semanticDir);

  // Load component tokens (hybrid approach)
  const componentDir = path.join(tokensDir, 'system', 'componentTokens');
  const componentSharedDir = path.join(componentDir, 'shared');
  const componentComponentsDir = path.join(componentDir, 'components');
  const componentTokens: ComponentTokens = { $name: 'Component Tokens' };

  // Load shared property files (category-first: radius, gap, padding, etc.)
  if (fs.existsSync(componentSharedDir)) {
    const sharedFiles = fs.readdirSync(componentSharedDir).filter((f) => f.endsWith('.json'));
    sharedFiles.forEach((file) => {
      const content = JSON.parse(
        fs.readFileSync(path.join(componentSharedDir, file), 'utf8')
      ) as Record<string, unknown>;
      // Extract property name from filename (e.g., "radius.json" → "radius")
      const propertyName = file.replace('.json', '');

      // Merge all non-metadata keys under the property name
      componentTokens[propertyName] = {} as ComponentTokens[string];
      Object.keys(content).forEach((key) => {
        if (!key.startsWith('$')) {
          (componentTokens[propertyName] as Record<string, unknown>)[key] = content[key];
        }
      });
    });
  }

  // Load component files (component-first: button, field, etc.)
  if (fs.existsSync(componentComponentsDir)) {
    const componentFiles = fs.readdirSync(componentComponentsDir).filter((f) =>
      f.endsWith('.json')
    );
    componentFiles.forEach((file) => {
      const content = JSON.parse(
        fs.readFileSync(path.join(componentComponentsDir, file), 'utf8')
      ) as Record<string, unknown>;
      // Extract component name from filename (e.g., "button.json" → "button")
      const componentName = file.replace('.json', '');

      // Merge all non-metadata keys under the component name
      componentTokens[componentName] = {} as ComponentTokens[string];
      Object.keys(content).forEach((key) => {
        if (!key.startsWith('$')) {
          (componentTokens[componentName] as Record<string, unknown>)[key] = content[key];
        }
      });
    });
  }

  return { primitives, semanticTokens, componentTokens };
}
