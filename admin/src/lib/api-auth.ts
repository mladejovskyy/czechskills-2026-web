import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Validates the API key from the Authorization header and resolves the tenant.
 *
 * Expects: `Authorization: Bearer <apiKey>`
 *
 * Returns the tenant record when the slug + API key pair is valid,
 * or a 401 NextResponse when authentication fails.
 */
export async function validateApiKey(
  request: Request,
  tenantSlug: string,
): Promise<
  | { tenant: { id: string; slug: string; name: string; domain: string | null } }
  | { error: NextResponse }
> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 },
      ),
    };
  }

  const apiKey = authHeader.slice("Bearer ".length).trim();

  if (!apiKey) {
    return {
      error: NextResponse.json(
        { error: "API key is required" },
        { status: 401 },
      ),
    };
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true, slug: true, name: true, domain: true, apiKey: true },
  });

  if (!tenant || tenant.apiKey !== apiKey) {
    return {
      error: NextResponse.json(
        { error: "Invalid tenant or API key" },
        { status: 401 },
      ),
    };
  }

  return {
    tenant: {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      domain: tenant.domain,
    },
  };
}
