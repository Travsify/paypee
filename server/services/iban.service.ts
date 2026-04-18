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

  /**
   * Reconciles user wallets by fetching external transactions and verifying local state.
   * This is a "healing" function to catch missed webhooks or failed provisioning.
   */
  static async reconcileUserWallets(userId: string) {
    console.log(`[RECONCILE] Starting reconciliation for user ${userId}...`);
    
    try {
      // 1. Fetch user and their wallets
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { wallets: true }
      });

      if (!user) throw new Error("User not found for reconciliation");

      // 2. Fetch Maplerad Customer ID (idempotent)
      const customer = await Maplerad.createCustomer(
        user.firstName || "Customer",
        user.lastName || "Paypee",
        user.email
      );

      if (!customer?.id) {
        console.warn(`[RECONCILE] Could not find Maplerad customer for ${user.email}`);
        return;
      }

      // 3. Fetch all virtual accounts for this customer from Maplerad
      console.log(`[RECONCILE] Fetching virtual accounts for customer ${customer.id}...`);
      const externalAccounts = await Maplerad.getCustomerVirtualAccounts(customer.id);
      
      // 4. Update missing metadata in local wallets
      for (const extAcc of externalAccounts) {
        const wallet = user.wallets.find(w => w.currency === extAcc.currency);
        if (wallet) {
          const currentMeta = typeof wallet.metadata === 'string' ? JSON.parse(wallet.metadata) : wallet.metadata;
          
          // If metadata is missing or account number is not there, update it
          if (!currentMeta || (!currentMeta.iban && !currentMeta.account_number)) {
            console.log(`[RECONCILE] Fixing missing metadata for ${wallet.currency} wallet...`);
            await prisma.wallet.update({
              where: { id: wallet.id },
              data: {
                metadata: {
                  ...currentMeta,
                  accountHolder: `${user.firstName} ${user.lastName}`,
                  iban: extAcc.account_number,
                  account_number: extAcc.account_number,
                  bankName: extAcc.bank_name,
                  bankCode: extAcc.bank_code,
                  provider: 'Maplerad',
                  reconciledAt: new Date().toISOString()
                }
              }
            });
            // Update the local reference for the next step
            wallet.metadata = { iban: extAcc.account_number, account_number: extAcc.account_number }; 
          }
        }
      }

      // 5. Fetch external transactions (latest 50) for this specific customer
      let externalTxs = await Maplerad.getTransactions(customer.id);
      
      if (!Array.isArray(externalTxs) || externalTxs.length === 0) {
        console.log(`[RECONCILE] Customer-specific lookup returned 0. Trying global platform lookup...`);
        externalTxs = await Maplerad.getTransactions(); // Global
      }

      if (!Array.isArray(externalTxs)) {
        console.log(`[RECONCILE] Maplerad returned non-array transactions:`, externalTxs);
        return;
      }

      console.log(`[RECONCILE] Total external transactions to scan: ${externalTxs.length}`);
      
      if (externalTxs.length > 0) {
          console.log(`[RECONCILE] DEBUG: Local accounts being checked: ${externalAccounts.map((a: any) => a.account_number).join(', ')}`);
          const sampleTx = externalTxs[0];
          console.log(`[RECONCILE] DEBUG: Sample External TX data: ${JSON.stringify({
              id: sampleTx.id,
              amount: sampleTx.amount,
              acc: sampleTx.account_number,
              metaAcc: sampleTx.meta?.account_number,
              type: sampleTx.type
          })}`);
      }

      // Filter transactions that belong to this user's accounts
      const userAccNumbers = externalAccounts.map((a: any) => a.account_number);
      const relevantTxs = externalTxs.filter((tx: any) => 
        userAccNumbers.includes(tx.account_number) || 
        userAccNumbers.includes(tx.virtual_account_number)
      );

      console.log(`[RECONCILE] Found ${relevantTxs.length} relevant transactions for this user's accounts.`);

      for (const tx of relevantTxs) {
        await prisma.$transaction(async (txPrisma) => {
          const ref = `MAPLE_${tx.id || tx.reference}`;
          
          // Check if transaction already exists locally
          const existingTx = await txPrisma.transaction.findUnique({
            where: { reference: ref }
          });

          if (existingTx) return;

          const amount = tx.amount / 100;
          const wallet = user.wallets.find(w => w.currency === tx.currency);
          
          if (!wallet) return;

          console.log(`[RECONCILE] Processing missed transaction ${tx.id} for ${amount} ${tx.currency}`);

          // Create transaction record
          await txPrisma.transaction.create({
            data: {
              userId,
              walletId: wallet.id,
              type: 'DEPOSIT',
              amount: amount,
              currency: tx.currency as any,
              status: 'COMPLETED',
              reference: ref,
              category: 'TRANSFER',
              metadata: { source: 'RECONCILIATION', externalData: tx }
            }
          });

          // Update wallet balance
          await txPrisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: amount } }
          });

          // Create notification
          await txPrisma.notification.create({
            data: {
              userId,
              title: 'Funds Reconciled',
              message: `Your ${tx.currency} wallet was credited with ${amount} from a previous settlement.`,
              type: 'SUCCESS'
            }
          });
        });
      }

      console.log(`[RECONCILE] Completed successfully for user ${userId}.`);
    } catch (error: any) {
      console.error(`[RECONCILE] Error:`, error.message);
    }
  }
}
