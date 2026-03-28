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
    const vehicle = await prisma.kellyCarsVehicle.findUnique({
      where: {
        tenantId_slug: {
          tenantId: auth.tenant.id,
          slug,
        },
      },
      include: {
        image: {
          select: { id: true, url: true, alt: true },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: vehicle });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 },
    );
  }
}
