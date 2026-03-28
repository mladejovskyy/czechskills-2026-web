import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantSlug: string; slug: string }> },
) {
  const { tenantSlug, slug } = await params;

  const auth = await validateApiKey(request, tenantSlug);
  if ("error" in auth) return auth.error;

  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        tenantId_slug: {
          tenantId: auth.tenant.id,
          slug,
        },
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true, metaTitle: true, metaDesc: true },
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
    });

    if (!post || post.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}
