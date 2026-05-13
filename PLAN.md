# Implementation Plan — The Turing Blog

This is a phased plan. Work through phases in order. Each phase ends with a working, deployable site — even if incomplete. Don't start phase N until phase N-1 ships.

**Reference materials**:
- `CLAUDE.md` — project conventions and rules
- `design-references/homepage.html` — homepage
- `design-references/post.html` — single post reading page
- `design-references/writing.html` — writing archive
- `design-references/work.html` — work archive
- `design-references/about.html` — about page

These are HTML/CSS mockups. Translate them into Next.js + Tailwind components. Match colors, fonts, spacing, hover behavior exactly. The mockups are the visual contract.

---

## Phase 0 — Project setup (~1 day)

Get a Next.js project running with the right plumbing. No design work yet.

- [ ] `npx create-next-app@latest` — App Router, TypeScript strict, Tailwind, ESLint, no `src/` dir
- [ ] Install: `next-intl`, `next-mdx-remote`, `gray-matter`, `reading-time`, `rehype-pretty-code` (or `shiki`), `clsx`
- [ ] Set up Tailwind config with the color tokens from CLAUDE.md (`paper`, `ink`, `coral`, etc.)
- [ ] Set up Bricolage Grotesque, Bowlby One, JetBrains Mono via `next/font/google`
- [ ] Create `app/[locale]/layout.tsx` with locale routing scaffold
- [ ] Create `messages/el.json` and `messages/en.json` with placeholder strings
- [ ] Configure `next-intl` middleware: redirect `/` → `/el/`, handle locale switching
- [ ] Verify a placeholder page works at both `/el` and `/en`
- [ ] Set up Vercel deployment, hook up GitHub repo, get a preview URL

**Phase 0 is done when**: empty Next.js site deploys to Vercel, locale routing works, fonts load.

---

## Phase 1 — Homepage (~2 days)

Build the homepage from `homepage.html`. This is the most complex single page — get it right before moving on.

Order of work:

- [ ] **Layout shell**: `app/[locale]/layout.tsx` with `<Nav>` and `<Footer>` components
- [ ] **Nav component**: logo (Bowlby One wordmark with green dot), nav links with active state, GitHub/LinkedIn icons, CV button, EL/EN lang toggle
  - Lang toggle preserves the current path when switching locales
  - Active link state from current pathname
- [ ] **Footer component**: dark band with copyright + tech credits
- [ ] **Hero section**: "Hi, είμαι ο Αλεξ." + h1 with italic green emphasis + lede + status pill + CTA buttons + photo (right side)
- [ ] **Featured post block**: large card with cover, meta, title, snippet
- [ ] **Writing grid**: 6 post cards in 3-column grid, "More posts →" button below linking to `/[locale]/writing`
- [ ] **Work strip**: 3 work cards with stack chips, item numbers, hover behavior. Add "View all →" button below linking to `/[locale]/work`
- [ ] **About card**: photo + bio + socials + reach-me CTA
- [ ] All hover behaviors: card translate + green offset shadow, link color shifts
- [ ] Mobile breakpoints (test at 375px, 768px, 1024px)

The post/project content on the homepage should be loaded from MDX (see Phase 2) once that's set up — for now, hardcode mocks matching the designs.

**Phase 1 is done when**: homepage matches the design at all breakpoints, both `/el` and `/en` versions render, lang toggle works.

---

## Phase 2 — Content system (~2 days)

Build the MDX loading and rendering pipeline. No new pages yet.

- [ ] Create `content/posts/` and `content/projects/` directories
- [ ] Author 2 sample posts in MDX, both locales: e.g. `compiler.el.mdx`, `compiler.en.mdx`. Use the placeholder content from `design-references/post.html` as reference for structure.
- [ ] Frontmatter schema (validate at build time with Zod):
  ```typescript
  {
    title: string,
    description: string,
    date: string,        // ISO date
    tags: string[],      // from fixed taxonomy
    readingTime?: number,
    featured?: boolean,
    cover?: string       // optional path to /public/covers/
  }
  ```
- [ ] `lib/content.ts`: functions to load posts/projects by locale and slug, list all posts in a locale, etc.
- [ ] `app/[locale]/writing/[slug]/page.tsx`: post page route, uses MDX content, matches `design-references/post.html`
- [ ] MDX components: custom `<h2>`, `<pre>`, `<code>`, `<blockquote>`, `<Callout>`, plus syntax-highlighted code blocks via Shiki
- [ ] Build-time check: error if a post exists in EL but not EN (or vice versa)
- [ ] If a translation IS missing at runtime (build slipped through), show "Only available in [other locale]" banner
- [ ] Update homepage's writing grid to read from real MDX data (not mocks)

**Phase 2 is done when**: writing 2 sample posts in both languages, navigating to them works, code highlighting works, hot reload on content edits works in dev.

---

## Phase 3 — Archive pages (~2 days)

Build the writing archive, work archive (with category clustering + series), and project detail page.

