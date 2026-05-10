import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { NavLink } from "./NavLink";
import { LangToggle } from "./LangToggle";

// Real values land in Phase 5. Marked as TODO_ so a single grep replaces them.
const TODO_GITHUB_URL = "https://github.com/AlexTuring010";
const TODO_LINKEDIN_URL = "TODO_LINKEDIN";
const TODO_CV_URL = "TODO_CV_URL";

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const home = `/${locale}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-rule bg-paper py-[18px]">
      <Container className="flex items-center justify-between">
        <Link
          href={home}
          className="font-logo flex items-center gap-2 text-[1.15rem] leading-none tracking-[0.01em] text-ink"
          aria-label="The Turing Blog — Home"
        >
          <span className="inline-block h-[10px] w-[10px] shrink-0 rounded-full bg-coral" />
          The Turing <span className="text-coral">Blog</span>
        </Link>

        <div className="flex items-center gap-[18px] text-sm font-medium">
          <NavLink href={home} exact>
            {t("home")}
          </NavLink>
          <NavLink href={`/${locale}/writing`}>{t("writing")}</NavLink>
          <NavLink href={`/${locale}/work`}>{t("work")}</NavLink>
          <NavLink href={`/${locale}/about`}>{t("about")}</NavLink>

          <span className="mx-1 h-[18px] w-px bg-rule" aria-hidden="true" />

          <a
            href={TODO_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("githubLabel")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-2 hover:text-coral"
          >
            <GitHubIcon />
          </a>

          <a
            href={TODO_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("linkedinLabel")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-2 hover:text-coral"
          >
            <LinkedInIcon />
          </a>

          <a
            href={TODO_CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[5px] rounded-full border-[1.5px] border-coral px-3 py-[6px] text-[13px] font-semibold tracking-[0.02em] text-ink transition-colors hover:bg-coral hover:text-paper"
          >
            {t("cv")} <span className="text-[11px] font-bold">↓</span>
          </a>

          <LangToggle />
        </div>
      </Container>
    </nav>
  );
}
