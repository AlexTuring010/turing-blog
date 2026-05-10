import type { Metadata } from "next";
import { Bricolage_Grotesque, Bowlby_One, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import "../globals.css";

// Bricolage Grotesque on Google Fonts ships latin + latin-ext + vietnamese only
// (no Greek subset). Greek text in body/headings will use the system fallback —
// we may want to revisit this in Phase 5 (e.g. self-host a Greek-capable build,
// or layer a Greek-only display font for headings).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const bowlby = Bowlby_One({
  variable: "--font-bowlby",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "greek"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) return {};
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: {
      default: t("brand"),
      template: `%s — ${t("brand")}`,
    },
    description:
      locale === "el"
        ? "Προσωπικό site και blog του Αλέξανδρου Γκιάφη."
        : "Personal site & blog of Alexander Gkiafis.",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${bowlby.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        <NextIntlClientProvider>
          <Nav />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
