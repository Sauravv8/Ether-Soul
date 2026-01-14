const fetch = require('node-fetch');

async function testChat() {
    try {
        console.log("Testing chat function...");
        const response = await fetch('http://localhost:8888/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }],
                model: 'llama-3.3-70b-versatile'
            })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);

    } catch (e) {
        console.error('Error:', e);
    }
}

testChat();