- [ ] `app/[locale]/writing/page.tsx`: matches `design-references/writing.html`. Vertical post feed with date+tag meta, hoverable titles, read time on right. Filter pills at top.
- [ ] Filter logic: client-side state, filters the visible list. Update URL with `?tag=learning` so filters are shareable.
- [ ] `app/[locale]/work/page.tsx`: matches `design-references/work.html`. **Category clusters** (side-project, freelance, competition, school) rendered in fixed order; **subcategory sub-sections** within clusters that support them; empty groups hidden; single-subcategory clusters render flat. **No filter pills** — the cluster structure replaces them. Each project card has cover (or CSS gradient placeholder), status pill, project number, title, tagline, stack chips, case-study/external link buttons.
- [ ] **Series composite card** on the work archive: 3px green top border, no 16:9 cover (header strip with SERIES badge + project number), item rows linking to individual case studies, combined stack chips at the bottom. Series with 0 items is hidden.
- [ ] Author sample projects in MDX, both locales, including one **series** (e.g. `os-coursework`) with 2-3 items under `content/projects/series/`.
- [ ] `app/[locale]/work/[slug]/page.tsx`: project detail page per `design-references/project-detail.html`. Two-column header (text left, square cover right), category·year·status meta row, tagline, stack chips, primary/secondary action buttons, "Posts about this" related-posts band (dark, between header and body) when posts reference this project. 1000px wrap, 720px reading column for the case study body.
- [ ] `app/[locale]/work/[series-slug]/page.tsx`: series detail page (lists items with longer context).
- [ ] `app/[locale]/work/[series-slug]/[item-slug]/page.tsx`: series item case study (same template as standalone project detail).
- [ ] Cross-linking: post page renders a green-left-bordered "About: <project> →" pill when frontmatter declares `relatedProject`. Build-time validation ensures the target exists.

**Phase 3 is done when**: both archives are populated from MDX, filters work, navigation between archive → individual page works in both locales, series render correctly, related posts surface on project case studies.

---

## Phase 4 — About page (~1 day)

Build `app/[locale]/about/page.tsx` matching `design-references/about.html`.

The about page has 6 sections:
1. Hero with photo
2. /01 Now (4 cards in 2x2)
3. /02 The arc (narrative bio)
4. /03 Stack (4 grouped chip lists)
5. /04 Reading (recent + currently reading)
6. /05 Reach me (contact card)

Most of this is static content per locale. Store it in `content/about.{locale}.mdx` so the user can edit prose without touching code, but render it through structured components (the layout isn't a single prose blob).

**Suggested approach**: Make the *prose* fields (the arc bio paragraphs, the lede) MDX-renderable, but the *structured* parts (Now cards, stack chips, reading list with statuses) come from a typed object in a `content/about.{locale}.ts` data file. That way the user can edit content, but the structure stays consistent.

**Phase 4 is done when**: about page works in both locales, photo loads, all sections render.

---

## Phase 5 — Polish & launch readiness (~2 days)

- [ ] Real CV PDF in `/public/cv.pdf` (user provides)
- [ ] Real GitHub/LinkedIn URLs throughout (user provides)
- [ ] Real email address (user provides)
- [ ] All photos in `/public/photos/` — author photo, project covers when available
- [ ] OpenGraph metadata per page (title, description, og:image)
- [ ] OG image generator using `@vercel/og` — branded image with post title for shareable links
- [ ] RSS feed at `/[locale]/feed.xml`
- [ ] Sitemap.xml with all locales
- [ ] `robots.txt`
- [ ] 404 page (in both locales)
- [ ] Analytics (Vercel Analytics or Plausible — user picks)
- [ ] Lighthouse audit: all pages should be 95+ on performance, accessibility, SEO
- [ ] Test on real iOS Safari and real Android Chrome (Vercel preview URL on actual phones)

**Phase 5 is done when**: ready for the user to share the URL with someone and not be embarrassed.

---

## Phase 6 — Future, not now

Things to build LATER, after launch. Don't preemptively scaffold.

- Search (when there are 30+ posts; before that, browser Cmd+F is fine)
- Comments (probably never; if yes, GitHub Discussions integration)
- Newsletter signup (the design mocked a `<form>` for this — disable until decided)
- Pagination (when there are 100+ posts)
- Tag pages (`/[locale]/tag/learning`) — only if filter pills feel insufficient
- Related posts at the bottom of each post
- Series/multi-part post support
- Dark/light mode toggle (this is a dark-only design currently)

---

## Working with the designs

The HTML mockups in `design-references/` are visual specifications. They are **not** the production code. They have:
- Inline base64-encoded images (replace with real `<Image>` from `next/image`)
- Hardcoded text (replace with i18n strings or MDX content)
- Inline `<style>` blocks (replace with Tailwind classes)
- Mock data (replace with real MDX-driven content)

But they accurately represent: colors, fonts, spacing, hover states, layout, breakpoints. Match them precisely.

When the design says one thing and the codebase elsewhere does another (e.g., a component already exists that doesn't match the mockup), the **mockup wins** — refactor the existing component.

When the design is silent on something (e.g., what does the lang toggle do mid-form-fill?), use judgment, document the decision in a comment, and move on. Don't block on minor decisions.

---

## Definition of done (for any phase)

A phase is done when:
1. All work items checked off
2. The site deploys cleanly to Vercel
3. Both `/el` and `/en` versions of new content work
4. No console errors in dev or production
5. Mobile rendering (375px wide) doesn't visibly break
6. The user has reviewed and approved
