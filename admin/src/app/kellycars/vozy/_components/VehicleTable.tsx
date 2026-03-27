"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteVehicle } from "@/actions/kellycars/vehicles";
import type { KellyCarsVehicle, Media } from "@/generated/prisma/client";

type Vehicle = Omit<KellyCarsVehicle, "pricePerDay"> & {
  pricePerDay: number;
  image: Media | null;
};

export function VehicleTable({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Opravdu chcete smazat vůz "${name}"?`)) return;
    await deleteVehicle(id);
    router.refresh();
  }

  if (vehicles.length === 0) {
    return (
      <p className="text-muted-foreground">
        Žádné vozy nebyly nalezeny.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Vůz</th>
            <th className="px-4 py-2 text-left font-medium">Kategorie</th>
            <th className="px-4 py-2 text-left font-medium">Palivo</th>
            <th className="px-4 py-2 text-left font-medium">Převodovka</th>
            <th className="px-4 py-2 text-left font-medium">Míst</th>
            <th className="px-4 py-2 text-right font-medium">Cena/den</th>
            <th className="px-4 py-2 text-center font-medium">Stav</th>
            <th className="px-4 py-2 text-right font-medium">Akce</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className="border-b last:border-0">
              <td className="px-4 py-2 font-medium">
                {v.brand} {v.model}{" "}
                <span className="text-muted-foreground">({v.year})</span>
              </td>
              <td className="px-4 py-2">{v.category}</td>
              <td className="px-4 py-2">{v.fuelType}</td>
              <td className="px-4 py-2">
                {v.transmission === "MANUAL" ? "Manuální" : "Automatická"}
              </td>
              <td className="px-4 py-2">{v.seats}</td>
              <td className="px-4 py-2 text-right">
                {Number(v.pricePerDay).toLocaleString("cs-CZ")} Kč
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    v.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {v.available ? "Dostupný" : "Nedostupný"}
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/kellycars/vozy/upravit/${v.id}`}>
                    <Button variant="ghost" size="sm">
                      Upravit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(v.id, `${v.brand} ${v.model}`)}
                  >
                    Smazat
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
