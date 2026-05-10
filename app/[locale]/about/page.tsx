import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import clsx from "clsx";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import { StatusDot } from "@/components/ui/StatusDot";
import { routing, type Locale } from "@/i18n/routing";
import { getAboutContent } from "@/content/about";
import type { AboutContent, ContactLink, ReadingItem, StackGroup } from "@/content/about/types";

export default async function AboutPage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) return null;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const c = getAboutContent(locale);

  return (
    <main className="mx-auto max-w-[920px] px-5 pt-10 sm:px-12 sm:pt-16">
      <Hero content={c} />

      <Section num="/01" title={c.sectionTitles.now} meta={c.nowMeta}>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
          {c.nowItems.map((item) => (
            <div
              key={item.label}
              className="rounded-[10px] border-[1.5px] border-rule bg-paper-2 px-[22px] py-5 transition-colors hover:border-coral"
            >
              <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-coral">
                {item.label}
              </div>
              <div className="text-[0.97rem] font-medium leading-[1.55] text-ink">
                <RichText
                  text={item.content}
                  emClassName="italic font-medium text-ink-soft"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section num="/02" title={c.sectionTitles.arc}>
        <div className="max-w-[680px] text-[1.08rem] leading-[1.75] text-ink-soft [&_p+p]:mt-[1.4em]">
          {c.arcParagraphs.map((p, i) => (
            <p key={i}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      </Section>

      <Section num="/03" title={c.sectionTitles.stack} meta={c.stackMeta}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {c.stackGroups.map((g) => (
            <StackGroupView key={g.label} group={g} />
          ))}
        </div>
      </Section>

      <Section num="/04" title={c.sectionTitles.reading} meta={c.readingMeta}>
        <div className="flex flex-col">
          {c.readingItems.map((item, i) => (
            <ReadingRow key={i} item={item} />
          ))}
        </div>
      </Section>

      <Section num="/05" title={c.sectionTitles.reach}>
        <ContactCard content={c} />
      </Section>
    </main>
  );
}

function Hero({ content }: { content: AboutContent }) {
  return (
    <section className="mb-20 grid items-center gap-8 sm:grid-cols-[1.4fr_1fr] sm:gap-14">
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center gap-[14px] font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-ink-mute">
          <StatusDot className="!h-[6px] !w-[6px] !shadow-[0_0_0_3px_rgba(135,207,64,0.3)]" />
          <span>{content.hero.eyebrowAvailability}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-ink-mute" />
          <span>{content.hero.eyebrowLocation}</span>
        </div>
        <h1
          className="mb-5 text-[clamp(2.5rem,5.5vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontVariationSettings: '"opsz" 96' }}
        >
          <RichText text={content.hero.title} />
        </h1>
        <p className="text-[1.15rem] font-medium leading-[1.55] text-ink-soft">
          <RichText
            text={content.hero.intro}
            emClassName="not-italic font-semibold text-ink"
          />
        </p>
      </div>
      <div className="mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-full border-2 border-coral shadow-[6px_6px_0_var(--coral)] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_var(--coral)] sm:max-w-[340px]">
        <div className="relative aspect-square">
          <Image
            src="/me.jpg"
            alt="Alex"
            fill
            sizes="(max-width: 640px) 260px, 340px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function Section({
  num,
  title,
  meta,
  children,
}: {
  num: string;
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-20">
      <div className="mb-7 flex items-baseline gap-[18px] border-b border-rule pb-[14px]">
        <span className="font-mono text-[0.85rem] font-medium tracking-[0.05em] text-coral">
          {num}
        </span>
        <h2
          className="text-[1.7rem] font-extrabold tracking-[-0.01em]"
          style={{ fontVariationSettings: '"opsz" 64' }}
        >
          <RichText text={title} />
        </h2>
        {meta && (
          <span className="ml-auto font-mono text-[0.8rem] text-ink-mute">{meta}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function StackGroupView({ group }: { group: StackGroup }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-mute">
        {group.label}
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {group.chips.map((c) => (
          <span
            key={c.label}
            className={clsx(
              "rounded-md border px-[11px] py-[5px] font-mono text-[12px] font-medium tracking-[0.02em] transition-colors",
              c.fav
                ? "border-coral bg-[rgba(135,207,64,0.08)] text-coral before:mr-1 before:text-[10px] before:content-['★']"
                : "border-rule bg-paper-2 text-ink-soft hover:border-coral hover:text-ink",
            )}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReadingRow({ item }: { item: ReadingItem }) {
  // Title can include `_word_` for italic suffix (book status note).
  const parts = item.title.split(/(_[^_]+_)/g);
  return (
    <div className="grid items-center gap-[18px] border-b border-rule py-[18px] last:border-b-0 sm:grid-cols-[auto_1fr_auto]">
      <span
        className={clsx(
          "min-w-[70px] rounded border px-2 py-1 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap",
          item.status === "now"
            ? "border-coral bg-coral text-paper"
            : "border-rule text-ink-soft",
        )}
      >
        {item.status === "now" ? "Now" : "Done"}
      </span>
      <span className="min-w-0 text-[0.97rem] font-medium leading-[1.4] text-ink">
        {parts.map((p, i) =>
          p.startsWith("_") && p.endsWith("_") ? (
            <em key={i} className="text-[0.93em] font-normal italic text-ink-soft">
              {p.slice(1, -1)}
            </em>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </span>
      <span className="font-mono text-[11px] text-ink-mute whitespace-nowrap">
        {item.author}
      </span>
    </div>
  );
}

function ContactCard({ content }: { content: AboutContent }) {
  return (
    <div className="rounded-[14px] border-[1.5px] border-rule bg-footer p-7 sm:p-9">
      <p className="mb-6 max-w-[560px] text-[1.05rem] leading-[1.55] text-ink-soft">
        <RichText
          text={content.reachLede}
          emClassName="not-italic font-medium text-ink"
        />
      </p>
      <div className="mb-5 flex flex-wrap gap-[14px]">
        {content.contactLinks.map((link) => (
          <ContactLinkButton key={link.kind} link={link} />
        ))}
      </div>
      <p className="border-t border-rule pt-[18px] font-mono text-[11px] tracking-[0.02em] text-ink-mute">
        {content.responseNote.split("{responseTime}").map((part, i) =>
          i === 0 ? (
            <span key={i}>{part}</span>
          ) : (
            <span key={i}>
              <span className="font-semibold text-coral">{content.responseTime}</span>
              {part}
            </span>
          ),
        )}
      </p>
    </div>
  );
}

function ContactLinkButton({ link }: { link: ContactLink }) {
  const isExternal = link.href.startsWith("http");
  return (
    <a
      href={link.href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={clsx(
        "inline-flex items-center gap-2 rounded-[10px] border-[1.5px] px-4 py-[11px] text-sm font-semibold transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[3px_3px_0_var(--coral)]",
        link.primary
          ? "border-coral bg-coral text-paper hover:bg-coral-dark hover:border-coral-dark"
          : "border-rule bg-paper-2 text-ink hover:border-coral hover:text-coral",
      )}
    >
      <ContactIcon kind={link.kind} />
      <span>{link.label}</span>
      {link.kind !== "email" && (
        <span className="text-[11px] opacity-70">
          {link.kind === "cv" ? "↓" : "↗"}
        </span>
      )}
    </a>
  );
}

function ContactIcon({ kind }: { kind: ContactLink["kind"] }) {
  if (kind === "github") return <GitHubIcon size={16} />;
  if (kind === "linkedin") return <LinkedInIcon size={16} />;
  if (kind === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 .5v.4l8 5 8-5V6.5a.5.5 0 0 0-.5-.5h-15a.5.5 0 0 0-.5.5zm16 2.4l-7.5 4.7a1 1 0 0 1-1 0L4 8.9V18h16V8.9z" />
      </svg>
    );
  }
  // cv
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
    </svg>
  );
}
