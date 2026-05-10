# The Turing Blog — Project Context

This file is loaded by Claude Code on every session. It defines the project, conventions, and rules.

## What this is

A personal portfolio + blog for **Αλέξανδρος Γκιάφης ("Alex")** — a CS student in Athens, Greece, doing freelance web development. The site is called **The Turing Blog**.

It serves two audiences:
1. **Recruiters / collaborators** evaluating his work for internship and freelance opportunities
2. **Blog readers** interested in posts about compilers, side projects, learning, and life

The site must work for both without compromise.

## The author's voice (matters for placeholder content)

Greek-primary, with English translation toggle. When writing prose:
- Fragments and short lines are fine. Voice prefers stacking phrases over flowing prose.
- Mixes Greek and English naturally (e.g. "γράφω code" not "γράφω κώδικα" always)
- Slightly self-aware, skeptical, wry. Honest about failures.
- No corporate language. No "passionate developer." No "synergy."
- Reframes instead of describes. Says what something *is* rather than *does*.

If generating placeholder copy, match this. The current designs already follow this voice — read them.

## Tech stack

- **Framework**: Next.js 14+ (App Router)
- **Content**: MDX files in repo (NOT a CMS — see below)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Fonts**: Bricolage Grotesque (body/headings), Bowlby One (logo only), JetBrains Mono (code/meta)
- **i18n**: next-intl (chosen for App Router compatibility)
- **TypeScript**: strict mode

## No CMS — explicit decision

Single technical author + heavy code content + slow cadence = MDX in the repo is correct. Don't suggest Sanity, Contentful, etc. unless explicitly asked. Files live alongside code, build-time rendering, git is the version history.

## Internationalization is core, not optional

This is a **fully bilingual** site (Greek + English). Every page, every post, every UI string. Translation is not a nice-to-have — it's required from day one.

### URL structure
```
/el/                           ← Greek (default)
/el/writing
/el/writing/compiler
/el/work
/el/work/crowdless
/el/about

/en/                           ← English
/en/writing
/en/writing/compiler
...
```

Locale is in the URL path. Middleware redirects `/` → `/el/` (since author is Greek).

### Content translation strategy

**For posts and projects**: Sibling MDX files.

```
content/posts/
├── compiler.el.mdx
├── compiler.en.mdx
├── rust-hype.el.mdx
└── rust-hype.en.mdx
```

Each post has the SAME slug across locales. The `[slug]` route loads `{slug}.{locale}.mdx` based on current URL locale. Build fails if a post exists in one locale but not the other (catches missed translations).

Each MDX file has frontmatter:
```yaml
---
title: "Γιατί έγραψα τον δικό μου compiler"
description: "..."
date: "2026-02-14"
tags: ["learning", "compilers", "ocaml"]
readingTime: 12
featured: false
---
```

**For UI strings**: `messages/el.json` and `messages/en.json`, loaded via next-intl. Includes nav labels, button text, page titles, error messages, status pills, date formats, everything.

**For dates**: Use Intl.DateTimeFormat with the active locale. `14 Φεβ 2026` in EL, `Feb 14, 2026` in EN. Don't hardcode date formats anywhere.

### Tags translate too

Tag system has fixed taxonomy: `project | competition | learning | life | notes` (writing) and `side-project | freelance | competition` (work). Tag display labels go in messages files. URLs use English keys (`/writing?tag=learning`) regardless of locale.

### When a translation is missing

If `compiler.en.mdx` doesn't exist yet but the user is on `/en/writing/compiler`:
- Show a banner: "This post is only available in Greek. [Read it in Greek →]"
- Don't fall back silently — be explicit

### Lang toggle behavior

The EL/EN toggle in the nav switches the URL locale while preserving the path:
- On `/el/writing/compiler` → toggle to `/en/writing/compiler`
- On `/el/about` → toggle to `/en/about`

If the target locale doesn't have the current page (rare but possible for posts), redirect to the localized homepage with a flash message.

## File organization

```
.
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              ← shared layout, nav, footer
│   │   ├── page.tsx                ← homepage
│   │   ├── writing/
│   │   │   ├── page.tsx            ← archive
│   │   │   └── [slug]/page.tsx     ← single post
│   │   ├── work/
│   │   │   ├── page.tsx            ← archive
│   │   │   └── [slug]/page.tsx     ← case study
│   │   └── about/page.tsx
│   └── globals.css
├── components/
│   ├── nav/
│   ├── post/
│   ├── work/
│   └── ui/                         ← shared (chips, pills, buttons, etc.)
├── content/
│   ├── posts/                      ← *.{locale}.mdx
│   └── projects/                   ← *.{locale}.mdx
├── messages/
│   ├── el.json
│   └── en.json
├── lib/
│   ├── content.ts                  ← MDX loaders
│   ├── i18n.ts                     ← locale config
│   └── utils.ts
├── public/
│   ├── photos/
│   └── covers/                     ← project cover images
├── design-references/              ← the design HTMLs (read-only, reference)
├── CLAUDE.md
└── PLAN.md
```

## Design conventions (from the mockups)

