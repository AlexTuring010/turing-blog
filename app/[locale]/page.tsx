import Link from "next/link";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function Phase0Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Phase0Content locale={locale} />;
}

function Phase0Content({ locale }: { locale: string }) {
  const t = useTranslations("phase0");
  const otherLocale = locale === "el" ? "en" : "el";

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
        the turing blog · phase 0
      </p>

      <h1 className="font-display mt-4 text-5xl leading-tight text-ink">
        {t("title").split(" — ")[0]} —{" "}
        <span className="it">{t("title").split(" — ")[1]}</span>
      </h1>

      <p className="mt-4 max-w-xl text-lg leading-7 text-ink-soft">
        {t("subtitle")}
      </p>

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink-mute">
          /01 {t("tokensHeading")}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Swatch name="paper" cls="bg-paper border border-rule" />
          <Swatch name="paper-2" cls="bg-paper-2" />
          <Swatch name="paper-3" cls="bg-paper-3" />
          <Swatch name="ink" cls="bg-ink" textCls="text-paper" />
          <Swatch name="coral (green)" cls="bg-coral" textCls="text-paper" />
          <Swatch name="coral-dark" cls="bg-coral-dark" textCls="text-paper" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink-mute">
          /02 {t("fontsHeading")}
        </h2>
        <div className="mt-4 space-y-3">
          <p className="font-display text-3xl text-ink">
            Bricolage Grotesque — display & body. Γειά.
          </p>
          <p className="font-logo text-2xl text-ink">
            Bowlby One — only for the logo.
          </p>
          <p className="font-mono text-sm text-ink-soft">
            JetBrains Mono — code &amp; meta. αβγ 0123 () =&gt;
          </p>
        </div>
      </section>

      <section className="mt-12 border-t border-rule pt-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
          {t("localeLabel")}: <span className="text-coral">{locale}</span>
        </p>
        <div className="mt-3 flex gap-3">
          {routing.locales.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className={
                "font-mono text-sm rounded border px-3 py-1 transition-colors " +
                (l === locale
                  ? "border-coral text-coral"
                  : "border-rule text-ink-soft hover:border-coral hover:text-coral")
              }
            >
              {l.toUpperCase()}
            </Link>
          ))}
          <Link
            href={`/${otherLocale}`}
            className="ml-auto font-mono text-sm text-ink-soft hover:text-coral"
          >
            {t("switchLabel")} →
          </Link>
        </div>
      </section>
    </main>
  );
}

function Swatch({
  name,
  cls,
  textCls = "text-ink",
}: {
  name: string;
  cls: string;
  textCls?: string;
}) {
  return (
    <div className={`rounded p-4 ${cls}`}>
      <span className={`font-mono text-xs ${textCls}`}>{name}</span>
    </div>
  );
}
