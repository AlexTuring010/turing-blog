import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RichText } from "@/components/ui/RichText";
import { WritingArchive } from "@/components/writing/WritingArchive";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/content";

export default async function WritingPage({
  params,
}: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) {
    return null;
  }
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const posts = getAllPosts(locale);
  const t = await getTranslations("writingArchive");

  return (
    <main className="mx-auto max-w-[880px] px-5 pb-24 pt-10 sm:px-12 sm:pt-16">
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-[14px] font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-ink-mute">
          <span>
            {posts.length} {t("eyebrowSuffix")}
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
        <p className="max-w-[560px] text-[1.1rem] font-medium leading-[1.5] text-ink-soft">
          {t("lede")}
        </p>
      </header>

      {/* useSearchParams() inside <WritingArchive> requires a Suspense
          boundary for static prerendering — see
          nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
      <Suspense fallback={null}>
        <WritingArchive posts={posts} locale={locale} />
      </Suspense>
    </main>
  );
}
