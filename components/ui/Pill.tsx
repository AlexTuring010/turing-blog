import type { ReactNode } from "react";
import clsx from "clsx";

type Variant =
  | "featured"
  | "project"
  | "notes"
  | "life"
  | "competition"
  | "learning";

const VARIANT: Record<Variant, string> = {
  featured: "bg-coral text-paper border-coral",
  project: "bg-transparent text-coral border-coral",
  notes: "bg-transparent text-ink-soft border-rule",
  life: "bg-paper-2 text-ink border-paper-2",
  competition: "bg-paper-3 text-ink border-paper-3",
  learning: "bg-transparent text-ink-soft border-rule",
};

export function Pill({
  variant,
  size = "md",
  children,
  className,
}: {
  variant: Variant;
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-[5px] rounded-full border-[1.5px] font-semibold uppercase tracking-[0.05em]",
        size === "sm"
          ? "px-[7px] py-[2px] text-[9px]"
          : "px-[11px] py-1 text-[11px]",
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
