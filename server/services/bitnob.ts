import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import dotenv from 'dotenv';
dotenv.config();

const BITNOB_BASE_URL = process.env.BITNOB_ENV === 'live' 
  ? 'https://api.bitnob.co/api/v1' 
  : 'https://sandboxapi.bitnob.co/api/v1';

const BITNOB_SECRET_KEY = process.env.BITNOB_SECRET_KEY || '';

// 🛡️ PROXY CONFIGURATION for Bitnob IP Whitelisting
const PROXY_URL = process.env.MAPLERAD_PROXY_URL || process.env.FINCRA_PROXY_URL;
const proxyAgent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

const bitnobClient = axios.create({
  baseURL: BITNOB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${BITNOB_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  httpsAgent: proxyAgent,
  proxy: false
});

/**
 * Creates a Lightning Invoice for a user to deposit funds via Bitcoin Lightning
 */
export const createLightningInvoice = async (amountUsd: number, customerEmail: string) => {
  try {
    const response = await bitnobClient.post('/lightning/invoices', {
        customerEmail: customerEmail,
        description: `Deposit to Paypee Wallet`,
        amount: amountUsd,
        currency: 'USD'
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[BITNOB] Invoice Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Initiates a cross-border remit/payout via Bitnob Stablecoins/Lightning
 */
export const processCryptoPayout = async (amountUsd: number, destinationBitcoinAddress: string) => {
  try {
    const response = await bitnobClient.post('/transactions/send', {
        amount: amountUsd,
        currency: 'USD',
        address: destinationBitcoinAddress,
        network: 'lightning' // or 'on-chain'
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[BITNOB] Payout Error:', error.response?.data || error.message);
    throw error;
  }
};

