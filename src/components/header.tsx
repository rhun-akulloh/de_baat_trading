"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./logo";
import { LangSwitch } from "./lang-switch";
import { ThemeToggle } from "./theme-toggle";
import { CartButton } from "./cart-button";
import { useI18n } from "./i18n-provider";
import { site } from "@/lib/site";

export function Header() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `/${locale}`, label: dict.nav.home, exact: true },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/sell`, label: dict.nav.sell },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];
  const isActive = (l: (typeof links)[number]) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all ${
          scrolled ? "glass border-line shadow-card" : "border-transparent bg-bg/80 backdrop-blur"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-black"
        >
          {dict.nav.skip}
        </a>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href={`/${locale}`} aria-label={site.name}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l) ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive(l) ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
                {isActive(l) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-gradient"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.phoneHref}`}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted transition hover:text-accent xl:flex"
            >
              <Phone className="size-4" /> {site.phone}
            </a>
            <div className="hidden sm:block">
              <LangSwitch />
            </div>
            <ThemeToggle className="hidden sm:grid" />
            <CartButton />
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-line bg-surface lg:hidden"
              onClick={() => setOpen(true)}
              aria-label={dict.nav.menu}
              aria-expanded={open}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

      </header>

        {/* Outside <header>: the header's backdrop-filter would otherwise trap this fixed overlay inside the 72px bar. */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[60] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                aria-label={dict.nav.close}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <motion.aside
                className="bg-brand-gradient absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col gap-2 p-6 text-white shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <Logo light />
                  <button
                    onClick={() => setOpen(false)}
                    aria-label={dict.nav.close}
                    className="grid size-10 place-items-center rounded-full bg-white/10"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-2xl px-4 py-3.5 font-display text-xl font-bold ${
                        isActive(l) ? "bg-white/15" : "hover:bg-white/10"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <LangSwitch />
                  <ThemeToggle />
                </div>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="bg-accent-gradient mt-3 flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-[#1a0d00]"
                >
                  <Phone className="size-4" /> {site.phone}
                </a>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
}
