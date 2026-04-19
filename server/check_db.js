require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const txs = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: true }
  });
  console.log('Recent Txs:', JSON.stringify(txs, null, 2));

  const swaps = await prisma.fxSwap.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2
  });
  console.log('Recent Swaps:', JSON.stringify(swaps, null, 2));

  if (txs.length > 0) {
    const wallets = await prisma.wallet.findMany({
      where: { userId: txs[0].userId, currency: 'USD' }
    });
    console.log('USD Wallet:', wallets);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
