#!/usr/bin/env node

/**
 * Lint script to check for unresolved tokens in generated CSS files
 * 
 * This script checks for token references that weren't properly resolved
 * (e.g., {border.width.1} instead of 1)
 * 
 * Usage:
 *   node scripts/lint-unresolved-tokens.js [--fix] [--warn] [--components]
 * 
 * Options:
 *   --fix: Attempt to fix by regenerating CSS variables (requires build:css-variables)
 *   --warn: Only warn, don't fail (default: fail on errors)
 *   --components: Also check component CSS files for unresolved tokens
 *   --all: Alias for --components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CSS_FILE = path.join(__dirname, '../styles/tokens.css');
const COMPONENTS_DIR = path.join(__dirname, '../components');
const UNRESOLVED_TOKEN_PATTERN = /\{[^}]+\}/g;

/**
 * Find all unresolved tokens in a CSS file
 */
function findUnresolvedTokens(cssContent) {
  const lines = cssContent.split('\n');
  const errors = [];

  lines.forEach((line, index) => {
    const matches = line.match(UNRESOLVED_TOKEN_PATTERN);
    if (matches) {
      matches.forEach(match => {
        // Skip comments and known patterns that might be intentional
        if (line.trim().startsWith('/*') || line.trim().startsWith('*')) {
          return;
        }

        errors.push({
          line: index + 1,
          token: match,
          content: line.trim(),
        });
      });
    }
  });

  return errors;
}

/**
 * Check component CSS files for unresolved tokens
 */
function checkComponentFiles() {
  const errors = [];
  
  if (!fs.existsSync(COMPONENTS_DIR)) {
    return errors;
  }

  function checkDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        checkDirectory(itemPath);
      } else if (item.endsWith('.module.css')) {
        const cssContent = fs.readFileSync(itemPath, 'utf8');
        const lines = cssContent.split('\n');
        
        lines.forEach((line, index) => {
          const matches = line.match(UNRESOLVED_TOKEN_PATTERN);
          if (matches) {
            matches.forEach(match => {
              // Skip comments
              if (line.trim().startsWith('/*') || line.trim().startsWith('*')) {
                return;
              }
              
              errors.push({
                file: path.relative(path.join(__dirname, '..'), itemPath),
                line: index + 1,
                token: match,
                content: line.trim(),
              });
            });
          }
        });
      }
    });
  }

  checkDirectory(COMPONENTS_DIR);
  return errors;
}

/**
 * Main linting function
 */
function lintUnresolvedTokens(options = {}) {
  const { fix = false, warn = false, checkComponents = false } = options;

  if (!fs.existsSync(CSS_FILE)) {
    console.error(`❌ CSS file not found: ${CSS_FILE}`);
    console.error('   Run: npm run build:css-variables');
    process.exit(1);
  }

  const cssContent = fs.readFileSync(CSS_FILE, 'utf8');
  const errors = findUnresolvedTokens(cssContent);

  // Check component files if requested
  let componentErrors = [];
  if (checkComponents) {
    componentErrors = checkComponentFiles();
  }

  if (errors.length === 0 && componentErrors.length === 0) {
    console.log('✅ No unresolved tokens found');
    return true;
  }

  // Group errors by token for better reporting
  const tokenGroups = {};
  errors.forEach(error => {
    if (!tokenGroups[error.token]) {
      tokenGroups[error.token] = [];
    }
    tokenGroups[error.token].push(error);
  });

  const totalErrors = errors.length + componentErrors.length;
  console.error(`\n❌ Found ${totalErrors} unresolved token${totalErrors > 1 ? 's' : ''}:\n`);
  
  if (errors.length > 0) {
    console.error(`   In tokens.css (${errors.length}):\n`);

    Object.entries(tokenGroups).forEach(([token, occurrences]) => {
      console.error(`   ${token} (${occurrences.length} occurrence${occurrences.length > 1 ? 's' : ''}):`);
      occurrences.forEach(({ line, content }) => {
        // Truncate long lines
        const displayContent = content.length > 80 
          ? content.substring(0, 77) + '...' 
          : content;
        console.error(`     Line ${line}: ${displayContent}`);
      });
      console.error('');
    });
  }
  
  if (componentErrors.length > 0) {
    console.error(`   In component files (${componentErrors.length}):\n`);
    
    // Group by file
    const fileGroups = {};
    componentErrors.forEach(error => {
      if (!fileGroups[error.file]) {
        fileGroups[error.file] = [];
      }
      fileGroups[error.file].push(error);
    });
    
    Object.entries(fileGroups).forEach(([file, fileErrors]) => {
      console.error(`   ${file}:`);
      fileErrors.forEach(({ line, token, content }) => {
        const displayContent = content.length > 80 
          ? content.substring(0, 77) + '...' 
          : content;
        console.error(`     Line ${line}: ${token} - ${displayContent}`);
      });
      console.error('');
    });
  }

  if (fix) {
    console.log('🔄 Attempting to fix by regenerating CSS variables...');
    try {
      execSync('npm run build:css-variables', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      
      // Re-check after regeneration
      const newCssContent = fs.readFileSync(CSS_FILE, 'utf8');
      const newErrors = findUnresolvedTokens(newCssContent);
      
      if (newErrors.length === 0) {
        console.log('✅ All tokens resolved after regeneration');
        return true;
      } else {
        console.error(`❌ Still ${newErrors.length} unresolved token(s) after regeneration`);
        console.error('   This indicates a problem with token resolution in generate-css-variables.ts');
        return warn;
      }
    } catch (error) {
      console.error('❌ Failed to regenerate CSS variables:', error.message);
      return warn;
    }
  }

  if (warn) {
    console.warn('⚠️  Continuing despite unresolved tokens (--warn mode)');
    return true;
  }

  console.error('\n💡 Tips:');
  console.error('   - Check that all token references are valid');
  console.error('   - Verify token resolution logic in generate-css-variables.ts');
  console.error('   - Run with --fix to attempt automatic fix');
  console.error('   - Run with --warn to continue despite errors');
  console.error('   - Run with --components to also check component CSS files\n');

  return false;
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  fix: args.includes('--fix'),
  warn: args.includes('--warn'),
  checkComponents: args.includes('--components') || args.includes('--all'),
};

// Run linting
const success = lintUnresolvedTokens(options);

if (!success) {
  process.exit(1);
}
