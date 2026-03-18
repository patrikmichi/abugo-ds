#!/usr/bin/env node

/**
 * Script to update all token references from hyphen to dot notation
 * Updates references in:
 * - Component tokens ($value fields)
 * - CSS files (CSS variable references)
 * - Aliases and other token files
 */

const fs = require('fs');
const path = require('path');

/**
 * Convert hyphen-delimited token reference to dot-delimited
 */
function convertTokenReference(ref) {
  // Pattern: {content-passive-success} -> {content.passive.success}
  // Pattern: {background-active-accent-default} -> {background.active.accent.default}
  
  if (!ref.startsWith('{') || !ref.endsWith('}')) {
    return ref;
  }
  
  const tokenName = ref.slice(1, -1); // Remove { }
  
  // Skip if already using dots or if it's a primitive reference
  if (tokenName.includes('.') || 
      tokenName.match(/^(brand|grey|success|danger|warning|info|upgrade|brown|yellow|spacing|typography|icon|radius|padding|gap|shadow|opacity|z-index|animation|border|sizing|universal)\./)) {
    return ref;
  }
  
  // Convert semantic token references: content-passive-success -> content.passive.success
  const converted = tokenName.replace(/-/g, '.');
  return `{${converted}}`;
}

/**
 * Process a file and update all token references
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  let newContent = content;
  
  // Update references in $value fields: "{content-passive-success}"
  const valuePattern = /\{([a-z]+-[a-z]+(?:-[a-z]+(?:-[a-z]+)?)?)\}/g;
  newContent = newContent.replace(valuePattern, (match, tokenName) => {
    // Skip primitive references
    if (tokenName.match(/^(brand|grey|success|danger|warning|info|upgrade|brown|yellow|spacing|typography|icon|radius|padding|gap|shadow|opacity|z-index|animation|border|sizing|universal)\./)) {
      return match;
    }
    
    const converted = convertTokenReference(match);
    if (converted !== match) {
      updated = true;
    }
    return converted;
  });
  
  if (updated) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  ✅ Updated: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  
  return false;
}

/**
 * Main function
 */
function updateReferences() {
  console.log('🔄 Updating token references from hyphen to dot notation...\n');
  
  let updatedCount = 0;
  
  // Update component tokens
  const componentTokensDir = path.join(__dirname, '..', 'tokens', 'system', 'componentTokens', 'components');
  if (fs.existsSync(componentTokensDir)) {
    console.log('Updating component tokens...');
    const files = fs.readdirSync(componentTokensDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      if (processFile(path.join(componentTokensDir, file))) {
        updatedCount++;
      }
    });
  }
  
  // Update aliases
  const aliasesFile = path.join(__dirname, '..', 'tokens', 'system', 'semanticTokens', 'aliases.json');
  if (fs.existsSync(aliasesFile)) {
    console.log('\nUpdating aliases...');
    if (processFile(aliasesFile)) {
      updatedCount++;
    }
  }
  
  // Update CSS files
  const componentsDir = path.join(__dirname, '..', 'components');
  if (fs.existsSync(componentsDir)) {
    console.log('\nUpdating CSS files...');
    function processCSSDir(dir) {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          processCSSDir(itemPath);
        } else if (item.endsWith('.css')) {
          const content = fs.readFileSync(itemPath, 'utf8');
          // Update CSS variable references: --token-semantic-content-passive-success
          const cssPattern = /(--token-semantic-)([a-z]+-[a-z]+(?:-[a-z]+(?:-[a-z]+)?)?)/g;
          const newContent = content.replace(cssPattern, (match, prefix, tokenName) => {
            // Skip if already has dots or is a primitive
            if (tokenName.includes('.') || tokenName.startsWith('typography-') || tokenName.startsWith('gap-') || tokenName.startsWith('padding-') || tokenName.startsWith('radius-') || tokenName.startsWith('border-width-') || tokenName.startsWith('animation-') || tokenName.startsWith('z-index-') || tokenName.startsWith('shadow-')) {
              return match;
            }
            const converted = tokenName.replace(/-/g, '.');
            return `${prefix}${converted}`;
          });
          
          if (newContent !== content) {
            fs.writeFileSync(itemPath, newContent, 'utf8');
            console.log(`  ✅ Updated: ${path.relative(process.cwd(), itemPath)}`);
            updatedCount++;
          }
        }
      });
    }
    processCSSDir(componentsDir);
  }
  
  console.log(`\n✅ Updated ${updatedCount} files`);
  console.log('\nNext: Run npm run build:tokens to regenerate output files');
}

if (require.main === module) {
  updateReferences();
}

module.exports = { convertTokenReference };
