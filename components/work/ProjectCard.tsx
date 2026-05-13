import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RichText } from "@/components/ui/RichText";
import { ProjectCover } from "@/components/work/ProjectCover";
import { StatusBadge } from "@/components/work/StatusBadge";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/lib/types";

// Standalone project card used by the work archive grid. Series render through
// SeriesCard instead — different visual treatment.
export async function ProjectCard({
  project,
  number,
  locale,
}: {
  project: Project;
  number: number;
  locale: Locale;
}) {
  const t = await getTranslations("workArchive");
  const numLabel = `№ ${number.toString().padStart(2, "0")} · ${project.year}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[14px] border-[1.5px] border-rule bg-paper-2 transition-all duration-[250ms] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:border-coral hover:shadow-[6px_6px_0_var(--coral)]">
      <ProjectCover project={project}>
        <StatusBadge
          status={project.status}
          customLabel={project.statusLabel}
          className="absolute left-[14px] top-[14px]"
        />
        <span className="absolute bottom-[14px] right-[14px] rounded-md border border-rule bg-[rgba(13,14,16,0.7)] px-[10px] py-1 font-mono text-[0.7rem] tracking-[0.1em] text-ink-mute">
          {numLabel}
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
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-[5px] text-ink-mute transition-colors hover:text-coral"
          >
            {t("actionLive")} ↗
          </a>
        )}
        {project.links?.github && (
          <>
            {project.links?.live && <span className="text-rule">·</span>}
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-[5px] text-ink-mute transition-colors hover:text-coral ${
                project.links?.live ? "" : "ml-auto"
              }`}
            >
              {t("actionGitHub")} ↗
            </a>
          </>
        )}
      </div>
    </article>
  );
}
