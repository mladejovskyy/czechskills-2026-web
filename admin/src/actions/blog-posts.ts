"use server";

import { prisma } from "@/lib/prisma";
import { BlogPostStatus } from "@/generated/prisma/client";

type BlogPostFaqInput = {
  question: string;
  answer: string;
  sortOrder?: number;
};

type CreateBlogPostInput = {
  tenantId: string;
  authorId: string;
  categoryId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageId?: string;
  videoUrl?: string;
  voiceOverUrl?: string;
  metaTitle?: string;
  metaDesc?: string;
  tagIds?: string[];
  faqs?: BlogPostFaqInput[];
};

type UpdateBlogPostInput = Partial<Omit<CreateBlogPostInput, "tenantId" | "authorId">> & {
  status?: BlogPostStatus;
  seoGeoScore?: number;
  publishedAt?: Date;
};

export async function createBlogPost(data: CreateBlogPostInput) {
  const { tagIds, faqs, ...rest } = data;

  return prisma.blogPost.create({
    data: {
      ...rest,
      tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      faqs: faqs ? { create: faqs } : undefined,
    },
    include: { tags: true, faqs: true, category: true, coverImage: true },
  });
}

export async function updateBlogPost(id: string, data: UpdateBlogPostInput) {
  const { tagIds, faqs, ...rest } = data;

  return prisma.blogPost.update({
    where: { id },
    data: {
      ...rest,
      tags: tagIds ? { set: tagIds.map((id) => ({ id })) } : undefined,
      faqs: faqs
        ? { deleteMany: {}, create: faqs }
        : undefined,
    },
    include: { tags: true, faqs: true, category: true, coverImage: true },
  });
}

export async function deleteBlogPost(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}

export async function getBlogPost(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: { tags: true, faqs: true, category: true, author: true, coverImage: true },
  });
}

export async function getBlogPostsByTenant(
  tenantId: string,
  opts?: { status?: BlogPostStatus; categoryId?: string }
) {
  return prisma.blogPost.findMany({
    where: {
      tenantId,
      ...(opts?.status && { status: opts.status }),
      ...(opts?.categoryId && { categoryId: opts.categoryId }),
    },
    include: { tags: true, faqs: true, category: true, author: true, coverImage: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function publishBlogPost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

export async function unpublishBlogPost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: { status: "DRAFT", publishedAt: null },
  });
}
