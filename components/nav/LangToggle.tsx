"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import clsx from "clsx";

// Pill toggle that swaps the locale segment in the current URL while
// preserving the rest of the path. e.g. /el/writing/foo → /en/writing/foo.
//
// CONTENT.md note: for dynamic post/project pages the target may not exist
// in the other locale — we still navigate there; the page itself shows a
// "only available in [other locale]" banner. That logic lives in Phase 2,
// so here we just blindly swap.
export function LangToggle() {
  const pathname = usePathname() ?? "/";
  const currentLocale = pickLocale(pathname);

  const swap = (target: Locale): string => {
    const rest = stripLocale(pathname, currentLocale);
    return `/${target}${rest}`;
  };

  return (
    <div className="inline-flex items-center rounded-full border-[1.5px] border-coral bg-transparent p-[3px]">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={swap(loc)}
          className={clsx(
            "rounded-full px-[10px] py-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors",
            loc === currentLocale
              ? "bg-coral text-paper"
              : "text-ink-mute hover:text-ink",
          )}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

function pickLocale(pathname: string): Locale {
  const seg = pathname.split("/")[1] ?? "";
  return (routing.locales as readonly string[]).includes(seg)
    ? (seg as Locale)
    : routing.defaultLocale;
}

function stripLocale(pathname: string, locale: Locale): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return "";
  if (pathname.startsWith(prefix + "/")) return pathname.slice(prefix.length);
  return pathname;
}
