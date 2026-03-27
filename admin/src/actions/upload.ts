"use server";

import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { prisma } from "@/lib/prisma";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  const tenantSlug = formData.get("tenantSlug") as string;
  const folder = formData.get("folder") as string;
  const alt = formData.get("alt") as string;
  const tenantId = formData.get("tenantId") as string;

  if (!file || !tenantSlug || !folder || !tenantId) {
    throw new Error("Missing required fields");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const url = await uploadToR2(tenantSlug, folder, filename, buffer, file.type);

  const media = await prisma.media.create({
    data: {
      tenantId,
      url,
      alt: alt || file.name,
    },
  });

  return media;
}

export async function deleteImage(mediaId: string) {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) return;

  await deleteFromR2(media.url);
  await prisma.media.delete({ where: { id: mediaId } });
}
