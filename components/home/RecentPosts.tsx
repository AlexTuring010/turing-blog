import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRecentPosts, getTotalPostsCount } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import type { Post, PostTag } from "@/lib/types";

const FILTER_TAGS: PostTag[] = [
  "project",
  "competition",
  "learning",
  "life",
  "notes",
];

// Posts without an explicit cover image get one of these tinted backgrounds,
// picked deterministically from the slug so each card is visually distinct
// but the choice is stable across reloads.
const FALLBACK_TONES = [
  "bg-paper-2",
  "bg-coral",
  "bg-paper-3",
  "bg-[#0d0e10]",
] as const;

function pickFallbackTone(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return FALLBACK_TONES[h % FALLBACK_TONES.length];
}

export function RecentPosts() {
  const t = useTranslations("recent");
  const tTags = useTranslations("tags");
  const locale = useLocale() as Locale;

  const posts = getRecentPosts(locale, 6);
  const total = getTotalPostsCount(locale);

  return (
    <section className="px-0 py-[60px]">
      <Container>
        <SectionHeading
          num={t("num")}
          title={t("title")}
          meta={`— ${total} ${t("metaSuffix")}`}
          opsz={60}
        />

        {/* Visual filter row only — interactive filtering lives on /writing in Phase 3 */}
        <div className="mb-[30px] flex flex-wrap items-center gap-2">
          <FilterPill href={`/${locale}/writing`} active>
            {t("filterAll")}
          </FilterPill>
          {FILTER_TAGS.map((tag) => (
            <FilterPill
              key={tag}
              href={`/${locale}/writing?tag=${tag}`}
            >
              {tTags(tag)}
            </FilterPill>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>

        <div className="mt-[50px] text-center">
          <Link
            href={`/${locale}/writing`}
            className="inline-flex items-center gap-[10px] rounded-full border-[1.5px] border-coral bg-ink px-[26px] py-[14px] text-sm font-semibold tracking-[0.02em] text-paper transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-coral hover:shadow-[3px_3px_0_var(--ink)]"
          >
            <span>
              {t("viewAllPrefix")} {total} {t("viewAllSuffix")}
            </span>
            <span>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full border-2 px-[14px] py-[6px] text-xs font-semibold uppercase tracking-[0.04em] transition-all " +
        (active
          ? "border-ink bg-ink text-paper"
          : "border-rule bg-transparent text-ink-soft hover:border-ink hover:text-ink")
      }
    >
      {children}
    </Link>
  );
}

function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const format = useFormatter();
  const tTags = useTranslations("tags");
  const tFeatured = useTranslations("featured");
  const date = format.dateTime(new Date(post.date), {
    day: "2-digit",
    month: "short",
  });
  const primaryTag = post.tags[0];
  const fallbackTone = pickFallbackTone(post.slug);

  return (
    <Link
      href={`/${locale}/writing/${post.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border-[1.5px] border-coral bg-paper transition-transform duration-[250ms] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[4px_4px_0_var(--coral)]"
    >
      <div
        className={
          "relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b-[1.5px] border-coral " +
          (post.cover ? "bg-paper-2" : fallbackTone)
        }
        style={
          post.cover
            ? {
                backgroundImage: `url(${post.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />

      <div className="flex flex-1 flex-col gap-2 px-[22px] pb-[22px] pt-[18px]">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-mute">
          {primaryTag && (
            <Pill variant={primaryTag} size="sm">
              {tTags(primaryTag)}
            </Pill>
          )}
          <span className="opacity-40">·</span>
          <span>{date}</span>
          <span className="opacity-40">·</span>
          <span>
            {post.readingTime} {tFeatured("minRead").replace(" read", "")}
          </span>
        </div>
        <h3
          className="text-[1.4rem] font-bold leading-[1.15] tracking-[-0.015em]"
          style={{ fontVariationSettings: '"opsz" 30' }}
        >
          <RichText text={post.title} />
        </h3>
        <p className="mt-auto text-[0.95rem] font-medium leading-[1.45] text-ink-soft">
          <RichText text={post.description} />
        </p>
      </div>
    </Link>
  );
}
