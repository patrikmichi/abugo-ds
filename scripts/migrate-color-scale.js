const fs = require('fs');
const path = require('path');

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Interpolate between two colors
function interpolateColor(color1, color2, factor) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
  
  return rgbToHex(r, g, b);
}

// Calculate 50 value (lighter than 100)
function calculate50(hex100) {
  // Interpolate between white and 100
  return interpolateColor("#ffffff", hex100, 0.5);
}

// Calculate 900 value (darker than 800)
function calculate900(hex800) {
  // Interpolate between 800 and black (but not pure black, keep some color)
  // Use 0.3 factor to make it darker but not pure black
  return interpolateColor(hex800, "#000000", 0.3);
}

// Migrate color scale
function migrateColorScale() {
  const colorsPath = path.join(__dirname, '..', 'tokens', 'primitives', 'colors.json');
  const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
  
  const migrated = {};
  const colorFamilies = Object.keys(colors).filter(k => !k.startsWith('$'));
  
  console.log('🔄 Migrating color scale from 000-800 to 50-900...\n');
  
  colorFamilies.forEach(family => {
    console.log(`Processing ${family}...`);
    migrated[family] = {};
    
    const familyColors = colors[family];
    const has000 = familyColors['000'] !== undefined;
    const has100 = familyColors['100'] !== undefined;
    const has800 = familyColors['800'] !== undefined;
    
    // Copy metadata
    Object.keys(familyColors).forEach(key => {
      if (key.startsWith('$')) {
        migrated[family][key] = familyColors[key];
      }
    });
    
    // Convert 000 → 50 (for grey)
    if (has000) {
      const value000 = familyColors['000'].$value;
      migrated[family]['50'] = {
        ...familyColors['000'],
        $value: value000
      };
      console.log(`  ✅ Converted 000 → 50: ${value000}`);
    } else if (has100) {
      // Calculate 50 from 100
      const value100 = familyColors['100'].$value;
      const value50 = calculate50(value100);
      migrated[family]['50'] = {
        ...familyColors['100'],
        $value: value50
      };
      console.log(`  ✅ Calculated 50: ${value50} (from 100: ${value100})`);
    }
    
    // Keep 100-800 as is (they map directly)
    for (let i = 100; i <= 800; i += 100) {
      const key = i.toString();
      if (familyColors[key]) {
        migrated[family][key] = familyColors[key];
      }
    }
    
    // Calculate 900 (darker than 800)
    if (has800) {
      const value800 = familyColors['800'].$value;
      const value900 = calculate900(value800);
      migrated[family]['900'] = {
        ...familyColors['800'],
        $value: value900
      };
      console.log(`  ✅ Calculated 900: ${value900} (from 800: ${value800})`);
    }
  });
  
  // Write migrated colors
  fs.writeFileSync(colorsPath, JSON.stringify(migrated, null, 2), 'utf8');
  console.log('\n✅ Color scale migration complete!');
  
  return migrated;
}

// Update references in semantic and component tokens
function updateReferences() {
  console.log('\n🔄 Updating references in semantic and component tokens...\n');
  
  const tokensDir = path.join(__dirname, '..', 'tokens');
  
  // Update semantic tokens
  function updateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    let changed = false;
    
    // Replace {grey.000} → {grey.50}
    if (content.includes('{grey.000}')) {
      updated = updated.replace(/{grey\.000}/g, '{grey.50}');
      changed = true;
    }
    
    // Replace {color.800} → {color.900} (if we want to use 900 instead of 800)
    // Actually, we should keep existing references and just add 900 as an option
    // So we don't need to replace 800 references
    
    if (changed) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`  ✅ Updated ${path.relative(tokensDir, filePath)}`);
      return true;
    }
    return false;
  }
  
  // Update all JSON files in semanticTokens
  const semanticDir = path.join(tokensDir, 'semanticTokens');
  function updateDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    let count = 0;
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        count += updateDirectory(itemPath);
      } else if (item.endsWith('.json')) {
        if (updateFile(itemPath)) {
          count++;
        }
      }
    });
    
    return count;
  }
  
  const semanticCount = updateDirectory(semanticDir);
  console.log(`\n✅ Updated ${semanticCount} semantic token files`);
  
  // Update component tokens
  const componentDir = path.join(tokensDir, 'componentTokens');
  const componentCount = updateDirectory(componentDir);
  console.log(`✅ Updated ${componentCount} component token files`);
}

// Main execution
console.log('🎨 Color Scale Migration: 000-800 → 50-900\n');
console.log('=' .repeat(60));

const migratedColors = migrateColorScale();
updateReferences();

console.log('\n' + '='.repeat(60));
console.log('✅ Migration complete!');
console.log('\nNext steps:');
console.log('1. Review the calculated 50 and 900 values');
console.log('2. Adjust if needed based on design requirements');
console.log('3. Run: npm run build:tokens');
console.log('4. Test in Tokens Studio and Storybook');
