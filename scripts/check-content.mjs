// Build-time content parity + frontmatter validator.
//
// Runs as `prebuild`. Fails the build if:
//   1. A *.el.mdx file lacks its *.en.mdx sibling (or vice versa) under
//      content/posts/, content/projects/, content/projects/series/, or
//      content/projects/series/<series-slug>/.
//   2. Any frontmatter doesn't match the schema (mirrors lib/frontmatter.ts).
//   3. A series item references a series that doesn't exist.
//   4. A post's `relatedProject` doesn't resolve to an existing project or
//      series item in either locale.
//
// Schemas are duplicated here on purpose — keeping the script as plain ESM
// (no TS loader, no extra dev-deps) is more important than DRY for a
// 100-line guard. If you change frontmatter shape, change both files.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const PROJECTS_DIR = path.join(ROOT, "content", "projects");
const SERIES_DIR = path.join(PROJECTS_DIR, "series");

const LOCALES = ["el", "en"];
const FILENAME_RE = /^(.+)\.(el|en)\.mdx$/;

const PROJECT_CATEGORIES = [
  "side-project",
  "freelance",
  "competition",
  "school",
];
const PROJECT_SUBCATEGORIES = [
  "web",
  "systems",
  "compilers",
  "ml",
  "distributed",
  "data",
  "cli",
];

const POST_SCHEMA = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  tags: z.array(z.enum(["project", "competition", "learning", "life", "notes"])).min(1),
  readingTime: z.number().int().positive(),
  featured: z.boolean().optional(),
  cover: z.string().optional(),
  relatedProject: z.string().min(1).optional(),
});

const PROJECT_SCHEMA = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  status: z.enum(["live", "wip", "archived", "award"]),
  statusLabel: z.string().min(1),
  category: z.enum(PROJECT_CATEGORIES),
  subcategory: z.enum(PROJECT_SUBCATEGORIES).optional(),
  stack: z.array(z.string().min(1)).min(1),
  links: z
    .object({
      live: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .optional(),
  order: z.number().int(),
  cover: z.string().optional(),
});

const SERIES_SCHEMA = z.object({
  title: z.string().min(1),
  context: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  year: z.number().int().min(2000).max(2100),
  category: z.enum(PROJECT_CATEGORIES),
  subcategory: z.enum(PROJECT_SUBCATEGORIES).optional(),
  stack: z.array(z.string().min(1)).min(1),
  order: z.number().int(),
  cover: z.string().optional(),
});

const SERIES_ITEM_SCHEMA = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  seriesSlug: z.string().min(1),
  seriesOrder: z.number().int().nonnegative(),
  seriesLabel: z.string().min(1),
  status: z.enum(["done", "wip"]),
  stack: z.array(z.string().min(1)).min(1),
  links: z
    .object({
      live: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .optional(),
  cover: z.string().optional(),
});

const errors = [];

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .map((filename) => {
      const m = FILENAME_RE.exec(filename);
      if (!m) return null;
      return { filename, slug: m[1], locale: m[2] };
    })
    .filter(Boolean);
}

function checkParity(label, dir, entries) {
  const bySlug = new Map();
  for (const e of entries) {
    if (!bySlug.has(e.slug)) bySlug.set(e.slug, new Set());
    bySlug.get(e.slug).add(e.locale);
  }
  for (const [slug, locales] of bySlug) {
    for (const required of LOCALES) {
      if (!locales.has(required)) {
        errors.push(
          `${label}: "${slug}" is missing ${required}.mdx (only have ${[...locales].join(", ")})`,
        );
      }
    }
  }
}

