// Direct Maplerad API test — bypass our server entirely
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const KEY = (process.env.MAPLERAD_SECRET_KEY || '').replace(/"/g, '').trim();
const ENV = process.env.MAPLERAD_ENV || 'sandbox';
const BASE = ENV === 'live' ? 'https://api.maplerad.com/v1' : 'https://sandbox.api.maplerad.com/v1';

console.log(`Maplerad Env: ${ENV}`);
console.log(`Base URL: ${BASE}`);
console.log(`Key: ${KEY.substring(0, 12)}...`);

const headers = {
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json'
};

async function testEndpoint(label, url) {
  try {
    const res = await fetch(url, { headers });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = text; }
    
    if (res.ok) {
      const items = data?.data;
      if (Array.isArray(items)) {
        console.log(`✅ ${label}: ${items.length} results ${items.length > 0 ? '→ ' + JSON.stringify(items[0]).substring(0, 120) : ''}`);
      } else {
        console.log(`✅ ${label}: ${JSON.stringify(data).substring(0, 200)}`);
      }
    } else {
      console.log(`❌ ${label}: HTTP ${res.status} — ${JSON.stringify(data).substring(0, 200)}`);
    }
  } catch (e) {
    console.log(`❌ ${label}: NETWORK ERROR — ${e.message}`);
  }
}

async function run() {
  console.log('\n=== Testing Different Endpoint Formats ===\n');
  
  // Format A: /bills/airtime/billers/NG (what we're using now)
  await testEndpoint('GET /bills/airtime/billers/NG', `${BASE}/bills/airtime/billers/NG`);
  
  // Format B: /bills/billers?category=airtime&country=NG (old format)
  await testEndpoint('GET /bills/billers?category=airtime', `${BASE}/bills/billers?category=airtime&country=NG`);
  
  // Format C: /bills/airtime/billers (no country)
  await testEndpoint('GET /bills/airtime/billers', `${BASE}/bills/airtime/billers`);
  
  // Format D: Maplerad SDK style — /bills/airtime (just the base path)
  await testEndpoint('GET /bills/airtime', `${BASE}/bills/airtime`);
  
  // Format E: /bills/categories
  await testEndpoint('GET /bills/categories', `${BASE}/bills/categories`);
  
  // Format F: /bills (root)
  await testEndpoint('GET /bills', `${BASE}/bills`);

  console.log('\n=== Testing Other Categories ===\n');
  
  const formats = [
    // Try each category with /billers/NG
    '/bills/data/billers/NG',
    '/bills/electricity/billers/NG',
    '/bills/cabletv/billers/NG',
    '/bills/internet/billers/NG',
    '/bills/betting/billers/NG',
    // Try alternative naming
    '/bills/utility/billers/NG',
    '/bills/cable/billers/NG',
    '/bills/power/billers/NG',
    '/bills/tv/billers/NG',
  ];
  
  for (const fmt of formats) {
    await testEndpoint(`GET ${fmt}`, `${BASE}${fmt}`);
  }
}

run();
