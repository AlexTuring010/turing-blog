import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXContent } from "@/components/mdx/MDXContent";
import { MissingTranslationBanner } from "@/components/post/MissingTranslationBanner";
import { ProjectCover } from "@/components/work/ProjectCover";
import { StatusBadge } from "@/components/work/StatusBadge";
import { RichText } from "@/components/ui/RichText";
import { routing, type Locale } from "@/i18n/routing";
import {
  getAllProjectSlugLocalePairs,
  getProjectBySlug,
  projectExistsInOtherLocale,
} from "@/lib/content";

// Note: design isn't mocked for the case-study page. This is the simple V1
// per PLAN.md — same reading-column pattern as /writing/[slug] but at 1000px,
// with project chrome (status badge, year, stack) replacing the article meta.
// Refine when the user has a richer design.

export function generateStaticParams() {
  return getAllProjectSlugLocalePairs();
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) return {};
  const project = getProjectBySlug(slug, locale as Locale);
  if (!project) return { title: slug };
  return {
    // Brand suffix comes from the title.template in app/[locale]/layout.tsx.
    title: `${project.title.replace(/\*+/g, "")} — Work`,
    description: project.description,
  };
}

export default async function WorkCasePage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const project = getProjectBySlug(slug, locale);
  if (!project) {
    const otherLocale = projectExistsInOtherLocale(slug, locale);
    if (otherLocale) {
      // Reuse the post-page banner; messaging is generic enough.
      return <MissingTranslationBanner slug={`work/${slug}`} source={otherLocale} />;
    }
    notFound();
  }

  const t = await getTranslations("workCase");

  return (
    <article className="mx-auto max-w-[1000px] px-5 pb-12 pt-10 sm:px-12 sm:pt-16">
      <Link
        href={`/${locale}/work`}
        className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-ink-mute transition-all hover:gap-3 hover:text-coral"
      >
        ← {t("backToWork")}
      </Link>

      <header className="mb-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} customLabel={project.statusLabel} />
          <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-mute">
            {t("yearLabel")} · {project.year}
          </span>
        </div>

        <h1
          className="mb-5 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontVariationSettings: '"opsz" 96' }}
        >
          <RichText text={project.title} />
        </h1>

        <p className="max-w-[720px] text-[1.15rem] font-medium leading-[1.5] text-ink-soft">
          {project.description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
          <div className="flex flex-wrap items-center gap-[6px]">
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-mute">
              {t("stackLabel")}
            </span>
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-rule bg-paper-2 px-[9px] py-[3px] font-mono text-[11px] font-medium tracking-[0.02em] text-ink-soft"
              >
                {s}
              </span>
            ))}
          </div>
          {(project.links?.live || project.links?.github) && (
            <div className="ml-auto flex items-center gap-4 text-[13px] font-semibold">
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[5px] text-ink-mute transition-colors hover:text-coral"
                >
                  Live ↗
                </a>
              )}
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[5px] text-ink-mute transition-colors hover:text-coral"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="overflow-hidden rounded-[14px] border-[1.5px] border-rule">
        <ProjectCover project={project}>
          <span className="absolute bottom-[14px] right-[14px] rounded-md border border-rule bg-[rgba(13,14,16,0.7)] px-[10px] py-1 font-mono text-[0.7rem] tracking-[0.1em] text-ink-mute">
            {project.year}
          </span>
        </ProjectCover>
      </div>

      <div className="post-body mx-auto mt-10 max-w-[720px] text-[18px] leading-[1.7] text-ink [&_*+*]:mt-6">
        <MDXContent source={project.body} />
      </div>
    </article>
  );
}
