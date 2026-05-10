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
};

export type ProjectFrontmatter = {
  title: string;
  description: string;
  year: number;
  status: ProjectStatus;
  statusLabel: string; // localized
  stack: string[];
  links?: ProjectLinks;
  order: number;
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

// Returned by `getPostBySlug` / `getProjectBySlug`: metadata + raw MDX body.
export type PostWithBody = Post & { body: string };
export type ProjectWithBody = Project & { body: string };
