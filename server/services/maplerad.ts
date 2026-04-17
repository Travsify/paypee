import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import dotenv from 'dotenv';
dotenv.config();

const MAPLERAD_BASE_URL = process.env.MAPLERAD_ENV === 'live' 
  ? 'https://api.maplerad.com/v1' 
  : 'https://sandbox.api.maplerad.com/v1';

const MAPLERAD_SECRET_KEY = (process.env.MAPLERAD_SECRET_KEY || '').replace(/"/g, '').trim();

// 🛡️ PROXY CONFIGURATION for Maplerad IP Whitelisting
const PROXY_URL = process.env.MAPLERAD_PROXY_URL || process.env.FINCRA_PROXY_URL;
const proxyAgent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

const mapleradClient = axios.create({
  baseURL: MAPLERAD_BASE_URL,
  headers: {
    'Authorization': `Bearer ${MAPLERAD_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  httpsAgent: proxyAgent,
  proxy: false // Disable axios internal proxy logic to use the agent
});

/**
 * Registers a customer on Maplerad.
 */
export const createCustomer = async (firstName: string, lastName: string, email: string) => {
  try {
    console.log(`[MAPLERAD DEBUG] Env: ${process.env.MAPLERAD_ENV || 'undefined'}, Proxy URL configured: ${!!PROXY_URL}`);
    console.log(`[MAPLERAD DEBUG] Calling ${MAPLERAD_BASE_URL}/customers for ${email}`);
    console.log(`[MAPLERAD DEBUG] Header: Authorization: Bearer ${MAPLERAD_SECRET_KEY.substring(0, 8)}...`);

    const response = await mapleradClient.post('/customers', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      country: 'NG'
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response) {
        console.error('[MAPLERAD DEBUG] Full Error Response:', JSON.stringify(error.response.data));
    }
    const errorMsg = error.response?.data?.message || '';
    if (errorMsg.toLowerCase().includes('already exist') || errorMsg.toLowerCase().includes('already enrolled')) {
        // If Maplerad returned the customer in the error response, use it
        if (error.response?.data?.data?.id) {
            return error.response.data.data; 
        }
        
        // Otherwise, fetch the customer list to find their ID
        console.log(`[MAPLERAD DEBUG] Customer already enrolled, fetching list to find ID for ${email}`);
        try {
            const listRes = await mapleradClient.get('/customers');
            const customers = listRes.data?.data || [];
            const existing = customers.find((c: any) => c.email === email);
            if (existing) return existing;
            console.log(`[MAPLERAD DEBUG] Could not find ${email} in the first page of customers.`);
        } catch (fetchErr: any) {
            console.error('[MAPLERAD] Failed to fetch existing customer list:', fetchErr.message);
        }
    }
    console.error('[MAPLERAD] Create Customer Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create Maplerad customer. Check keys/whitelisting.');
  }
};

/**
 * Upgrades a customer to Tier 1 (Required for NGN Virtual Accounts on Live API)
 */
export const upgradeCustomerTier1 = async (customerId: string, kycData: any) => {
  try {
    console.log(`[MAPLERAD DEBUG] Upgrading customer ${customerId} to Tier 1...`);
    const response = await mapleradClient.patch('/customers/upgrade/tier1', {
      customer_id: customerId,
      dob: kycData.dob || '1990-01-01', // Must be YYYY-MM-DD
      identification_number: kycData.bvn, // The actual BVN
      address: {
        street: kycData.street || '123 Main Street',
        street2: '',
        city: kycData.city || 'Lagos',
        state: kycData.state || 'Lagos',
        country: 'NG',
        postal_code: kycData.postalCode || '100001'
      },
      phone: {
        phone_number: kycData.phoneNumber || '08000000000',
        phone_country_code: '234',
        phone_short_code: 'NG'
      }
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Tier 1 Upgrade Error:', error.response?.data || error.message);
    // Ignore already upgraded errors
    if (error.response?.data?.message?.toLowerCase().includes('already upgraded')) {
      return true;
    }
    throw new Error(error.response?.data?.message || 'Failed to upgrade customer to Tier 1 on Maplerad');
  }
};

/**
 * Provisions a virtual account for a customer.
 */
export const issueVirtualAccount = async (customerId: string, currency: string) => {
  try {
    const response = await mapleradClient.post('/collections/virtual-account', {
      customer_id: customerId,
      currency: currency
    });
    return response.data.data; // Returns account details (account_number, bank_name, etc.)
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || '';
    if (errorMsg.toLowerCase().includes('already enrolled') || errorMsg.toLowerCase().includes('already exist')) {
      try {
        console.log(`[MAPLERAD DEBUG] Customer already enrolled, fetching existing virtual accounts for ${customerId}...`);
        const existing = await mapleradClient.get(`/customers/${customerId}/virtual-account`);
        const accounts = existing.data.data;
        
        if (Array.isArray(accounts)) {
          const match = accounts.find((a: any) => a.currency === currency);
          if (match) return match;
          if (accounts.length > 0) return accounts[0];
        }
        return accounts;
      } catch (fetchErr: any) {
        console.error('[MAPLERAD] Failed to fetch existing account:', fetchErr.message);
      }
    }

    console.error('[MAPLERAD] Issue Account Error:', error.response?.data || error.message);
    throw new Error(errorMsg || 'Failed to issue virtual account via Maplerad');
  }
};

/**
 * Issues a virtual card.
 */
export const issueVirtualCard = async (customerId: string, currency: string, amount: number) => {
  try {
    const response = await mapleradClient.post('/issuing/cards', {
      customer_id: customerId,
      currency: currency,
      amount: amount * 100, // Maplerad uses kobo/cents
      type: 'VIRTUAL',
      brand: 'VISA'
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Issue Card Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to issue virtual card via Maplerad');
  }
};

/**
 * Process Transfers / Payouts
 */
export const processPayout = async (amount: number, currency: string, accountDetails: any) => {
  try {
    const response = await mapleradClient.post('/transfers', {
      amount: amount * 100,
      currency: currency,
      bank_code: accountDetails.bankCode,
      account_number: accountDetails.number,
      reason: 'Paypee Payout'
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Payout Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Payout failed via Maplerad');
  }
};
