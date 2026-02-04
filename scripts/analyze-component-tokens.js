#!/usr/bin/env node
/**
 * Analyze component tokens: count, find duplicate CSS variable names, same-value groups.
 * Run: node scripts/analyze-component-tokens.js
 */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'tokens', 'output', 'componentTokens.json');
const data = JSON.parse(fs.readFileSync(OUT, 'utf8'));

function toCssVar(fullKey) {
  const kebab = String(fullKey)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toLowerCase();
  return `--token-component-${kebab}`;
}

const leaves = [];       // { path, pathArr, fullKey, cssVar, type, value }
const byCssVar = new Map(); // cssVar -> [pathArr, ...]
const byValue = new Map();  // stringified $value -> [pathArr, ...]

function walk(obj, pathArr = [], fullKey = '') {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    const v = obj[k];
    const p = pathArr.concat(k);
    const fk = fullKey ? `${fullKey}-${k}` : k;
    if (v && typeof v === 'object' && '$value' in v) {
      const type = v.$type || '(none)';
      const val = typeof v.$value === 'object' ? JSON.stringify(v.$value) : String(v.$value);
      const cssVar = toCssVar(fk);
      leaves.push({ pathArr: p, path: p.join('.'), fullKey: fk, cssVar, type, value: val });
      if (!byCssVar.has(cssVar)) byCssVar.set(cssVar, []);
      byCssVar.get(cssVar).push(p.join('.'));
      const vk = val;
      if (!byValue.has(vk)) byValue.set(vk, []);
      byValue.get(vk).push(p.join('.'));
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      walk(v, p, fk);
    }
  }
}

walk(data);

// Duplicate CSS vars (multiple token paths → same --token-component-*)
const duplicateCss = [...byCssVar.entries()].filter(([, paths]) => paths.length > 1);

// Same $value used in many places (candidates for consolidation, not necessarily bad)
const sameValue = [...byValue.entries()].filter(([, paths]) => paths.length > 1);

console.log('=== COMPONENT TOKEN COUNTS ===');
console.log('Total leaf tokens (with $value):', leaves.length);
console.log('Unique CSS variable names:      ', byCssVar.size);
console.log('');

if (duplicateCss.length) {
  console.log('=== DUPLICATE CSS VARIABLE NAMES (collisions) ===');
  console.log('Count:', duplicateCss.length, 'css vars with 2+ token paths\n');
  duplicateCss.forEach(([cssVar, paths]) => {
    console.log(cssVar);
    paths.forEach((p) => console.log('  -', p));
    console.log('');
  });
} else {
  console.log('=== DUPLICATE CSS VARIABLE NAMES ===');
  console.log('None. Each token path maps to a unique --token-component-* name.\n');
}

console.log('=== SAME $value REUSED (top 20 by frequency) ===');
const byFreq = sameValue
  .map(([v, paths]) => [v, paths.length, paths])
  .sort((a, b) => b[1] - a[1]);
byFreq.slice(0, 20).forEach(([val, n, paths]) => {
  const v = val.length > 60 ? val.slice(0, 57) + '...' : val;
  console.log(`[${n}x] ${v}`);
  paths.slice(0, 5).forEach((p) => console.log('    ', p));
  if (paths.length > 5) console.log('    ', `... +${paths.length - 5} more`);
  console.log('');
});

console.log('=== BY $type ===');
const byType = new Map();
leaves.forEach(({ type }) => byType.set(type, (byType.get(type) || 0) + 1));
[...byType.entries()].sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`  ${t}: ${n}`));

console.log('');
console.log('=== BY TOP-LEVEL KEY (shared vs component) ===');
const byRoot = new Map();
leaves.forEach(({ pathArr }) => {
  const r = pathArr[0] || '?';
  byRoot.set(r, (byRoot.get(r) || 0) + 1);
});
[...byRoot.entries()].sort((a, b) => b[1] - a[1]).forEach(([r, n]) => console.log(`  ${r}: ${n}`));
