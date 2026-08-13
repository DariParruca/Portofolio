import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the server entry
const { default: server } = await import('./dist/server/server.js');

const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname, 'dist/client');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
};

const httpServer = http.createServer(async (req, res) => {
  try {
    // Try to serve static files first
    const urlPath = req.url.split('?')[0]; // Remove query params
    const filePath = path.join(STATIC_DIR, urlPath);
    
    // Prevent directory traversal
    if (filePath.startsWith(STATIC_DIR) && fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': (ext === '.js' || ext === '.css') ? 'public, max-age=31536000' : 'no-cache',
        });
        res.end(fs.readFileSync(filePath));
        return;
      }
    }

    // Fall back to SSR
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });
    }

    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: body,
    });

    const response = await server.fetch(request, {}, {});
    
    const headers = Object.fromEntries(response.headers);
    res.writeHead(response.status, headers);
    
    if (response.body) {
      res.end(await response.text());
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html>
<html>
<head><title>Error</title></head>
<body>
<h1>500 - Internal Server Error</h1>
<p>${error.message}</p>
<pre>${error.stack}</pre>
</body>
</html>`);
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
