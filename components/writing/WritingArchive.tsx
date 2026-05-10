"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";
import clsx from "clsx";
import { RichText } from "@/components/ui/RichText";
import type { Locale } from "@/i18n/routing";
import type { Post, PostTag } from "@/lib/types";

const FILTER_TAGS: PostTag[] = [
  "project",
  "competition",
  "learning",
  "life",
  "notes",
];

export function WritingArchive({
  posts,
  locale,
}: {
  posts: Post[];
  locale: Locale;
}) {
  const t = useTranslations("writingArchive");
  const tTags = useTranslations("tags");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTag = (searchParams.get("tag") as PostTag | null) ?? null;
  const isValidTag = activeTag !== null && FILTER_TAGS.includes(activeTag);
  const effectiveTag = isValidTag ? activeTag : null;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    for (const tag of FILTER_TAGS) c[tag] = 0;
    for (const post of posts) {
      for (const tag of post.tags) {
        if (tag in c) c[tag] += 1;
      }
    }
    return c;
  }, [posts]);

  const visible = effectiveTag
    ? posts.filter((p) => p.tags.includes(effectiveTag))
    : posts;

  const setTag = (tag: PostTag | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === null) params.delete("tag");
    else params.set("tag", tag);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2 border-y border-rule py-4">
        <span className="mr-2 font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-mute">
          {t("filterLabel")}
        </span>
        <FilterPill
          active={effectiveTag === null}
          onClick={() => setTag(null)}
          count={counts.all}
        >
          {t("filterAll")}
        </FilterPill>
        {FILTER_TAGS.map((tag) => (
          <FilterPill
            key={tag}
            active={effectiveTag === tag}
            onClick={() => setTag(tag)}
            count={counts[tag] ?? 0}
          >
            {tTags(tag)}
          </FilterPill>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-ink-mute">{t("emptyState")}</p>
      ) : (
        <div className="flex flex-col">
          {visible.map((post) => (
            <PostRow key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full border-[1.5px] px-[14px] py-[6px] text-[13px] font-semibold transition-all",
        active
          ? "border-coral bg-coral text-paper"
          : "border-rule bg-transparent text-ink-soft hover:border-coral hover:text-ink",
      )}
    >
      {children}
      <span className="ml-[6px] font-mono text-[11px] opacity-60">{count}</span>
    </button>
  );
}

function PostRow({ post, locale }: { post: Post; locale: Locale }) {
  const t = useTranslations("writingArchive");
  const tTags = useTranslations("tags");
  const format = useFormatter();
  const date = format.dateTime(new Date(post.date), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/${locale}/writing/${post.slug}`}
      className="group grid items-start gap-8 border-b border-rule py-8 last:border-b-0 sm:grid-cols-[1fr_auto]"
    >
      <div className="min-w-0">
        <div className="mb-[14px] flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-ink-mute">
          <span>{date}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
          {post.tags[0] && (
            <span className="font-normal normal-case tracking-normal text-coral">
              {tTags(post.tags[0])}
            </span>
          )}
        </div>
        <h2
          className={clsx(
            "mb-[10px] text-[1.6rem] font-bold leading-[1.2] tracking-[-0.01em] text-ink transition-colors group-hover:text-coral",
            post.featured && "before:mr-[2px] before:text-[0.85em] before:text-coral before:content-['★']",
          )}
          style={{ fontVariationSettings: '"opsz" 64' }}
        >
          <RichText text={post.title} />
        </h2>
        <p className="line-clamp-2 text-[0.97rem] font-normal leading-[1.55] text-ink-soft">
          <RichText text={post.description} />
        </p>
      </div>
      <span className="pt-1 font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-ink-mute whitespace-nowrap">
        {post.readingTime} {t("minutesShort")}
      </span>
    </Link>
  );
}
