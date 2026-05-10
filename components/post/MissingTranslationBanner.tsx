import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";

// Shown when /en/writing/foo is requested but only foo.el.mdx exists.
// Per CONTENT.md: "Don't fall back silently — be explicit." We render no body,
// just this banner; one click takes the user to the locale where it exists.
//
// `source` is the locale where the content actually lives (the OTHER locale,
// from the perspective of the visitor). The banner copy is in the visitor's
// locale (the one that came from the URL).
export function MissingTranslationBanner({
  slug,
  source,
}: {
  slug: string;
  source: Locale;
}) {
  const t = useTranslations("post");
  const tm = useTranslations("post.missing");
  const visitorLocale: Locale = source === "el" ? "en" : "el";
  const sourceName = tm(`localeName.${source}` as `localeName.${Locale}`);

  return (
    <article className="mx-auto max-w-[720px] px-5 pb-8 pt-16 sm:px-8">
      <Link
        href={`/${visitorLocale}/writing`}
        className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-ink-mute transition-all hover:gap-3 hover:text-coral"
      >
        ← {t("backToWriting")}
      </Link>

      <div className="rounded-[14px] border-[1.5px] border-coral bg-paper-2 p-8 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-mute">
          {tm("eyebrow")}
        </p>
        <h1
          className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.015em] text-ink"
          style={{ fontVariationSettings: '"opsz" 64' }}
        >
          {tm.rich("body", {
            locale: () => (
              <span className="italic font-bold text-coral-dark">{sourceName}</span>
            ),
          })}
        </h1>
        <Link
          href={`/${source}/writing/${slug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full border-[1.5px] border-coral bg-coral px-5 py-3 text-sm font-semibold text-paper transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-coral-dark hover:shadow-[3px_3px_0_var(--ink)]"
        >
          <span>
            {tm("ctaPrefix")} {sourceName}
          </span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
