import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const MAPLERAD_BASE_URL = process.env.MAPLERAD_ENV === 'live' 
  ? 'https://api.maplerad.com/v1' 
  : 'https://sandbox.api.maplerad.com/v1';

const MAPLERAD_SECRET_KEY = (process.env.MAPLERAD_SECRET_KEY || '').replace(/"/g, '').trim();

console.log(`[MAPLERAD DEBUG] Secret Key starts with: ${MAPLERAD_SECRET_KEY.substring(0, 8)}...`);
console.log(`[MAPLERAD DEBUG] Environment: ${process.env.MAPLERAD_ENV || 'not set'}`);

const mapleradClient = axios.create({
  baseURL: MAPLERAD_BASE_URL,
  headers: {
    'Authorization': `Bearer ${MAPLERAD_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Registers a customer on Maplerad.
 */
export const createCustomer = async (firstName: string, lastName: string, email: string) => {
  try {
    const response = await mapleradClient.post('/customers', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      country: 'NG' // Default to Nigeria
    });
    return response.data.data; // Returns customer object including id
  } catch (error: any) {
    if (error.response?.data?.message?.includes('already exists')) {
        // If already exists, we should ideally fetch the customer.
        // For simplicity in this gate, we fetch by email if needed, 
        // but Maplerad usually returns the error with the existing data payload.
        return error.response.data.data; 
    }
    console.error('[MAPLERAD] Create Customer Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create Maplerad customer');
  }
};

/**
 * Provisions a virtual account for a customer.
 */
export const issueVirtualAccount = async (customerId: string, currency: string) => {
  try {
    const response = await mapleradClient.post('/issuing/accounts', {
      customer_id: customerId,
      currency: currency,
      type: 'static'
    });
    return response.data.data; // Returns account details (account_number, bank_name, etc.)
  } catch (error: any) {
    console.error('[MAPLERAD] Issue Account Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to issue virtual account via Maplerad');
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
