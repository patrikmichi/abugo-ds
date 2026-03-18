const fs = require('fs');
const path = require('path');

const tokensDir = path.join(__dirname, '..', 'tokens');

// Read existing token files
const primitives = JSON.parse(fs.readFileSync(path.join(tokensDir, 'primitives.json'), 'utf8'));
const semanticTokens = JSON.parse(fs.readFileSync(path.join(tokensDir, 'semanticTokens.json'), 'utf8'));
const componentTokens = JSON.parse(fs.readFileSync(path.join(tokensDir, 'componentTokens.json'), 'utf8'));

// Create subdirectories
const primitivesDir = path.join(tokensDir, 'primitives');
const semanticDir = path.join(tokensDir, 'semanticTokens');
const componentDir = path.join(tokensDir, 'componentTokens');
const componentColorsDir = path.join(componentDir, 'colors');

[primitivesDir, semanticDir, componentDir, componentColorsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============================================
// SPLIT PRIMITIVES
// ============================================
console.log('📦 Splitting primitives...');

const primCategories = {
  colors: {},
  typography: {},
  spacing: {},
  radius: {},
  shadows: {},
  border: {},
  sizing: {},
  opacity: {},
  animation: {},
  zIndex: {},
  universal: {}
};

Object.keys(primitives).forEach(key => {
  if (key.startsWith('$')) {
    Object.keys(primCategories).forEach(cat => {
      primCategories[cat][key] = primitives[key];
    });
    return;
  }

  // Categorize tokens
  if (key.includes('yellow') || key.includes('grey') || key.includes('brand') || 
      key.includes('purple') || key.includes('negative') || key.includes('success') || 
      key.includes('warning') || key.includes('brown') || key.includes('upgrade') || 
      key.includes('aqua') || key.includes('passes') || key.includes('ai-features')) {
    primCategories.colors[key] = primitives[key];
  } else if (key.startsWith('typography-') || key.includes('typography')) {
    primCategories.typography[key] = primitives[key];
  } else if (key.startsWith('spacing-')) {
    primCategories.spacing[key] = primitives[key];
  } else if (key.startsWith('radius-')) {
    primCategories.radius[key] = primitives[key];
  } else if (key.startsWith('shadow-')) {
    primCategories.shadows[key] = primitives[key];
  } else if (key.startsWith('border-')) {
    primCategories.border[key] = primitives[key];
  } else if (key.startsWith('size-') || key.includes('icon-size')) {
    primCategories.sizing[key] = primitives[key];
  } else if (key.startsWith('opacity-')) {
    primCategories.opacity[key] = primitives[key];
  } else if (key.startsWith('duration-') || key.startsWith('easing-') || key.startsWith('animation-')) {
    primCategories.animation[key] = primitives[key];
  } else if (key.includes('z-') || key.includes('z-index')) {
    primCategories.zIndex[key] = primitives[key];
  } else if (key.includes('universal')) {
    primCategories.universal[key] = primitives[key];
  } else {
    primCategories.sizing[key] = primitives[key];
  }
});

// Write primitive category files
Object.entries(primCategories).forEach(([category, tokens]) => {
  if (Object.keys(tokens).filter(k => !k.startsWith('$')).length > 0) {
    const filePath = path.join(primitivesDir, `${category}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log(`  ✅ Created primitives/${category}.json (${Object.keys(tokens).filter(k => !k.startsWith('$')).length} tokens)`);
  }
});

// ============================================
// SPLIT SEMANTIC TOKENS (handle nested structures)
// ============================================
console.log('\n📦 Splitting semantic tokens...');

const semCategories = {
  background: { $name: 'Semantic Tokens' },
  content: { $name: 'Semantic Tokens' },
  border: { $name: 'Semantic Tokens' },
  radius: { $name: 'Semantic Tokens' },
  typography: { $name: 'Semantic Tokens' },
  icon: { $name: 'Semantic Tokens' },
  gap: { $name: 'Semantic Tokens' },
  padding: { $name: 'Semantic Tokens' },
  control: { $name: 'Semantic Tokens' },
  shadow: { $name: 'Semantic Tokens' },
  zIndex: { $name: 'Semantic Tokens' },
  opacity: { $name: 'Semantic Tokens' },
  animation: { $name: 'Semantic Tokens' },
  sizing: { $name: 'Semantic Tokens' },
  borderWidth: { $name: 'Semantic Tokens' }
};

function splitSemanticTokens(obj, path = [], target = semCategories) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) {
      // Metadata - add to all categories
      Object.keys(semCategories).forEach(cat => {
        if (!semCategories[cat][key]) {
          semCategories[cat][key] = value;
        }
      });
      continue;
    }

    const currentPath = [...path, key];

    if (value && typeof value === 'object' && value.$type) {
      // This is a token
      const topLevel = path[0] || key;

      if (topLevel.startsWith('background-')) {
        setNestedValue(semCategories.background, [key], value);
      } else if (topLevel.startsWith('content-')) {
        setNestedValue(semCategories.content, [key], value);
      } else if (topLevel.startsWith('border-') || topLevel.includes('border.')) {
        setNestedValue(semCategories.border, currentPath, value);
      } else if (topLevel === 'shadow' || topLevel.startsWith('shadow-')) {
        setNestedValue(semCategories.shadow, currentPath, value);
      } else if (topLevel === 'radius' || topLevel.includes('radius.')) {
        setNestedValue(semCategories.radius, currentPath, value);
      } else if (topLevel === 'typography' || topLevel.includes('typography.')) {
        setNestedValue(semCategories.typography, currentPath, value);
      } else if (topLevel === 'icon' || topLevel.includes('icon.')) {
        setNestedValue(semCategories.icon, currentPath, value);
      } else if (topLevel === 'gap' || topLevel.includes('gap.')) {
        setNestedValue(semCategories.gap, currentPath, value);
      } else if (topLevel === 'padding' || topLevel.includes('padding.')) {
        setNestedValue(semCategories.padding, currentPath, value);
      } else if (topLevel === 'control' || topLevel.includes('control.')) {
        setNestedValue(semCategories.control, currentPath, value);
      } else if (topLevel === 'z-index' || topLevel.includes('z-index.')) {
        setNestedValue(semCategories.zIndex, currentPath, value);
      } else if (topLevel === 'opacity' || topLevel.includes('opacity.')) {
        setNestedValue(semCategories.opacity, currentPath, value);
      } else if (topLevel === 'animation' || topLevel.includes('animation.')) {
        setNestedValue(semCategories.animation, currentPath, value);
      } else if (topLevel === 'sizing' || topLevel.includes('sizing.')) {
        setNestedValue(semCategories.sizing, currentPath, value);
      } else if (topLevel.startsWith('border-width-')) {
        setNestedValue(semCategories.borderWidth, currentPath, value);
      } else {
        // Custom tokens (notes, rating, etc.) go to content
        setNestedValue(semCategories.content, [key], value);
      }
    } else if (value && typeof value === 'object') {
      // Handle nested structures
      if (key === 'typography' || key === 'radius' || key === 'icon' || 
          key === 'gap' || key === 'padding' || key === 'control' || 
          key === 'z-index' || key === 'opacity' || key === 'animation' || 
          key === 'sizing' || key === 'border') {
        splitSemanticTokens(value, [key], semCategories);
      } else {
        splitSemanticTokens(value, currentPath, target);
      }
    }
  }
}

function setNestedValue(obj, path, value) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
}

splitSemanticTokens(semanticTokens);

// Write semantic category files
Object.entries(semCategories).forEach(([category, tokens]) => {
  const tokenCount = countTokens(tokens);
  if (tokenCount > 0) {
    const filePath = path.join(semanticDir, `${category}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log(`  ✅ Created semanticTokens/${category}.json (${tokenCount} tokens)`);
  }
});

// ============================================
// SPLIT COMPONENT TOKENS
// ============================================
console.log('\n📦 Splitting component tokens...');

const compCategories = {
  fontSize: { $name: 'Component Tokens' },
  lineHeight: { $name: 'Component Tokens' },
  padding: { $name: 'Component Tokens' },
  radius: { $name: 'Component Tokens' },
  gap: { $name: 'Component Tokens' },
  height: { $name: 'Component Tokens' },
  width: { $name: 'Component Tokens' },
  shadow: { $name: 'Component Tokens' },
  borderWidth: { $name: 'Component Tokens' },
  animation: { $name: 'Component Tokens' },
  zIndex: { $name: 'Component Tokens' },
  opacity: { $name: 'Component Tokens' },
  icon: { $name: 'Component Tokens' }
};

const componentColors = {};

function splitComponentTokens(obj, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const currentPath = [...path, key];

    if (value && typeof value === 'object' && value.$type) {
      // This is a token
      const topLevel = path[0] || key;

      if (topLevel === 'fontSize') {
        setNestedValue(compCategories.fontSize, currentPath, value);
      } else if (topLevel === 'lineHeight') {
        setNestedValue(compCategories.lineHeight, currentPath, value);
      } else if (topLevel === 'padding') {
        setNestedValue(compCategories.padding, currentPath, value);
      } else if (topLevel === 'radius') {
        setNestedValue(compCategories.radius, currentPath, value);
      } else if (topLevel === 'gap') {
        setNestedValue(compCategories.gap, currentPath, value);
      } else if (topLevel === 'height') {
        setNestedValue(compCategories.height, currentPath, value);
      } else if (topLevel === 'width') {
        setNestedValue(compCategories.width, currentPath, value);
      } else if (topLevel === 'shadow') {
        setNestedValue(compCategories.shadow, currentPath, value);
      } else if (topLevel === 'borderWidth') {
        setNestedValue(compCategories.borderWidth, currentPath, value);
      } else if (topLevel === 'animation') {
        setNestedValue(compCategories.animation, currentPath, value);
      } else if (topLevel === 'zIndex') {
        setNestedValue(compCategories.zIndex, currentPath, value);
      } else if (topLevel === 'opacity') {
        setNestedValue(compCategories.opacity, currentPath, value);
      } else if (topLevel === 'icon') {
        setNestedValue(compCategories.icon, currentPath, value);
      } else if (value.$type === 'color') {
        // Color tokens - group by component
        const componentName = path[0] || key;
        if (!componentColors[componentName]) {
          componentColors[componentName] = {};
        }
        setNestedValue(componentColors, currentPath, value);
      }
    } else if (value && typeof value === 'object') {
      splitComponentTokens(value, currentPath);
    }
  }
}

splitComponentTokens(componentTokens);

// Write component property files
Object.entries(compCategories).forEach(([category, tokens]) => {
  const tokenCount = countTokens(tokens);
  if (tokenCount > 0) {
    const filePath = path.join(componentDir, `${category}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log(`  ✅ Created componentTokens/${category}.json (${tokenCount} tokens)`);
  }
});

// Write component color files (split by component)
Object.keys(componentColors).forEach(componentName => {
  const componentData = { $name: 'Component Tokens' };
  componentData[componentName] = componentColors[componentName];
  
  const filePath = path.join(componentColorsDir, `${componentName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(componentData, null, 2), 'utf8');
  console.log(`  ✅ Created componentTokens/colors/${componentName}.json`);
});

function countTokens(obj) {
  let count = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && value.$type) {
      count++;
    } else if (value && typeof value === 'object') {
      count += countTokens(value);
    }
  }
  return count;
}

console.log('\n✅ Token splitting complete!');
