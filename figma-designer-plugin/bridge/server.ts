/**
 * Local Bridge Server
 *
 * Simple HTTP server that acts as a bridge between IDE/CLI and Figma plugin.
 * - POST /tokens - Push token data from IDE
 * - GET /tokens - Plugin polls to receive data
 * - POST /clear - Clear the queue
 *
 * Usage: npx ts-node bridge/server.ts
 * Or:    node bridge/server.js
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3939;

interface QueueItem {
  type: 'COMPARE_TOKENS' | 'SYNC_TOKENS' | 'PUSH_COMPONENT';
  data: any;
  timestamp: number;
}

// In-memory queue for messages
let messageQueue: QueueItem[] = [];

const server = http.createServer((req, res) => {
  // CORS headers for Figma plugin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // POST /tokens - Push tokens from IDE/CLI
  if (req.method === 'POST' && url.pathname === '/tokens') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        messageQueue.push({
          type: 'COMPARE_TOKENS',
          data,
          timestamp: Date.now(),
        });
        console.log(`[${new Date().toISOString()}] Received tokens (${Object.keys(data).length} keys)`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, queued: messageQueue.length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // POST /component - Push a component Design JSON
  if (req.method === 'POST' && url.pathname === '/component') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Validate it's a Design JSON
        if (!data.meta?.name || !data.componentSet) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Design JSON: missing meta.name or componentSet' }));
          return;
        }

        messageQueue.push({
          type: 'PUSH_COMPONENT',
          data,
          timestamp: Date.now(),
        });
        console.log(`[${new Date().toISOString()}] Received component: ${data.meta.name}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          component: data.meta.name,
          variants: data.componentSet.variants?.length || 0,
          queued: messageQueue.length
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // POST /component-file - Push component from a file path
  if (req.method === 'POST' && url.pathname === '/component-file') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { filePath } = JSON.parse(body);
        const absolutePath = path.resolve(filePath);

        if (!fs.existsSync(absolutePath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `File not found: ${absolutePath}` }));
          return;
        }

        const content = fs.readFileSync(absolutePath, 'utf-8');
        const data = JSON.parse(content);

        if (!data.meta?.name || !data.componentSet) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Design JSON: missing meta.name or componentSet' }));
          return;
        }

        messageQueue.push({
          type: 'PUSH_COMPONENT',
          data,
          timestamp: Date.now(),
        });

        console.log(`[${new Date().toISOString()}] Loaded component from: ${absolutePath}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          file: absolutePath,
          component: data.meta.name,
          variants: data.componentSet.variants?.length || 0,
          queued: messageQueue.length
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'Error reading file' }));
      }
    });
    return;
  }

  // POST /file - Push tokens from a file path
  if (req.method === 'POST' && url.pathname === '/file') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { filePath } = JSON.parse(body);
        const absolutePath = path.resolve(filePath);

        if (!fs.existsSync(absolutePath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `File not found: ${absolutePath}` }));
          return;
        }

        const content = fs.readFileSync(absolutePath, 'utf-8');
        const data = JSON.parse(content);

        messageQueue.push({
          type: 'COMPARE_TOKENS',
          data,
          timestamp: Date.now(),
        });

        console.log(`[${new Date().toISOString()}] Loaded tokens from: ${absolutePath}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, file: absolutePath, queued: messageQueue.length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'Error reading file' }));
      }
    });
    return;
  }

  // GET /tokens - Plugin polls for data
  if (req.method === 'GET' && url.pathname === '/tokens') {
    if (messageQueue.length > 0) {
      const item = messageQueue.shift()!;
      console.log(`[${new Date().toISOString()}] Plugin fetched message (${messageQueue.length} remaining)`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(item));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ type: 'EMPTY' }));
    }
    return;
  }

  // POST /clear - Clear the queue
  if (req.method === 'POST' && url.pathname === '/clear') {
    const count = messageQueue.length;
    messageQueue = [];
    console.log(`[${new Date().toISOString()}] Cleared ${count} messages`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, cleared: count }));
    return;
  }

  // GET /status - Check bridge status
  if (req.method === 'GET' && url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'running',
      queued: messageQueue.length,
      uptime: process.uptime(),
    }));
    return;
  }

  // Default: 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║               Figma Designer Bridge Server                     ║
╠═══════════════════════════════════════════════════════════════╣
║  Running on http://localhost:${PORT}                             ║
╠═══════════════════════════════════════════════════════════════╣
║  Token Endpoints:                                              ║
║    POST /tokens         - Push token JSON                      ║
║    POST /file           - Push tokens from file                ║
║                                                                ║
║  Component Endpoints:                                          ║
║    POST /component      - Push component Design JSON           ║
║    POST /component-file - Push component from file             ║
║                                                                ║
║  General:                                                      ║
║    GET  /tokens         - Plugin polls for data                ║
║    GET  /status         - Check bridge status                  ║
║    POST /clear          - Clear message queue                  ║
╠═══════════════════════════════════════════════════════════════╣
║  Examples:                                                     ║
║    npm run push -- tokens/componentTokens.json                 ║
║    npm run push:component -- button.design.json                ║
╚═══════════════════════════════════════════════════════════════╝
`);
});
