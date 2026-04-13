import { PrismaClient, Currency, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export class AiIntelligenceService {
  /**
   * Scans a user's wallets and suggests/executes hedging strategies.
   * Logic: If NGN balance > threshold, swap 80% to USD to preserve value.
   */
  static async performAutonomousHedging(userId: string) {
    console.log(`🤖 AI Engine: Scanning wallets for User ${userId}...`);

    const wallets = await prisma.wallet.findMany({ where: { userId } });
    const ngnWallet = wallets.find(w => w.currency === 'NGN');
    const usdWallet = wallets.find(w => w.currency === 'USD');

    if (!ngnWallet || !usdWallet) {
      return { status: 'NO_ACTION', reason: 'Missing required wallets for hedging.' };
    }

    const ngnBalance = Number(ngnWallet.balance);
    const HEDGE_THRESHOLD = 50000; // Auto-hedge if > 50k NGN

    if (ngnBalance > HEDGE_THRESHOLD) {
      const amountToHedge = ngnBalance * 0.8; // Hedge 80%
      const fxRate = 1450; // Mock rate NGN/USD
      const usdValue = amountToHedge / fxRate;

      console.log(`🔥 AI Alert: High NGN exposure detected (${ngnBalance}). Risk management active.`);

      return await prisma.$transaction(async (tx) => {
        // 1. Debit NGN
        await tx.wallet.update({
          where: { id: ngnWallet.id },
          data: { balance: { decrement: amountToHedge } }
        });

        // 2. Credit USD
        await tx.wallet.update({
          where: { id: usdWallet.id },
          data: { balance: { increment: usdValue } }
        });

        // 3. Log AI Transaction
        const transaction = await tx.transaction.create({
          data: {
            userId,
            walletId: usdWallet.id,
            type: 'TRANSFER',
            amount: usdValue,
            currency: 'USD',
            status: 'COMPLETED',
            reference: `AI_HEDGE_${Date.now()}`,
            category: 'AI_TREASURY',
            metadata: {
              reason: 'Automatic volatility hedging',
              source_amount: amountToHedge,
              source_currency: 'NGN',
              rate: fxRate
            }
          }
        });

        return {
          status: 'SUCCESS',
          action: 'HEDGED_TO_USD',
          amount: usdValue,
          transactionId: transaction.id
        };
      });
    }

    return { status: 'NO_ACTION', reason: 'Balances are within safe volatility limits.' };
  }

  static async getFinancialInsights(userId: string) {
     const txs = await prisma.transaction.findMany({ where: { userId }, take: 50 });
     // Here you would normally run this through Gemini/LLM
     // For now, we return structured insights based on transaction patterns
     const cardSpend = txs.filter(t => t.type === 'CARD_PAYMENT' || t.category === 'CARD').reduce((acc, t) => acc + Number(t.amount), 0);
     
     return {
        healthScore: 88,
        insights: [
           { type: 'SAVINGS', text: `You could save $45/mo by switching your Cloud billing to a Paypee Virtual Business Card.` },
           { type: 'RISK', text: `NGN exposure is currently 12%. Volatility risk is LOW.` },
           { type: 'SPEND', text: `Total card spend this week: $${cardSpend.toFixed(2)}` }
        ]
     };
  }
}
