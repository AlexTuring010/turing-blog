import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";

// Visual section is in the design but per CLAUDE.md the form is "disabled until
// decided" — the input + button render but the whole control is inert
// (disabled attributes, no submit handler). Easy to wire up later.
export function Newsletter() {
  const t = useTranslations("newsletter");

  return (
    <section className="relative border-y border-rule bg-paper-2 px-0 py-20 text-center">
      <Container className="relative z-[1]">
        <h2
          className="font-display mb-[14px] text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-none tracking-[-0.03em] text-ink"
          style={{ fontVariationSettings: '"opsz" 80' }}
        >
          <RichText text={t("title")} emClassName="italic font-bold text-coral" />
        </h2>
        <p className="mx-auto mb-7 max-w-[50ch] text-[1.1rem] font-medium text-ink-soft">
          {t("body")}
        </p>

        <form
          className="mx-auto flex max-w-[480px] rounded-full border-2 border-coral bg-paper p-[5px]"
          aria-disabled="true"
          action="#"
        >
          <input
            type="email"
            placeholder={t("placeholder")}
            disabled
            className="flex-1 cursor-not-allowed border-none bg-transparent px-[18px] py-[10px] text-sm font-medium text-ink outline-none placeholder:text-ink-mute"
          />
          <button
            type="submit"
            disabled
            className="cursor-not-allowed rounded-full border-none bg-ink px-[22px] py-[11px] text-[13px] font-semibold text-paper opacity-80"
          >
            {t("comingSoon")}
          </button>
        </form>
      </Container>
    </section>
  );
}
