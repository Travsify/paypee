import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MAPLERAD_BASE_URL = 'https://api.maplerad.com/v1';
const MAPLERAD_SECRET_KEY = (process.env.MAPLERAD_SECRET_KEY || '').replace(/"/g, '').trim();

// 🛡️ PROXY CONFIGURATION
const PROXY_URL = process.env.MAPLERAD_PROXY_URL || process.env.FINCRA_PROXY_URL;
const proxyAgent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

console.log(`Using Proxy: ${PROXY_URL ? 'YES' : 'NO'}`);

const mapleradClient = axios.create({
  baseURL: MAPLERAD_BASE_URL,
  headers: {
    'Authorization': `Bearer ${MAPLERAD_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  httpsAgent: proxyAgent,
  proxy: false // Disable axios internal proxy logic to use the agent
});

async function run() {
  console.log('\n=== Testing Maplerad Billers (Direct with Proxy) ===\n');
  
  const categories = ['airtime', 'data', 'electricity', 'cabletv', 'internet', 'betting'];
  
  for (const cat of categories) {
    console.log(`\nFetching ${cat} with proxy...`);
    try {
      const response = await mapleradClient.get(`/bills/${cat}/billers/NG`);
      const billers = response.data.data || [];
      if (Array.isArray(billers)) {
        console.log(`✅ ${cat}: ${billers.length} results`);
        if (billers.length > 0) {
            console.log(`   First item:`, JSON.stringify(billers[0]).substring(0, 150));
        }
      } else {
        console.log(`✅ ${cat} (Not array):`, JSON.stringify(billers).substring(0, 200));
      }
    } catch (e) {
      console.log(`❌ ${cat}: ERROR — ${e.response?.data?.message || e.message}`);
    }
  }
}

run();
