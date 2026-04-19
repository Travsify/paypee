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
if (PROXY_URL) {
  const maskedProxy = PROXY_URL.replace(/:[^:@]+@/, ':****@');
  console.log(`[MAPLERAD] Initializing with proxy: ${maskedProxy}`);
}

const proxyAgent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

const mapleradClient = axios.create({
  baseURL: MAPLERAD_BASE_URL,
  headers: {
    'Authorization': `Bearer ${MAPLERAD_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  httpsAgent: proxyAgent,
  proxy: false,
  timeout: 1800000 // 30 minutes
});

// Direct client for fallback/testing
const directClient = axios.create({
  baseURL: MAPLERAD_BASE_URL,
  headers: {
    'Authorization': `Bearer ${MAPLERAD_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 1800000 // 30 minutes
});

// Helper for robust requests with proxy fallback
const makeRequest = async (method: 'get' | 'post' | 'put' | 'delete' | 'patch', url: string, data?: any, params?: any): Promise<any> => {
  try {
    const config = { params };
    if (method === 'get' || method === 'delete') {
      return await mapleradClient[method](url, config);
    } else {
      // @ts-ignore - Support patch/post/put dynamically
      return await mapleradClient[method](url, data, config);
    }
  } catch (err: any) {
    if (err.response?.status === 407 && PROXY_URL) {
      console.warn(`⚠️ [MAPLERAD] Proxy 407 on ${url}. Attempting DIRECT fallback...`);
      const config = { params };
      if (method === 'get' || method === 'delete') {
        return await directClient[method](url, config);
      } else {
        // @ts-ignore
        return await directClient[method](url, data, config);
      }
    }
    throw err;
  }
};

/**
 * Get all customers from Maplerad.
 */
export const getCustomers = async () => {
  try {
    const response = await makeRequest('get', '/customers?limit=100');
    return response.data.data || [];
  } catch (error: any) {
    console.error('[MAPLERAD] Get Customers Error:', error.response?.data || error.message);
    return [];
  }
};


/**
 * Registers a customer on Maplerad.
 */
export const createCustomer = async (firstName: string, lastName: string, email: string) => {
  try {
    const response = await makeRequest('post', '/customers', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      country: 'NG'
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response) {
        if (error.response.status === 407) {
           console.error('🛑 [MAPLERAD PROXY ERROR] 407 Proxy Authentication Required. Your Fixie/Proxy credentials are invalid.');
        } else if (error.response.status === 403) {
           console.error('🚫 [MAPLERAD IP ERROR] 403 Forbidden. Maplerad is blocking this IP. A working proxy is REQUIRED.');
        } else {
           console.error('[MAPLERAD DEBUG] Full Error Response:', JSON.stringify(error.response.data));
        }
    }

    const errorMsg = error.response?.data?.message || '';
    if (errorMsg.toLowerCase().includes('already exist') || errorMsg.toLowerCase().includes('already enrolled')) {
        // If Maplerad returned the customer in the error response, use it
        if (error.response?.data?.data?.id) {
            return error.response.data.data; 
        }
        
        // Otherwise, fetch the customer list to find their ID
        console.log(`[MAPLERAD DEBUG] Customer already enrolled, fetching list to find ID for ${email}`);
        const customers = await getCustomers();
        const existing = customers.find((c: any) => c.email?.toLowerCase() === email?.toLowerCase());
        if (existing) return existing;
        console.warn(`[MAPLERAD DEBUG] Could not find ${email} in first 100 customers. Pagination issue?`);
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

    const response = await makeRequest('patch', '/customers/upgrade/tier1', {
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
    // Try using the collections endpoint for all currencies first, as Maplerad often unifies them
    const url = '/collections/virtual-account';
    const payload: any = {
      customer_id: customerId,
      currency: currency.toUpperCase()
    };

    console.log(`[MAPLERAD] Issuing ${currency} account for customer ${customerId} via ${url}...`);
    const response = await makeRequest('post', url, payload);
    return response.data.data; 
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || '';
    
    // If account already exists, try to fetch it
    if (errorMsg.toLowerCase().includes('already') || error.response?.status === 400 || error.response?.status === 405) {
      try {
        console.log(`[MAPLERAD DEBUG] Checking for existing accounts for customer ${customerId}...`);
        // Try multiple possible list endpoints
        const listEndpoints = [
          `/customers/${customerId}/virtual-accounts`,
          `/customers/${customerId}/virtual-account`,
          `/issuing`,
          `/issuing/virtual-accounts?customer_id=${customerId}`
        ];
        
        for (const listUrl of listEndpoints) {
          try {
            const existing = await makeRequest('get', listUrl);
            const accounts = existing.data.data || [];
            if (Array.isArray(accounts)) {
              const match = accounts.find((a: any) => a.currency === currency.toUpperCase());
              if (match) return match;
            } else if (accounts && accounts.currency === currency.toUpperCase()) {
              return accounts;
            }
          } catch (e) {}
        }
      } catch (fetchErr: any) {
        console.warn('[MAPLERAD] Fallback account lookup failed:', fetchErr.message);
      }
    }

    console.error('[MAPLERAD] Issue Account Error:', error.response?.data || error.message);
    throw new Error(errorMsg || `Failed to issue ${currency} virtual account`);
  }
};

/**
 * Issues a virtual card.
 */
export const issueVirtualCard = async (customerId: string, currency: string, amount: number) => {
  try {
    const response = await makeRequest('post', '/issuing/cards', {
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
    const payload: any = {
      amount: amount * 100,
      currency: currency,
      account_number: accountDetails.number,
      reason: 'Paypee Payout'
    };
    
    if (accountDetails.bankCode) payload.bank_code = accountDetails.bankCode;
    if (accountDetails.routing_number) payload.routing_number = accountDetails.routing_number;
    if (accountDetails.swift_code) payload.swift_code = accountDetails.swift_code;
    if (accountDetails.iban) payload.iban = accountDetails.iban;
    if (accountDetails.accountName) payload.name = accountDetails.accountName;
    if (accountDetails.beneficiary_type) payload.beneficiary_type = accountDetails.beneficiary_type;

    const response = await makeRequest('post', '/transfers', payload);
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
    const response = await makeRequest('get', `/institutions?currency=${currency}`);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Get Banks Error:', error.response?.data || error.message);
    
    // Fallbacks for common mobile money/banks if API fails
    if (currency === 'KES') {
      return [{ bank_code: 'MPESA', name: 'M-Pesa' }, { bank_code: 'AIRTEL', name: 'Airtel Money' }];
    } else if (currency === 'GHS') {
      return [{ bank_code: 'MTN', name: 'MTN Mobile Money' }, { bank_code: 'VODAFONE', name: 'Vodafone Cash' }, { bank_code: 'AIRTELTIGO', name: 'AirtelTigo Money' }];
    } else if (currency === 'UGX') {
      return [{ bank_code: 'MTN', name: 'MTN Uganda' }, { bank_code: 'AIRTEL', name: 'Airtel Uganda' }];
    } else if (currency === 'RWF') {
      return [{ bank_code: 'MTN', name: 'MTN Rwanda' }, { bank_code: 'AIRTEL', name: 'Airtel Rwanda' }];
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
 * Verify a bank account number
 */
export const verifyAccountNumber = async (accountNumber: string, bankCode: string) => {
  try {
    const response = await makeRequest('post', '/institutions/resolve', {
      account_number: accountNumber,
      bank_code: bankCode
    });
    console.log('[MAPLERAD DEBUG] Verification Response:', JSON.stringify(response.data, null, 2));
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Account Verification Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to verify account number');
  }
};

/**
 * Generate an FX Quote (Step 1 of currency swap)
 */
export const generateFxQuote = async (sourceCurrency: string, targetCurrency: string, amount: number) => {
  try {
    console.log(`[MAPLERAD FX] Generating quote: ${amount} ${sourceCurrency} → ${targetCurrency}`);
    const response = await makeRequest('post', '/fx/quote', {
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
    const response = await makeRequest('post', '/fx', {
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
    const response = await makeRequest('get', '/fx');
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
    const response = await makeRequest('post', '/fx/quote', {
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
    const errorMsg = error.response?.data?.message || '';
    
    // 🛡️ SANDBOX FALLBACK: If Maplerad cannot convert (very common in sandbox), provide a realistic mockup rate
    // This prevents the dashboard from breaking for the user.
    if (errorMsg.toLowerCase().includes('could not convert') || errorMsg.toLowerCase().includes('not supported')) {
      console.warn(`[MAPLERAD FX] Using fallback rate for ${sourceCurrency} → ${targetCurrency} (API Error: ${errorMsg})`);
      
      let fallbackRate = 1.0;
      if (sourceCurrency === 'USD' && targetCurrency === 'NGN') fallbackRate = 1550.0;
      else if (sourceCurrency === 'EUR' && targetCurrency === 'NGN') fallbackRate = 1680.0;
      else if (sourceCurrency === 'GBP' && targetCurrency === 'NGN') fallbackRate = 1950.0;
      else if (sourceCurrency === 'NGN' && targetCurrency === 'USD') fallbackRate = 1 / 1580.0;
      
      return {
        rate: fallbackRate,
        sourceCurrency,
        targetCurrency,
        timestamp: new Date().toISOString(),
        isFallback: true
      };
    }

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
    const response = await makeRequest('get', url);
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
    const response = await makeRequest('get', `/issuing/cards/${cardId}`);
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
    const response = await makeRequest('post', `/issuing/cards/${cardId}/fund`, {
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
    const response = await makeRequest('patch', `/issuing/cards/${cardId}/${endpoint}`);
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
    const response = await makeRequest('get', `/bills/${categoryPath}/billers/${country}`);
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
    console.log(`[MAPLERAD DEBUG] PayBill Payload received:`, JSON.stringify(payload));
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
    else if (categoryPath === 'cable') {
      body.smartcard_number = payload.smartcard_number || payload.phone_number;
      body.identifier = payload.biller_id || payload.identifier;
      if (payload.product_id) body.product_id = payload.product_id;
    }

    console.log(`[MAPLERAD] Paying bill via POST /bills/${categoryPath}:`, JSON.stringify(body));
    const response = await makeRequest('post', `/bills/${categoryPath}`, body);
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
    'cable': 'cable',
    'cabletv': 'cable',
    'tv': 'cable'
  };
  return map[category.toLowerCase()] || category.toLowerCase();
}

/**
 * Create a Payment Link (Commerce/Collections)
 */
export const createPaymentLink = async (payload: { title: string, amount: number, currency: string, description?: string }) => {
  try {
    const response = await makeRequest('post', '/collections/links', {
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
    const response = await makeRequest('get', '/collections/links');
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
    const response = await makeRequest('get', `/collections/links/status/${reference}`);
    return response.data.data;
  } catch (error: any) {
    console.error('[MAPLERAD] Link Status Error:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Issue a crypto wallet address for a customer (USDC, USDT, BTC)
 * Maplerad Crypto API: POST /crypto
 * Payload: { customer_id, coin, chain }
 */
export const issueCryptoAddress = async (customerId: string, currency: string) => {
  // Map Paypee currency codes to Maplerad's coin/chain format
  const coinMap: Record<string, { coin: string; chain: string }> = {
    'USDC': { coin: 'USDC', chain: 'solana' },
    'USDT': { coin: 'USDT', chain: 'solana' } // Changed to solana as tron/eth are down and polygon is not allowed
  };

  const mapping = coinMap[currency];
  if (!mapping) throw new Error(`Unsupported crypto currency: ${currency}`);

  try {
    console.log(`[MAPLERAD CRYPTO] Creating ${currency} wallet for customer ${customerId} (${mapping.coin}/${mapping.chain})`);
    const response = await makeRequest('post', '/crypto', {
      customer_id: customerId,
      coin: mapping.coin,
      chain: mapping.chain
    });
    const data = response.data.data;
    return {
      address: data.address || data.wallet_address,
      network: data.chain || mapping.chain,
      coin: data.coin || mapping.coin,
      ...data
    };
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message;
    console.error(`[MAPLERAD] Crypto Wallet Creation Failed:`, error.response?.data || errMsg);
    throw new Error(error.response?.data?.message || 'Failed to issue crypto wallet');
  }
};

/**
 * Get crypto addresses for a customer
 */
export const getCryptoAddresses = async (customerId: string) => {
  try {
    const response = await makeRequest('get', `/crypto?customer_id=${customerId}`);
    return response.data.data || [];
  } catch (error: any) {
    console.warn(`[MAPLERAD] Crypto lookup failed for ${customerId}:`, error.response?.data?.message || error.message);
    return [];
  }
};

/**
 * Get merchant wallets from Maplerad
 * Returns all currency wallets and their balances on the Maplerad merchant account
 */
export const getWallets = async () => {
  try {
    const response = await makeRequest('get', '/wallets');
    return response.data.data || [];
  } catch (error: any) {
    console.error('[MAPLERAD] Get Wallets Error:', error.response?.data || error.message);
    return [];
  }
};

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

/**
 * Get virtual accounts for a specific customer
 */
export const getCustomerVirtualAccounts = async (customerId: string) => {
  try {
    const response = await makeRequest('get', `/customers/${customerId}/virtual-account`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  } catch (error: any) {
    console.error('[MAPLERAD] Get Virtual Accounts Error:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Get transactions for the account or a specific customer
 */
export const getTransactions = async (customerId?: string) => {
  try {
    const url = customerId ? `/transactions?customer_id=${customerId}&limit=100` : '/transactions?limit=100';
    const response = await makeRequest('get', url);
    console.log(`[MAPLERAD DEBUG] GET ${url} - Status: ${response.status}`);
    
    // The data might be in response.data.data (standard) or nested further
    let txs = response.data.data;
    
    if (txs && !Array.isArray(txs) && typeof txs === 'object') {
       console.log(`[MAPLERAD DEBUG] Transactions payload keys: ${Object.keys(txs).join(', ')}`);
       if (Array.isArray(txs.transactions)) txs = txs.transactions;
       else if (Array.isArray(txs.history)) txs = txs.history;
       else if (Array.isArray(txs.list)) txs = txs.list;
    }
    
    return Array.isArray(txs) ? txs : [];
  } catch (error: any) {
    console.error('[MAPLERAD] Get Transactions Error:', error.response?.data || error.message);
    return [];
  }
};

