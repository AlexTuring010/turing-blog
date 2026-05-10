import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { MDXContent } from "@/components/mdx/MDXContent";
import { MissingTranslationBanner } from "@/components/post/MissingTranslationBanner";
import { routing, type Locale } from "@/i18n/routing";
import {
  getAdjacentPosts,
  getAllPostSlugLocalePairs,
  getPostBySlug,
  postExistsInOtherLocale,
} from "@/lib/content";
import type { Post } from "@/lib/types";

export function generateStaticParams() {
  return getAllPostSlugLocalePairs();
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/writing/[slug]">) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) return {};
  const post = getPostBySlug(slug, locale as Locale);
  if (!post) return { title: slug };
  return {
    title: `${plainTitle(post.title)} — The Turing Blog`,
    description: post.description.replace(/\*+/g, ""),
  };
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/writing/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const post = getPostBySlug(slug, locale);
  if (!post) {
    const otherLocale = postExistsInOtherLocale(slug, locale);
    if (otherLocale) {
      return <MissingTranslationBanner slug={slug} source={otherLocale} />;
    }
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug, locale);
  return <PostView post={post} body={post.body} prev={prev} next={next} />;
}

async function PostView({
  post,
  body,
  prev,
  next,
}: {
  post: Post;
  body: string;
  prev?: Post;
  next?: Post;
}) {
  const t = await getTranslations("post");
  const tTags = await getTranslations("tags");
  const format = await getFormatter();

  const date = format.dateTime(new Date(post.date), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <article className="mx-auto max-w-[720px] px-5 pb-8 pt-10 sm:px-8 sm:pt-16">
        <Link
          href={`/${post.locale}/writing`}
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-ink-mute transition-all hover:gap-3 hover:text-coral"
        >
          ← {t("backToWriting")}
        </Link>

        <header className="mb-12">
          <div className="mb-6 flex items-center gap-[14px] text-[13px] font-medium uppercase tracking-[0.02em] text-ink-mute">
            <span>{date}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
            <span>
              {t("approxPrefix")}
              {post.readingTime} {t("minutes")}
            </span>
            {post.tags[0] && (
              <>
                <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
                <span className="font-normal normal-case tracking-normal text-coral">
                  {tTags(post.tags[0])}
                </span>
              </>
            )}
          </div>

          <h1
            className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.02em]"
            style={{ fontVariationSettings: '"opsz" 96' }}
          >
            <RichText text={post.title} />
          </h1>

          <p className="mt-5 text-[1.15rem] font-medium leading-[1.5] text-ink-soft">
            <RichText text={post.description} />
          </p>

          <div className="mt-8 flex items-center gap-[14px] border-t border-rule pt-6">
            <div className="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border-[1.5px] border-coral">
              <Image
                src="/me.jpg"
                alt={t("authorName")}
                fill
                sizes="42px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-sm font-semibold text-ink">{t("authorName")}</span>
              <span className="text-xs text-ink-mute">{t("authorMeta")}</span>
            </div>
          </div>
        </header>

        <div className="post-body text-[18px] leading-[1.7] text-ink [&_*+*]:mt-6">
          <MDXContent source={body} />
        </div>
      </article>

      <PostNavBand post={post} prev={prev} next={next} />
    </>
  );
}

async function PostNavBand({
  post,
  prev,
  next,
}: {
  post: Post;
  prev?: Post;
  next?: Post;
}) {
  const t = await getTranslations("post");
  return (
    <section className="mt-6 border-y border-rule bg-footer py-12">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-12">
        <div className="mb-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-rule bg-paper px-3 py-[5px] text-xs font-semibold lowercase tracking-[0.02em] text-ink-soft"
            >
              #{tag}
            </span>
          ))}
        </div>

        {(prev || next) && (
          <nav className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-20">
            <div>
              {prev && (
                <Link
                  href={`/${post.locale}/writing/${prev.slug}`}
                  className="group flex flex-col gap-[6px]"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-mute">
                    {t("prevLabel")}
                  </span>
                  <span className="text-[15px] font-semibold leading-[1.4] text-ink-soft transition-colors group-hover:text-coral">
                    <RichText text={prev.title} />
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {next && (
                <Link
                  href={`/${post.locale}/writing/${next.slug}`}
                  className="group flex flex-col items-start gap-[6px] sm:items-end"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-mute">
                    {t("nextLabel")}
                  </span>
                  <span className="text-[15px] font-semibold leading-[1.4] text-ink-soft transition-colors group-hover:text-coral">
                    <RichText text={next.title} />
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}

function plainTitle(s: string): string {
  return s.replace(/\*+/g, "");
}
