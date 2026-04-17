import { PrismaClient } from '@prisma/client';
import * as Maplerad from './maplerad';

const prisma = new PrismaClient();

export class BillsService {
  /**
   * Fetches available bill providers from Maplerad.
   */
  static async getProviders(category: string) {
    console.log(`📡 Fetching Maplerad billers for category: ${category}...`);
    
    try {
      const normalized = category.toLowerCase();
      let mappedCategory = normalized;
      
      if (normalized === 'electricity' || normalized === 'utility') {
        mappedCategory = 'utility';
      } else if (normalized === 'tv' || normalized === 'cable') {
        mappedCategory = 'cable';
      }
      
      let billers = await Maplerad.getBillers(mappedCategory);
      
      // Fallback for electricity if 'utility' returns nothing (some regions use 'power')
      if (billers.length === 0 && mappedCategory === 'utility') {
         console.log('⚠️ Maplerad returned no billers for "utility", trying "power"...');
         billers = await Maplerad.getBillers('power');
      }

      // Fallback for cable if 'cable' returns nothing (some regions use 'tv')
      if (billers.length === 0 && mappedCategory === 'cable') {
         console.log('⚠️ Maplerad returned no billers for "cable", trying "tv"...');
         billers = await Maplerad.getBillers('tv');
      }
      
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

      // 4. Trigger Maplerad's bill payment
      try {
        await Maplerad.payBill({
          biller_id: providerId,
          product_id: productId,
          amount: amount,
          customer_id: customerId
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
