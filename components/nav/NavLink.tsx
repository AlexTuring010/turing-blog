"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import clsx from "clsx";

// A nav link that:
//   - underlines itself in coral when the current path matches its href
//   - matches `/el` for the home link, `/el/writing` for the writing link, etc.
//   - falls back to prefix matching (so /el/writing/some-post highlights "Writing")
export function NavLink({
  href,
  exact,
  children,
}: {
  href: string;
  exact?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={clsx(
        "relative transition-colors",
        active ? "text-coral" : "text-ink hover:text-coral",
        active &&
          "after:absolute after:left-0 after:right-0 after:-bottom-[22px] after:h-[3px] after:bg-coral after:content-['']",
      )}
    >
      {children}
    </Link>
  );
}
