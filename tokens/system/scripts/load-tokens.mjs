import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load and merge tokens from subfolders
 */
export function loadTokens() {
  const tokensDir = path.join(__dirname, '..', '..');

  // Load primitives
  const primitivesDir = path.join(tokensDir, 'system', 'primitives');
  const primitives = {};
  if (fs.existsSync(primitivesDir)) {
    const files = fs.readdirSync(primitivesDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(primitivesDir, file), 'utf8'));
      Object.keys(content).forEach(key => {
        if (!key.startsWith('$')) {
          primitives[key] = content[key];
        } else if (!primitives[key]) {
          primitives[key] = content[key];
        }
      });
    });
  }

  // Load semantic tokens (handles nested directories)
  const semanticDir = path.join(tokensDir, 'system', 'semanticTokens');
  const semanticTokens = { $name: 'Semantic Tokens' };
  
  function loadSemanticDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Recursively load subdirectories (e.g., background/, content/)
        loadSemanticDirectory(itemPath);
      } else if (item.endsWith('.json')) {
        // Load JSON files
        const content = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
        Object.keys(content).forEach(key => {
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

  // Load component tokens (hybrid approach)
  const componentDir = path.join(tokensDir, 'system', 'componentTokens');
  const componentSharedDir = path.join(componentDir, 'shared');
  const componentComponentsDir = path.join(componentDir, 'components');
  const componentTokens = { $name: 'Component Tokens' };
  
  // Load shared property files (category-first: radius, gap, padding, etc.)
  if (fs.existsSync(componentSharedDir)) {
    const sharedFiles = fs.readdirSync(componentSharedDir).filter(f => f.endsWith('.json'));
    sharedFiles.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(componentSharedDir, file), 'utf8'));
      // Extract property name from filename (e.g., "radius.json" → "radius")
      const propertyName = file.replace('.json', '');
      
      // Merge all non-metadata keys under the property name
      componentTokens[propertyName] = {};
      Object.keys(content).forEach(key => {
        if (!key.startsWith('$')) {
          componentTokens[propertyName][key] = content[key];
        }
      });
    });
  }
  
  // Load component files (component-first: button, field, etc.)
  if (fs.existsSync(componentComponentsDir)) {
    const componentFiles = fs.readdirSync(componentComponentsDir).filter(f => f.endsWith('.json'));
    componentFiles.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(componentComponentsDir, file), 'utf8'));
      // Extract component name from filename (e.g., "button.json" → "button")
      const componentName = file.replace('.json', '');
      
      // Merge all non-metadata keys under the component name
      componentTokens[componentName] = {};
      Object.keys(content).forEach(key => {
        if (!key.startsWith('$')) {
          componentTokens[componentName][key] = content[key];
        }
      });
    });
  }

  function mergeObjects(target, source) {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !source[key].$type) {
        if (!target[key]) {
          target[key] = {};
        }
        mergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  }

  return { primitives, semanticTokens, componentTokens };
}
