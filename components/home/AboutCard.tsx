import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";

export function AboutCard() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <section className="px-0 py-[70px]">
      <Container>
        <div className="relative grid grid-cols-1 items-center gap-9 rounded-[20px] border-[1.5px] border-coral bg-paper p-9 sm:grid-cols-[auto_1fr] sm:text-left">
          <div className="relative z-[1] mx-auto h-[160px] w-[160px] shrink-0 overflow-hidden rounded-full border-2 border-coral bg-paper sm:mx-0">
            <Image
              src="/me.jpg"
              alt={t("avatarAlt")}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>

          <div className="relative z-[1] text-center sm:text-left">
            <div className="mb-[10px] text-[11px] font-bold uppercase tracking-[0.15em] text-ink opacity-70">
              {t("eyebrow")}
            </div>
            <h3
              className="mb-[14px] text-[clamp(1.4rem,2.5vw,2rem)] font-bold leading-[1.2] tracking-[-0.015em]"
              style={{ fontVariationSettings: '"opsz" 36' }}
            >
              <RichText
                text={t("body")}
                emClassName="italic font-bold text-coral"
              />
            </h3>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-[18px] py-[10px] text-[13px] font-semibold text-paper transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-coral hover:shadow-[3px_3px_0_var(--ink)]"
            >
              <span>{t("readMore")}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
