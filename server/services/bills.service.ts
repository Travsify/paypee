import { PrismaClient, TransactionType } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const FINCRA_SECRET_KEY = process.env.FINCRA_SECRET_KEY;

export class BillsService {
  /**
   * Fetches available bill providers from Fincra.
   */
  static async getProviders(category: string) {
    console.log(`📡 Fetching billers for category: ${category}...`);
    
    try {
      const fincraUrl = process.env.FINCRA_ENV === 'live' 
        ? 'https://api.fincra.com/core/bills/categories' 
        : 'https://sandboxapi.fincra.com/core/bills/categories';

      const response = await axios.get(fincraUrl, {
        headers: {
          'api-key': FINCRA_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      });
      // Extract providers depending on Fincra's exact schema
      return response.data.data || [];
    } catch (err: any) {
      console.error(`❌ API Failed to fetch bill providers for ${category}:`, err.response?.data || err.message);
      throw new Error(`Failed to fetch live bill providers from API.`);
    }
  }

  /**
   * Executes a bill payment transaction.
   */
  static async payBill(userId: string, data: { walletId: string, amount: number, providerId: string, customerId: string, category: string }) {
    const { walletId, amount, providerId, customerId, category } = data;

    return await prisma.$transaction(async (tx) => {
      // 1. Check wallet balance
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
      if (!wallet || Number(wallet.balance) < amount) {
        throw new Error('Insufficient funds for bill payment');
      }

      // 2. Debit wallet
      await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } }
      });

      // 3. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          walletId,
          type: 'WITHDRAWAL', // Bills are debits
          amount,
          currency: wallet.currency,
          status: 'COMPLETED',
          reference: `BILL_${category}_${Date.now()}`,
          category: 'BILLS',
          metadata: {
             bill_type: category,
             provider_id: providerId,
             customer_identifier: customerId
          }
        }
      });

      // 4. Trigger Fincra's /bills/pay endpoint
      try {
        const fincraUrl = process.env.FINCRA_ENV === 'live' 
          ? 'https://api.fincra.com/core/bills/pay' 
          : 'https://sandboxapi.fincra.com/core/bills/pay';

        await axios.post(fincraUrl, {
            amount: amount,
            customer: customerId,
            item_id: providerId,
            bill_id: category === 'AIRTIME' ? '1' : '2', // Mapping depends on Fincra's catalog
            reference: transaction.reference
        }, {
            headers: {
                'api-key': process.env.FINCRA_SECRET_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`✅ [FINCRA SETTLED]: User ${userId} airtime/bill finalized.`);
      } catch (fincraErr: any) {
        console.error('[FINCRA BILL ERROR]:', fincraErr.response?.data || fincraErr.message);
        // In a real production app, you might want to reverse the wallet debit if this fails
        // but often we mark it as PENDING and retry via a background job.
        throw new Error('Fincra was unable to process this payment at this time.');
      }

      return transaction;
    });
  }
}
