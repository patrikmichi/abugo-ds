#!/usr/bin/env node
/**
 * Add missing component tokens used in styles/ and components/ but not in tokens.css.
 * Run: node scripts/add-missing-component-tokens.js
 *
 * Reads missing from stdin or runs the diff inline, then deep-merges into
 * tokens/system/componentTokens/components/*.json and shared/*.json.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STYLES = path.join(ROOT, 'styles');
const COMPONENTS = path.join(ROOT, 'components');
const TOKENS_CSS = path.join(ROOT, 'styles', 'tokens.css');
const COMP_DIR = path.join(ROOT, 'tokens', 'system', 'componentTokens', 'components');
const SHARED_DIR = path.join(ROOT, 'tokens', 'system', 'componentTokens', 'shared');

function extractVars(content) {
  const re = /var\(\s*(--token-(?:primitive|semantic|component)-[a-zA-Z0-9-]+)/g;
  const m = new Set();
  let a;
  while ((a = re.exec(content)) !== null) m.add(a[1]);
  return m;
}

function walk(dir, ext, out) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') walk(p, ext, out);
    else if (e.isFile() && ext.some((x) => e.name.endsWith(x))) {
      extractVars(fs.readFileSync(p, 'utf8')).forEach((v) => out.add(v));
    }
  });
}

function toPath(cssVar) {
  // --token-component-accordion-header-background -> ['accordion','header','background']
  const s = cssVar.replace(/^--token-component-/, '');
  return s.split('-').filter(Boolean);
}

function inferToken(pathSegments, key) {
  const k = key.toLowerCase();
  if (k.includes('background') || k.includes('color') || k.includes('content') || k.includes('border') && !k.includes('width') && !k.includes('radius')) {
    if (k.includes('border')) return { $type: 'color', $value: '{border.active.neutral.control.field.default}', $collectionName: 'semanticTokens' };
    if (k.includes('content')) return { $type: 'color', $value: '{content.passive.neutral.default}', $collectionName: 'semanticTokens' };
    return { $type: 'color', $value: '{background.passive.neutral.default}', $collectionName: 'semanticTokens' };
  }
  if (k.includes('padding') || k.includes('gap') || k.includes('margin')) return { $type: 'spacing', $value: '{padding.s}', $collectionName: 'semanticTokens' };
  if (k.includes('fontsize') || k.includes('font-size')) return { $type: 'fontSizes', $value: '{typography.fontSize.3}', $collectionName: 'primitives' };
  if (k.includes('lineheight') || k.includes('line-height')) return { $type: 'lineHeights', $value: '{typography.lineHeight.16}', $collectionName: 'primitives' };
  if (k.includes('radius')) return { $type: 'borderRadius', $value: '{radius.sm}', $collectionName: 'semanticTokens' };
  if (k.includes('shadow')) return { $type: 'boxShadow', $value: '{shadow.md}', $collectionName: 'semanticTokens' };
  if (k.includes('opacity')) return { $type: 'number', $value: 0.5, $collectionName: '' };
  if (k.includes('fontweight') || k.includes('font-weight')) return { $type: 'fontWeights', $value: 600, $collectionName: 'primitives' };
  if (k.includes('duration') || k.includes('transition') && !k.includes('easing')) return { $type: 'number', $value: 200, $collectionName: '' };
  if (k.includes('easing')) return { $type: 'string', $value: 'ease-out', $collectionName: '' };
  if (k.includes('z-index')) return { $type: 'number', $value: 1050, $collectionName: '' };
  if (k.includes('width') || k.includes('height') || k.includes('size') || k.includes('min-') || k.includes('max-')) return { $type: 'dimension', $value: 40, $collectionName: '' };
  return { $type: 'spacing', $value: '{spacing-2}', $collectionName: 'primitives' };
}

function deepSet(obj, pathSegs, value) {
  let o = obj;
  for (let i = 0; i < pathSegs.length - 1; i++) {
    const k = pathSegs[i];
    if (!(k in o) || typeof o[k] !== 'object' || o[k] === null || Array.isArray(o[k]) || ('$type' in o[k])) {
      o[k] = {};
    }
    o = o[k];
  }
  const last = pathSegs[pathSegs.length - 1];
  if (!(last in o)) {
    o[last] = { $scopes: ['ALL_SCOPES'], $libraryName: '', ...value };
  }
}

function main() {
  const used = new Set();
  walk(STYLES, ['.css', '.ts', '.tsx', '.js'], used);
  walk(COMPONENTS, ['.css', '.ts', '.tsx', '.ts'], used);

  const css = fs.readFileSync(TOKENS_CSS, 'utf8');
  const defined = new Set();
  let m;
  const re = /--(token-(?:primitive|semantic|component)-[a-zA-Z0-9-]+)\s*:/g;
  while ((m = re.exec(css)) !== null) defined.add('--' + m[1]);

  const missing = [...used].filter((v) => !defined.has(v) && v.startsWith('--token-component-')).sort();

  const componentNames = fs.existsSync(COMP_DIR) ? fs.readdirSync(COMP_DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')) : [];

  const byFile = new Map();
  for (const v of missing) {
    const segs = toPath(v);
    if (segs.length < 2) continue;
    const first = segs[0];
    const filePath = path.join(COMP_DIR, first + '.json');
    if (!componentNames.includes(first) || !fs.existsSync(filePath)) continue;
    if (!byFile.has(filePath)) byFile.set(filePath, []);
    byFile.get(filePath).push({ cssVar: v, path: segs });
  }

  let added = 0;
  for (const [filePath, items] of byFile) {
    const raw = fs.readFileSync(filePath, 'utf8');
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      console.warn('Skip (invalid JSON):', filePath);
      continue;
    }
    for (const { cssVar, path: segs } of items) {
      const rest = segs.slice(1);
      if (rest.length === 0) continue;
      const token = inferToken(segs, rest.join('-'));
      deepSet(obj, rest, token);
      added++;
    }
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
  }
  console.log('Added', added, 'component token(s). Run: npm run build:tokens && npm run build:css-variables');
}

main();
