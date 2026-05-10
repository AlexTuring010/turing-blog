import { useTranslations } from "next-intl";
import clsx from "clsx";
import type { ProjectStatus } from "@/lib/types";

// Status pill shown on project covers. Matches .work-status / .pulse from
// design-references/work.html: monospace label + colored dot. The "live"
// variant pulses; "wip" uses yellow; "award" gets a coral border.
export function StatusBadge({
  status,
  customLabel,
  className,
}: {
  status: ProjectStatus;
  customLabel?: string;
  className?: string;
}) {
  const t = useTranslations("status");
  const label = customLabel ?? t(status);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-[6px] rounded-full border px-[11px] py-[5px]",
        "bg-[rgba(13,14,16,0.85)] backdrop-blur-[6px]",
        "font-mono text-[11px] font-semibold tracking-[0.02em]",
        status === "award"
          ? "border-coral text-coral"
          : "border-rule text-ink-soft",
        className,
      )}
    >
      <span
        className={clsx(
          "h-[6px] w-[6px] rounded-full",
          status === "live" && "bg-coral animate-[pulse-dot_2s_ease-in-out_infinite]",
          status === "wip" && "bg-[#fbbf24]",
          status === "archived" && "bg-ink-mute",
          status === "award" && "bg-coral",
        )}
      />
      <span>{label}</span>
    </span>
  );
}
