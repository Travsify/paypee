import { getBillCategories, getBillers } from '../server/services/maplerad.ts';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

async function check() {
  try {
    const categories = await getBillCategories();
    console.log('Categories:', JSON.stringify(categories, null, 2));
    
    if (categories && categories.length > 0) {
      const firstCat = categories[0].id || categories[0].name.toLowerCase();
      console.log(`Checking billers for: ${firstCat}`);
      const billers = await getBillers(firstCat);
      console.log(`Billers for ${firstCat}:`, JSON.stringify(billers.slice(0, 2), null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
