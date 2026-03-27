import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/**
 * Upload a file to R2.
 * Key structure: {tenantSlug}/{folder}/{filename}
 * e.g. kellycars/blog/cover-123.webp, kellycars/vozy/skoda-octavia.webp
 */
export async function uploadToR2(
  tenantSlug: string,
  folder: string,
  filename: string,
  body: Buffer | Uint8Array,
  contentType: string
) {
  const key = `${tenantSlug}/${folder}/${filename}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete a file from R2 by its full public URL or key.
 */
export async function deleteFromR2(urlOrKey: string) {
  const key = urlOrKey.startsWith("http")
    ? urlOrKey.replace(`${PUBLIC_URL}/`, "")
    : urlOrKey;

  await r2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
