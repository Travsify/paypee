import { PrismaClient, Currency } from '@prisma/client';

const prisma = new PrismaClient();

export class IbanService {
  /**
   * Provisions a new virtual global account for a user.
   */
  static async provisionGlobalAccount(userId: string, currency: 'EUR' | 'GBP' | 'CNY') {
    console.log(`🌍 Provisioning ${currency} IBAN for User ${userId}...`);

    // In a real scenario, this would call Fincra / Currencycloud / Sudo
    const prefixes: Record<string, string> = {
      EUR: 'BE89',
      GBP: 'GB21',
      CNY: 'CN38'
    };

    const iban = prefixes[currency] + Math.random().toString().slice(2, 14);
    const bic = 'PAYPBEBB';
    const bankName = 'Paypee Global Clearing';

    // 1. Create the wallet if it doesn't exist
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        currency: currency as Currency,
        balance: 0.00,
        // We stores the IBAN in metadata for now or we could extend the schema
      }
    });

    // We'll store the IBAN details in a special transaction or metadata log
    // For this MVP, we return the details to the UI
    return {
      walletId: wallet.id,
      currency,
      accountDetails: {
        accountHolder: "Paypee / TechStream Ltd",
        iban: iban,
        bic: bic,
        bankName: bankName,
        address: "123 Fintech Lane, Brussels, Belgium"
      }
    };
  }
}
