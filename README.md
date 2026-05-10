# portfolio-blog

My personal portfolio and blog — Greek + English.
**Live: https://turing-blog-pi.vercel.app**

The repo holds the code; the deployed site holds the content (write-ups
of projects I build, hackathon recaps, technical notes).

## Stack
- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styles:** Tailwind CSS v4
- **Content:** MDX via `next-mdx-remote`, frontmatter via `gray-matter`,
  read-time via `reading-time`
- **Code highlighting:** `shiki` + `rehype-pretty-code`
- **i18n:** `next-intl` with `[locale]` segments (`el`, `en`)
- **Validation:** `zod` for content schemas

## Content layout
- `content/posts/` — blog posts, bilingual MDX (`*.el.mdx` + `*.en.mdx`)
- `content/projects/` — project entries (same bilingual pattern)
- `content/about/` — typed about-me content (TS)
- `messages/{el,en}.json` — UI strings

`scripts/check-content.mjs` runs in `prebuild` to validate content
before deploy.

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy
Vercel, autodeployed from `main`.

## License
MIT — code. Blog and post content © Alexandros Gkiafis; please ask before reusing.
