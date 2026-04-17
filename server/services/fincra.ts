import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import dotenv from 'dotenv';
dotenv.config();

const FINCRA_BASE_URL = process.env.FINCRA_ENV === 'live' 
  ? 'https://api.fincra.com/core' 
  : 'https://sandboxapi.fincra.com/core';

const FINCRA_SECRET_KEY = (process.env.FINCRA_SECRET_KEY || '').replace(/"/g, '');
const FINCRA_BUSINESS_ID = (process.env.FINCRA_BUSINESS_ID || '').replace(/"/g, '') || 
                           (process.env.FINCRA_PUB_KEY ? Buffer.from(process.env.FINCRA_PUB_KEY.split('_')[1] || '', 'base64').toString().split(':')[0] : '');

// 🛡️ PROXY CONFIGURATION
// Use this to route Fincra requests through a whitelisted VPS IP
const PROXY_URL = process.env.FINCRA_PROXY_URL; // e.g. http://74.220.48.248:3128
const proxyAgent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

const fincraClient = axios.create({
  headers: {
    'api-key': FINCRA_SECRET_KEY,
    'Content-Type': 'application/json'
  },
  httpsAgent: proxyAgent,
  proxy: false // Disable axios internal proxy logic to use the agent
});

/**
 * Creates a Virtual Account (IBAN/NUBAN) via Fincra
 */
export const issueVirtualAccount = async (businessName: string, currency: string, bvn?: string) => {
  try {
    const endpoint = process.env.FINCRA_ENV === 'live'
       ? 'https://api.fincra.com/profile/virtual-accounts/requests'
       : 'https://sandboxapi.fincra.com/profile/virtual-accounts/requests';

    try {
      const ipCheck = await axios.get('https://api.ipify.org?format=json');
      console.log(`[NETWORK DEBUG] My current Outbound IP is: ${ipCheck.data.ip}`);
    } catch (ipErr) {
      console.log('[NETWORK DEBUG] Could not determine outbound IP');
    }

    console.log(`[FINCRA DEBUG] Using Business ID: ${(FINCRA_BUSINESS_ID || 'MISSING').substring(0, 5)}...`);
    console.log(`[FINCRA DEBUG] Using Secret Key: ${(FINCRA_SECRET_KEY || 'MISSING').substring(0, 5)}...`);
    console.log(`[FINCRA] Provisioning account for ${businessName}...`);

    const response = await fincraClient.post(endpoint, {
      currency: currency,
      accountType: 'virtual',
      bvn: bvn || process.env.TEST_BVN || '12345678901',
      name: businessName,
      business: FINCRA_BUSINESS_ID
    });
    
    return response.data.data;
  } catch (error: any) {
    console.error('[FINCRA DEBUG] Full Axios Error:', error.response?.data || error.message);
    const errorData = error.response?.data;
    throw new Error(errorData?.message || 'Banking partner account creation failed. Please check your credentials.');
  }
};

/**
 * Issues a Virtual Mastercard/Visa via Fincra
 */
export const issueVirtualCard = async (userId: string, currency: string) => {
  try {
    const response = await fincraClient.post(`${FINCRA_BASE_URL}/cards/issue`, {
      currency: currency,
      cardType: 'virtual',
      brand: 'mastercard',
      reference: `card_${userId}_${Date.now()}`
    });

    return response.data.data;
  } catch (error: any) {
    console.error('[FINCRA] Card Issue Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Banking partner card creation failed');
  }
};

/**
 * Initiates a Fiat Transfer / Payout via Fincra
 */
export const processFiatPayout = async (amount: number, currency: string, destinationAccount: any) => {
  try {
    const response = await fincraClient.post(`${FINCRA_BASE_URL}/disbursements/payouts`, {
        sourceCurrency: currency,
        destinationCurrency: currency,
        amount: amount,
        business: FINCRA_BUSINESS_ID,
        beneficiary: {
            firstName: 'Recipient',
            accountNumber: destinationAccount.number,
            bankCode: destinationAccount.bankCode
        }
    });

    return response.data.data;
  } catch (error: any) {
    console.error('[FINCRA] Payout Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Banking partner payout failed');
  }
};
/**
 * Verifies the signature of an incoming Fincra webhook.
 */
export const verifyWebhookSignature = (signature: string, payload: any) => {
  if (!signature || !FINCRA_SECRET_KEY) return false;
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', FINCRA_SECRET_KEY);
  const expectedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
  return signature === expectedSignature;
};
