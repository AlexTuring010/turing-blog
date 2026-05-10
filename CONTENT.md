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
stack: ["rust", "wasm", "leaflet", "postgis"]
links:
  live: "https://crowdless.example.com"
  github: "https://github.com/alex/crowdless"
order: 1                  # for sort order in archive
cover: "/covers/crowdless.png"
---
```

## Build-time validation

Add a build script that fails the build if:

1. A post exists in EL but not EN (or vice versa) — `compiler.el.mdx` exists but `compiler.en.mdx` doesn't
2. Frontmatter is missing required fields
3. A tag in `tags: [...]` is not in the allowed taxonomy
4. A status is not one of `live | wip | archived | award`

This catches translation gaps before they hit production. Add it to `npm run build`.

## Tag taxonomies

**Posts** — `content/posts/*.mdx`:
- `project` — about a thing he built
- `competition` — hackathon, ICPC, etc.
- `learning` — explainer, deep-dive on a concept
- `life` — personal, opinion, reflection
- `notes` — short rants, half-formed thoughts

**Projects** — `content/projects/*.mdx`:
- `side-project` — personal initiatives
- `freelance` — paid client work
- `competition` — entries (HackAthens, etc.)

URL filter params use the **English keys** regardless of locale: `/el/writing?tag=learning`. The locale only changes the display label, not the URL value.

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
