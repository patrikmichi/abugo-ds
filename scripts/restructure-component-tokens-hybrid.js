const fs = require('fs');
const path = require('path');

const tokensDir = path.join(__dirname, '..', 'tokens');
const componentTokens = JSON.parse(fs.readFileSync(path.join(tokensDir, 'componentTokens.json'), 'utf8'));

console.log('🔄 Restructuring component tokens to hybrid approach...\n');

// Properties that are SHARED (3+ components) → Category-first
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

// Properties that are UNIQUE (1-2 components) → Component-first
const UNIQUE_PROPERTIES = new Set([
  'height',
  'width',
  'opacity'
]);

const restructured = { $name: 'Component Tokens' };

// Separate shared (category-first) and unique (component-first) tokens
const sharedTokens = {};
const componentTokens_restructured = {};

function restructureTokens(obj, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const currentPath = [...path, key];
    const topLevel = path[0] || key;

    if (value && typeof value === 'object' && value.$type) {
      // This is a token
      if (SHARED_PROPERTIES.has(topLevel)) {
        // Category-first: radius.button.sm → sharedTokens.radius.button.sm
        if (!sharedTokens[topLevel]) {
          sharedTokens[topLevel] = {};
        }
        setNestedValue(sharedTokens[topLevel], currentPath.slice(1), value);
      } else if (UNIQUE_PROPERTIES.has(topLevel)) {
        // Component-first: height.field.sm → componentTokens_restructured.field.height.sm
        // Extract component name (second level in property-first structure)
        const componentName = path[1] || key;
        if (!componentTokens_restructured[componentName]) {
          componentTokens_restructured[componentName] = {};
        }
        if (!componentTokens_restructured[componentName][topLevel]) {
          componentTokens_restructured[componentName][topLevel] = {};
        }
        setNestedValue(componentTokens_restructured[componentName][topLevel], currentPath.slice(2), value);
      } else {
        // Component-first: button.primary.background → componentTokens_restructured.button.primary.background
        if (!componentTokens_restructured[topLevel]) {
          componentTokens_restructured[topLevel] = {};
        }
        setNestedValue(componentTokens_restructured[topLevel], currentPath.slice(1), value);
      }
    } else if (value && typeof value === 'object') {
      restructureTokens(value, currentPath);
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

restructureTokens(componentTokens);

// Merge shared tokens into restructured (category-first)
Object.keys(sharedTokens).forEach(prop => {
  restructured[prop] = sharedTokens[prop];
});

// Merge component tokens into restructured (component-first)
Object.keys(componentTokens_restructured).forEach(component => {
  restructured[component] = componentTokens_restructured[component];
});

// Write the restructured file
fs.writeFileSync(
  path.join(tokensDir, 'componentTokens.json'),
  JSON.stringify(restructured, null, 2),
  'utf8'
);

console.log('✅ Restructured component tokens:');
console.log(`   📐 Category-first (shared): ${Object.keys(sharedTokens).length} properties`);
Object.keys(sharedTokens).forEach(prop => {
  const count = countTokens(sharedTokens[prop]);
  console.log(`      - ${prop}: ${count} tokens`);
});
console.log(`   🎨 Component-first (unique): ${Object.keys(componentTokens_restructured).length} components`);
console.log(`      - Colors and unique properties grouped by component`);

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

console.log('\n✅ Component tokens restructured successfully!');
