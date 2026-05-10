import clsx from "clsx";

// The pulsing green dot used in the hero "Available for…" pill and project
// status pills. Animation lives in globals.css (@keyframes pulse-dot).
export function StatusDot({
  tone = "coral",
  className,
}: {
  tone?: "coral" | "yellow" | "ink-mute";
  className?: string;
}) {
  const ring = {
    coral: "shadow-[0_0_0_4px_rgba(135,207,64,0.3)] bg-coral",
    yellow: "shadow-[0_0_0_4px_rgba(255,200,40,0.3)] bg-[#ffc828]",
    "ink-mute": "shadow-[0_0_0_4px_rgba(122,117,104,0.25)] bg-ink-mute",
  }[tone];

  return (
    <span
      className={clsx(
        "inline-block h-[10px] w-[10px] rounded-full",
        "animate-[pulse-dot_2s_ease-in-out_infinite]",
        ring,
        className,
      )}
    />
  );
}
