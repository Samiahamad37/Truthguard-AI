import { PrismaClient } from "@prisma/client";
import { seedReports } from "../lib/seed-reports";

const prisma = new PrismaClient();

async function main() {
  await seedReports(prisma);
  console.log("Database seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
