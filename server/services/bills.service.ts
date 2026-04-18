import { PrismaClient } from '@prisma/client';
import * as Maplerad from './maplerad';

const prisma = new PrismaClient();

export class BillsService {
  /**
   * Fetches available bill providers from Maplerad.
   * Uses the correct per-category endpoint: /bills/{category}/billers/{country}
   */
  static async getProviders(category: string) {
    console.log(`📡 Fetching Maplerad billers for category: ${category}...`);
    
    try {
      const billers = await Maplerad.getBillers(category);
      return billers || [];
    } catch (err: any) {
      console.error(`❌ Maplerad Failed to fetch bill providers for ${category}:`, err.message);
      throw new Error(`Failed to fetch live bill providers.`);
    }
  }

  /**
   * Fetches products for a specific biller.
   */
  static async getProducts(billerId: string) {
    try {
      return await Maplerad.getBillerProducts(billerId);
    } catch (err: any) {
      console.error(`❌ Maplerad Failed to fetch products for biller ${billerId}:`, err.message);
      return [];
    }
  }

  /**
   * Executes a bill payment transaction via Maplerad.
   * Now routes through the correct category-specific endpoint.
   */
  static async payBill(userId: string, data: { walletId: string, amount: number, providerId: string, productId: string, customerId: string, category: string }) {
    const { walletId, amount, providerId, productId, customerId, category } = data;

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
          type: 'WITHDRAWAL',
          amount,
          currency: wallet.currency,
          status: 'COMPLETED',
          reference: `BILL_${category}_${Date.now()}`,
          category: 'BILLS',
          metadata: {
             bill_type: category,
             provider_id: providerId,
             product_id: productId,
             customer_identifier: customerId
          }
        }
      });

      // 4. Trigger Maplerad's bill payment via the correct category-specific endpoint
      try {
        await Maplerad.payBill({
          category: category,
          biller_id: providerId,
          product_id: productId,
          amount: amount,
          phone_number: customerId,
          meter_number: customerId,
          smartcard_number: customerId,
          identifier: providerId
        });
        
        console.log(`✅ [MAPLERAD SETTLED]: User ${userId} ${category} finalized.`);
      } catch (err: any) {
        console.error('[MAPLERAD BILL ERROR]:', err.message);
        throw new Error(err.message || 'Maplerad was unable to process this payment.');
      }

      return transaction;
    });
  }
}
