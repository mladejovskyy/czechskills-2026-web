import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const users = [
  {
    username: "mladejovsky",
    name: "Tomáš Mladějovský",
    password: "adminpass",
    tenantSlugs: ["kellycars"],
  },
];

async function main() {
  for (const { tenantSlugs, password, ...data } of users) {
    const hashedPassword = await Bun.password.hash(password, "bcrypt");

    const user = await prisma.user.upsert({
      where: { username: data.username },
      update: { name: data.name, password: hashedPassword },
      create: { ...data, password: hashedPassword },
    });

    for (const slug of tenantSlugs) {
      const tenant = await prisma.tenant.findUniqueOrThrow({
        where: { slug },
      });

      await prisma.userTenant.upsert({
        where: {
          userId_tenantId: { userId: user.id, tenantId: tenant.id },
        },
        update: {},
        create: { userId: user.id, tenantId: tenant.id },
      });

      console.log(`User "${user.username}" linked to tenant "${slug}"`);
    }

    console.log(`User "${user.username}" — id: ${user.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
