const https = require('https');
const dns = require('dns');

const hostname = 'fyygtowenfnzvbblbfsv.supabase.co';
const path = '/auth/v1/health';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWd0b3dlbmZuenZiYmxiZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Nzk5MDAsImV4cCI6MjA3NzU1NTkwMH0.qrOWsKpezUUwPVqGpz4IM63JdjB7o49jqLpY7HIXdX4';

console.log(`Resolving ${hostname}...`);

// Manually resolve using a specific logic? 
// Node's dns.lookup uses the OS resolver. 
// We can try to force an IP if we know it, but Cloudflare IPs (which Supabase uses) require the Host header to be correct.

const knownIP = '104.18.38.10'; // Taken from the nslookup 8.8.8.8 result

console.log(`Attempting to connect via IP: ${knownIP}`);

const options = {
    hostname: knownIP,
    port: 443,
    path: path,
    method: 'GET',
    headers: {
        'Host': hostname, // CRITICAL: This tells the server which site we want
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'User-Agent': 'Node.js/Test'
    },
    servername: hostname // CRITICAL: For SNI (SSL Handshake)
};

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (d) => { data += d; });
    res.on('end', () => {
        console.log('Response:', data);
        if (res.statusCode < 400) {
            console.log('\n✅ SUCCESS! We connected by bypassing the local DNS.');
            console.log('This confirms your URL is correct, but your computer\'s DNS is refusing to find it.');
        }
    });
});

req.on('error', (e) => {
    console.error('Connection error:', e);
});

req.end();
