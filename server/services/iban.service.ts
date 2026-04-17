import { PrismaClient, Currency } from '@prisma/client';
import * as Maplerad from './maplerad';

const prisma = new PrismaClient();

export class IbanService {
  /**
   * Provisions a new virtual global account for a user.
   */
  static async provisionGlobalAccount(userId: string, currency: string, userName?: string, bvn?: string, kycData?: any) {
    console.log(`🌍 [MAPLERAD] Provisioning ${currency} account for User ${userId}...`);

    // 1. Fetch user to ensure we have email and names
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // 2. Check if the user already has a wallet in this currency
    const existingWallet = await prisma.wallet.findFirst({
        where: { userId, currency: currency as Currency }
    });

    if (existingWallet && existingWallet.metadata && (existingWallet.metadata as any).account_number) {
        return {
            walletId: existingWallet.id,
            currency,
            isExisting: true,
            accountDetails: existingWallet.metadata
        };
    }

    // 3. Provision external details from Maplerad API
    let details: any = null;

    if (['NGN', 'EUR', 'GBP', 'USD'].includes(currency)) {
       try {
          console.log(`🏦 Calling Maplerad for real ${currency} rails...`);
          
          // A. Create/Get Maplerad Customer
          const customer = await Maplerad.createCustomer(
             user.firstName || "Customer", 
             user.lastName || userId.substring(0, 5), 
             user.email
          );

          // B. Upgrade Customer to Tier 1 KYC (Required for NGN Accounts)
          if (bvn || (kycData && kycData.bvn)) {
             console.log(`[MAPLERAD DEBUG] Upgrading Customer ${customer.id} to Tier 1 using provided KYC data...`);
             await Maplerad.upgradeCustomerTier1(customer.id, kycData || { bvn: bvn });
          } else {
             console.log(`[MAPLERAD WARNING] No BVN provided. Maplerad may block virtual account creation if customer is not Tier 1.`);
          }

          // C. Issue Account
          const apiData = await Maplerad.issueVirtualAccount(customer.id, currency);
          
          details = {
             accountHolder: `${user.firstName} ${user.lastName}`,
             iban: apiData.account_number,
             bic: apiData.bank_code || '0000',
             bankName: apiData.bank_name || 'Standard Chartered',
             provider: 'Maplerad',
             extRef: apiData.id || apiData.reference || apiData.account_number
          };
       } catch (err: any) {
          console.error(`❌ Maplerad ${currency} Provisioning failed:`, err.message);
          throw err; 
       }
    } else {
       throw new Error(`Maplerad provisioning is not yet supported for ${currency}.`);
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
