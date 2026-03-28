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
  const category = searchParams.get("category");
  const transmission = searchParams.get("transmission");

  try {
    const vehicles = await prisma.kellyCarsVehicle.findMany({
      where: {
        tenantId: auth.tenant.id,
        available: true,
        ...(category && { category }),
        ...(transmission && {
          transmission: transmission.toUpperCase() as "MANUAL" | "AUTOMATIC",
        }),
      },
      include: {
        image: {
          select: { id: true, url: true, alt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}
