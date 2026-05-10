// Domain types for posts and projects.
//
// Titles and descriptions can include `*word*` markers — these render as
// italic + coral-dark emphasis via <RichText/>. The convention matches what
// MDX frontmatter strings will use in Phase 2 (YAML strings can't carry JSX).

import type { Locale } from "@/i18n/routing";

export type PostTag =
  | "project"
  | "competition"
  | "learning"
  | "life"
  | "notes";

export type ProjectStatus = "live" | "wip" | "archived" | "award";

export type ProjectTag = "side-project" | "freelance" | "competition";

export type CoverColor =
  | "c-mint"
  | "c-coral"
  | "c-butter"
  | "c-dark"
  | "c-mix"
  | "c-pattern";

export type Cover =
  | { kind: "color"; tone: CoverColor; deco?: string; decoColor?: string }
  | { kind: "image"; src: string };

export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string; // ISO 8601
  tags: PostTag[];
  readingTime: number;
  featured?: boolean;
  cover?: Cover;
};

export type Project = {
  slug: string;
  locale: Locale;
  title: string;
  tagline: string;
  year: number;
  status: ProjectStatus;
  statusLabel: string;
  stack: string[];
  links?: { live?: string; github?: string };
  order: number;
  cover?: string;
};
