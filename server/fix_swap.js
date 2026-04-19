const { PrismaClient } = require('@prisma/client');
process.env.DATABASE_URL = "postgresql://postgres.opoohtizedtonmzxpgtg:Forgetpassword2024.@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient();

async function main() {
  const swaps = await prisma.fxSwap.findMany({
    where: { targetAmount: 0 },
    orderBy: { createdAt: 'desc' }
  });
  
  for (const swap of swaps) {
    if (swap.targetAmount === 0 && swap.status === 'COMPLETED') {
      const correctTargetAmount = swap.sourceAmount * swap.rate;
      console.log(`Fixing swap ${swap.id}: 0 -> ${correctTargetAmount}`);
      
      // Update the swap record
      await prisma.fxSwap.update({
        where: { id: swap.id },
        data: { targetAmount: correctTargetAmount }
      });
      
      // Credit the target wallet
      const wallet = await prisma.wallet.findFirst({
        where: { userId: swap.userId, currency: swap.targetCurrency }
      });
      
      if (wallet) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: correctTargetAmount } }
        });
        console.log(`Credited wallet ${wallet.id} with ${correctTargetAmount} ${swap.targetCurrency}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
