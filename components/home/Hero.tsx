import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { StatusDot } from "@/components/ui/StatusDot";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative px-0 pb-20 pt-[60px]">
      <Container className="relative z-[1] grid items-center gap-10 md:grid-cols-[0.75fr_1fr] md:gap-[60px] md:min-h-[calc(85vh-110px)]">
        {/* Photo */}
        <div className="relative w-full max-w-[340px] justify-self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] border-[1.5px] border-coral bg-paper-2 shadow-[6px_6px_0_var(--coral)]">
            <Image
              src="/me.jpg"
              alt={t("photoAlt")}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 340px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="mb-[14px] text-[1.15rem] font-medium tracking-[-0.005em] text-ink-soft">
            {t("eyebrowGreeting")}{" "}
            <span className="font-bold text-ink">{t("eyebrowName")}</span>
          </p>

          <h1
            className="font-display mb-[18px] text-[clamp(3rem,6.5vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.035em]"
            style={{ fontVariationSettings: '"opsz" 96' }}
          >
            {t("titleLine1Pre")}
            <span className="italic font-bold text-coral-dark">
              {t("titleLine1It")}
            </span>
            {t("titleLine2Pre")}
            <span className="text-coral">{t("titleLine2Coral")}</span>
            {t("titleLine2Post")}
          </h1>

          <p className="mb-7 max-w-[46ch] text-[1.25rem] font-medium leading-[1.5] text-ink-soft">
            <RichText
              text={t("lede")}
              emClassName="not-italic font-semibold text-ink"
            />
          </p>

          <div className="mb-6 mt-2 inline-flex items-center gap-[10px] rounded-full border-[1.5px] border-coral bg-transparent px-4 py-[9px] text-[13px] font-medium text-ink">
            <StatusDot />
            <span>
              {t("statusLabel")}{" "}
              <span className="font-semibold text-coral">
                {t("statusValue")}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-[14px]">
            <Link
              href={`/${locale}/writing`}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-coral bg-coral px-[22px] py-[14px] text-sm font-semibold tracking-[0.02em] text-paper transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-coral-dark hover:shadow-[3px_3px_0_var(--ink)]"
            >
              {t("ctaPrimary")} <span className="font-bold">→</span>
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-coral bg-transparent px-[22px] py-[14px] text-sm font-semibold tracking-[0.02em] text-ink transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-ink hover:text-paper hover:shadow-[4px_4px_0_var(--coral)]"
            >
              <RichText
                text={t("ctaGhost")}
                emClassName="italic font-bold text-coral-dark"
              />{" "}
              <span className="font-bold">↗</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
