import type { Metadata } from "next";
import { Bricolage_Grotesque, Bowlby_One, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: "The Turing Blog",
  description: "Personal site & blog of Αλέξανδρος Γκιάφης (Alex).",
};

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
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
