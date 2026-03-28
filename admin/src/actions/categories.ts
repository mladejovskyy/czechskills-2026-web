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

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string }
) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

export async function getCategoryWithPostCount(tenantId: string) {
  return prisma.category.findMany({
    where: { tenantId },
    include: { _count: { select: { blogPosts: true } } },
    orderBy: { name: "asc" },
  });
}
