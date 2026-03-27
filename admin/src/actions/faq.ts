"use server";

import { prisma } from "@/lib/prisma";

// ─── Categories ─────────────────────────────────────────────

type CreateFaqCategoryInput = {
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDesc?: string;
  sortOrder?: number;
};

type UpdateFaqCategoryInput = Partial<Omit<CreateFaqCategoryInput, "tenantId">>;

export async function getFaqCategoriesByTenant(tenantId: string) {
  return prisma.faqCategory.findMany({
    where: { tenantId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFaqCategory(id: string) {
  return prisma.faqCategory.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function createFaqCategory(data: CreateFaqCategoryInput) {
  return prisma.faqCategory.create({ data });
}

export async function updateFaqCategory(id: string, data: UpdateFaqCategoryInput) {
  return prisma.faqCategory.update({ where: { id }, data });
}

export async function deleteFaqCategory(id: string) {
  return prisma.faqCategory.delete({ where: { id } });
}

// ─── Items ──────────────────────────────────────────────────

type CreateFaqItemInput = {
  tenantId: string;
  faqCategoryId: string;
  question: string;
  slug: string;
  answer: string;
  metaTitle?: string;
  metaDesc?: string;
  sortOrder?: number;
  published?: boolean;
};

type UpdateFaqItemInput = Partial<Omit<CreateFaqItemInput, "tenantId" | "faqCategoryId">>;

export async function createFaqItem(data: CreateFaqItemInput) {
  return prisma.faqItem.create({ data });
}

export async function updateFaqItem(id: string, data: UpdateFaqItemInput) {
  return prisma.faqItem.update({ where: { id }, data });
}

export async function deleteFaqItem(id: string) {
  return prisma.faqItem.delete({ where: { id } });
}
