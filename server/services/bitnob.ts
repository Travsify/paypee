import dotenv from 'dotenv';
dotenv.config();

const BITNOB_BASE_URL = process.env.BITNOB_ENV === 'live' 
  ? 'https://api.bitnob.co/api/v1' 
  : 'https://sandboxapi.bitnob.co/api/v1';

const BITNOB_SECRET_KEY = process.env.BITNOB_SECRET_KEY || '';

const getHeaders = () => ({
  'Authorization': `Bearer ${BITNOB_SECRET_KEY}`,
  'Content-Type': 'application/json'
});

/**
 * Creates a Lightning Invoice for a user to deposit funds via Bitcoin Lightning
 */
export const createLightningInvoice = async (amountUsd: number, customerEmail: string) => {
  try {
    const response = await fetch(`${BITNOB_BASE_URL}/lightning/invoices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        customerEmail: customerEmail,
        description: `Deposit to Paypee Wallet`,
        amount: amountUsd,
        currency: 'USD'
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Bitnob Invoice Creation Failed');
    return data.data; // Returns lnurl or payment request
  } catch (error) {
    console.error('[BITNOB] Invoice Error:', error);
    throw error;
  }
};

/**
 * Initiates a cross-border remit/payout via Bitnob Stablecoins/Lightning
 */
export const processCryptoPayout = async (amountUsd: number, destinationBitcoinAddress: string) => {
  try {
    const response = await fetch(`${BITNOB_BASE_URL}/transactions/send`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            amount: amountUsd,
            currency: 'USD',
            address: destinationBitcoinAddress,
            network: 'lightning' // or 'on-chain'
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Bitnob Crypto Payout Failed');
    return data.data;
  } catch (error) {
    console.error('[BITNOB] Payout Error:', error);
    throw error;
  }
};
