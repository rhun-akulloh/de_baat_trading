"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./product-card";
import { useI18n } from "./i18n-provider";

export function FeaturedCarousel({ items }: { items: Product[] }) {
  const { dict } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    track.current?.scrollBy({ left: dir * Math.min(track.current.clientWidth * 0.8, 420), behavior: "smooth" });

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={dict.product.prev}
          className="grid size-11 place-items-center rounded-full border border-line bg-surface transition hover:border-accent hover:text-accent"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={dict.product.next}
          className="grid size-11 place-items-center rounded-full border border-line bg-surface transition hover:border-accent hover:text-accent"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6"
      >
        {items.map((p) => (
          <div key={p.id} className="w-[82%] shrink-0 snap-start sm:w-[44%] lg:w-[31%] xl:w-[23.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
