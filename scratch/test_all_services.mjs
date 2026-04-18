// Quick test with multiple credential combos
const BASE = 'https://paypee-api-kmhv.onrender.com';

const creds = [
  { email: 'test@paypee.com', password: 'test1234' },
  { email: 'test@paypee.com', password: 'Test1234' },
  { email: 'test@paypee.com', password: 'password123' },
  { email: 'patrickmoneygmail.com', password: 'test1234' }, // user's potential test
];

async function tryLogin() {
  // Just register a fresh test user
  console.log('Creating fresh test user...');
  const email = `apitest_${Date.now()}@paypee.com`;
  const password = 'TestPass123!';
  
  const regRes = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: 'INDIVIDUAL', firstName: 'API', lastName: 'Tester' })
  });
  const regData = await regRes.json();
  
  if (!regRes.ok) {
    console.log('❌ Registration failed:', regData);
    return;
  }
  
  console.log('✅ Registered:', email);
  const token = regData.token;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Test Profile
  console.log('\n=== PROFILE ===');
  const profileRes = await fetch(`${BASE}/api/users/me`, { headers });
  const profile = await profileRes.json();
  console.log(`User: ${profile.firstName} ${profile.lastName}`);
  console.log(`Wallets: ${(profile.wallets || []).length}`);

  // Test Transactions
  console.log('\n=== TRANSACTIONS ===');
  const txRes = await fetch(`${BASE}/api/transactions`, { headers });
  const tx = await txRes.json();
  console.log(`Transactions: ${tx.length}`);

  // Test Cards
  console.log('\n=== CARDS ===');
  const cardRes = await fetch(`${BASE}/api/cards`, { headers });
  const cards = await cardRes.json();
  console.log(`Cards: ${Array.isArray(cards) ? cards.length : 'error'}`);

  // Test Banks
  console.log('\n=== BANKS ===');
  const bankRes = await fetch(`${BASE}/api/payouts/banks?currency=NGN`, { headers });
  const banks = await bankRes.json();
  console.log(`Banks: ${Array.isArray(banks) ? banks.length : JSON.stringify(banks).substring(0,100)}`);

  // Test ALL Bill Categories
  console.log('\n=== BILLS ===');
  const cats = ['airtime', 'data', 'electricity', 'cable', 'internet', 'betting'];
  for (const cat of cats) {
    const res = await fetch(`${BASE}/api/bills/providers?category=${cat}`, { headers });
    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); } catch(e) { data = raw; }
    
    if (Array.isArray(data)) {
      console.log(`  ${cat.padEnd(12)}: ✅ ${data.length} providers ${data.length > 0 ? '→ ' + (data[0].name || data[0].identifier || JSON.stringify(data[0]).substring(0,80)) : ''}`);
    } else {
      console.log(`  ${cat.padEnd(12)}: ❌ ${typeof data === 'string' ? data.substring(0,100) : JSON.stringify(data).substring(0,100)}`);
    }
  }

  // Test Vaults
  console.log('\n=== VAULTS ===');
  const vaultRes = await fetch(`${BASE}/api/vaults`, { headers });
  const vaults = await vaultRes.json();
  console.log(`Vaults: ${Array.isArray(vaults) ? vaults.length : JSON.stringify(vaults).substring(0,100)}`);

  // Test Payment Links
  console.log('\n=== PAYMENT LINKS ===');
  const linkRes = await fetch(`${BASE}/api/payment-links`, { headers });
  const links = await linkRes.json();
  console.log(`Links: ${Array.isArray(links) ? links.length : JSON.stringify(links).substring(0,100)}`);

  // Test API Keys
  console.log('\n=== API KEYS ===');
  const keyRes = await fetch(`${BASE}/api/keys`, { headers });
  const keys = await keyRes.json();
  console.log(`Keys: ${Array.isArray(keys) ? keys.length : JSON.stringify(keys).substring(0,100)}`);

  console.log('\n✅ ALL TESTS COMPLETE');
}

tryLogin();
