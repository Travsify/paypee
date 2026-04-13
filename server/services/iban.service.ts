import { PrismaClient, Currency } from '@prisma/client';
import { issueVirtualAccount } from './fincra';

const prisma = new PrismaClient();

export class IbanService {
  /**
   * Provisions a new virtual global account for a user.
   */
  static async provisionGlobalAccount(userId: string, currency: string, userName?: string) {
    console.log(`🌍 Provisioning ${currency} account for User ${userId}...`);

    const prefixes: Record<string, string> = {
      EUR: 'BE89',
      GBP: 'GB21',
      CNY: 'CN38',
      USD: 'US11',
      NGN: 'NG55',
      BTC: 'BC11'
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

    // 2. Provision external details
    let details: any = null;

    if (currency === 'NGN') {
       try {
          console.log(`🇳🇬 Calling Fincra for real NGN rails...`);
          const fincraData = await issueVirtualAccount(userName || "Valued Customer", 'NGN');
          details = {
             accountHolder: fincraData.accountName || userName || "Paypee Local Node",
             iban: fincraData.accountNumber,
             bic: fincraData.bankCode || '0000',
             bankName: fincraData.bankName || 'Paypee Clearing',
             address: "Lagos, Nigeria"
          };
       } catch (err) {
          console.error(`❌ Fincra NGN Provisioning failed:`, err);
          // Fallback to mock if it fails? User said live is what we use.
          throw err; 
       }
    } else {
       // Mock for other rails for now
       const iban = (prefixes[currency] || 'PP00') + Math.random().toString().slice(2, 14);
       details = {
           accountHolder: userName || "Paypee / TechStream Ltd",
           iban: iban,
           bic: 'PAYPBEBB',
           bankName: 'Paypee Global Clearing',
           address: "123 Fintech Lane, Brussels, Belgium"
       };
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
