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

    const isAfricanFiat = ['NGN', 'EUR', 'GBP', 'USD', 'KES', 'GHS', 'UGX', 'RWF', 'XAF', 'XOF', 'TZS'].includes(currency);
    const isCrypto = ['BTC', 'USDT', 'USDC'].includes(currency);

    if (isAfricanFiat) {
       try {
          console.log(`🏦 Calling Maplerad for ${currency} rails...`);
          
          // A. Create/Get Maplerad Customer
          const customer = await Maplerad.createCustomer(
             user.firstName || "Customer", 
             user.lastName || userId.substring(0, 5), 
             user.email
          );

          // B. Upgrade Customer to Tier 1 KYC (Required for many virtual accounts)
          if (bvn || (kycData && kycData.bvn)) {
             console.log(`[MAPLERAD DEBUG] Upgrading Customer ${customer.id} to Tier 1...`);
             await Maplerad.upgradeCustomerTier1(customer.id, kycData || { bvn: bvn });
          }

          // C. Issue Account
          const apiData = await Maplerad.issueVirtualAccount(customer.id, currency);
          
          details = {
             accountHolder: `${user.firstName} ${user.lastName}`,
             iban: apiData.account_number,
             accountNumber: apiData.account_number,
             bic: apiData.bank_code || apiData.routing_number || 'MAPL',
             bankName: apiData.bank_name || `${currency} Settlement Bank`,
             provider: 'Maplerad',
             extRef: apiData.id || apiData.reference || apiData.account_number
          };
       } catch (err: any) {
          console.error(`❌ Maplerad ${currency} Provisioning failed:`, err.message);
          throw err; 
       }
    } else if (isCrypto) {
       try {
          console.log(`🏦 Calling Maplerad for ${currency} crypto address...`);
          
          // A. Create/Get Maplerad Customer
          const customer = await Maplerad.createCustomer(
             user.firstName || "Customer", 
             user.lastName || userId.substring(0, 5), 
             user.email
          );

          // B. Issue Crypto Address
          const apiData = await Maplerad.issueCryptoAddress(customer.id, currency);
          
          details = {
             address: apiData.address,
             network: apiData.network || (currency === 'BTC' ? 'Bitcoin' : 'ERC20'),
             provider: 'Maplerad Crypto',
             note: 'Deposit only to this address'
          };
       } catch (err: any) {
          console.error(`❌ Maplerad ${currency} Crypto Provisioning failed:`, err.message);
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

  private static reconciliationCooldowns = new Map<string, number>();

  /**
   * Reconciles user wallets by fetching external transactions and verifying local state.
   * This is a "healing" function to catch missed webhooks or failed provisioning.
   */
  static async reconcileUserWallets(userId: string) {
    const now = Date.now();
    const lastRun = this.reconciliationCooldowns.get(userId) || 0;
    const cooldown = 30 * 60 * 1000; // 30 minutes cooldown

    if (now - lastRun < cooldown) {
      // Skip if reconciled recently
      return;
    }

    this.reconciliationCooldowns.set(userId, now);
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

      // 3. Fetch all virtual accounts & crypto wallets for this customer from Maplerad
      console.log(`[RECONCILE] Fetching virtual accounts and crypto wallets for customer ${customer.id}...`);
      const externalAccounts = await Maplerad.getCustomerVirtualAccounts(customer.id);
      
      let cryptoAccounts: any[] = [];
      try {
         cryptoAccounts = await Maplerad.getCryptoAddresses(customer.id);
         console.log(`[RECONCILE] Found ${cryptoAccounts?.length || 0} crypto accounts.`);
      } catch (e: any) {
         console.warn(`[RECONCILE] Failed to fetch crypto accounts: ${e.message}`);
      }

      const allAccounts = [...(externalAccounts || []), ...(cryptoAccounts || [])];

      // 4. Update missing metadata in local wallets
      for (const extAcc of allAccounts) {
        // Crypto uses `coin` or `currency`, Fiat uses `currency`
        const accountCurrency = (extAcc.currency || extAcc.coin || '').toUpperCase();
        if (!accountCurrency) continue;

        const wallet = user.wallets.find(w => w.currency === accountCurrency);
        if (wallet) {
          const currentMeta = typeof wallet.metadata === 'string' ? JSON.parse(wallet.metadata) : wallet.metadata;
          
          const isCrypto = ['BTC', 'USDT', 'USDC'].includes(accountCurrency);
          const needsFiatUpdate = !isCrypto && (!currentMeta || (!currentMeta.iban && !currentMeta.account_number));
          const needsCryptoUpdate = isCrypto && (!currentMeta || (!currentMeta.address && !currentMeta.wallet_address));

          // If metadata is missing or account details are not there, update it
          if (needsFiatUpdate || needsCryptoUpdate) {
            console.log(`[RECONCILE] Fixing missing metadata for ${wallet.currency} wallet...`);
            
            let newMeta = { ...currentMeta };
            if (isCrypto) {
                newMeta.address = extAcc.address || extAcc.wallet_address;
                newMeta.network = extAcc.network || extAcc.chain;
                newMeta.provider = 'Maplerad Crypto';
            } else {
                newMeta.accountHolder = `${user.firstName} ${user.lastName}`;
                newMeta.iban = extAcc.account_number;
                newMeta.account_number = extAcc.account_number;
                newMeta.bankName = extAcc.bank_name;
                newMeta.bankCode = extAcc.bank_code;
                newMeta.provider = 'Maplerad';
            }
            newMeta.reconciledAt = new Date().toISOString();

            await prisma.wallet.update({
              where: { id: wallet.id },
              data: { metadata: newMeta }
            });
            // Update the local reference for the next step
            wallet.metadata = newMeta; 
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

      // Filter transactions that belong to this user's accounts
      const userIdentifiers = allAccounts.map((a: any) => String(a.account_number || a.address || a.wallet_address));

      const relevantTxs = externalTxs.filter((tx: any) => {
        const txCurrency = tx.currency || tx.coin || '';
        const txAcc = String(tx.account_number || tx.virtual_account_number || tx.virtual_account?.account_number || tx.meta?.account_number || tx.meta?.virtual_account_number || tx.address || tx.wallet_address || '');
        const isMatch = userIdentifiers.includes(txAcc);
        
        if (!isMatch && tx.type === 'COLLECTION') {
            // For collection transactions, sometimes they just belong to the customer
            // If the user has only one account for this currency, we can safely attribute it
            const userCurrencyAccounts = allAccounts.filter((a: any) => (a.currency || a.coin) === txCurrency);
            if (userCurrencyAccounts.length === 1) {
                console.log(`[RECONCILE] Match found by currency attribution for ${txCurrency} collection.`);
                return true;
            }
        }
        return isMatch;
      });

      console.log(`[RECONCILE] Found ${relevantTxs.length} relevant transactions for this user's accounts.`);

      for (const tx of relevantTxs) {
        await prisma.$transaction(async (txPrisma) => {
          const ref = `MAPLE_${tx.id || tx.reference}`;
          
          // Check if transaction already exists locally
          const existingTx = await txPrisma.transaction.findUnique({
            where: { reference: ref }
          });

          if (existingTx) return;

          const txCurrency = (tx.currency || tx.coin || '').toUpperCase();
          const isCrypto = ['BTC', 'USDT', 'USDC'].includes(txCurrency);
          let amount = Number(tx.amount || 0);
          if (!isCrypto) {
              amount = amount / 100; // Maplerad fiat is always in minor units
          }

          const wallet = user.wallets.find(w => w.currency === txCurrency);
          
          if (!wallet) return;

          console.log(`[RECONCILE] Processing missed transaction ${tx.id} for ${amount} ${txCurrency}`);

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
