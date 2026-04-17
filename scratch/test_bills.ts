import * as Maplerad from '../server/services/maplerad';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    console.log('--- Categories ---');
    const cats = await Maplerad.getBillCategories();
    console.log(JSON.stringify(cats, null, 2));

    const testCats = ['airtime', 'data', 'utility', 'cable'];
    for (const cat of testCats) {
      console.log(`--- Billers for ${cat} ---`);
      const billers = await Maplerad.getBillers(cat);
      console.log(`${cat}: found ${billers.length} billers`);
      if (billers.length > 0) {
        console.log(`First biller: ${billers[0].name} (${billers[0].id})`);
      }
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

test();
