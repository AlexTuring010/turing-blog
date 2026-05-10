import type { ReactNode } from "react";
import clsx from "clsx";

export function StackChip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-rule bg-paper-2 text-ink-soft",
        "px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.05em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
