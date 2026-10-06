import "server-only";
import { cache } from "react";
import { neon } from "@neondatabase/serverless";
import seed from "@/data/products.json";
import type { Product } from "./products";
import type { Store } from "./store-types";
import { createPgStore } from "./store-pg";
import { createFileStore } from "./store-file";

const seedProducts = seed as Product[];

let store: Store | undefined;

/**
 * DATABASE_URL set  → Neon Postgres (production)
 * otherwise, dev    → editable JSON file in .data/ (so everything works with zero setup;
 *                       PRODUCT_STORE=file does the same on a single server with a persistent disk)
 * otherwise, prod   → read-only starter catalog; the admin says the database is missing
 */
export function getStore(): Store {
  if (store) return store;
  const url = process.env.DATABASE_URL;
  if (url) {
    const sql = neon(url);
    store = createPgStore((text, params) => sql.query(text, params ?? []) as Promise<Record<string, unknown>[]>, seedProducts);
  } else {
    store = createFileStore(seedProducts, process.env.NODE_ENV !== "production" || process.env.PRODUCT_STORE === "file");
  }
  return store;
}

const byNewest = (a: Product, b: Product) =>
  Number(!!b.featured) - Number(!!a.featured) || (parseInt(b.article, 10) || 0) - (parseInt(a.article, 10) || 0);

/** Deduplicated per request, so a page can call these freely. */
export const listAll = cache(async () => [...(await getStore().listAll())].sort(byNewest));

/** What visitors see: for sale or sold, never hidden. */
export const listPublic = cache(async () => (await listAll()).filter((p) => p.status !== "hidden"));

export async function getPublicBySlug(slug: string) {
  return (await listPublic()).find((p) => p.slug === slug);
}

/** Only machines that can actually be ordered. */
export async function getOrderableByIds(ids: string[]) {
  const all = await listPublic();
  return ids.map((id) => all.find((p) => p.id === id && p.status === "published"));
}
