#!/usr/bin/env node
/**
 * Fix component tokens: replace primitive refs with semantic, add $description when missing.
 * Run: node scripts/fix-component-token-refs.js
 * Then: npm run build:tokens && npm run build:css-variables
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMP = path.join(ROOT, 'tokens', 'system', 'componentTokens', 'components');

// Primitive $value → semantic $value; set $collectionName to semanticTokens when replacing.
const PRIMITIVE_TO_SEMANTIC = {
  '{typography.fontSize.1}': '{typography.body.size.xs}',
  '{typography.fontSize.2}': '{typography.body.size.sm}',
  '{typography.fontSize.3}': '{typography.body.size.md}',
  '{typography.fontSize.4}': '{typography.body.size.lg}',
  '{typography.fontSize.sm}': '{typography.body.size.sm}',
  '{typography.fontSize.md}': '{typography.body.size.md}',
  '{typography.fontSize.xs}': '{typography.body.size.xs}',
  '{typography.lineHeight.6}': '{typography.body.line.compact}',
  '{typography.lineHeight.12}': '{typography.body.line.tight}',
  '{typography.lineHeight.14}': '{typography.body.line.relaxed}',
  '{typography.lineHeight.16}': '{typography.body.line.loose}',
  '{typography.lineHeight.md}': '{typography.body.line.md}',
  '{typography.fontWeight.regular}': '{typography.body.weight.normal}',
  '{typography.fontWeight.medium}': '{typography.body.weight.md}',
  '{typography.body-size.xs}': '{typography.body.size.xs}',
  '{typography.body-size.sm}': '{typography.body.size.sm}',
  '{typography.body-size.md}': '{typography.body.size.md}',
  '{typography.body-size.lg}': '{typography.body.size.lg}',
  '{typography.body-line.sm}': '{typography.body.line.sm}',
  '{typography.body-line.md}': '{typography.body.line.md}',
  '{border-width-1}': '{border.width.thin}',
  '{border-width-2}': '{border.width.thicker}',
  '{radius-1}': '{radius.xs}',
  '{size-1}': '{control.height.xxxs}',
  '{size-2}': '{control.height.xxs}',
};

function isTokenLeaf(o) {
  return o && typeof o === 'object' && '$type' in o && !Array.isArray(o);
}

function visit(obj, fn) {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    const v = obj[k];
    if (isTokenLeaf(v)) {
      fn(v, k, obj);
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      visit(v, fn);
    }
  }
}

function run() {
  const files = fs.readdirSync(COMP).filter((f) => f.endsWith('.json'));
  let up = 0;
  let desc = 0;
  for (const f of files) {
    const filePath = path.join(COMP, f);
    let raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    visit(data, (t) => {
      const val = t.$value;
      if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
        const sem = PRIMITIVE_TO_SEMANTIC[val];
        if (sem) {
          t.$value = sem;
          if (t.$collectionName === 'primitives') t.$collectionName = 'semanticTokens';
          up++;
        }
      }
      if (!t.$description && t.$type) {
        t.$description = `Component token (${t.$type}).`;
        desc++;
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
  console.log('Updated', up, 'primitive refs to semantic; added', desc, '$description.');
}

run();
