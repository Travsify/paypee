import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BRIDGECARD_BASE_URL = process.env.BRIDGECARD_ENV === 'live' 
  ? 'https://issuecards.api.bridgecard.co/v1/issuing' 
  : 'https://issuecards.api.bridgecard.co/v1/issuing/sandbox';

const BRIDGECARD_AUTH_TOKEN = (process.env.BRIDGECARD_AUTH_TOKEN || '').trim();
const BRIDGECARD_ISSUING_ID = (process.env.BRIDGECARD_ISSUING_ID || '').trim();
const BRIDGECARD_SECRET_KEY = (process.env.BRIDGECARD_SECRET_KEY || '').trim();

const bridgecardClient = axios.create({
  baseURL: BRIDGECARD_BASE_URL,
  headers: {
    'token': `Bearer ${BRIDGECARD_AUTH_TOKEN}`,
    'secret-key': BRIDGECARD_SECRET_KEY,
    'issuing-id': BRIDGECARD_ISSUING_ID,
    'Content-Type': 'application/json'
  },
  timeout: 60000 // Bridgecard requires at least 45s for sync registration
});

/**
 * Register a cardholder on Bridgecard (Synchronous)
 */
export const createCustomer = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bvn?: string;
  address?: any;
}) => {
  try {
    console.log(`[BRIDGECARD] Registering cardholder: ${userData.email}`);
    
    const payload = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email_address: userData.email,
      phone: userData.phone.startsWith('+') ? userData.phone : `+234${userData.phone.slice(-10)}`, // Ensure E.164
      address: {
        address: userData.address?.street || '9 Jibowu Street',
        city: userData.address?.city || 'Lagos',
        state: userData.address?.state || 'Lagos',
        country: userData.address?.country || 'Nigeria',
        postal_code: userData.address?.postalCode || '100001',
        house_no: '1'
      },
      identity: {
        id_type: 'NIGERIAN_BVN_VERIFICATION',
        bvn: userData.bvn || '22222222222', // Fallback for testing if needed
        selfie_image: 'https://paypee.com/selfie.jpg'
      }
    };

    const response = await bridgecardClient.post('/cardholder/register_cardholder_synchronously', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('[BRIDGECARD] Register Cardholder Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to register cardholder on Bridgecard');
  }
};

/**
 * Issue a virtual card
 */
export const issueVirtualCard = async (cardholderId: string, currency: string, amount: number) => {
  try {
    console.log(`[BRIDGECARD] Issuing ${currency} card for cardholder ${cardholderId}`);
    
    // Bridgecard requires a card_type (e.g. 'virtual') and currency
    const payload = {
      cardholder_id: cardholderId,
      card_type: 'virtual',
      card_brand: 'Mastercard', // Bridgecard often defaults to Mastercard for USD
      currency: currency || 'USD',
      meta_data: {
        issuing_id: BRIDGECARD_ISSUING_ID
      }
    };

    const response = await bridgecardClient.post('/cards/create_card', payload);
    const cardData = response.data.data;

    // Bridgecard cards are issued with $0 balance usually, need to fund it immediately
    if (amount > 0) {
      console.log(`[BRIDGECARD] Funding new card with $${amount}...`);
      await fundCard(cardData.card_id, amount);
    }

    return cardData;
  } catch (error: any) {
    console.error('[BRIDGECARD] Issue Card Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to issue virtual card on Bridgecard');
  }
};

/**
 * Fund a virtual card
 */
export const fundCard = async (cardId: string, amount: number) => {
  try {
    const response = await bridgecardClient.post('/cards/fund_card', {
      card_id: cardId,
      amount: amount // Bridgecard usually takes amount in standard units (e.g. 5.00)
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[BRIDGECARD] Fund Card Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fund Bridgecard');
  }
};

/**
 * Get card details
 */
export const getCard = async (cardId: string) => {
  try {
    const response = await bridgecardClient.get(`/cards/get_card_details/${cardId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`[BRIDGECARD] Get Card Error (${cardId}):`, error.response?.data || error.message);
    return null;
  }
};

/**
 * Freeze a card
 */
export const freezeCard = async (cardId: string) => {
  try {
    const response = await bridgecardClient.patch(`/cards/freeze_card`, { card_id: cardId });
    return response.data.data;
  } catch (error: any) {
    console.error('[BRIDGECARD] Freeze Card Error:', error.response?.data || error.message);
    throw new Error('Failed to freeze Bridgecard');
  }
};

/**
 * Unfreeze a card
 */
export const unfreezeCard = async (cardId: string) => {
  try {
    const response = await bridgecardClient.patch(`/cards/unfreeze_card`, { card_id: cardId });
    return response.data.data;
  } catch (error: any) {
    console.error('[BRIDGECARD] Unfreeze Card Error:', error.response?.data || error.message);
    throw new Error('Failed to unfreeze Bridgecard');
  }
};

/**
 * Withdraw funds from card back to wallet
 */
export const withdrawFromCard = async (cardId: string, amount: number) => {
  try {
    const response = await bridgecardClient.post('/cards/withdraw_card_funds', {
      card_id: cardId,
      amount: amount
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[BRIDGECARD] Withdraw Card Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to withdraw from Bridgecard');
  }
};
