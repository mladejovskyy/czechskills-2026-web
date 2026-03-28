import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantSlug: string }> },
) {
  const { tenantSlug } = await params;

  const auth = await validateApiKey(request, tenantSlug);
  if ("error" in auth) return auth.error;

  const searchParams = request.nextUrl.searchParams;
  const categorySlug = searchParams.get("category");
  const tagSlug = searchParams.get("tag");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
  const skip = (page - 1) * limit;

  try {
    const where = {
      tenantId: auth.tenant.id,
      status: "PUBLISHED" as const,
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
      ...(tagSlug && {
        tags: { some: { slug: tagSlug } },
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          tags: {
            select: { id: true, name: true, slug: true },
          },
          author: {
            select: { id: true, name: true, username: true },
          },
          coverImage: {
            select: { id: true, url: true, alt: true },
          },
          faqs: {
            select: { id: true, question: true, answer: true, sortOrder: true },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
