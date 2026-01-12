// Wrapper for Panda CSS compatibility (CommonJS/ESM)
// The actual implementation is in load-tokens.ts
import { dirname, join } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get directory using import.meta.url (ESM)
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);
} catch {
  // Fallback for environments that don't support import.meta
  __dirname = process.cwd();
}

/**
 * Load and merge tokens from subfolders
 * This is a simplified version for Panda CSS compatibility
 */
export function loadTokens() {
  const tokensDir = join(__dirname, '..');

  // Load primitives
  const primitivesDir = join(tokensDir, 'system', 'primitives');
  const primitives = {};
  if (fs.existsSync(primitivesDir)) {
    const files = fs.readdirSync(primitivesDir).filter((f) => f.endsWith('.json'));
    files.forEach((file) => {
      const content = JSON.parse(fs.readFileSync(join(primitivesDir, file), 'utf8'));
      Object.keys(content).forEach((key) => {
        if (!key.startsWith('$')) {
          primitives[key] = content[key];
        } else if (!primitives[key]) {
          primitives[key] = content[key];
        }
      });
    });
  }

  // Load semantic tokens
  const semanticDir = join(tokensDir, 'system', 'semanticTokens');
  const semanticTokens = { $name: 'Semantic Tokens' };

  function loadSemanticDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);
    items.forEach((item) => {
      const itemPath = join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        loadSemanticDirectory(itemPath);
      } else if (item.endsWith('.json')) {
        const content = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
        Object.keys(content).forEach((key) => {
          if (!key.startsWith('$')) {
            semanticTokens[key] = content[key];
          } else if (!semanticTokens[key]) {
            semanticTokens[key] = content[key];
          }
        });
      }
    });
  }

  loadSemanticDirectory(semanticDir);

  // Load component tokens
  const componentDir = join(tokensDir, 'system', 'componentTokens');
  const componentSharedDir = join(componentDir, 'shared');
  const componentComponentsDir = join(componentDir, 'components');
  const componentTokens = { $name: 'Component Tokens' };

  if (fs.existsSync(componentSharedDir)) {
    const sharedFiles = fs.readdirSync(componentSharedDir).filter((f) => f.endsWith('.json'));
    sharedFiles.forEach((file) => {
      const content = JSON.parse(fs.readFileSync(join(componentSharedDir, file), 'utf8'));
      const propertyName = file.replace('.json', '');
      componentTokens[propertyName] = {};
      Object.keys(content).forEach((key) => {
        if (!key.startsWith('$')) {
          componentTokens[propertyName][key] = content[key];
        }
      });
    });
  }

  if (fs.existsSync(componentComponentsDir)) {
    const componentFiles = fs.readdirSync(componentComponentsDir).filter((f) => f.endsWith('.json'));
    componentFiles.forEach((file) => {
      const content = JSON.parse(fs.readFileSync(join(componentComponentsDir, file), 'utf8'));
      const componentName = file.replace('.json', '');
      componentTokens[componentName] = {};
      Object.keys(content).forEach((key) => {
        if (!key.startsWith('$')) {
          componentTokens[componentName][key] = content[key];
        }
      });
    });
  }

  return { primitives, semanticTokens, componentTokens };
}
