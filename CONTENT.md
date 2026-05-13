# Content & Translation Strategy

This document is more detailed than CLAUDE.md on the content/translation system. Read it once when setting up Phase 2.

## Two kinds of content

### 1. UI strings (chrome)
Nav labels, button text, page titles, status pills, dates, error messages, empty states, "More posts →", etc.

→ Standard i18n via `next-intl`, JSON files keyed by locale.

```
messages/
├── el.json
└── en.json
```

Keys are namespaced by feature:
```json
{
  "nav": {
    "home": "Home",
    "writing": "Writing",
    "work": "Work",
    "about": "About",
    "cv": "CV"
  },
  "homepage": {
    "heroEyebrow": "Hi, είμαι ο Αλεξ.",
    ...
  },
  "writing": {
    "archiveTitle": "Writing.",
    "archiveLede": "Posts για ...",
    "filterAll": "All",
    "morePostsButton": "More posts →"
  },
  "tags": {
    "learning": "learning",
    "competition": "competition",
    ...
  }
}
```

### 2. Content (MDX posts and projects)

→ Sibling MDX files, one per locale, same slug.

```
content/posts/
├── compiler.el.mdx
├── compiler.en.mdx
├── rust-hype.el.mdx
├── rust-hype.en.mdx
├── crowdless-build.el.mdx
└── crowdless-build.en.mdx

content/projects/
├── crowdless.el.mdx
├── crowdless.en.mdx
├── hackathens.el.mdx
└── hackathens.en.mdx
```

## Loading flow

When the user visits `/el/writing/compiler`:

1. Next.js routes to `app/[locale]/writing/[slug]/page.tsx` with `locale="el"`, `slug="compiler"`
2. Page loads `content/posts/compiler.el.mdx`
3. If file doesn't exist → check if `compiler.en.mdx` exists
4. If neither exists → 404
5. If only the OTHER locale exists → render with banner: "This post is only in [other locale]. [Read it →]"
6. If file exists → render MDX with frontmatter passed as props

## Frontmatter schema

Every MDX file in `content/posts/` must have:

```yaml
---
title: "Γιατί έγραψα τον δικό μου compiler"      # localized
description: "Για 4 μήνες έγραφα..."              # localized, used for OG/lede
date: "2026-02-14"                                # ISO 8601, same across locales
tags: ["learning", "compilers", "ocaml"]          # English keys (taxonomy keys, not display labels)
readingTime: 12                                   # minutes
featured: false                                   # appears as the big featured block
cover: "/covers/compiler.png"                     # optional
---
```

For projects in `content/projects/`:

```yaml
---
title: "Crowdless"                       
description: "..."
year: 2026
status: "live"            # live | wip | archived | award
statusLabel: "LIVE"        # localized — "ΖΩΝΤΑΝΟ" in EL, "LIVE" in EN, or "2ND PLACE" etc
category: "side-project"  # required, one of the top-level groups (see below)
subcategory: "web"        # optional, used only for clusters that support sub-grouping
stack: ["rust", "wasm", "leaflet", "postgis"]
links:
  live: "https://crowdless.example.com"
  github: "https://github.com/alex/crowdless"
order: 1                  # for sort order within (sub)cluster
cover: "/covers/crowdless.png"
---
```

Series (composite cards that group multiple coursework items, mostly in `school`) are file-based — see the "Project series" section below for the full schema.

### Project taxonomy (two-level)

The work archive groups projects by **category** (top-level), with optional **subcategory** for clusters that have enough variety.

**Top-level categories** (the `category` frontmatter field):
- `side-project` — personal initiatives, has subcategories
- `freelance` — paid client work, flat list (no subcategories)
- `competition` — hackathons, ICPC, etc., flat list (no subcategories)
- `school` — coursework worth showing, has subcategories

**Subcategories** (the `subcategory` frontmatter field — only for `side-project` and `school`):
- `web` — websites, web apps, tools with a browser interface
- `systems` — OS, kernels, low-level work
- `compilers` — interpreters, compilers, language tooling
- `ml` — machine learning, neural networks
- `distributed` — distributed systems, consensus, networking
- `data` — databases, data engineering
- `cli` — command-line tools

If `category: "freelance"` or `category: "competition"`, the `subcategory` field is ignored (these are flat lists).

The work archive page **dynamically groups** projects: it shows top-level clusters in a fixed order (side-project, freelance, competition, school), and within each cluster that supports subcategories, groups projects by subcategory. **Empty subcategories are hidden.** If a cluster has only one subcategory's worth of projects, render it as a flat grid without the subcategory header (avoids a single sad subcategory row).

URL filter params can target both levels: `/el/work?category=side-project` or `/el/work?subcategory=ml` (filters across all clusters). Subcategories themselves don't have dedicated routes — they're purely a grouping mechanism on the archive page.

### Project series (homework sets, multi-part coursework)

Some projects belong together as a **series** — for example, three homework assignments from the same Operating Systems course. Rather than rendering them as three separate cards (which clutters the archive), the design groups them into **one composite "series card"** that lists all items inside.

Series live in their own folder:

```
content/projects/
├── series/
│   ├── os-coursework.el.mdx      ← series metadata (title, context, etc.)
│   ├── os-coursework.en.mdx
│   ├── os-coursework/
│   │   ├── hw1.el.mdx            ← individual items
│   │   ├── hw1.en.mdx
│   │   ├── hw2.el.mdx
│   │   ├── hw2.en.mdx
│   │   ├── hw3.el.mdx
│   │   └── hw3.en.mdx
```

