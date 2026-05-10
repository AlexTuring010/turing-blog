import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RichText } from "@/components/ui/RichText";
import { ProjectCover } from "@/components/work/ProjectCover";
import { StatusBadge } from "@/components/work/StatusBadge";
import { routing, type Locale } from "@/i18n/routing";
import { getAllProjects } from "@/lib/content";
import type { Project } from "@/lib/types";

export default async function WorkPage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) return null;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const projects = getAllProjects(locale);
  const t = await getTranslations("workArchive");

  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-24 pt-10 sm:px-12 sm:pt-16">
      <header className="mb-12 max-w-[720px]">
        <div className="mb-4 flex items-center gap-[14px] font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-ink-mute">
          <span>
            {projects.length} {t("eyebrowSuffix")}
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} locale={locale} />
        ))}
      </div>
    </main>
  );
}

async function ProjectCard({
  project,
  index,
  locale,
}: {
  project: Project;
  index: number;
  locale: Locale;
}) {
  const t = await getTranslations("workArchive");

  return (
    <article className="group flex flex-col overflow-hidden rounded-[14px] border-[1.5px] border-rule bg-paper-2 transition-all duration-[250ms] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:border-coral hover:shadow-[6px_6px_0_var(--coral)]">
      <ProjectCover project={project}>
        <StatusBadge
          status={project.status}
          customLabel={project.statusLabel}
          className="absolute left-[14px] top-[14px]"
        />
        <span className="absolute bottom-[14px] right-[14px] rounded-md border border-rule bg-[rgba(13,14,16,0.7)] px-[10px] py-1 font-mono text-[0.7rem] tracking-[0.1em] text-ink-mute">
          № 0{index + 1} · {project.year}
        </span>
      </ProjectCover>

      <div className="flex flex-1 flex-col gap-[14px] px-[26px] pb-[22px] pt-6">
        <h2
          className="text-[1.5rem] font-extrabold leading-[1.15] tracking-[-0.01em] text-ink"
          style={{ fontVariationSettings: '"opsz" 64' }}
        >
          <RichText text={project.title} />
        </h2>
        <p className="text-[0.95rem] font-normal leading-[1.5] text-ink-soft">
          {project.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-[6px] pt-[6px]">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-rule bg-paper px-[9px] py-[3px] font-mono text-[11px] font-medium tracking-[0.02em] text-ink-soft"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-[14px] border-t border-rule bg-paper px-[26px] py-[14px] text-[13px] font-semibold">
        <Link
          href={`/${locale}/work/${project.slug}`}
          className="inline-flex items-center gap-[5px] text-ink transition-all hover:gap-[8px] hover:text-coral"
        >
          {t("actionCaseStudy")} →
        </Link>
        {project.links?.live && (
          <>
            <span className="ml-auto text-rule">·</span>
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[5px] text-ink-mute transition-colors hover:text-coral"
            >
              {t("actionLive")} ↗
            </a>
          </>
        )}
        {project.links?.github && (
          <>
            <span className={project.links?.live ? "text-rule" : "ml-auto"}>·</span>
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[5px] text-ink-mute transition-colors hover:text-coral"
            >
              {t("actionGitHub")} ↗
            </a>
          </>
        )}
      </div>
    </article>
  );
}