function checkFrontmatter(dir, entries, schema, label) {
  const data = [];
  for (const e of entries) {
    const file = path.join(dir, e.filename);
    let parsed;
    try {
      const raw = fs.readFileSync(file, "utf-8");
      parsed = matter(raw).data;
    } catch (err) {
      errors.push(`${label}/${e.filename}: failed to read/parse — ${err.message}`);
      continue;
    }
    const r = schema.safeParse(parsed);
    if (!r.success) {
      const issues = r.error.issues
        .map((i) => `    ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      errors.push(`${label}/${e.filename}: invalid frontmatter\n${issues}`);
      continue;
    }
    data.push({ ...e, data: r.data });
  }
  return data;
}

// Standalone files at the top of each dir.
const postEntries = listDir(POSTS_DIR);
const projectEntries = listDir(PROJECTS_DIR);
const seriesEntries = listDir(SERIES_DIR);

checkParity("posts", POSTS_DIR, postEntries);
checkParity("projects", PROJECTS_DIR, projectEntries);
checkParity("series", SERIES_DIR, seriesEntries);

const validatedPosts = checkFrontmatter(POSTS_DIR, postEntries, POST_SCHEMA, "posts");
const validatedProjects = checkFrontmatter(
  PROJECTS_DIR,
  projectEntries,
  PROJECT_SCHEMA,
  "projects",
);
const validatedSeries = checkFrontmatter(
  SERIES_DIR,
  seriesEntries,
  SERIES_SCHEMA,
  "series",
);

// Series items live one directory deeper.
const validatedItems = []; // { seriesSlug, slug, locale, data }
if (fs.existsSync(SERIES_DIR)) {
  for (const child of fs.readdirSync(SERIES_DIR, { withFileTypes: true })) {
    if (!child.isDirectory()) continue;
    const seriesSlug = child.name;
    const itemDir = path.join(SERIES_DIR, seriesSlug);
    const itemEntries = listDir(itemDir);
    checkParity(`series/${seriesSlug}`, itemDir, itemEntries);
    const validated = checkFrontmatter(
      itemDir,
      itemEntries,
      SERIES_ITEM_SCHEMA,
      `series/${seriesSlug}`,
    );
    for (const v of validated) {
      if (v.data.seriesSlug !== seriesSlug) {
        errors.push(
          `series/${seriesSlug}/${v.filename}: declares seriesSlug "${v.data.seriesSlug}" but lives under directory "${seriesSlug}"`,
        );
      }
      validatedItems.push({
        seriesSlug,
        slug: v.slug,
        locale: v.locale,
        data: v.data,
      });
    }
  }
}

// Every series item must reference a series that actually exists (any locale).
const seriesSlugsAny = new Set(validatedSeries.map((s) => s.slug));
for (const item of validatedItems) {
  if (!seriesSlugsAny.has(item.seriesSlug)) {
    errors.push(
      `series/${item.seriesSlug}/${item.slug}.${item.locale}.mdx: references series "${item.seriesSlug}" which doesn't exist (no ${item.seriesSlug}.{el,en}.mdx under content/projects/series/)`,
    );
  }
}

// Every post.relatedProject must resolve to an existing project or series item.
const projectSlugsAny = new Set(validatedProjects.map((p) => p.slug));
const itemRefsAny = new Set(
  validatedItems.map((i) => `${i.seriesSlug}/${i.slug}`),
);
for (const p of validatedPosts) {
  const ref = p.data.relatedProject;
  if (!ref) continue;
  if (ref.includes("/")) {
    if (!itemRefsAny.has(ref)) {
      errors.push(
        `posts/${p.filename}: relatedProject "${ref}" doesn't resolve to a series item`,
      );
    }
  } else if (!projectSlugsAny.has(ref) && !seriesSlugsAny.has(ref)) {
    errors.push(
      `posts/${p.filename}: relatedProject "${ref}" doesn't resolve to a project or series`,
    );
  }
}

if (errors.length) {
  console.error(`\n✗ Content check failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):\n`);
  for (const e of errors) console.error("  • " + e);
  console.error("");
  process.exit(1);
}

const postCount = new Set(postEntries.map((e) => e.slug)).size;
const projectCount = new Set(projectEntries.map((e) => e.slug)).size;
const seriesCount = new Set(seriesEntries.map((e) => e.slug)).size;
const itemCount = new Set(
  validatedItems.map((i) => `${i.seriesSlug}/${i.slug}`),
).size;
console.log(
  `✓ Content OK: ${postCount} post${postCount === 1 ? "" : "s"}, ${projectCount} project${projectCount === 1 ? "" : "s"}, ${seriesCount} series (${itemCount} item${itemCount === 1 ? "" : "s"}) — ${LOCALES.length} locales each.`,
);
