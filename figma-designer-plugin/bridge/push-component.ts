#!/usr/bin/env npx ts-node
/**
 * Push component Design JSON to Figma plugin via local bridge
 *
 * Usage:
 *   npx ts-node bridge/push-component.ts [path/to/component.design.json]
 *   npm run push:component -- path/to/component.design.json
 */

import fs from 'fs';
import path from 'path';
import http from 'http';

const BRIDGE_URL = 'http://localhost:3939';

// Get file path from args
const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Please provide a path to a .design.json file');
  console.error('   Usage: npm run push:component -- path/to/component.design.json');
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(absolutePath)) {
  console.error(`❌ File not found: ${absolutePath}`);
  process.exit(1);
}

console.log(`📁 Reading: ${absolutePath}`);

try {
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const designJson = JSON.parse(content);

  // Validate
  if (!designJson.meta?.name) {
    console.error('❌ Invalid Design JSON: missing meta.name');
    process.exit(1);
  }
  if (!designJson.componentSet) {
    console.error('❌ Invalid Design JSON: missing componentSet');
    process.exit(1);
  }

  const data = JSON.stringify(designJson);

  const req = http.request(`${BRIDGE_URL}/component`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        const result = JSON.parse(body);
        console.log(`✅ Pushed component: ${result.component}`);
        console.log(`   Variants: ${result.variants}`);
        console.log(`   Queue: ${result.queued} item(s)`);
        console.log(`\n   Open Figma plugin to preview and insert`);
      } else {
        console.error(`❌ Error: ${body}`);
      }
    });
  });

  req.on('error', (e) => {
    if ((e as any).code === 'ECONNREFUSED') {
      console.error('❌ Bridge server not running!');
      console.error('   Start it with: npm run bridge');
    } else {
      console.error(`❌ Error: ${e.message}`);
    }
  });

  req.write(data);
  req.end();
} catch (e) {
  console.error(`❌ Error: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
}
