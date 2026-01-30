const https = require('https');

const SUPABASE_URL = 'https://fyygtowenfnzvbblbfsv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWd0b3dlbmZuenZiYmxiZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Nzk5MDAsImV4cCI6MjA3NzU1NTkwMH0.qrOWsKpezUUwPVqGpz4IM63JdjB7o49jqLpY7HIXdX4';

console.log('Testing Supabase Connection...');
console.log(`URL: ${SUPABASE_URL}`);

const options = {
    headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
    }
};

// We will try to fetch the users endpoint or just a basic health check
// Since we don't know any table names, we'll try to just hit the root of authentication endpoint or purely check if we get a 401/403 or 200/404 on a generic endpoint.
// A good test is usually hitting /auth/v1/settings (if accessible) or just inferring from a basic GET.
// Let's try to list users? No, anon key can't do that.
// Let's just try to hit the URL.

const req = https.get(`${SUPABASE_URL}/auth/v1/health`, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response:', data);
        if (res.statusCode === 200) {
            console.log('✅ Connection Successful! The keys are valid and the Supabase instance is reachable.');
        } else {
            console.log('❌ Connection Failed or Restricted.');
        }
    });

}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
