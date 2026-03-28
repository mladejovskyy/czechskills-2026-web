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

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function findOrCreateTag(tenantId: string, name: string) {
  const slug = slugify(name);
  const existing = await prisma.tag.findUnique({
    where: { tenantId_slug: { tenantId, slug } },
  });
  if (existing) return existing;
  return prisma.tag.create({ data: { tenantId, name, slug } });
}
