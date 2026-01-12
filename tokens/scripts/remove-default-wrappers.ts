import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensDir = path.join(__dirname, '..');

/**
 * Remove unnecessary "default" wrappers
 * Only remove "default" if it's the ONLY key (no other states/sizes)
 * Keep "default" if there are other keys at the same level (like hover, pressed, sm, md, etc.)
 */
function removeDefaultWrappers(obj: Record<string, unknown>): unknown {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Keep metadata keys as-is
    if (key.startsWith('$')) {
      result[key] = value;
      continue;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const valueObj = value as Record<string, unknown>;

      // Check if this object only has "default" key (and metadata keys)
      const nonMetadataKeys = Object.keys(valueObj).filter((k) => !k.startsWith('$'));

      // Check if "default" is the ONLY non-metadata key
      if (nonMetadataKeys.length === 1 && nonMetadataKeys[0] === 'default') {
        // Unwrap: use the default value directly
        const defaultValue = valueObj.default;
        if (
          typeof defaultValue === 'object' &&
          defaultValue !== null &&
          !Array.isArray(defaultValue)
        ) {
          // Merge metadata from parent if needed
          const metadataKeys = Object.keys(valueObj).filter((k) => k.startsWith('$'));
          const merged = { ...(defaultValue as Record<string, unknown>) };
          metadataKeys.forEach((metaKey) => {
            if (!merged[metaKey]) {
              merged[metaKey] = valueObj[metaKey];
            }
          });
          result[key] = removeDefaultWrappers(merged);
        } else {
          result[key] = defaultValue;
        }
      } else {
        // Has multiple keys (default + hover, pressed, sm, md, etc.) - keep structure
        // But recursively process nested objects
        result[key] = removeDefaultWrappers(valueObj);
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Process a single JSON file
 */
function processFile(filePath: string): void {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
  const cleaned = removeDefaultWrappers(content) as Record<string, unknown>;
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + '\n');
}

console.log('🧹 Removing unnecessary "default" wrappers (only when default is the only key)...');

// Process component token shared files
const componentSharedDir = path.join(tokensDir, 'system', 'componentTokens', 'shared');
if (fs.existsSync(componentSharedDir)) {
  const sharedFiles = fs
    .readdirSync(componentSharedDir)
    .filter((f) => f.endsWith('.json'));
  sharedFiles.forEach((file) => {
    processFile(path.join(componentSharedDir, file));
    console.log(`  ✓ ${file}`);
  });
}

// Process component token component files
const componentComponentsDir = path.join(tokensDir, 'system', 'componentTokens', 'components');
if (fs.existsSync(componentComponentsDir)) {
  const componentFiles = fs
    .readdirSync(componentComponentsDir)
    .filter((f) => f.endsWith('.json'));
  componentFiles.forEach((file) => {
    processFile(path.join(componentComponentsDir, file));
    console.log(`  ✓ ${file}`);
  });
}

// Process semantic token files
function processSemanticDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) return;

  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      processSemanticDirectory(itemPath);
    } else if (item.endsWith('.json')) {
      processFile(itemPath);
      const relativePath = path.relative(
        path.join(tokensDir, 'system', 'semanticTokens'),
        itemPath
      );
      console.log(`  ✓ ${relativePath}`);
    }
  });
}

const semanticDir = path.join(tokensDir, 'system', 'semanticTokens');
processSemanticDirectory(semanticDir);

console.log('\n✅ All unnecessary "default" wrappers removed!');
