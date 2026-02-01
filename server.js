// Local development server for Ether Soul
// Run with: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables from .env
require('dotenv').config ? require('dotenv').config() : (() => {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length) {
                process.env[key.trim()] = values.join('=').trim();
            }
        });
    }
})();

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

async function handleApiChat(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const payload = JSON.parse(body);

            if (!process.env.GROQ_API_KEY) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'GROQ_API_KEY not configured in .env file' }));
                return;
            }

            const requestBody = {
                model: payload.model || 'llama-3.3-70b-versatile',
                messages: payload.messages,
                temperature: payload.temperature || 0.7,
                max_tokens: payload.max_tokens || 512,
                top_p: payload.top_p || 0.95
            };

            console.log('Calling Groq API...');
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            res.writeHead(response.status, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(data));

        } catch (err) {
            console.error('API Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoint
    if (req.url === '/api/chat' && req.method === 'POST') {
        handleApiChat(req, res);
        return;
    }

    // Health check
    if (req.url === '/api/chat' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
        return;
    }

    // Static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            // Add no-cache headers for HTML files to prevent stale content
            const headers = { 'Content-Type': contentType };
            if (ext === '.html') {
                headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                headers['Pragma'] = 'no-cache';
                headers['Expires'] = '0';
            }
            res.writeHead(200, headers);
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🌟 Ether Soul Development Server                   ║
║                                                       ║
║   Local:    http://localhost:${PORT}                    ║
║                                                       ║
║   Press Ctrl+C to stop                               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`);
});
