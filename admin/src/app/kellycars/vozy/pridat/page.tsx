import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VehicleForm } from "../_components/VehicleForm";

export default async function PridatVuzPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === "kellycars");
  if (!tenant) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1>Přidat vůz</h1>
      <VehicleForm tenantId={tenant.id} />
    </div>
  );
}
