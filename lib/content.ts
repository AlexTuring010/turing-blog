// Content loaders. Reads MDX files from content/posts/ and content/projects/
// at build time (and on-demand in dev). Public API matches what the homepage,
// archive, and post-page components consume.
//
// File naming convention: `<slug>.<locale>.mdx`
//   e.g. content/posts/kv-store.el.mdx, content/posts/kv-store.en.mdx
//
// Series live under content/projects/series/:
//   - series metadata: content/projects/series/<series-slug>.<locale>.mdx
//   - series items:    content/projects/series/<series-slug>/<item-slug>.<locale>.mdx

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import {
  parsePostFrontmatter,
  parseProjectFrontmatter,
  parseSeriesFrontmatter,
  parseSeriesItemFrontmatter,
} from "./frontmatter";
import type {
  Post,
  PostWithBody,
  Project,
  ProjectCategory,
  ProjectWithBody,
  Series,
  SeriesItem,
  SeriesItemWithBody,
  SeriesWithBody,
  WorkArchiveProject,
} from "./types";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const PROJECTS_DIR = path.join(ROOT, "content", "projects");
const SERIES_DIR = path.join(PROJECTS_DIR, "series");

const FILENAME_RE = /^(.+)\.(el|en)\.mdx$/;

// Module-level memo. Both build-time SSG and dev hot reload will recompute on
// process restart; in dev a file change triggers a rebuild which re-evaluates
// this module, so no manual invalidation needed.
let postCache: { all: PostWithBody[] } | null = null;
let projectCache: { all: ProjectWithBody[] } | null = null;
let seriesCache: { all: SeriesWithBody[] } | null = null;
let seriesItemCache: {
  all: (SeriesItemWithBody & { seriesSlug: string })[];
} | null = null;

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

function loadAllSeries(): SeriesWithBody[] {
  if (seriesCache) return seriesCache.all;
  const all = readDir(SERIES_DIR).map((entry) => {
    const file = path.join(SERIES_DIR, entry.filename);
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);
    const fm = parseSeriesFrontmatter(
      data,
      `content/projects/series/${entry.filename}`,
    );
    return { ...fm, slug: entry.slug, locale: entry.locale, body: content };
  });
  seriesCache = { all };
  return all;
}

// Items live one directory deeper: content/projects/series/<series-slug>/<item-slug>.<locale>.mdx
function loadAllSeriesItems(): (SeriesItemWithBody & { seriesSlug: string })[] {
  if (seriesItemCache) return seriesItemCache.all;
  const all: (SeriesItemWithBody & { seriesSlug: string })[] = [];
  if (!fs.existsSync(SERIES_DIR)) {
    seriesItemCache = { all };
    return all;
  }
  for (const child of fs.readdirSync(SERIES_DIR, { withFileTypes: true })) {
    if (!child.isDirectory()) continue;
    const itemDir = path.join(SERIES_DIR, child.name);
    for (const entry of readDir(itemDir)) {
      const file = path.join(itemDir, entry.filename);
      const raw = fs.readFileSync(file, "utf-8");
      const { data, content } = matter(raw);
      const fm = parseSeriesItemFrontmatter(
        data,
        `content/projects/series/${child.name}/${entry.filename}`,
      );
      if (fm.seriesSlug !== child.name) {
        throw new Error(
          `Series item ${child.name}/${entry.filename} declares seriesSlug "${fm.seriesSlug}" but lives under "${child.name}".`,
        );
      }
      all.push({
        ...fm,
        slug: entry.slug,
        locale: entry.locale,
        body: content,
        seriesSlug: child.name,
      });
    }
  }
  seriesItemCache = { all };
  return all;
}

type DirEntry = { filename: string; slug: string; locale: Locale };

