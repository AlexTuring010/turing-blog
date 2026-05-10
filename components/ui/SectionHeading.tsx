import { RichText } from "./RichText";

// The numbered + italic-emphasised h2 used at the top of every homepage section.
//   <SectionHeading num="01" title="Featured *post.*" meta="— most recent" />
export function SectionHeading({
  num,
  title,
  meta,
  opsz = 60,
}: {
  num: string;
  title: string;
  meta?: string;
  opsz?: number;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-[18px]">
      <h2
        className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none tracking-[-0.03em]"
        style={{ fontVariationSettings: `"opsz" ${opsz}` }}
      >
        <span className="mr-[14px] font-semibold text-coral-dark">{num}</span>
        <RichText text={title} />
      </h2>
      {meta && (
        <span className="text-[13px] font-medium text-ink-mute">{meta}</span>
      )}
    </div>
  );
}
