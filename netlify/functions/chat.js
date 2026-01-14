// Netlify Serverless Chat Function for Google Gemini AI
// Expects POST with JSON: { contents: [...], generationConfig?: {...} }
// Returns the response from Gemini API
// Requires environment variable: GEMINI_API_KEY

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
  if (!process.env.GEMINI_API_KEY) {
    return { 
      statusCode: 500, 
      headers: corsHeaders(), 
      body: JSON.stringify({ error: 'GEMINI_API_KEY not configured in Netlify environment variables' }) 
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  // Validate payload has contents array
  if (!payload.contents || !Array.isArray(payload.contents)) {
    return { 
      statusCode: 400, 
      headers: corsHeaders(), 
      body: JSON.stringify({ error: 'Request must include "contents" array' }) 
    };
  }

  // Build Gemini API URL - use gemini-2.5-flash (verified working model)
  const model = payload.model || 'gemini-2.5-flash';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  // Prepare request body for Gemini
  const requestBody = {
    contents: payload.contents,
    generationConfig: payload.generationConfig || {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  try {
    console.log('Calling Gemini API...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return {
        statusCode: response.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: `Gemini API Error: ${response.status}`, details: errorText })
      };
    }

    const data = await response.json();
    
    // Return the full Gemini response
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('Gemini API request failed:', err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message || 'Failed to call Gemini API' })
    };
  }
};
