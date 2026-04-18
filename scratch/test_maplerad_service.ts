import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

import { getBillers } from '../server/services/maplerad.ts';

async function run() {
  console.log('\n=== Testing Maplerad Billers (via actual service) ===\n');
  
  const categories = ['airtime', 'data', 'electricity', 'cabletv', 'internet', 'betting'];
  
  for (const cat of categories) {
    console.log(`\nFetching ${cat}...`);
    try {
      const billers = await getBillers(cat);
      if (Array.isArray(billers)) {
        console.log(`✅ ${cat}: ${billers.length} results`);
        if (billers.length > 0) {
            console.log(`   First item:`, JSON.stringify(billers[0]).substring(0, 150));
        }
      } else {
        console.log(`✅ ${cat} (Not array):`, JSON.stringify(billers).substring(0, 200));
      }
    } catch (e) {
      console.log(`❌ ${cat}: ERROR — ${e.message}`);
    }
  }
}

run();
