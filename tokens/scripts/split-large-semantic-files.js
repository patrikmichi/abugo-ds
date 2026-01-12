const fs = require('fs');
const path = require('path');

const semanticDir = path.join(__dirname, '..', 'semanticTokens');

// Files to split (those with many tokens)
const filesToSplit = ['background.json', 'content.json'];

function parseTokenKey(key) {
  const parts = key.split('-');
  if (parts.length < 3) return null;
  
  const property = parts[0];
  const participation = parts[1];
  const intent = parts[2];
  const state = parts.slice(3).join('-') || 'default';
  
  return { property, participation, intent, state };
}

function splitFile(fileName) {
  const filePath = path.join(semanticDir, fileName);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Create subdirectory for this property
  const propertyName = fileName.replace('.json', '');
  const subDir = path.join(semanticDir, propertyName);
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }
  
  // Group tokens by participation and intent
  const grouped = {};
  const metadata = {};
  
  // Extract metadata
  Object.keys(content).forEach(key => {
    if (key.startsWith('$')) {
      metadata[key] = content[key];
    }
  });
  
  // Group tokens
  Object.keys(content).forEach(key => {
    if (key.startsWith('$')) return;
    
    const parsed = parseTokenKey(key);
    if (!parsed) {
      // Handle non-standard keys (like nested structures)
      if (!grouped['other']) {
        grouped['other'] = { $name: metadata.$name || 'Semantic Tokens' };
      }
      grouped['other'][key] = content[key];
      return;
    }
    
    const { participation, intent } = parsed;
    const groupKey = `${participation}-${intent}`;
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = { $name: metadata.$name || 'Semantic Tokens' };
      // Copy metadata
      Object.keys(metadata).forEach(mKey => {
        if (mKey !== '$name') {
          grouped[groupKey][mKey] = metadata[mKey];
        }
      });
    }
    
    grouped[groupKey][key] = content[key];
  });
  
  // Write grouped files
  let writtenCount = 0;
  Object.entries(grouped).forEach(([groupKey, tokens]) => {
    const tokenCount = Object.keys(tokens).filter(k => !k.startsWith('$')).length;
    if (tokenCount > 0) {
      const outputFile = path.join(subDir, `${groupKey}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(tokens, null, 2), 'utf8');
      console.log(`  ✅ Created ${propertyName}/${groupKey}.json (${tokenCount} tokens)`);
      writtenCount++;
    }
  });
  
  // Remove original file if we created subfiles
  if (writtenCount > 0) {
    fs.unlinkSync(filePath);
    console.log(`  🗑️  Removed original ${fileName}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('📦 Splitting large semantic token files...\n');

let splitCount = 0;
filesToSplit.forEach(file => {
  const filePath = path.join(semanticDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`Splitting ${file}...`);
    if (splitFile(file)) {
      splitCount++;
    }
  }
});

console.log(`\n✅ Split ${splitCount} semantic token files!`);
console.log('\n⚠️  Note: Update merge-tokens.js to handle nested semantic token directories if needed.');
