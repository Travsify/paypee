import { PrismaClient, Currency } from '@prisma/client';
import { issueVirtualAccount } from './fincra';

const prisma = new PrismaClient();

export class IbanService {
  /**
   * Provisions a new virtual global account for a user.
   */
  static async provisionGlobalAccount(userId: string, currency: string, userName?: string, bvn?: string) {
    console.log(`🌍 Provisioning ${currency} account for User ${userId}...`);

    const prefixes: Record<string, string> = {
      EUR: 'BE89',
      GBP: 'GB21',
      CNY: 'CN38',
      USD: 'US11',
      NGN: 'NG55',
      BTC: 'BC11',
      USDT: 'TS11',
      USDC: 'CS11'
    };

    // 1. Check if the user already has a wallet in this currency
    const existingWallet = await prisma.wallet.findFirst({
        where: { userId, currency: currency as Currency }
    });

    if (existingWallet && existingWallet.metadata) {
        return {
            walletId: existingWallet.id,
            currency,
            isExisting: true,
            accountDetails: existingWallet.metadata
        };
    }

    // 2. Provision external details from API
    let details: any = null;

    if (['NGN', 'EUR', 'GBP', 'USD'].includes(currency)) {
       try {
          console.log(`🏦 Calling API for real ${currency} rails...`);
          const apiData = await issueVirtualAccount(userName || "Valued Customer", currency, bvn);
          details = {
             accountHolder: apiData.accountName || userName || "API Verified Customer",
             iban: apiData.accountNumber,
             bic: apiData.bankCode || '0000',
             bankName: apiData.bankName || 'Partner Bank',
             address: "Verified Address"
          };
       } catch (err: any) {
          console.error(`❌ API ${currency} Provisioning failed:`, err.message);
          throw err; 
       }
    } else {
       throw new Error(`API Virtual Account provisioning is not yet supported for ${currency}. Please contact support.`);
    }

    // 3. Create or update the wallet
    if (existingWallet) {
       await prisma.wallet.update({
          where: { id: existingWallet.id },
          data: { metadata: details }
       });
       return { walletId: existingWallet.id, currency, accountDetails: details };
    }

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        currency: currency as Currency,
        balance: 0.00,
        metadata: details
      }
    });

    return {
      walletId: wallet.id,
      currency,
      accountDetails: details
    };
  }
}
