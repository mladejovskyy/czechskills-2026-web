"use server";

import { prisma } from "@/lib/prisma";
import { KellyCarsTransmission } from "@/generated/prisma/client";

type CreateVehicleInput = {
  tenantId: string;
  brand: string;
  model: string;
  year: number;
  slug: string;
  category: string;
  seats: number;
  fuelType: string;
  transmission: KellyCarsTransmission;
  pricePerDay: number;
  description?: string;
  imageId?: string;
};

type UpdateVehicleInput = Partial<Omit<CreateVehicleInput, "tenantId">> & {
  available?: boolean;
};

export async function createVehicle(data: CreateVehicleInput) {
  return prisma.kellyCarsVehicle.create({ data });
}

export async function updateVehicle(id: string, data: UpdateVehicleInput) {
  return prisma.kellyCarsVehicle.update({ where: { id }, data });
}

export async function deleteVehicle(id: string) {
  return prisma.kellyCarsVehicle.delete({ where: { id } });
}

export async function getVehicle(id: string) {
  return prisma.kellyCarsVehicle.findUnique({
    where: { id },
    include: { image: true },
  });
}

export async function getVehiclesByTenant(tenantId: string) {
  return prisma.kellyCarsVehicle.findMany({
    where: { tenantId },
    include: { image: true },
    orderBy: { createdAt: "desc" },
  });
}
