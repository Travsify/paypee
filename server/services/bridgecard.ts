import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
 * IMPORTANT: selfie_image and id_image must be publicly accessible URLs (NOT base64).
 * See: https://docs.bridgecard.co/reference/api-reference/cardholder
 */
export const createCustomer = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bvn?: string; // Legacy fallback
  id_type?: string;
  id_no?: string;
  selfie_image_url?: string; // PUBLIC URL (required by Bridgecard)
  id_image_url?: string;     // PUBLIC URL (required by Bridgecard)
  date_of_birth?: string;
  address?: any;
}) => {
  try {
    console.log(`[BRIDGECARD] Registering cardholder: ${userData.email}`);
    
    // ALWAYS prefer BVN verification when BVN is available.
    // BVN flow only needs a selfie (no document photo), which avoids the
    // "four edges showing" rejection from Bridgecard's document OCR.
    // NIN flow requires a clear id_image which webcams/phone cameras struggle with.
    const hasBvn = userData.bvn && userData.bvn.length >= 11;
    const identityType = hasBvn ? 'NIGERIAN_BVN_VERIFICATION' : 'NIGERIAN_NIN';
    const identityNumber = userData.id_no || userData.bvn;

    if (!hasBvn && (!identityNumber || identityNumber.length !== 11)) {
      throw new Error(`A valid 11-digit BVN or NIN is required to issue a virtual card.`);
    }

    // Build identity object based on flow
    // BVN flow: bvn + selfie_image (URL) — PREFERRED, no document photo needed
    // NIN flow: id_no + id_image (URL) + bvn — fallback only
    const identity: any = {
      id_type: identityType,
    };

    if (identityType === 'NIGERIAN_BVN_VERIFICATION') {
      // BVN flow: just needs BVN + selfie URL
      identity.bvn = userData.bvn;
      identity.selfie_image = userData.selfie_image_url || '';
      console.log(`[BRIDGECARD] ✅ Using BVN flow (selfie only, no document photo needed)`);
      console.log(`[BRIDGECARD]    BVN: ${userData.bvn?.substring(0, 4)}****`);
      console.log(`[BRIDGECARD]    Selfie URL: ${identity.selfie_image ? identity.selfie_image.substring(0, 80) + '...' : 'MISSING'}`);
    } else {
      // NIN / other ID flow: needs id_no + id_image URL + bvn
      identity.id_no = identityNumber;
      identity.id_image = userData.id_image_url || '';
      if (userData.bvn) identity.bvn = userData.bvn;
      console.log(`[BRIDGECARD] ⚠️ Using NIN flow (requires document photo)`);
      console.log(`[BRIDGECARD]    id_image URL: ${identity.id_image ? identity.id_image.substring(0, 80) + '...' : 'MISSING'}`);
    }

    const payload = {
      first_name: (userData.firstName || '').trim(),
      last_name: (userData.lastName || '').trim(),
      email_address: userData.email,
      date_of_birth: userData.date_of_birth, // YYYY-MM-DD
      phone: (() => {
        const digits = (userData.phone || '').replace(/\D/g, '');
        const subscriber = digits.length >= 10 ? digits.slice(-10) : '8000000000';
        return `+234${subscriber}`;
      })(),
      address: {
        address: userData.address?.street || '9 Jibowu Street',
        city: userData.address?.city || 'Lagos',
        state: userData.address?.state || 'Lagos',
        country: 'NIGERIA',
        postal_code: userData.address?.postalCode || '100001',
        house_no: '1'
      },
      identity
    };

    console.log('[BRIDGECARD] [v2.0-url-fix] Sending Registration Payload:', JSON.stringify(payload, null, 2));

    const response = await bridgecardClient.post('/cardholder/register_cardholder_synchronously', payload);
    const data = response.data.data;
    
    if (!data || !data.cardholder_id) {
       console.error('[BRIDGECARD] Registration response missing cardholder_id:', data);
       throw new Error('Bridgecard registration succeeded but returned no cardholder ID.');
    }
    
    return data;
  } catch (error: any) {
    const errorData = error.response?.data;
    const statusCode = error.response?.status;
    console.error('[BRIDGECARD] Register Cardholder Error:', JSON.stringify(errorData, null, 2) || error.message);
    
    // EXTREME DEBUGGING: Include everything in the message if possible
    let msg = errorData?.message || errorData?.error?.message || (errorData ? JSON.stringify(errorData) : error.message);
    if (!msg || msg === 'Failed to register cardholder on Bridgecard') {
       msg = `Bridgecard Error (${statusCode || 'Unknown'}): ${error.message}`;
    }
    
    throw new Error(msg);
  }
};

