import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

const MAPLERAD_SECRET_KEY = (process.env.MAPLERAD_SECRET_KEY || '').replace(/"/g, '').trim();
const MAPLERAD_BASE_URL = 'https://sandbox.api.maplerad.com/v1';

async function test() {
  try {
    console.log('Using Key:', MAPLERAD_SECRET_KEY.substring(0, 8) + '...');
    
    console.log('--- Categories ---');
    const catRes = await axios.get(`${MAPLERAD_BASE_URL}/bills/categories`, {
      headers: { 'Authorization': `Bearer ${MAPLERAD_SECRET_KEY}` }
    });
    console.log(JSON.stringify(catRes.data.data, null, 2));

    const testCats = ['airtime', 'data', 'utility', 'cable'];
    for (const cat of testCats) {
      console.log(`--- Billers for ${cat} ---`);
      try {
        const bRes = await axios.get(`${MAPLERAD_BASE_URL}/bills/billers?category=${cat}&country=NG`, {
          headers: { 'Authorization': `Bearer ${MAPLERAD_SECRET_KEY}` }
        });
        const billers = bRes.data.data || [];
        console.log(`${cat}: found ${billers.length} billers`);
        if (billers.length > 0) {
          console.log(`First biller: ${billers[0].name} (${billers[0].id})`);
        }
      } catch (err) {
        console.log(`Error for ${cat}:`, err.response?.data?.message || err.message);
      }
    }
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
