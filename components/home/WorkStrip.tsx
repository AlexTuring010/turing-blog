import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StackChip } from "@/components/ui/StackChip";
import { getFeaturedProjects } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function WorkStrip() {
  const t = useTranslations("work");
  const locale = useLocale() as Locale;
  const projects = getFeaturedProjects(locale, 3);

  return (
    <section className="border-y border-rule bg-paper-2 px-0 py-[60px]">
      <Container>
        <SectionHeading num={t("num")} title={t("title")} meta={t("meta")} opsz={60} />

        <div className="mt-[30px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/${locale}/work/${p.slug}`}
              className="group relative flex min-h-[240px] cursor-pointer flex-col gap-3 overflow-hidden rounded-[18px] border-[1.5px] border-coral bg-paper px-6 py-[26px] transition-transform duration-[250ms] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[4px_4px_0_var(--coral)]"
            >
              <span className="absolute right-[18px] top-[14px] text-[0.9rem] font-bold text-coral-dark">
                № 0{i + 1}
              </span>

              <div className="flex flex-wrap gap-[6px]">
                {p.stack.map((s) => (
                  <StackChip key={s}>{s}</StackChip>
                ))}
              </div>

              <h3
                className="mt-auto text-[1.8rem] font-bold leading-none tracking-[-0.02em]"
                style={{ fontVariationSettings: '"opsz" 36' }}
              >
                <RichText text={p.title} />
              </h3>

              <p className="text-[0.95rem] font-medium leading-[1.45] text-ink-soft">
                {p.description}
              </p>

              <span className="self-end text-[1.4rem] font-bold text-coral-dark transition-transform duration-200 group-hover:translate-x-1 group-hover:text-coral">
                →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
