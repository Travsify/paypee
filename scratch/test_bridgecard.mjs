import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './server/.env' });

const BRIDGECARD_BASE_URL = process.env.BRIDGECARD_ENV === 'live' 
  ? 'https://issuecards.api.bridgecard.co/v1/issuing' 
  : 'https://issuecards.api.bridgecard.co/v1/issuing/sandbox';

const BRIDGECARD_AUTH_TOKEN = (process.env.BRIDGECARD_AUTH_TOKEN || '').trim();
const BRIDGECARD_ISSUING_ID = (process.env.BRIDGECARD_ISSUING_ID || '').trim();
const BRIDGECARD_SECRET_KEY = (process.env.BRIDGECARD_SECRET_KEY || '').trim();

const client = axios.create({
  baseURL: BRIDGECARD_BASE_URL,
  headers: {
    'token': `Bearer ${BRIDGECARD_AUTH_TOKEN}`,
    'secret-key': BRIDGECARD_SECRET_KEY,
    'issuing-id': BRIDGECARD_ISSUING_ID,
    'Content-Type': 'application/json'
  }
});

async function testRegistration() {
  const payload = {
    first_name: 'Test',
    last_name: 'User',
    email_address: `test_${Date.now()}@paypee.co`,
    phone: '+2348000000000',
    address: {
      address: '9 Jibowu Street',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      postal_code: '100001',
      house_no: '1'
    },
    identity: {
      id_type: 'BVN', // Trying BVN instead of NIGERIAN_BVN_VERIFICATION
      bvn: '22222222222', // Dummy BVN for testing (will likely fail with specific error)
      selfie_image: ''
    }
  };

  try {
    console.log('Testing Bridgecard Registration with id_type: BVN...');
    const res = await client.post('/cardholder/register_cardholder_synchronously', payload);
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Failed (BVN):', err.response?.data || err.message);
    
    // Try with the other id_type
    try {
      console.log('\nTesting with id_type: NIGERIAN_BVN_VERIFICATION...');
      payload.identity.id_type = 'NIGERIAN_BVN_VERIFICATION';
      const res2 = await client.post('/cardholder/register_cardholder_synchronously', payload);
      console.log('Success (NIGERIAN_BVN_VERIFICATION):', res2.data);
    } catch (err2) {
      console.log('Failed (NIGERIAN_BVN_VERIFICATION):', err2.response?.data || err2.message);
    }
  }
}

testRegistration();
