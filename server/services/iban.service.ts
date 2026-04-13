import { PrismaClient, Currency } from '@prisma/client';

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

    if (existingWallet) {
        let details = (existingWallet.metadata as any);
        if (!details) {
           console.log(`🔧 Patching missing metadata for Wallet ${existingWallet.id}...`);
           const iban = (prefixes[currency] || 'PP00') + Math.random().toString().slice(2, 14);
           details = {
               accountHolder: userName || "Paypee / TechStream Ltd",
               iban: iban,
               bic: 'PAYPBEBB',
               bankName: 'Paypee Global Clearing',
               address: "123 Fintech Lane, Brussels, Belgium"
           };
           await prisma.wallet.update({
               where: { id: existingWallet.id },
               data: { metadata: details }
           });
        }
        return {
            walletId: existingWallet.id,
            currency,
            isExisting: true,
            accountDetails: details
        };
    }

    // In a real scenario, this would call Fincra / Currencycloud / Sudo

    const iban = (prefixes[currency] || 'PP00') + Math.random().toString().slice(2, 14);
    const bic = 'PAYPBEBB';
    const bankName = 'Paypee Global Clearing';

    // 2. Create the wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        currency: currency as Currency,
        balance: 0.00,
        metadata: {
           accountHolder: userName || "Paypee / TechStream Ltd",
           iban: iban,
           bic: bic,
           bankName: bankName,
           address: "123 Fintech Lane, Brussels, Belgium"
        }
      }
    });

    return {
      walletId: wallet.id,
      currency,
      accountDetails: {
        accountHolder: userName || "Paypee / TechStream Ltd",
        iban: iban,
        bic: bic,
        bankName: bankName,
        address: "123 Fintech Lane, Brussels, Belgium"
      }
    };
  }
}
