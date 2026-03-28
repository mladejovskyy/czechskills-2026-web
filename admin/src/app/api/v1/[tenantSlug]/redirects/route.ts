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
    const redirects = await prisma.redirect.findMany({
      where: { tenantId: auth.tenant.id },
      select: {
        id: true,
        fromPath: true,
        toPath: true,
        type: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: redirects });
  } catch (error) {
    console.error("Error fetching redirects:", error);
    return NextResponse.json(
      { error: "Failed to fetch redirects" },
      { status: 500 },
    );
  }
}
