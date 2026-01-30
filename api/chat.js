// Vercel Serverless Function for Groq AI
// Expects POST with JSON: { model, messages, temperature, max_tokens, top_p }

const fetch = require('node-fetch');

// Helper for CORS
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Handle GET request (Health check)
    if (req.method === 'GET') {
        res.status(200).json({ status: 'ok', time: new Date().toISOString() });
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // Check for API key
    if (!process.env.GROQ_API_KEY) {
        res.status(500).json({ error: 'GROQ_API_KEY not configured in Vercel environment variables' });
        return;
    }

    const payload = req.body;

    // Validate payload
    if (!payload || !payload.messages || !Array.isArray(payload.messages)) {
        res.status(400).json({ error: 'Request must include "messages" array' });
        return;
    }

    // Build Groq API URL
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    // Prepare request body for Groq
    const requestBody = {
        model: payload.model || 'llama-3.3-70b-versatile',
        messages: payload.messages,
        temperature: payload.temperature || 0.7,
        max_tokens: payload.max_tokens || 512,
        top_p: payload.top_p || 0.95
    };

    try {
        console.log('Calling Groq API...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', errorText);
            res.status(response.status).json({ error: `Groq API Error: ${response.status}`, details: errorText });
            return;
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (err) {
        console.error('Groq API request failed:', err);
        res.status(500).json({ error: err.message || 'Failed to call Groq API' });
    }
}
