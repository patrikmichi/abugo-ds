const fs = require('fs');
const path = require('path');

/**
 * Load and merge tokens from subfolders
 */
function loadTokens() {
  const tokensDir = path.join(__dirname, '..', 'tokens');

  // Load primitives
  const primitivesDir = path.join(tokensDir, 'primitives');
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

  // Load semantic tokens
  const semanticDir = path.join(tokensDir, 'semanticTokens');
  const semanticTokens = { $name: 'Semantic Tokens' };
  if (fs.existsSync(semanticDir)) {
    const files = fs.readdirSync(semanticDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(semanticDir, file), 'utf8'));
      Object.keys(content).forEach(key => {
        if (!key.startsWith('$')) {
          semanticTokens[key] = content[key];
        } else if (!semanticTokens[key]) {
          semanticTokens[key] = content[key];
        }
      });
    });
  }

  // Load component tokens
  const componentDir = path.join(tokensDir, 'componentTokens');
  const componentTokens = { $name: 'Component Tokens' };
  
  // Load property files
  if (fs.existsSync(componentDir)) {
    const files = fs.readdirSync(componentDir)
      .filter(f => f.endsWith('.json') && !fs.statSync(path.join(componentDir, f)).isDirectory());
    
    files.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(componentDir, file), 'utf8'));
      Object.keys(content).forEach(key => {
        if (!key.startsWith('$')) {
          componentTokens[key] = content[key];
        }
      });
    });

    // Load color files
    const colorsDir = path.join(componentDir, 'colors');
    if (fs.existsSync(colorsDir)) {
      const colorFiles = fs.readdirSync(colorsDir).filter(f => f.endsWith('.json'));
      colorFiles.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(colorsDir, file), 'utf8'));
        Object.keys(content).forEach(key => {
          if (!key.startsWith('$')) {
            if (!componentTokens[key]) {
              componentTokens[key] = {};
            }
            mergeObjects(componentTokens[key], content[key]);
          }
        });
      });
    }
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

module.exports = { loadTokens };
