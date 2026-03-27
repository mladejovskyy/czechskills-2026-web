"use server";

import { prisma } from "@/lib/prisma";

export async function getTagsByTenant(tenantId: string) {
  return prisma.tag.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createTag(data: {
  tenantId: string;
  name: string;
  slug: string;
}) {
  return prisma.tag.create({ data });
}
