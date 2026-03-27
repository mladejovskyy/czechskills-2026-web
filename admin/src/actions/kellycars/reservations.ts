"use server";

import { prisma } from "@/lib/prisma";

type CreateReservationInput = {
  tenantId: string;
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: Date;
  returnDate: Date;
  totalPrice: number;
  notes?: string;
};

type UpdateReservationInput = Partial<Omit<CreateReservationInput, "tenantId">> & {
  status?: string;
};

export async function createReservation(data: CreateReservationInput) {
  return prisma.kellyCarsReservation.create({ data });
}

export async function updateReservation(id: string, data: UpdateReservationInput) {
  return prisma.kellyCarsReservation.update({ where: { id }, data });
}

export async function deleteReservation(id: string) {
  return prisma.kellyCarsReservation.delete({ where: { id } });
}

export async function getReservation(id: string) {
  return prisma.kellyCarsReservation.findUnique({
    where: { id },
    include: { vehicle: true },
  });
}

export async function getReservationsByTenant(tenantId: string) {
  return prisma.kellyCarsReservation.findMany({
    where: { tenantId },
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  });
}
