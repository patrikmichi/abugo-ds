#!/usr/bin/env node
/**
 * Find why 9 fewer component variables appear in tokens.css than leaf tokens.
 * Run: node scripts/diagnose-missing-component-vars.mjs
 * Prereq: npm run build:tokens && npm run build:css-variables
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'tokens', 'output');
const CSS = path.join(ROOT, 'styles', 'tokens.css');

// 1) All --token-component-* from tokens.css
const cssText = fs.readFileSync(CSS, 'utf8');
const inCss = new Set();
const re = /--token-component-([a-zA-Z0-9-]+)/g;
let m;
while ((m = re.exec(cssText)) !== null) inCss.add('--token-component-' + m[1]);

// 2) Walk merged componentTokens like the generator; use same toCssVariable
const comp = JSON.parse(fs.readFileSync(path.join(OUT, 'componentTokens.json'), 'utf8'));

function toCssVariable(key, prefix) {
  const kebab = key
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toLowerCase();
  return `--${prefix}-${kebab}`;
}

const leaves = []; // { path, fullKey, cssVar, type, value }
const processed = new Set();

function processObject(obj, prefix = '') {
  if (!obj || typeof obj !== 'object') return;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const fullKey = prefix ? `${prefix}-${key}` : key;
    const cssVar = toCssVariable(fullKey, 'token-component');

    if (value && typeof value === 'object' && '$value' in value) {
      const t = value;
      const path = fullKey;
      const type = t.$type || '(none)';
      const val = typeof t.$value === 'object' ? JSON.stringify(t.$value) : String(t.$value);
      const isDup = processed.has(cssVar);
      processed.add(cssVar);
      leaves.push({ path, fullKey, cssVar, type, value: val, duplicate: isDup });
    } else if (value && typeof value === 'object' && !('$value' in value)) {
      processObject(value, fullKey);
    }
  }
}

processObject(comp);

// 3) Missing: in our leaf set but not in CSS.
//    (Duplicates: second+ with same cssVar are skipped by generator, so they never add a NEW line; the cssVar is already in CSS from the first. So "missing" names = cssVars we have in leaves but not in CSS = only when the first/only occurrence was not output, i.e. formatCssValue was ''.)
const byVar = new Map();
for (const L of leaves) {
  if (!byVar.has(L.cssVar)) byVar.set(L.cssVar, []);
  byVar.get(L.cssVar).push(L);
}

const missingFromCss = [...byVar.keys()].filter((v) => !inCss.has(v));
const duplicates = [...byVar.entries()].filter(([, arr]) => arr.length > 1);

console.log('=== COUNTS ===');
console.log('Component variable lines in tokens.css:  ', inCss.size);
console.log('Leaf tokens in componentTokens.json:     ', leaves.length);
console.log('Unique CSS var names (from our walk):    ', byVar.size);
console.log('');

console.log('=== MISSING FROM CSS (unique cssVars with no line in tokens.css) ===');
console.log('Count:', missingFromCss.length);
missingFromCss.forEach((v) => {
  const arr = byVar.get(v);
  arr.forEach((l) => console.log('  ', v, '| path:', l.path, '| type:', l.type, '| value:', (l.value || '').slice(0, 60)));
});
console.log('');

console.log('=== DUPLICATE CSS VAR NAMES (multiple leaves → same --token-component-*) ===');
console.log('Count:', duplicates.length);
duplicates.forEach(([cssVar, arr]) => {
  console.log('  ', cssVar);
  arr.forEach((l) => console.log('      ', l.path));
});
console.log('');

// 4) Summary: 9 fewer = (duplicates: each dup N leaves → 1 line, so (N-1) fewer) + (missing names: formatCssValue empty)
const dupFewer = duplicates.reduce((s, [, a]) => s + (a.length - 1), 0);
console.log('=== EXPLANATION ===');
console.log('Fewer from duplicates (extra leaves sharing a var name):', dupFewer);
console.log('Fewer from missing names (var not in CSS at all):       ', missingFromCss.length);
console.log('Total "missing" lines:                                  ', dupFewer + missingFromCss.length);
