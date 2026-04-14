const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚠️  Wiping ALL data from database...\n');

  // Delete in order to respect foreign key constraints (children first)
  const del1 = await prisma.notification.deleteMany();
  console.log(`  Notifications deleted: ${del1.count}`);

  const del2 = await prisma.transaction.deleteMany();
  console.log(`  Transactions deleted: ${del2.count}`);

  const del3 = await prisma.virtualCard.deleteMany();
  console.log(`  Virtual cards deleted: ${del3.count}`);

  const del4 = await prisma.apiKey.deleteMany();
  console.log(`  API keys deleted: ${del4.count}`);

  const del5 = await prisma.paymentLink.deleteMany();
  console.log(`  Payment links deleted: ${del5.count}`);

  const del6 = await prisma.teamMember.deleteMany();
  console.log(`  Team members deleted: ${del6.count}`);

  const del7 = await prisma.vault.deleteMany();
  console.log(`  Vaults deleted: ${del7.count}`);

  const del8 = await prisma.wallet.deleteMany();
  console.log(`  Wallets deleted: ${del8.count}`);

  const del9 = await prisma.user.deleteMany();
  console.log(`  Users deleted: ${del9.count}`);

  console.log('\n✅ ALL DATA WIPED SUCCESSFULLY — Database is clean for fresh testing.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
