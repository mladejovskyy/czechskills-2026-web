"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { createVehicle, updateVehicle } from "@/actions/kellycars/vehicles";
import type { KellyCarsVehicle, Media } from "@/generated/prisma/client";
import { toast } from "sonner";

type Props = {
  tenantId: string;
  vehicle?: Omit<KellyCarsVehicle, "pricePerDay"> & {
    pricePerDay: number;
    image: Media | null;
  };
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function VehicleForm({ tenantId, vehicle }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<{
    id: string;
    url: string;
    alt: string;
  } | null>(
    vehicle?.image
      ? { id: vehicle.image.id, url: vehicle.image.url, alt: vehicle.image.alt }
      : null
  );
  const isEdit = !!vehicle;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const data = {
        brand: form.get("brand") as string,
        model: form.get("model") as string,
        year: Number(form.get("year")),
        slug: slugify(`${form.get("brand")}-${form.get("model")}-${form.get("year")}`),
        category: form.get("category") as string,
        seats: Number(form.get("seats")),
        fuelType: form.get("fuelType") as string,
        transmission: form.get("transmission") as "MANUAL" | "AUTOMATIC",
        pricePerDay: Number(form.get("pricePerDay")),
        description: (form.get("description") as string) || undefined,
        available: form.get("available") === "on",
        imageId: image?.id,
      };

      if (isEdit) {
        await updateVehicle(vehicle.id, data);
        toast.success("Vůz byl úspěšně upraven.");
      } else {
        await createVehicle({ ...data, tenantId });
        toast.success("Vůz byl úspěšně přidán.");
      }
      router.push("/kellycars/vozy");
      router.refresh();
    } catch {
      toast.error("Něco se pokazilo. Zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-6">
      {/* Image upload */}
      <ImageUpload
        tenantId={tenantId}
        tenantSlug="kellycars"
        folder="vozy"
        label="Fotografie vozu"
        value={image}
        onChange={setImage}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="brand">Značka</Label>
          <Input
            id="brand"
            name="brand"
            required
            defaultValue={vehicle?.brand}
            placeholder="Škoda"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            required
            defaultValue={vehicle?.model}
            placeholder="Octavia"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="year">Rok výroby</Label>
          <Input
            id="year"
            name="year"
            type="number"
            required
            defaultValue={vehicle?.year ?? new Date().getFullYear()}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seats">Počet míst</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            required
            defaultValue={vehicle?.seats ?? 5}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pricePerDay">Cena za den (Kč)</Label>
          <Input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            step="0.01"
            required
            defaultValue={vehicle ? Number(vehicle.pricePerDay) : undefined}
            placeholder="1200"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="category">Kategorie</Label>
          <Input
            id="category"
            name="category"
            required
            defaultValue={vehicle?.category}
            placeholder="SUV, Sedan, Kombi..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fuelType">Palivo</Label>
          <select
            id="fuelType"
            name="fuelType"
            required
            defaultValue={vehicle?.fuelType ?? ""}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="" disabled>
              Vyberte...
            </option>
            <option value="Benzín">Benzín</option>
            <option value="Diesel">Diesel</option>
            <option value="Elektro">Elektro</option>
            <option value="Hybrid">Hybrid</option>
            <option value="LPG">LPG</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="transmission">Převodovka</Label>
          <select
            id="transmission"
            name="transmission"
            required
            defaultValue={vehicle?.transmission ?? ""}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="" disabled>
              Vyberte...
            </option>
            <option value="MANUAL">Manuální</option>
            <option value="AUTOMATIC">Automatická</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Popis</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={vehicle?.description ?? ""}
          placeholder="Volitelný popis vozu..."
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {isEdit && (
        <div className="flex items-center gap-2">
          <input
            id="available"
            name="available"
            type="checkbox"
            defaultChecked={vehicle.available}
            className="size-4 rounded border-input"
          />
          <Label htmlFor="available">Vůz je dostupný k pronájmu</Label>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Ukládám..."
            : isEdit
              ? "Uložit změny"
              : "Přidat vůz"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/kellycars/vozy")}
        >
          Zrušit
        </Button>
      </div>
    </form>
  );
}
