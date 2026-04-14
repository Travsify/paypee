import dotenv from 'dotenv';
dotenv.config();

const FINCRA_BASE_URL = process.env.FINCRA_ENV === 'live' 
  ? 'https://api.fincra.com/core' 
  : 'https://sandboxapi.fincra.com/core';

const FINCRA_SECRET_KEY = (process.env.FINCRA_SECRET_KEY || '').replace(/"/g, '');
const FINCRA_BUSINESS_ID = (process.env.FINCRA_BUSINESS_ID || '').replace(/"/g, '') || 
                           (process.env.FINCRA_PUB_KEY ? Buffer.from(process.env.FINCRA_PUB_KEY.split('_')[1] || '', 'base64').toString().split(':')[0] : '');

const getHeaders = () => ({
  'api-key': FINCRA_SECRET_KEY,
  'Content-Type': 'application/json'
});

/**
 * Creates a Virtual Account (IBAN/NUBAN) via Fincra
 */
export const issueVirtualAccount = async (businessName: string, currency: string, bvn?: string) => {
  try {
    const FINCRA_VIRTUAL_URL = process.env.FINCRA_ENV === 'live'
       ? 'https://api.fincra.com/profile/virtual-accounts/requests'
       : 'https://sandboxapi.fincra.com/profile/virtual-accounts/requests';

    const response = await fetch(FINCRA_VIRTUAL_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        currency: currency,
        accountType: 'virtual',
        bvn: bvn || process.env.TEST_BVN || '12345678901',
        name: businessName,
        business: FINCRA_BUSINESS_ID
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Banking partner account creation failed');
    return data.data; // Returns accountNumber, bankName, etc.
  } catch (error) {
    console.error('[FINCRA] Virtual Account Error:', error);
    throw error;
  }
};

/**
 * Issues a Virtual Mastercard/Visa via Fincra
 */
export const issueVirtualCard = async (userId: string, currency: string) => {
  try {
    const response = await fetch(`${FINCRA_BASE_URL}/cards/issue`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        currency: currency,
        cardType: 'virtual',
        brand: 'mastercard',
        reference: `card_${userId}_${Date.now()}`
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Banking partner card creation failed');
    return data.data; // Returns cardNumber, cvv, expiry
  } catch (error) {
    console.error('[FINCRA] Card Issue Error:', error);
    throw error;
  }
};

/**
 * Initiates a Fiat Transfer / Payout via Fincra
 */
export const processFiatPayout = async (amount: number, currency: string, destinationAccount: any) => {
  try {
    const response = await fetch(`${FINCRA_BASE_URL}/disbursements/payouts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            sourceCurrency: currency,
            destinationCurrency: currency,
            amount: amount,
            business: FINCRA_BUSINESS_ID,
            beneficiary: {
                firstName: 'Recipient',
                accountNumber: destinationAccount.number,
                bankCode: destinationAccount.bankCode
            }
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Banking partner payout failed');
    return data.data;
  } catch (error) {
    console.error('[FINCRA] Payout Error:', error);
    throw error;
  }
};
