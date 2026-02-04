#!/usr/bin/env node
/**
 * Move typography, padding, gap, radius, height from component files to shared.
 * Writes: token-component-var-map.json (oldVar -> newVar) for CSS updates.
 * Run: node scripts/move-to-shared-tokens.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMP_DIR = path.join(ROOT, 'tokens', 'system', 'componentTokens', 'components');
const SHARED_DIR = path.join(ROOT, 'tokens', 'system', 'componentTokens', 'shared');
const MAP_PATH = path.join(ROOT, 'token-component-var-map.json');

const MOVABLE = new Set(['fontSizes', 'lineHeights', 'fontWeights', 'spacing', 'borderRadius', 'sizing']);

function toCssVar(segments) {
  const full = segments.join('-');
  const kebab = full.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  return `--token-component-${kebab}`;
}

function deepSet(obj, pathSegs, value) {
  let o = obj;
  for (let i = 0; i < pathSegs.length - 1; i++) {
    const k = pathSegs[i];
    if (!(k in o) || typeof o[k] !== 'object' || o[k] === null || Array.isArray(o[k])) o[k] = {};
    o = o[k];
  }
  o[pathSegs[pathSegs.length - 1]] = value;
}

function deepGet(obj, pathSegs) {
  let o = obj;
  for (const k of pathSegs) {
    if (o == null || typeof o !== 'object') return undefined;
    o = o[k];
  }
  return o;
}

function deletePath(obj, pathSegs) {
  if (pathSegs.length === 0) return;
  const parent = pathSegs.slice(0, -1);
  const key = pathSegs[pathSegs.length - 1];
  let o = obj;
  for (const k of parent) {
    if (o == null || typeof o !== 'object') return;
    o = o[k];
  }
  if (o && key in o) delete o[key];
  // Prune empty parents
  for (let i = parent.length - 1; i >= 0; i--) {
    let p = obj;
    for (let j = 0; j < i; j++) p = p[parent[j]];
    const k = parent[i];
    if (p[k] && typeof p[k] === 'object' && Object.keys(p[k]).filter(x => !x.startsWith('$')).length === 0) delete p[k];
  }
}

function collectLeaves(obj, prefix, out) {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    const v = obj[k];
    const p = prefix.concat(k);
    if (v && typeof v === 'object' && '$value' in v) {
      const t = v.$type;
      if (MOVABLE.has(t)) out.push({ path: p, pathArr: p, token: v, type: t });
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      collectLeaves(v, p, out);
    }
  }
}

function inferShared(comp, pathArr, type) {
  const full = pathArr.join('.');
  if (type === 'fontSizes') return { file: 'fontSize', path: [comp, ...pathArr.filter(x => x !== 'font' && x !== 'size')] };
  if (type === 'lineHeights') return { file: 'lineHeight', path: [comp, ...pathArr.filter(x => x !== 'line' && x !== 'height')] };
  if (type === 'fontWeights') return { file: 'fontWeight', path: [comp, ...pathArr.filter(x => x !== 'font' && x !== 'weight')] };
  if (type === 'borderRadius') return { file: 'radius', path: [comp, ...pathArr.filter(x => x !== 'radius')] };
  if (type === 'sizing') return { file: 'height', path: [comp, ...pathArr] };
  if (type === 'spacing') {
    if (full.includes('padding') || /\.padding$/.test(full)) {
      return { file: 'padding', path: ['block', comp, ...pathArr.filter(x => x !== 'padding')] };
    }
    return { file: 'gap', path: [comp, ...pathArr.filter(x => x !== 'gap')] };
  }
  return null;
}

function run() {
  const map = {};
  const compFiles = fs.readdirSync(COMP_DIR).filter(f => f.endsWith('.json'));
  const shared = {
    fontSize: {},
    lineHeight: {},
    fontWeight: {},
    gap: {},
    padding: {},
    radius: {},
    height: {},
  };

  for (const f of compFiles) {
    const comp = f.replace(/\.json$/, '');
    const p = path.join(COMP_DIR, f);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const leaves = [];
    collectLeaves(data, [], leaves);

    for (const { pathArr, token, type } of leaves) {
      const info = inferShared(comp, pathArr, type);
      if (!info) continue;
      const sh = shared[info.file];
      if (!sh) continue;

      const oldSegs = [comp, ...pathArr];
      const newSegs = info.path.length ? info.path : [comp, ...pathArr];

      // Avoid moving if it would overwrite with different structure (e.g. height.button already has button.sm as child)
      const existing = deepGet(sh, newSegs);
      if (existing && typeof existing === 'object' && !('$value' in existing)) continue; // would mix token with group

      const clone = { ...token };
      delete clone.$description;
      if (!clone.$description && token.$description) clone.$description = token.$description;

      deepSet(sh, newSegs, clone);
      deletePath(data, pathArr);

      const oldVar = toCssVar(oldSegs);
      const newVar = toCssVar([info.file === 'fontSize' ? 'fontSize' : info.file === 'lineHeight' ? 'lineHeight' : info.file === 'fontWeight' ? 'fontWeight' : info.file, ...newSegs]);
      map[oldVar] = newVar;
    }

    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  }

  // Merge into existing shared files (deep merge)
  const f2p = { fontSize: 'fontSize.json', lineHeight: 'lineHeight.json', fontWeight: 'fontWeight.json', gap: 'gap.json', padding: 'padding.json', radius: 'radius.json', height: 'height.json' };
  for (const [prop, file] of Object.entries(f2p)) {
    const fp = path.join(SHARED_DIR, file);
    let current = {};
    if (fs.existsSync(fp)) current = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const add = shared[prop];
    for (const k of Object.keys(add)) {
      if (k.startsWith('$')) continue;
      if (!(k in current)) current[k] = add[k];
      else {
        mergeDeep(current[k], add[k]);
      }
    }
    fs.writeFileSync(fp, JSON.stringify(current, null, 2), 'utf8');
  }

  fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2), 'utf8');
  console.log('Moved tokens. Var map written to', MAP_PATH, 'Total:', Object.keys(map).length);
}

function mergeDeep(t, s) {
  if (s == null) return;
  for (const k of Object.keys(s)) {
    if (k.startsWith('$')) continue;
    if (t[k] && typeof t[k] === 'object' && !('$value' in t[k]) && s[k] && typeof s[k] === 'object' && !('$value' in s[k])) mergeDeep(t[k], s[k]);
    else if (s[k] && typeof s[k] === 'object' && '$value' in s[k]) t[k] = s[k];
  }
}

run();