function readDir(dir: string): DirEntry[] {
  if (!fs.existsSync(dir)) return [];
  const out: DirEntry[] = [];
  for (const child of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!child.isFile()) continue;
    const m = FILENAME_RE.exec(child.name);
    if (!m) continue;
    const [, slug, locale] = m;
    if (!(routing.locales as readonly string[]).includes(locale)) continue;
    out.push({ filename: child.name, slug, locale: locale as Locale });
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
  // Counts standalone projects + series items (per CONTENT.md: "Series count
  // differently in the eyebrow — total items, not total cards").
  const projects = loadAllProjects().filter((p) => p.locale === locale).length;
  const items = loadAllSeriesItems().filter((i) => i.locale === locale).length;
  return projects + items;
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

// ─── SERIES ──────────────────────────────────────────────────────────

export function getAllSeries(locale: Locale): Series[] {
  return loadAllSeries()
    .filter((s) => s.locale === locale)
    .map(stripBody)
    .sort((a, b) => a.order - b.order);
}

export function getSeriesBySlug(
  slug: string,
  locale: Locale,
): SeriesWithBody | undefined {
  return loadAllSeries().find((s) => s.slug === slug && s.locale === locale);
}

export function seriesExistsInOtherLocale(
  slug: string,
  locale: Locale,
): Locale | undefined {
  const other = locale === "el" ? "en" : "el";
  const exists = loadAllSeries().some(
    (s) => s.slug === slug && s.locale === other,
  );
  return exists ? other : undefined;
}

// Resolves: is `slug` a series slug (vs a standalone project slug)?
export function isSeriesSlug(slug: string): boolean {
  return loadAllSeries().some((s) => s.slug === slug);
}

export function getSeriesItems(
  seriesSlug: string,
  locale: Locale,
): SeriesItem[] {
  return loadAllSeriesItems()
    .filter((i) => i.seriesSlug === seriesSlug && i.locale === locale)
    .map(stripBody)
    .sort((a, b) => a.seriesOrder - b.seriesOrder);
}

export function getSeriesItem(
  seriesSlug: string,
  itemSlug: string,
  locale: Locale,
): SeriesItemWithBody | undefined {
  return loadAllSeriesItems().find(
    (i) =>
      i.seriesSlug === seriesSlug &&
      i.slug === itemSlug &&
      i.locale === locale,
  );
}

export function seriesItemExistsInOtherLocale(
  seriesSlug: string,
  itemSlug: string,
  locale: Locale,
): Locale | undefined {
  const other = locale === "el" ? "en" : "el";
  const exists = loadAllSeriesItems().some(
    (i) =>
      i.seriesSlug === seriesSlug &&
      i.slug === itemSlug &&
      i.locale === other,
  );
  return exists ? other : undefined;
}

export function getAllSeriesSlugLocalePairs(): {
  seriesSlug: string;
  locale: Locale;
}[] {
  return loadAllSeries().map((s) => ({ seriesSlug: s.slug, locale: s.locale }));
}

export function getAllSeriesItemSlugLocalePairs(): {
  seriesSlug: string;
  itemSlug: string;
  locale: Locale;
}[] {
  return loadAllSeriesItems().map((i) => ({
    seriesSlug: i.seriesSlug,
    itemSlug: i.slug,
    locale: i.locale,
  }));
}

// ─── WORK ARCHIVE GROUPING ──────────────────────────────────────────

// Order in which top-level clusters render on the work archive.
export const CATEGORY_ORDER: ProjectCategory[] = [
  "side-project",
  "freelance",
  "competition",
  "school",
];

// Which categories support subcategories. Other categories render flat.
export const CATEGORIES_WITH_SUBS: ProjectCategory[] = [
  "side-project",
  "school",
];

// Returns: list of categories in fixed order, each with either a flat list of
// units (standalone projects + series cards) or a list of subcategories,
// each with their own list of units. Empty categories are omitted; categories
// with only one populated subcategory are flattened.
export type CategoryGroup = {
  category: ProjectCategory;
  units: WorkArchiveProject[]; // populated only when flat (i.e. no subcategories or collapsed)
  subcategories: { subcategory: string; units: WorkArchiveProject[] }[]; // populated only when sub-grouped
};

export function getWorkArchiveGroups(locale: Locale): CategoryGroup[] {
  const projects = getAllProjects(locale);
  const seriesList = getAllSeries(locale);

  // Build flat list of units, per category.
  const unitsByCategory = new Map<ProjectCategory, WorkArchiveProject[]>();
  for (const p of projects) {
    if (!unitsByCategory.has(p.category)) unitsByCategory.set(p.category, []);
    unitsByCategory.get(p.category)!.push({ kind: "project", project: p });
  }
  for (const s of seriesList) {
    const items = getSeriesItems(s.slug, locale);
    if (items.length === 0) continue; // hide empty series per CHANGES.md
    if (!unitsByCategory.has(s.category)) unitsByCategory.set(s.category, []);
    unitsByCategory.get(s.category)!.push({ kind: "series", series: s, items });
  }

  const result: CategoryGroup[] = [];

  for (const category of CATEGORY_ORDER) {
    const units = unitsByCategory.get(category);
    if (!units || units.length === 0) continue; // hide empty categories

    if (!CATEGORIES_WITH_SUBS.includes(category)) {
      // Flat list for freelance / competition.
      result.push({
        category,
        units: sortUnits(units),
        subcategories: [],
      });
      continue;
    }

    // Group by subcategory for side-project / school.
    const bySub = new Map<string, WorkArchiveProject[]>();
    for (const u of units) {
      const sub =
        u.kind === "project" ? u.project.subcategory : u.series.subcategory;
      const key = sub ?? "_unsorted";
      if (!bySub.has(key)) bySub.set(key, []);
      bySub.get(key)!.push(u);
    }

    if (bySub.size <= 1) {
      // A single subcategory's worth — render flat without sub-headers.
      result.push({
        category,
        units: sortUnits(units),
        subcategories: [],
      });
      continue;
    }

    // Order subcategories by first appearance (insertion order on the Map).
    const subcategories = [...bySub.entries()].map(([subcategory, list]) => ({
      subcategory,
      units: sortUnits(list),
    }));

    result.push({ category, units: [], subcategories });
  }

  return result;
}

function unitOrder(u: WorkArchiveProject): number {
  return u.kind === "project" ? u.project.order : u.series.order;
}

function sortUnits(units: WorkArchiveProject[]): WorkArchiveProject[] {
  return [...units].sort((a, b) => unitOrder(a) - unitOrder(b));
}

// ─── CROSS-LINKS (posts ↔ projects) ──────────────────────────────────

// Resolves a post's `relatedProject` value (either "<project-slug>" or
// "<series-slug>/<item-slug>") to a friendly target. Returns undefined if it
// doesn't resolve in the given locale (caller can decide what to do).
export type RelatedProjectTarget =
  | { kind: "project"; project: Project }
  | { kind: "series"; series: Series }
  | { kind: "series-item"; series: Series; item: SeriesItem };

export function resolveRelatedProject(
  ref: string,
  locale: Locale,
): RelatedProjectTarget | undefined {
  if (ref.includes("/")) {
    const [seriesSlug, itemSlug] = ref.split("/", 2);
    const series = loadAllSeries().find(
      (s) => s.slug === seriesSlug && s.locale === locale,
    );
    const item = loadAllSeriesItems().find(
      (i) =>
        i.seriesSlug === seriesSlug &&
        i.slug === itemSlug &&
        i.locale === locale,
    );
    if (!series || !item) return undefined;
    return {
      kind: "series-item",
      series: stripBody(series),
      item: stripBody(item),
    };
  }
  const project = loadAllProjects().find(
    (p) => p.slug === ref && p.locale === locale,
  );
  if (project) return { kind: "project", project: stripBody(project) };
  const series = loadAllSeries().find(
    (s) => s.slug === ref && s.locale === locale,
  );
  if (series) return { kind: "series", series: stripBody(series) };
  return undefined;
}

// Posts that reference this project (or series item). Used by the related-posts
// band on the project case study page. Returns posts in newest-first order.
export function getRelatedPostsForProject(
  slug: string,
  locale: Locale,
): Post[] {
  return loadAllPosts()
    .filter((p) => p.locale === locale && p.relatedProject === slug)
    .map(stripBody)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getRelatedPostsForSeriesItem(
  seriesSlug: string,
  itemSlug: string,
  locale: Locale,
): Post[] {
  const ref = `${seriesSlug}/${itemSlug}`;
  return loadAllPosts()
    .filter((p) => p.locale === locale && p.relatedProject === ref)
    .map(stripBody)
    .sort((a, b) => b.date.localeCompare(a.date));
}
