"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

type Props = {
  categories: string[];
  fuelTypes: string[];
};

export function VehicleFilters({ categories, fuelTypes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Hledat značku nebo model..."
        defaultValue={searchParams.get("hledat") ?? ""}
        onChange={(e) => update("hledat", e.target.value)}
        className="max-w-xs"
      />

      <select
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        value={searchParams.get("kategorie") ?? ""}
        onChange={(e) => update("kategorie", e.target.value)}
      >
        <option value="">Všechny kategorie</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        value={searchParams.get("palivo") ?? ""}
        onChange={(e) => update("palivo", e.target.value)}
      >
        <option value="">Všechna paliva</option>
        {fuelTypes.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <select
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        value={searchParams.get("prevodovka") ?? ""}
        onChange={(e) => update("prevodovka", e.target.value)}
      >
        <option value="">Všechny převodovky</option>
        <option value="MANUAL">Manuální</option>
        <option value="AUTOMATIC">Automatická</option>
      </select>

      <select
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        value={searchParams.get("dostupnost") ?? ""}
        onChange={(e) => update("dostupnost", e.target.value)}
      >
        <option value="">Všechny</option>
        <option value="dostupne">Dostupné</option>
        <option value="nedostupne">Nedostupné</option>
      </select>
    </div>
  );
}
