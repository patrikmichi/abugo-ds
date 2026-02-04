#!/usr/bin/env npx ts-node
/**
 * Push tokens to Figma plugin via local bridge
 *
 * Usage:
 *   npx ts-node bridge/push.ts [path/to/tokens.json]
 *   npm run push -- path/to/tokens.json
 *
 * Default: tokens/output/componentTokens.json
 */

import fs from 'fs';
import path from 'path';
import http from 'http';

const BRIDGE_URL = 'http://localhost:3939';

// Get file path from args or use default
const filePath = process.argv[2] || '../tokens/output/componentTokens.json';
const absolutePath = path.resolve(__dirname, '..', filePath);

// Alternative: relative to cwd
const cwdPath = path.resolve(process.cwd(), filePath);
const finalPath = fs.existsSync(absolutePath) ? absolutePath : cwdPath;

if (!fs.existsSync(finalPath)) {
  console.error(`❌ File not found: ${finalPath}`);
  console.error(`   Tried: ${absolutePath}`);
  console.error(`   And:   ${cwdPath}`);
  process.exit(1);
}

console.log(`📁 Reading: ${finalPath}`);

try {
  const content = fs.readFileSync(finalPath, 'utf-8');
  const tokens = JSON.parse(content);

  const data = JSON.stringify(tokens);

  const req = http.request(`${BRIDGE_URL}/tokens`, {
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
        console.log(`✅ Pushed to bridge (${result.queued} in queue)`);
        console.log(`   Open Figma plugin → Export tab to compare`);
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
  console.error(`❌ Error reading file: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
}
