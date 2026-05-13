import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RichText } from "@/components/ui/RichText";
import type { Locale } from "@/i18n/routing";
import type { Series, SeriesItem } from "@/lib/types";

// Composite "series" card used on the work archive instead of a regular
// ProjectCard. Visually distinct: 3px green top border, no 16:9 cover (header
// strip with SERIES badge + project number), item rows linking to individual
// case studies. Whole-card hover lift is intentionally disabled — only the
// individual item rows hover-highlight, since the items are independent links.
export async function SeriesCard({
  series,
  items,
  number,
  locale,
}: {
  series: Series;
  items: SeriesItem[];
  number: number;
  locale: Locale;
}) {
  const t = await getTranslations("workArchive");
  const numLabel = `№ ${number.toString().padStart(2, "0")} · ${series.year}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border-[1.5px] border-rule border-t-[3px] border-t-coral bg-paper-2">
      {/* Header strip — replaces the 16:9 cover. */}
      <div className="flex items-center justify-between border-b border-rule bg-paper-3 px-[18px] py-[14px]">
        <Link
          href={`/${locale}/work/${series.slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-coral bg-[rgba(135,207,64,0.12)] px-[11px] py-[5px] font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-coral transition-colors hover:bg-[rgba(135,207,64,0.2)]"
        >
          <span>{t("seriesBadge")}</span>
          <span className="rounded-full bg-coral px-[7px] py-[1px] text-[10px] font-bold text-paper">
            {items.length}
          </span>
        </Link>
        <span className="rounded-md border border-rule bg-[rgba(13,14,16,0.7)] px-[10px] py-1 font-mono text-[0.7rem] tracking-[0.1em] text-ink-mute">
          {numLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[14px] px-[26px] pb-[22px] pt-6">
        <Link
          href={`/${locale}/work/${series.slug}`}
          className="block transition-colors hover:text-coral"
        >
          <h2
            className="text-[1.5rem] font-extrabold leading-[1.15] tracking-[-0.01em] text-ink"
            style={{ fontVariationSettings: '"opsz" 64' }}
          >
            <RichText text={series.title} />
          </h2>
        </Link>
        {series.context && (
          <p className="-mt-1 font-mono text-[0.78rem] uppercase tracking-[0.05em] text-ink-mute">
            {series.context}
          </p>
        )}

        <div className="my-1 flex flex-col border-y border-rule">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/work/${series.slug}/${item.slug}`}
              className="group/item grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-rule py-[11px] last:border-b-0 transition-[padding] hover:pl-2"
            >
              <span className="min-w-[36px] font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-coral">
                {item.seriesLabel}
              </span>
              <span className="text-[0.93rem] font-medium leading-[1.35] text-ink transition-colors group-hover/item:text-coral">
                <RichText text={item.title} />
              </span>
              <span
                className={`rounded border border-rule px-[7px] py-[2px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] ${
                  item.status === "wip"
                    ? "text-[#fbbf24] border-[rgba(251,191,36,0.4)]"
                    : "text-ink-soft"
                }`}
              >
                {t(`seriesItemStatus.${item.status}`)}
              </span>
              <span className="font-mono text-[0.95rem] text-ink-mute transition-transform group-hover/item:translate-x-[3px] group-hover/item:text-coral">
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-[6px] pt-[6px]">
          {series.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-rule bg-paper px-[9px] py-[3px] font-mono text-[11px] font-medium tracking-[0.02em] text-ink-soft"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
