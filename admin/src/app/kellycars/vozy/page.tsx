import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getVehiclesByTenant } from "@/actions/kellycars/vehicles";
import { Button } from "@/components/ui/button";
import { VehicleFilters } from "./_components/VehicleFilters";
import { VehicleTable } from "./_components/VehicleTable";

export default async function VozyPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string; palivo?: string; prevodovka?: string; dostupnost?: string; hledat?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === "kellycars");
  if (!tenant) redirect("/");

  const params = await searchParams;
  const vehicles = await getVehiclesByTenant(tenant.id);

  const filtered = vehicles.filter((v) => {
    if (params.kategorie && v.category !== params.kategorie) return false;
    if (params.palivo && v.fuelType !== params.palivo) return false;
    if (params.prevodovka && v.transmission !== params.prevodovka) return false;
    if (params.dostupnost === "dostupne" && !v.available) return false;
    if (params.dostupnost === "nedostupne" && v.available) return false;
    if (params.hledat) {
      const q = params.hledat.toLowerCase();
      if (
        !v.brand.toLowerCase().includes(q) &&
        !v.model.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const categories = [...new Set(vehicles.map((v) => v.category))];
  const fuelTypes = [...new Set(vehicles.map((v) => v.fuelType))];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1>Vozy</h1>
        <Link href="/kellycars/vozy/pridat">
          <Button>+ Přidat vůz</Button>
        </Link>
      </div>

      <VehicleFilters categories={categories} fuelTypes={fuelTypes} />
      <VehicleTable vehicles={filtered} />
    </div>
  );
}
