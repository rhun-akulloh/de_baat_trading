"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/lib/i18n";
import { useI18n } from "./i18n-provider";

export function LangSwitch() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.replace(/^\/(nl|en)(?=\/|$)/, "");

  return (
    <div
      role="group"
      aria-label={dict.nav.language}
      className="flex items-center rounded-full border border-line bg-surface p-0.5 text-xs font-bold"
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => {
            document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
          className={`rounded-full px-3 py-2 uppercase transition ${
            l === locale ? "bg-brand-gradient text-white shadow" : "text-muted hover:text-ink"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
