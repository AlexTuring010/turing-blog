import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { MDXContent } from "@/components/mdx/MDXContent";
import { ProjectCover } from "@/components/work/ProjectCover";
import { StatusBadge } from "@/components/work/StatusBadge";
import { RichText } from "@/components/ui/RichText";
import type { Locale } from "@/i18n/routing";
import type {
  Post,
  ProjectCategory,
  ProjectStatus,
} from "@/lib/types";

// Visual matches design-references/project-detail.html:
// - 2-col header (text + square cover) at 1000px wrap
// - Related-posts band (dark, full-bleed) between header and body, when present
// - Case-study body in a 720px reading column inside the 1000px wrap

type DetailProps = {
  // Either a real Project or a synthetic one for series-item rendering.
  project: {
    slug: string;
    title: string;
    description: string;
    year: number;
    status: ProjectStatus;
    statusLabel: string;
    category: ProjectCategory;
    stack: string[];
    links?: { live?: string; github?: string };
    cover?: string;
  };
  body: string;
  relatedPosts: Post[];
  locale: Locale;
  backHref: string;
  backLabelKey: "backToWork" | "backToSeries";
  // Optional caption shown in the meta row in place of plain category, e.g.
  // "school · OS-coursework · HW1" for series items.
  metaContextLabel?: string;
};

export async function ProjectDetailView({
  project,
  body,
  relatedPosts,
  locale,
  backHref,
  backLabelKey,
  metaContextLabel,
}: DetailProps) {
  const t = await getTranslations("workCase");
  const tCat = await getTranslations("workArchive.categories");

  return (
    <>
      <div className="mx-auto max-w-[1000px] px-5 pb-8 pt-10 sm:px-12 sm:pt-12">
        <Link
          href={backHref}
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-ink-mute transition-all hover:gap-3 hover:text-coral"
        >
          ← {t(backLabelKey)}
        </Link>

        <header className="mb-12 grid grid-cols-1 items-start gap-12 md:grid-cols-[1.2fr_1fr]">
          <div className="min-w-0">
            <div className="mb-[18px] flex flex-wrap items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-ink-mute">
              <span>
                {metaContextLabel ?? (
                  <RichText text={stripEm(tCat(project.category))} />
                )}
              </span>
              <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
              <span>{project.year}</span>
              <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
              <StatusBadge
                status={project.status}
                customLabel={project.statusLabel}
              />
            </div>

            <h1
              className="mb-[18px] text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={{ fontVariationSettings: '"opsz" 96' }}
            >
              <RichText text={project.title} />
            </h1>

            <p className="mb-6 text-[1.1rem] font-medium leading-[1.5] text-ink-soft">
              {project.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-[7px]">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-rule bg-paper-2 px-[11px] py-[5px] font-mono text-[12px] font-medium tracking-[0.02em] text-ink-soft"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-[10px]">
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[6px] rounded-lg border-[1.5px] border-coral bg-coral px-[14px] py-[9px] text-[13px] font-semibold text-paper transition-colors hover:bg-coral-dark"
                >
                  {t("linkGitHub")} ↗
                </a>
              )}
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[6px] rounded-lg border-[1.5px] border-rule bg-paper-2 px-[14px] py-[9px] text-[13px] font-semibold text-ink transition-colors hover:border-coral hover:text-coral"
                >
                  {t("linkLive")} ↗
                </a>
              )}
            </div>
          </div>

          <div className="order-first md:order-last">
            <div className="overflow-hidden rounded-[12px] border-[1.5px] border-rule">
              <ProjectCover
                project={{ slug: project.slug, cover: project.cover }}
              />
            </div>
          </div>
        </header>
      </div>

      {relatedPosts.length > 0 && (
        <RelatedPostsBand posts={relatedPosts} locale={locale} />
      )}

      <article className="mx-auto max-w-[1000px] px-5 sm:px-12">
        <div className="post-body mx-auto max-w-[720px] pb-16 text-[17px] leading-[1.7] text-ink [&_*+*]:mt-6">
          <MDXContent source={body} />
        </div>
      </article>
    </>
  );
}

async function RelatedPostsBand({
  posts,
  locale,
}: {
  posts: Post[];
  locale: Locale;
}) {
  const t = await getTranslations("workCase");
  const format = await getFormatter();
  const countLabel =
    posts.length === 1
      ? `1 ${t("relatedPostsCountSingular")}`
      : `${posts.length} ${t("relatedPostsCountPlural")}`;

  return (
    <section className="mb-12 border-y border-rule bg-footer py-8">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-12">
        <div className="mb-[18px] flex items-baseline gap-[14px]">
          <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.05em] text-coral">
            {t("relatedPostsLabel")}
          </span>
          <span className="h-px flex-1 bg-rule" />
          <span className="font-mono text-[11px] text-ink-mute">{countLabel}</span>
        </div>
        <div className="flex flex-col">
          {posts.map((p) => {
            const date = format.dateTime(new Date(p.date), {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            return (
              <Link
                key={p.slug}
                href={`/${locale}/writing/${p.slug}`}
                className="group/related grid grid-cols-[auto_1fr_auto] items-center gap-[18px] border-b border-rule py-[14px] last:border-b-0 transition-colors hover:text-coral"
              >
                <span className="min-w-[90px] whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.05em] text-ink-mute">
                  {date}
                </span>
                <span className="text-[0.97rem] font-medium leading-[1.35] text-ink transition-colors group-hover/related:text-coral">
                  <RichText text={p.title} />
                </span>
                <span className="text-[0.95rem] text-ink-mute transition-all group-hover/related:translate-x-[4px] group-hover/related:text-coral">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function stripEm(s: string): string {
  return s.replace(/\*+/g, "");
}
