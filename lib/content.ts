// Content loaders. Reads MDX files from content/posts/ and content/projects/
// at build time (and on-demand in dev). Public API matches what the homepage,
// archive, and post-page components consume.
//
// File naming convention: `<slug>.<locale>.mdx`
//   e.g. content/posts/kv-store.el.mdx, content/posts/kv-store.en.mdx

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import {
  parsePostFrontmatter,
  parseProjectFrontmatter,
} from "./frontmatter";
import type {
  Post,
  PostWithBody,
  Project,
  ProjectWithBody,
} from "./types";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const PROJECTS_DIR = path.join(ROOT, "content", "projects");

const FILENAME_RE = /^(.+)\.(el|en)\.mdx$/;

// Module-level memo. Both build-time SSG and dev hot reload will recompute on
// process restart; in dev a file change triggers a rebuild which re-evaluates
// this module, so no manual invalidation needed.
let postCache: { all: PostWithBody[] } | null = null;
let projectCache: { all: ProjectWithBody[] } | null = null;

function loadAllPosts(): PostWithBody[] {
  if (postCache) return postCache.all;
  const all = readDir(POSTS_DIR).map((entry) => {
    const file = path.join(POSTS_DIR, entry.filename);
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);
    const fm = parsePostFrontmatter(data, `content/posts/${entry.filename}`);
    return { ...fm, slug: entry.slug, locale: entry.locale, body: content };
  });
  postCache = { all };
  return all;
}

function loadAllProjects(): ProjectWithBody[] {
  if (projectCache) return projectCache.all;
  const all = readDir(PROJECTS_DIR).map((entry) => {
    const file = path.join(PROJECTS_DIR, entry.filename);
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);
    const fm = parseProjectFrontmatter(
      data,
      `content/projects/${entry.filename}`,
    );
    return { ...fm, slug: entry.slug, locale: entry.locale, body: content };
  });
  projectCache = { all };
  return all;
}

type DirEntry = { filename: string; slug: string; locale: Locale };

function readDir(dir: string): DirEntry[] {
  if (!fs.existsSync(dir)) return [];
  const out: DirEntry[] = [];
  for (const filename of fs.readdirSync(dir)) {
    const m = FILENAME_RE.exec(filename);
    if (!m) continue;
    const [, slug, locale] = m;
    if (!(routing.locales as readonly string[]).includes(locale)) continue;
    out.push({ filename, slug, locale: locale as Locale });
  }
  return out;
}

// ─── POSTS ───────────────────────────────────────────────────────────

function stripBody<T extends { body: string }>(p: T): Omit<T, "body"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, ...rest } = p;
  return rest;
}

export function getAllPosts(locale: Locale): Post[] {
  return loadAllPosts()
    .filter((p) => p.locale === locale)
    .map(stripBody)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedPost(locale: Locale): Post | undefined {
  return getAllPosts(locale).find((p) => p.featured);
}

export function getRecentPosts(locale: Locale, limit: number): Post[] {
  // Exclude the featured post — it has its own block on the homepage.
  return getAllPosts(locale)
    .filter((p) => !p.featured)
    .slice(0, limit);
}

export function getTotalPostsCount(locale: Locale): number {
  return loadAllPosts().filter((p) => p.locale === locale).length;
}

export function getPostBySlug(
  slug: string,
  locale: Locale,
): PostWithBody | undefined {
  return loadAllPosts().find((p) => p.slug === slug && p.locale === locale);
}

// Returns true if the post exists in the OTHER locale only — used by the
// missing-translation banner on the post page.
export function postExistsInOtherLocale(
  slug: string,
  locale: Locale,
): Locale | undefined {
  const other = locale === "el" ? "en" : "el";
  const exists = loadAllPosts().some(
    (p) => p.slug === slug && p.locale === other,
  );
  return exists ? other : undefined;
}

// All slug × locale pairs for generateStaticParams.
export function getAllPostSlugLocalePairs(): { slug: string; locale: Locale }[] {
  return loadAllPosts().map(({ slug, locale }) => ({ slug, locale }));
}

// Adjacent posts in chronological order (within a locale), used for prev/next nav.
export function getAdjacentPosts(
  slug: string,
  locale: Locale,
): { prev?: Post; next?: Post } {
  const all = getAllPosts(locale); // newest first
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  // "next" = newer, "prev" = older — matches the design's prev/next semantics.
  return {
    next: i > 0 ? all[i - 1] : undefined,
    prev: i < all.length - 1 ? all[i + 1] : undefined,
  };
}

// ─── PROJECTS ────────────────────────────────────────────────────────

export function getAllProjects(locale: Locale): Project[] {
  return loadAllProjects()
    .filter((p) => p.locale === locale)
    .map(stripBody)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(locale: Locale, limit: number): Project[] {
  return getAllProjects(locale).slice(0, limit);
}

export function getTotalProjectsCount(locale: Locale): number {
  return loadAllProjects().filter((p) => p.locale === locale).length;
}

export function getProjectBySlug(
  slug: string,
  locale: Locale,
): ProjectWithBody | undefined {
  return loadAllProjects().find((p) => p.slug === slug && p.locale === locale);
}

export function projectExistsInOtherLocale(
  slug: string,
  locale: Locale,
): Locale | undefined {
  const other = locale === "el" ? "en" : "el";
  const exists = loadAllProjects().some(
    (p) => p.slug === slug && p.locale === other,
  );
  return exists ? other : undefined;
}

export function getAllProjectSlugLocalePairs(): {
  slug: string;
  locale: Locale;
}[] {
  return loadAllProjects().map(({ slug, locale }) => ({ slug, locale }));
}
