import type { Locale } from "@/i18n/routing";
import { aboutEl } from "./el";
import { aboutEn } from "./en";
import type { AboutContent } from "./types";

const ABOUT: Record<Locale, AboutContent> = {
  el: aboutEl,
  en: aboutEn,
};

export function getAboutContent(locale: Locale): AboutContent {
  return ABOUT[locale];
}

export type { AboutContent } from "./types";
