// Build-time content parity + frontmatter validator.
//
// Runs as `prebuild`. Fails the build if:
//   1. A *.el.mdx file lacks its *.en.mdx sibling (or vice versa) under
//      content/posts/ or content/projects/.
//   2. Any frontmatter doesn't match the schema (mirrors lib/frontmatter.ts).
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

const LOCALES = ["el", "en"];
const FILENAME_RE = /^(.+)\.(el|en)\.mdx$/;

const POST_SCHEMA = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  tags: z.array(z.enum(["project", "competition", "learning", "life", "notes"])).min(1),
  readingTime: z.number().int().positive(),
  featured: z.boolean().optional(),
  cover: z.string().optional(),
});

const PROJECT_SCHEMA = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  status: z.enum(["live", "wip", "archived", "award"]),
  statusLabel: z.string().min(1),
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

const errors = [];

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .map((filename) => {
      const m = FILENAME_RE.exec(filename);
      if (!m) return null;
      return { filename, slug: m[1], locale: m[2] };
    })
    .filter(Boolean);
}

function checkParity(label, dir) {
  const entries = listDir(dir);
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
  return entries;
}

function checkFrontmatter(dir, entries, schema, label) {
  for (const e of entries) {
    const file = path.join(dir, e.filename);
    let data;
    try {
      const raw = fs.readFileSync(file, "utf-8");
      data = matter(raw).data;
    } catch (err) {
      errors.push(`${label}/${e.filename}: failed to read/parse — ${err.message}`);
      continue;
    }
    const r = schema.safeParse(data);
    if (!r.success) {
      const issues = r.error.issues
        .map((i) => `    ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      errors.push(`${label}/${e.filename}: invalid frontmatter\n${issues}`);
    }
  }
}

const postEntries = checkParity("posts", POSTS_DIR);
const projectEntries = checkParity("projects", PROJECTS_DIR);
checkFrontmatter(POSTS_DIR, postEntries, POST_SCHEMA, "posts");
checkFrontmatter(PROJECTS_DIR, projectEntries, PROJECT_SCHEMA, "projects");

if (errors.length) {
  console.error(`\n✗ Content check failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):\n`);
  for (const e of errors) console.error("  • " + e);
  console.error("");
  process.exit(1);
}

const postCount = new Set(postEntries.map((e) => e.slug)).size;
const projectCount = new Set(projectEntries.map((e) => e.slug)).size;
console.log(
  `✓ Content OK: ${postCount} post${postCount === 1 ? "" : "s"}, ${projectCount} project${projectCount === 1 ? "" : "s"} (${LOCALES.length} locales each).`,
);
