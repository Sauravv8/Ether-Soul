// Netlify Serverless Chat Function for Groq AI
// Expects POST with JSON: { model, messages, temperature, max_tokens, top_p }
// Returns the response from Groq API
// Requires environment variable: GROQ_API_KEY

const fetch = require('node-fetch');

function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
    ...extra
  };
}

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ status: 'ok', time: new Date().toISOString() })
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Check for API key
  if (!process.env.GROQ_API_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'GROQ_API_KEY not configured in Netlify environment variables' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  // Validate payload has messages array
  if (!payload.messages || !Array.isArray(payload.messages)) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Request must include "messages" array' })
    };
  }

  // Build Groq API URL
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  // Prepare request body for Groq (OpenAI-compatible format)
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
      return {
        statusCode: response.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: `Groq API Error: ${response.status}`, details: errorText })
      };
    }

    const data = await response.json();

    // Return the full Groq response
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('Groq API request failed:', err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message || 'Failed to call Groq API' })
    };
  }
};
