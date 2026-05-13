import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXContent } from "@/components/mdx/MDXContent";
import { MissingTranslationBanner } from "@/components/post/MissingTranslationBanner";
import { ProjectDetailView } from "@/components/work/ProjectDetailView";
import { RichText } from "@/components/ui/RichText";
import { routing, type Locale } from "@/i18n/routing";
import {
  getAllProjectSlugLocalePairs,
  getAllSeriesSlugLocalePairs,
  getProjectBySlug,
  getRelatedPostsForProject,
  getSeriesBySlug,
  getSeriesItems,
  isSeriesSlug,
  projectExistsInOtherLocale,
  seriesExistsInOtherLocale,
} from "@/lib/content";
import type { SeriesItem } from "@/lib/types";

// One route handles both /[locale]/work/<project-slug> and
// /[locale]/work/<series-slug>. Series item case studies live at the deeper
// /[locale]/work/<series-slug>/<item-slug> route.

export function generateStaticParams() {
  return [
    ...getAllProjectSlugLocalePairs(),
    ...getAllSeriesSlugLocalePairs().map(({ seriesSlug, locale }) => ({
      slug: seriesSlug,
      locale,
    })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) return {};
  const project = getProjectBySlug(slug, locale as Locale);
  if (project) {
    return {
      title: `${project.title.replace(/\*+/g, "")} — Work`,
      description: project.description,
    };
  }
  const series = getSeriesBySlug(slug, locale as Locale);
  if (series) {
    return {
      title: `${series.title.replace(/\*+/g, "")} — Work`,
      description: series.description ?? series.title.replace(/\*+/g, ""),
    };
  }
  return { title: slug };
}

export default async function WorkCasePage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  // Series page wins over project page if both happened to share a slug.
  if (isSeriesSlug(slug)) {
    return <SeriesDetailPage slug={slug} locale={locale} />;
  }

  const project = getProjectBySlug(slug, locale);
  if (!project) {
    const otherLocale = projectExistsInOtherLocale(slug, locale);
    if (otherLocale) {
      return <MissingTranslationBanner slug={`work/${slug}`} source={otherLocale} />;
    }
    notFound();
  }

  const relatedPosts = getRelatedPostsForProject(slug, locale);

  return (
    <ProjectDetailView
      project={{
        slug: project.slug,
        title: project.title,
        description: project.description,
        year: project.year,
        status: project.status,
        statusLabel: project.statusLabel,
        category: project.category,
        stack: project.stack,
        links: project.links,
        cover: project.cover,
      }}
      body={project.body}
      relatedPosts={relatedPosts}
      locale={locale}
      backHref={`/${locale}/work`}
      backLabelKey="backToWork"
    />
  );
}

async function SeriesDetailPage({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const series = getSeriesBySlug(slug, locale);
  if (!series) {
    const otherLocale = seriesExistsInOtherLocale(slug, locale);
    if (otherLocale) {
      return <MissingTranslationBanner slug={`work/${slug}`} source={otherLocale} />;
    }
    notFound();
  }
  const items = getSeriesItems(slug, locale);
  const t = await getTranslations("workCase");

  return (
    <main className="mx-auto max-w-[1000px] px-5 pb-16 pt-10 sm:px-12 sm:pt-12">
      <Link
        href={`/${locale}/work`}
        className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-ink-mute transition-all hover:gap-3 hover:text-coral"
      >
        ← {t("backToWork")}
      </Link>

      <header className="mb-10">
        <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-ink-mute">
          <span>{series.category}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
          <span>{series.year}</span>
          {series.context && (
            <>
              <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
              <span>{series.context}</span>
            </>
          )}
        </div>
        <h1
          className="mb-5 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontVariationSettings: '"opsz" 96' }}
        >
          <RichText text={series.title} />
        </h1>
        {series.description && (
          <p className="max-w-[720px] text-[1.1rem] font-medium leading-[1.5] text-ink-soft">
            {series.description}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-[7px]">
          {series.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-rule bg-paper-2 px-[11px] py-[5px] font-mono text-[12px] font-medium tracking-[0.02em] text-ink-soft"
            >
              {s}
            </span>
          ))}
        </div>
      </header>

      {items.length > 0 && <SeriesItemList items={items} locale={locale} seriesSlug={slug} />}

      <article className="post-body mx-auto max-w-[720px] pt-4 text-[17px] leading-[1.7] text-ink [&_*+*]:mt-6">
        <MDXContent source={series.body} />
      </article>
    </main>
  );
}

async function SeriesItemList({
  items,
  locale,
  seriesSlug,
}: {
  items: SeriesItem[];
  locale: Locale;
  seriesSlug: string;
}) {
  const t = await getTranslations("workCase");
  return (
    <section className="my-10 border-y border-rule bg-footer py-8">
      <div className="mb-[18px] flex items-baseline gap-[14px]">
        <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.05em] text-coral">
          {t("seriesItemsLabel")}
        </span>
        <span className="h-px flex-1 bg-rule" />
        <span className="font-mono text-[11px] text-ink-mute">
          {items.length}
        </span>
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${locale}/work/${seriesSlug}/${item.slug}`}
            className="group/item grid grid-cols-[auto_1fr_auto_auto] items-center gap-[18px] border-b border-rule py-[14px] last:border-b-0 transition-colors hover:text-coral"
          >
            <span className="min-w-[48px] font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-coral">
              {item.seriesLabel}
            </span>
            <span className="flex min-w-0 flex-col gap-[3px]">
              <span className="text-[0.97rem] font-medium text-ink transition-colors group-hover/item:text-coral">
                <RichText text={item.title} />
              </span>
              <span className="line-clamp-1 text-[0.85rem] text-ink-mute">
                {item.description}
              </span>
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-soft">
              {item.status}
            </span>
            <span className="text-[0.95rem] text-ink-mute transition-transform group-hover/item:translate-x-[4px] group-hover/item:text-coral">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
