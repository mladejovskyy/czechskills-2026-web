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

  try {
    const faqCategories = await prisma.faqCategory.findMany({
      where: { tenantId: auth.tenant.id },
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
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ data: faqCategories });
  } catch (error) {
    console.error("Error fetching FAQ categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ categories" },
      { status: 500 },
    );
  }
}
