"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cardChips, formatPrice, type Product } from "@/lib/products";
import { useI18n } from "./i18n-provider";
import { AddToCart } from "./add-to-cart";

export function ProductCard({
  product: p,
  layout = "grid",
  priority = false,
}: {
  product: Product;
  layout?: "grid" | "list";
  priority?: boolean;
}) {
  const { locale, dict } = useI18n();
  const href = `/${locale}/products/${p.slug}`;
  const chips = cardChips(p, dict, locale);
  const list = layout === "list";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className={`group bg-surface shadow-card hover:shadow-lift border-line relative flex overflow-hidden rounded-3xl border transition-shadow ${
        list ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <Link
        href={href}
        className={`relative block overflow-hidden bg-surface-2 ${list ? "aspect-[4/3] sm:aspect-auto sm:w-72 sm:shrink-0" : "aspect-[4/3]"}`}
        aria-label={p.title[locale]}
        tabIndex={-1}
      >
        <Image
          src={p.images[0]}
          alt={`${p.title[locale]} — ${p.kind[locale]}`}
          fill
          priority={priority}
          sizes={list ? "(min-width: 640px) 288px, 100vw" : "(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw"}
          className="object-cover object-[50%_65%] transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
        {p.status === "sold" && (
          <div className="absolute inset-0 grid place-items-center bg-black/45">
            <span className="-rotate-6 rounded-xl border-4 border-white px-5 py-1.5 font-display text-2xl font-extrabold tracking-widest text-white uppercase">
              {dict.sold}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${
              p.condition === "new" ? "bg-ok text-white" : "bg-white/90 text-brand-deep"
            }`}
          >
            {dict.condition[p.condition]}
          </span>
        </div>
        <span className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          #{p.article}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-bold tracking-wider text-accent uppercase">{p.kind[locale]}</p>
          <h3 className="mt-1 text-lg leading-snug font-bold">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:text-brand-2">
              {p.title[locale]}
            </Link>
          </h3>
        </div>

        {chips.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <li key={c} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted">
                {c}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-3 pt-2">
          <div>
            <p className="font-display text-2xl leading-none font-extrabold">{formatPrice(p.price, locale)}</p>
            <p className="mt-1 text-xs text-muted">{dict.common.exclVat}</p>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            {p.status === "published" && <AddToCart id={p.id} size="sm" />}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