/**
 * Issue a virtual card
 * Docs: https://docs.bridgecard.co/reference/api-reference/usd-cards#create-a-card
 * Required fields: cardholder_id, card_type, card_brand, card_currency, card_limit, funding_amount, pin
 */
export const issueVirtualCard = async (cardholderId: string, currency: string, amount: number) => {
  try {
    const targetCurrency = (currency || 'USD').toUpperCase();
    console.log(`[BRIDGECARD] Issuing ${targetCurrency} card for cardholder ${cardholderId}`);
    
    // Encrypt a default PIN using AES-256 (Bridgecard requirement)
    const AES256 = require('aes-everywhere');
    const defaultPin = '1234';
    const encryptedPin = AES256.encrypt(defaultPin, BRIDGECARD_SECRET_KEY);
    
    const payload: any = {
      cardholder_id: cardholderId,
      card_type: 'virtual',
      card_brand: 'Mastercard',
      card_currency: targetCurrency,
      pin: encryptedPin,
      meta_data: {
        issuing_id: BRIDGECARD_ISSUING_ID,
        platform: 'paypee'
      }
    };

    // USD cards have specific minimum funding and limit requirements
    if (targetCurrency === 'USD') {
      // funding_amount is in CENTS: $1 = "100"
      const fundingAmountCents = Math.max(100, Math.round(amount * 100));
      payload.card_limit = '500000'; // $5,000 limit
      payload.funding_amount = String(fundingAmountCents);
    }
    // NGN cards do not require funding_amount during creation and should be funded via the naira_cards/fund_naira_card endpoint instead.

    console.log('[BRIDGECARD] Create Card Payload:', JSON.stringify({ ...payload, pin: '[ENCRYPTED]' }, null, 2));

    const response = await bridgecardClient.post('/cards/create_card', payload);
    const cardData = response.data.data;

    console.log('[BRIDGECARD] Card created successfully:', cardData);
    return cardData;
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error('[BRIDGECARD] Issue Card Error:', JSON.stringify(errorData, null, 2) || error.message);
    const msg = errorData?.message || (errorData ? JSON.stringify(errorData) : error.message) || 'Failed to issue virtual card on Bridgecard';
    throw new Error(msg);
  }
};

/**
 * Get card details (card_number, expiry, cvv, etc.)
 * Uses the Evervault relay endpoint so data arrives decrypted.
 * Docs: https://docs.bridgecard.co/reference/api-reference/usd-cards#get-card-details
 */
export const getCardDetails = async (cardId: string) => {
  try {
    console.log(`[BRIDGECARD] Fetching card details for ${cardId}...`);
    
    // Use the Evervault relay for decrypted card details
    const isLive = process.env.BRIDGECARD_ENV === 'live';
    const baseUrl = isLive
      ? 'https://issuecards-api-bridgecard-co.relay.evervault.com/v1/issuing'
      : 'https://issuecards-api-bridgecard-co.relay.evervault.com/v1/issuing/sandbox';
    
    const response = await axios.get(`${baseUrl}/cards/get_card_details`, {
      params: { card_id: cardId },
      headers: {
        'token': `Bearer ${BRIDGECARD_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    const data = response.data.data;
    console.log('[BRIDGECARD] Card details fetched:', { 
      last4: data?.card_number?.slice(-4), 
      expiry: `${data?.expiry_month}/${data?.expiry_year}`,
      has_cvv: !!data?.cvv 
    });
    return data;
  } catch (error: any) {
    console.error('[BRIDGECARD] Get Card Details Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch card details from Bridgecard');
  }
};

/**
 * Fund a virtual card
 */
export const fundCard = async (cardId: string, amount: number, currency: string = 'USD') => {
  try {
    const isNGN = currency.toUpperCase() === 'NGN';
    const endpoint = isNGN ? '/naira_cards/fund_naira_card' : '/cards/fund_card';
    
    const payload: any = {
      card_id: cardId,
      amount: String(amount)
    };

    if (isNGN) {
      payload.transaction_reference = `FUND_NGN_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    console.log(`[BRIDGECARD] Funding ${currency} card ${cardId} with ${amount}. Endpoint: ${endpoint}`);
    const response = await bridgecardClient.post(endpoint, payload);
    return response.data.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error('[BRIDGECARD] Fund Card Error:', JSON.stringify(errorData, null, 2) || error.message);
    throw new Error(errorData?.message || 'Failed to fund Bridgecard');
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
