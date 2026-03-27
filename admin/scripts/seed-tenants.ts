import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const tenants = [
  {
    slug: "kellycars",
    name: "KellyCars",
    domain: "kellycars.cz",
  },
];

async function main() {
  for (const tenant of tenants) {
    const result = await prisma.tenant.upsert({
      where: { slug: tenant.slug },
      update: { name: tenant.name, domain: tenant.domain },
      create: tenant,
    });
    console.log(`Tenant "${result.name}" (${result.slug}) — id: ${result.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
