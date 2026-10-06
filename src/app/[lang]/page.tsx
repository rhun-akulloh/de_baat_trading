import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, PackageCheck, RotateCcw, Truck, Banknote, Wrench, ShieldCheck } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { categoryIds, formatPrice, uniqueBrands } from "@/lib/products";
import { listPublic } from "@/lib/store";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { HeroShowreel } from "@/components/hero-showreel";
import { FeaturedCarousel } from "@/components/featured-carousel";

// Hand-picked covers where the first photo of a category doesn't show the machine well.
const coverOverrides: Partial<Record<string, string>> = { palletwagens: "/products/1_43zs9d2l.webp" };
const whyIcons = [Wrench, Clock, Truck, RotateCcw];

export const revalidate = 60;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const products = await listPublic();
  const forSale = products.filter((p) => p.status === "published");
  const brands = uniqueBrands(products);
  // Owner-flagged machines first; otherwise the newest ones.
  const featured = [...forSale.filter((p) => p.featured), ...forSale.filter((p) => !p.featured)].slice(0, 6);
  const statValues: Record<string, number> = {
    machines: forSale.length,
    delivery: 24,
    viewing: 30,
    categories: categoryIds.length,
  };
  const cheapest = forSale.length ? Math.min(...forSale.map((p) => p.price)) : 0;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="bg-brand-gradient relative isolate overflow-hidden text-white">
        <div className="mesh">
          <i className="-top-32 -left-24 size-[28rem] bg-brand-2" />
          <i className="top-1/3 right-0 size-[26rem] bg-accent/50" style={{ animationDelay: "-7s" }} />
          <i className="-bottom-40 left-1/3 size-[30rem] bg-[#3b2bff]/50" style={{ animationDelay: "-13s" }} />
        </div>
        <div className="grid-bg pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-14 pb-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20 lg:pb-32">
          <div>
            <Reveal y={16}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur sm:text-sm">
                <span className="size-2 rounded-full bg-accent-2 shadow-[0_0_12px_2px] shadow-accent-2/70" />
                {dict.home.badge}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-[2.4rem] leading-[1.05] font-extrabold sm:text-5xl xl:text-[3.6rem]">
                {dict.home.title1}
                <br />
                <span className="text-gradient">{dict.home.title2}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{dict.home.subtitle}</p>
            </Reveal>
            <Reveal delay={0.24} className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/products`}
                className="bg-accent-gradient group inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold text-[#1a0d00] shadow-[0_10px_30px_-8px] shadow-accent/70 transition hover:-translate-y-0.5"
              >
                {dict.home.ctaPrimary}
                <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/${lang}/sell`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-7 py-4 font-bold backdrop-blur transition hover:bg-white/15"
              >
                {dict.home.ctaSecondary}
              </Link>
            </Reveal>
          </div>

          <HeroShowreel
            tags={[
              {
                label: lang === "nl" ? "Direct uit voorraad" : "Ready from stock",
                price: `${forSale.length} machines`,
                className: "-left-3 bottom-24 sm:-left-8",
                delay: 0,
              },
              {
                label: lang === "nl" ? "Vanaf" : "From",
                price: `${formatPrice(cheapest, lang)} ${dict.common.exclVat}`,
                className: "-right-2 top-24 sm:-right-6",
                delay: 0.4,
              },
            ]}
          />
        </div>

        <div className="hazard absolute inset-x-0 bottom-0 h-2" />
      </section>

      {/* ───────── Stats ───────── */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <Reveal className="bg-surface shadow-lift border-line grid grid-cols-2 gap-px overflow-hidden rounded-3xl border md:grid-cols-4">
          {dict.home.stats.map((s) => (
            <div key={s.key} className="bg-surface px-6 py-7 text-center">
              <p className="text-gradient font-display text-4xl font-extrabold">
                <Counter to={statValues[s.key]} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm font-medium text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-3 text-center text-xs text-muted">{dict.home.statsNote}</p>
      </section>

      {/* ───────── Featured ───────── */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">{dict.home.featuredTitle}</h2>
            <p className="mt-2 text-muted">{dict.home.featuredSubtitle}</p>
          </div>
          <Link href={`/${lang}/products`} className="group inline-flex items-center gap-2 font-bold text-brand-2 hover:text-accent">
            {dict.common.viewAll} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <FeaturedCarousel items={featured} />
      </section>

      {/* ───────── Categories ───────── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{dict.home.categoriesTitle}</h2>
          <p className="mt-2 text-muted">{dict.home.categoriesSubtitle}</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryIds.map((c, i) => {
            const list = products.filter((p) => p.category === c);
            if (list.length === 0) return null;
            const cover = coverOverrides[c] ?? list[0].images[0];
            return (
              <Reveal key={c} delay={i * 0.08}>
                <Link
                  href={`/${lang}/products?category=${c}`}
                  className="group shadow-card relative block aspect-[4/5] overflow-hidden rounded-3xl"
                >
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-[50%_70%] transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00103d] via-[#00103d]/40 to-transparent transition group-hover:from-[#002080]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-bold tracking-widest text-accent-2 uppercase">
                      {list.length} {lang === "nl" ? "stuks" : "pcs"}
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold">{dict.categories[c]}</h3>
                    <p className="mt-1 text-sm text-white/75">{dict.categoryBlurbs[c]}</p>
                    <span className="mt-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-accent group-hover:text-black">
                      <ArrowRight className="size-5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────── Brand marquee ───────── */}
      <section className="mt-20 border-y border-line bg-surface py-8" aria-label={dict.home.marqueeBrands}>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-14 whitespace-nowrap">
            {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
              <span key={i} className="font-display text-3xl font-extrabold tracking-tight text-muted/45 sm:text-4xl" aria-hidden={i >= brands.length}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Why ───────── */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{dict.home.whyTitle}</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.home.why.map((w, i) => {
            const Icon = whyIcons[i];
            return (
              <Reveal key={w.title} delay={i * 0.08}>
                <div className="group bg-surface border-line shadow-card hover:shadow-lift h-full rounded-3xl border p-7 transition hover:-translate-y-1">
                  <span className="bg-brand-gradient mb-5 grid size-14 place-items-center rounded-2xl text-white shadow-lg transition group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="size-7" />
                  </span>
                  <h3 className="text-lg font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{w.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────── Sell CTA ───────── */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="bg-accent-gradient relative isolate overflow-hidden rounded-[2rem] p-8 text-[#1a0d00] sm:p-14">
            <div className="hazard absolute inset-x-0 top-0 h-2.5 opacity-80" />
            <div className="absolute -top-20 -right-20 size-80 rounded-full bg-white/25 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-3xl font-extrabold sm:text-5xl">{dict.home.sellTitle}</h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#3a1d00]">{dict.home.sellText}</p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-semibold">
                  {dict.home.sellBullets.map((b, i) => {
                    const Icon = [Banknote, Truck, ShieldCheck][i];
                    return (
                      <li key={b} className="inline-flex items-center gap-2">
                        <Icon className="size-5" /> {b}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <Link
                  href={`/${lang}/sell`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-8 py-5 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5"
                >
                  <PackageCheck className="size-5" /> {dict.home.sellCta}
                  <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                </Link>
                <a href={`tel:${site.phoneHref}`} className="text-center font-bold underline-offset-4 hover:underline lg:text-right">
                  {dict.common.callUs}: {site.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
