import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedPost } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function FeaturedPost() {
  const t = useTranslations("featured");
  const format = useFormatter();
  const locale = useLocale() as Locale;
  const post = getFeaturedPost(locale);
  if (!post) return null;

  const date = format.dateTime(new Date(post.date), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="px-0 pb-[30px] pt-[60px]">
      <Container>
        <SectionHeading num={t("num")} title={t("title")} meta={t("meta")} opsz={60} />

        <Link
          href={`/${locale}/writing/${post.slug}`}
          className="group grid cursor-pointer overflow-hidden rounded-[20px] border-2 border-coral bg-paper transition-transform duration-[250ms] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--coral)] md:grid-cols-[1.2fr_1fr]"
        >
          {/* Cover */}
          <div className="relative min-h-[260px] overflow-hidden bg-coral md:min-h-[380px]">
            <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold uppercase tracking-[0.1em] text-paper">
              [ project cover ]
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col justify-center gap-[14px] px-8 py-9">
            <div className="flex flex-wrap gap-2">
              <Pill variant="featured">{t("pillFeatured")}</Pill>
              {post.tags.map((tag) => (
                <Pill key={tag} variant={tag}>
                  {tag}
                </Pill>
              ))}
            </div>

            <h3
              className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.02em]"
              style={{ fontVariationSettings: '"opsz" 48' }}
            >
              <RichText text={post.title} />
            </h3>

            <p className="text-[1.05rem] font-medium leading-[1.55] text-ink-soft">
              <RichText text={post.description} />
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-[14px] text-[13px] font-medium text-ink-mute">
              <span className="font-semibold text-ink">{t("byAuthor")}</span>
              <span>·</span>
              <span>{date}</span>
              <span>·</span>
              <span>
                {post.readingTime} {t("minRead")}
              </span>
            </div>
          </div>
        </Link>
      </Container>
    </section>
  );
}
