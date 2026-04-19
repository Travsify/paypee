import { PrismaClient } from '@prisma/client';
import * as Maplerad from './maplerad';
import { NotificationService } from './notification.service';

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
      if (!wallet) throw new Error('Wallet not found');

      // 1b. Calculate deduction amount in wallet currency
      // Note: Maplerad bill amounts (like airtime) are usually locally denominated (e.g. NGN)
      // The 'amount' parameter is the NGN value to pay the biller.
      let deductionAmount = amount;
      if (wallet.currency !== 'NGN') {
        console.log(`[BILLS] Wallet is ${wallet.currency}, Bill is NGN. Calculating FX equivalent for ${amount} NGN...`);
        const fx = await Maplerad.getExchangeRate(wallet.currency, 'NGN');
        
        // Ensure rate is valid. If maplerad gives a rate of 1.0 (fallback) and we divide, it might be heavily skewed.
        // But the user expects live conversion. Maplerad returns how much 1 source = target.
        if (fx.rate <= 0) throw new Error('Invalid exchange rate received from provider');
        
        deductionAmount = Number((amount / fx.rate).toFixed(4));
        console.log(`[BILLS] ${amount} NGN / ${fx.rate} = ${deductionAmount} ${wallet.currency}`);
      }

      if (Number(wallet.balance) < deductionAmount) {
        throw new Error(`Insufficient funds. Required: ${deductionAmount} ${wallet.currency}`);
      }

      // 2. Debit wallet using the calculated deduction amount
      await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: deductionAmount } }
      });

      // 3. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          walletId,
          type: 'WITHDRAWAL',
          amount: deductionAmount, // Record the actual amount deducted from their wallet
          currency: wallet.currency,
          status: 'COMPLETED',
          reference: `BILL_${category}_${Date.now()}`,
          category: 'BILLS',
          metadata: {
             bill_type: category,
             provider_id: providerId,
             product_id: productId,
             customer_identifier: customerId,
             local_amount_paid: amount,
             local_currency: 'NGN'
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

      await NotificationService.create(
        userId,
        '🧾 Bill Payment Successful',
        `Your payment of ${amount} NGN for ${category} was successful.`,
        'SUCCESS'
      );

      return transaction;
    });
  }
}
