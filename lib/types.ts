// Domain types for posts and projects.
//
// Inline emphasis: titles and descriptions can include `*word*` markers — these
// render as italic + coral-dark via <RichText/>. The convention matches what
// MDX frontmatter strings can carry (YAML can't hold JSX) and what mock content
// used in Phase 1.

import type { Locale } from "@/i18n/routing";

export type PostTag =
  | "project"
  | "competition"
  | "learning"
  | "life"
  | "notes";

export type ProjectStatus = "live" | "wip" | "archived" | "award";

export type ProjectCategory =
  | "side-project"
  | "freelance"
  | "competition"
  | "school";

export type ProjectSubcategory =
  | "web"
  | "systems"
  | "compilers"
  | "ml"
  | "distributed"
  | "data"
  | "cli";

export type SeriesItemStatus = "done" | "wip";

export type ProjectLinks = {
  live?: string;
  github?: string;
};

// What lives in the YAML frontmatter at the top of each MDX file.
export type PostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  tags: PostTag[];
  readingTime: number;
  featured?: boolean;
  cover?: string; // path to /public/covers/X
  // Optional pointer to a project case study (slug) or series item
  // ("<series-slug>/<item-slug>"). Renders the "About:" pill on the post page.
  relatedProject?: string;
};

export type ProjectFrontmatter = {
  title: string;
  description: string;
  year: number;
  status: ProjectStatus;
  statusLabel: string; // localized
  category: ProjectCategory;
  subcategory?: ProjectSubcategory;
  stack: string[];
  links?: ProjectLinks;
  order: number;
  cover?: string;
};

// Series metadata (under content/projects/series/<slug>.<locale>.mdx).
// No `status`, `description` is optional, `context` adds a school/term line.
export type SeriesFrontmatter = {
  title: string;
  context?: string;
  description?: string;
  year: number;
  category: ProjectCategory;
  subcategory?: ProjectSubcategory;
  stack: string[];
  order: number;
  cover?: string;
};

// Series item (under content/projects/series/<series-slug>/<item-slug>.<locale>.mdx).
export type SeriesItemFrontmatter = {
  title: string;
  description: string;
  seriesSlug: string;
  seriesOrder: number;
  seriesLabel: string; // "HW1", "Part 02", whatever the author wants on the card
  status: SeriesItemStatus;
  stack: string[];
  links?: ProjectLinks;
  cover?: string;
};

// Frontmatter + the bits we derive from the file path.
export type Post = PostFrontmatter & {
  slug: string;
  locale: Locale;
};

export type Project = ProjectFrontmatter & {
  slug: string;
  locale: Locale;
};

export type Series = SeriesFrontmatter & {
  slug: string;
  locale: Locale;
};

export type SeriesItem = SeriesItemFrontmatter & {
  slug: string; // item slug (e.g. "hw1")
  locale: Locale;
};

// Returned by `get*BySlug`: metadata + raw MDX body.
export type PostWithBody = Post & { body: string };
export type ProjectWithBody = Project & { body: string };
export type SeriesWithBody = Series & { body: string };
export type SeriesItemWithBody = SeriesItem & { body: string };

// What the work archive consumes: a flat-or-series unit that can be rendered
// as either a normal project card or a composite series card. Series carries
// its already-resolved items, ordered by `seriesOrder`.
export type WorkArchiveProject =
  | { kind: "project"; project: Project }
  | { kind: "series"; series: Series; items: SeriesItem[] };
