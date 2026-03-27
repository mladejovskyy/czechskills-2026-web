"use server";

import { prisma } from "@/lib/prisma";

export async function getCategoriesByTenant(tenantId: string) {
  return prisma.category.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: {
  tenantId: string;
  name: string;
  slug: string;
}) {
  return prisma.category.create({ data });
}
