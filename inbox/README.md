# `inbox/` — drafts to ingest

Drop a folder here when you have a new post to publish. Then ask Claude:

> ingest the new draft

(or "ingest the post from inbox/&lt;name&gt;" if there are several at once)

Claude will read your notes, write the polished MDX in **both locales**, move
images into `public/posts/&lt;slug&gt;/`, run `npm run check:content`, and move the
processed folder to `inbox/_archive/&lt;date&gt;-&lt;slug&gt;/`.

## Folder layout

```
inbox/
  graph-databases-for-fun/     ← folder name → slug (kebab-cased, leading dates stripped)
    notes.md                    ← REQUIRED — your raw thoughts in English
    instructions.md             ← optional — see below
    images/                     ← optional — any covers/inline images
      cover.jpg
      diagram.png
```

### `notes.md`

Write in **English**. Any length, any structure. Claude will polish it into a
finished post and translate to Greek for the EL version. Don't worry about
formatting — bullet points, half-sentences, and TODOs are fine. Lean into your
voice: fragments, code-mixing, wry asides. The polish should feel like *you*,
not like a press release.

If you have a specific structure or section breakdown you want preserved,
include it. Otherwise Claude will pick the structure based on what reads best.

### `instructions.md` (optional)

A free-form note about how this draft should be handled. Examples of things
worth saying here:

- `tags: learning, project` — override the auto-detected tags
- `featured: true` — make this the homepage's featured post
- `date: 2026-04-12` — backdate the post (default is today)
- `reading time: 8 min` — override the auto-estimate
- `cover: diagram.png` — pick a specific image as the cover (else no cover)
- `keep terse` — write a short post, not a long one
- `keep all the code blocks; the prose around them is just glue` — preserve
  technical content verbatim
- `don't translate the code comments`
- `english only for now` — skip Greek translation; the build's parity check
  will fail until you ask Claude to add the EL version

If there's no `instructions.md`, the defaults are: today's date, no cover,
auto-estimated reading time, auto-picked tags from the content, both locales
generated, not featured.

### `images/` (optional)

Any images you want to embed in the post or use as the cover. Claude moves
them to `public/posts/&lt;slug&gt;/` and rewrites references in the MDX so they
resolve from the published URL.

To use one as the cover, name it explicitly in `instructions.md`:
```
cover: my-screenshot.png
```
With no instruction, no cover is set and the post card uses the slug-hashed
gradient placeholder.

## After ingestion

The original folder is moved to `inbox/_archive/&lt;today&gt;-&lt;slug&gt;/` (gitignored)
so you can refer back to your raw notes if needed but the working `inbox/`
stays clean.

The new MDX files appear at:
- `content/posts/&lt;slug&gt;.en.mdx`
- `content/posts/&lt;slug&gt;.el.mdx`

Claude runs `npm run check:content` to confirm parity, then `npm run build`
to confirm nothing broke. If either fails, the failure is reported back and
the inbox folder is left in place so you can fix and re-run.

## Editing later

Once a post is in `content/posts/`, edit it directly in your editor — don't
go through `inbox/`. The inbox is only for *new* posts that need polishing
and translating.
