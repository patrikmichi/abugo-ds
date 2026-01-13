#!/usr/bin/env node

/**
 * Migration script to convert semantic token names from hyphen-delimited
 * to dot-delimited structure.
 * 
 * Examples:
 * - content-passive-success → content.passive.success
 * - content-passive-on-accent → content.passive.on.accent
 * - background-active-accent-default → background.active.accent.default
 */

const fs = require('fs');
const path = require('path');

const tokensDir = path.join(__dirname, '..', 'tokens', 'system', 'semanticTokens');
const outputDir = path.join(__dirname, '..', 'tokens', 'output');

/**
 * Convert hyphen-delimited token name to dot-delimited
 */
function convertTokenName(name) {
  // Skip if already using dots or if it's a metadata key
  if (name.startsWith('$') || name.includes('.')) {
    return name;
  }
  
  // Skip metadata keys that should remain hyphenated
  const metadataKeys = ['design-tokens', 'collectionName', 'libraryName'];
  if (metadataKeys.includes(name)) {
    return name;
  }
  
  // Convert hyphens to dots
  return name.replace(/-/g, '.');
}

/**
 * Recursively process an object and convert all keys
 */
function processObject(obj, depth = 0) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert the key
    const newKey = convertTokenName(key);
    
    // Process the value
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[newKey] = processObject(value, depth + 1);
    } else if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      // Update token references in $value fields
      const tokenRef = value.slice(1, -1); // Remove { }
      const convertedRef = convertTokenName(tokenRef);
      result[newKey] = `{${convertedRef}}`;
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

/**
 * Process a single token file
 */
function processFile(filePath) {
  console.log(`Processing: ${path.relative(process.cwd(), filePath)}`);
  
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const processed = processObject(content);
  
  fs.writeFileSync(filePath, JSON.stringify(processed, null, 2) + '\n', 'utf8');
  console.log(`  ✅ Updated`);
}

/**
 * Main migration function
 */
function migrate() {
  console.log('🔄 Migrating semantic tokens from hyphen to dot notation...\n');
  
  // Process all semantic token files
  function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        processDirectory(itemPath);
      } else if (item.endsWith('.json')) {
        processFile(itemPath);
      }
    }
  }
  
  processDirectory(tokensDir);
  
  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build:tokens');
  console.log('2. Check for any remaining references');
  console.log('3. Update CSS variable references if needed');
}

if (require.main === module) {
  migrate();
}

module.exports = { convertTokenName, processObject };
