import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MissingTranslationBanner } from "@/components/post/MissingTranslationBanner";
import { ProjectDetailView } from "@/components/work/ProjectDetailView";
import { routing, type Locale } from "@/i18n/routing";
import {
  getAllSeriesItemSlugLocalePairs,
  getRelatedPostsForSeriesItem,
  getSeriesBySlug,
  getSeriesItem,
  seriesItemExistsInOtherLocale,
} from "@/lib/content";

// /[locale]/work/<series-slug>/<item-slug> — individual series-item case study.
// Reuses ProjectDetailView so series items match the standalone project layout.

export function generateStaticParams() {
  return getAllSeriesItemSlugLocalePairs().map(
    ({ seriesSlug, itemSlug, locale }) => ({
      slug: seriesSlug,
      itemSlug,
      locale,
    }),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]/[itemSlug]">) {
  const { locale, slug, itemSlug } = await params;
  if (!routing.locales.includes(locale as Locale)) return {};
  const item = getSeriesItem(slug, itemSlug, locale as Locale);
  if (!item) return { title: itemSlug };
  return {
    title: `${item.title.replace(/\*+/g, "")} — Work`,
    description: item.description,
  };
}

export default async function SeriesItemPage({
  params,
}: PageProps<"/[locale]/work/[slug]/[itemSlug]">) {
  const { locale: rawLocale, slug, itemSlug } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const series = getSeriesBySlug(slug, locale);
  const item = getSeriesItem(slug, itemSlug, locale);

  if (!item) {
    const otherLocale = seriesItemExistsInOtherLocale(slug, itemSlug, locale);
    if (otherLocale) {
      return (
        <MissingTranslationBanner
          slug={`work/${slug}/${itemSlug}`}
          source={otherLocale}
        />
      );
    }
    notFound();
  }

  if (!series) notFound();

  const relatedPosts = getRelatedPostsForSeriesItem(slug, itemSlug, locale);
  const metaContextLabel = `${series.category} · ${slug} · ${item.seriesLabel}`;

  // Series items don't carry their own category, status, or year — they
  // inherit context from the parent series. Status is mapped from the item's
  // done/wip flag (no archived/live/award for items).
  return (
    <ProjectDetailView
      project={{
        slug: `${slug}/${itemSlug}`,
        title: item.title,
        description: item.description,
        year: series.year,
        status: item.status === "done" ? "archived" : "wip",
        statusLabel: item.status === "done" ? "DONE" : "WIP",
        category: series.category,
        stack: item.stack,
        links: item.links,
        cover: item.cover,
      }}
      body={item.body}
      relatedPosts={relatedPosts}
      locale={locale}
      backHref={`/${locale}/work/${slug}`}
      backLabelKey="backToSeries"
      metaContextLabel={metaContextLabel}
    />
  );
}
