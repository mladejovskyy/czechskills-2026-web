import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getVehicle } from "@/actions/kellycars/vehicles";
import { VehicleForm } from "../../_components/VehicleForm";

export default async function UpravitVuzPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === "kellycars");
  if (!tenant) redirect("/");

  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  const serialized = { ...vehicle, pricePerDay: Number(vehicle.pricePerDay) };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1>
        Upravit vůz – {vehicle.brand} {vehicle.model}
      </h1>
      <VehicleForm tenantId={tenant.id} vehicle={serialized} />
    </div>
  );
}
