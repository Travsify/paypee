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
    
    // In production, you would hit Fincra's bills endpoint
    // For this build, we return the high-fidelity provider list for Nigeria
    const mockProviders: Record<string, any[]> = {
       AIRTIME: [
          { id: '1', name: 'MTN Nigeria', fee: 0, icon: 'Zap' },
          { id: '2', name: 'Airtel Nigeria', fee: 0, icon: 'Zap' },
          { id: '3', name: 'Glo Nigeria', fee: 0, icon: 'Zap' }
       ],
       UTILITY: [
          { id: '10', name: 'EKEDC (Lagos)', fee: 100, icon: 'Activity' },
          { id: '11', name: 'IKEDC (Lagos)', fee: 100, icon: 'Activity' }
       ],
       CABLE: [
          { id: '20', name: 'DSTV Nigeria', fee: 100, icon: 'Tv' },
          { id: '21', name: 'GOTV Nigeria', fee: 100, icon: 'Tv' }
       ],
       BETTING: [
          { id: '30', name: 'Bet9ja', fee: 50, icon: 'Trophy' },
          { id: '31', name: 'SportyBet', fee: 50, icon: 'Trophy' }
       ]
    };

    return mockProviders[category.toUpperCase()] || [];
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
