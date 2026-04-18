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
    
    // Maplerad expects DD-MM-YYYY, but HTML5 date input provides YYYY-MM-DD
    let formattedDob = '01-01-1990';
    if (kycData.dob) {
      const parts = kycData.dob.split('-');
      if (parts.length === 3) {
        formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert YYYY-MM-DD to DD-MM-YYYY
      } else {
        formattedDob = kycData.dob;
      }
    }

    const response = await mapleradClient.patch('/customers/upgrade/tier1', {
      customer_id: customerId,
      dob: formattedDob,
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

/**
 * Get Banks / Institutions / Mobile Money Providers
 */
export const getBanks = async (currency: string = 'NGN') => {
  try {
    const response = await mapleradClient.get(`/institutions?currency=${currency}`);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Get Banks Error:', error.response?.data || error.message);
    
    // Fallbacks for common mobile money/banks if API fails
    if (currency === 'KES') {
      return [{ bank_code: 'MPESA', name: 'M-Pesa' }, { bank_code: 'AIRTEL', name: 'Airtel Money' }];
    } else if (currency === 'GHS') {
      return [{ bank_code: 'MTN', name: 'MTN Mobile Money' }, { bank_code: 'VODAFONE', name: 'Vodafone Cash' }, { bank_code: 'AIRTELTIGO', name: 'AirtelTigo Money' }];
    }
    
    // Default Nigerian banks
    return [
      { bank_code: '044', name: 'Access Bank' },
      { bank_code: '058', name: 'GTBank' },
      { bank_code: '057', name: 'Zenith Bank' },
      { bank_code: '033', name: 'UBA' },
      { bank_code: '011', name: 'First Bank' },
      { bank_code: '090267', name: 'Kuda Microfinance Bank' }
    ];
  }
};

/**
 * Generate an FX Quote (Step 1 of currency swap)
 */
export const generateFxQuote = async (sourceCurrency: string, targetCurrency: string, amount: number) => {
  try {
    console.log(`[MAPLERAD FX] Generating quote: ${amount} ${sourceCurrency} → ${targetCurrency}`);
    const response = await mapleradClient.post('/fx/quote', {
      source_currency: sourceCurrency,
      target_currency: targetCurrency,
      amount: Math.round(amount * 100)
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD FX] Quote Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to generate FX quote');
  }
};

/**
 * Execute an FX Swap using a quote reference (Step 2 of currency swap)
 */
export const executeFxSwap = async (quoteReference: string) => {
  try {
    console.log(`[MAPLERAD FX] Executing swap with quote: ${quoteReference}`);
    const response = await mapleradClient.post('/fx', {
      quote_reference: quoteReference
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD FX] Swap Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to execute FX swap');
  }
};

/**
 * Get FX History
 */
export const getFxHistory = async () => {
  try {
    const response = await mapleradClient.get('/fx');
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD FX] History Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to get FX history');
  }
};

/**
 * Get live exchange rate between two currencies (lightweight — no binding quote)
 */
export const getExchangeRate = async (sourceCurrency: string, targetCurrency: string) => {
  try {
    console.log(`[MAPLERAD FX] Fetching rate: ${sourceCurrency} → ${targetCurrency}`);
    // Use a small reference amount to get the rate without committing
    const response = await mapleradClient.post('/fx/quote', {
      source_currency: sourceCurrency,
      target_currency: targetCurrency,
      amount: 100 // 1.00 in minor units for rate calculation
    });
    const data = response.data.data;
    return {
      rate: data.rate,
      sourceCurrency,
      targetCurrency,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('[MAPLERAD FX] Rate Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch exchange rate');
  }
};

/**
 * Supported FX currency pairs
 */
/**
 * Get all cards for a customer
 */
export const getCards = async (customerId?: string) => {
  try {
    const url = customerId ? `/issuing/cards?customer_id=${customerId}` : '/issuing/cards';
    const response = await mapleradClient.get(url);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Get Cards Error:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Get specific card details
 */
export const getCardDetails = async (cardId: string) => {
  try {
    const response = await mapleradClient.get(`/issuing/cards/${cardId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Get Card Details Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch card details');
  }
};

/**
 * Fund a virtual card
 */
export const fundCard = async (cardId: string, amount: number) => {
  try {
    const response = await mapleradClient.post(`/issuing/cards/${cardId}/fund`, {
      amount: Math.round(amount * 100)
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Fund Card Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fund card');
  }
};

/**
 * Freeze/Unfreeze a card
 */
export const toggleCardStatus = async (cardId: string, status: 'FREEZE' | 'UNFREEZE') => {
  try {
    const endpoint = status === 'FREEZE' ? 'freeze' : 'unfreeze';
    const response = await mapleradClient.patch(`/issuing/cards/${cardId}/${endpoint}`);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Card Status Error:', error.response?.data || error.message);
    throw new Error(`Failed to ${status.toLowerCase()} card`);
  }
};

/**
 * Bill Payments: Get Categories
 */
export const getBillCategories = async () => {
  // Maplerad doesn't have a generic categories endpoint; we define them ourselves
  return [
    { id: 'airtime', name: 'Airtime', icon: 'smartphone' },
    { id: 'data', name: 'Mobile Data', icon: 'wifi' },
    { id: 'electricity', name: 'Electricity', icon: 'zap' },
    { id: 'cable', name: 'Cable TV', icon: 'tv' },
    { id: 'internet', name: 'Internet', icon: 'globe' },
    { id: 'betting', name: 'Betting', icon: 'trophy' }
  ];
};

/**
 * Bill Payments: Get Billers for a category
 * Maplerad uses per-category endpoints: /bills/airtime/billers/{country}
 */
export const getBillers = async (category: string, country: string = 'NG') => {
  try {
    // Map our category names to Maplerad's endpoint paths
    const categoryPath = mapCategoryToPath(category);
    console.log(`[MAPLERAD] Fetching billers: /bills/${categoryPath}/billers/${country}`);
    const response = await mapleradClient.get(`/bills/${categoryPath}/billers/${country}`);
    return response.data.data || [];
  } catch (error: any) {
    console.error('[MAPLERAD] Get Billers Error:', error.response?.data || error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('[MAPLERAD] Authentication/Whitelisting issue detected for Bills API.');
    }
    return [];
  }
};

/**
 * Bill Payments: Get Products for a biller (not all categories have this)
 */
export const getBillerProducts = async (billerId: string) => {
  // Maplerad doesn't have a generic products-per-biller endpoint;
  // Products are implicit in the biller list for most categories.
  // For electricity (meters), the identifier is entered by the user.
  console.log(`[MAPLERAD] Product fetch requested for biller ${billerId} — returning biller info as product`);
  return [];
};

/**
 * Process a Bill Payment via the correct category-specific endpoint
 */
export const payBill = async (payload: { 
  category: string, 
  phone_number?: string, 
  amount: number, 
  identifier?: string,
  biller_id?: string,
  meter_number?: string,
  smartcard_number?: string,
  product_id?: string 
}) => {
  try {
    const categoryPath = mapCategoryToPath(payload.category);
    
    // Build the request body based on category
    const body: any = {
      amount: Math.round(payload.amount * 100) // Maplerad uses kobo/cents
    };

    // Airtime & Data need phone_number + identifier (biller code like "ng-airtime")
    if (categoryPath === 'airtime' || categoryPath === 'data') {
      body.phone_number = payload.phone_number || payload.meter_number;
      body.identifier = payload.biller_id || payload.identifier;
    }
    // Electricity needs meter_number + identifier
    else if (categoryPath === 'electricity') {
      body.meter_number = payload.meter_number || payload.phone_number;
      body.identifier = payload.biller_id || payload.identifier;
    }
    // Cable TV needs smartcard_number + identifier  
    else if (categoryPath === 'cabletv') {
      body.smartcard_number = payload.smartcard_number || payload.phone_number;
      body.identifier = payload.biller_id || payload.identifier;
      if (payload.product_id) body.product_id = payload.product_id;
    }
    // Internet & Betting
    else {
      body.phone_number = payload.phone_number || payload.meter_number;
      body.identifier = payload.biller_id || payload.identifier;
    }

    console.log(`[MAPLERAD] Paying bill via POST /bills/${categoryPath}:`, JSON.stringify(body));
    const response = await mapleradClient.post(`/bills/${categoryPath}`, body);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Pay Bill Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Bill payment failed');
  }
};

/**
 * Maps our internal category names to Maplerad's URL path segment
 */
function mapCategoryToPath(category: string): string {
  const map: Record<string, string> = {
    'airtime': 'airtime',
    'data': 'data',
    'electricity': 'electricity',
    'utility': 'electricity',
    'power': 'electricity',
    'cable': 'cabletv',
    'cabletv': 'cabletv',
    'tv': 'cabletv',
    'internet': 'internet',
    'betting': 'betting',
    'education': 'education'
  };
  return map[category.toLowerCase()] || category.toLowerCase();
}

/**
 * Create a Payment Link (Commerce/Collections)
 */
export const createPaymentLink = async (payload: { title: string, amount: number, currency: string, description?: string }) => {
  try {
    const response = await mapleradClient.post('/collections/links', {
      ...payload,
      amount: Math.round(payload.amount * 100)
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Create Link Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create payment link');
  }
};

/**
 * Get all payment links
 */
export const getPaymentLinks = async () => {
  try {
    const response = await mapleradClient.get('/collections/links');
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Get Links Error:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Get Maplerad Pay Status (Commerce)
 */
export const getMapleradPayStatus = async (reference: string) => {
  try {
    const response = await mapleradClient.get(`/collections/links/status/${reference}`);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Link Status Error:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Verifies the signature of an incoming Maplerad webhook.
 */
export const verifyWebhookSignature = (signature: string, payload: any) => {
  if (!signature || !MAPLERAD_SECRET_KEY) return false;
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', MAPLERAD_SECRET_KEY);
  const expectedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
  return signature === expectedSignature;
};

export const SUPPORTED_FX_PAIRS = [
  { source: 'USD', target: 'NGN' },
  { source: 'NGN', target: 'USD' },
  { source: 'EUR', target: 'NGN' },
  { source: 'NGN', target: 'EUR' },
  { source: 'GBP', target: 'NGN' },
  { source: 'NGN', target: 'GBP' },
  { source: 'USD', target: 'EUR' },
  { source: 'EUR', target: 'USD' },
  { source: 'USD', target: 'GBP' },
  { source: 'GBP', target: 'USD' },
  { source: 'EUR', target: 'GBP' },
  { source: 'GBP', target: 'EUR' },
];