The series file's frontmatter:
```yaml
---
title: "Operating Systems coursework"
context: "NTUA · CS-3.5 · Spring 2025"
category: "school"
subcategory: "systems"
year: 2025
order: 1
stack: ["c", "pthread", "xv6", "fuse", "linux"]   # union of items' stacks, manually curated
---
```

Each item file's frontmatter:
```yaml
---
title: "Custom thread library από το μηδέν"
seriesSlug: "os-coursework"                        # which series it belongs to
seriesOrder: 1                                     # HW1, HW2, HW3...
seriesLabel: "HW1"                                 # label shown on the series card
status: "done"                                     # done | wip
links:
  github: "https://github.com/alex/os-hw1"
---
```

Routing:
- `/el/work` — archive page; renders series as composite cards
- `/el/work/os-coursework` — series detail/case study page (lists all items with longer descriptions)
- `/el/work/os-coursework/hw1` — individual item case study

The series card on the archive page links each item's title directly to `/el/work/os-coursework/hw1`. The series header itself (course name) links to `/el/work/os-coursework`.

**Build-time validation:**
- Every item must reference an existing series via `seriesSlug`
- Both locales required for every item (same rule as posts)
- A series with 0 items is hidden from the archive (not an error — useful for staging new series before items are written)

### Cross-linking posts to projects

Posts can declare a related project via the optional `relatedProject` field:

```yaml
---
title: "Γιατί έγραψα τον δικό μου compiler"
date: "2026-02-14"
tags: ["learning", "compilers"]
relatedProject: "mu-compiler"   # optional — project slug or series-slug/item-slug
readingTime: 12
---
```

Notes:
- The value is a project slug (e.g. `crowdless`) or a `series-slug/item-slug` pair (e.g. `os-coursework/hw1`)
- One post → at most one project
- The reverse direction (project → posts that mention it) is **computed at build time**, not stored in project frontmatter

Display:
- **Post page**: a green-left-bordered "About: <project> →" pill renders between subtitle and author row.
- **Project case study page**: a dark "Posts about this" band lists all posts where `relatedProject === this.slug` (or `this.series/this.itemSlug` for series items). Hidden when there are no related posts.
- **Work archive**: unchanged — no cross-link indicators on cards.

**Build-time validation**: if a post has `relatedProject: "foo"`, project "foo" (or `series/item`) must exist in at least one locale.

## Build-time validation

Add a build script that fails the build if:

1. A post exists in EL but not EN (or vice versa) — `compiler.el.mdx` exists but `compiler.en.mdx` doesn't
2. Frontmatter is missing required fields
3. A tag in `tags: [...]` is not in the allowed taxonomy
4. A status is not one of `live | wip | archived | award`
5. A `category` value is not one of `side-project | freelance | competition | school`
6. A `subcategory` value (when present) is not one of `web | systems | compilers | ml | distributed | data | cli`
7. A series item's `seriesSlug` references a series that doesn't exist
8. A post's `relatedProject` doesn't resolve to an existing project or series item

This catches translation gaps before they hit production. Add it to `npm run build`.

## Tag taxonomies

**Posts** — `content/posts/*.mdx`:
- `project` — about a thing he built
- `competition` — hackathon, ICPC, etc.
- `learning` — explainer, deep-dive on a concept
- `life` — personal, opinion, reflection
- `notes` — short rants, half-formed thoughts

**Projects** — see the two-level taxonomy in the "Project taxonomy" section above. Projects don't use the `tags` field; they use `category` + optional `subcategory`.

URL filter params use the **English keys** regardless of locale: `/el/writing?tag=learning`, `/el/work?category=side-project`. The locale only changes the display label, not the URL value.

## Date formatting

All dates use `Intl.DateTimeFormat` with the active locale:

```ts
function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(iso))
}
```

Result:
- EL: `14 Φεβ 2026`
- EN: `Feb 14, 2026`

Don't hardcode month abbreviations.

## Lang toggle behavior

Component: `<LangToggle />` in nav.

When clicked while on path `/el/writing/compiler`:

1. Compute target path: `/en/writing/compiler`
2. Check if target page exists (especially for posts):
   - For UI pages (homepage, archive, about) → always exists, just navigate
   - For dynamic post/project pages → fetch existence check on-click
3. If target exists → push to it
4. If target doesn't exist → push to `/en/writing/compiler` anyway, the page will handle the missing-translation banner

Implementation: read current path with `usePathname()`, swap the locale segment, navigate via `router.push()`.

## A note on the archive page filter URLs

`/el/writing` and `/el/writing?tag=learning` are valid. Filter is preserved across locale toggle:
- `/el/writing?tag=learning` → toggle → `/en/writing?tag=learning`

Filter labels themselves are localized (the pill says "learning" in EN, but if you ever localize the label it would still be "learning" in EL too — these are technical terms). The display label comes from `messages/{locale}.json` under `tags.learning`.

## Untranslated posts

Realistically, the user will write a Greek post and not immediately translate it. Decision tree:

1. **Author writes `compiler.el.mdx` only.** Build fails — sibling file required.
2. **Author writes `compiler.el.mdx` + `compiler.en.mdx` placeholder.** Build passes. EN file can have `description: "Translation in progress"` and a short note in body.
3. **Author wants to publish only in Greek for now.** Add `enabledLocales: ["el"]` to frontmatter (optional field). EN listing pages skip this post entirely. URL `/en/writing/compiler` shows the missing-translation banner.

Phase 2 implementation: support option 1 strictly (build fails). Add option 3 (`enabledLocales`) only if the user asks for it after using the system for a few weeks.

## What about RTL languages?

The user has only specified Greek and English. Both are LTR. Don't preemptively build RTL support. If a third locale is added later (Arabic, Hebrew), revisit then.
