const fs = require('fs');
const path = require('path');

const tokensDir = path.join(__dirname, '..', '..');

// Read existing token files
const primitives = JSON.parse(fs.readFileSync(path.join(tokensDir, 'output', 'primitives.json'), 'utf8'));
const semanticTokens = JSON.parse(fs.readFileSync(path.join(tokensDir, 'output', 'semanticTokens.json'), 'utf8'));
const componentTokens = JSON.parse(fs.readFileSync(path.join(tokensDir, 'output', 'componentTokens.json'), 'utf8'));

// Create subdirectories
const primitivesDir = path.join(tokensDir, 'system', 'primitives');
const semanticDir = path.join(tokensDir, 'system', 'semanticTokens');
const componentDir = path.join(tokensDir, 'system', 'componentTokens');
const componentSharedDir = path.join(componentDir, 'shared');
const componentComponentsDir = path.join(componentDir, 'components');

[primitivesDir, semanticDir, componentSharedDir, componentComponentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Properties that are SHARED (category-first)
const SHARED_PROPERTIES = new Set([
  'radius',
  'gap',
  'padding',
  'shadow',
  'fontSize',
  'lineHeight',
  'animation',
  'borderWidth',
  'zIndex',
  'icon'
]);

// ============================================
// SPLIT PRIMITIVES (unchanged)
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

Object.entries(primCategories).forEach(([category, tokens]) => {
  if (Object.keys(tokens).filter(k => !k.startsWith('$')).length > 0) {
    const filePath = path.join(primitivesDir, `${category}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log(`  ✅ Created primitives/${category}.json (${Object.keys(tokens).filter(k => !k.startsWith('$')).length} tokens)`);
  }
});

// ============================================
// SPLIT SEMANTIC TOKENS (unchanged)
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

function splitSemanticTokens(obj, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) {
      Object.keys(semCategories).forEach(cat => {
        if (!semCategories[cat][key]) {
          semCategories[cat][key] = value;
        }
      });
      continue;
    }

    const currentPath = [...path, key];

    if (value && typeof value === 'object' && value.$type) {
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
        setNestedValue(semCategories.content, [key], value);
      }
    } else if (value && typeof value === 'object') {
      if (key === 'typography' || key === 'radius' || key === 'icon' || 
          key === 'gap' || key === 'padding' || key === 'control' || 
          key === 'z-index' || key === 'opacity' || key === 'animation' || 
          key === 'sizing' || key === 'border') {
        splitSemanticTokens(value, [key]);
      } else {
        splitSemanticTokens(value, currentPath);
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

Object.entries(semCategories).forEach(([category, tokens]) => {
  const tokenCount = countTokens(tokens);
  if (tokenCount > 0) {
    const filePath = path.join(semanticDir, `${category}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log(`  ✅ Created semanticTokens/${category}.json (${tokenCount} tokens)`);
  }
});

// ============================================
// SPLIT COMPONENT TOKENS (HYBRID APPROACH)
// ============================================
console.log('\n📦 Splitting component tokens (hybrid approach)...');

const sharedComponentTokens = {};
const componentUniqueTokens = {};

function splitComponentTokens(obj, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const currentPath = [...path, key];
    const topLevel = path[0] || key;

    if (value && typeof value === 'object' && value.$type) {
      // This is a token
      if (SHARED_PROPERTIES.has(topLevel)) {
        // Category-first: radius.button.sm → sharedComponentTokens.radius.button.sm
        if (!sharedComponentTokens[topLevel]) {
          sharedComponentTokens[topLevel] = { $name: 'Component Tokens' };
        }
        setNestedValue(sharedComponentTokens[topLevel], currentPath.slice(1), value);
      } else {
        // Component-first: button.primary.background → componentUniqueTokens.button.primary.background
        if (!componentUniqueTokens[topLevel]) {
          componentUniqueTokens[topLevel] = { $name: 'Component Tokens' };
        }
        setNestedValue(componentUniqueTokens[topLevel], currentPath.slice(1), value);
      }
    } else if (value && typeof value === 'object') {
      splitComponentTokens(value, currentPath);
    }
  }
}

splitComponentTokens(componentTokens);

// Write shared property files (category-first)
Object.entries(sharedComponentTokens).forEach(([category, tokens]) => {
  const tokenCount = countTokens(tokens);
  if (tokenCount > 0) {
    const filePath = path.join(componentSharedDir, `${category}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log(`  ✅ Created componentTokens/shared/${category}.json (${tokenCount} tokens)`);
  }
});

// Write component files (component-first)
Object.entries(componentUniqueTokens).forEach(([component, tokens]) => {
  const tokenCount = countTokens(tokens);
  if (tokenCount > 0) {
    const filePath = path.join(componentComponentsDir, `${component}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log(`  ✅ Created componentTokens/components/${component}.json (${tokenCount} tokens)`);
  }
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
