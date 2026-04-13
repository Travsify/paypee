import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.wallet.deleteMany({});
  console.log('Deleted all wallets:', result.count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