**Colors** (all CSS variables, defined once in globals.css):
- `--paper`: `#15171a` (page background)
- `--paper-2`: `#1f2227` (card backgrounds)
- `--paper-3`: `#2a2e34` (deeper accents)
- `--ink`: `#f0ebe0` (primary text, warm cream)
- `--ink-soft`: `#bfb8a8` (secondary text)
- `--ink-mute`: `#7a7568` (tertiary, meta)
- `--rule`: `#3a3e46` (borders)
- `--coral`: `#87CF40` (PRIMARY ACCENT — the leaf green)
- `--coral-dark`: `#9eda5c` (hover/lighter green)
- Footer band: `#0d0e10` (deeper-than-paper for footers)

The variable is named `--coral` for historical reasons (palette went through coral → green). Don't rename — keeping it stable lets us recolor later if needed.

**Typography**:
- Body: Bricolage Grotesque, 16px, line-height 1.55
- Reading body (post pages): 18px, line-height 1.7
- Display headings: Bricolage Grotesque with `font-variation-settings: "opsz" 96`
- Logo: Bowlby One only (don't use anywhere else)
- Code/mono: JetBrains Mono

**Italic emphasis** is recurring — important words in `<span class="it">` get italic + green color. The pattern feels like the writer leaning on a word with their voice. Don't over-use, but it's the signature touch on titles.

**Hover pattern for cards**: `translate(-3px, -3px)` + green offset shadow `box-shadow: 6px 6px 0 var(--coral)` + green border. This is a system, apply consistently.

**Reading column**: Single posts use `max-width: 720px`. The dark prev/next band below extends to `max-width: 1000px`. Don't change these without a reason.

**Status pills**: Green pulsing dot for LIVE, yellow for WIP, neutral for archived, green-bordered for awards. Animated pulse: `pulse 2s ease-in-out infinite`.

## What NOT to do

- Don't use shadcn/ui or pre-built component libraries. The design has too much specific personality — generic components will fight it.
- Don't use heading fonts other than Bricolage Grotesque (with optical sizing).
- Don't use a CMS.
- Don't add light mode unless explicitly asked (this is a dark-first design and adding light mode means rebuilding every component's color logic).
- Don't add animations beyond what's in the designs (subtle hover, status pulse). No scroll animations, no parallax, no fade-ins on load.
- Don't ship without proofreading the EL/EN parity for every page.

## When uncertain

Ask the user. Don't invent product behavior — the user is the product owner. Especially for:
- New content categories or tag taxonomies
- Anything involving the author's real biographical details, GitHub URLs, real email
- New page types not in the original design (don't preemptively add `/blog/page/[number]` pagination — only build it when explicitly requested)

## Ingesting new posts from `inbox/`

The user drops drafts into `inbox/<draft-folder>/` and asks "ingest the new draft" (or names a specific folder). Workflow Claude follows on that request:

1. **Identify the draft.** If only one folder under `inbox/` (excluding `_archive/` and `README.md`), use that. If multiple, ask which one.
2. **Read inputs.** Always: `notes.md` (the source). Optionally: `instructions.md`, `images/*`. Notes are written in **English** — that's the source language. EL is generated by translation.
3. **Derive the slug.** Folder name → kebab-case, with any leading `YYYY-MM-DD-` prefix stripped. e.g. `inbox/2026-05-10 Graph databases for fun/` → slug `graph-databases-for-fun`.
4. **Read instructions.md if present.** Free-form notes can override defaults: `tags:`, `featured:`, `date:`, `reading time:`, `cover: <filename>`, `keep terse`, etc. See `inbox/README.md` for the full vocabulary.
5. **Pick frontmatter.**
   - `date`: today (resolve any relative phrasing in the user's instructions to an absolute YYYY-MM-DD)
   - `tags`: from instructions if specified; otherwise pick 1–2 from the fixed taxonomy (`project | competition | learning | life | notes`) based on content
   - `readingTime`: estimate from word count (≈ 220 wpm) unless overridden
   - `featured`: false by default
   - `cover`: only set if instructions name an image; the published path is `/posts/<slug>/<filename>`
6. **Move images** (if any) to `public/posts/<slug>/`. Rewrite any `images/...` references in the body to `/posts/<slug>/...`.
7. **Write both locales.** Polish the English body keeping the author's voice (Greek/English code-mixed where natural, fragments OK, wry, no corporate language — see "The author's voice" above). Translate to Greek for `<slug>.el.mdx`. Use `*word*` markers for italic-coral emphasis on key words in the title.
8. **Validate.** Run `npm run check:content`. If it fails, fix and re-run. Then `npm run build` to confirm no rendering breakage. If either fails, leave the inbox folder in place and report back; do not archive.
9. **Archive the source.** Move `inbox/<draft-folder>/` → `inbox/_archive/<YYYY-MM-DD>-<slug>/` (the date is today, the slug is the one chosen). `_archive/` is gitignored.
10. **Report back.** Tell the user: the chosen slug, the chosen tags + reading time + date, the cover image (if any), the file paths created, and any decisions made that they might want to override (e.g. "I tagged this `learning` but `notes` would also fit — let me know if you want to swap").

If `notes.md` is missing, abort and tell the user. If both `notes.md` and `notes.en.md` exist (the user chose the "I'll write both" option later), prefer the locale-suffixed files. The workflow is documented for the user in `inbox/README.md`; keep these two in sync if you change the contract.
