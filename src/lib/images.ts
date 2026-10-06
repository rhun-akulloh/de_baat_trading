import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { env } from "./env";

const isProd = process.env.NODE_ENV === "production";
export const imageStorageReady = () => !!env("BLOB_READ_WRITE_TOKEN") || !isProd;

const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

/** Only URLs we could have produced ourselves may be stored on a product. */
export const isAllowedImageUrl = (u: string) => u.startsWith("/products/") || u.startsWith("/uploads/") || BLOB_HOST.test(u);

export async function saveImage(file: Blob): Promise<string> {
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const token = env("BLOB_READ_WRITE_TOKEN");
  if (token) {
    const blob = await put(`products/${name}`, file, { access: "public", contentType: "image/jpeg", addRandomSuffix: false, token });
    return blob.url;
  }
  if (isProd) throw new Error("Foto-opslag is niet geconfigureerd (BLOB_READ_WRITE_TOKEN ontbreekt).");
  // Local development: write into public/ so Next serves it straight away.
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

/** Best-effort cleanup of photos that are no longer used. Starter-catalog photos in /products are never touched. */
export async function deleteImages(urls: string[]) {
  const blobs = urls.filter((u) => BLOB_HOST.test(u));
  try {
    const token = env("BLOB_READ_WRITE_TOKEN");
    if (blobs.length && token) await del(blobs, { token });
    if (!isProd) {
      for (const u of urls.filter((x) => x.startsWith("/uploads/"))) {
        await fs.rm(path.join(process.cwd(), "public", "uploads", path.basename(u)), { force: true });
      }
    }
  } catch (e) {
    console.error("[images] cleanup failed", e);
  }
}
