import { getTranslations, setRequestLocale } from "next-intl/server";
import { RichText } from "@/components/ui/RichText";
import { ProjectCard } from "@/components/work/ProjectCard";
import { SeriesCard } from "@/components/work/SeriesCard";
import { routing, type Locale } from "@/i18n/routing";
import {
  getTotalProjectsCount,
  getWorkArchiveGroups,
  type CategoryGroup,
} from "@/lib/content";
import type { ProjectSubcategory, WorkArchiveProject } from "@/lib/types";

export default async function WorkPage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) return null;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const groups = getWorkArchiveGroups(locale);
  const total = getTotalProjectsCount(locale);
  const t = await getTranslations("workArchive");

  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-24 pt-10 sm:px-12 sm:pt-16">
      <header className="mb-12 max-w-[720px]">
        <div className="mb-4 flex items-center gap-[14px] font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-ink-mute">
          <span>
            {total} {total === 1 ? t("countSingular") : t("countPlural")}
          </span>
          <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
          <span>{t("yearRange")}</span>
        </div>
        <h1
          className="mb-4 text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.02em]"
          style={{ fontVariationSettings: '"opsz" 96' }}
        >
          <RichText text={t("title")} />
        </h1>
        <p className="text-[1.1rem] font-medium leading-[1.5] text-ink-soft">
          {t("lede")}
        </p>
      </header>

      {groups.map((group, idx) => (
        <Cluster
          key={group.category}
          group={group}
          index={idx + 1}
          locale={locale}
        />
      ))}
    </main>
  );
}

async function Cluster({
  group,
  index,
  locale,
}: {
  group: CategoryGroup;
  index: number;
  locale: Locale;
}) {
  const t = await getTranslations("workArchive");
  const clusterLabel = `/${index.toString().padStart(2, "0")}`;
  const titleKey = `categories.${group.category}` as const;
  const totalUnits =
    group.units.length +
    group.subcategories.reduce((sum, s) => sum + s.units.length, 0);
  const countLabel =
    totalUnits === 1
      ? `1 ${t("countSingular")}`
      : `${totalUnits} ${t("countPlural")}`;

  return (
    <section className="mb-16 last:mb-0" id={group.category}>
      <div className="mb-6 flex items-baseline gap-[18px] border-b border-rule pb-[14px]">
        <span className="font-mono text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-ink-mute">
          {clusterLabel}
        </span>
        <h2
          className="text-[1.6rem] font-extrabold tracking-[-0.01em] text-ink"
          style={{ fontVariationSettings: '"opsz" 64' }}
        >
          <RichText text={t(titleKey)} />
        </h2>
        <span className="ml-auto font-mono text-[0.8rem] font-medium text-coral">
          {countLabel}
        </span>
      </div>

      {group.units.length > 0 && (
        <UnitGrid units={group.units} locale={locale} />
      )}

      {group.subcategories.map((sub) => (
        <Subcategory
          key={sub.subcategory}
          subcategory={sub.subcategory}
          units={sub.units}
          locale={locale}
        />
      ))}
    </section>
  );
}

async function Subcategory({
  subcategory,
  units,
  locale,
}: {
  subcategory: string;
  units: WorkArchiveProject[];
  locale: Locale;
}) {
  const t = await getTranslations("workArchive");
  const seriesCount = units.filter((u) => u.kind === "series").length;
  // The design shows "1 series · 3 items" — "items" counts individual
  // assignments inside the series, plus any standalone projects in the
  // subcategory. When no series is present, just the visible card count.
  const standaloneCount = units.filter((u) => u.kind === "project").length;
  const seriesItemCount = units.reduce(
    (acc, u) => acc + (u.kind === "series" ? u.items.length : 0),
    0,
  );
  const label = t(`subcategories.${subcategory as ProjectSubcategory}`, {});
  const countLabel =
    seriesCount > 0
      ? `${seriesCount} ${t("subcategorySeriesSuffix")} · ${seriesItemCount + standaloneCount} ${t("subcategoryItemsSuffix")}`
      : `${standaloneCount}`;

  return (
    <div className="mb-9 last:mb-0">
      <div className="mb-[18px] flex items-center gap-[14px]">
        <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-coral">
          ▸ {label}
        </span>
        <span className="h-px flex-1 bg-rule" />
        <span className="font-mono text-[11px] tracking-[0.05em] text-ink-mute">
          {countLabel}
        </span>
      </div>
      <UnitGrid units={units} locale={locale} />
    </div>
  );
}

function UnitGrid({
  units,
  locale,
}: {
  units: WorkArchiveProject[];
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {units.map((u, i) => {
        const number = i + 1;
        if (u.kind === "series") {
          return (
            <SeriesCard
              key={`series-${u.series.slug}`}
              series={u.series}
              items={u.items}
              number={number}
              locale={locale}
            />
          );
        }
        return (
          <ProjectCard
            key={u.project.slug}
            project={u.project}
            number={number}
            locale={locale}
          />
        );
      })}
    </div>
  );
}
