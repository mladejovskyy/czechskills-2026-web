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
    const faqCategory = await prisma.faqCategory.findUnique({
      where: {
        tenantId_slug: {
          tenantId: auth.tenant.id,
          slug,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        metaTitle: true,
        metaDesc: true,
        sortOrder: true,
        items: {
          where: { published: true },
          select: {
            id: true,
            question: true,
            slug: true,
            answer: true,
            metaTitle: true,
            metaDesc: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!faqCategory) {
      return NextResponse.json(
        { error: "FAQ category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: faqCategory });
  } catch (error) {
    console.error("Error fetching FAQ category:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ category" },
      { status: 500 },
    );
  }
}
