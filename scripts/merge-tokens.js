const fs = require('fs');
const path = require('path');

const tokensDir = path.join(__dirname, '..', 'tokens');

console.log('🔨 Merging token files...');

// ============================================
// MERGE PRIMITIVES
// ============================================
const primitivesDir = path.join(tokensDir, 'primitives');
const primitivesFiles = fs.readdirSync(primitivesDir)
  .filter(f => f.endsWith('.json'))
  .sort();

const mergedPrimitives = {};

primitivesFiles.forEach(file => {
  const filePath = path.join(primitivesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.keys(content).forEach(key => {
    if (!key.startsWith('$')) {
      mergedPrimitives[key] = content[key];
    } else if (!mergedPrimitives[key]) {
      mergedPrimitives[key] = content[key];
    }
  });
});

fs.writeFileSync(
  path.join(tokensDir, 'primitives.json'),
  JSON.stringify(mergedPrimitives, null, 2),
  'utf8'
);
console.log(`✅ Merged ${primitivesFiles.length} primitive files → primitives.json`);

// ============================================
// MERGE SEMANTIC TOKENS
// ============================================
const semanticDir = path.join(tokensDir, 'semanticTokens');
const mergedSemantic = {};

function mergeSemanticDirectory(dirPath, basePath = semanticDir) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively merge subdirectories (e.g., background/, content/)
      mergeSemanticDirectory(itemPath, basePath);
    } else if (item.endsWith('.json')) {
      // Merge JSON files
      const content = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
      
      Object.keys(content).forEach(key => {
        if (!key.startsWith('$')) {
          mergedSemantic[key] = content[key];
        } else if (!mergedSemantic[key]) {
          mergedSemantic[key] = content[key];
        }
      });
    }
  });
}

mergeSemanticDirectory(semanticDir);

// Count files for logging
let fileCount = 0;
function countFiles(dirPath) {
  const items = fs.readdirSync(dirPath);
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      countFiles(itemPath);
    } else if (item.endsWith('.json')) {
      fileCount++;
    }
  });
}
countFiles(semanticDir);

fs.writeFileSync(
  path.join(tokensDir, 'semanticTokens.json'),
  JSON.stringify(mergedSemantic, null, 2),
  'utf8'
);
console.log(`✅ Merged ${fileCount} semantic files → semanticTokens.json`);

// ============================================
// MERGE COMPONENT TOKENS (HYBRID APPROACH)
// ============================================
const componentDir = path.join(tokensDir, 'componentTokens');
const componentSharedDir = path.join(componentDir, 'shared');
const componentComponentsDir = path.join(componentDir, 'components');

const mergedComponent = { $name: 'Component Tokens' };

// Merge shared property files (category-first: radius, gap, padding, etc.)
if (fs.existsSync(componentSharedDir)) {
  const sharedFiles = fs.readdirSync(componentSharedDir)
    .filter(f => f.endsWith('.json'))
    .sort();

  sharedFiles.forEach(file => {
    const filePath = path.join(componentSharedDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Extract property name from filename (e.g., "radius.json" → "radius")
    const propertyName = file.replace('.json', '');
    
    // Merge all non-metadata keys under the property name
    mergedComponent[propertyName] = {};
    Object.keys(content).forEach(key => {
      if (!key.startsWith('$')) {
        mergedComponent[propertyName][key] = content[key];
      }
    });
  });
  
  console.log(`✅ Merged ${sharedFiles.length} shared property files (category-first)`);
}

// Merge component files (component-first: button, field, etc.)
if (fs.existsSync(componentComponentsDir)) {
  const componentFiles = fs.readdirSync(componentComponentsDir)
    .filter(f => f.endsWith('.json'))
    .sort();

  componentFiles.forEach(file => {
    const filePath = path.join(componentComponentsDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Extract component name from filename (e.g., "button.json" → "button")
    const componentName = file.replace('.json', '');
    
    // Merge all non-metadata keys under the component name
    mergedComponent[componentName] = {};
    Object.keys(content).forEach(key => {
      if (!key.startsWith('$')) {
        mergedComponent[componentName][key] = content[key];
      }
    });
  });
  
  console.log(`✅ Merged ${componentFiles.length} component files (component-first)`);
}

fs.writeFileSync(
  path.join(tokensDir, 'componentTokens.json'),
  JSON.stringify(mergedComponent, null, 2),
  'utf8'
);
console.log(`✅ Merged component tokens → componentTokens.json`);

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

console.log('\n✅ All tokens merged successfully!');
