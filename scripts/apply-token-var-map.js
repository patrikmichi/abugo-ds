#!/usr/bin/env node
/**
 * Replace old --token-component-* with new names from token-component-var-map.json.
 * Run: node scripts/apply-token-var-map.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAP_PATH = path.join(ROOT, 'token-component-var-map.json');
const DIRS = ['components', 'styles'];

const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') walk(p, cb);
    else if (e.isFile() && /\.(css|ts|tsx)$/.test(e.name)) cb(p);
  }
}

let total = 0;
for (const d of DIRS) {
  const dir = path.join(ROOT, d);
  walk(dir, (file) => {
    let s = fs.readFileSync(file, 'utf8');
    let n = 0;
    for (const [oldVar, newVar] of Object.entries(map)) {
      const re = new RegExp(oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const c = (s.match(re) || []).length;
      if (c) {
        s = s.replace(re, newVar);
        n += c;
      }
    }
    if (n) {
      fs.writeFileSync(file, s, 'utf8');
      total += n;
    }
  });
}
console.log('Replaced', total, 'occurrences.');
