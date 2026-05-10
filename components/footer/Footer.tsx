import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const TODO_EMAIL = "TODO_EMAIL";
const TODO_GITHUB_URL = "https://github.com/AlexTuring010";
const TODO_LINKEDIN_URL = "TODO_LINKEDIN";
const TODO_CV_URL = "TODO_CV_URL";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="border-t-2 border-rule bg-footer pb-[30px] pt-[50px] text-ink">
      <Container>
        <div className="mb-9 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <h4 className="font-display mb-[10px] text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink">
              {t("brandName")}
              <span className="text-coral">.</span>
            </h4>
            <p className="max-w-[32ch] text-[0.95rem] font-medium leading-[1.55] text-[#a89e88]">
              {t("brandBlurb")}
            </p>
          </div>

          <FooterCol heading={t("site")}>
            <FooterLink href={`/${locale}`} label={tNav("home")} />
            <FooterLink href={`/${locale}/writing`} label={tNav("writing")} />
            <FooterLink href={`/${locale}/work`} label={tNav("work")} />
            <FooterLink href={`/${locale}/about`} label={tNav("about")} />
          </FooterCol>

          <FooterCol heading={t("findMe")}>
            <FooterLink href={`mailto:${TODO_EMAIL}`} label={t("linkEmail")} arrow="↗" />
            <FooterLink href={TODO_GITHUB_URL} label={t("linkGitHub")} arrow="↗" external />
            <FooterLink href={TODO_LINKEDIN_URL} label={t("linkLinkedIn")} arrow="↗" external />
            <FooterLink href={TODO_CV_URL} label={tNav("cv")} arrow="↗" external />
          </FooterCol>

          <div>
            <h5 className="mb-[14px] text-[11px] font-bold uppercase tracking-[0.18em] text-coral">
              {t("colophon")}
            </h5>
            <ul className="flex list-none flex-col gap-2 text-sm font-medium text-[#c9be9e]">
              <li>{t("colophonFont")}</li>
              <li>{t("colophonStack")}</li>
              <li>{t("colophonHost")}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-[14px] border-t border-[#3a3530] pt-[22px] text-xs font-medium text-[#7d7665]">
          <span>{t("copyright")}</span>
          <span>{t("location")}</span>
          <span>{t("version")}</span>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h5 className="mb-[14px] text-[11px] font-bold uppercase tracking-[0.18em] text-coral">
        {heading}
      </h5>
      <ul className="flex list-none flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  label,
  arrow = "→",
  external,
}: {
  href: string;
  label: string;
  arrow?: string;
  external?: boolean;
}) {
  const className =
    "flex justify-between gap-[10px] text-sm font-medium text-[#c9be9e] transition-colors hover:text-coral";
  const arr = <span className="text-coral">{arrow}</span>;
  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <li>
        <a
          href={href}
          className={className}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span>{label}</span>
          {arr}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={className}>
        <span>{label}</span>
        {arr}
      </Link>
    </li>
  );
}
